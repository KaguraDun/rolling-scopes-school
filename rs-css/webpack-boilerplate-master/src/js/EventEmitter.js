// Event emitter pattern: https://medium.com/@an_parubets/pattern-event-emitter-js-9378aa082e86

export default class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  addEvent(eventName, callback) {
    const events = this.events.get(eventName);

    if (!events) {
      this.events.set(eventName, [callback]);
      return;
    }

    events.push(callback);
  }

  removeEvent(eventName, callback) {
    const events = this.events.get(eventName);

    if (events) {
      const eventIndex = events.findIndex((func) => func === callback);

      events.splice(eventIndex, 1);
    }
  }

  emit(eventName) {
    const events = this.events.get(eventName.type);

    if (events) {
      events.forEach((listener) => listener(eventName));
    }
  }
}
