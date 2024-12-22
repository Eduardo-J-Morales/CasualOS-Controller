function GetProjectedPoints(axis, vertices) {
    // Project the first vertex onto the axis to initialize min and max points
    let minPoint = axis.dot(vertices[0]);
    let maxPoint = minPoint;

    // Iterate through the remaining vertices to compute their projections and update min/max
    for (let i = 1; i < vertices.length; i++) {
        let dot = axis.dot(vertices[i]); // Dot product of axis and vertex
        minPoint = Math.min(minPoint, dot); // Update minPoint if the current projection is smaller
        maxPoint = Math.max(maxPoint, dot); // Update maxPoint if the current projection is larger
    }

    // Return the calculated min and max projections on the axis
    return { minPoint, maxPoint };
}
