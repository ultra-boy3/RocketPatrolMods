class Menu extends Phaser.Scene {
      constructor() {
            //(Below) String is how our scene is named in code
            //Also, using constructor of parent class
            super("menuScene");
      }

      preload(){
            // load audio
            this.load.audio('sfx_select', './assets/blip_select12.wav');
            this.load.audio('sfx_explosion', './assets/explosion38.wav');
            this.load.audio('sfx_rocket', './assets/rocket_shot.wav');

            // load sprites
            this.load.image('title', './assets/title.png');
      }

      create() {
            //Add background
            this.titleImage = this.add.sprite(game.config.width/2, game.config.height/2, 'title').setOrigin(0.5, 0.5);

            let menuConfig = {
                  fontFamily: 'Courier',
                  fonstSize: '28px',
                  backgroundColor: '#F3B141',
                  color: '#843605',
                  align: 'right',
                  padding: {
                        top: 5,
                        bottom: 5,
                  },
                  fixedWidth: 0
            }

            // show menu text
            this.add.text(game.config.width/2 - 640/2 + 20, game.config.height/2 + 0, "Controls:", menuConfig);
            this.add.text(game.config.width/2 - 640/2 + 20, game.config.height/2 + 30, "Use <--> arrows to move", menuConfig);
            this.add.text(game.config.width/2 - 640/2 + 20, game.config.height/2 + 60, "Press (F) to fire", menuConfig);

            menuConfig.backgroundColor = '#80FF00';
            menuConfig.color = '#000';
            
            this.add.text(game.config.width/2, game.config.height/2 + borderUISize + 
            borderPadding, 'Press <- for Novice or -> for Expert', menuConfig).setOrigin(0.5);
      
            // define keys
            keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      }

      update() {
            if (Phaser.Input.Keyboard.JustDown(keyLeft)) {
              // easy mode
              game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 10000 //10 seconds
              }
              this.sound.play('sfx_select');
              this.scene.start('playScene');    
            }
            if (Phaser.Input.Keyboard.JustDown(keyRight)) {
              // hard mode
              game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 5000 //5 seconds
              }
              this.sound.play('sfx_select');
              this.scene.start('playScene');    
            }
          }
}