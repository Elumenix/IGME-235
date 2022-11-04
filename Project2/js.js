let tempstring = "";
let xhr = new XMLHttpRequest();


xhr.onload = dataLoaded;
xhr.onerror = dataError;


xhr.open("GET", "https://process.filestackapi.com/At9UTT8kATHm3oqlKlMQaz/ascii=colored:true/https://cdn.akamai.steamstatic.com/steam/apps/1875580/capsule_616x353.jpg?t=1643863443");
xhr.send();



function dataLoaded(e) {
    let xhr = e.target;
    console.log(xhr.responseText);

    document.write(xhr.responseText);
}

function dataError(e){
    console.log("An error occurred");
}

function htmlToJson(div,obj){
    if(!obj){obj=[]}
    var tag = {}
    tag['tagName']=div.tagName
    tag['children'] = []
    for(var i = 0; i< div.children.length;i++){
       tag['children'].push(htmlToJson(div.children[i]))
    }
    for(var i = 0; i< div.attributes.length;i++){
       var attr= div.attributes[i]
       tag['@'+attr.name] = attr.value
    }
    return tag    
   }