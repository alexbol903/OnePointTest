const options = {
  container: document.querySelector('.container'),
  verticalSlide: document.querySelector('.slide__vertical'),
  horizontalSlide: document.querySelector('.slide__horizontal'),
  pagination: document.querySelectorAll('.pagination__icon'),
  toggle: document.querySelector('.toggle'),
  toggleIcon: document.querySelector('.toggle__icon'),
  widthToggle: document.querySelector('.toggle__scale').offsetWidth,
  widthScale: document.querySelector('.toggle__scale--active'),
  screenWidth: document.documentElement.clientWidth,
  screenHeight: document.documentElement.clientHeight,
  top: 0,
  left: 0,
  activeVerticalSlide: 0
}

const touchStartVer = event => {
  if (!event.target.matches('.toggele')) {
    options.pageY = event.touches[ 0 ].pageY;
    options.container.ontouchmove = touchMoveVer;
    options.container.ontouchend = null;
  }

  const toggle = event.target.closest('.toggle__icon');
  if (toggle) {
    touchStartHor(event);
    toggle.ontouchmove = touchMoveHor;
    toggle.ontouchend = touchEndHor;
  }
}

const moveUp = () => {
  options.activeVerticalSlide++;
  const index = options.activeVerticalSlide;
  options.top -= options.screenHeight;
  setMoveVer(options.top, index - 1, index);
}

const moveDown = () => {
  options.activeVerticalSlide--;
  const index = options.activeVerticalSlide;
  options.top += options.screenHeight;
  setMoveVer(options.top, index + 1, index);
}

// Choose go to up or down
const touchMoveVer = event => {
  const step = 50,
    index = options.activeVerticalSlide;

  if (options.pageY > event.touches[ 0 ].pageY + step && index !== 2) {
    options.container.ontouchend = moveUp;

  } else if (options.pageY < event.touches[ 0 ].pageY - step && index !== 0) {
    options.container.ontouchend = moveDown;
  }
}

const setMoveVer = (num, del, add) => {
  const element = 'pagination__icon--active';
  options.container.ontouchmove = null;
  options.pagination[ del ].classList.remove(element);
  options.pagination[ add ].classList.add(element);
  options.verticalSlide.style.top = `${num}px`;
  footerNext(add)
  toggle(add);
  delete options.pageY;
}

const footerNext = index => {
  const next = document.querySelector('.next');
  if (index !== 0) {
    next.style.cssText = 'opacity: 0; display: none;';
  } else {
    next.style.display = 'flex';
    setTimeout(() => {
      next.removeAttribute('style');
    }, 300);
  }
}

// Change toggle navigation style position 
const toggle = index => {
  const toggle = document.querySelector('.toggle');
  if (index === 2) {
      toggle.style.bottom = `10px`;
  } else {
    toggle.removeAttribute('style');
  }
}


const touchStartHor = event => {
  options.pageX = event.touches[ 0 ].pageX;
  options.left = options.toggleIcon.offsetLeft;
}

const touchMoveHor = event => {
  let left = options.toggleIcon.offsetLeft;
  const value = options.left + (event.touches[ 0 ].pageX - options.pageX);

  if (left >= 0 && left <= options.widthToggle) {
    setMoveHor(value);
  }
}

const setMoveHor = value => {
  const width25 = options.widthToggle * .25,
    width75 = options.widthToggle * .75,
    iconLeft = options.toggleIcon.offsetLeft,
    screenWidth = options.screenWidth;

  // Move toggle icon
  if (iconLeft < width25) {
    options.horizontalSlide.style.left = '0px';

  } else if (iconLeft > width25 && iconLeft < width75) {
    options.horizontalSlide.style.left = `-${screenWidth}px`;

  } else if (iconLeft > width75) {
    options.horizontalSlide.style.left = `-${screenWidth * 2}px`;
  }

  options.widthScale.style.width = `${value}px`;
  options.toggleIcon.style.left = `${value}px`;
}

const touchEndHor = () => {
  const width25 = options.widthToggle * .25,
    width50 = options.widthToggle * .5,
    width75 = options.widthToggle * .75,
    iconLeft = options.toggleIcon.offsetLeft;

  if (iconLeft < width25) {
    setMoveHor(0);

  } else if (iconLeft > width25 && iconLeft < width75) {
    setMoveHor(width50);

  } else if (iconLeft > width75) {
    setMoveHor(options.widthToggle);
  }
  const element = {
    toggleIcon: options.toggleIcon,
    widthScale: options.widthScale
  }
  setTransition(element);
}

const setTransition = element => {
  const time = 3;
  element.toggleIcon.style.transition = `left .${time}s`;
  element.widthScale.style.transition = `width .${time}s`;
  setTimeout(() => {
    element.toggleIcon.style.transition = ``;
    element.widthScale.style.transition = ``;
  }, time * 100)
}

const init = () => {
  options.horizontalSlide.style.left = `-${options.screenWidth * 2}px`;
  options.widthScale.style.width = `${options.widthToggle}px`;
  options.toggleIcon.style.left = `${options.widthToggle}px`;
}

options.container.ontouchstart = touchStartVer;

init();
