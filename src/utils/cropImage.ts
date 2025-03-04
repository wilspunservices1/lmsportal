export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        if (!url) {
            reject(new Error('Image URL is required'));
            return;
        }
        const image = new Image();
        if (!image) {
            reject(new Error('Failed to create image object'));
            return;
        }
        image.addEventListener('load', (event: Event) => resolve(image));
        image.addEventListener('error', (error: Event) => reject(error));
        image.src = url;
    });

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: any
): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
} 