/**
 * 開場發芽動畫控制模組 (提速版)
 */
export function initIntro() {
  const introOverlay = document.getElementById('intro-overlay');
  const skipBtn = document.getElementById('skip-intro-btn');
  const replayBtn = document.getElementById('replay-intro-btn');
  const title = document.getElementById('intro-title');
  const subtitle = document.getElementById('intro-subtitle');
  const status = document.getElementById('intro-status');

  function closeIntro() {
    if (!introOverlay) return;
    introOverlay.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      introOverlay.style.display = 'none';
    }, 700);
    localStorage.setItem('woodbud_intro_seen', 'true');
  }

  function playAnimationSequence() {
    introOverlay.style.display = 'flex';
    introOverlay.classList.remove('opacity-0', 'pointer-events-none');

    // 提速：在發芽即將完成時迅速淡入標題
    setTimeout(() => {
      if (title) title.classList.remove('opacity-0');
    }, 900);

    setTimeout(() => {
      if (subtitle) subtitle.classList.remove('opacity-0');
      if (status) status.classList.remove('opacity-0');
    }, 1300);

    // 2.4 秒後自動淡出進入首頁
    setTimeout(closeIntro, 2400);
  }

  // 判斷是否為老訪客
  if (localStorage.getItem('woodbud_intro_seen') === 'true') {
    introOverlay.style.display = 'none';
  } else {
    playAnimationSequence();
  }

  // 點擊 SKIP
  skipBtn?.addEventListener('click', closeIntro);

  // 導覽列重播按鈕
  replayBtn?.addEventListener('click', () => {
    title?.classList.add('opacity-0');
    subtitle?.classList.add('opacity-0');
    status?.classList.add('opacity-0');
    
    const svg = introOverlay.querySelector('.logo-svg');
    if (svg) {
      svg.style.animation = 'none';
      svg.offsetHeight; /* trigger reflow */
      svg.style.animation = '';
    }
    
    playAnimationSequence();
  });
}