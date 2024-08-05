// linkRemover.js
async function removeLinks(message, client) {
    // Example group names to target
    const targetGroupNames = ['Test_group', 'NadSoft Education'];

    const allowedNumbers = [
        '94701370247@c.us'
    ];

    // Get all chats and filter out the target groups
    const chats = await client.getChats();
    const targetGroups = chats.filter(chat => chat.isGroup && targetGroupNames.includes(chat.name));

    // Get the IDs of the target groups
    const targetGroupIds = targetGroups.map(group => group.id._serialized);

    // Check if the message is in one of the target groups
    if (targetGroupIds.includes(message.from)) {
        // Check if the message contains a link and is not sent by the bot
        if ((message.body.includes('http://') || message.body.includes('https://')) && !message.fromMe) {
            try {
                // Debug logging
                console.log(`Message from: ${message.from}`);
                console.log(`Allowed numbers: ${allowedNumbers.join(', ')}`);

                // Check if the sender is allowed
                if (!allowedNumbers.includes(message.from)) {
                    // Delete the message
                    await message.delete(true);
                    console.log(`Deleted message from ${message.author || message.from}`);

                    // Send a notification message
                    const chat = await message.getChat();
                    const contact = await message.getContact();
                    const userName = contact.pushname || 'User';
                    const notificationMessage = `${userName}, you are not permitted to send links in this group.`;

                    await chat.sendMessage(notificationMessage);
                    console.log(`Sent notification to ${userName}`);
                } else {
                    console.log(`Message from ${message.from} is allowed.`);
                }
            } catch (error) {
                console.error(`Failed to delete message or send notification: ${error}`);
            }
        }
    }
}
module.exports = removeLinks;
