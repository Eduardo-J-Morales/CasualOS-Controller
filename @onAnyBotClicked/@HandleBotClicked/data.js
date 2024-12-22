// Check if the 'Bot Picker' feature is enabled for this bot
if(thisBot.masks.isBotPickerEnabled) {
    
    // If the Bot Picker is enabled, toggle its state (enable/disable)
    thisBot.ToggleBotPicker();

    // Check if the current bot controlled by 'thisBot' is the same as 'that.bot' based on their ID
    if(thisBot.vars.currentControlledBot && thisBot.vars.currentControlledBot.id === that.bot.id) {
        
        // If the current controlled bot is the same as 'that.bot', disable the controller for this bot
        thisBot.DisableController();
    } else {
        
        // If the current controlled bot is not the same as 'that.bot', enable the controller for 'that'
        thisBot.EnableControllerForBot(that);
    }
}
