async function AI(message, jsonData, csvData, chatSession, searchJSON, searchCSV, getAnswerFromAI) {
    if (!message.body.toLowerCase().includes("/ai ")) {
        message.reply("Please give the prompt\n`ex: /ai _your_prompt_here_`");
    } else {
        try {
            const question = message.body.substring(4).trim(); // Extract the prompt from the command

            // Check if the question can be answered using JSON or CSV data
            const predefinedAnswer = searchJSON(jsonData, question) || searchCSV(csvData, question);

            if (predefinedAnswer) {
                message.reply(`${jsonData.name || "Bot"}: ${predefinedAnswer}`);
            } else {
                const _head = "Please give response without `*, Based on the information provided,` and don't mention data is given by json or csv or kind of files.";
                const prompt = _head + question;
                const answer = await getAnswerFromAI(chatSession, prompt, jsonData, csvData);
                message.reply(`${jsonData.name || "Bot"}: ${answer}`);
            }
        } catch (e) {
            console.error(e);
            message.reply('An error occurred while processing your request.');
        }
    }
}
module.exports = AI;