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

  video.addEventListener('keydown', ({ code }: KeyboardEvent) => {
    if (code === 'ArrowLeft' && video.currentTime > 0) video.currentTime += 115;
    else if (code === 'ArrowRight' && video.currentTime < video.duration) video.currentTime -= 115;
  });

  let timeOnFile: number = startTime;

  setInterval(async () => {
    const newTime: number = Math.floor(video.currentTime);
    if (newTime > timeOnFile) {
      const total: number = Math.floor(video.duration);
      timeOnFile = newTime;
      await fetch('/progress-tracker', {
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
