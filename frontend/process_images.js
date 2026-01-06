const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets');
const images = [
    'hero_fashion_white.png',
    'hero_mens_white.png',
    'hero_kids_white.png',
    'hero_shoes_white.png',
    'hero_watch_white.png'
];

async function processImages() {
    for (const file of images) {
        const inputPath = path.join(assetsDir, file);
        const tempPath = path.join(assetsDir, `temp_${file}`);

        try {
            if (!fs.existsSync(inputPath)) {
                console.log(`Skipping ${file}: File not found`);
                continue;
            }

            console.log(`Processing ${file}...`);

            // Create a mask for white pixels
            // We assume white is > 240 in all channels to be safe/approximate
            await sharp(inputPath)
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true })
                .then(async ({ data, info }) => {
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        // If pixel is very light (white-ish), make it transparent
                        if (r > 240 && g > 240 && b > 240) {
                            data[i + 3] = 0; // Alpha to 0
                        }
                    }

                    await sharp(data, {
                        raw: {
                            width: info.width,
                            height: info.height,
                            channels: 4
                        }
                    })
                        .png()
                        .toFile(tempPath);

                    // Replace original file
                    fs.copyFileSync(tempPath, inputPath);
                    fs.unlinkSync(tempPath);
                    console.log(`Finished ${file}`);
                });

        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
}

processImages();
