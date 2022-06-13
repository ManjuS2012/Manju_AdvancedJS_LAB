const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});


function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=7e3f21edee540e6110af347b55eb1ab2`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() => {
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;

        if (id == 800) {
            wIcon.src = "icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "icons/cloud.svg";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            wIcon.src = "icons/rain.svg";
        }

        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        let now = new Date();
        let date = document.querySelector('.location .date');
        date.innerText = buildDate(now);
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}
function buildDate(currentDate) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[currentDate.getDay()];
    let date = currentDate.getDate();
    let month = months[currentDate.getMonth()];
    let year = currentDate.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}
arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
