const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    input: null,
    currentInput: null,
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
    _selectionStart: null,
    _selectionEnd: null,
  },

  init() {
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");
    this.elements.main.classList.add("keyboard", "keyboard-hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      ".keyboard__key"
    );

    if (document.querySelector(".keyboard")) {
      //Если клавиатура уже существует, то заменяем на клавиатуру с другим языком
      document
        .querySelector(".keyboard__keys")
        .replaceWith(this.elements.keysContainer);

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
      element.addEventListener("focus", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });

      ["change", "keyup", "mouseup", "click"].forEach((evt) =>
        element.addEventListener(evt, () => {
          this.properties._selectionStart = element.selectionStart;
          this.properties._selectionEnd = element.selectionEnd;
          this.elements.currentInput = element;

          this.properties.value = element.value;
        })
      );
    });
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
    console.log();
    const fragment = document.createDocumentFragment();
    //prettier-ignore
    const keyLayoutEn = [
      "arrow_back","arrow_forward",
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "caps","q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "shift", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
       "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
      "language","space","done"
    ];
    //prettier-ignore
    const keyLayoutShiftEn = [
      "arrow_back","arrow_forward",
      "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "backspace",
      "caps","Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}",
      "shift", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "enter",
        "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?",
      "language","space","done"
        ];
    //prettier-ignore
    const keyLayoutRu =  [
      "arrow_back","arrow_forward",
      "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "caps","й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "shift", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
       "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "language","space","done"
    ];
    //prettier-ignore
    const keyLayoutShiftRu =  [
      "arrow_back","arrow_forward",
      "Ё", "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace",
      "caps","Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ",
      "shift", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "enter",
       "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ",",
      "language","space","done"
    ];

    const createIconHTML = (icon_name, text = "") => {
      return `<i class="material-icons">${icon_name}</i><span class="keyboard__icon-text">${text}</span>`;
    };

    let keyLayout;
    //prettier-ignore
    if(this.properties.changeLanguage == true && this.properties.shift == false)  keyLayout = keyLayoutRu;
    //prettier-ignore
    if(this.properties.changeLanguage == true && this.properties.shift == true)  keyLayout = keyLayoutShiftRu;
    //prettier-ignore
    if(this.properties.changeLanguage == false && this.properties.shift == false)  keyLayout = keyLayoutEn;
    //prettier-ignore
    if(this.properties.changeLanguage == false && this.properties.shift == true)  keyLayout = keyLayoutShiftEn;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      let insertLineBreak;
      // Проверить include
      if (this.properties.changeLanguage) {
        insertLineBreak =
          ["backspace", "ъ", "Ъ", "enter", ".", ","].indexOf(key) !== -1;
      } else {
        insertLineBreak =
          ["backspace", "]", "}", "enter", "/", "?"].indexOf(key) !== -1;
      }

      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "language":
          keyElement.classList.add("keyboard__key--wide");

          if (this.properties.changeLanguage) {
            keyElement.innerHTML = createIconHTML("language", "RU");
          } else {
            keyElement.innerHTML = createIconHTML("language", "EN");
          }

          keyElement.addEventListener("click", () => {
            this.properties.changeLanguage = !this.properties.changeLanguage;
            this.init();
          });

          break;

        case "shift":
          keyElement.classList.add(
            "keyboard__key--double-wide",
            "keyboard__key--activatable"
          );

          keyElement.classList.toggle(
            "keyboard__key--active",
            this.properties.shift
          );

          this._toggleCapsLock;

          keyElement.innerHTML = createIconHTML("upgrade", "shift");

          keyElement.addEventListener("click", () => {
            this.properties.shift = !this.properties.shift;
            this.init();
          });
          break;

        case "arrow_back":
          keyElement.innerHTML = createIconHTML("arrow_back");
          keyElement.addEventListener("click", () => {
            if (
              this.properties._selectionStart > 0 &&
              this.properties._selectionEnd > 0
            ) {
              this.elements.currentInput.selectionStart = --this.properties
                ._selectionStart;
              this.elements.currentInput.selectionEnd = --this.properties
                ._selectionEnd;
            }
          });
          break;

        case "arrow_forward":
          keyElement.innerHTML = createIconHTML("arrow_forward");
          keyElement.addEventListener("click", () => {
            if (
              this.properties._selectionStart < this.properties.value.length &&
              this.properties._selectionEnd < this.properties.value.length
            ) {
              this.elements.currentInput.selectionStart = ++this.properties
                ._selectionStart;
              this.elements.currentInput.selectionEnd = ++this.properties
                ._selectionEnd;
            }
          });
          break;

        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            );
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--activatable"
          );

          if (this.properties.capsLock) {
            keyElement.classList.add("keyboard__key--active");
          } else {
            keyElement.classList.remove("keyboard__key--active");
          }

          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this.properties.capsLock = !this.properties.capsLock;
            this._toggleCapsLock();

            keyElement.classList.toggle(
              "keyboard__key--active",
              this.properties.capsLock
            );
          });
          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value = this._advancedInput(
              "\n"
            );
            this._triggerEvent("oninput");
          });
          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value = this._advancedInput(
              " "
            );
            this._triggerEvent("oninput");
          });
          break;

        case "done":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--dark"
          );
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });
          break;

        default:
          keyElement.textContent = key;

          keyElement.addEventListener("click", () => {
            let currentKey = "";
            //prettier-ignore
            if (this.properties.shift == true && this.properties.capsLock == false) currentKey = key;
            //prettier-ignore
            if (this.properties.shift == false && this.properties.capsLock == false) currentKey = key;
            //prettier-ignore
            if (this.properties.shift == true && this.properties.capsLock == true) currentKey = key.toLowerCase();
            //prettier-ignore
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

  _toggleShift() {
    //prettier-ignore
    const keyLayoutShiftRu =  [
      "arrow_back","arrow_forward",
      "Ё", "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace",
      "caps","Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ",
      "shift", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "enter",
       "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ",",
      "language","space","done"
    ];

    this.properties.shift = !this.properties.shift;
    let i = 0;
    for (const key of this.elements.keys) {
      console.log(key);
      if (key.childElementCount === 0) {
        key.textContent = keyLayoutShiftRu[i];
      }
      i++;
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
