import { playTransitionAnimation } from './intro.js';

/**
 * 解鎖試煉互動與右側任務卡片控制模組
 */
export function initMinigame() {
  const puzzleForm = document.getElementById('puzzle-form');
  const puzzleInput = document.getElementById('puzzle-input');
  const puzzleResult = document.getElementById('puzzle-result');
  const puzzleError = document.getElementById('puzzle-error');

  // 目標論壇跳轉網址
  const FORUM_TARGET_URL = "https://wbstory.site/presentation/forum/";

  // 表單解謎驗證與跳轉邏輯
  if (puzzleForm) {
    puzzleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rawVal = puzzleInput.value.trim();
      // 統一轉大寫並去除字串內部空格，讓判斷更具容錯性
      const normalizedVal = rawVal.toUpperCase().replace(/\s+/g, '');
      
      puzzleResult.classList.add('hidden');
      puzzleError.classList.add('hidden');

      // 1. 判定是否符合「消失的簡報」系列通訊關鍵字
      const triggerKeywords = [
        '消失的簡報',
        'PRESENTATION',
        '消失的簡報PRESENTATION'
      ];

      if (triggerKeywords.includes(normalizedVal)) {
        // 播放過場發芽讀取動畫後跳轉
        playTransitionAnimation('[ ESTABLISHING FORUM CONNECTION... ]', () => {
          window.location.href = FORUM_TARGET_URL;
        });
        return;
      }

      // 2. 原本的折扣碼解鎖驗證
      if (normalizedVal === 'SPROUT' || normalizedVal === 'WOODBUD' || normalizedVal === '木芽') {
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