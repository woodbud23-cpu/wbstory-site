import { initIntro } from './intro.js';
import { initMinigame } from './minigame.js';
import { initNavigation } from './nav.js';

// 初始化「幕後密室」左右面板互斥展開邏輯
function initAboutAccordion() {
  const panelArchitect = document.getElementById('panel-architect');
  const panelWorkshop = document.getElementById('panel-workshop');

  if (!panelArchitect || !panelWorkshop) return;

  function setActive(activePanel, inactivePanel) {
    // 展開選取的面板
    activePanel.classList.remove('lg:col-span-5', 'is-collapsed');
    activePanel.classList.add('lg:col-span-7', 'is-expanded');

    // 收縮另一邊面板
    inactivePanel.classList.remove('lg:col-span-7', 'is-expanded');
    inactivePanel.classList.add('lg:col-span-5', 'is-collapsed');
  }

  // 初始狀態：預設展開創辦人，收縮工作室
  setActive(panelArchitect, panelWorkshop);

  panelArchitect.addEventListener('click', () => {
    if (panelArchitect.classList.contains('is-collapsed')) {
      setActive(panelArchitect, panelWorkshop);
    }
  });

  panelWorkshop.addEventListener('click', () => {
    if (panelWorkshop.classList.contains('is-collapsed')) {
      setActive(panelWorkshop, panelArchitect);
    }
  });
}

// 主進入點
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initIntro();
  initMinigame();
  initNavigation();
  initAboutAccordion();
});