function GetBotVertices(limits) {
    // Define the 8 vertices of a box-like shape based on its limits (min/max values)
    let vertices = [
        new Vector3(limits.x.max, limits.y.max, limits.z.min), // Top-front-right
        new Vector3(limits.x.max, limits.y.min, limits.z.min), // Bottom-front-right
        new Vector3(limits.x.min, limits.y.min, limits.z.min), // Bottom-front-left
        new Vector3(limits.x.min, limits.y.max, limits.z.min), // Top-front-left
        new Vector3(limits.x.max, limits.y.max, limits.z.max), // Top-back-right
        new Vector3(limits.x.max, limits.y.min, limits.z.max), // Bottom-back-right
        new Vector3(limits.x.min, limits.y.min, limits.z.max), // Bottom-back-left
        new Vector3(limits.x.min, limits.y.max, limits.z.max)  // Top-back-left
    ]
    return vertices; // Return the array of 8 vertices
}
