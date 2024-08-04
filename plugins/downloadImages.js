async function downloadImages(message, client, sendImageUrlsAsMessage, app_data){
    if(message.body.toLowerCase().includes("/img ")){
        try{
            var data = message.body.split('/img ');;
            const downloadKeyword = data[1];
            await sendImageUrlsAsMessage(client, message, downloadKeyword, app_data['image-limit']);
        }catch(error){
            console.log(error);
        }
        finally{
            console.log('Image has been sent.');
        }
    }else{
        message.reply("Please give the correct format\nEX:\t/img cat\nCat is a keyword, replace your keyword here.")
    }
}

module.exports = downloadImages;