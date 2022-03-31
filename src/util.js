const KEY_MAP = {
  NumLock: 'K',
  NumpadDivide: 'S',
  NumpadMultiply: 'M',
  NumpadSubtract: 'U',
  NumpadAdd: 'A',
  NumpadDecimal: 'T',
  Backspace: 'Backspace',

  Numpad0: 'N',
  Numpad1: 'X',
  Numpad2: 'W',
  Numpad3: 'L',
  Numpad4: 'Z',
  Numpad5: 'D',
  Numpad6: 'G',
  Numpad7: 'E',
  Numpad8: 'Y',
  Numpad9: 'P',

  // This is for when NumLock is disabled
  Insert: 'N',
  Delete: 'T',
  End: 'X',
  ArrowDown: 'W',
  PageDown: 'L',
  ArrowLeft: 'Z',
  NumpadClear: 'D',
  ArrowRight: 'G',
  Home: 'E',
  ArrowUp: 'Y',
  PageUp: 'P',
};
export function getCharDimensions(elem) {
  return [
    getCharDimension(elem, ' ', 'offsetWidth'),
    getCharDimension(elem, '<br>', 'offsetHeight'),
  ];
}

function getCharDimension(elem, testString, sizeProperty) {
  let min = 1;
  let max = Infinity;

  let elemTest = document.createElement('div');
  elemTest.style.position = 'absolute';
  elem.appendChild(elemTest);

  while(min < max - 1) {
    let test = Number.isFinite(max) ? Math.round((min + max) / 2) : min * 2;
    let text = testString.repeat(test);
    elemTest.innerHTML = text;
    if(elemTest[sizeProperty] > elem[sizeProperty]) {
      max = test;
    } else {
      min = test;
    }
  }

  elem.removeChild(elemTest);
  return min;
}


export function interleave(argText, hNumChars, vNumLines) {
  let text = [];
  for(let i = 0; i < argText.length; i += 1) {
    let line = argText[i].split('').join(' '.repeat(hNumChars));
    text = text.concat(Array(i === 0 ? 0 : vNumLines).fill(''), [line]);
  }
  return text;
}


export function padText(text, argWidth = null, argHeight = null, hAlign = 'center', vAlign = 'center', character = ' ') {
  let width = argWidth == null ? Math.max(...text.map(line => line.length)) : argWidth;
  let height = argHeight == null ? text.length : argHeight;

  let [vPadBefore, vPadAfter] = getPad(height - text.length, vAlign);

  let vPaddedText = [].concat(
    new Array(vPadBefore).fill(''),
    text,
    new Array(vPadAfter).fill(''),
  );

  return vPaddedText.map(line => padLine(line, width, hAlign, character));
}

export function padLine(line, width, hAlign = 'center', character = ' ') {
  let [hPadBefore, hPadAfter] = getPad(width - line.length, hAlign);
  return character.repeat(hPadBefore) + line + character.repeat(hPadAfter);
}

function getPad(pad, align) {
  if(align === 'top' || align === 'left') {
    return [0, pad];
  }
  if(align === 'bottom' || align === 'right') {
    return [pad, 0];
  }

  return [Math.floor(pad / 2), Math.ceil(pad / 2)];
}


export function boxify(text) {
  let width = Math.max(...text.map(line => line.length));
  return [].concat(
    [
      '┌──' + '─'.repeat(width) + '──┐',
      '│  ' + ' '.repeat(width) + '  │',
    ],
    text.map(line => '│  ' + line + '  │'),
    [
      '│  ' + ' '.repeat(width) + '  │',
      '└──' + '─'.repeat(width) + '──┘',
    ],
  );
}


export function arePermutations(str1, str2) {
  return str1.split('').sort().join('') === str2.split('').sort().join('');
}

export function mapKey(input) {
  return KEY_MAP[input];
}
