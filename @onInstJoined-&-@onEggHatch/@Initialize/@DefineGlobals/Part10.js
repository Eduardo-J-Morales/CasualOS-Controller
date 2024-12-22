function GetNormalByFace(face, vertices) {
    // Get the vertices of the given face based on the botFacesByVertices object
    const vertice1 = vertices[botFacesByVertices[face][0]];
    const vertice2 = vertices[botFacesByVertices[face][1]];
    const vertice3 = vertices[botFacesByVertices[face][2]];

    // Calculate two vectors from the vertices
    const vector1 = vertice2.subtract(vertice1);
    const vector2 = vertice3.subtract(vertice1);

    // Compute the normal of the face by taking the cross product of the vectors
    const normal = vector1.cross(vector2).normalize();
    return normal; // Return the normalized normal vector
}
