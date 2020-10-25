class Momentum {
  constructor(date, time, greeting, page, name, focus) {
    this.dateTextElement = document.querySelector(date);
    this.timeTextElement = document.querySelector(time);
    this.greetingTextElement = document.querySelector(greeting);
    this.nameTextElement = document.querySelector(name);
    this.focusTextElement = document.querySelector(focus);
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
    this.timeTextElement.innerHTML = `${this.addZero(hour)} : ${this.addZero(
      minute
    )} : ${this.addZero(second)}`;

    if (minute == 0 && second == 0) this.changeBg(hour);

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

  changeBg(currHour) {
    let hour = currHour || new Date().getHours();

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

    this.currentBgId = hour;

    let self = this;
    let img = document.createElement("img");
    img.src = this.pathArr[this.currentBgId];

    //Ожидаем пока картинка полностью загрузится
    img.onload = function () {
      self.page.style.backgroundImage = `url("${img.src}")`;
    };
  }

  changeBgByClick() {
    let self = this;
    self.currentBgId++;
    if (self.currentBgId > 23) self.currentBgId = 0;

    let img = document.createElement("img");
    img.src = this.pathArr[this.currentBgId];

    //Ожидаем пока картинка полностью загрузится
    img.onload = function () {
      self.page.style.backgroundImage = `url("${img.src}")`;
    };
  }

  getName() {
    if (localStorage.getItem("name") == null) {
      this.nameTextElement.textContent = "[Enter Name]";
    } else {
      this.nameTextElement.textContent = localStorage.getItem("name");
    }
  }

  getFocus() {
    if (localStorage.getItem("focus") == null) {
      this.focusTextElement.textContent = "[Enter Focus]";
    } else {
      this.focusTextElement.textContent = localStorage.getItem("focus");
    }
  }

  setName = (e) => {
    if (e.type == "keypress") {
      if (e.key == "Enter") {
        if (this.nameTextElement.textContent.trim() != "") {
          localStorage.setItem("name", this.nameTextElement.textContent);
          this.nameTextElement.blur();
        } else {
          this.getName();
          this.nameTextElement.blur();
        }
      }
    } else {
      if (this.nameTextElement.textContent.trim() != "") {
        localStorage.setItem("name", this.nameTextElement.textContent);
      } else {
        this.getName();
      }
    }
  };

  setFocus = (e) => {
    if (e.type == "keypress") {
      if (e.key == "Enter") {
        if (this.focusTextElement.textContent.trim() != "") {
          localStorage.setItem("focus", this.focusTextElement.textContent);
          this.focusTextElement.blur();
        } else {
          this.getFocus();
          this.focusTextElement.blur();
        }
      }
    } else {
      if (this.focusTextElement.textContent.trim() != "") {
        localStorage.setItem("focus", this.focusTextElement.textContent);
      } else {
        this.getFocus();
      }
    }
  };
}
