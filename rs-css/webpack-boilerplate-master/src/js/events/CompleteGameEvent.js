export const EVENT_NAME = 'CompleteGameEvent';

export class CompleteGameEvent extends CustomEvent {
  constructor() {
    super(EVENT_NAME);
  }
}
