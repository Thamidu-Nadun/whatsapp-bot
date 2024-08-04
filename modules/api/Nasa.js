const axios = require('axios');
require('dotenv').config();
const { MessageMedia } = require('whatsapp-web.js'); // Adjust this import based on your actual setup

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

async function fetchNasaData() {
  try {
    const response = await axios.get(NASA_APOD_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    return null;
  }
}

async function sendNasaData(message) {
  const data = await fetchNasaData();
  if (data) {
    const caption = `\`\`\`
𝙰𝚜𝚝𝚛𝚘𝚗𝚘𝚖𝚢 𝙿𝚒𝚌𝚝𝚞𝚛𝚎 𝚘𝚏 𝚝𝚑𝚎 𝙳𝚊𝚢 (𝙰𝙿𝙾𝙳)
\`\`\`
*${data.title}*
_${data.date}_
${data.explanation}`;

    const media = await MessageMedia.fromUrl(data.url);
    const chat = await message.getChat();
    await chat.sendMessage(media, { caption });
  } else {
    console.log('No data received from NASA API.');
  }
}

module.exports = sendNasaData;
