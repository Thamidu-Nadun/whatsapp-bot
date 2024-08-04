const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Google Generative AI client
const apiKey = GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to read JSON files
function readJSONFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file: ${error.message}`);
    throw error;
  }
}

// Function to read CSV files
function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => {
        console.error(`Error reading CSV file: ${error.message}`);
        reject(error);
      });
  });
}

// Function to search for an answer in JSON data
function searchJSON(jsonData, question) {
  const lowerCaseQuestion = question.toLowerCase();
  for (const key in jsonData) {
    if (lowerCaseQuestion.includes(key.toLowerCase())) {
      return jsonData[key];
    }
  }
  return null;
}

// Function to search for an answer in CSV data
function searchCSV(csvData, question) {
  const lowerCaseQuestion = question.toLowerCase();
  if (Array.isArray(csvData)) {
    for (const row of csvData) {
      for (const key in row) {
        if (lowerCaseQuestion.includes(key.toLowerCase())) {
          return row[key];
        }
      }
    }
  }
  return null;
}

// Function to interact with Gemini AI and get an answer
async function getAnswerFromAI(chatSession, question, jsonData, csvData) {
  let answer = searchJSON(jsonData, question) || searchCSV(csvData, question);

  if (!answer) {
    // Fall back to AI if question doesn't match known patterns
    const inputData = `${question}\n\nJSON Data:\n${JSON.stringify(jsonData)}\n\nCSV Data:\n${JSON.stringify(csvData)}`;
    try {
      const result = await chatSession.sendMessage(inputData);
      answer = result.response.text();
    } catch (error) {
      console.error(`Error getting answer from AI: ${error.message}`);
      throw error;
    }
  }

  return answer;
}

// Function to create a chat session with Gemini AI
function createChatSession() {
  return model.startChat({
    generationConfig,
    history: [],
  });
}

// Export the functions for use in other files
module.exports = {
  readJSONFile,
  readCSVFile,
  searchCSV,
  searchJSON,
  getAnswerFromAI,
  createChatSession,
};
