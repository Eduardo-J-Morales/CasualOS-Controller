
function FilterParallelVectors(vectors) {
    const filtered = [];
    const epsilon = 1e-6; // Small threshold for considering vectors as parallel

    // Iterate through each vector in the input list
    for (let vector of vectors) {
        let isParallel = false;

        // Compare the current vector with each filtered vector to check for parallelism
        for (let filteredVector of filtered) {
            const crossProduct = vector.cross(filteredVector); // Calculate the cross product
            if (crossProduct.length() <= epsilon) {
                // If the cross product is near zero, the vectors are parallel
                isParallel = true;
                break;
            }
        }

        // If the vector is not parallel to any of the filtered vectors, add it to the filtered list
        if (!isParallel) {
            filtered.push(vector);
        }
    }

    // Return the filtered list of non-parallel vectors
    return filtered;
}
