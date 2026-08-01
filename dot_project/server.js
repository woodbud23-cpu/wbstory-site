const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 修正 1：移除限制性的 transports，並保持跨域 CORS 開放
const io = new Server(server, {
  cors: {
    origin: "*", // 允許來自 Netlify (wbstory.site) 的跨域連線
    methods: ["GET", "POST"]
  }
});

// 靜態檔案服務（選用，保留相容性）
app.use(express.static(path.join(__dirname, 'public')));

// 健康檢查 Endpoint（讓 Render 偵測 Server 是否活著）
app.get('/', (req, res) => {
  res.send('Dice Throne Backend is running!');
});

// 遊戲狀態庫
let roomState = {
  players: {}, // socket.id -> { socketId, username, hero, ready }
  selectedHeroes: [] // 已被選擇的角色列表 ['gunslinger', 'samurai']
};

io.on('connection', (socket) => {
  console.log(`[連線] 玩家已連線: ${socket.id}`);

  // 1. 回傳當前大廳/房間人數與狀態
  socket.emit('room_status_update', getRoomInfo());

  // 2. 玩家嘗試加入 Waiting Room
  socket.on('join_waiting', (userData) => {
    const inputUsername = userData?.username || '無名氏';
    
    // 檢查是不是同一個玩家重新整理網頁（如果是，覆蓋舊的 socket 紀錄）
    const existingSocketId = Object.keys(roomState.players).find(
      id => roomState.players[id].username === inputUsername
    );

    if (existingSocketId && existingSocketId !== socket.id) {
      console.log(`[更新] 玩家 ${inputUsername} 重新連線，更新 Socket ID`);
      delete roomState.players[existingSocketId];
    }

    // 重新計算人數
    const playerCount = Object.keys(roomState.players).length;

    if (playerCount >= 2) {
      socket.emit('error_message', '房間已滿（限 2 人），無法加入遊戲！');
      return;
    }

    // 註冊玩家資訊
    roomState.players[socket.id] = {
      socketId: socket.id,
      username: inputUsername,
      hero: null,
      ready: false
    };

    // 廣播更新後的人數與狀態
    io.emit('room_status_update', getRoomInfo());
    // 向所有人廣播已被選取的英雄
    io.emit('hero_selection_update', roomState.selectedHeroes);
  });

  // 3. 玩家選擇角色/確認配對
  socket.on('select_hero', (data) => {
    const player = roomState.players[socket.id];
    if (!player) return;

    // 檢查英雄是否已被其他人選擇
    if (roomState.selectedHeroes.includes(data.hero)) {
      socket.emit('error_message', '該英雄已被另一位玩家選擇！');
      return;
    }

    player.hero = data.hero;
    player.ready = true;
    if (!roomState.selectedHeroes.includes(data.hero)) {
      roomState.selectedHeroes.push(data.hero);
    }

    // 廣播最新被選取的英雄列表，讓另一人無法重複選擇
    io.emit('hero_selection_update', roomState.selectedHeroes);
    
    // 通知該玩家進入等待狀態
    socket.emit('waiting_for_opponent');

    // 4. 檢查是否兩位玩家都準備完成
    checkMatchStart();
  });

  // 4.5 🎮 遊戲對戰即時同步：將玩家發送的操作狀態轉發給對手
  socket.on('game_action', (actionData) => {
    // 使用 broadcast 轉發給「除了發送者以外」的其他玩家（即對手）
    socket.broadcast.emit('opponent_action', actionData);
  });

  // 5. 斷線處理
  socket.on('disconnect', () => {
    console.log(`[離線] 玩家已離線: ${socket.id}`);
    const player = roomState.players[socket.id];
    if (player) {
      if (player.hero) {
        roomState.selectedHeroes = roomState.selectedHeroes.filter(h => h !== player.hero);
      }
      delete roomState.players[socket.id];
    }
    
    // 廣播最新房間狀態
    io.emit('room_status_update', getRoomInfo());
    io.emit('hero_selection_update', roomState.selectedHeroes);
  });
});

function getRoomInfo() {
  const count = Object.keys(roomState.players).length;
  return {
    playerCount: count,
    isFull: count >= 2
  };
}

function checkMatchStart() {
  const players = Object.values(roomState.players);
  if (players.length === 2 && players.every(p => p.ready)) {
    console.log('兩位玩家皆已準備，發送轉跳通知！');
    
    // 發送即時轉跳指令，並附帶玩家的角色資訊
    io.emit('match_start', {
      players: players.map(p => ({ username: p.username, hero: p.hero }))
    });
  }
}

// 修正 2：明確監聽 '0.0.0.0' 以符合雲端平台 (Render) 的 Port 綁定規範
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器已啟動，Listening on port ${PORT}`);
});