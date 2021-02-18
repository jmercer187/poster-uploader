const apiKey = "P1pUCBjrFDJAzgp2";
//const spaceId = "HHZcGPqIP2MXnxY5";

const showFormsBtn = document.getElementById('showRoomFormsBtn')
const formCount = document.getElementById('formCount');
const formContainer = document.getElementById('formContainer');
const form = document.getElementById('form');
const submitBtn = document.getElementById('submitBtn');
const spaceId = document.getElementById('spaceId');
const mapId = document.getElementById('mapId');
const files = document.getElementById('fileInput').files;

let fileArray = [];

function showForms(){
    const count = formCount.value;
    formContainer.classList.add('show-form');
}

// Validation Functions
function checkIfFileExists(filesObject){ 
    
    if (filesObject.length < 1){
        alert("You must upload at least one poster image.");
    }
}

function checkFileSizesAndTypes(filesObject){

    let isFileTooBig = false;
    let isFileTypeWrong = false;

    Array.from(filesObject).forEach(file => {
        
        let fileSize = Math.round(file.size / 1024);
        if (fileSize >= 3000) {
            isFileTooBig = true;
        }

        console.log(file.type);
        if (!['image/jpeg', 'image/pdf', 'image/tif', 'image/png'].includes(file.type)){
            isFileTypeWrong = true;
        }
    });

    if (isFileTooBig){
        alert("One or more files exceeded 3mb .. no files larger than 3mb are allowed")
    }

    if (isFileTypeWrong){
        alert("Please submit a valid image type or PDF")
    }
}


function setUpFetch(){

}

function submitPosterImages(){

}


// Event Listeners
showFormsBtn.addEventListener('click', showForms)

submitBtn.addEventListener('click', function(e){

    checkIfFileExists(files);
    checkFileSizesAndTypes(files);

    submitPosterImages();
})