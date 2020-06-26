const application = (data) => {
  setToday(data);
  setForecast(data);
};

const proccessWithNoLoc = (error) => {
  let slideBar = document.querySelector(".slideBar");
  slideBar.classList.add("shown");
  let cityName;
  document.querySelector(".getWeather").addEventListener("click", () => {
    cityName = document.querySelector(".cityName").value;
    slideBar.classList.remove("shown");
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=AIzaSyCfFMORK5J8b8vQdlbxPNqe7Png35YUarU`
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        let lat = response.results[0].geometry.location.lat;
        let long = response.results[0].geometry.location.lng;
        let link = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&appid=140610dc9e33690708dc04f1db3e166b`;
        dataFetching(link);
      });
  });
};

const processWithLoc = (position) => {
  let location = {
    long: position.coords.longitude,
    lat: position.coords.latitude,
  };
  let link = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.long}&exclude=hourly,minutely&appid=140610dc9e33690708dc04f1db3e166b`;
  dataFetching(link);
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(processWithLoc, proccessWithNoLoc);
}
function dataFetching(link) {
  fetch(link)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log(response);
      application(response);
    });
}

const apiDescriptionToSkycons = (description) => {
  let id = Math.floor(description / 100);
  if (description == 800) return "clear-day";
  switch (id) {
    case 2:
      return "thunder-rain";
    case 3:
      return "showers-day";
    case 5:
      return "rain";
    case 6:
      return "thunder-rain";
    case 7:
      return "fog";
    case 8:
      return "cloudy";
  }
};

function setToday(data) {
  let today = document.querySelector(".current-temperature");
  let currentInK = data.current.temp;
  let currentInC = Math.round((currentInK - 273.15) * 10) / 10;
  let textToPut = currentInC + "°C";
  today.innerHTML = textToPut;
  let timezone = document.querySelector(".today-timezone");
  timezone.innerHTML = data.timezone;
  let skycons = new Skycons({ color: "white" });
  let animationPicture = apiDescriptionToSkycons(data.current.weather[0].id);
  skycons.add("icon1", animationPicture);
  skycons.play();
  let todayDescription = document.querySelector(".today-description");
  todayDescription.innerHTML = data.current.weather[0].description;
}

function setForecast(data) {
  let week = [];
  for (let i = 1; i < 8; i++) {
    week.push(oneDay(data, i));
  }
}

function oneDay(data, number) {
  let theDay = {
    name: getDayName(data.daily[number].dt),
    temp: data.daily[number].temp.day,
    description: data.daily[number].weather[0].description,
    skyConsId: apiDescriptionToSkycons(data.daily[number].weather[0].id),
  };

  return theDay;
}

const getDayName = (date) => {
  let theDay = new Date(date * 1000);
  console.log(theDay);
  let dayName = theDay.getDay();
  console.log(dayName);
  switch (dayName) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
};
