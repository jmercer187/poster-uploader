const imageUtil = require('../util/posterBoardImages')

const updateRoom = (room, images, replaceExistingImages) => {

    let roomX = room.dimensions[0];
    let roomY = room.dimensions[1];
    let objects = room.objects;
    if (replaceExistingImages) { objects = [];}
    






    
}

exports.updateRoom = updateRoom;


// find all of the xy coords we can put a poster
// re-order that list so it starts in the center and works out
// assign coords based on that list