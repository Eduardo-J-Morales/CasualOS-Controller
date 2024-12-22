
function QuaternionToEuler(quaternion) {
    const { x, y, z, w } = quaternion._q;

    // Calculate roll (rotation around x-axis)
    const roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
    
    // Calculate pitch (rotation around y-axis)
    const pitch = Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - x * z))));

    // Calculate yaw (rotation around z-axis)
    const yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));

    // Return the Euler angles (pitch, yaw, roll)
    return { pitch, yaw, roll };
}
