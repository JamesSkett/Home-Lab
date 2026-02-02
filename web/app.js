// ==========================
// CONFIG
// ==========================

// When you created the countdown
const startDate = new Date("2026-01-01T22:00:00");

// When the trip starts 🎿
const tripDate = new Date("2026-03-05T17:00:00");

// Lift path (scene coordinates)
const liftPath = {
  startX: 1500,
  startY: 600,
  endX: 300,
  endY: 200
};

// ==========================
// ELEMENTS
// ==========================

const daysEl = document.querySelector(".days");
const hoursEl = document.querySelector(".hours");
const minutesEl = document.querySelector(".minutes");
const secondsEl = document.querySelector(".seconds");

const scene = document.querySelector(".scene");
const viewport = document.querySelector(".scene-viewport");
const lift = document.querySelector(".lift");

// ==========================
// HELPERS
// ==========================

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function pad(number) {
  return number.toString().padStart(2, "0");
}

// Smooth easing
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ==========================
// SCENE SCALING
// ==========================

function scaleScene() {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;

  const sw = scene.offsetWidth;
  const sh = scene.offsetHeight;

  const scale = Math.min(vw / sw, vh / sh);

  const offsetX = (vw - sw * scale) / 2;
  const offsetY = (vh - sh * scale) / 2;

  scene.style.transform = `
    translate(${offsetX}px, ${offsetY}px)
    scale(${scale})
  `;
}

window.addEventListener("resize", scaleScene);
scaleScene();

// ==========================
// LIFT ANIMATION
// ==========================

function updateLiftPosition() {
  const raw = window.countdownProgress ?? 0;

  // Clamp again defensively
  const t = clamp(raw, 0, 1);

  const x = liftPath.startX + (liftPath.endX - liftPath.startX) * t;

  const y = liftPath.startY + (liftPath.endY - liftPath.startY) * t;

  lift.style.left = `${x}px`;
  lift.style.top = `${y}px`;
}

function setLiftToProgress(t) {
  const x = liftPath.startX + (liftPath.endX - liftPath.startX) * t;
  const y = liftPath.startY + (liftPath.endY - liftPath.startY) * t;
  lift.style.left = x + 'px';
  lift.style.top = y + 'px';
}


function animateLiftToProgress(target) {
  let t = 0;
  function step() {
    t += 0.01; // speed of the “loading bar” effect
    if (t > 1) t = 1;
    const progress = t * target; // scale so it stops at target
    setLiftToProgress(progress);
    if (t < 1) requestAnimationFrame(step);
  }
  step();
}

// Smooth animation loop
function animate() {
  updateLiftPosition();
  requestAnimationFrame(animate);
}

animate();

// ==========================
// COUNTDOWN (1 Hz)
// ==========================

function updateCountdown() {
  const now = new Date();

  const totalDuration = tripDate - startDate;
  const timeRemaining = tripDate - now;

  if (timeRemaining <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    window.countdownProgress = 1;
    return;
  }

  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);

  const elapsed = now - startDate;
  window.countdownProgress = clamp(elapsed / totalDuration, 0, 1);
  //console.log(window.countdownProgress);
}

for (let i = 0; i < 70; i++) {
  const snow = document.createElement("div");
  snow.classList.add("snowflake");
  snow.style.left = `${Math.random() * 1600}px`; // match scene width
  snow.style.animationDuration = `${5 + Math.random() * 10}s`;
  snow.style.width = snow.style.height = `${2 + Math.random() * 6}px`;
  scene.appendChild(snow);
}


// ==========================
// START
// ==========================

updateCountdown();
animateLiftToProgress(window.countdownProgress);
setInterval(updateCountdown, 1000);
