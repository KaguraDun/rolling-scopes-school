const nameTextElement = document.querySelector(".name");
const focusTextElement = document.querySelector(".focus");
const cityTextElement = document.querySelector(".weather-city");
const btnChangeBg = document.querySelector(".btn-change-bg");
const btnChangeQuote = document.querySelector(".btn-change-quote");

const weather = new Weather(
  ".weather-city",
  ".weather-icon",
  ".weather-temperature",
  ".weather-description",
  ".weather-wind",
  ".weather-humidity",
);
const quote = new Quote(".blockquote", "figcaption");
const momentum = new Momentum(
  ".date",
  ".time",
  ".greeting",
  ".page",
  ".name",
  ".focus"
);

momentum.showTime();
momentum.changeBg();
momentum.getName();
momentum.getFocus();
weather.getCity();
quote.getQuote();

btnChangeBg.addEventListener("click", () => {
  momentum.changeBgByClick();
  btnChangeBg.disabled = true;
  btnChangeBg.classList.add("btn-rotate");

  setTimeout(function () {
    btnChangeBg.classList.remove("btn-rotate");
    btnChangeBg.disabled = false;
  }, 1000);
});

btnChangeQuote.addEventListener("click", () => {
  quote.getQuote();
  btnChangeQuote.disabled = true;
  btnChangeQuote.classList.add("btn-rotate");

  setTimeout(function () {
    btnChangeQuote.classList.remove("btn-rotate");
    btnChangeQuote.disabled = false;
  }, 1000);
});

nameTextElement.addEventListener("keypress", momentum.setName);
nameTextElement.addEventListener("click", () => {
  nameTextElement.textContent = "";
});
nameTextElement.addEventListener("blur", momentum.setName);

focusTextElement.addEventListener("keypress", momentum.setFocus);
focusTextElement.addEventListener("click", () => {
  focusTextElement.textContent = "";
});
focusTextElement.addEventListener("blur", momentum.setFocus);

cityTextElement.addEventListener("keypress", weather.setCity);
cityTextElement.addEventListener("click", () => {
  cityTextElement.textContent = "";
});
cityTextElement.addEventListener("blur", weather.setCity);
