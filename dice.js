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

const dieColor = document.getElementById('cc');
const dieNum = document.getElementById('ddots');
const toggleBtn = document.getElementById('toggleType');
const dieType = document.getElementById('type');

function setRandomColor() {
  dieColor.style.backgroundColor = randColor();
}

function setRandomNumber() {
  dieNum.className = 'die n' + (randSide() + 1);
}

function setRandomSide() {
  setRandomColor();
  setRandomNumber();
}

const close = document.getElementById('clear');
close.addEventListener('click', function(ev) {
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
  
  ev.stopPropagation();
})
