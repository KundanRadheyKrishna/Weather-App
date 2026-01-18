let input = document.querySelector(".inPUT");
let btn = document.querySelector("button");
let cityEl = document.querySelector(".city");
let tempEl = document.querySelector(".temp");
let conditionEl = document.querySelector(".condition");


btn.addEventListener("click", () => {
  let city = input.value.trim();
  if (!city) return;

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) throw "City not found";


      const { latitude, longitude, name } = data.results[0];
      cityEl.textContent = name;

      return fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
      );

    })

    .then(res => res.json())
    .then(weather => {
      const cw = weather.current;

      tempEl.textContent = `${cw.temperature_2m}°C`;

      conditionEl.textContent = getCondition(cw.weather_code);

    })
    .catch(() => {
      cityEl.textContent = "Invalid City";
      tempEl.textContent = "---°C";
      conditionEl.textContent = "";
    })

})

function getCondition(code) {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return "Cloudy";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 71 && code <= 75) return "Snow";
  return "Weather";
}


