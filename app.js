const weather_app_base_url = "https://api.openweathermap.org/data/2.5/weather"

const geminiAPIKey= "AIzaSyDnKNz4qZORiT62njuz03gULgQH-8TLvfU"

const gemini_base_url =`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiAPIKey}`

const weatherAppAPIKey = "b94dafeb4e41f470ae00b428efd3dc81"

const region = document.querySelector(".city");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity")
const wind = document.querySelector(".wind");
const msg = document.querySelector(".msg");
const input = document.querySelector(".search input");
const button = document.querySelector("button");
const weatherIcon = document.querySelector(".weather-icon");


// function to obtain weather data from API
const getWeatherData = async (city,lat,lon) =>{
    let url = ""
    if (city!==null){
        url = weather_app_base_url + `?appid=${weatherAppAPIKey}&q=${city}`
    }
    else{
        url = weather_app_base_url + `?lat=${lat}&lon=${lon}&appid=${weatherAppAPIKey}`
    }
    const response = await fetch(url);
    if(response.status===200){
        const data = await response.json();
        region.innerText = data['name']
        temp.innerText = Math.round(data['main']['temp']-273.15) + "°C"
        humidity.innerText = data['main']['humidity'] + "%"
        wind.innerText = data['wind']['speed'] + "m/s"
        const id = data['weather'][0]['id'];
        console.log(id)
        if (id>=200 && id<=232){
            weatherIcon.setAttribute("src","images/thunderstorm.png")
        }
        else if (id>=300 && id<=321){
            weatherIcon.setAttribute("src","images/drizzle.png")
        }
        else if (id>=500 && id<=531){
            weatherIcon.setAttribute("src","images/rain.png")
        }
        else if (id>=600 && id<=622){
            weatherIcon.setAttribute("src","images/snow.png")
        }
        else if (id>=700 && id<=800){
            weatherIcon.setAttribute("src","images/mist.png")
        }
    }
    else if(response.status===404){
        const message = await getPossibleCity(city);
        msg.innerText= message
    }
    else{
        msg.innerText = "Sorry, it looks like we are facing some unforseen issues, please try again after some time!"
    }
}


// function to define possible city based on user Input
const getPossibleCity = async (city) =>{
    const data = { "contents":[
        { "parts": [{
            "text": `You are an expert on geography and are familiar with all city names, I will be providing you with a city name which has some spelling mistake in it, this city is enclosed within double quotes and you need to provide name of one or two city which has most similar spelling in an ATLAS to the one I offered you to. The response format should be only be one city name.
            "${city}"
            In case you can't find anything or the input doesn't make sense to you then return None
            Example of response is : City1`
            }]
        }
    ]
    }
    const params = {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
          },
        body:JSON.stringify(data)
    }
    const response = await fetch(gemini_base_url,params);
    const info = await response.json();
    const correct_city = info['candidates'][0]['content']['parts'][0]['text'];
    if (correct_city==="None"){
        return "Sorry, couldn't recognize which city you are referring to";
    }
    else{
        return `Sorry, seems like you haven't entered incorrect city. Do you mean ${correct_city}?`
    }
}


// function to get location of browser
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
function showPosition(position) {
    getWeatherData(null,position.coords.latitude,position.coords.longitude)
}

getLocation()

button.addEventListener("click",()=>{
    let city = input.value;
    msg.innerText = ""
    if (city===""){
        msg.innerText = "Please enter city name!"
    }
    else{
        getWeatherData(city);
    }
})