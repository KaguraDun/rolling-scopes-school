const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    input: null,
    currentInput: null,
    textRecognition: null,
    lastPressedKey: null,
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
    onfocus: null,
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    //язык по умолчанию english
    changeLanguage: false,
    speechRecognition: false,
    enableSound: false,
    _selectionStart: 0,
    _selectionEnd: 0,
  },

  init() {
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");
    this.elements.main.classList.add("keyboard", "keyboard-hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    if (document.querySelector(".keyboard")) {
      //Если клавиатура уже существует, то заменяем на клавиатуру с другим языком
      document.querySelector(".keyboard__keys").replaceWith(this.elements.keysContainer);
      this.elements.main = document.querySelector(".keyboard");
    } else {
      this.elements.main.appendChild(this.elements.keysContainer);
      document.body.appendChild(this.elements.main);
    }

    this.elements.keysContainer.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    this.elements.input = document.querySelectorAll(".use-keyboard-input");

    this.elements.input.forEach((element) => {
      this.elements.currentInput = element;

      element.addEventListener("focus", () => {
        this.properties._selectionStart = element.selectionStart;
        this.properties._selectionEnd = element.selectionEnd;

        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });

      //Подсветка нажатия клавиш
      element.addEventListener("keydown", (e) => {
        this.properties.value = element.value;
        let virtualKey = document.getElementById(e.key.toLowerCase());

        if (this.elements.lastPressedKey) {
          this.elements.lastPressedKey.classList.remove("keyboard__key--click");
        }

        switch (e.key) {
          case "Shift":
          case "CapsLock":
            break;

          case " ":
            virtualKey = document.getElementById("space");
            virtualKey.classList.add("keyboard__key--click");
            this.elements.lastPressedKey = virtualKey;
            break;

          case "Backspace":
          case "Enter":
          default:
            if (!virtualKey) return;
            virtualKey.classList.add("keyboard__key--click");
            this.elements.lastPressedKey = virtualKey;
            break;
        }

        this.properties._selectionStart = element.selectionStart;
        this.properties._selectionEnd = element.selectionEnd;

      });

      [("change", "keyup", "mouseup", "click")].forEach((evt) =>
        element.addEventListener(evt, () => {
          this.properties._selectionStart = element.selectionStart;
          this.properties._selectionEnd = element.selectionEnd;
          this.elements.currentInput = element;
          this.properties.value = element.value;
        })
      );
    });

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  },

  //Для того чтобы реальная клавиатура работала с виртуальной
  _advancedInput(insertValue) {
    this.elements.currentInput.setRangeText(
      insertValue,
      this.properties._selectionStart,
      this.properties._selectionEnd,
      "end"
    );

    if (this.properties._selectionStart == this.properties._selectionEnd) {
      this.properties._selectionStart++;
      this.properties._selectionEnd++;
    } else {
      this.properties._selectionEnd = ++this.properties._selectionStart;
    }

    return this.elements.currentInput.value;
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    //prettier-ignore
    const keyLayoutEn = [  
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "arrow_back","arrow_forward","q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]","\\",
      "caps","a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".","/", "language",
      "click-sound","speech-recognition","space","done"
    ];
    //prettier-ignore
    const keyLayoutShiftEn = [
      "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "backspace",
      "arrow_back","arrow_forward","Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}","|",
      "caps","A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "enter",
      "shift","Z", "X", "C", "V", "B", "N", "M", "<", ">", "?","language",
      "click-sound","speech-recognition","space","done"
        ];
    //prettier-ignore
    const keyLayoutRu =  [
      "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "arrow_back","arrow_forward","й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ","\\",
      "caps","ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "shift","я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".","language",
      "click-sound","speech-recognition","space","done"
    ];
    //prettier-ignore
    const keyLayoutShiftRu =  [
      "Ё", "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace",
      "arrow_back","arrow_forward","Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ","/",
      "caps","Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "enter",
      "shift", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ",","language",
      "click-sound","speech-recognition","space","done"
    ];

    const createIconHTML = (icon_name, text = "") => {
      return `<i class="material-icons">${icon_name}</i><span class="keyboard__icon-text">${text}</span>`;
    };

    let keyLayout;

    if (this.properties.changeLanguage == true && this.properties.shift == false) keyLayout = keyLayoutRu;
    if (this.properties.changeLanguage == true && this.properties.shift == true) keyLayout = keyLayoutShiftRu;
    if (this.properties.changeLanguage == false && this.properties.shift == false) keyLayout = keyLayoutEn;
    if (this.properties.changeLanguage == false && this.properties.shift == true) keyLayout = keyLayoutShiftEn;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      let insertLineBreak;

      if (this.properties.changeLanguage) {
        insertLineBreak = ["backspace", "\\", "/", "enter", "language"].indexOf(key) !== -1;
      } else {
        insertLineBreak = ["backspace", "\\", "|", "enter", "language"].indexOf(key) !== -1;
      }

      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "click-sound":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("volume_up");

          if (this.properties.enableSound) {
            keyElement.classList.add("keyboard__key--active");
          } else {
            keyElement.classList.remove("keyboard__key--active");
          }

          keyElement.addEventListener("click", () => {
            this.properties.enableSound = !this.properties.enableSound;

            let clickSound = new Audio();

            if (this.properties.enableSound) {
              clickSound.src = "../../assets/sounds/enable-sound.wav";
            } else {
              clickSound.src = "../../assets/sounds/disable-sound.wav";
            }

            clickSound.play();

            keyElement.classList.toggle("keyboard__key--active", this.properties.enableSound);
          });

          break;
        case "speech-recognition":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.classList.toggle("keyboard__key--active", this.properties.speechRecognition);
          keyElement.innerHTML = createIconHTML("mic");

          keyElement.addEventListener("click", () => {
            this.properties.speechRecognition = !this.properties.speechRecognition;

            if (this.properties.enableSound) {
              let clickSound = new Audio();

              if (this.properties.speechRecognition) {
                clickSound.src = "../../assets/sounds/speak.wav";
              } else {
                clickSound.src = "../../assets/sounds/stop-speaking.wav";
              }

              clickSound.play();
            }

            this._speechRecognize();
            keyElement.classList.toggle("keyboard__key--active", this.properties.speechRecognition);
          });

          break;

        case "language":
          keyElement.classList.add("keyboard__key--wide");

          if (this.properties.changeLanguage) {
            keyElement.innerHTML = createIconHTML("language", "RU");
          } else {
            keyElement.innerHTML = createIconHTML("language", "EN");
          }

          keyElement.addEventListener("click", () => {
            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/change-language.wav";
              clickSound.play();
            }

            this.properties.changeLanguage = !this.properties.changeLanguage;
            this.init();
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--double-wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("upgrade", "Shift");
          keyElement.id = "shift";

          if (this.properties.shift) {
            keyElement.classList.add("keyboard__key--active");
          } else {
            keyElement.classList.remove("keyboard__key--active");
          }

          this._toggleCapsLock;

          keyElement.addEventListener("click", () => {
            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/shift.wav";
              clickSound.play();
            }

            this.properties.shift = !this.properties.shift;

            if (this.properties.shift) {
              keyElement.classList.add("keyboard__key--active");
            } else {
              keyElement.classList.remove("keyboard__key--active");
            }

            this.init();
          });
          break;

        case "arrow_back":
          keyElement.innerHTML = createIconHTML("arrow_back");
          keyElement.id = "arrowleft";

          keyElement.addEventListener("click", () => {
            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/left.wav";
              clickSound.play();
            }

            if (this.properties._selectionStart > 0 && this.properties._selectionEnd > 0) {
              this.elements.currentInput.selectionStart = --this.properties._selectionStart;
              this.elements.currentInput.selectionEnd = --this.properties._selectionEnd;
            }
          });
          break;

        case "arrow_forward":
          keyElement.innerHTML = createIconHTML("arrow_forward");
          keyElement.id = "arrowright";

          keyElement.addEventListener("click", () => {
            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/right.wav";
              clickSound.play();
            }

            if (
              this.properties._selectionStart < this.properties.value.length &&
              this.properties._selectionEnd < this.properties.value.length
            ) {
              this.elements.currentInput.selectionStart = ++this.properties._selectionStart;
              this.elements.currentInput.selectionEnd = ++this.properties._selectionEnd;
            }
          });
          break;

        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.id = "backspace";

          keyElement.addEventListener("click", () => {
            this._disableLastPressedKey();

            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/backspace.wav";
              clickSound.play();
            }

            let newValue =
              this.properties.value.slice(0, this.properties._selectionStart - 1) +
              this.properties.value.slice(this.properties._selectionStart);

            this.properties.value = newValue;

            this.elements.currentInput.value = this.properties.value;

            this.properties._selectionStart--;
            this.properties._selectionEnd--;

            this.elements.currentInput.selectionStart = this.properties._selectionStart;
            this.elements.currentInput.selectionEnd = this.properties._selectionEnd;

          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          keyElement.id = "capslock";

          //Для активности при нажатой клавиши shift
          if (this.properties.capsLock) {
            keyElement.classList.add("keyboard__key--active");
          } else {
            keyElement.classList.remove("keyboard__key--active");
          }

          this._toggleCapsLock();

          keyElement.addEventListener("click", () => {
            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/capslock.wav";
              clickSound.play();
            }

            this.properties.capsLock = !this.properties.capsLock;
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });
          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.id = "enter";

          keyElement.addEventListener("click", () => {
            this._disableLastPressedKey();

            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/enter.wav";
              clickSound.play();
            }

            this.properties.value = this.properties.value = this._advancedInput("\n");
            this._triggerEvent("oninput");
          });
          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.id = "space";

          keyElement.addEventListener("click", () => {
            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/whitespace.wav";
              clickSound.play();
            }

            this.properties.value = this.properties.value = this._advancedInput(" ");
            this._triggerEvent("oninput");
          });
          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            if (this.properties.enableSound) {
              let clickSound = new Audio();
              clickSound.src = "../../assets/sounds/close.wav";
              clickSound.play();
            }

            keyElement.classList.add("keyboard__key:active");
            this.close();
            this._triggerEvent("onclose");
          });
          break;

        default:
          if (this.properties.shift == true && this.properties.capsLock == true) {
            keyElement.textContent = key.toLowerCase();
          } else if (this.properties.shift == false && this.properties.capsLock == true) {
            keyElement.textContent = key.toUpperCase();
          } else {
            keyElement.textContent = key;
          }

          keyElement.id = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this._disableLastPressedKey();

            if (this.properties.enableSound) {
              let clickSound = new Audio();
              if (this.properties.changeLanguage) {
                clickSound.src = "../../assets/sounds/click-ru.wav";
              } else {
                clickSound.src = "../../assets/sounds/click-en.wav";
              }
              clickSound.play();
            }

            let currentKey = "";

            if (this.properties.shift == true && this.properties.capsLock == false) currentKey = key;
            if (this.properties.shift == false && this.properties.capsLock == false) currentKey = key;
            if (this.properties.shift == true && this.properties.capsLock == true) currentKey = key.toLowerCase();
            if (this.properties.shift == false && this.properties.capsLock == true) currentKey = key.toUpperCase();

            this.properties.value = this._advancedInput(currentKey);
            this._triggerEvent("oninput");
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _disableLastPressedKey() {
    if (this.elements.lastPressedKey && this.elements.lastPressedKey.classList.contains("keyboard__key--click")) {
      this.elements.lastPressedKey.classList.remove("keyboard__key--click");
    }
  },

  _recognizeResult(e) {
    const transcript = e.results[0][0].transcript;

    if (e.results[0].isFinal) {
      let input = document.querySelector(".use-keyboard-input");
      input.value += transcript + " ";
    }
  },

  _speechRecognize() {
    if (this.properties.speechRecognition) {
      this.elements.textRecognition = new SpeechRecognition();
      this.elements.textRecognition.interimResults = true;
      this.elements.textRecognition.lang = this.properties.changeLanguage ? "ru-RU" : "en-US";

      this.elements.textRecognition.addEventListener("result", this._recognizeResult);
      this.elements.textRecognition.addEventListener("end", this.elements.textRecognition.start);
      this.elements.textRecognition.start();
    } else {
      this.elements.textRecognition.removeEventListener("end", this.elements.textRecognition.start);
      this.elements.textRecognition.stop();
    }
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.shift == true && this.properties.capsLock == true)
          key.textContent = key.textContent.toLowerCase();
        if (this.properties.shift == true && this.properties.capsLock == false)
          key.textContent = key.textContent.toUpperCase();
        if (this.properties.shift == false && this.properties.capsLock == true)
          key.textContent = key.textContent.toUpperCase();
        if (this.properties.shift == false && this.properties.capsLock == false)
          key.textContent = key.textContent.toLowerCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.input[0].blur();
    this.elements.main.classList.add("keyboard--hidden");
  },
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
