// dictionary JS
async function dictionary(message, MessageMedia, getDictionaryData) {
    const word = message.body.split(' ')[1];
    if (word) {
        const { data, audioUrls } = await getDictionaryData(word);
        await message.reply(data);

        for (const audioUrl of audioUrls) {
            try {
                var media = await MessageMedia.fromUrl(audioUrl);
                var caption = 'Audio for your word';
                const chat = await message.getChat();
                await chat.sendMessage(media, { caption });
            } catch (error) {
                console.error('Error sending audio:', error);
            }
        }
    } else {
        message.reply('Please provide a word to look up. Usage: /dic <word>');
    }
}
module.exports = dictionary;