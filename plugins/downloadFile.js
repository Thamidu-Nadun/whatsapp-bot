async function downloadFile(message, MessageMedia) {
    if (message.body.toLowerCase().includes("/download ")) {
        //  var url = "/download http://hello.com/images/hello.zip";
        try {
            var data = message.body.split('/download ');;
            const downloadUrl = data[1];
            const media = await MessageMedia.fromUrl(downloadUrl);
            await message.reply(media);
        } catch (e) {
            console.log(e);
            message.reply('Something went wrong while downloading your file or URL is invalid');
        }
    } else {
        message.reply("Please give the correct format\nEX:\t/download http://example.com/images/hello.zip")
    }
}

module.exports = downloadFile;