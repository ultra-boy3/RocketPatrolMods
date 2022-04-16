//Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

      // Can I create a preload method here?

      constructor(scene, x, y, texture, frame) {
            super(scene, x, y, texture, frame);

            // Add object to existing scene
            scene.add.existing(this);
            this.isFiring = false;
            this.moveSpeed = 2; //Pixels per frame
            this.moveSpeedUp = 10;
            this.sfxRocket = scene.sound.add('sfx_rocket');
      }

      // Called 60 times per second
      update() {
            if(!this.isFiring) {
                  if(keyLeft.isDown && this.x >= borderUISize + this.width){
                        this.x -= this.moveSpeed;
                  }
                  else if(keyRight.isDown && this.x <= game.config.width - borderUISize - this.width){
                        this.x += this.moveSpeed;
                  }
            }
            // fire button
            if(Phaser.Input.Keyboard.JustDown(keyFire) && !this.isFiring){
                  this.isFiring = true;
                  this.sfxRocket.play();
            }
            // if fired, move up
            if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
                  this.y -= this.moveSpeedUp;
            }
            // reset on miss
            if(this.y <= borderUISize * 3 + borderPadding) {
                  this.reset();
            }
      }

      reset(){
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
      }
}