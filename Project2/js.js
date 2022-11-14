const startKey = "https://process.filestackapi.com/At9UTT8kATHm3oqlKlMQaz";
let xhr = new XMLHttpRequest();
let sendButton = document.querySelector("#LinkInput input:nth-child(2)"); 
let input = document.querySelector("#LinkInput input"); 
let fullyColor = document.querySelector("#Color input");
let colorOptions = document.querySelector("#Foreground");
let image = document.querySelector("#ConvertedImage");
let defaultFontSize;


xhr.onload = dataLoaded;
xhr.onerror = dataError;
sendButton.onclick = outputASCII;
fullyColor.onchange = changeAvailability;

// Lets image size change when the window resizes
window.addEventListener('resize', onResize);

document.querySelector("#Foreground input").value = "#FFFFFF";

if (fullyColor.checked) {
    colorOptions.style.background="#45454545";

    colorOptions.querySelector("input").disabled = true;
}

input.placeholder = "Enter Image URL Here"



function outputASCII() {
    // Shows that the api is working
    image.style = `background:white`; 
    image.style.color = `black`; 

    image.innerHTML = "<p>Working...</p>"

    let tempString = "";
    let option;

    if (input.value == "") {
        image.innerHTML = "<p>No Valid Image URL Was Given</p>"
        return;
    }

    // Handels Text Color
    if (fullyColor.checked) {
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
    if (document.querySelector("#Size input").value != "100" && document.querySelector("#Size input").value != "") {
        option = option + `,size:${document.querySelector("#Size input").value}`;
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
    if (fullyColor.checked) {
        colorOptions.style.background="#45454545";
    
        colorOptions.querySelector("input").disabled = true;
    }
    else {
        colorOptions.style.background="white";
    
        colorOptions.querySelector("input").disabled = false;
    }
}

function onResize() {
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