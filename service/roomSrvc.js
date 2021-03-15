const axios = require('axios');

const getRoom = async(apiKey, spaceId, mapId) => {
    try {
        const response = await axios.get('https://gather.town/api/getMap', {
            params: {
                apiKey: apiKey,
                spaceId: spaceId,
                mapId: mapId
            }
        });
        console.log("successfully retrieved room");
        return response.data;
    } catch (error){
        console.log("hit an error retrieving room")
        console.error(error);
    }
}

exports.getRoom = getRoom;