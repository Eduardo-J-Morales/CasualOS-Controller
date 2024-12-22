function FixQuaternionHemisphere(start, target) {
    const dot = QuaternionDot(start, target); // Compute the dot product of the quaternions
    return dot < 0 ? NegateQuaternion(target) : target; // If dot product is negative, negate the quaternion
}
