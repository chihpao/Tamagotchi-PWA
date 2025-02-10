import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  private pet!: Phaser.GameObjects.Sprite;
  
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('pet_idle', 'assets/pet_idle.png');
    this.load.spritesheet('pet_eat', 'assets/pet_eat.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    // 基本角色動畫
    this.anims.create({
      key: 'eat',
      frames: this.anims.generateFrameNumbers('pet_eat', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: 0
    });

    this.pet = this.add.sprite(400, 300, 'pet_idle');
    
    // 點擊互動範例
    this.pet.setInteractive();
    this.pet.on('pointerdown', () => {
      this.pet.play('eat');
    });
  }

  update() {
    // 遊戲狀態更新邏輯
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene],
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);