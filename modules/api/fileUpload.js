const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadFile(filePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
        const response = await axios.post('https://file.io/', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        return response.data.link; // This is the file URL on file.io
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

module.exports = uploadFile;
