function QuaternionDot(quatA, quatB) {
    return (
        quatA._q.x * quatB._q.x +
        quatA._q.y * quatB._q.y +
        quatA._q.z * quatB._q.z +
        quatA._q.w * quatB._q.w
    );
}
