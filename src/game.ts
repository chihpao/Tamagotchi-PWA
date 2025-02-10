import Phaser from 'phaser';

enum PetState {
  Happy,
  Hungry,
  Sleepy,
  Sick
}

class GameScene extends Phaser.Scene {
  private pet!: Phaser.GameObjects.Sprite;
  private state: PetState = PetState.Happy;
  private stateText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // 載入角色圖像與動畫精靈圖
    this.load.image('pet_idle', 'assets/pet_idle.png');
    this.load.spritesheet('pet_eat', 'assets/pet_eat.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    // 建立進食動畫
    this.anims.create({
      key: 'eat',
      frames: this.anims.generateFrameNumbers('pet_eat', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: 0
    });
    
    // 建立角色精靈並設定互動
    this.pet = this.add.sprite(400, 300, 'pet_idle');
    this.pet.setInteractive();
    this.pet.on('pointerdown', () => this.interact());
    
    // 顯示目前狀態文字
    this.stateText = this.add.text(10, 10, '狀態: 快樂', { fontSize: '20px', color: '#ffffff' });
    
    // 模擬狀態變化：每 10 秒若角色為快樂狀態則變為飢餓
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        if (this.state === PetState.Happy) {
          this.state = PetState.Hungry;
          this.updateStateText();
        }
      },
      loop: true
    });
  }

  update() {
    // 遊戲邏輯更新
  }

  private interact() {
    // 當角色被點擊，根據當前狀態觸發不同互動
    if (this.state === PetState.Hungry) {
      // 進食後回復快樂狀態
      this.pet.play('eat');
      this.state = PetState.Happy;
    } else {
      // 當角色不是飢餓時，加入隨機狀態變化增加趣味性
      const random = Phaser.Math.Between(0, 100);
      if (random < 30) {
        this.state = PetState.Sleepy;
      } else if (random < 60) {
        this.state = PetState.Sick;
      } else {
        this.state = PetState.Happy;
      }
    }
    this.updateStateText();
  }

  private updateStateText() {
    let textStatus = '';
    switch (this.state) {
      case PetState.Happy:
        textStatus = '快樂';
        break;
      case PetState.Hungry:
        textStatus = '飢餓';
        break;
      case PetState.Sleepy:
        textStatus = '困倦';
        break;
      case PetState.Sick:
        textStatus = '生病';
        break;
    }
    this.stateText.setText('狀態: ' + textStatus);
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

const game = new Phaser.Game(config);

// Service Worker 註冊：僅在生產環境下註冊，避免 webpack watch 模式下重複生成
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration =>
        console.log('Service Worker registered with scope:', registration.scope)
      )
      .catch(error =>
        console.error('Service Worker registration failed:', error)
      );
  });
}