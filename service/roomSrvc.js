const axios = require('axios');

const getRoom = async(apiKey, spaceId, mapId) => {
    try {
        let response = await axios.get('https://gather.town/api/getMap', {
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

const postRoom = (apiKey, spaceId, mapId, mapContent) => {
    try {
        let response = axios.post('https://gather.town/api/setMap', {
            apiKey: apiKey,
            spaceId: spaceId,
            mapId: mapId,
            mapContent: mapContent
        });
        console.log("successfully posted updated room")
        return response;
    } catch (error){
        console.log("hit an error posting updated room")
        console.error(error)
    }
}

exports.getRoom = getRoom;
exports.postRoom = postRoom;