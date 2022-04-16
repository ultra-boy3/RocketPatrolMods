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
            this.load.image('rocket', './assets/rocket.png');
            this.load.image('spaceship', './assets/spaceship.png');
            this.load.image('starfield', './assets/starfield.png');
            this.load.spritesheet('explosion', './assets/explosion.png',
             {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
            console.log("Preload finished");
            
            //New assets
            this.load.spritesheet('spaceshipTwo', './assets/spaceshipTwo.png',
             {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 11});
            this.load.spritesheet('explosionTwo', './assets/explosionTwo.png',
            {frameWidth: 80, frameHeight: 80, startFrame: 0, endFrame: 6});
            this.load.spritesheet('rocketIdle', "./assets/rocketTwo_idle.png",
            {frameWidth: 32, frameHeight: 64, startFrame: 0, endFrame: 3});
            this.load.spritesheet('rocketThrust', "./assets/rocketTwo_thrust.png",
            {frameWidth: 32, frameHeight: 64, startFrame: 0, endFrame: 3});
      }

      create() {
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
                  frameRate: 10
            });
            this.anims.create({
                  key: 'rocketIdle',
                  frames: this.anims.generateFrameNumbers('rocketThrust', { start: 0})
            })

            // Green UI background
            this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
            // White borders
            this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
            this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
            this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
            this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
            // Each has parameters: Position, Size, Color
            //setOrigin adjusts the object's origin/pivot

            //add rocket (p1) to horizontal middle of screen
            this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding,
            'rocketIdle').setOrigin(0.5, 0);

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
                  ships[i].on('animationcomplete', () => {
                        ships[i].anims.play("spaceshipGlow");
                  });
            }

            //define keys
            keyFire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
            keyRestart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

            
            
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
                  fixedWidth: 100
            }
            this.scoreLeft = this.add.text(borderUISize + borderPadding,
                   borderUISize + borderPadding*2, this.p1Score,
                    scoreConfig);
            
            this.gameOver = false;
            // 60-second play clock
            scoreConfig.fixedWidth = 0;
            this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
                  this.add.text(game.config.width/2, game.config.height/2,
                   'GAME OVER', scoreConfig).setOrigin(0.5);
                  this.add.text(game.config.width/2, game.config.height/2 + 64,
                  'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
                  this.gameOver = true;
            }, null, this);
            
            console.log("Create finished");
      }

      update() {
            // check key input for restart
            if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRestart)) {
                  this.scene.restart();
            }
            
            this.starfield.tilePositionX -= 4;
            // Check key input for return to main menu
            if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLeft)) {
                  this.scene.start("menuScene");
            }

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
            this.scoreLeft.text = this.p1Score;
            this.sound.play('sfx_explosion'); //One of many audio functions
      }
}

//Scenes and other scripts need to be referenced in Index.html