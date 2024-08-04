const { Client, MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const IMAGE_API_KEY = process.env.IMAGE_API_KEY;

// const UNSPLASH_API_KEY = 'IV1oMunsUff0vfH4bhmjs-6dw758rnTH4FJYaBtkFWE'; // Replace with your Unsplash API key
const UNSPLASH_API_KEY = IMAGE_API_KEY; // Replace with your Unsplash API key

async function fetchUnsplashImages(searchQuery, perPage = 10) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${perPage}&client_id=${UNSPLASH_API_KEY}`;
    const response = await axios.get(url);
    return response.data;
}

function extractHighResolutionImageUrls(data) {
    const imageUrls = data.results.map(image => image.urls.regular); // 'regular' is usually high-quality (around 1080p)
    return imageUrls;
}

async function sendImageUrlsAsMessage(client, message, searchQuery, limit) {
    try {
        const data = await fetchUnsplashImages(searchQuery, limit);
        const imageUrls = extractHighResolutionImageUrls(data);

        const chat = await message.getChat();

        const limitImageUrls = imageUrls.slice(0, limit);
        const mediaPromises = limitImageUrls.map(async imageUrl => {
            const media = await MessageMedia.fromUrl(imageUrl, {
                unsafeMime: true // Set unsafeMime option to handle MIME type errors
            });
            return media;
        });

        const mediaArray = await Promise.all(mediaPromises);

        for (const media of mediaArray) {
            await chat.sendMessage(media);
        }
    } catch (error) {
        console.error("Error sending image URLs:", error);
    }
}

module.exports = sendImageUrlsAsMessage;
