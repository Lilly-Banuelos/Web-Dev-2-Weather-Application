/* Name: Lilly Jarvis (Banuelos)
    Date: 04/26/2023
    Program Purpose: This page presents users with the option to enter a zipcode and choose between celcius or farenheit. Weather conditions at the location will be displayed.
*/

// Global variables
// stores the F or C variable for determining celcius or farenheit when calling the api
var tempType;
// this stores the coordinates of the longitude based on zip code entered
var longitude;
// this stores the coordinates of the latitude based on zip code entered
var latitude;
// this determines and stores the imperial or metric system of F or C based on user choice
var temp;
// this stores the temp based on zip code entered
var actualTemp;
// this stores the city based on zip code entered
var city;
// this stores the weather conditions based on zip code entered
var conditions;
// this stores the path to the icon based on zip code entered
var icon;

// This is an array of quotes that I found online related to weather
let quotesArr = ["I'm gonna complain about the weather even though I'm indoors doing a whole lot of nothing!", "Fool me once, shame on you. Fool me twice, shame on me. Fool me 92,748 times, you're a weatherman.", "The weather just went from 90 to 55 like it saw a state trooper!", "What is the worst type of weather to hire for a job? Lightning because it's always on strike!", "What happens when it rains cats and dogs? You might step in a poodle!"];

// this gets the funnyQuote h3 element from the index and stores it in a variable
var quote = document.getElementById('funnyQuote');
// this calls the random quote generator function
randmQuote();

// this function generates a random quote and changes the inner html of the funnQuote h3 element to display a random quote
function randmQuote()
{
    // this variable stores a random number from 0 to 4
    var holder = Math.floor(Math.random() * 5)
    // this changes what's displayed inside the h3 element with the id funnyQuote stored in the quote variable
    quote.innerHTML = '"' + quotesArr[holder] +'"';
}

// Adds an event listener to the submit button that runs after clicking, caling the runDoc function
document.getElementById('submit').addEventListener('click', runDoc);

// this gets the middle div element and stores it in the middle variable
var middle = document.getElementById('middle');

// error message for zip code
// creates a paragraph element and stores it in the errorMsg variable
var errorMsg = document.createElement('p');
// sets the error message variable to blank
errorMsg.innerHTML = "";
// gives the error message variable an id of errorMsg
errorMsg.id = "errorMsg";
// appends the errorMsg paragrapg element to the page, showing up blank at the moment
document.body.appendChild(errorMsg);

// this runs after the submit button is clicked
function runDoc()
{
    // this calls the random quote generator function, changing the quote any time the submit button is clicked even if the submission is invalid
    randmQuote();

    // runs the tempDeterminer function which determines if temperature is in F or C based on user selection
    tempDeterminer();
    
    // runs the zip check function to check the value the user entered into the zipCode text box is valid
    zipCheck();
}

// this function checks to make sure that the user entered value in the zipCode box is a number between 0 and 9, is greater than or equal to 5 and less than or equal to 9. Runs after the submit button is clicked
function zipCheck()
{
    // creates a pattern and stores it in a variable for the user entered string to be compared to, making sure it contains only numbers between 0 and 9
    var zipPattern = /^[0-9]*$/;
    // this creates a variable to store the user entered value in the zipCode box
    var zip = document.getElementById('zipCode').value;
    // this checks to make sure that the user entered value meets requirements
    // runs if the user entered value meets all requirements (greater than or equal to length 5, less than or equal to length 9, and only numbers 0 through 9)
    if (zip.length >= 5 && zip.length <= 9 && zipPattern.test(zip) == true)
    {
        // the error message is blank
        errorMsg.innerHTML = "";
        // runs the loadXMLDoc function, which starts the API call
        loadXMLDoc();
    }
    // runs if requirements are not met
    else
    {
        // error message for zip code
        errorMsg.innerHTML = "Invalid submission. ZIP Code must contain only numbers 0 through 9 and be between 5 to 9 characters long.";
    }
}



// API HANDLING
// Function that calls the API into the program for the weather
function loadXMLDoc() {
    // Creates a new XMLHTTP request and stores it in the function xhttp
    var xhttp = new XMLHttpRequest();
    // if block that runs only if the data was found and the response to the API request was a success
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // this stores the json response text string in the geographyAPI variable ( named it this because I thought I would have to call the geocoding API first to get the latitude and longitude, but ended up being able to just call the weather API with only the zip)
        geographyAPI =
        this.responseText;
        // this converts the json response text string stored in the geographyAPI variable into an object
        geographyAPIObj = JSON.parse(geographyAPI);

        // this gets the latitude coordinates from the API based on the user entered zip code and stores it in the latitude variable
        latitude = geographyAPIObj.coord.lat;
        // this gets the longitude coordinates from the API based on the user entered zip code and stores it in the longitude variable
        longitude = geographyAPIObj.coord.lon;

        // this gets the current temperature from the API based on the user entered zip code and stores it in the actualTemp variable
        actualTemp = geographyAPIObj.main.temp;

        // this gets the city name from the API based on the user entered zip code and stores it in the city variable
        city = geographyAPIObj.name;

        // this gets the current weather conditions from the API based on the user entered zip code and stores it in the conditions variable
        conditions = geographyAPIObj.weather[0].main;

        // this gets the icon path from the API based on the user entered zip code and stores it in the icon variable
        icon = geographyAPIObj.weather[0].icon;

        // this runs the clearDoc function, which clears the screen by updating the dom and displaying the data for the variables above
        clearDoc();
      }
      // runs if the request is bad because it wasn't found
      if (this.status == 404) {
        // error message for zip code
        errorMsg.innerHTML = "Not a valid US ZIP code.";
      }
    };
    // creates a request to send to the website server for the weather API for the weather values
    xhttp.open("GET", "https://api.openweathermap.org/data/2.5/weather?zip=" + document.getElementById('zipCode').value + ",us&appid=7ed3a6986c5ebf5406c05236a0d3b32f" + temp, true);
    // sends the request above to the weather API website server
    xhttp.send();
}

// this function determines the temperature based on the user's choice between farenheit or celcius
function tempDeterminer()
{
    // determines variable for farenheit or calculus
    // if the user chose farenheit
    if (document.getElementById('tempType').value == 'F')
    {
        // sets the tempType variable to F
        tempType = 'F';
        // uses the imperial units for the api call based on the user choosing the F option
        temp = '&units=imperial';
    }
    // if the user chose celcius
    else if (document.getElementById('tempType').value == 'C')
    {
        // sets the tempType variable to C
        tempType = 'C';
        // uses the metric units for the api call based on the user choosing the C option
        temp = "&units=metric"
    }
}
// this function clears the screen after the submit button is clicked and zip code meets the requirements by updating the dom and displaying the data for different weather measurements
function clearDoc()
{
    // stores the middle div element in the middle variable
    var middle = document.getElementById('middle');
    // sets middle's display to blank
    middle.innerHTML = '';
    // adds an h1 title to the middle div
    middle.innerHTML = "<h1 id='title'>WEATHER WATCHER</h1>";
    // adds an h2 element with the city displayed based on the user entered zip code
    middle.innerHTML += "<h2>" + city + "</h2>";
    // adds an img element with a weather icon displayed based on the user entered zip code, uses the path to the image as well as the icon variable from the api
    middle.innerHTML += "<img id='iconPng' src='http://openweathermap.org/img/w/" + icon + ".png'>";
    // adds an h3 element with the weather conditions displayed based on the user entered zip code
    middle.innerHTML += "<br><h3>" + conditions + "</h3>";
    // adds an h3 element with the current temperature displayed based on the user entered zip code and their choice of either farenheit or celcius
    middle.innerHTML += "<h3>" + actualTemp + " °" + tempType  + "</h3>";
    
    // this removes the errorMsg paragraph element from the page
    document.body.removeChild(errorMsg);
}