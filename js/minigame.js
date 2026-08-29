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

      // 3. 折扣碼解鎖驗證
      if (normalizedVal === 'SPROUT' || normalizedVal === 'WOODBUD' || normalizedVal === '木芽') {
        puzzleResult.classList.remove('hidden');
      } else {
        puzzleError.classList.remove('hidden');
      }
    });
  }

  // 右側任務卡片互斥展開手風琴邏輯
  const missionCards = document.querySelectorAll('#minigame-mission-list .mission-card:not(.is-locked)');
  
  missionCards.forEach(card => {
    card.addEventListener('click', () => {
      // 若當前卡片已經展開，則不重複執行
      if (card.classList.contains('is-active')) return;

      // 1. 收折其他所有已展開的任務卡片
      missionCards.forEach(otherCard => {
        otherCard.classList.remove('is-active', 'border-accent-gold/50');
        otherCard.classList.add('border-border-subtle');
        const otherContent = otherCard.querySelector('.mission-content');
        if (otherContent) {
          otherContent.classList.add('hidden');
        }
      });

      // 2. 展開當前被選取的任務卡片
      card.classList.add('is-active', 'border-accent-gold/50');
      card.classList.remove('border-border-subtle');
      const content = card.querySelector('.mission-content');
      if (content) {
        content.classList.remove('hidden');
      }
    });
  });
}