// Check if 'thisBot.masks.updateInterval' exists (i.e., there is an active interval)
if(thisBot.masks.updateInterval) {
    
    // If an interval is active, clear it to stop the recurring action
    clearInterval(thisBot.masks.updateInterval);

    // Remove or reset the 'updateInterval' tag/mask from 'thisBot'
    setTagMask(thisBot, "updateInterval", null);
}
