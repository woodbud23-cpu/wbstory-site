/**
 * 解鎖試煉互動與右側任務卡片控制模組
 */
export function initMinigame() {
  const puzzleForm = document.getElementById('puzzle-form');
  const puzzleInput = document.getElementById('puzzle-input');
  const puzzleResult = document.getElementById('puzzle-result');
  const puzzleError = document.getElementById('puzzle-error');

  // 表單解謎驗證
  if (puzzleForm) {
    puzzleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = puzzleInput.value.trim().toUpperCase();
      
      puzzleResult.classList.add('hidden');
      puzzleError.classList.add('hidden');

      // 驗證暗號
      if (val === 'SPROUT' || val === 'WOODBUD' || val === '木芽') {
        puzzleResult.classList.remove('hidden');
      } else {
        puzzleError.classList.remove('hidden');
      }
    });
  }

  // 右側任務卡片點擊展開/收折邏輯
  const missionCards = document.querySelectorAll('#minigame-mission-list .mission-card:not(.is-locked)');
  missionCards.forEach(card => {
    card.addEventListener('click', () => {
      const content = card.querySelector('.mission-content');
      if (content) {
        content.classList.toggle('hidden');
        card.classList.toggle('is-active');
      }
    });
  });
}