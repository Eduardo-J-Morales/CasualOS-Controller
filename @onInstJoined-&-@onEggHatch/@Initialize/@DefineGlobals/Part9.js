function NegateQuaternion(quaternion) {
    const { x, y, z, w } = quaternion._q;
    const inverseQuaternion = new Quaternion(-x, -y, -z, -w); // Negate each component of the quaternion
    const negated = new Rotation(inverseQuaternion); // Wrap the negated quaternion in a Rotation object
    return negated;
}
