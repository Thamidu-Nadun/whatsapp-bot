const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const csv = require('csv-parser');
const axios = require('axios');
const fs = require('fs');
const os = require('os');
require('dotenv').config();
const { readJSONFile, readCSVFile, searchCSV, searchJSON, getAnswerFromAI, createChatSession } = require('./modules/api/gemini');
const sendImageUrlsAsMessage = require('./modules/request-images');
const { Mode, UserName, appName, ImageLimit } = require('./inc/config');
const alive = require('./plugins/alive');
const downloadFile = require('./plugins/downloadFile');
const downloadImages = require('./plugins/downloadImages');
const sendNasaData = require('./modules/api/Nasa');
const generateImage = require('./modules/api/imgAi');
const getDictionaryData = require('./modules/api/dic');
const AI = require('./plugins/ai');
const dictionary = require('./plugins/dictionary');
const upload = require('./plugins/upload');
const fruit = require('./plugins/fruit');

// Configure app data
const app_data = {
    "Name": appName,
    "version": '1.0.0',
    "plugins": 8,
    "developer": {
        "name": "Thamidu-Nadun",
        "contact": "linkedin.com/@nadun"
    },
    "image-limit": ImageLimit
}
const jsonData = readJSONFile('./data/bot.json');
const csvData = readCSVFile('./data/bot.csv');
const totalMemory = os.totalmem();
const bytesToGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2);
const osType = os.type();
function executionTime(start_time) {
    var end = Date.now();
    var executionTime = end - start_time;
    var minutes = Math.floor(executionTime / 60000);
    var seconds = ((executionTime % 60000) / 1000).toFixed(3);
    return `${minutes} min ${seconds}`;
}

// Configure env data
const HOSTNAME = process.env.HOST_NAME;
const USERNAME = UserName;
const MODE = Mode;
const header = `
━━━〔${HOSTNAME}〕━━━┈⊷
┃✵╭──────────────
┃✵│ Owner : ${HOSTNAME}
┃✵│ User : ${USERNAME}
┃✵│ Plugins : ${app_data.plugins}
┃✵│ Runtime : Online😎
┃✵│ Mode : ${MODE}
┃✵│ Platform : ${osType}
┃✵│ Ram : ${bytesToGB(totalMemory)} GB
┃✵│ Version : ${app_data.version}
┃✵╰──────────────
╰━━━━━━━━━━━━━━━┈⊷`;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Listening to all incoming messages
client.on('message_create', message => {
    console.log(message.body);
});

client.on('message_create', async message => {
    const chatSession = createChatSession();
    if (message.body === 'alive') {
        try {
            await alive(message, client, header, MessageMedia);
        } catch (e) {
            console.log(e);
        }
    } else if (message.body.toLowerCase().includes("/download")) {
        try {
            downloadFile(message, MessageMedia);
        } catch (e) {
            console.log(e);
        }
    } else if (message.body.startsWith('/ai')) {
        try {
            AI(message, jsonData, csvData, chatSession, searchJSON, searchCSV, getAnswerFromAI);
        }catch(e){
            console.log(e);
        }
    } else if (message.body.toLowerCase().includes("/img")) {
        try {
            downloadImages(message, client, sendImageUrlsAsMessage, app_data);
        } catch (e) {
            console.log(e);
        }
    } else if (message.body.toLowerCase().includes("/nasa")) {
        try {
            await sendNasaData(message);
        } catch (e) {
            console.error('Error sending NASA data:', e);
        }
    } else if (message.body.startsWith('/Gen')) {
        const prompt = message.body.substring(5).trim();

        if (!prompt) {
            message.reply('Please provide a prompt. Example: /Gen A futuristic cityscape at sunset');
        }

        try {
            const imageUrl = await generateImage(prompt);
            const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });
            client.sendMessage(message.from, media);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while processing your request.');
        }
    } else if (message.body.startsWith('/dic ')) {
        try {
            dictionary(message, MessageMedia, getDictionaryData);
        } catch (error) {
            console.log(error);
        }
    } else if (message.body.startsWith('/upload')) {
        try {
            upload(message);
        } catch (error) {
            console.log(error);
        }
    }else if (message.body.startsWith('/fruit')){
        if (message.body.startsWith('/fruit ')){
            try {
                const fruit_name = message.body.substring(7).trim();
                await fruit(message,fruit_name);
            } catch (e) {
                console.log(e);
                message.reply('An error occurred while processing your request');
            }

        }else{
            message.reply('Enter fruit name\nex:\n\t/fruit apple\n')
        }
    }
});

client.initialize();
