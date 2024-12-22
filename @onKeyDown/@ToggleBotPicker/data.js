
setTagMask(thisBot, "isBotPickerEnabled", !thisBot.masks.isBotPickerEnabled);
os.toast(`Bot picker ${thisBot.masks.isBotPickerEnabled ? `On. Click any bot to control it` : `Off`}`);
