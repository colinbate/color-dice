const colors = [
  'orange',
  '#39f',
  'yellow',
  'pink',
  'red',
  'white',
];

const MAX_INT = 2147483647;

const PREF_TYPE = 'type';
const PREF_COUNT = 'count';

function savePref(key, value) {
  window.localStorage.setItem('pref:' + key, JSON.stringify(value));
}

function getPref(key) {
  return JSON.parse(window.localStorage.getItem('pref:' + key) || 'null');
}

function rand() {
  try {
    const a = new Uint32Array(1);
    window.crypto.getRandomValues(a);
    return (a[0] & MAX_INT) / MAX_INT;
  } catch (e) {
    return Math.random();
  }
}

function randSide() {
  return Math.floor(rand() * 6);
}

function randColor() {
  return colors[randSide()];
}

function randDegree() {
  return 'deg' + Math.floor(rand() * 12);
}

const diceColor = document.getElementsByClassName('color');
const diceColorDie = document.getElementsByClassName('colordie');
const diceNum = document.getElementsByClassName('dotdie');

const toggleBtn = document.getElementById('toggleType');
const dieType = document.getElementById('type');
const click = document.getElementById('click');
const secondDice = document.getElementById('secondDice');

function setRandomColor() {
  for (let die = 0; die < diceColor.length; die += 1) {
    diceColor[die].style.backgroundColor = randColor();
  }
  for (let die2 = 0; die2 < diceColorDie.length; die2 += 1) {
    diceColorDie[die2].className = 'colordie die ' + randDegree();
  }
}

function setRandomNumber() {
  for (let die = 0; die < diceColor.length; die += 1) {
    diceNum[die].className = 'dotdie die n' + (randSide() + 1) + ' ' + randDegree();
  }
}

function setRandomSide() {
  setRandomColor();
  setRandomNumber();
}

function setDieCount(num, skipSave) {
  document.body.setAttribute('data-dice-count', num);
  if (!skipSave) {
    savePref(PREF_COUNT, num);
  } else {
    if (num + '' === '2') {
      secondDice.checked = true;
    }
  }
}

const closeBtn = document.getElementById('clear');
closeBtn.addEventListener('click', function(ev) {
  document.body.classList.add('hide');
  ev.stopPropagation();
});

document.body.addEventListener('click', function(ev) {
  if (!document.body.classList.contains('hide')) {
    document.body.classList.add('hide');
    setTimeout(function() {
      setRandomSide();
      document.body.classList.remove('hide');
    }, 100);
  } else {
    setRandomSide();
    document.body.classList.remove('hide');
  }
});

const TYPE_COLOR = 't-color';
const TYPE_NUMBER = 't-number';
const OTHER = {
  [TYPE_COLOR]: TYPE_NUMBER,
  [TYPE_NUMBER]: TYPE_COLOR
};
const TYPE_LABEL = {
  [TYPE_COLOR]: 'Colors',
  [TYPE_NUMBER]: 'Numbers'
};
function setDieType(type, skipSave) {
  document.body.classList.remove(OTHER[type]);
  document.body.classList.add(type);
  dieType.innerText = TYPE_LABEL[type];
  if (!skipSave) {
    savePref(PREF_TYPE, type);
  }
}

toggleBtn.addEventListener('click', function (ev) {
  if (document.body.classList.contains(TYPE_COLOR)) {
    setDieType(TYPE_NUMBER);
  } else {
    setDieType(TYPE_COLOR);
  }
  setTimeout(function() {
    document.body.classList.add('hide');
  }, 0);
});

secondDice.addEventListener('change', function(ev) {
  if (ev.target.checked) {
    setDieCount(2);
  } else {
    setDieCount(1);
  }
  setTimeout(function() {
    document.body.classList.add('hide');
  }, 0);
});

setDieCount(getPref(PREF_COUNT) || 1, true);
setDieType(getPref(PREF_TYPE) || TYPE_NUMBER, true);
