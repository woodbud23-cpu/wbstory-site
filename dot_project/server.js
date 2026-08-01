const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Dice Throne Backend is running!');
});

// 遊戲狀態庫
let roomState = {
  players: {},        // socket.id -> { socketId, username, hero, ready, inGame }
  selectedHeroes: []  // 等待室已被選擇的角色列表
};

io.on('connection', (socket) => {
  console.log(`[連線] 玩家已連線: ${socket.id}`);

  socket.emit('room_status_update', getRoomInfo());

  // 1. 玩家加入 Waiting Room
  socket.on('join_waiting', (userData) => {
    const inputUsername = userData?.username || '無名氏';
    
    // 檢查覆蓋舊 Socket
    const existingSocketId = Object.keys(roomState.players).find(
      id => roomState.players[id].username === inputUsername
    );

    if (existingSocketId && existingSocketId !== socket.id) {
      console.log(`[更新] 玩家 ${inputUsername} 重新連線，更新 Socket ID`);
      delete roomState.players[existingSocketId];
    }

    const playerCount = Object.keys(roomState.players).length;

    if (playerCount >= 2) {
      socket.emit('error_message', '房間已滿（限 2 人），無法加入遊戲！');
      return;
    }

    roomState.players[socket.id] = {
      socketId: socket.id,
      username: inputUsername,
      hero: null,
      ready: false,
      inGame: false
    };

    io.emit('room_status_update', getRoomInfo());
    // 即時回傳當前已被選走的英雄
    socket.emit('hero_selection_update', roomState.selectedHeroes);
  });

  // 2. 選擇英雄
  socket.on('select_hero', (data) => {
    const player = roomState.players[socket.id];
    if (!player) return;

    if (roomState.selectedHeroes.includes(data.hero)) {
      socket.emit('error_message', '該英雄已被另一位玩家選擇！');
      return;
    }

    player.hero = data.hero;
    player.ready = true;
    if (!roomState.selectedHeroes.includes(data.hero)) {
      roomState.selectedHeroes.push(data.hero);
    }

    io.emit('hero_selection_update', roomState.selectedHeroes);
    socket.emit('waiting_for_opponent');

    checkMatchStart();
  });

  // 3. 遊戲對戰即時同步
  socket.on('game_action', (actionData) => {
    socket.broadcast.emit('opponent_action', actionData);
  });

  // 4. 斷線處理 (關閉瀏覽器/離開頁面)
  socket.on('disconnect', () => {
    console.log(`[離線] 玩家已離線: ${socket.id}`);
    const player = roomState.players[socket.id];
    
    if (player) {
      // 移除該玩家選取的英雄
      if (player.hero) {
        roomState.selectedHeroes = roomState.selectedHeroes.filter(h => h !== player.hero);
      }
      delete roomState.players[socket.id];
    }

    // 如果房間內沒有任何人在準備中，徹底重置英雄選擇陣列（安全防護）
    const activeReadyPlayers = Object.values(roomState.players).filter(p => p.ready);
    if (activeReadyPlayers.length === 0) {
      roomState.selectedHeroes = [];
    }

    // 廣播最新狀態給留在大廳/等待室的人
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
    
    io.emit('match_start', {
      players: players.map(p => ({ username: p.username, hero: p.hero }))
    });

    // 關鍵修正：進入遊戲後 3 秒，自動重置等待室的角色選擇狀態，避免卡死未離開的玩家
    setTimeout(() => {
      roomState.selectedHeroes = [];
      // 標記玩家已進入遊戲
      Object.values(roomState.players).forEach(p => {
        p.ready = false;
        p.hero = null;
      });
      io.emit('hero_selection_update', roomState.selectedHeroes);
    }, 3000);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器已啟動，Listening on port ${PORT}`);
});