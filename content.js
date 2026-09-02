(() => {
  const NEAR_END_SECONDS = 0.35;
  const MIN_DURATION_SECONDS = 1;
  const TRIGGER_COOLDOWN_MS = 1000;
  const log = (...args) => console.log("[ybas]", ...args);

  log("content script loaded on", location.href);

  let enabled = true;
  let currentVideo = null;
  let triggeredForSrc = null;
  let lastTriggerAt = 0;

  chrome.storage.local.get({ enabled: true }, (result) => {
    enabled = result.enabled;
    log("enabled =", enabled);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && "enabled" in changes) {
      enabled = changes.enabled.newValue;
      log("enabled changed ->", enabled);
    }
  });

  const getActiveVideo = () => document.querySelector("#shorts-player video");

  const goToNextShort = () => {
    const now = Date.now();
    if (now - lastTriggerAt < TRIGGER_COOLDOWN_MS) return;

    const nextButton = document.querySelector(
      "#navigation-button-down button"
    );
    if (nextButton) {
      log("next button found, clicking");
      nextButton.click();
    } else {
      log("next button NOT found, falling back to ArrowDown key");
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      );
    }
    lastTriggerAt = now;
  };

  // Shorts の <video> は loop=true で再生されるため 'ended' イベントは発火しない。
  // 終端到達を timeupdate で監視し、ループする直前に次の動画へ送る。
  const onTimeUpdate = (event) => {
    if (!enabled) return;
    const video = event.target;
    const { duration, currentTime, currentSrc } = video;
    if (!duration || Number.isNaN(duration) || duration < MIN_DURATION_SECONDS) {
      return;
    }
    if (
      duration - currentTime <= NEAR_END_SECONDS &&
      triggeredForSrc !== currentSrc
    ) {
      log("near end detected", { duration, currentTime });
      triggeredForSrc = currentSrc;
      goToNextShort();
    }
  };

  const attachToVideo = (video) => {
    if (!video || video === currentVideo) return;
    if (currentVideo) {
      currentVideo.removeEventListener("timeupdate", onTimeUpdate);
    }
    currentVideo = video;
    triggeredForSrc = null;
    log("attached to video", video.currentSrc);
    video.addEventListener("timeupdate", onTimeUpdate);
  };

  const scan = () => attachToVideo(getActiveVideo());

  const observer = new MutationObserver(scan);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // YouTube は SPA なので URL 遷移時に発火するこのイベントでも再スキャンする
  document.addEventListener("yt-navigate-finish", scan);

  // 上記イベントを取りこぼした場合のフォールバック
  setInterval(scan, 1000);

  scan();
})();
