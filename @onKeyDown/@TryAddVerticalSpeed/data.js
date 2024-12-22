const jumpSpeed = 10;
if(!thisBot.vars.currentControlledBot.masks.isJumping)
{
  setTagMask(thisBot.vars.currentControlledBot, "isJumping", true);
  const newVerticalVelocity = (thisBot.vars.currentControlledBot.masks.verticalVelocity ?? 0) + jumpSpeed;
  setTagMask(thisBot.vars.currentControlledBot, "verticalVelocity", newVerticalVelocity);
}
