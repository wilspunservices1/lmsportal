"use client";

import { useState } from "react";
import { changeCoverImage } from "@/actions/getUser";

// _comp/coverUpload.jsx
const CustomCoverUpload = ({ userId, setCoverImage }) => {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;
        
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "cover");

            const uploadResponse = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload failed");
            }

            const uploadData = await uploadResponse.json();
            
            // Update the database
            const updateResponse = await fetch(`/api/user/${userId}/cover`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
                body: JSON.stringify({ coverImage: uploadData.imgUrl }),
            });

            if (!updateResponse.ok) {
                throw new Error("Failed to update cover image");
            }

            // Force a cache-busting URL
            const coverImageUrl = `${uploadData.imgUrl}?t=${Date.now()}`;
            setCoverImage(coverImageUrl);
            
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <label className="bg-white/80 hover:bg-white text-darkdeep px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer">
                {loading ? "Uploading..." : "Upload Cover Image"}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                />
            </label>
        </div>
    );
};

export default CustomCoverUpload;
