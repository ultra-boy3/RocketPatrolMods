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