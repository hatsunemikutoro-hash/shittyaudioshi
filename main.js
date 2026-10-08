const audio = document.querySelector("#player");
const seek = document.querySelector("#seek");
const timeLabel = document.querySelector("#time");
const fileInput = document.getElementById("audio-input");

fileInput.addEventListener("change", event => {
    const objUrl = URL.createObjectURL(event.target.files[0]);
    document.getElementById("player").src = objUrl;
});

document.querySelector("#play").onclick = () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
};

document.querySelector("#back").onclick = () => {
  audio.currentTime = Math.max(0, audio.currentTime - 15);
};

document.querySelector("#forward").onclick = () => {
  audio.currentTime = Math.min(
    audio.duration || Infinity,
    audio.currentTime + 30
  );
};

document.querySelector("#speed").onchange = (e) => {
  audio.playbackRate = Number(e.target.value);
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";

  seconds = Math.floor(seconds);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = n => String(n).padStart(2, "0");

  return h > 0
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(m)}:${pad(s)}`;
}

audio.addEventListener("loadedmetadata", updateProgress);
audio.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const duration = audio.duration || 0;

  seek.value = duration
    ? (audio.currentTime / duration) * 100
    : 0;

  timeLabel.textContent =
    `${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
}

seek.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (Number(seek.value) / 100) * audio.duration;
  }
});

function parseTime(value) {
  const parts = value.trim().split(":").map(Number);

  if (
    parts.length < 2 ||
    parts.length > 3 ||
    parts.some(n => !Number.isInteger(n) || n < 0)
  ) {
    return null;
  }

  let seconds;

  if (parts.length === 2) {
    const [minutes, secs] = parts;
    if (secs >= 60) return null;
    seconds = minutes * 60 + secs;
  } else {
    const [hours, minutes, secs] = parts;
    if (minutes >= 60 || secs >= 60) return null;
    seconds = hours * 3600 + minutes * 60 + secs;
  }

  return seconds;
}

document.querySelector("#jump").onclick = () => {
  const seconds = parseTime(
    document.querySelector("#jumpTo").value
  );

  if (seconds === null || !Number.isFinite(audio.duration)) return;
  if (seconds > audio.duration) return;

  audio.currentTime = seconds;
};


const volume = document.getElementById('volume');
const volumeValue = document.getElementById('volume-value');
const volumeIcon = document.getElementById('volume-icon');

volume.addEventListener('input', () => {
    const value = Number(volume.value);

    player.volume = value / 100;
    volumeValue.textContent = `${value}%`;

    if (value === 0) {
        volumeIcon.textContent = '🔇';
    } else if (value < 50) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
});

player.volume = Number(volume.value) / 100;

