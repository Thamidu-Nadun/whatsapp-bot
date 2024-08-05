const axios = require('axios');

const url = 'https://www.fruityvice.com/api/fruit/';

async function getFruitData(fruit_name) {
    const URL = url + fruit_name;
    try {
        const response = await axios.get(URL);
        let data = `Fruit name is *${fruit_name}*\n\n`;

        const { family, order, genus, nutritions } = response.data;

        data += `Family: ${family}\nOrder: ${order}\nGenus: ${genus}\n\nNutrition:`;

        const { calories, fat, sugar, carbohydrates, protein } = nutritions;

        data += `\n\tCalories: ${calories}\n\tFat: ${fat}\n\tSugar: ${sugar}\n\tCarbohydrates: ${carbohydrates}\n\tProtein: ${protein}\n`;

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'Error fetching fruit data or no fruit name found.';
    }
}

module.exports = getFruitData;
