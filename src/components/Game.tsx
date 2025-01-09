import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface GameProps {
  isPlaying: boolean;
  onGameEnd: () => void;
}

export const Game = ({ isPlaying, onGameEnd }: GameProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (isPlaying && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 300, x: 0 },
            debug: false
          }
        },
        scene: {
          preload: function(this: Phaser.Scene) {
            this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
            this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
            this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
            this.load.spritesheet('dude', 
              'https://labs.phaser.io/assets/sprites/dude.png',
              { frameWidth: 32, frameHeight: 48 }
            );
          },
          create: function(this: Phaser.Scene) {
            // Add score text
            const scoreText = this.add.text(16, 16, 'Score: 0', { 
              fontSize: '32px',
              color: '#fff'
            });
            (this as any).scoreText = scoreText;
            (this as any).score = 0;

            // Create game objects
            this.add.image(400, 300, 'sky').setScale(2);
            
            const platforms = this.physics.add.staticGroup();
            platforms.create(400, window.innerHeight - 64, 'ground').setScale(2).refreshBody();

            // Add some floating platforms
            platforms.create(600, 400, 'ground');
            platforms.create(50, 250, 'ground');
            platforms.create(750, 220, 'ground');

            // Player setup
            const player = this.physics.add.sprite(100, 450, 'dude');
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);

            this.anims.create({
              key: 'left',
              frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
              frameRate: 10,
              repeat: -1
            });

            this.anims.create({
              key: 'turn',
              frames: [{ key: 'dude', frame: 4 }],
              frameRate: 20
            });

            this.anims.create({
              key: 'right',
              frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
              frameRate: 10,
              repeat: -1
            });

            this.physics.add.collider(player, platforms);

            // Add stars
            const stars = this.physics.add.group({
              key: 'star',
              repeat: 11,
              setXY: { x: 12, y: 0, stepX: 70 }
            });

            stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
              if (child instanceof Phaser.Physics.Arcade.Sprite) {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
              }
              return true;
            });

            this.physics.add.collider(stars, platforms);

            // Collect stars and update score
            this.physics.add.overlap(player, stars, (player: any, star: any) => {
              star.disableBody(true, true);
              
              // Update score
              (this as any).score += 10;
              (this as any).scoreText.setText('Score: ' + (this as any).score);
              
              if (stars.countActive(true) === 0) {
                // Show game over screen
                const gameOverText = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Game Over!\nFinal Score: ' + (this as any).score, {
                  fontSize: '64px',
                  color: '#fff',
                  align: 'center'
                });
                gameOverText.setOrigin(0.5);
                
                console.log('Game completed! Final score:', (this as any).score);
                onGameEnd();
                gameRef.current?.destroy(true);
                gameRef.current = null;
              }
            }, undefined, this);

            // Store in scene for update
            (this as any).player = player;
            (this as any).cursors = this.input.keyboard.createCursorKeys();
          },
          update: function(this: Phaser.Scene) {
            const { player, cursors } = this as any;
            
            if (cursors.left.isDown) {
              player.setVelocityX(-160);
              player.anims.play('left', true);
            } else if (cursors.right.isDown) {
              player.setVelocityX(160);
              player.anims.play('right', true);
            } else {
              player.setVelocityX(0);
              player.anims.play('turn');
            }

            if (cursors.up.isDown && player.body.touching.down) {
              player.setVelocityY(-330);
            }
          }
        }
      };

      console.log('Creating new Phaser game instance');
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        console.log('Destroying Phaser game instance');
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [isPlaying, onGameEnd]);

  return (
    <>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/lovable-uploads/5e1243d3-f031-41c5-9e3a-c6254ebfd113.png')`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0
            }}
          />
        </div>
      )}
      <div id="game-container" className="w-full h-full relative z-10" />
    </>
  );
};