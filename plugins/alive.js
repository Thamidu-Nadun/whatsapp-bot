const fs = require('fs');
const path = require('path');

// Global variable to keep track of the state
let shouldSendOneImage = true;

// Function to get a random index from an array
function getRandomIndex(array) {
    if (array.length === 0) {
        throw new Error("Array is empty");
    }
    return Math.floor(Math.random() * array.length);
}

const images = ['img-1.jpeg', 'img-2.jpeg', 'img-3.jpeg', 'img-4.jpeg'];

async function alive(message, client, header, MessageMedia) {
    try {
        // Randomly decide whether to send one or two images
        if (shouldSendOneImage) {
            // Send one image
            const randomIndex = getRandomIndex(images);
            const image = images[randomIndex];
            const imagePath = path.join('./assets', image);

            // Ensure the file exists before sending
            if (!fs.existsSync(imagePath)) {
                throw new Error(`Image file does not exist: ${imagePath}`);
            }

            // Reply and send the image
            await message.reply('Hey, I\'m alive.');
            const media = MessageMedia.fromFilePath(imagePath);
            await client.sendMessage(message.from, media, {
                caption: header
            });

            // Change the state to send two images next time
            shouldSendOneImage = false;
        } else {
            // Send two images
            const imageIndices = [];
            while (imageIndices.length < 2) {
                const index = getRandomIndex(images);
                if (!imageIndices.includes(index)) {
                    imageIndices.push(index);
                }
            }

            // Ensure all files exist before sending
            for (const index of imageIndices) {
                const imagePath = path.join('./assets', images[index]);
                if (!fs.existsSync(imagePath)) {
                    throw new Error(`Image file does not exist: ${imagePath}`);
                }
            }

            // Reply and send the images
            await message.reply('Hey, I\'m alive.');
            for (const index of imageIndices) {
                const imagePath = path.join('./assets', images[index]);
                const media = MessageMedia.fromFilePath(imagePath);
                await client.sendMessage(message.from, media, {
                    caption: header
                });
            }

            // Change the state to send one image next time
            shouldSendOneImage = true;
        }
    } catch (error) {
        console.error('Error in alive function:', error);
    }
}

module.exports = alive;
