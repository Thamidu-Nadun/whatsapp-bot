const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.DEEP_API_KEY;

// Function to generate image from text prompt using DeepAI API
async function generateImage(prompt) {
  const url = 'https://api.deepai.org/api/text2img';
  const headers = {
    'Api-Key': apiKey,
  };
  const data = {
    text: prompt,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.output_url; // URL of the generated image
  } catch (error) {
    console.error('Error generating image:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate image');
  }
}

// Example usage
// const prompt = 'A futuristic cityscape at sunset';
// generateImage(prompt).then(imageUrl => {
//   console.log('Generated Image URL:', imageUrl);
// });
module.exports = generateImage;