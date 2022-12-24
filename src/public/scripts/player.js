/* eslint-disable no-undef */
const startTime = startTime2;
const nextVideo = nextVideo2;
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
    const total = Math.floor(video.duration);
    timeOnFile = newTime;
    await fetch('/progress-tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time: newTime,
        total,
        pathStr: location.pathname,
      }),
    });
  }
}, 10 * 1000);

// Always focus the video
const focuser = () => video.focus();
document.addEventListener('keydown', focuser);
document.addEventListener('click', focuser);

// Play next video
if (nextVideo) {
  video.addEventListener('ended', () => {
    window.location.href = nextVideo;
  });
}
