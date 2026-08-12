/*
 * Project 3 — Invisible Cities Selector (Slot Machine Interface)
 * Author: Yihui Xiong
 *
 * Description:
 * This interactive p5.js sketch functions as a poetic “selector” for Invisible Cities.
 * Although the larger intention is to create an eventual “Harbour” hub connecting multiple cities,
 * this version features a two‑city slot machine that reveals either **Ersilia** or **Valdrada**
 * through symbolic combinations.
 *
 * Interaction:
 *   • Hold the spacebar (or click the button) to spin the reels.
 *   • Each reel cycles through metaphoric symbols (knot, city, eye, Roman numerals).
 *   • When all three reels stop, the resulting combination determines the city.
 *
 * Winning Combinations:
 *   • Ersilia  →  Knot  +  City  +  IV
 *   • Valdrada →  City  +  Eye   +  I
 *
 * Outcome:
 * Upon a winning combination, users may “enter the city,” linking to the corresponding page.
 * Otherwise, a single‑button “respin” option appears.
 */

let imgKnot, imgCity, imgEye;

let reels = [
  { spinning: false, current: 0, target: 0, speed: 25, offset: 0 },
  { spinning: false, current: 0, target: 0, speed: 25, offset: 0 },
  { spinning: false, current: 0, target: 0, speed: 25, offset: 0 }
];

let images;
let buttonHover = false;
let spaceHoldTime = 0;
let isHoldingSpace = false;
let holdThreshold = 60;
let showResult = false;
let resultCity = "";
let resultAlpha = 0;

/*
 * preload()
 * Purpose: Loads image assets before setup runs.
 * Inputs: none
 * Outputs: none
 */
function preload() {
  imgKnot = loadImage("assets/knots.png");
  imgCity = loadImage("assets/city.png");
  imgEye  = loadImage("assets/eye.png");
}

/*
 * setup()
 * Purpose: Initialize canvas, text settings, and images mapping.
 * Inputs: none
 * Outputs: none
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont('Georgia');

  images = [
    [imgKnot, imgCity],   // slot 1
    [imgCity, imgEye],    // slot 2
    ["IV", "I"]           // slot 3
  ];
}

/*
 * draw()
 * Purpose: Main p5 draw loop — updates UI, reels, and buttons.
 * Inputs: none
 * Outputs: none
 */
function draw() {
  background(231, 234, 240);

  if (isHoldingSpace) {
    spaceHoldTime++;
    if (spaceHoldTime >= holdThreshold) {
      startSpin();
      isHoldingSpace = false;
      spaceHoldTime = 0;
    }
  }

  if (showResult && resultAlpha < 255) {
    resultAlpha += 3;
  }

  drawMachine();
  drawButton();

  if (showResult) {
    drawResultMessage();
  }
}

/*
 * drawMachine()
 * Purpose: Draws the three reel slots and decorative separators.
 * Inputs: none
 * Outputs: none
 */
function drawMachine() {
  let spacing = min(width * 0.32, 280);
  let centerY = height / 2;
  let startX = width / 2 - spacing;

  for (let i = 0; i < 3; i++) {
    drawReelSlot(i, startX + i * spacing, centerY);
  }

  fill(42, 42, 42, 100);
  noStroke();
  textSize(min(width, height) * 0.1);

  text("×", startX + spacing / 2, centerY);

  textSize(min(width, height) * 0.08);
  text("·", startX + spacing + spacing / 2, centerY);
}

/*
 * drawReelSlot(index, x, y)
 * Purpose: Draws one reel slot wrapper at given coordinates.
 * Inputs:
 *    index — which reel (0–2)
 *    x, y — center coordinates
 * Outputs: none
 */
function drawReelSlot(index, x, y) {
  let slotSize = min(width, height) * 0.28;
  drawReel(index, x, y, slotSize);
}

/*
 * drawReel(index, x, y, slotSize)
 * Purpose: Animates and displays reel contents (image or numeral).
 * Inputs:
 *    index — reel number
 *    x, y — position
 *    slotSize — bounding size for image/text
 * Outputs: none
 */
function drawReel(index, x, y, slotSize) {
  let reel = reels[index];

  if (reel.spinning) {
    reel.offset += reel.speed * 1.2;
    reel.current = (reel.current + 0.12) % images[index].length;
  } else {
    let diff = reel.target - reel.current;
    if (abs(diff) > 0.01) {
      reel.current = lerp(reel.current, reel.target, 0.18);
    } else {
      reel.current = reel.target;
    }
    reel.offset = lerp(reel.offset, 0, 0.25);
  }

  let choice = floor(reel.current + 0.5) % images[index].length;
  let item = images[index][choice];

  let yPos = y + (reel.offset % 80);

  if (item instanceof p5.Image) {
    let maxSize = slotSize * 0.85;
    // Make eye image smaller
    if (item === imgEye) {
      maxSize = slotSize * 0.6;
    }
    let scaleFactor = maxSize / max(item.width, item.height);
    let imgW = item.width * scaleFactor;
    let imgH = item.height * scaleFactor;

    imageMode(CENTER);
    image(item, x, yPos, imgW, imgH);
  } else {
    noStroke();
    fill(42, 42, 42);
    textSize(slotSize * 0.4);
    text(item, x, yPos);
  }
}

/*
 * drawButton()
 * Purpose: Displays the hold-to-spin spacebar button and progress fill.
 * Inputs: none
 * Outputs: none
 */
function drawButton() {
  if (showResult) return;

  let centerY = height * 0.75;
  let buttonWidth = 120;
  let buttonHeight = 40;
  let buttonX = width / 2 - buttonWidth / 2;
  let buttonY = centerY - buttonHeight / 2;

  let isHovering = mouseX > buttonX && mouseX < buttonX + buttonWidth &&
                   mouseY > buttonY && mouseY < buttonY + buttonHeight;

  if (isHovering) {
    buttonHover = true;
    cursor(HAND);
  } else {
    buttonHover = false;
    cursor(ARROW);
  }

  push();

  fill(106, 122, 150);
  noStroke();
  textSize(22);

  let holdText = "hold the ";
  let toSpinText = " to spin";
  let holdWidth = textWidth(holdText);
  let toSpinWidth = textWidth(toSpinText);

  text(holdText, width / 2 - buttonWidth / 2 - holdWidth / 2 - 10, centerY);
  text(toSpinText, width / 2 + buttonWidth / 2 + toSpinWidth / 2 + 10, centerY);

  noFill();
  stroke(42, 42, 42, buttonHover ? 120 : 60);
  strokeWeight(1.5);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 6);

  if (isHoldingSpace && spaceHoldTime > 0) {
    let progress = spaceHoldTime / holdThreshold;
    let fillWidth = buttonWidth * progress;

    push();
    clip(() => {
      rect(buttonX, buttonY, buttonWidth, buttonHeight, 6);
    });

    noStroke();
    fill(106, 122, 150, 60);
    rect(buttonX, buttonY, fillWidth, buttonHeight, 6);

    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(106, 122, 150, 0.4)';
    fill(106, 122, 150, 120);
    rect(buttonX, buttonY, fillWidth, buttonHeight, 6);
    drawingContext.shadowBlur = 0;

    pop();
  }

  fill(42, 42, 42, buttonHover || isHoldingSpace ? 255 : 180);
  noStroke();
  textSize(18);
  textStyle(NORMAL);
  text("spacebar", width / 2, centerY);

  pop();
}

/*
 * drawResultMessage()
 * Purpose: Draws the result UI after reels stop (enter city / respin).
 * Inputs: none
 * Outputs: none
 */
function drawResultMessage() {
  let centerY = height * 0.75;

  if (resultCity === "respin") {
    // Show only respin button with outline
    let buttonWidth = 240;
    let buttonHeight = 60;
    let buttonX = width / 2 - buttonWidth / 2;
    let buttonY = centerY - buttonHeight / 2;

    let isHovering = mouseX > buttonX && mouseX < buttonX + buttonWidth &&
                     mouseY > buttonY && mouseY < buttonY + buttonHeight;

    push();
    noFill();
    stroke(42, 42, 42, min(resultAlpha, isHovering ? 120 : 60));
    strokeWeight(1.5);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 8);

    if (isHovering && resultAlpha > 250) {
      noStroke();
      fill(42, 42, 42, 15);
      rect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
    }

    fill(42, 42, 42, min(resultAlpha, isHovering ? 255 : 180));
    noStroke();
    textSize(18);
    textStyle(NORMAL);
    text("respin", width / 2, centerY);
    pop();

    if (resultAlpha > 250 && isHovering) {
      cursor(HAND);
    } else {
      cursor(ARROW);
    }
  } else {
    // Show "enter the city" with outline + small "respin" below without outline
    let buttonWidth = 240;
    let buttonHeight = 60;
    let buttonX = width / 2 - buttonWidth / 2;
    let buttonY = centerY - buttonHeight / 2;

    let isHoveringMain = mouseX > buttonX && mouseX < buttonX + buttonWidth &&
                         mouseY > buttonY && mouseY < buttonY + buttonHeight;

    push();
    noFill();
    stroke(42, 42, 42, min(resultAlpha, isHoveringMain ? 120 : 60));
    strokeWeight(1.5);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 8);

    if (isHoveringMain && resultAlpha > 250) {
      noStroke();
      fill(42, 42, 42, 15);
      rect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
    }

    fill(42, 42, 42, min(resultAlpha, isHoveringMain ? 255 : 180));
    noStroke();
    textSize(18);
    textStyle(NORMAL);
    text("enter the city", width / 2, centerY);
    pop();

    // Small respin button below, no outline
    let respinY = centerY + 50;
    let respinWidth = 100;
    let isHoveringRespin = mouseX > width / 2 - respinWidth / 2 &&
                           mouseX < width / 2 + respinWidth / 2 &&
                           mouseY > respinY - 10 && mouseY < respinY + 10;

    push();
    fill(106, 122, 150, min(resultAlpha, isHoveringRespin ? 180 : 120));
    noStroke();
    textSize(14);
    text("respin", width / 2, respinY);
    pop();

    if (resultAlpha > 250) {
      if (isHoveringMain || isHoveringRespin) {
        cursor(HAND);
      } else {
        cursor(ARROW);
      }
    }
  }
}

/*
 * mousePressed()
 * Purpose: Handles clicking UI buttons (spin, respin, enter city).
 * Inputs: none (uses global mouseX, mouseY)
 * Outputs: none
 */
function mousePressed() {
  let centerY = height * 0.75;

  if (showResult && resultAlpha > 250) {
    if (resultCity === "respin") {
      // Click on respin button (when no winning combination)
      let buttonWidth = 240;
      let buttonHeight = 60;
      let buttonX = width / 2 - buttonWidth / 2;
      let buttonY = centerY - buttonHeight / 2;

      if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
          mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        showResult = false;
        resultAlpha = 0;
      }
    } else {
      // Winning combination - check for "enter the city" or small "respin"
      let buttonWidth = 240;
      let buttonHeight = 60;
      let buttonX = width / 2 - buttonWidth / 2;
      let buttonY = centerY - buttonHeight / 2;

      // Check main "enter the city" button
      if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
          mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        if (resultCity === "Ersilia") {
          window.location.href = "Ersilia/Ersilia.html";
        } else if (resultCity === "Valdrada") {
          window.location.href = "Valdrada/valdrada.html";
        }
        return;
      }

      // Check small respin button below
      let respinY = centerY + 50;
      let respinWidth = 100;
      if (mouseX > width / 2 - respinWidth / 2 &&
          mouseX < width / 2 + respinWidth / 2 &&
          mouseY > respinY - 10 && mouseY < respinY + 10) {
        showResult = false;
        resultAlpha = 0;
      }
    }
    return;
  }

  let buttonWidth = 120;
  let buttonHeight = 40;
  let buttonX = width / 2 - buttonWidth / 2;
  let buttonY = centerY - buttonHeight / 2;

  if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
      mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    startSpin();
  }
}

/*
 * keyPressed()
 * Purpose: Starts hold-to-spin timing when spacebar is pressed.
 * Inputs: key — built-in p5 value
 * Outputs: false (prevent default scrolling)
 */
function keyPressed() {
  if (key === " " && !isHoldingSpace) {
    let spinning = reels.some(r => r.spinning);
    if (!spinning) {
      isHoldingSpace = true;
      spaceHoldTime = 0;
    }
  }
  return false;
}

/*
 * keyReleased()
 * Purpose: Resets spacebar-hold state when released.
 * Inputs: key — built-in p5 value
 * Outputs: false
 */
function keyReleased() {
  if (key === " ") {
    isHoldingSpace = false;
    spaceHoldTime = 0;
  }
  return false;
}

/*
 * startSpin()
 * Purpose: Initiates reel spinning with predetermined winning combo.
 * Inputs: none
 * Outputs: none
 */
function startSpin() {
  let spinning = reels.some(r => r.spinning);
  if (spinning || showResult) return;

  // Always pick a winning combination
  let cityChoice = random([0, 1]);
  reels[0].target = cityChoice;
  reels[1].target = cityChoice;
  reels[2].target = cityChoice;

  for (let r of reels) {
    r.spinning = true;
    r.speed = 20;
    r.offset = 0;
  }

  stopReel(0, 700);
  stopReel(1, 1200);
  stopReel(2, 1700);
}

/*
 * stopReel(i, delay)
 * Purpose: Stops a specific reel after a timed delay.
 * Inputs:
 *    i — reel index
 *    delay — milliseconds before stopping
 * Outputs: none
 */
function stopReel(i, delay) {
  setTimeout(() => {
    reels[i].spinning = false;
    reels[i].speed = 3;

    if (i === 2) {
      setTimeout(() => {
        checkResult();
      }, 500);
    }
  }, delay);
}

/*
 * checkResult()
 * Purpose: Determines whether the final combination matches a city.
 * Inputs: none
 * Outputs: none
 */
function checkResult() {
  let slot1 = images[0][reels[0].target];
  let slot2 = images[1][reels[1].target];
  let slot3 = images[2][reels[2].target];

  let isKnot = slot1 === imgKnot;
  let isCitySlot1 = slot1 === imgCity;
  let isCitySlot2 = slot2 === imgCity;
  let isEye = slot2 === imgEye;
  let isFour = slot3 === "IV";
  let isOne = slot3 === "I";

  if (isKnot && isCitySlot2 && isFour) {
    resultCity = "Ersilia";
    showResult = true;
    resultAlpha = 0;
  } else if (isCitySlot1 && isEye && isOne) {
    resultCity = "Valdrada";
    showResult = true;
    resultAlpha = 0;
  } else {
    // No winning combination - show respin button
    resultCity = "respin";
    showResult = true;
    resultAlpha = 0;
  }
}

/*
 * windowResized()
 * Purpose: Resizes canvas when browser window changes.
 * Inputs: none
 * Outputs: none
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}