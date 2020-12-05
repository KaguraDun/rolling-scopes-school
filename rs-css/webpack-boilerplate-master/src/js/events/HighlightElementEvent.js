export const EVENT_NAME = 'HighlightElementEvent';

export class HighlightElementEvent extends CustomEvent {
  constructor(element) {
    super(EVENT_NAME, { detail: { element } });
  }
}
