const getFruitData = require("../modules/api/fruit-data");

// fruit data
async function fruit(message, fruit_name) {
    try {
        const fruit_data = await getFruitData(fruit_name); // Await the async function
        message.reply(fruit_data);
    } catch (e) {
        console.error(e);
        message.reply('An error occurred while processing your request');
    }
}
module.exports = fruit;