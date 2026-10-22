import { playTransitionAnimation } from './intro.js';

/**
 * 試玩遊戲互動與右側任務卡片控制模組
 */
export function initMinigame() {
  const puzzleForm = document.getElementById('puzzle-form');
  const puzzleInput = document.getElementById('puzzle-input');
  const puzzleError = document.getElementById('puzzle-error');

  // 目標論壇與提示區跳轉網址
  const URL_PRESENTATION = "https://wbstory.site/presentation/forum/";
  const URL_DRAGON = "https://wbstory.site/dragon/forum/";
  const URL_HINTS = "https://wbstory.site/minihint/"; // 若您的提示區為獨立網頁，可替換為實際路徑或線上網址

  // 表單驗證與開啟新分頁邏輯
  if (puzzleForm) {
    puzzleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rawVal = puzzleInput.value.trim();
      const normalizedVal = rawVal.toUpperCase().replace(/\s+/g, '');
      
      if (puzzleError) puzzleError.classList.add('hidden');

      // 通用：開啟新視窗並播放過場動畫後恢復原官網
      function launchGame(url, statusText) {
        // 先開新分頁以防瀏覽器攔截彈出視窗
        const newWindow = window.open('about:blank', '_blank');
        if (newWindow) {
          newWindow.location.href = url;
        }

        // 原官網顯示讀取過場，結束後恢復原官網首頁
        playTransitionAnimation(statusText, () => {
          puzzleInput.value = '';
          const introOverlay = document.getElementById('intro-overlay');
          if (introOverlay) {
            introOverlay.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
              introOverlay.style.display = 'none';
            }, 700);
          }
        });
      }

      // 1. 任務 01「消失的簡報」
      const keywordsPresentation = [
        '01',
        '1',
        '消失的簡報',
        'PRESENTATION',
        '消失的簡報PRESENTATION'
      ];
      if (keywordsPresentation.includes(normalizedVal)) {
        launchGame(URL_PRESENTATION, '[ ESTABLISHING PRESENTATION FORUM CONNECTION... ]');
        return;
      }

      // 2. 任務 02「屠龍冒險隊」
      const keywordsDragon = [
        '02',
        '2',
        '屠龍冒險隊',
        'DUNGEON',
        '屠龍冒險隊DUNGEON'
      ];
      if (keywordsDragon.includes(normalizedVal)) {
        launchGame(URL_DRAGON, '[ ESTABLISHING DRAGON FORUM CONNECTION... ]');
        return;
      }

      // 3. 任務 99「提示區」
      const keywordsHints = [
        '99',
        '提示區',
        'HINTS',
        '提示區HINTS'
      ];
      if (keywordsHints.includes(normalizedVal)) {
        launchGame(URL_HINTS, '[ ACCESSING INVESTIGATION HINTS ARCHIVE... ]');
        return;
      }

      // 驗證失敗提示
      if (puzzleError) {
        puzzleError.classList.remove('hidden');
      }
    });
  }

  // 右側任務卡片互斥展開手風琴邏輯
  const missionCards = document.querySelectorAll('#minigame-mission-list .mission-card:not(.is-locked)');
  
  missionCards.forEach(card => {
    card.addEventListener('click', () => {
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