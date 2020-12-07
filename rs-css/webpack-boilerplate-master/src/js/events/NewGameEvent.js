export const EVENT_NAME = 'NewGameEvent';

export class NewGameEvent extends CustomEvent {
  constructor() {
    super(EVENT_NAME);
  }
}
