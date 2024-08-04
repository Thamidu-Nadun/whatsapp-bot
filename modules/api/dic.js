const axios = require('axios');

const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

async function getDictionaryData(word) {
    const URL = url + word;
    try {
        const response = await axios.get(URL);
        let data = `Your word is *${word}*\n\n`;
        let audioUrls = [];

        if (response.data[0].phonetics) {
            response.data[0].phonetics.forEach(element => {
                if (element.audio) {
                    audioUrls.push(element.audio);
                }
            });
        }

        if (response.data[0].meanings) {
            response.data[0].meanings.forEach(element => {
                data += `\n*Part of Speech*: ${element.partOfSpeech}\n`;
                element.definitions.forEach(def => {
                    data += `   *Definition*: ${def.definition}\n\n`;
                });
            });
        }

        return { data, audioUrls };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { data: 'Error fetching dictionary data or no word found.', audioUrls: [] };
    }
}

module.exports = getDictionaryData;
