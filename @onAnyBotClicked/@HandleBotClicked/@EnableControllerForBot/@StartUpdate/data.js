// Set the 'lastUpdateTime' tag/mask for 'thisBot' with the current local time from the OS
setTagMask(thisBot, "lastUpdateTime", os.localTime);

// Get the current dimension from the OS (likely the environment or game dimension)
const dimension = os.getCurrentDimension();

// Get the list of bots in the current dimension that are tagged as 'true'
const collisionBots = getBots(byTag(dimension, true));

// Assign the list of bots to 'thisBot.vars.collisionBots' for later use
thisBot.vars.collisionBots = collisionBots;

// Set the update rate to 16.67 ms, which corresponds to approximately 60 updates per second
const updateRate = 16.67;

// Set up a recurring interval that will execute the provided function at the specified rate
const updateInterval = setInterval(() => {

    // Get the current local time again, as the interval will run continuously
    const currentTime = os.localTime;

    // Calculate the time difference (deltaTime) since the last update, in seconds
    const deltaTime = (currentTime - thisBot.masks.lastUpdateTime) / 1000;

    // Update the 'lastUpdateTime' tag/mask for 'thisBot' with the current time
    setTagMask(thisBot, "lastUpdateTime", currentTime);

    // Call the 'Update' method on 'thisBot' and pass in the calculated deltaTime
    thisBot.Update({ deltaTime });

}, updateRate); // Repeat this process at the 'updateRate' interval (16.67ms)

// Store the interval ID in the 'updateInterval' tag/mask for later reference
setTagMask(thisBot, "updateInterval", updateInterval);
