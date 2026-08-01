// Socket.io 實例與全域變數
let socket = null;
let heroData = null;
let opponentHeroData = null;

let myUsername = sessionStorage.getItem('dt_username') || '玩家';
let matchInfo = JSON.parse(sessionStorage.getItem('dt_match_info') || '{}');

let state = {
  hp: 50,
  cp: 2,
  status: '',
  myDice: [1, 1, 1, 1, 1],
  myKeepDice: [false, false, false, false, false],
  deck: [],
  hand: [],
  discardPile: [],
  selectedCardIndex: null,
  abilities: [],
  playedCards: [],
  
  // 對手資料狀態
  opponent: {
    username: '對手',
    hero: '',
    hp: 50,
    cp: 2,
    status: '',
    dice: [1, 1, 1, 1, 1],
    handCount: 4,
    abilities: [],
    playedCards: []
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  // 解析當前玩家與對手英雄
  const myHeroType = getMyHeroType();
  const oppHeroType = myHeroType === 'gunslinger' ? 'samurai' : 'gunslinger';

  const myHeroPath = `./dot_char/${myHeroType}/${myHeroType}.json`;
  const oppHeroPath = `./dot_char/${oppHeroType}/${oppHeroType}.json`;

  const p1Success = await loadHeroData(myHeroPath, 'player');
  const p2Success = await loadHeroData(oppHeroPath, 'opponent');

  if (p1Success && p2Success) {
    initGame();
    setupSocket();
    setupEventListeners();
  } else {
    alert("載入英雄資料失敗，請檢查網路或檔案路徑！");
  }
});

function getMyHeroType() {
  if (matchInfo.players) {
    const me = matchInfo.players.find(p => p.username === myUsername);
    if (me) return me.hero;
  }
  return 'gunslinger'; // 預設值
}

async function loadHeroData(filePath, target = 'player') {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`讀取 JSON 失敗: ${filePath}`);
    const data = await response.json();
    if (target === 'player') heroData = data;
    else opponentHeroData = data;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function initGame() {
  // 解析配對資訊並填寫名字
  if (matchInfo.players) {
    const opp = matchInfo.players.find(p => p.username !== myUsername);
    if (opp) state.opponent.username = opp.username;
  }

  document.getElementById('player-name').innerText = `${myUsername} (${heroData.character})`;
  document.getElementById('my-hero-title').innerText = heroData.character;
  
  document.getElementById('opponent-name').innerText = `${state.opponent.username} (${opponentHeroData.character})`;
  document.getElementById('opponent-header-info').innerText = `${state.opponent.username} (${opponentHeroData.character})`;
  document.getElementById('opponent-hero-title').innerText = opponentHeroData.character;

  state.abilities = JSON.parse(JSON.stringify(heroData.hero_board_abilities || []));
  state.opponent.abilities = JSON.parse(JSON.stringify(opponentHeroData.hero_board_abilities || []));

  state.deck = JSON.parse(JSON.stringify(heroData.cards || []));
  state.hand = [];
  state.discardPile = [];
  
  shuffleDeck(true);
  
  // 抽 4 張初始手牌
  for (let i = 0; i < 4; i++) {
    if (state.deck.length > 0) state.hand.push(state.deck.shift());
  }
  
  renderAbilities();
  renderOpponentAbilities();
  renderDice();
  renderHand();
  updateDeckUI();
}

// 建立即時 Socket 監聽
// 建立即時 Socket 監聽
function setupSocket() {
  // 修正 1：移除 const，直接賦值給全域變數 socket，否則 syncMyStateToOpponent 會因為 socket 為 null 而無法發送
  // 修正 2：明確填入 Render 後端網址並加入 transports
  socket = io('https://dot-backend-9y8l.onrender.com', {
    transports: ['polling', 'websocket']
  });

  socket.on('connect', () => {
    console.log('對戰 Socket 連線成功！Socket ID:', socket.id);
    // 連線成功後立即同步一次狀態給對方
    syncMyStateToOpponent();
  });

  // 接收對手的實時數據更新
  socket.on('opponent_action', (data) => {
    console.log('收到對手操作數據:', data);
    state.opponent.hp = data.hp;
    state.opponent.cp = data.cp;
    state.opponent.status = data.status;
    state.opponent.dice = data.dice;
    state.opponent.handCount = data.handCount;
    if (data.abilities) {
      state.opponent.abilities = data.abilities;
    }
    if (data.playedCards) {
      state.opponent.playedCards = data.playedCards;
    }
    
    // 渲染對手 UI
    document.getElementById('opponent-hp').value = state.opponent.hp;
    document.getElementById('opponent-cp').value = state.opponent.cp;
    document.getElementById('opponent-status').value = state.opponent.status;
    document.getElementById('opponent-hand-count').innerText = state.opponent.handCount;
    
    renderPlayedCards();
    renderOpponentAbilities();
    renderDice();
  });
}

// 發送我方狀態給對方
function syncMyStateToOpponent() {
  if (!socket) return;
  socket.emit('game_action', {
    username: myUsername,
    hp: state.hp,
    cp: state.cp,
    status: state.status,
    dice: state.myDice,
    handCount: state.hand.length,
    abilities: state.abilities,
    playedCards: state.playedCards
  });
}

function setupEventListeners() {
  document.getElementById('reroll-btn').addEventListener('click', rerollMyDice);
  document.getElementById('play-card-btn').addEventListener('click', playSelectedCard);
  document.getElementById('discard-card-btn').addEventListener('click', discardSelectedCard);
  document.getElementById('draw-card-btn').addEventListener('click', drawCard);
  document.getElementById('shuffle-deck-btn').addEventListener('click', () => shuffleDeck(false));

  // 監聽數值欄位變更並即時同步
  const hpInput = document.getElementById('my-hp');
  hpInput.addEventListener('input', (e) => {
    state.hp = parseInt(e.target.value) || 0;
    syncMyStateToOpponent();
  });

  const cpInput = document.getElementById('my-cp');
  cpInput.addEventListener('input', (e) => {
    state.cp = parseInt(e.target.value) || 0;
    syncMyStateToOpponent();
  });

  const statusInput = document.getElementById('my-status');
  statusInput.addEventListener('input', (e) => {
    state.status = e.target.value;
    syncMyStateToOpponent();
  });
}

// 技能 UI 渲染
function renderAbilities() {
  const board = document.getElementById('abilities-board');
  if (!board) return;
  board.innerHTML = '';
  state.abilities.forEach(ability => {
    const card = createAbilityCardEl(ability, heroData ? heroData.dice_mapping : {});
    board.appendChild(card);
  });
}

function renderOpponentAbilities() {
  const board = document.getElementById('opponent-abilities-board');
  if (!board) return;
  board.innerHTML = '';
  state.opponent.abilities.forEach(ability => {
    const card = createAbilityCardEl(ability, opponentHeroData ? opponentHeroData.dice_mapping : {});
    board.appendChild(card);
  });
}

function createAbilityCardEl(ability, mapping = {}) {
  const card = document.createElement('div');
  card.className = 'ability-card';

  let displayDiceReq = [];
  let descriptions = [];
  
  if (ability.skills && ability.skills.length > 0) {
    const firstSkill = ability.skills[0];
    if (firstSkill.dice_pattern && firstSkill.dice_pattern.length > 0) {
      displayDiceReq = firstSkill.dice_pattern;
    }
    ability.skills.forEach(s => descriptions.push(s.description));
  }

  const diceTagsHtml = displayDiceReq.map(d => {
    let tagClass = 'tag-group-special';
    const entry = Object.entries(mapping).find(([k, v]) => v === d || k === d);
    if (entry) {
      const keyNum = parseInt(entry[0], 10);
      if (keyNum >= 1 && keyNum <= 3) tagClass = 'tag-group-1-3';
      else if (keyNum === 4 || keyNum === 5) tagClass = 'tag-group-4-5';
      else if (keyNum === 6) tagClass = 'tag-group-6';
    }
    return `<span class="req-tag ${tagClass}">${mapping[d] || d}</span>`;
  }).join('');

  const descHtml = descriptions.join('<br>') || '無詳細效果說明';

  card.innerHTML = `
    <div class="ability-header">
      <span class="ability-title">${ability.name}</span>
      <div class="ability-dice-req">${diceTagsHtml || '<span class="req-tag tag-group-special">被動/無</span>'}</div>
    </div>
    <div class="ability-details">${descHtml}</div>
  `;
  return card;
}

// 骰子渲染與操作
function renderDice() {
  const myMapping = heroData ? (heroData.dice_mapping || {}) : {};
  const oppMapping = opponentHeroData ? (opponentHeroData.dice_mapping || {}) : {};

  const myContainer = document.getElementById('my-dice');
  if (myContainer) {
    myContainer.innerHTML = '';
    state.myDice.forEach((val, idx) => {
      const isLocked = state.myKeepDice[idx];
      const die = document.createElement('div');
      
      let valGroupClass = `die-val-group-${val}`;
      if (val >= 1 && val <= 3) valGroupClass = 'die-val-group-1-3';
      else if (val === 4 || val === 5) valGroupClass = 'die-val-group-4-5';

      die.className = `die ${valGroupClass} ${isLocked ? 'selected' : ''}`;
      die.innerHTML = `
        <span class="die-value">${val}</span>
        <span class="die-symbol">${myMapping[val] || val}</span>
      `;
      die.addEventListener('click', () => {
        state.myKeepDice[idx] = !state.myKeepDice[idx];
        renderDice();
      });
      myContainer.appendChild(die);
    });
  }

  const oppContainer = document.getElementById('opponent-dice');
  if (oppContainer) {
    oppContainer.innerHTML = '';
    state.opponent.dice.forEach((val) => {
      const die = document.createElement('div');
      
      let valGroupClass = `die-val-group-${val}`;
      if (val >= 1 && val <= 3) valGroupClass = 'die-val-group-1-3';
      else if (val === 4 || val === 5) valGroupClass = 'die-val-group-4-5';

      die.className = `die ${valGroupClass} disabled`;
      die.innerHTML = `
        <span class="die-value">${val}</span>
        <span class="die-symbol">${oppMapping[val] || val}</span>
      `;
      oppContainer.appendChild(die);
    });
  }
}

function rerollMyDice() {
  state.myDice = state.myDice.map((val, idx) => {
    if (!state.myKeepDice[idx]) {
      return Math.floor(Math.random() * 6) + 1;
    }
    return val;
  });
  renderDice();
  syncMyStateToOpponent(); // 骰子改變，立即同步給對方
}

// 抽牌與洗牌
function drawCard() {
  if (state.deck.length === 0) {
    alert("牌庫已空！");
    return;
  }
  const drawnCard = state.deck.shift();
  state.hand.push(drawnCard);
  renderHand();
  updateDeckUI();
  syncMyStateToOpponent(); // 手牌張數變更，同步給對方
}

function shuffleDeck(silent = false) {
  if (state.deck.length <= 1) {
    if (!silent) alert("牌庫數量不足，無法洗牌。");
    return;
  }
  for (let i = state.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
  }
  if (!silent) alert("洗牌完成！");
  updateDeckUI();
}

function updateDeckUI() {
  const deckCountEl = document.getElementById('deck-count');
  if (deckCountEl) deckCountEl.innerText = state.deck.length;
}

// 渲染手牌
function renderHand() {
  const container = document.getElementById('hand-cards-container');
  if (!container) return;
  container.innerHTML = '';

  document.getElementById('my-hand-count').innerText = state.hand.length;

  state.hand.forEach((card, idx) => {
    const cardEl = document.createElement('div');
    cardEl.className = `card border-${card.border_color} ${state.selectedCardIndex === idx ? 'selected' : ''}`;
    
    const mainTitle = card.title || (card.skills && card.skills[0] ? card.skills[0].name : "未命名卡牌");
    const displayType = card.is_attack_modifier ? `${card.type}(攻擊修正)` : card.type;

    if (card.skills && card.skills.length > 0) {
      let innerHTML = `
        <div>
          <div class="card-title">${mainTitle}</div>
          <div class="card-type">${displayType}</div>
          <div class="card-cost">CP: ${card.cost}</div>
          ${card.skills[0].dice_pattern && card.skills[0].dice_pattern.length > 0 ? `<div class="card-dice-types">需求: [${card.skills[0].dice_pattern.join(', ')}]</div>` : ''}
        </div>
        <div class="card-desc">${card.skills[0].description}</div>
      `;

      for (let sIdx = 1; sIdx < card.skills.length; sIdx++) {
        const sk = card.skills[sIdx];
        innerHTML += `
          <hr style="margin: 6px 0; border: 0; border-top: 1px dashed #ccc;">
          <div>
            <div class="card-title" style="font-size:0.9em;">${sk.name}</div>
            ${sk.dice_pattern && sk.dice_pattern.length > 0 ? `<div class="card-dice-types">需求: [${sk.dice_pattern.join(', ')}]</div>` : ''}
          </div>
          <div class="card-desc">${sk.description}</div>
        `;
      }
      cardEl.innerHTML = innerHTML;
    } else {
      cardEl.innerHTML = `
        <div>
          <div class="card-title">${mainTitle}</div>
          <div class="card-type">${displayType}</div>
          <div class="card-cost">CP: ${card.cost}</div>
        </div>
        <div class="card-desc">${card.description || ''}</div>
      `;
    }

    cardEl.addEventListener('click', () => {
      state.selectedCardIndex = (state.selectedCardIndex === idx) ? null : idx;
      renderHand();
    });
    container.appendChild(cardEl);
  });

  const hasSelection = state.selectedCardIndex !== null;
  document.getElementById('play-card-btn').disabled = !hasSelection;
  document.getElementById('discard-card-btn').disabled = !hasSelection;
}

// 出牌與棄牌
function playSelectedCard() {
  if (state.selectedCardIndex === null) return;
  const card = state.hand[state.selectedCardIndex];

  if (card.type === "英雄升級" && card.skills) {
    applyUpgradeCard(card);
    state.discardPile.push(card);
  } else {
    state.playedCards.push({
      ...card,
      owner: myUsername
    });
  }

  state.hand.splice(state.selectedCardIndex, 1);
  state.selectedCardIndex = null;
  renderHand();
  renderPlayedCards();
  syncMyStateToOpponent();
}

function renderPlayedCards() {
  const container = document.getElementById('played-cards-container');
  if (!container) return;
  container.innerHTML = '';

  const allPlayedCards = [
    ...state.playedCards.map(c => ({ ...c, isMine: true })),
    ...state.opponent.playedCards.map(c => ({ ...c, isMine: false }))
  ];

  allPlayedCards.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = `card played-card border-${card.border_color}`;
    
    const mainTitle = card.title || (card.skills && card.skills[0] ? card.skills[0].name : "未命名卡牌");
    const displayType = card.is_attack_modifier ? `${card.type}(攻擊修正)` : card.type;

    cardEl.innerHTML = `
      <div>
        <div class="card-title">${mainTitle}</div>
        <div class="card-type">${displayType} [${card.owner || '未知'}]</div>
        <div class="card-cost">CP: ${card.cost}</div>
      </div>
      <div class="card-desc">${card.description || ''}</div>
    `;

    cardEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (card.isMine) {
        const pIdx = state.playedCards.findIndex(c => c.id === card.id);
        if (pIdx !== -1) {
          const removed = state.playedCards.splice(pIdx, 1)[0];
          state.discardPile.push(removed);
          renderPlayedCards();
          syncMyStateToOpponent();
        }
      } else {
        alert("你只能棄掉自己打出的卡牌！");
      }
    });

    container.appendChild(cardEl);
  });
}

function discardSelectedCard() {
  if (state.selectedCardIndex === null) return;
  const card = state.hand[state.selectedCardIndex];
  state.discardPile.push(card);
  state.hand.splice(state.selectedCardIndex, 1);
  state.selectedCardIndex = null;
  renderHand();
  syncMyStateToOpponent();
}

// 卡牌升級邏輯
function applyUpgradeCard(upgradeCard) {
  if (!upgradeCard.skills || upgradeCard.skills.length === 0) return;

  const cleanUpgradeTitle = upgradeCard.title
    ? upgradeCard.title.replace(/\s*(II|III)\b/g, '').replace(/\s*\([^)]*\)/g, '').trim()
    : "";

  let targetAbility = state.abilities.find(a => {
    const cleanAbilityName = a.name.replace(/\s*(II|III)\b/g, '').replace(/\s*\([^)]*\)/g, '').trim();
    return cleanAbilityName === cleanUpgradeTitle;
  });

  if (targetAbility) {
    if (upgradeCard.title) targetAbility.name = upgradeCard.title;

    upgradeCard.skills.forEach(upSkill => {
      const tagMatch = upSkill.name.match(/\((.*?)\)/);
      const tag = tagMatch ? tagMatch[1] : null;

      let skillIdx = -1;
      if (tag) {
        skillIdx = targetAbility.skills.findIndex(s => s.name.includes(tag));
      }

      if (skillIdx !== -1) {
        targetAbility.skills[skillIdx] = upSkill;
      } else {
        targetAbility.skills.push(upSkill);
      }
    });
  } else {
    state.abilities.push({
      id: `UPGRADE_${upgradeCard.id}`,
      name: upgradeCard.title || upgradeCard.skills[0].name,
      ability_type: upgradeCard.subtype || "upgraded",
      skills: JSON.parse(JSON.stringify(upgradeCard.skills))
    });
  }

  renderAbilities();
}