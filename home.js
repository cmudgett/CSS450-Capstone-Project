let data = null;

async function readCSVFile(){
    // Read data from csv file and store globally so it can be accessed later
    let dataFile = await fetch('data.csv')
    let fileText = await dataFile.text()

    data = fileText.split('\r\n').map(row => row.split(','));
}

async function loadMainPageImages(){
    // get current product data
    await readCSVFile();

    // loop thru all products and get the first image to display on the main page
    // and create those elements.
    for(let i = 1; i < data.length; i++){
        // create the div and add it to the page
        let newDiv = document.createElement('div');
        newDiv.setAttribute('id', data[i][0])
        let targetElement = document.getElementById('gallery');
        targetElement.appendChild(newDiv)


        // create the link and add it to the existing div.
        newDiv = document.createElement('a')
        newDiv.setAttribute('href', 'details.html?modelID=' + data[i][0])
        newDiv.setAttribute('id', 'a' + data[i][0])
        targetElement = document.getElementById(data[i][0])
        targetElement.appendChild(newDiv)

        // create an image and add it to the link
        newDiv = document.createElement('img')
        newDiv.setAttribute('src', './' + data[i][4])
        targetElement = document.getElementById('a' + data[i][0])
        targetElement.appendChild(newDiv)
    }
}

async function loadProductDetails(){
    // get current product data
    await readCSVFile();

    // Get the product ID for the current product
    let id = GetURLParameters("modelID");

    // update title with current model info
    document.title += " " + data[id][1];

    document.getElementById('product_title').innerHTML = data[id][1];

    // set Main image
    document.getElementById("MainImage").setAttribute('src', data[id][4]);

    // add small clickable images to page for different views
    for(let i = 4; i < 7; i++){
        if (data[id][i] != 'None'){
            var newImg = document.createElement('img');
            newImg.setAttribute('src', './' + data[id][i]);
            newImg.setAttribute('style', 'max-width: 100px');
            newImg.setAttribute('onclick', 'updateMainImage(this.id)');
            newImg.setAttribute('id', 'image' + i)
            if (i ==4){
                newImg.setAttribute('class', 'active');
            }

            targetElement = document.getElementById('smallGallery');
            targetElement.appendChild(newImg);
        }
    }

    // update the description
    document.getElementById('Description').innerHTML = data[id][2].substring(1,data[id][2].length - 1);

    // update the price
    document.getElementById('Price').innerHTML = data[id][3] + "<p> <a href=''>Add to Cart</a>";

}

function GetURLParameters(param){
    // Get the URL which has all the paramenters in it.
    let pageURL = window.location.search.substring(1);

    // break the parameters up
    let URLletiable = pageURL.split('&');
    for (let i = 0; i < URLletiable.length; i++){
        let name = URLletiable[i].split('=');
        // Return the paramenter that was specified
        if (name[0] == param){
            return decodeURIComponent(name[1]);
        }
    }

    // Parameter not found
    return "";
}

function updateMainImage(imageID){
    // Get the product ID for the current product
    let id = GetURLParameters("modelID");

    // set the main image to the image that was just clicked
    newImage = document.getElementById(imageID).getAttribute('src');
    document.getElementById("MainImage").setAttribute('src', './' + newImage);
    for (var i = 4; i < 7; i++){
        // if (data[id][i] != 'None'){
            document.getElementById('image' + i).removeAttribute('class')
        // }
    }
    document.getElementById(imageID).setAttribute('class', 'active');
}

function switchModel(direction){
    // direction is -1 for previous model and 1 for next model. 
    // Selection will loop when end/beginning is reached.

    // Get the product ID for the current product
    const id = Number(GetURLParameters("modelID"));
    let newModel = 1;

    if (id + direction == data.length){
        newModel = 1;
    } else if (id + direction == 0){
        newModel = data.length - 1;
    } else {
        newModel = id + direction;
    }
    
    window.location.replace('details.html?modelID=' + newModel);


}