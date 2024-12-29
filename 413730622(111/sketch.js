function setup() {
  createCanvas(400, 400);
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text("TKUET", width/2, height/2);
}

function draw() {
  background(50);
  
  // 繪製兩條血量條
  fill(255, 0, 0);  // 紅色
  rect(50, 100, 300, 30);  // 上方血量條
  rect(50, 300, 300, 30);  // 下方血量條
  
  // 在兩條血量條中間顯示文字
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);  // 白色
  text("TKUET", width/2, height/2);
}
