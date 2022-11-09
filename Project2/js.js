const startKey = "https://process.filestackapi.com/At9UTT8kATHm3oqlKlMQaz";
let xhr = new XMLHttpRequest();
let sendButton = document.querySelector("#LinkInput input:nth-child(2)"); 
let input = document.querySelector("#LinkInput input"); 


xhr.onload = dataLoaded;
xhr.onerror = dataError;
sendButton.onclick = outputASCII;



function outputASCII() {
let tempString = "";
let option;

if (document.querySelector("#Color input").checked) {
option = "ascii=colored:true";
}
else {
    option="ascii=colored:false";
}

if (document.querySelector("#Size input").value != "100") {
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