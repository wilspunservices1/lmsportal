  // src/app/actions/fetchUserDetailsFromApi.ts
export async function fetchUserDetailsFromApi(userId: string) {
  try {
      // Use the specific cover endpoint to ensure we get fresh data
      const [userResponse, coverResponse] = await Promise.all([
          fetch(`/api/user/${userId}`, {
              method: "GET",
              cache: 'no-store',
              headers: {
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache'
              }
          }),
          fetch(`/api/user/${userId}/cover`, {
              method: "GET",
              cache: 'no-store',
              headers: {
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache'
              }
          })
      ]);

      const userData = await userResponse.json();
      const coverData = await coverResponse.json();

      return {
          ...userData,
          coverImage: coverData.coverImage
      };
  } catch (error) {
      console.error("Error in fetchUserDetailsFromApi:", error);
      throw error;
  }
}


  export async function changeProfileImage(userId: string, image: string) {
    try {
      if (userId && image) {
        const res = await fetch(`/api/user/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        return data;
      }

      return null;
    } catch (error) {
      console.error("Error in changeProfileImage:", error);
      throw error;
    }
  }

 // In your actions/getUser.ts
 export async function changeCoverImage(userId: string, imageUrl: string) {
  try {
      const response = await fetch(`/api/user/${userId}/cover`, {
          method: 'PUT',
          headers: { 
              'Content-Type': 'application/json',
              // Add cache control headers
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
          },
          body: JSON.stringify({ coverImage: imageUrl }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update cover image');
      }

      const data = await response.json();
      
      // Log successful response
      console.log('Cover image update response:', data);
      
      return data;
  } catch (error) {
      console.error('Error updating cover:', error);
      throw error;
  }
}
