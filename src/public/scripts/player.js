/* eslint-disable no-undef */
const startTime = startTime2;
/* eslint-enable no-undef */

// Pass a start time, if provided
const video = document.getElementById('video-main');
video.currentTime = startTime;
try {
  video.play();
}
catch (err) {
  console.error('>>> autoplay failed');
}

let timeOnFile = startTime;

setInterval(async () => {
  const newTime = Math.floor(video.currentTime);
  if (newTime > timeOnFile) {
    timeOnFile = newTime;
    await fetch('/progress-tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time: newTime,
        pathStr: location.pathname,
      }),
    });
  }
}, 10 * 1000);

// Keyboard shortcuts
const focuser = () => video.focus();
document.addEventListener('keydown', focuser);
document.addEventListener('click', focuser);
