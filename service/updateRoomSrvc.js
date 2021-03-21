const imageUtil = require('../util/posterBoardImages')

const getCoordsArray = (roomX, roomY) => {
    // poster object 5 tiles wide (3 for poster on on either side of spacing)
    // poster object 7 tiles tall (2 for poster, 3 for private space, 1 top and bottom for spacing)
    // further, let's leave a 1 tile border around poster object
    const usableX = roomX - 2;
    const usableY = roomY - 2;
    
    // how many poster objects can we fit?
    const totalObjectsX = math.floor(usableX / 5)
    const totalObjectsY = math.floor(usableY / 7)

    // how many extra tiles are there on each axis?
    const extraTilesX = usableX % totalObjectsX;
    const extraTilesY = usableY % totalObjectsY;

    // take 1/2 the extra tiles (rounding up in if odd), add one, and start there
    // advance number of times as there are objects for each axis (adding 5 for x axis, 7 for y)
    const xStart = math.round(extraTilesX/2) + 1;
    const xAxisLocations = [];
    for (let i = 0; i < totalObjectsX; i++){
        xAxisLocations.push(xStart);
        xStart = xStart + 5;
    }

    const yStart = math.round(extraTilesY/2) + 1;
    const yAxisLocations = [];
    for (let i = 0; i < totalObjectsY; i++){
        yAxisLocations.push(yStart);
        yStart = yStart + 7;
    }
    
    // use x and y location arrays to build out all possible coords
    // want coords loaded into array in ascending order x, then y
    const coords = []
    xAxisLocations.sort();
    yAxisLocations.sort();

    for (let i = 0; i < xAxisLocations.length; i++) {
        xTile = xAxisLocations[i];
        for (let j = 0; j < yAxisLocations.length; j++) {
            yTile = yAxisLocations[j]
            coord = {x: xTile, y: yTile};
            coords.push(coord);
        }
    }
    
    return coords;
}

const buildPosterObject = (images) => {
    const previewRegex = /^\d{2}-P/
    const displayRegex = /^\d{2}-F/
    const preview = images.find(img => img.fileName.match(previewRegex));
    const display = images.find(img => img.fileName.match(displayRegex));

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
            highlighted: "",
            normal: "",
            properties: {
                preview: preview.url,
                image: display.url
            }
        }

    return newPosterObject;
}

const buildUpdatedRoomObjectsArray = (currentObjects, images) => {
    updatedObjects = [];
    while (images.length > 0){
        images

    }
}

const updateRoom = (room, images, replaceExistingImages) => {

    const roomX = room.dimensions[0];
    const roomY = room.dimensions[1];
    let objects = room.objects;
    if (replaceExistingImages === 'true') { objects = [];}
    
    // build out new poster objects array
    const updatedPosterObjectArray = buildUpdatedRoomObjectsArray(objects, images);

    // get array of coords where we can place poster objects
    const coords = getCoordsArray(roomX, roomY);

    // set coords for each image object .. start in middle of coords array and work outward
    

    
}

exports.updateRoom = updateRoom;