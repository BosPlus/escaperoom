import successUrl from './media/success.wav';
import errorUrl from './media/error.wav';
import Window from './Window';
import * as util from './util';


const SUCCESS = new Audio(successUrl);
const ERROR = new Audio(errorUrl);
const RETRY_TIMEOUT = 2 * 60 * 1000;

const TABLE = {
  Γ: '957280',
  Δ: '507928',
  Θ: '857092',
  Ξ: '802759',
  Σ: '297508',
  Ψ: '597802',
};
const TEXT_LOCKED = [
  'DECODING',
  'TABLE',
  'LOCKED',
];



const CURSOR_BLINK_INTERVAL = 1000;
const ELEMENT = 'SN';
const TABLE_WIDTH = 10;


export default class TableWindow extends Window {
  constructor() {
    super();

    this.locked = true;
    this.value = '';
    this.blinkCursor = false;

    this.disabledUntil = Date.now();
    this.countdownInterval = null;

    window.addEventListener('keydown', this._onKeyDown);
    this.blinkCursorInterval = setInterval(this._toggleBlinkCursor, CURSOR_BLINK_INTERVAL);
  }

  _bind() {
    this._onKeyDown = this._onKeyDown.bind(this);
    this._countdown = this._countdown.bind(this);
    this._toggleBlinkCursor = this._toggleBlinkCursor.bind(this);
    this._generateInput = this._generateInput.bind(this);
  }


  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
  }


  get disabled() {
    return this.disabledUntil > Date.now();
  }


  _onKeyDown(event) {
    if(this.disabled) {
      return;
    }

    let input = util.mapKey(event.code);
    if(input === 'Backspace') {
      this.value = this.value.substring(0, this.value.length - 1);
    } else if(input) {
      this.value += input;
    }

    if(this.value == ELEMENT) {
      SUCCESS.play();
      this.locked = false;
      window.removeEventListener('keydown', this._onKeyDown);
      this.emit('decodingUnlocked');
      this.requestRender();

    } else if(this.value.length == ELEMENT.length) {
      ERROR.play();
      this.disabledUntil = Date.now() + RETRY_TIMEOUT;
      if(!this.countdownInterval) {
        this.countdownInterval = setInterval(this._countdown, 1000);
      }
      this.value = '';
      this.requestRender();
    }

  }


  _countdown() {
    if(!this.disabled) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.requestRender();
  }


  _render() {
    let textKeysInterleaved = util.interleave(Object.keys(TABLE), 0, 1);
    let textKeys = util.padText(textKeysInterleaved, 1);

    let textValuesRaw = this.locked ? TEXT_LOCKED : Object.values(TABLE);
    let textValuesInterleaved = util.interleave(textValuesRaw, 0, 1);
    let textValues = util.padText(textValuesInterleaved, TABLE_WIDTH, textKeys.length, 'left');

    let textTable = textKeys.map((key, i) => {
      let value = textValues[i];
      return '│  ' + key + '  │  ' + value + '  │';
    });

    let message = [];
    if(!this.locked) {
      message = ['', ''];
    } else if(!this.disabled) {
      message = [
        'Enter element to unlock: ' + this._generateInput(),
        ''
      ];

    } else {
      message = [
        'Incorrect element.',
        'Keyboard locked for '
        + Math.floor((this.disabledUntil - Date.now()) / 1000) + 's...'
      ];
    }

    
    let text = [
      '┌─────┬──' + '─'.repeat(TABLE_WIDTH) + '──┐',
      '│     │  ' + ' '.repeat(TABLE_WIDTH) + '  │',
    ].concat(textTable, [
      '│     │  ' + ' '.repeat(TABLE_WIDTH) + '  │',
      '└─────┴──' + '─'.repeat(TABLE_WIDTH) + '──┘',
      '',
    ].concat(message));

    return text;
  }

  _generateInput()
  {
    if(this.value.length == 2)
      return this.value;
    return (
      this.value
      + (this.blinkCursor ? '█' : '░')
      + '░'.repeat(2 - this.value.length - 1)
    );

  }

  _toggleBlinkCursor() {
    this.blinkCursor = !this.disabled && !this.blinkCursor;
    this.requestRender();
  }
}
