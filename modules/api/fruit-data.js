const axios = require('axios');
require('dotenv').config();

const UNSPLASH_ACCESS_KEY = process.env.IMAGE_API_KEY;

const fruityviceUrl = 'https://www.fruityvice.com/api/fruit/';
const unsplashUrl = 'https://api.unsplash.com/search/photos';

async function getFruitData(fruit_name) {
    const URL = fruityviceUrl + fruit_name;
    try {
        // Fetch fruit data
        const response = await axios.get(URL);
        let data = `Fruit name is *${fruit_name}*\n\n`;

        const { family, order, genus, nutritions } = response.data;

        data += `Family: *${family}*\nOrder: *${order}*\nGenus: *${genus}*\n\n*Nutrition:*`;

        const { calories, fat, sugar, carbohydrates, protein } = nutritions;

        data += `\n\tCalories: *${calories}*\n\tFat: *${fat}*\n\tSugar: *${sugar}*\n\tCarbohydrates: *${carbohydrates}*\n\tProtein: *${protein}*\n`;

        // Fetch image from Unsplash
        const imageResponse = await axios.get(unsplashUrl, {
            params: { query: fruit_name+' fruit', per_page: 1 },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        const imageUrl = imageResponse.data.results[0]?.urls?.regular;
        if (!imageUrl) throw new Error('Image not found');

        return { data, imageUrl };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { data: 'Error fetching fruit data or no fruit name found.', imageUrl: null };
    }
}

module.exports = getFruitData;