// src/app/api/user/[userId]/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { user } from '@/db/schemas/user'
import { userDetails } from '@/db/schemas/UserDetails'
import { userSocials } from '@/db/schemas/userSocials'
import { eq } from 'drizzle-orm'

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 })
  }

  try {
    const body = await req.json()

    // Handle update of basic user details, roles, and enrolledCourses
    const updateData = {
      name: body.name !== undefined ? body.name : undefined,
      username: body.username !== undefined ? body.username : undefined,
      phone: body.phone !== undefined ? body.phone : undefined,
      email: body.email !== undefined ? body.email : undefined,
      image: body.image !== undefined ? body.image : undefined,
      roles: body.roles !== undefined ? body.roles : undefined, // Handle roles
      enrolledCourses:
        body.enrolledCourses !== undefined ? body.enrolledCourses : undefined, // Handle enrolledCourses
      isVerified: body.isVerified !== undefined ? body.isVerified : undefined,
      wishlist: body.wishlist !== undefined ? body.wishlist : undefined,
    }

    // Filter out undefined fields from updateData to prevent overwriting with undefined
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    )

    const updatedUser = await db
      .update(user)
      .set(filteredUpdateData)
      .where(eq(user.id, userId))
      .returning()

    // If there's additional data for userDetails, update or insert it
    let updatedUserDetails = null
    if (body.biography !== undefined || body.expertise !== undefined) {
      const existingDetails = await db
        .select()
        .from(userDetails)
        .where(eq(userDetails.userId, userId))
        .limit(1)

      if (existingDetails.length > 0) {
        updatedUserDetails = await db
          .update(userDetails)
          .set({
            biography:
              body.biography !== undefined
                ? body.biography
                : existingDetails[0].biography,
            expertise:
              body.expertise !== undefined
                ? body.expertise
                : existingDetails[0].expertise,
          })
          .where(eq(userDetails.userId, userId))
          .returning()
      } else {
        updatedUserDetails = await db
          .insert(userDetails)
          .values({
            userId: userId,
            biography: body.biography || 'Biography not provided.',
            expertise: body.expertise || [],
          })
          .returning()
      }
    }

    // Combine user and userDetails data for response
    const responseData = {
      message: 'User details updated successfully.',
      updatedUser: updatedUser,
      updatedUserDetails: updatedUserDetails ? updatedUserDetails : [],
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error updating user details:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating user details.' },
      { status: 500 }
    )
  }
}

// DELETE handler to delete a user by userId
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 })
  }

  try {
    // Check if the user exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    // Delete the userDetails associated with the user
    await db.delete(userDetails).where(eq(userDetails.userId, userId))

    // Delete the user
    await db.delete(user).where(eq(user.id, userId))

    return NextResponse.json({
      message: 'User deleted successfully.',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the user.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { image, newCourse, wishlist, removeFromWishlist } = body

    // Fetch current user data to avoid overwriting fields
    const existingUser = await db
      .select({
        enrolledCourses: user.enrolledCourses,
        image: user.image,
        wishlist: user.wishlist,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)
      .then((rows) => rows[0])

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    // Initialize patchData with the current user data
    let patchData = {
      image: existingUser.image,
      enrolledCourses: existingUser.enrolledCourses,
      wishlist: existingUser.wishlist,
    }

    // Update image if provided
    if (image !== undefined && image !== null) {
      patchData.image = image
    }

    // Append new course if provided
    if (newCourse !== undefined && newCourse !== null) {
      patchData.enrolledCourses = [...existingUser.enrolledCourses, newCourse]
    }

    // Handle wishlist updates (adding new items)
    if (wishlist !== undefined && wishlist !== null) {
      patchData.wishlist = [...existingUser.wishlist, ...wishlist].filter(
        (item, index, array) => array.indexOf(item) === index // Ensure unique items
      )
    }

    // Handle removal of items from the wishlist
    if (removeFromWishlist !== undefined && removeFromWishlist !== null) {
      const itemsToRemove = Array.isArray(removeFromWishlist)
        ? removeFromWishlist
        : [removeFromWishlist] // Ensure it's always an array

      patchData.wishlist = existingUser.wishlist.filter(
        (item) => !itemsToRemove.includes(item)
      )
    }

    // Only update fields if they are actually changed
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(patchData).filter(
        ([key, value]) => value !== undefined && value !== null
      )
    )

    if (Object.keys(fieldsToUpdate).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update.' },
        { status: 400 }
      )
    }

    // Update user in the database
    const updatedUser = await db
      .update(user)
      .set(fieldsToUpdate)
      .where(eq(user.id, userId))
      .returning()

    return NextResponse.json({
      message: 'User details updated successfully.',
      updatedUser,
    })
  } catch (error) {
    console.error('Error updating user details:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating user details.' },
      { status: 500 }
    )
  }
}

interface EnrolledCourse {
  courseId: string
  progress: number
  finalExamStatus?: Boolean
  completedLectures: string[]
}

interface Course {
  id: string
  title: string
  // Add other relevant fields
}

interface Socials {
  facebook: string
  twitter: string
  linkedin: string
  website: string
  github: string
}

interface UserResponse {
  id: string
  name: string
  username: string
  phone: string
  email: string
  image: string
  roles: string[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
  biography: string
  expertise: string[]
  registrationDate: string
  socials: Socials
  enrolledCourses: EnrolledCourse[];
  wishlist: Course[]
}
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  // Validate that userId is provided
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 })
  }

  try {
    // Parse the query parameters (for logging only)
    const url = new URL(req.url)
    console.log(`Fetching data for userId: ${userId}`)
    console.log(`Query string: ${url.search}`)

    // 1. Fetch main user data (including JSON fields) from the user table
    const [mainUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    if (!mainUser) {
      console.warn(`User with ID ${userId} not found.`)
      return NextResponse.json(
        { error: 'User with the given ID was not found.' },
        { status: 404 }
      )
    }

    // Log the raw enrolledCourses field
    console.log('Raw enrolledCourses field:', mainUser.enrolledCourses)

    // 2. Fetch additional details and socials separately
    const [details] = await db
      .select()
      .from(userDetails)
      .where(eq(userDetails.userId, userId))
      .limit(1)

    const [socialsData] = await db
      .select()
      .from(userSocials)
      .where(eq(userSocials.userId, userId))
      .limit(1)

    // Process expertise
    const expertiseProcessed: string[] =
      details &&
      Array.isArray(details.expertise) &&
      details.expertise.length > 0
        ? details.expertise
        : ['No expertise provided.']

    // Process enrolledCourses: always process if the field exists
    let enrolledCoursesProcessed: EnrolledCourse[] = []
    if (mainUser.enrolledCourses) {
      try {
        const normalized = JSON.parse(JSON.stringify(mainUser.enrolledCourses))
        if (Array.isArray(normalized)) {
          enrolledCoursesProcessed = normalized
        } else {
          console.warn(
            'Normalized enrolledCourses is not an array:',
            normalized
          )
        }
      } catch (error) {
        console.error('Error processing enrolledCourses:', error)
      }
    }

    // Process wishlist similarly
    let wishlistProcessed: Course[] = []
    if (mainUser.wishlist) {
      try {
        const normalizedWishlist = JSON.parse(JSON.stringify(mainUser.wishlist))
        if (Array.isArray(normalizedWishlist)) {
          wishlistProcessed = normalizedWishlist
        } else {
          console.warn(
            'Normalized wishlist is not an array:',
            normalizedWishlist
          )
        }
      } catch (error) {
        console.error('Error processing wishlist:', error)
      }
    }

    // Structure the socials data with default values
    const socials: Socials = {
      facebook: (socialsData && socialsData.facebook) || '',
      twitter: (socialsData && socialsData.twitter) || '',
      linkedin: (socialsData && socialsData.linkedin) || '',
      website: (socialsData && socialsData.website) || '',
      github: (socialsData && socialsData.github) || '',
    }

    // Construct the final response object
    const response: UserResponse = {
      id: mainUser.id,
      name: mainUser.name,
      username: mainUser.username,
      phone: mainUser.phone,
      email: mainUser.email,
      image: mainUser.image || '/user.png',
      roles:
        Array.isArray(mainUser.roles) && mainUser.roles.length > 0
          ? mainUser.roles
          : ['user'],
      isVerified: mainUser.isVerified ?? false,
      createdAt: mainUser.createdAt,
      updatedAt: mainUser.updatedAt,
      biography:
        details && details.biography
          ? details.biography
          : 'Biography not provided.',
      expertise: expertiseProcessed,
      registrationDate:
        details && details.registrationDate
          ? details.registrationDate
          : 'Date not provided',
      socials,
      enrolledCourses: enrolledCoursesProcessed,
      wishlist: wishlistProcessed,
    }

    console.log('API Response:', response)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching user details:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching user details.' },
      { status: 500 }
    )
  }
}
