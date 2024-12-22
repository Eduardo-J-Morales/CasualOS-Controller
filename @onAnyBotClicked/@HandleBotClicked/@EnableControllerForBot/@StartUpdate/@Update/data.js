const {deltaTime} = that; // Destructure deltaTime from the 'that' object

// Check if the currentControlledBot exists (i.e., there is a bot currently being controlled)
if(thisBot.vars.currentControlledBot) {
    // If a bot is currently being controlled, call the HandleMovement method and pass the deltaTime
    thisBot.HandleMovement({deltaTime});
}
