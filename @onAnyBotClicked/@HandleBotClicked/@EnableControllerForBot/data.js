// Destructure 'bot' from 'that' (i.e., assign 'bot' from the 'that' object)
const {bot} = that;

// If there is no currently controlled bot, start the update process for 'thisBot'
if(!thisBot.vars.currentControlledBot) thisBot.StartUpdate();

// Set the current controlled bot to the 'bot' from 'that', meaning 'thisBot' is now controlling this new bot
thisBot.vars.currentControlledBot = bot;
