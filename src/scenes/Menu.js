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
      }

      create() {
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
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize
             - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
             this.add.text(game.config.width/2, game.config.height/2,
              'Use <--> arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
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
                gameTimer: 60000    
              }
              this.sound.play('sfx_select');
              this.scene.start('playScene');    
            }
            if (Phaser.Input.Keyboard.JustDown(keyRight)) {
              // hard mode
              game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000    
              }
              this.sound.play('sfx_select');
              this.scene.start('playScene');    
            }
          }
}