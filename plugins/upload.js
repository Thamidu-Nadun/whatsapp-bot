const uploadFile = require("../modules/api/fileUpload");
const getFormattedDateTime = require("../modules/modules");
const path = require('path');
const fs = require('fs');
const os = require('os');

async function upload(message){
    if (message.hasMedia) {
        const media = await message.downloadMedia();

        // Create a unique temporary file name with current date and time
        const dateTimeString = getFormattedDateTime();
        const fileExtension = media.mimetype.split('/')[1];
        const tempFileName = `whatsapp-bot_${dateTimeString}.${fileExtension}`;
        const tempDir = os.tmpdir(); // Get the system's temporary directory
        const tempFilePath = path.join(tempDir, tempFileName);

        fs.writeFileSync(tempFilePath, media.data, 'base64');

        try {
            const fileUrl = await uploadFile(tempFilePath);
            await message.reply(`File uploaded successfully: ${fileUrl}`);
        } catch (error) {
            await message.reply('Failed to upload the file.');
        } finally {
            // Clean up the temporary file
            fs.unlinkSync(tempFilePath);
        }
    } else {
        await message.reply('Please attach a file with the /upload command.');
    }
}
module.exports = upload;