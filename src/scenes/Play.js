//const { Phaser } = require("../../lib/phaser");
/*I'm gonna assume the above line doesn't work because index.html
is already doing its job. Doesn't seem to help with autofill...*/

class Play extends Phaser.Scene {
      constructor() {
            //(Below) String is how our scene is named in code
            //Also, using constructor of parent class
            super("playScene");
      }

      preload() {
            //load images/tile sprites
            this.load.image('starfield', './assets/starfield.png');
            
            //New assets
            this.load.spritesheet('spaceshipTwo', './assets/spaceshipTwo.png',
             {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 11});
            this.load.spritesheet('explosionTwo', './assets/explosionTwo.png',
            {frameWidth: 80, frameHeight: 80, startFrame: 0, endFrame: 6});
            this.load.spritesheet('rocketIdle', "./assets/rocketTwo_idle.png",
            {frameWidth: 32, frameHeight: 64, startFrame: 0, endFrame: 3});
            this.load.spritesheet('rocketThrust', "./assets/rocketTwo_thrust.png",
            {frameWidth: 32, frameHeight: 64, startFrame: 0, endFrame: 3});
            this.load.image('uiBorder', './assets/ui_border.png');

            //Sounds
            this.load
      }

      create() {
            //define keys
            keyFire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
            keyRestart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            keyMenu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
            
            //FIRST THINGS TO BE CALLED ARE RENDERED ON BOTTOM!
            //Similar to Godot, top-left is (0, 0), and the "up" direction is negative

            // Place the tile sprite
            this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
            //Seems that by default, origin is in the sprite's center

            // animation config
            // Animations in Phaser are in a global list, and can be applied
            // to any game object
            this.anims.create({
                  key: 'explode',
                  frames: this.anims.generateFrameNumbers('explosionTwo', { start: 0, end: 6, first: 0}),
                  frameRate: 12
            });
            this.anims.create({
                  key: 'spaceshipGlow',
                  frames: this.anims.generateFrameNumbers('spaceshipTwo', { start: 0, end: 11, first: 0}),
                  frameRate: 10,
                  repeat: -1
            });
            // Animations for rocket are created within the class itself

            //add spaceships (x3)
            // Spaces the ships apart on x axis by borderUISize (width of the border)
            // Each ship has diff point value passed into constrcutor's point argument
            // They're also outside the viewport
            this.ship01 = new Spaceship(this, game.config.width + borderUISize*6,
                  borderUISize*4, 'spaceshipTwo', 0, 30).setOrigin(0, 0);
            this.ship02 = new Spaceship(this, game.config.width + borderUISize*3,
                  borderUISize*5 + borderPadding*2, 'spaceshipTwo', 0, 20).setOrigin(0, 0);
            this.ship03 = new Spaceship(this, game.config.width,
                  borderUISize*6 + borderPadding*4, 'spaceshipTwo', 0, 10).setOrigin(0, 0);
            
            let ships = [this.ship01, this.ship02, this.ship03];
            for(let i = 0; i < ships.length; i++){
                  ships[i].anims.play("spaceshipGlow");
            }

            //add rocket (p1) to horizontal middle of screen
            this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding - 20,
            'rocketIdle').setOrigin(0.5, 0.0);

            // Green UI background
            this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
            // UI borders

            this.add.sprite(0, game.config.height, 'uiBorder').setOrigin(0, 0).setAngle(270)
            this.add.sprite(game.config.width, 0, 'uiBorder').setOrigin(0, 0).setAngle(90)
            this.add.sprite(game.config.width, game.config.height, 'uiBorder').setOrigin(0, 0).setAngle(180);
            this.add.sprite(0, 0, 'uiBorder').setOrigin(0, 0);

            // Each has parameters: Position, Size, Color
            //setOrigin adjusts the object's origin/pivot
            
            this.p1Score = 0;
            // display score
            let scoreConfig = {
                  fontFamily: 'Courier',
                  fonstSize: '28px',
                  backgroundColor: '#F3B141',
                  color: '#843605',
                  align: 'right',
                  padding: {
                        top: 5,
                        bottom: 5,
                  },
                  fixedWidth: 125
            }
            this.scoreLeft = this.add.text(borderUISize + borderPadding,
                   borderUISize + borderPadding*2, this.p1Score + " - Score", scoreConfig);
            
            //Display timer
            let timerConfig = {
                  fontFamily: 'Courier',
                  fonstSize: '28px',
                  backgroundColor: '#F3B141',
                  color: '#843605',
                  align: 'left',
                  padding: {
                        top: 5,
                        bottom: 5,
                  },
                  fixedWidth: 125
            }
            this.clockNum = game.settings.gameTimer
            this.clockText = this.add.text(game.config.width - borderUISize - borderPadding,
             borderUISize * 2 + borderPadding, this.clockNum, timerConfig).setOrigin(1.0);

             this.highScoreText = this.add.text(game.config.width/2,
                  borderUISize * 2 + borderPadding, "Best - " + highScore, timerConfig).setOrigin(0.5);

            this.gameOver = false;
            // 60-second play clock
            scoreConfig.fixedWidth = 0;
            this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
                  this.add.text(game.config.width/2, game.config.height/2,
                   'GAME OVER', scoreConfig).setOrigin(0.5);
                  this.add.text(game.config.width/2, game.config.height/2 + 64,
                  'Press (R) to Restart or (M) for Menu', scoreConfig).setOrigin(0.5);
                  this.gameOver = true;

                  //Update high score
                  if(this.p1Score > highScore){
                        highScore = this.p1Score;
                        localStorage.setItem("highScore", highScore);
                        this.add.text(game.config.width/2, game.config.height/2 + 32,
                        'New high score!', scoreConfig).setOrigin(0.5);
                        this.gameOver = true;
                  }
            }, null, this);
            
            console.log("Create finished");

            this.checkDelta = true
      }

      update(time, delta) { //Order of these MATTERS. I put delta before time and that ended up swapping the values
            // Update called once per in-game step/tick
            // Delta = delta time in ms since the last frame (1 sec = 1000 ms)
            // Seems like it should be fairly accurate then: Clock is 10000, which can be 10000 ms or 10 seconds
            // 

            // check key input for restart
            if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRestart)) {
                  this.scene.restart();
            }
            
            this.starfield.tilePositionX -= 4;

            //Display timer
            this.clockNum -= delta
            if(this.clockNum > -1000){
                  this.clockText.text = "Time - " + Math.ceil(this.clockNum / 1000);
            }

            // Check key input for return to main menu
            if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyMenu)) {
                  this.scene.start("menuScene");
            }

            // Check key input for launch rocket
            // if(!this.gameOver && Phaser.Input.Keyboard.JustDown(keyFire)) {
            //       this.p1Rocket.anims.play("rocketThrust")
            // }
            //Seems that checking for keyboard input twice overrides the check in the rocket class

            // Game objects are not updated automatically
            if(!this.gameOver){
                  this.p1Rocket.update();
                  this.ship01.update();
                  this.ship02.update();
                  this.ship03.update();
            }

            // check collisions
            if(this.checkCollision(this.p1Rocket, this.ship03)) {
                  this.p1Rocket.reset();
                  this.shipExplode(this.ship03);
            }
            if(this.checkCollision(this.p1Rocket, this.ship02)) {
                  this.p1Rocket.reset();
                  this.shipExplode(this.ship02);
            }
            if(this.checkCollision(this.p1Rocket, this.ship01)) {
                  this.p1Rocket.reset();
                  this.shipExplode(this.ship01);
            }
            //Note: Spaceship 1 is the farthest from the player
      }

      checkCollision(rocket, ship) {
            // simple AABB checking
            /* Not Phaser's true physics system. Just a simple 'check if
            these two rectangles are overlapping' function*/
            if (rocket.x < ship.x + ship.width &&
                  rocket.x + rocket.width > ship.x &&
                  rocket.y < ship.y + ship.height &&
                  rocket.height + rocket.y > ship.y){
                        return true;
                  }
            else{
                  return false;
            }
            /*Reminds me of how I coded triggers to check for collisions
            with Viola honestly*/
      }
      /*Got an idea for mod: Allow rocket to 'pierce' thru ships
      so it can hit multiple at once. Also maybe if pressing fire again,
      ship will reverse direction in mid-air*/

      shipExplode(ship) {
            // temporarily hide ship
            ship.alpha = 0;
            // create explosion at ship's position (sprite game object)
            let boom = this.add.sprite(ship.x, ship.y, 'explosionTwo').setDisplayOrigin(8, 24);
            boom.anims.play('explode');               // play explode animation
            boom.on('animationcomplete', () => {      //Signal-like callback + arrow shorthand way to call an anonymous function
                  ship.reset();                       
                  ship.alpha = 1;                     //Restore ship visibility
                  boom.destroy();                     //Remove explosion
            });
            // score and repaint
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score + " - Score";

            let explosionString = 'sfx_explosion';
            let randomInt = Math.floor(Math.random() * 4) + 1 //1 - 5
            explosionString += randomInt;
            this.sound.play(explosionString); //One of many audio functions
            console.log("Played audio " + explosionString);
      }
}

//Scenes and other scripts need to be referenced in Index.html