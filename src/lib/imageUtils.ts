/**
 * Compresses an image file to ensure it's below a certain size limit (default 5MB).
 * Returns a Base64 string of the compressed image.
 */
export async function compressImage(file: File, maxSizeMB: number = 5): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Resize logic: simple max dimension constraint to reduce initial size
                const MAX_DIMENSION = 1920;
                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Compression loop
                let quality = 0.9;
                let dataUrl = canvas.toDataURL("image/jpeg", quality);

                while (dataUrl.length / 1024 / 1024 > maxSizeMB && quality > 0.1) {
                    quality -= 0.1;
                    dataUrl = canvas.toDataURL("image/jpeg", quality);
                }

                if (dataUrl.length / 1024 / 1024 > maxSizeMB) {
                    reject(new Error(`Image is too large (${(dataUrl.length / 1024 / 1024).toFixed(2)}MB). limit is ${maxSizeMB}MB.`));
                } else {
                    resolve(dataUrl);
                }
            };

            img.onerror = (err) => reject(err);
        };

        reader.onerror = (err) => reject(err);
    });
}
