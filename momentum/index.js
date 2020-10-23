class Momentum {
  constructor(date, time, name, greeting, page) {
    this.dateTextElement = document.querySelector(date);
    this.timeTextElement = document.querySelector(time);
    this.nameTextElement = document.querySelector(name);
    this.greetingTextElement = document.querySelector(greeting);
    this.page = document.querySelector(page);
    this.pathArr = this.createBgArr();
    this.currentBgId = 0;
  }

  showTime = () => {
    // prettier-ignore
    const DAY_NAME = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    // prettier-ignore
    const MONTH_NAME = ["january","february","march","april","may","june","july","august","september","october","november","december"];

    let today = new Date();
    let month = MONTH_NAME[today.getMonth()];
    let day = today.getDate();
    let week = DAY_NAME[today.getDay()];
    let hour = today.getHours();
    let minute = today.getMinutes();
    let second = today.getSeconds();

    this.dateTextElement.innerHTML = `Today is ${week}, ${day} ${month}`;
    this.timeTextElement.innerHTML = `${hour} : ${this.addZero(
      minute
    )} : ${this.addZero(second)}`;

    setTimeout(this.showTime, 1000);
  };

  addZero(num) {
    return +num < 10 ? "0" + num : num;
  }

  // Перемашать элементы в массиве в случайном порядке
  shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  getRandomBgArr(timeOfDay) {
    const PATH = `/assets/images/`;
    // prettier-ignore
    const NUMBERS = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20"];
    let bgArr = [];
    let rndNumbers = this.shuffle(NUMBERS).slice(0, 6);

    for (let i = 0; i < 6; i++) {
      let imgPath = `${PATH}${timeOfDay}/${rndNumbers[i]}.jpg`;
      bgArr.push(imgPath);
    }
    return bgArr;
  }

  createBgArr() {
    let pathArr = [];
    pathArr = pathArr.concat(this.getRandomBgArr("night"));
    pathArr = pathArr.concat(this.getRandomBgArr("morning"));
    pathArr = pathArr.concat(this.getRandomBgArr("day"));
    pathArr = pathArr.concat(this.getRandomBgArr("evening"));
    return pathArr;
  }

  changeBg = () => {
    let today = new Date();
    let hour = today.getHours();
    let second = today.getSeconds();

    if (hour >= 0 && hour < 6) {
      this.greetingTextElement.innerHTML = "Good night";
    }
    if (hour >= 6 && hour < 12) {
      this.greetingTextElement.innerHTML = "Good morning";
    }
    if (hour >= 12 && hour < 18) {
      this.greetingTextElement.innerHTML = "Good day";
    }
    if (hour >= 18 && hour < 24) {
      this.greetingTextElement.innerHTML = "Good evening";
    }
    this.page.style.backgroundImage = `url("${this.pathArr[hour]}")`;
    setTimeout(this.changeBg, 1000 * 3600);
  };

  changeBgByClick = () => {
    let self = this;
    let img = document.createElement("img");
    img.src = this.pathArr[this.currentBgId];

    //Ожидаем пока картинка полностью загрузится
    img.onload = function () {
      if (self.currentBgId > 23) self.currentBgId = 0;
      self.page.style.backgroundImage = `url("${img.src}")`;
      self.currentBgId++;
    };
  };
}

const btnChangeBg = document.querySelector(".btn-change-bg");
const momentum = new Momentum(".date", ".time", ".name", ".greeting", ".page");
momentum.showTime();
momentum.changeBg();

btnChangeBg.addEventListener("click", () => {
  momentum.changeBgByClick();
  btnChangeBg.disabled = true;
  setTimeout(function () {
    btnChangeBg.disabled = false;
  }, 1000);
});
