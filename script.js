/*
    gather api reference: 
    https://www.notion.so/EXTERNAL-Gather-http-API-3bbf6c59325f40aca7ef5ce14c677444

    neurIPS thing that does this
    https://github.com/Mini-Conf/Mini-Conf/tree/master/gather

    we create a map (room) for the space identified by user
    user can create multiple rooms and specify w/ images go to which room
    we need to find a way to separate preview images from poster images
        -> separate uplaods?
        -> have internal function that creates a preview for them?
            ** this is probably easiest for user .. and also us too probably
    
    step 1
        -> validate submission
            - image type, file size, file count (50 max)
        -> validate spaceId (char min? anything else?)
        ** note accept PDFs, JPEGs, TIFs, and PNGs and then transform everything into PNGs
    
    step 2
        -> async POSTs to create the room(s) and get the mapId
            POST https://gather.town/api/createRoom
        -> build out the map object body(s) (excepting mapId)
            bunle together images, set up sizing, private spaces, etc

    step 3
        -> async POSTs to set room data
            POST https://gather.town/api/setMap
        -> hand back response https codes per call as we get them back
            plus any errors if we get them?
        
*/

const form = document.getElementById('form');
const spaceId = document.getElementById('spaceId');
const mapId = document.getElementById('mapId');

// Functions
function setUpFetch(){

}

function submitPosterImages(){

}


// Event Listeners
form.addEventListener('click', function(e){
    //TODO add validation functionas for Ids; file type, size, and count(?)
    submitPosterImages();
})