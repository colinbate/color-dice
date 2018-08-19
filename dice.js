(function() {
  'use strict';

const MAX_INT = 2147483647;
const TRIGGER_KEY = 'triggerRoll';
const HIDE = 'hide';
const LOCK = 'lock';
const CLICK = 'click';

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
  return 'n' + (Math.floor(rand() * 6) + 1);
}

function randDegree() {
  return 'deg' + Math.floor(rand() * 12);
}

function triggerLocalRolls() {
  window.localStorage.setItem(TRIGGER_KEY, 't' + rand());
}

const board = document.getElementById('board');
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamb');

hamburger.addEventListener(CLICK, function(ev) {
  nav.classList.toggle('is-active');
  ev.stopPropagation();
});

function setClassOfType(el, className, typePrefix) {
  const classes = el.className.split(' ');
  for (let cIndex = 0; cIndex < classes.length; cIndex += 1) {
    if (classes[cIndex].indexOf(typePrefix) === 0 && classes[cIndex] !== className) {
      el.classList.remove(classes[cIndex]);
    }
  }
  el.classList.add(className);
}

function setRandomSide(el) {
  if (!el.classList.contains(LOCK)) {
    el.className = 'die ' + randSide() + ' ' + randDegree();
  }
}

const diceSet = [];
function setRandomSides() {
  for (let d = 0; d < diceSet.length; d += 1) {
    setRandomSide(diceSet[d]);
  }
}

function clearDice() {
  const locked = board.querySelectorAll('.die.' + LOCK);
  for (let k = 0; k < locked.length; k += 1) {
    locked[k].classList.remove(LOCK);
  }
  document.body.classList.add(HIDE);
}

let init = true;
function rollDice() {
  if (init) {
    init = false;
    board.classList.remove('init');
  }
  if (!document.body.classList.contains(HIDE)) {
    document.body.classList.add(HIDE);
    setTimeout(function() {
      setRandomSides();
      document.body.classList.remove(HIDE);
    }, 100);
  } else {
    setRandomSides();
    document.body.classList.remove(HIDE);
  }
}

let longPressed = false;
function lockingDie(ev) {
  if (ev.target && ev.target.classList.contains('die') && (ev.shiftKey || ev.type === 'long-press')) {
    if (!ev.target.classList.contains('degx')) {
      setClassOfType(ev.target, 'degx', 'deg');
    }
    ev.target.classList.toggle(LOCK);
    return true;
  }
  if (longPressed) {
    longPressed = false;
    return true;
  }
  return false;
}

window.addEventListener('storage', function (sev) {
  if (sev.key === TRIGGER_KEY) {
    rollDice();
  }
});

document.body.addEventListener(CLICK, function(ev) {
  if (!lockingDie(ev)) {
    triggerLocalRolls();
    rollDice();
  }
});

const PREFS_KEY = 'prefs';
const prefs = (function() {
  let data = {};
  return {
    save: function(key, value) {
      data[key] = value;
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(data));
    },
    get: function(key) {
      return data[key];
    },
    load: function() {
      data = JSON.parse(window.localStorage.getItem(PREFS_KEY) || '{}');
      const keys = Object.keys(data);
      for (let k = 0; k < keys.length; k += 1) {
        setClassOfType(document.body, data[keys[k]], keys[k]);
      }
    }
  };
}());

function setDieProp(prop, prefix, skipSave) {
  setClassOfType(document.body, prop, prefix);
  if (!skipSave) {
    prefs.save(prefix, prop);
  }
}

function getPrefValue(key, def) {
  const val = prefs.get(key) || def;
  return val.replace(key, '');
}

const COUNT_KEY = 'd-';
const STYLE_KEY = 't-';
const templates = {};
function createDice() {
  let newDieFrag, newDie;
  board.innerHTML = '';
  diceSet.length = 0;
  const style = getPrefValue(STYLE_KEY, 'dot');
  const count = parseInt(getPrefValue(COUNT_KEY, '1'), 10);
  const tmpl = templates[style] || (templates[style] = document.getElementById(style + '-die'));
  for (let c = 0; c < count; c += 1) {
    newDieFrag = document.importNode(tmpl.content, true);
    newDie = newDieFrag.querySelector('.die');
    board.appendChild(newDie);
    diceSet.push(newDie);
  }
}

const menu = document.getElementById('menu');
menu.addEventListener(CLICK, function(ev) {
  const target = ev.target;
  if (target.id === 'clear') {
    clearDice();
  } else if (target.value) {
    const prefix = target.parentElement.dataset.prefix;
    const klass = prefix + target.value;
    setTimeout(function() {
      clearDice();
      setTimeout(function() {
        setDieProp(klass, prefix);
        createDice();
      }, 1);
    }, 0);
  }
  ev.stopPropagation();
});

function lazyLoadStyles(file) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = file;
  link.type = 'text/css';
  document.body.appendChild(link);
}

function lazyLoadScript(file, cb) {
  const scr = document.createElement('script');
  scr.src = file;
  scr.onload = cb;
  document.body.appendChild(scr);
}

function detectTouch() {
  if (typeof window !== 'undefined') {
    return 'ontouchstart' in window ||
      window.navigator.maxTouchPoints > 0 ||
      window.navigator.msMaxTouchPoints > 0 ||
      (window.DocumentTouch && document instanceof DocumentTouch);
  }
}

prefs.load();
createDice();
setTimeout(function () {
  lazyLoadStyles('icon-dice.css');
  if (detectTouch()) {
    lazyLoadScript('long-press.min.js', function() {
      board.addEventListener('long-press', function(ev) {
        lockingDie(ev);
        longPressed = true;
        ev.stopPropagation();
        ev.preventDefault();
      });
    });
  }
}, 0);

}());