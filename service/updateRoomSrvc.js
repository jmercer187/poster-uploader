const atob = require('atob');

const imageUtil = require('../util/posterBoardImages')

const compareNumbers = (a, b) => {
    return a - b;
  }

const pullOutDoorObjects = (objects, roomX, roomY) => {
    const probablyADoor = []
    for (i=0; i < objects.length; i++){
        // this isn't robust .. but assuming any object placed on or near an outer edge is a door
        let object = objects[i];
        if (object.x === 0 || 
            object.x === 1 ||
            object.x === roomX ||
            object.x === roomX - 1||
            object.x === roomX - 2||
            object.y === 0 ||
            object.y === 1 ||
            object.y == roomY ||
            object.y == roomY - 1 ||
            object.y == roomY -2 ){
                probablyADoor.push(object)
            } 
    }

    return probablyADoor;
}

const getCoordsArray = (roomX, roomY) => {
    // poster object 5 tiles wide (3 for poster on on either side of spacing)
    // poster object 7 tiles tall (2 for poster, 3 for private space, 1 top and bottom for spacing)
    // further, let's leave a 1 tile border around poster object
    const usableX = roomX - 2;
    const usableY = roomY - 2;
    
    // how many poster objects can we fit?
    const totalObjectsX = Math.floor(usableX / 5)
    const totalObjectsY = Math.floor(usableY / 7)

    // how many extra tiles are there on each axis?
    const extraTilesX = usableX % totalObjectsX;
    const extraTilesY = usableY % totalObjectsY;

    // take 1/2 the extra tiles (rounding up in if odd), add two (1 for the room border, 1 for the object border), and start there
    // advance number of times as there are objects for each axis (adding 5 for x axis, 7 for y)
    let xStart = Math.round(extraTilesX/2) + 2;
    const xAxisLocations = [];
    for (let i = 0; i < totalObjectsX; i++){
        xAxisLocations.push(xStart);
        xStart = xStart + 5;
    }

    let yStart = Math.round(extraTilesY/2) + 2;
    const yAxisLocations = [];
    for (let i = 0; i < totalObjectsY; i++){
        yAxisLocations.push(yStart);
        yStart = yStart + 7;
    }
    
    // use x and y location arrays to build out all possible coords
    // want coords loaded into array in ascending order x, then y
    const coords = []
    xAxisLocations.sort(compareNumbers);
    yAxisLocations.sort(compareNumbers);

    for (let i = 0; i < yAxisLocations.length; i++) {
        yTile = yAxisLocations[i];
        for (let j = 0; j < xAxisLocations.length; j++) {
            xTile = xAxisLocations[j]
            coord = {x: xTile, y: yTile};
            coords.push(coord);
        }
    }
    
    return coords;
}

const buildPosterObject = (images) => {
    
    const previewRegex = /^\d{2}-P.+/
    const displayRegex = /^\d{2}-D.+/
    const preview = images.find(img => img.fileName.match(previewRegex));
    const display = images.find(img => img.fileName.match(displayRegex));

    // need to also set the image for the poster object
    // using background images from the default gather poster room .. dunno if this will work tho .. these links might be tied to that space specifically

    let objImageIndex = Math.floor(Math.random() * Math.floor(6));

    const newPosterObject = {
            scale: 1,
            distThreshold: "1",
            x: 0,
            y: 0,
            height: 5,
            width: 3,
            offsetY: 0,
            offsetX: 0,
            type: 2,
            highlighted: imageUtil.highlighted[objImageIndex],
            normal: imageUtil.normal[objImageIndex],
            properties: {
                preview: preview.url,
                image: display.url
            }
        }

    return newPosterObject;
}

const buildUpdatedRoomObjectsArray = (currentObjects, images) => {
    
    const newObjects = [];
    
    // using a while loop??? a dangerous pastime, I know...
    while (images.length > 0){
        // get an image
        let image1 = images[0];
        // ok we have it in play, kill it from the array
        images.splice(0,1)
        // get the second image by matching on the digit prefix
        let image2 = images.find(img => img.fileName.substring(0, 2) === image1.fileName.substring(0, 2))
        // pull the second image out of the images array
        let index = images.indexOf(image2);
        images.splice(index,1)
        
        let imagePair = [image1, image2];
        newObjects.push(buildPosterObject(imagePair));
    }

    if (currentObjects){
       return currentObjects.concat(newObjects);
    } else {
        return newObjects;
    }
}

const isBorder = (x,y,roomX,roomY) => {
    if ((y===1 && x > 0 && x < roomX-1) ||
        (y===roomY-2 && x > 0 && x < roomX-1) ||
        (x===1 && y > 0 && y < roomY-1) ||
        (x===roomX-2 && y > 0 && y < roomY-1)){            
        return true;
    } else {           
        return false;
    }
}

const isImpassible = (x,y,objectCoords) => {
    for(i=0;i<objectCoords.length;i++){
        if (objectCoords[i].x===x && objectCoords[i].y===y){
            return true;
        }
    }
    return false;
}

const buildOutPosterTiles = (posterObjects) => {
    fullPosterCoords = []

    for (i=0;i<posterObjects.length;i++){
        let origX = posterObjects[i].x
        let origY = posterObjects[i].y

        for (j=0;j<3;j++){
            let coord = {x:origX+j, y:origY}
            fullPosterCoords.push(coord)
        }
        for (j=0;j<3;j++){
            let coord = {x:origX+j, y:origY+1}
            fullPosterCoords.push(coord)
        }
    }

    return fullPosterCoords
}

const getPortalCoords = (portalObjects) => {
    portalCoords = []
    for (i=0;i<portalObjects.length;i++){
        let coord = {x:portalObjects[i].x, y:portalObjects[i].y}
        portalCoords.push(coord)
    }
    return portalCoords;
}

const buildNewCollisionsString = (posters, portals, roomX, roomY) => {
    portalCoords = getPortalCoords(portals)
    posterCoords = buildOutPosterTiles(posters)

    let byteMap = []

    for (y=0; y< roomY; y++){
        for (x=0; x<roomX; x++){
            // build the walls
            // note - have observed that gather rooms put the impassible boundary one tile in from the edge .. so replicating that behavior)
            if (isBorder(x,y,roomX,roomY) &&
                !isImpassible(x,y,portalCoords)){            
                byteMap.push(0x01)
            // build impassible tiles for poster board images
            } else if (isImpassible(x,y,posterCoords)){
                byteMap.push(0x01)
            // everything else is free to move about the cabin
            } else {           
                byteMap.push(0x00)
            }
        }
    }

    return Buffer.from(byteMap).toString('base64')
}

const builtUpdatedRoomSpacesArray = (updatedObjects) => {
    const spaces = []
    for (i=0; i < updatedObjects.length; i++) {
        // get the x-y coords for the object
        let x = updatedObjects[i].x;
        let y = updatedObjects[i].y;
        let spaceId = i + 1

        // now we need to build out a 3x3 tile space w/ id===index
        // top left corner of that space is at x,y+2
        for (j=0; j < 3; j++){
            let newY = y + j + 2;
            for (k=0; k < 3; k++){
                let space = {
                    spaceId: spaceId,
                    colored: false,
                    x: x + k,
                    y: newY
                }
                spaces.push(space)
            }
        }
    }

    return spaces
}

const updateRoom = (room, images, replaceExistingImages) => {
    const roomX = room.dimensions[0];
    const roomY = room.dimensions[1];
    let objects = room.objects;

    // put door sprites on ice so we don't lose / rearrange them and people can find their portal tiles
    const doors = pullOutDoorObjects(objects, roomX, roomY);
    objects = objects.filter((obj) => !doors.includes(obj));

    if (replaceExistingImages === 'true') { 
        objects = []; 
    }
    
    // build out new poster objects array
    const updatedPosterObjectArray = buildUpdatedRoomObjectsArray(objects, images);

    // get array of coords where we can place poster objects
    const coords = getCoordsArray(roomX, roomY);

    // set coords for each image object .. start in upper left and work across / down
    for (i=0; i < updatedPosterObjectArray.length; i++){
        let object = updatedPosterObjectArray[i];
        let coord = coords[i];
        object.x = coord.x;
        object.y = coord.y;
    }

    // update the collisions array based on the new poster objects we've added
    const updatedCollisions = buildNewCollisionsString(updatedPosterObjectArray, room.portals, roomX, roomY);
    console.log(updatedCollisions)

    // add in private spaces for each poster object we've got
    const updatedSpaces = builtUpdatedRoomSpacesArray(updatedPosterObjectArray);

    // add the door sprites back in
    const allObjects = updatedPosterObjectArray.concat(doors);

    room.objects = allObjects;
    room.spaces = updatedSpaces;
    room.collisions = updatedCollisions;

    return room;
}

exports.updateRoom = updateRoom;