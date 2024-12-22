const input = {
    up: os.getInputState("keyboard","W") || os.getInputState("keyboard","w") || os.getInputState("keyboard","ArrowUp"),
    down: os.getInputState("keyboard","S") || os.getInputState("keyboard","s") || os.getInputState("keyboard","ArrowDown"),
    left: os.getInputState("keyboard","A") || os.getInputState("keyboard","a") || os.getInputState("keyboard","ArrowLeft"),
    right: os.getInputState("keyboard","D") || os.getInputState("keyboard","d") || os.getInputState("keyboard","ArrowRight")
}
const direction = new Vector3(
    (input.right ? 1 : 0) - (input.left ? 1 : 0),
    (input.up ? 1 : 0) - (input.down ? 1 : 0),
    0
)
if(direction.length() > 0)
{
    return direction.normalize();
}
return new Vector3(0, 0, 0);
