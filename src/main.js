let config = { //This is a JS object - similar to a dictionary
      type: Phaser.CANVAS,
      width: 640,
      height: 480,
      scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

//reserve keyboard vars
let keyFire, keyRestart, keyLeft, keyRight, keyMenu;

// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let highScore = 0
if(localStorage.getItem("highScore") != null){
      highScore = localStorage.getItem("highScore");
}

/*
Santiago Ponce - 4/18/22
"Rocket Patrol HD"
Completion time: Around 8-9 hours

Changes:
Created new artwork for assets (rocket, spaceships, explosion)
Created 5 explosion sounds that play randomly
Added new weapon behavior and animated the sprite (Rocket can be
      rotated left and right during flight)
New title screen artwork + layout
Visible timer
High-score that appears in UI and persists even after closing
      the window (Saves a small file to local machine)
New artwork for UI borders
*/