const imageUtil = require('../util/posterBoardImages')

const compareNumbers = (a, b) => {
    return a - b;
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
    const objects = room.objects;

    // TODO: do this!!!
    // want to keep any door objects in place so people can find the portal tiles
    // const doors = pullOutDoorObjects(objects);

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

    // add in private spaces for each poster object we've got
    const updatedSpaces = builtUpdatedRoomSpacesArray(updatedPosterObjectArray);

    room.objects = updatedPosterObjectArray;
    room.spaces = updatedSpaces;

    return room;
}

exports.updateRoom = updateRoom;