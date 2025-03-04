export async function saveCertificateDesign(designData: any) {
	try {
		const response = await fetch("/api/certificates/design", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(designData),
		});

		if (!response.ok) {
			throw new Error("Failed to save certificate design");
		}

		return await response.json();
	} catch (error) {
		console.error("Error saving certificate design:", error);
		throw error;
	}
}
