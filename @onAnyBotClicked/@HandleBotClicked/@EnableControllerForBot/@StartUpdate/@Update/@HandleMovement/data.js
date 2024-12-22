// Extracting deltaTime (time difference between frames) from "that" object
const {deltaTime} = that; 

// Get the current dimension of the environment (e.g., 2D or 3D space)
const dimension = os.getCurrentDimension(); 

// Define a threshold for Z-axis (typically for detecting the ground or surface)
const thresholdZ = 0; 

// Define the gravity scale (how strong gravity should be for this bot)
const gravityScale = 2; 

// Constant for gravity acceleration (9.8 m/s^2)
const gravity = 9.8; 

// Apply gravity scale to get the final gravity value
const scaledGravity = gravity * gravityScale; 

// Get the bot currently being controlled by the player
const character = thisBot.vars.currentControlledBot; 

// Get the position of the controlled bot in the current dimension (space)
const characterPosition = getBotPosition(character, dimension); 

// Define a default "zero rotation" (no rotation)
const rotationZero = new Rotation({euler: {x: 0, y: 0, z: 0}}); 

// Call GetMovement() to get movement details including input direction, slope, gravity, etc.
const {movement, inputRotation, newVerticalVelocity, slopeRotation, inputDirectionRotated, isSloped} = await GetMovement({
    moveSpeed: thisBot.tags.moveSpeed, 
    characterPosition: characterPosition, 
    isJumping: character.masks.isJumping
});

// Try to move the character based on the calculated movement
TryMoveCharacter({movement, characterPosition: characterPosition, thresholdZ, newVerticalVelocity});

// If there's any movement direction, update the character's rotation
if(inputDirectionRotated.length() > 0) SetCharacterRotation({isSloped, inputRotation, slopeRotation});

// Function to set the character's rotation based on movement and slope
function SetCharacterRotation(params) {
    const {isSloped, inputRotation, slopeRotation} = params;
    
    // Define the rotation speed factor
    const rotationSpeed = 10; 
    
    // Get the current rotation of the character, or default to zero rotation if not set
    const currentCharacterRotation = character.masks[`${dimension}Rotation`] ?? rotationZero; 
    
    let desiredCharacterRotation;
    
    // If the character is on a slope, combine input rotation with slope rotation
    if (isSloped) {
        desiredCharacterRotation = inputRotation.combineWith(slopeRotation);
    } else {
        desiredCharacterRotation = inputRotation; // Otherwise, use only input rotation
    }
    
    // Ensure the desired rotation doesn't "flip" across hemispheres
    desiredCharacterRotation = FixQuaternionHemisphere(currentCharacterRotation, desiredCharacterRotation);
    
    // Interpolate smoothly between current and desired rotation
    const interpolatedRotation = Rotation.interpolate(currentCharacterRotation, desiredCharacterRotation, deltaTime * rotationSpeed);
    
    // Set the character's rotation using the interpolated value
    setTagMask(character, `${dimension}Rotation`, interpolatedRotation);
}

// Function to try moving the character based on the calculated movement
function TryMoveCharacter(params) {
    const {movement, characterPosition, thresholdZ, newVerticalVelocity} = params;
    
    // Calculate the new position based on movement
    const newPosition = new Vector3(
        parseFloat((characterPosition.x + movement.x).toFixed(3)), 
        parseFloat((characterPosition.y + movement.y).toFixed(3)), 
        parseFloat(((movement.z + characterPosition.z) > thresholdZ ? (movement.z + characterPosition.z) : thresholdZ).toFixed(3)) // Apply threshold for vertical movement
    );
    
    // Check if the character is grounded (not falling through the floor)
    const isGrounded = (movement.z + characterPosition.z) <= thresholdZ;
    
    // Get collision results for X, Y, and Z axes
    const collisions = GetCollisions({currentPosition: characterPosition, newPosition, character});
    
    // If no collision along X-axis, update X position
    if (!collisions.x) setTagMask(character, dimension + "X", newPosition.x);
    
    // If no collision along Y-axis, update Y position
    if (!collisions.y) setTagMask(character, dimension + "Y", newPosition.y);
    
    // If no collision along Z-axis and not grounded, update Z position and vertical velocity
    if (!collisions.z && !isGrounded) {
        setTagMask(character, dimension + "Z", newPosition.z);
        setTagMask(character, "verticalVelocity", newVerticalVelocity);
    } else {
        // If colliding, stop vertical movement and set isJumping to false
        setTagMask(character, "verticalVelocity", 0);
        setTagMask(character, "isJumping", false);
    }
    
    // Set whether the character is grounded or not
    setTagMask(character, "isGrounded", isGrounded);
}

// Function to check for collisions along X, Y, and Z axes
function GetCollisions(params) {
    const {currentPosition, newPosition} = params;
    
    // Detect collisions along X, Y, and Z axes
    const x = thisBot.DetectCollisions({character, position: new Vector3(newPosition.x, currentPosition.y, currentPosition.z)});
    const y = thisBot.DetectCollisions({character, position: new Vector3(currentPosition.x, newPosition.y, currentPosition.z)});
    const z = thisBot.DetectCollisions({character, position: new Vector3(currentPosition.x, currentPosition.y, newPosition.z)});
    
    // Return collision results for each axis
    return {x, y, z};
}

// Function to get the movement parameters based on input, gravity, slope, etc.
async function GetMovement(params) {
    const {moveSpeed, characterPosition, isJumping} = params;
    
    // Get normalized input direction (e.g., WASD or arrow keys)
    const normalizedInputDirection = thisBot.GetNormalizedInputDirection();
    
    // Get the camera's current rotation
    const cameraRotation = os.getCameraRotation();
    
    // Calculate move distance based on speed and deltaTime (frame time)
    const moveDistance = moveSpeed * deltaTime;
    
    // Fix the camera's rotation around the Z-axis to adjust for user input
    const fixedCameraRotation = new Rotation({
        axis: new Vector3(0, 0, 1),
        angle: cameraRotation.z
    });
    
    // Rotate the input direction based on the camera's rotation
    let inputDirectionRotated = fixedCameraRotation.rotateVector3(normalizedInputDirection);
    
    // Create a rotation object for the input direction
    const inputRotation = new Rotation({
        direction: inputDirectionRotated,
        upwards: new Vector3(0, 0, 1),
        errorHandling: "nudge"
    });
    
    // Raycast to detect if the bot is on a slope
    let {raycastResult, isSloped} = await IsSloped(characterPosition);
    
    // If on a slope and not jumping, set vertical movement factor to zero (stop vertical movement)
    let {verticalMovementFactor, newVerticalVelocity} = isSloped && !isJumping ? {verticalMovementFactor: 0, newVerticalVelocity: 0} : ApplyGravity(character);
    
    // Prepare vertical movement vector
    let movementZ = new Vector3(0, 0, verticalMovementFactor);
    
    let slopeRotation;
    
    // If the bot is on a slope, adjust the movement direction to match the slope's angle
    if (isSloped) {
        const slopeNormal = GetBotSlopeNormal({bot: raycastResult.botIntersections[0].bot, raycastResult});
        
        // Create a rotation object for the slope's normal
        slopeRotation = new Rotation({
            from: VectorUp,
            to: slopeNormal
        });
        
        // Rotate the input direction to match the slope
        inputDirectionRotated = slopeRotation.rotateVector3(inputDirectionRotated);
    }
    
    // Calculate the final movement vector based on the input direction and vertical movement
    let movement = inputDirectionRotated.multiplyScalar(moveDistance).add(movementZ);
    
    // Return the movement parameters including input rotation, vertical velocity, and slope info
    return {movement, inputRotation, newVerticalVelocity, slopeRotation, inputDirectionRotated, isSloped};
}

// Function to apply gravity to the bot
function ApplyGravity(bot) {
    // Calculate new vertical velocity based on gravity
    const newVerticalVelocity = (bot.masks.verticalVelocity ?? 0) - (scaledGravity * deltaTime);
    
    // Calculate vertical movement factor (how much the bot moves vertically)
    const verticalMovementFactor = (newVerticalVelocity * deltaTime);
    
    return {verticalMovementFactor, newVerticalVelocity};
}

// Function to check if the bot is on a slope
async function IsSloped(position) {
    // Maximum slope angle (in radians) to consider as a valid slope
    const maxSlopeAngle = 0.79; 

    // Perform a raycast from the current position, slightly lifted along the Z-axis, to detect the ground below
    const raycastResult = await os.raycast("grid", position.add(new Vector3(0, 0, 0.1)), new Vector3(0, 0, -1));

    // If the raycast hits something (i.e., there's an intersection with the ground)
    if (raycastResult.botIntersections.length > 0) {
        
        // Get the normal of the surface the bot is intersecting with
        const normal = GetBotSlopeNormal({bot: raycastResult.botIntersections[0].bot, raycastResult});
        
        // Calculate the angle between the up vector (0, 0, 1) and the normal of the surface
        const angle = Vector3.angleBetween(new Vector3(0, 0, 1), normal);

        // Return whether the slope is valid (within threshold distance and angle)
        return {
            raycastResult,
            isSloped: raycastResult.botIntersections[0].distance < 0.3 && angle < maxSlopeAngle && angle !== 0
        };
    }

    // If no intersection found, return that the surface is not sloped
    return { raycastResult, isSloped: false };
}

// Function to get the normal of the surface the bot is on
function GetBotSlopeNormal(params) {
    const {bot, raycastResult} = params;
    
    // Get the bot's scale (size) for bounding box calculation
    const scales = GetBotScales(bot);

    // Get the position of the bot in the current dimension (space)
    const position = getBotPosition(bot, dimension);

    // Get the limits of the bot's bounding box based on its scale and position
    const limits = GetBotLimits(position, scales);

    // Get the bot's rotation in the current dimension (space)
    const rotation = new Rotation({euler: GetBotRotations(bot, dimension)});

    // Get the vertices of the bot's bounding box using the limits
    const vertices = GetBotVertices(limits);

    // Localize the vertices by subtracting the bot's position from each vertex
    const localizedVertices = vertices.map((vertice) => { return vertice.subtract(position) });

    // Rotate the localized vertices based on the bot's rotation
    const rotatedVertices = localizedVertices.map((localizedVertice) => {
        const rotatedVertice = rotation.rotateVector3(localizedVertice).add(position);
        return rotatedVertice;
    });

    // Get the normal vector for the face the bot is interacting with using raycast results
    const normal = GetNormalByFace(raycastResult.botIntersections[0].face, rotatedVertices);

    // Return the calculated normal
    return normal;
}
