function GetNormalsByVertices(vertices) {
    // Iterate over all the faces in 'botFacesByVertices' and calculate their normal vectors
    const normals = Object.values(botFacesByVertices).map((faceByVertices) => {
        // Get the vertices of the current face
        const vertice1 = vertices[faceByVertices[0]];
        const vertice2 = vertices[faceByVertices[1]];
        const vertice3 = vertices[faceByVertices[2]];

        // Calculate two vectors from the vertices
        const vector1 = vertice2.subtract(vertice1); // Vector from vertice1 to vertice2
        const vector2 = vertice3.subtract(vertice1); // Vector from vertice1 to vertice3

        // Compute the cross product of the two vectors to get the normal vector
        const normal = vector1.cross(vector2).normalize();

        // Return the normalized normal vector for the face
        return normal;
    });

    // Return the list of normal vectors
    return normals;
}
