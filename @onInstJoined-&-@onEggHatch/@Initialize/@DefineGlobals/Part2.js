function DetectGap(axes, botOneVertices, botTwoVertices) {
    let gapExists = false;

    // Iterate over all the axes for projection
    for (let axis of axes) {
        // Project the vertices of both bots onto the current axis
        const {minPoint: botOneMinPoint, maxPoint: botOneMaxPoint} = GetProjectedPoints(axis, botOneVertices);
        const {minPoint: botTwoMinPoint, maxPoint: botTwoMaxPoint} = GetProjectedPoints(axis, botTwoVertices);

        // Check if the projections of the two bots overlap on the axis
        if ((botTwoMinPoint - botOneMaxPoint > 0) || (botOneMinPoint - botTwoMaxPoint > 0)) {
            // If the projections do not overlap, set gapExists to true and exit the loop
            gapExists = true;
            break;
        }
    }

    // Return whether a gap exists (i.e., bots are not overlapping in any of the axes)
    return gapExists;
}
