const getFruitData = require("../modules/api/fruit-data");
const { MessageMedia } = require('whatsapp-web.js');

// fruit data
async function fruit(message, fruit_name) {
    try {
        const { data, imageUrl } = await getFruitData(fruit_name);

        if (imageUrl) {
            const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });
            await message.reply(media, null, { caption: data });
        } else {
            await message.reply(data);
        }
    } catch (e) {
        console.error(e);
        message.reply('An error occurred while processing your request');
    }
}

module.exports = fruit;