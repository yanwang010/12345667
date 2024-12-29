// 玩家物件
let player1 = {
  x: 200,
  y: 400,
  // 每個動作的詳細設定
  actions: {
    stand: {
      width: 157,
      height: 190,
      frames: 4,        // 幀數
      frameDelay: 8,    // 動畫延遲
      spriteWidth: 31.4,  // 原始精靈圖中單幀寬度
      img: null,
      offsetX: 0,    // 圖片位移
      offsetY: 0
    },
    fight: {
      width: 182,
      height: 190,
      frames: 4,
      frameDelay: 6,
      spriteWidth: 36.4,
      img: null,
      offsetX: 0,
      offsetY: 0
    },
    fire: {
      width: 245,
      height: 120,
      frames: 3,
      frameDelay: 4,
      spriteWidth: 49,
      img: null,
      offsetX: 100,  // 調整火球位置
      offsetY: 30
    },
    end: {
      width: 183,
      height: 175,
      frames: 6,         // 增加倒地動畫幀數
      frameDelay: 8,     // 調整動畫速度
      spriteWidth: 36.6, // 原始精靈圖中每幀的寬度
      img: null,
      offsetX: 0,
      offsetY: 0,
      isLoop: false      // 設定不循環播放
    }
  },
  speed: 5,
  health: 100,
  maxHealth: 100,
  direction: 1,
  isAttacking: false,
  skillCooldown: 0,
  currentFrame: 0,
  frameCount: 0,
  currentAction: 'stand',
  isDead: false,
  fireballs: []  // 新增火球陣列
};

let player2 = {
  x: 600,
  y: 400,
  actions: {
    stand: {
      width: 232.5,
      height: 220,
      frames: 4,
      frameDelay: 8,
      spriteWidth: 46.5,
      img: null,
      offsetX: 0,
      offsetY: 0
    },
    fight: {
      width: 220,
      height: 215,
      frames: 4,
      frameDelay: 6,
      spriteWidth: 44,
      img: null,
      offsetX: 0,
      offsetY: 0
    },
    fire: {
      width: 80,
      height: 40,
      frames: 3,
      frameDelay: 4,
      spriteWidth: 16,
      img: null,
      offsetX: -100,
      offsetY: 30
    },
    end: {
      width: 226,
      height: 195,
      frames: 6,         // 增加倒地動畫幀數
      frameDelay: 8,
      spriteWidth: 45.2,
      img: null,
      offsetX: 0,
      offsetY: 0,
      isLoop: false
    }
  },
  speed: 5,
  health: 100,
  maxHealth: 100,
  direction: -1,
  isAttacking: false,
  skillCooldown: 0,
  currentFrame: 0,
  frameCount: 0,
  currentAction: 'stand',
  isDead: false,
  fireballs: []  // 新增火球陣列
};

// 新增火球類別
class Fireball {
  constructor(player, target) {
    this.x = player.x;
    this.y = player.y + player.actions.fire.offsetY;
    this.direction = player.direction;
    this.currentFrame = 0;
    this.frameCount = 0;
    this.action = {
      width: player.actions.fire.width,
      height: player.actions.fire.height,
      frames: player.actions.fire.frames,
      frameDelay: player.actions.fire.frameDelay,
      spriteWidth: player.actions.fire.spriteWidth,
      img: player.actions.fire.img
    };
    this.speed = 10;  // 火球速度
    this.active = true;
    
    // 計算目標方向
    let angle = atan2(target.y - this.y, target.x - this.x);
    this.velocityX = cos(angle) * this.speed;
    this.velocityY = sin(angle) * this.speed;
  }
  
  update() {
    // 更新位置
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    // 更新動畫
    this.frameCount++;
    if (this.frameCount >= this.action.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.action.frames;
      this.frameCount = 0;
    }
    
    // 檢查是否超出螢幕
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.active = false;
    }
  }
  
  draw() {
    push();
    if (this.direction === -1) {
      translate(this.x + this.action.width, this.y);
      scale(-1, 1);
    } else {
      translate(this.x, this.y);
    }
    
    let sx = this.currentFrame * this.action.spriteWidth;
    image(this.action.img,
          0, 0,
          this.action.width,
          this.action.height,
          sx, 0,
          this.action.spriteWidth,
          this.action.height);
    pop();
  }
}

// 在全域宣告背景圖片變數
let bgImage;

function preload() {
  // 載入玩家1的圖片
  player1.actions.fight.img = loadImage('./player1/fight.png', 
    () => console.log('Player1 fight loaded'),
    err => console.log('Failed to load player1 fight:', err)
  );
  player1.actions.stand.img = loadImage('./player1/stand.png',
    () => console.log('Player1 stand loaded'),
    err => console.log('Failed to load player1 stand:', err)
  );
  player1.actions.fire.img = loadImage('./player1/fire.png',
    () => console.log('Player1 fire loaded'),
    err => console.log('Failed to load player1 fire:', err)
  );
  player1.actions.end.img = loadImage('./player1/end.png',
    () => console.log('Player1 end loaded'),
    err => console.log('Failed to load player1 end:', err)
  );
  
  // 載入玩家2的圖片
  player2.actions.fight.img = loadImage('./player2/fight.png',
    () => console.log('Player2 fight loaded'),
    err => console.log('Failed to load player2 fight:', err)
  );
  player2.actions.stand.img = loadImage('./player2/stand.png',
    () => console.log('Player2 stand loaded'),
    err => console.log('Failed to load player2 stand:', err)
  );
  player2.actions.fire.img = loadImage('./player2/fire.png',
    () => console.log('Player2 fire loaded'),
    err => console.log('Failed to load player2 fire:', err)
  );
  player2.actions.end.img = loadImage('./player2/end.png',
    () => console.log('Player2 end loaded'),
    err => console.log('Failed to load player2 end:', err)
  );
  
  bgImage = loadImage('bg.png',
    () => console.log('Background loaded successfully'),
    err => console.log('Failed to load background:', err)
  );
}

function setup() {
  // 創建全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  
  // 檢查背景圖片是否載入
  if (bgImage) {
    console.log('Background image loaded:', bgImage.width, 'x', bgImage.height);
  }
  
  // 調整初始位置到畫面底部
  player1.y = height - player1.actions.stand.height - 20;
  player2.y = height - player2.actions.stand.height - 20;
  
  // 設置初始位置
  player1.x = width * 0.3;  // 左側 30% 位置
  player2.x = width * 0.7;  // 右側 70% 位置
  
  // 檢查圖片是否都已載入
  console.log('Player 1 images:', {
    fight: player1.actions.fight.img != null,
    stand: player1.actions.stand.img != null,
    fire: player1.actions.fire.img != null,
    end: player1.actions.end.img != null
  });
  
  console.log('Player 2 images:', {
    fight: player2.actions.fight.img != null,
    stand: player2.actions.stand.img != null,
    fire: player2.actions.fire.img != null,
    end: player2.actions.end.img != null
  });
}

// 添加視窗大小改變的處理
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 重新調整玩家位置
  player1.y = height - player1.actions.stand.height - 20;
  player2.y = height - player2.actions.stand.height - 20;
  
  player1.x = width * 0.3;
  player2.x = width * 0.7;
}

function draw() {
  // 繪製背景圖片
  if (bgImage) {
    image(bgImage, 0, 0, width, height);
  } else {
    // 如果背景圖片未載入，使用純綠色背景作為備用
    background(124, 252, 0);
  }
  
  // 更新玩家狀態
  handlePlayer1Movement();
  handlePlayer2Movement();
  updateSkillCooldowns();
  
  // 更新和繪製火球
  updateAndDrawFireballs(player1);
  updateAndDrawFireballs(player2);
  
  // 繪製玩家
  drawPlayer(player1, 'blue');
  drawPlayer(player2, 'red');
  
  // 繪製血量條（調整位置）
  drawHealthBar(player1, width * 0.05, 30);  // 左側血量條
  
  // 新增 TKUET 文字
  fill(255);  // 白色文字
  textSize(40);  // 文字大小
  textAlign(CENTER);
  text("TKUET", width * 0.5, 50);  // 在中間位置繪製文字
  
  drawHealthBar(player2, width * 0.65, 30);  // 右側血量條
  
  // 檢查遊戲結束
  checkGameEnd();
  
  // 更新動畫
  updateAnimation(player1);
  updateAnimation(player2);
}

function drawPlayer(player, color) {
  push();
  
  let currentAction = player.actions[player.currentAction];
  
  // 如果死亡，繪製死亡圖片
  if (player.isDead && player.actions.end.img) {
    let endAction = player.actions.end;
    image(endAction.img, 
          player.x + endAction.offsetX, 
          player.y + endAction.offsetY, 
          endAction.width, 
          endAction.height,
          player.currentFrame * endAction.spriteWidth, 0,
          endAction.spriteWidth,
          endAction.height);
    pop();
    return;
  }
  
  // 繪製當前動作
  if (player.direction === -1) {
    translate(player.x + currentAction.width, player.y);
    scale(-1, 1);
  } else {
    translate(player.x, player.y);
  }
  
  if (currentAction.img) {
    let sx = player.currentFrame * currentAction.spriteWidth;
    image(currentAction.img, 
          currentAction.offsetX,
          currentAction.offsetY, 
          currentAction.width, 
          currentAction.height,
          sx, 0,
          currentAction.spriteWidth,
          currentAction.height);
  }
  
  pop();
}

function drawHealthBar(player, x, y) {
  let barWidth = width * 0.3;  // 血量條寬度為畫面寬度的 30%
  let barHeight = 30;  // 增加血量條高度
  
  // 血量條外框
  noFill();
  stroke(0);
  strokeWeight(3);  // 增加外框粗細
  rect(x, y, barWidth, barHeight);
  
  // 血量條
  noStroke();
  fill(255, 0, 0);
  rect(x, y, barWidth, barHeight);
  
  fill(0, 255, 0);
  let healthWidth = map(player.health, 0, player.maxHealth, 0, barWidth);
  rect(x, y, healthWidth, barHeight);
  
  // 血量文字
  fill(255);
  textSize(20);  // 增加文字大小
  textAlign(CENTER);
  text(player.health + "/" + player.maxHealth, x + barWidth/2, y + barHeight/2 + 7);
}

function handlePlayer1Movement() {
  if (player1.isDead) return;
  
  let isMoving = false;
  
  if (keyIsDown(65)) { // A
    player1.x -= player1.speed;
    player1.direction = -1;
    isMoving = true;
  }
  if (keyIsDown(68)) { // D
    player1.x += player1.speed;
    player1.direction = 1;
    isMoving = true;
  }
  if (keyIsDown(87)) { // W
    player1.y -= player1.speed;
    isMoving = true;
  }
  if (keyIsDown(83)) { // S
    player1.y += player1.speed;
    isMoving = true;
  }
  
  // 修改動作狀態判斷
  player1.currentAction = isMoving ? 'fight' : 'stand';
}

function handlePlayer2Movement() {
  if (player2.isDead) return;
  
  let isMoving = false;
  
  if (keyIsDown(LEFT_ARROW)) {
    player2.x -= player2.speed;
    player2.direction = -1;
    isMoving = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player2.x += player2.speed;
    player2.direction = 1;
    isMoving = true;
  }
  if (keyIsDown(UP_ARROW)) {
    player2.y -= player2.speed;
    isMoving = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player2.y += player2.speed;
    isMoving = true;
  }
  
  // 修改動作狀態判斷
  player2.currentAction = isMoving ? 'fight' : 'stand';
}

function keyPressed() {
  // 技能按鍵
  if (key === 'q' || key === 'Q') {
    useSkill(player1, player2);
  }
  if (key === 'p' || key === 'P') {
    useSkill(player2, player1);
  }
}

function useSkill(attacker, target) {
  if (attacker.isDead) return;
  
  if (attacker.skillCooldown <= 0) {
    attacker.skillCooldown = 60;
    attacker.isAttacking = true;
    attacker.currentFrame = 0;
    
    // 計算攻擊方向
    let attackDirection = target.x > attacker.x ? 1 : -1;
    attacker.direction = attackDirection;
    
    // 創建新的火球
    attacker.fireballs.push(new Fireball(attacker, target));
    
    // 設定延遲傷害
    setTimeout(() => {
      if (!target.isDead) {
        target.health = max(0, target.health - 20);
      }
    }, 300);
    
    setTimeout(() => {
      attacker.isAttacking = false;
    }, 500);
  }
}

function updateSkillCooldowns() {
  player1.skillCooldown = max(0, player1.skillCooldown - 1);
  player2.skillCooldown = max(0, player2.skillCooldown - 1);
}

function checkGameEnd() {
  if (player1.health <= 0 && !player1.isDead) {
    player1.isDead = true;
    player1.currentAction = 'end';
    player1.currentFrame = 0;  // 重置幀數
    player1.frameCount = 0;
  }
  if (player2.health <= 0 && !player2.isDead) {
    player2.isDead = true;
    player2.currentAction = 'end';
    player2.currentFrame = 0;  // 重置幀數
    player2.frameCount = 0;
  }
}

// 更新動畫函數
function updateAnimation(player) {
  let currentAction = player.actions[player.currentAction];
  
  if (currentAction.frameDelay > 0) {
    player.frameCount++;
    if (player.frameCount >= currentAction.frameDelay) {
      // 如果是不循環的動作且已到最後一幀，則停止
      if (!currentAction.isLoop && player.currentFrame >= currentAction.frames - 1) {
        return;
      }
      player.currentFrame = (player.currentFrame + 1) % currentAction.frames;
      player.frameCount = 0;
    }
  }
}

// 新增火球更新和繪製函數
function updateAndDrawFireballs(player) {
  // 更新火球
  player.fireballs = player.fireballs.filter(fireball => {
    fireball.update();
    fireball.draw();
    return fireball.active;
  });
}
