import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schemas/user';
import { eq } from 'drizzle-orm';

export async function PUT(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;
        const { coverImage } = await request.json();

        if (!userId || !coverImage) {
            return NextResponse.json(
                { error: 'Missing userId or coverImage' },
                { status: 400 }
            );
        }

        // First verify the user exists
        const existingUser = await db
            .select()
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        if (!existingUser.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update database with new cover image
        const [updatedUser] = await db
            .update(user)
            .set({
                coverImage,
                updatedAt: new Date()
            })
            .where(eq(user.id, userId))
            .returning({
                id: user.id,
                coverImage: user.coverImage,
                updatedAt: user.updatedAt
            });

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'Update failed' },
                { status: 500 }
            );
        }

        // Log successful update
        console.log('Successfully updated cover image:', {
            userId,
            coverImage: updatedUser.coverImage
        });

        // Return success response
        return NextResponse.json({
            success: true,
            data: updatedUser
        });

    } catch (error) {
        console.error('Error updating cover:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

// Add GET method to verify the cover image
export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;

        const userData = await db
            .select({
                id: user.id,
                coverImage: user.coverImage
            })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        if (!userData.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(userData[0]);

    } catch (error) {
        console.error('Error fetching cover:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
