import { playTransitionAnimation } from './intro.js';

/**
 * 調查試煉互動與右側任務卡片控制模組
 */
export function initMinigame() {
  const puzzleForm = document.getElementById('puzzle-form');
  const puzzleInput = document.getElementById('puzzle-input');
  const puzzleResult = document.getElementById('puzzle-result');
  const puzzleError = document.getElementById('puzzle-error');

  // 目標論壇跳轉網址
  const URL_PRESENTATION = "https://wbstory.site/presentation/forum/";
  const URL_DRAGON = "https://wbstory.site/dragon/forum/";

  // 表單驗證與跳轉邏輯
  if (puzzleForm) {
    puzzleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rawVal = puzzleInput.value.trim();
      // 統一轉大寫並去除內部空格，具備最佳容錯性
      const normalizedVal = rawVal.toUpperCase().replace(/\s+/g, '');
      
      puzzleResult.classList.add('hidden');
      puzzleError.classList.add('hidden');

      // 1. 任務 01「消失的簡報」
      const keywordsPresentation = [
        '消失的簡報',
        'PRESENTATION',
        '消失的簡報PRESENTATION'
      ];

      if (keywordsPresentation.includes(normalizedVal)) {
        playTransitionAnimation('[ ESTABLISHING PRESENTATION FORUM CONNECTION... ]', () => {
          window.location.href = URL_PRESENTATION;
        });
        return;
      }

      // 2. 任務 02「屠龍冒險隊」
      const keywordsDragon = [
        '屠龍冒險隊',
        'DUNGEON',
        '屠龍冒險隊DUNGEON'
      ];

      if (keywordsDragon.includes(normalizedVal)) {
        playTransitionAnimation('[ ESTABLISHING DRAGON FORUM CONNECTION... ]', () => {
          window.location.href = URL_DRAGON;
        });
        return;
      }

      // 3. 原本的折扣碼解鎖驗證
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