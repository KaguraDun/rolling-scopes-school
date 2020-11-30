export const EVENT_NAME = 'ChangeLevelEvent';

export class ChangeLevelEvent extends CustomEvent {
  constructor(selectedLevel) {
    super(EVENT_NAME, { detail: { selectedLevel } });
  }
}
