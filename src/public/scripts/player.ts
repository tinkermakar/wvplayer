declare const startTime: number;
declare const nextVideo: string;

// Pass a start time, if provided
const video: HTMLVideoElement | null = document.getElementById(
  'video-main',
) as HTMLVideoElement | null;
if (video) {
  video.currentTime = startTime;
  video.play().catch(console.error);

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

  video.addEventListener('ratechange', () => {
    const newPlaybackSpeed = video.playbackRate.toString();
    localStorage.setItem('playbackSpeed', newPlaybackSpeed);
    console.info(`🚶‍♂️‍➡️ new playback speed: ${newPlaybackSpeed}`);
  });

  const savedPlaybackSpeed = localStorage.getItem('playbackSpeed');
  if (savedPlaybackSpeed) video.playbackRate = parseFloat(savedPlaybackSpeed);

  const seek = (seconds: number) => {
    if (!Number.isFinite(video.duration)) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  document.addEventListener(
    'keydown',
    event => {
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable]')) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (!['ArrowLeft', 'ArrowRight', ' '].includes(event.key)) return;

      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'ArrowLeft') seek(-10);
      else if (event.key === 'ArrowRight') seek(10);
      else if (!event.repeat) {
        if (video.paused) video.play().catch(console.error);
        else video.pause();
      }
    },
    true,
  );

  document.querySelectorAll('.player-seek').forEach(button => {
    button.addEventListener('click', () => {
      seek(button.classList.contains('seek-plus') ? 10 : -10);
    });
  });

  // Play next video
  if (nextVideo) {
    video.addEventListener('ended', () => {
      window.location.href = nextVideo;
    });
  }
}
