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

function randColor() {
  return colors[Math.floor(rand() * 6)];
}

const dieColor = document.getElementById('cc');

function setRandomColor() {
  dieColor.style.backgroundColor = randColor();
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
      setRandomColor();
      document.body.classList.remove('hide');
    }, 100);
  } else {
    setRandomColor();
    document.body.classList.remove('hide');
  }
});