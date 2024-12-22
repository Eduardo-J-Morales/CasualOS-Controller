@DisableController

// Stop the update process for the current bot (thisBot)
thisBot.StopUpdate();

// Set the current controlled bot to null, indicating that no bot is being controlled by 'thisBot'
thisBot.vars.currentControlledBot = null;
