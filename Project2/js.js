const startKey = "https://process.filestackapi.com/At9UTT8kATHm3oqlKlMQaz";
let xhr = new XMLHttpRequest();
let sendButton = document.querySelector("#LinkInput input:nth-child(2)"); 
let input = document.querySelector("#LinkInput input"); 
let fullyColor = document.querySelector("#Color input");
let colorOptions = document.querySelector("#Foreground");


xhr.onload = dataLoaded;
xhr.onerror = dataError;
sendButton.onclick = outputASCII;
fullyColor.onchange = changeAvailability;



if (fullyColor.checked) {
    colorOptions.style.background="#45454545";

    colorOptions.querySelector("input").disabled = true;
}



function outputASCII() {
    // Shows that the api is working
    document.querySelector("#ConvertedImage").style = `background:white`; 
    document.querySelector("#ConvertedImage").style.color = `black`; 

    document.querySelector("#ConvertedImage").innerHTML = "<p>Working...</p>"

    let tempString = "";
    let option;

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

    document.querySelector("#ConvertedImage").innerHTML = xhr.responseText;

    // Handles background color
    let hex = document.querySelector("#Background input").value.toString();

    if (hex != "ffffff") {
        document.querySelector("#ConvertedImage").style = `background:${hex}`;
    }
}

function dataError(e){
    console.log("An error occurred");
    document.querySelector("#ConvertedImage").innerHTML = "<p>Not a valid image url</p>";
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
