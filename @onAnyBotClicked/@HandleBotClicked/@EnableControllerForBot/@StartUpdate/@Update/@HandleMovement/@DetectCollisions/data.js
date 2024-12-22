const {character, position} = that;
const characterScales = GetBotScales(character);
const dimension = os.getCurrentDimension();
const characterLimits = GetBotLimits(position, characterScales);
let collision = false;

const characterVertices = GetBotVertices(GetBotLimits(position, characterScales))

for(let collisionBot of thisBot.vars.collisionBots)
{
    if(collisionBot.id == character.id) continue;

    const collisionBotScales = GetBotScales(collisionBot);
    const collisionBotPosition = getBotPosition(collisionBot, dimension);
    const collisionBotLimits = GetBotLimits(collisionBotPosition, collisionBotScales);
    const collisionBotRotation = GetBotRotations(collisionBot, dimension);
    if(collisionBotRotation.x || collisionBotRotation.y || collisionBotRotation.z)
    {
        let isThereAGap = false;

        if(!collisionBot.tags.form || collisionBot.tags.form === "cube")
        {
            const collisionBotVertices = GetBotVertices(collisionBotLimits);
            const collisionBotLocalizedVertices = collisionBotVertices.map((vertice) => {return vertice.subtract(collisionBotPosition)});
            const collisionBotRotatedVertices = collisionBotLocalizedVertices.map((localizedVertice) => {
                const rotation = new Rotation({euler: collisionBotRotation})
                const rotatedVertice = rotation.rotateVector3(localizedVertice).add(collisionBotPosition)
                return rotatedVertice;
            })
            const collisionBotNormals = GetNormalsByVertices(collisionBotRotatedVertices);
            const characterNormals = GetNormalsByVertices(characterVertices);
            const filteredNormals = FilterParallelVectors([...collisionBotNormals, ...characterNormals]);
            isThereAGap = DetectGap(filteredNormals, collisionBotRotatedVertices, characterVertices, collisionBot, character);
        }
        if(!isThereAGap)
        {
            collision = true;
            break;
        }
    }
    else
    {
        if(characterLimits.x.max >= collisionBotLimits.x.min &&
            characterLimits.x.min <= collisionBotLimits.x.max &&
            characterLimits.y.max >= collisionBotLimits.y.min &&
            characterLimits.y.min <= collisionBotLimits.y.max &&
            characterLimits.z.max >= collisionBotLimits.z.min &&
            characterLimits.z.min <= collisionBotLimits.z.max)
        {
            collision = true;
            break;
        }
    }
}
return collision;
