declare const startTime: number;
declare const nextVideo: string;

// Pass a start time, if provided
const video: HTMLVideoElement | null = document.getElementById(
  'video-main',
) as HTMLVideoElement | null;
if (video) {
  video.currentTime = startTime;
  try {
    video.play();
  } catch (err) {
    console.error('>>> autoplay failed');
  }

  let timeOnFile: number = startTime;

  setInterval(async () => {
    const newTime: number = Math.floor(video.currentTime);
    if (newTime > timeOnFile) {
      const total: number = Math.floor(video.duration);
      timeOnFile = newTime;
      await fetch('/api/progress-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time: newTime,
          total,
          // eslint-disable-next-line no-restricted-globals
          pathStr: location.pathname,
        }),
      });
    }
  }, 10 * 1000);

  // Always focus the video
  const focuser: () => void = () => video?.focus();
  document.addEventListener('keydown', focuser);
  document.addEventListener('click', focuser);

  // Play next video
  if (nextVideo) {
    video.addEventListener('ended', () => {
      window.location.href = nextVideo;
    });
  }
}

document.querySelectorAll('.player-seek')?.forEach(el =>
  el.addEventListener('click', e => {
    const targetButton = e?.target as HTMLElement;
    if (targetButton && video) {
      if (targetButton.classList.contains('seek-plus')) video.currentTime += 10;
      else video.currentTime -= 10;
    }
  }),
);
