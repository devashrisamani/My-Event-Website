// Base URL of the Open Meteo API endpoint 
const baseUrl ="https://api.open-meteo.com/v1/forecast";

// Query parameters as a Javascript object
const queryParams = {
    latitude: -27.479995,
    longitude: 153.083536,
    current_weather: true,
};

// Convert the query parameters object into a query string
const queryString = new URLSearchParams (queryParams).toString();

// Full URL with query parameter 
// const urlWithParams = `${baseUrl}?${queryString}`;
const urlWithParams = baseUrl+"?"+queryString;

// Request options
const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

// Making the fetch call
fetch (urlWithParams, requestOptions)
    .then(response => response.json())
    .then (data => {
        const weather = data.current_weather;
        console.log("Current temperature: " + weather.temperature + "C"); 
        const temperature_element = document.getElementById('current_temperature');
        const windspeed_element = document.getElementById('current_windspeed');
        temperature_element.innerText = weather.temperature + "C";
        windspeed_element.innerText = weather.windspeed + 'kph';

    })
.catch(error => console.log('error', error));

// Get the subscribe form
const subscribeForm = document.getElementById('subscribe-form');

const handleInputChange = () => {
    let firstName = document.getElementById('firstName');
    let suburb = document.getElementById('suburb');
    let email = document.getElementById('email');
    let button = document.getElementById('subscribe-submit-button');

    if (firstName.value && suburb.value && email.value && email.validity.valid) {
        button.classList.add('enabled');
        button.disabled = false; 
    } else {
        button.classList.remove('enabled');
        button.disabled = true;
    }
};

const handleSubmit = (event) => {
    event.preventDefault();

    let firstName = document.getElementById('firstname').value; 
    let suburb = document.getElementById('suburb').value;
    let email = document.getElementById('email').value;

    let responseMessage = document.getElementById('responseMessage');

    responseMessage.textContent = "Sending your request...please wait."

    let payload = {
        subscriber_name: firstname, 
        subscriber_suburb: suburb, 
        subscriber_email: email
    };

    const url = 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/api/';
    const method = 'POST';
    const headers = {
        'Content-Type': 'application/json',
    };

    fetch (url, {
        method: method,
        headers: headers,
        body: JSON.stringify(payload)
    })

    .then((response)=> response.text())
    .then((data) =>{
        if (data === 'added') {
            responseMessage.textContent ='Subscription successful. Thank you for subscribing!';
        } else if (data === 'exists') {
            responseMessage.textContent ='This email address has already been used to subscribe!';
        } else if (data === 'error') {
            responseMessage.textContent ='An error occured with the API. Please try again later.';
        }
    })

    .catch ((error) => {
        console.error('Error:',error);
        responseMessage.textContent ='An unexpected error occured. Please try again later.';

    })
};

subscribeForm.addEventListener('input', handleInputChange);
subscribeForm.addEventListener('submit', handleSubmit);
