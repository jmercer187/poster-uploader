const axios = require('axios');

const getRoom = async(apiKey, spaceId, mapId) => {
    let response = await axios.get('https://gather.town/api/getMap', {
        params: {
            apiKey: apiKey,
            spaceId: spaceId,
            mapId: mapId
        }
    });
    console.log("successfully retrieved room");
    return response.data;
}

const postRoom = (apiKey, spaceId, mapId, mapContent) => {
    let response = axios.post('https://gather.town/api/setMap', {
        apiKey: apiKey,
        spaceId: spaceId,
        mapId: mapId,
        mapContent: mapContent
    });
    console.log("successfully posted updated room")
    return response;
}

exports.getRoom = getRoom;
exports.postRoom = postRoom;