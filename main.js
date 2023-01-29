import conditions from "./conditions.js";

// weather elements
const weaterForm = document.getElementById("js-weatherForm");
const weatherHeader = document.getElementById("js-weatherHeader");
const changeLanguage = document.getElementById("js-language");

//  weather object data
let weatherDataObject = {
  name: "",
  country: "",
  temp: "",
  forecast: "",
  icon: "",
};
// remove card fnc
const removeCard = () => {
  const weatherCard = document.getElementById("js-weatherCard");
  if (weatherCard) {
    weatherCard.remove();
  }
};

// fetch
const weatherDataGet = async (inputData) => {
  try {
    const APIKEY = "2f272bd4104c4f23ae2171928232601";
    const URL = `http://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${inputData}`;
    const weatherResponse = await fetch(URL);
    const weatherData = await weatherResponse.json();
    console.log(weatherData);
    // error
    let { error } = weatherData;
    if (error) {
      throw new Error(error.message);
    }

    const { current, location } = weatherData;
    const { name, country } = location;
    const { temp_c, condition } = current;
    const { code, icon, text } = condition;

    // виклик ф-ції зміни мови.
    languageChange(code, current);

    // ! те ж саме тільки без винесення ф-ції ======================
    // console.log(conditions);

    // let test = "en";
    // let forcastUa;

    // const weatherConditions = conditions.find((elem) => {
    //   return elem.code === code;
    // });
    // console.log(weatherConditions.day);
    // console.log(weatherConditions.night);

    // const weatherLangArray = weatherConditions.languages.find((datalang) => {
    //   return datalang.lang_name === "Ukrainian";
    // });

    // if (test == "uk") {
    //   forcastUa = current.is_day
    //     ? weatherLangArray.day_text
    //     : weatherLangArray.night_text;
    //   console.log(weatherLangArray.night_text);
    // } else
    //   forcastUa = current.is_day
    //     ? weatherConditions.day
    //     : weatherConditions.night;

    // !================================

    weatherDataObject = {
      ...weatherDataObject,
      name: name,
      country: country,
      temp: temp_c,
      forecast: forcastUa,
      // icon: icon,
    };

    // html render
    htmlRender(weatherDataObject);
  } catch (err) {
    console.log(err);
    // error render
    errorRender(err);
  }
};

// form submit function
const getInputValue = (e) => {
  e.preventDefault();
  const formData = new FormData(weaterForm);
  // get input data
  const getCityName = formData.get("weater-input").trim();
  // request
  weatherDataGet(getCityName);
};

// form submit
weaterForm.addEventListener("submit", getInputValue);

// HTML render fnc
const htmlRender = (weatherDataObject) => {
  // delete prepend card
  removeCard();
  const { name, country, temp, forecast, icon } = weatherDataObject;
  let cardWeaterHtml = `<div class="card" id="js-weatherCard">
    <div class="city">${name}<span>${country}</span></div>
    <div class="icon-container">
      <div class="temperature">${temp}<sup>°c</sup></div>
      <div class="icon-wrapper">
      <img src=./img/${icon}.png class="weather-icon" />
      </div>
    </div>
    <div class="forecast">${forecast}</div>
    </div>`;

  weatherHeader.insertAdjacentHTML("afterend", cardWeaterHtml);
};

// error render fnc
const errorRender = (err) => {
  // delete prepend card
  removeCard();
  let errorMessage = ` <div class="card card__error" id="js-weatherCard">
  ${err} <div class="forecast">Enter City Name Again</div>
  </div> `;
  weatherHeader.insertAdjacentHTML("afterend", errorMessage);
};

// language and icon change-----------------------------

let lang = "en";
let forcastUa;
changeLanguage.addEventListener("change", function () {
  lang = this.value;
});

// icon get
const iconGet = (weatherConditions, current) => {
  console.log(weatherConditions.day.replace(" ", ""));
  let customIcon;
  if (current.is_day) {
    customIcon = "day/" + weatherConditions.day.replace(" ", "");
    console.log(customIcon);
  } else customIcon = "night/" + weatherConditions.night.replace(" ", "");

  weatherDataObject = { ...weatherDataObject, icon: customIcon };
};

function languageChange(code, current) {
  const weatherConditions = conditions.find((elem) => {
    return elem.code === code;
  });
  const weatherLangArray = weatherConditions.languages.find((datalang) => {
    return datalang.lang_name === "Ukrainian";
  });

  // =====icon=======
  iconGet(weatherConditions, current);
  console.log(weatherDataObject);
  // !без винесення функції
  // let customIcon;
  // if (current.is_day) {
  //   customIcon = weatherConditions.day + ".png";
  // } else customIcon = weatherConditions.night + ".png";
  // weatherDataObject = { ...weatherDataObject, icon: customIcon };
  // console.log(weatherDataObject);

  // =====icon end=======

  if (lang == "ua") {
    return (forcastUa = current.is_day
      ? weatherLangArray.day_text
      : weatherLangArray.night_text);
  } else
    return (forcastUa = current.is_day
      ? weatherConditions.day
      : weatherConditions.night);
}

// language change END-----------------------------
