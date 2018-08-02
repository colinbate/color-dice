const colors = [
  'orange',
  '#39f',
  'yellow',
  'pink',
  'red',
  'white',
];

const MAX_INT = 2147483647;

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

function setDieCount(num) {
  document.body.setAttribute('data-dice-count', num);
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

toggleBtn.addEventListener('click', function (ev) {
  if (document.body.classList.contains('t-color')) {
    document.body.classList.remove('t-color');
    document.body.classList.add('t-number');
    dieType.innerText = 'Numbers';
  } else {
    document.body.classList.remove('t-number');
    document.body.classList.add('t-color');
    dieType.innerText = 'Colors';
  }
  setTimeout(function() {
    document.body.classList.add('hide');
  }, 0);
});

secondDice.addEventListener('change', function(ev) {
  if (ev.target.checked) {
    document.body.classList.add('hide');
    setDieCount(2);
  } else {
    setDieCount(1);
  }
});

setDieCount(1);
