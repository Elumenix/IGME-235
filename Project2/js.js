const startKey = "https://process.filestackapi.com/At9UTT8kATHm3oqlKlMQaz";
let xhr = new XMLHttpRequest();
let sendButton = document.querySelector("#LinkInput input:nth-child(2)"); 
let input = document.querySelector("#LinkInput input"); 
let nextFullyColor = document.querySelector("#Color input");
let fullyColor; // bool
let colorOptions = document.querySelector("#Foreground");
let image = document.querySelector("#ConvertedImage");
let defaultFontSize;
let currentLocalStorageSize = 0;


xhr.onload = dataLoaded;
xhr.onerror = dataError;
sendButton.onclick = outputASCII;
nextFullyColor.onchange = changeAvailability;

// Lets image size change when the window resizes
window.addEventListener('resize', onResize);

document.querySelector("#Foreground input").value = "#FFFFFF";

if (nextFullyColor.checked) {
    colorOptions.style.background="#45454545";

    colorOptions.querySelector("input").disabled = true;
}

input.placeholder = "Enter Image URL Here"
document.querySelector("#Size input").placeholder = "10 - 100";

insertIntoSidebar();


function outputASCII() {
    // Shows that the api is working
    image.style = `background:white`; 
    image.style.color = `black`; 

    image.innerHTML = "<p>Working...</p>"

    let tempString = "";
    let option;

    // Switches value over
    fullyColor = nextFullyColor.checked;

    if (input.value == "") {
        image.innerHTML = "<p>No Valid Image URL Was Given.</p>"
        return;
    }

    // Handels Text Color
    if (nextFullyColor.checked) {
    option = "ascii=colored:true";
    }
    else {
        let foundColor = document.querySelector("#Foreground input").value

        if (foundColor == "") {
            // I always need some kind of modifier, so Color will fill that role
            option = "ascii=colored:false"
        }
        else {
        option=`ascii=foreground:${document.querySelector("#Foreground input").value.toString().substring(1)}`;
        }
    }

    if (document.querySelector("#Reverse input").checked) {
        option=`${option},reverse:true`;
    }

    // Handles Image size
    let imageSize = document.querySelector("#Size input").value;
    if (imageSize != "100" && document.querySelector("#Size input").value != "") {
        if (imageSize < "10" || imageSize > "100") {
            image.innerHTML = "<p>Image Size must be within the range of 10 - 100.</p>"
            return;
        }
        else {
        option = option + `,size:${document.querySelector("#Size input").value}`;
        }
    }


    // Puts together final url that will be used
    tempString = `${startKey}/${option}/${input.value}`;

    // Handles drawing image to the screen
    xhr.open("GET", tempString);
    xhr.send();
}


function dataLoaded(e) {
    let xhr = e.target;
    console.log(xhr.responseText);

    image.innerHTML = xhr.responseText;

    // Handles background color
    let hex = document.querySelector("#Background input").value.toString();

    if (hex != "ffffff") {
        image.style = `background:${hex}`;
    }

    // dataError doesn't actually get called when a wrong url is given, so this needs to be done manually
    if (image.innerHTML == `validation error: task not found: \"${input.value}\"\n`) {
        image.style = `background:white`; 
        image.style.color = `black`; 
        image.innerHTML = "<p>Not A Valid Image URL</p>";
    }
    else {
    defaultFontSize = image.children[0].style.fontSize;
    image.children[0].style.textAlign = "center"; 

    // Save the completed image for the future
    addToLocalStorage();

        // Update sidebar to include new image
        insertIntoSidebar();

    // So that the image will immediately fit the viewport
    onResize();
    }
}

function dataError(e){
    console.log("An error occurred");
    image.innerHTML = "<p>Not a valid image url</p>";
    image.style = `background:#ffffff`;
}

function changeAvailability(e) {
    if (nextFullyColor.checked) {
        colorOptions.style.background="#45454545";
    
        colorOptions.querySelector("input").disabled = true;
    }
    else {
        colorOptions.style.background="white";
    
        colorOptions.querySelector("input").disabled = false;
    }
}

function onResize() {
// Only fully colored images have spans, so the two types of images need to work differently
if (fullyColor) {
    // Makes the image larger
    if (document.querySelector("span").getBoundingClientRect().width < image.offsetWidth && image.children[0].style.fontSize != defaultFontSize) {
        while (document.querySelector("span").getBoundingClientRect().width < image.offsetWidth && image.children[0].style.fontSize != defaultFontSize) {
            let newSize = parseInt(image.children[0].style.fontSize) + 1;

        image.children[0].style.fontSize = `${newSize}px`; 
        }
    }

    // Shrinks the image
    while (document.querySelector("span").getBoundingClientRect().width > image.offsetWidth){
        let newSize = parseInt(image.children[0].style.fontSize) - 1;

        image.children[0].style.fontSize = `${newSize}px`; 
    }
}
else{
    // Makes the image larger
    if (document.querySelector("pre").childNodes[0].length * parseInt(document.querySelector("pre").style.fontSize) / 1.8 < image.offsetWidth && image.children[0].style.fontSize != defaultFontSize) {
        while (document.querySelector("pre").childNodes[0].length * parseInt(document.querySelector("pre").style.fontSize) / 1.8 < image.offsetWidth && image.children[0].style.fontSize != defaultFontSize) {
            let newSize = parseInt(image.children[0].style.fontSize) + 1;

        image.children[0].style.fontSize = `${newSize}px`; 
        }
    }

    // Shrinks the image
    while (document.querySelector("pre").childNodes[0].length * parseInt(document.querySelector("pre").style.fontSize) / 1.8 > image.offsetWidth){
        let newSize = parseInt(image.children[0].style.fontSize) - 1;

        image.children[0].style.fontSize = `${newSize}px`; 
    }
}
}

function addToLocalStorage() {
let toStorage = `${image.innerHTML},${document.querySelector("#Foreground input").value.toString()},${document.querySelector("#Background input").value.toString()},${fullyColor},${defaultFontSize}`;
toStorage = JSON.stringify(toStorage); // now it's a String

updateLocalStorageSize();

localStorage.setItem(`Dps5393ASCII${currentLocalStorageSize}`, toStorage);
}

function getPreviousImage(e) {
    let targetKey = e.target.closest("div").getAttribute("key");

    console.log(targetKey)
    console.log(JSON.parse(localStorage.getItem(targetKey)));

    let previousImage = JSON.parse(localStorage.getItem(targetKey));
    image.innerHTML = previousImage.substring(0, previousImage.indexOf("</pre") + 6);
    let parsedString = previousImage.substring(previousImage.indexOf("</pre") + 7).split(",");

    // Text color will be changed if original color wasn't automatic
    if (parsedString[2] == "false") {
        image.children[0].style.color = parsedString[0];
        fullyColor = false; // Required for onResize
    }
    else {
        // Required for onResize
        fullyColor = true;
    }

    // Makes sure the correct background color and font size is used
    image.children[0].style.background = parsedString[1]; 
    defaultFontSize = parsedString[3];

    // Make sure picture fits it's current dimensions
    onResize();
}


function openNav() {
document.getElementById("mySidebar").style.width = "500px";
document.getElementById("main").style.marginRight = "500px";
document.querySelector(".openbtn").onclick = closeNav;
}

function closeNav() {
document.getElementById("mySidebar").style.width = "0";
document.getElementById("main").style.marginRight= "0";
document.querySelector(".openbtn").onclick = openNav;
}

function insertIntoSidebar() {
    updateLocalStorageSize();
    for (let i = 0; i < currentLocalStorageSize; i++) {
    document.querySelector(".sidebar").appendChild(document.createElement("div"))
    let targetDiv = document.querySelector(".sidebar").querySelector(`div:nth-of-type(${i + 1})`);

    let previousImage = JSON.parse(localStorage.getItem(`Dps5393ASCII${i}`));
console.log(previousImage);
    targetDiv.innerHTML = previousImage.substring(0, previousImage.indexOf("</pre") + 6);

    let parsedString = previousImage.substring(previousImage.indexOf("</pre") + 7).split(",");
    targetDiv.setAttribute("key", `Dps5393ASCII${i}`);


// Text color will be changed if original color wasn't automatic
if (parsedString[2] == "true") {
    targetDiv.children[0].style.color = parsedString[0];
    targetDiv.setAttribute("fullyColor", "true"); // Required for onResize

    // Shrinks the image
    while (targetDiv.querySelector("span").getBoundingClientRect().width > 500){
        let newSize = parseInt(targetDiv.children[0].style.fontSize) - 1;

        targetDiv.children[0].style.fontSize = `${newSize}px`; 
    }
}
else {
    // Required for onResize
    targetDiv.setAttribute("fullyColor", "false");

    // Shrinks the image
    while (targetDiv.querySelector("pre").childNodes[0].length * parseInt(targetDiv.querySelector("pre").style.fontSize) / 1.8 > 500){
        let newSize = parseInt(targetDiv.children[0].style.fontSize) - 1;

        targetDiv.children[0].style.fontSize = `${newSize}px`; 
    }
}

// Makes sure the correct background color is used
targetDiv.children[0].style.background = parsedString[1]; 
targetDiv.setAttribute("defaultFontSize", parsedString[3]);
targetDiv.onclick = getPreviousImage;
targetDiv.style = "cursor: pointer"; 

// Div will change color when hovered over
targetDiv.addEventListener("mouseover", function() {
    targetDiv.children[0].style.backgroundColor = "#444";
});

targetDiv.addEventListener("mouseout", function() {
    targetDiv.children[0].style.backgroundColor = parsedString[1];
});

}
}

function updateLocalStorageSize() {
    // Figures out how many pictures are in local storage
let picturesInStorage = 0;
for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).substring(0, 12) == "Dps5393ASCII") {
        picturesInStorage++;
    }
}

currentLocalStorageSize = picturesInStorage;
}
