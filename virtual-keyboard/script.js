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
    _selectionStart: null,
    _selectionEnd: null,
  },

  init() {
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    this.elements.main.classList.add("keyboard", "keyboard-hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    //Убираем блюр при нажатии на клавиатуру
    this.elements.keysContainer.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      ".keyboard__key"
    );

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    this.elements.input = document.querySelectorAll(".use-keyboard-input");

    this.elements.input.forEach((element) => {
      element.addEventListener("focus", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });

      element.addEventListener("change", () => {
        this.properties._selectionStart = element.selectionStart;
        this.properties._selectionEnd = element.selectionEnd;
        this.elements.currentInput = element;

        this.properties.value = element.value;
      });

      element.addEventListener("keyup", () => {
        this.properties._selectionStart = element.selectionStart;
        this.properties._selectionEnd = element.selectionEnd;
        this.elements.currentInput = element;

        this.properties.value = element.value;
      });

      element.addEventListener("mouseup", () => {
        this.properties._selectionStart = element.selectionStart;
        this.properties._selectionEnd = element.selectionEnd;
        this.elements.currentInput = element;
        this.properties.value = element.value;
      });

      element.addEventListener("click", () => {
        this.properties._selectionStart = element.selectionStart;
        this.properties._selectionEnd = element.selectionEnd;
        this.elements.currentInput = element;
        this.properties.value = element.value;
      });
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
      this.properties._selectionStart++;
      this.properties._selectionEnd = this.properties._selectionStart;
    }
    return this.elements.currentInput.value;
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    //prettier-ignore
    const keyLayout = [
      "arrow_back","arrow_forward",
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps","a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "space"
    ];

    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      // Проверить include
      const insertLineBreak =
        ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

      // keyElement.setAttribute("type","button")

      keyElement.classList.add("keyboard__key");

      switch (key) {
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
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
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
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            let currentKey = this.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase();

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
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
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
