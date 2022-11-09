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

    colorOptions.querySelector("input").readOnly = true;
}



function outputASCII() {
let tempString = "";
let option;

if (fullyColor.checked) {
option = "ascii=colored:true";
}
else {
    let foundColor = document.querySelector("#Foreground input").value

    if (foundColor == "") {
        option = "ascii=colored:false"
    }
    else {
    option=`ascii=foreground:${document.querySelector("#Foreground input").value.toString().substring(1)}`;
    }
}

if (document.querySelector("#Size input").value != "100" && document.querySelector("#Size input").value != "") {
    option = option + `,size:${document.querySelector("#Size input").value}`;
}

tempString = `${startKey}/${option}/${input.value}`;


xhr.open("GET", tempString);
xhr.send();
}



function dataLoaded(e) {
    let xhr = e.target;
    console.log(xhr.responseText);

    document.querySelector("#ConvertedImage").innerHTML = xhr.responseText;
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