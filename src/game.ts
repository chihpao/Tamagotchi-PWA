import Phaser from 'phaser';

enum PetState {
  Happy,
  Hungry,
  Sleepy,
  Sick
}

class GameScene extends Phaser.Scene {
  private chicken!: Phaser.GameObjects.Sprite;
  private state: PetState = PetState.Happy;
  private stateText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // 載入雞圖像與進食動畫精靈圖
    this.load.image('chicken_idle', 'assets/chicken_idle.jpg');
    this.load.spritesheet('chicken_eat', 'assets/chicken_eat.jpg', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    // 設定背景色以確認畫布是否正確顯示
    this.cameras.main.setBackgroundColor('#24252A');
    console.log('GameScene created');
  
    // 等待第一個使用者互動來啟動 Audio Context
    this.input.once('pointerdown', () => {
      const webAudio = this.sound as Phaser.Sound.WebAudioSoundManager;
      if (webAudio.context.state === 'suspended') {
        webAudio.context.resume().then(() => console.log('AudioContext resumed'));
      }
    });
  
    // 建立進食動畫
    this.anims.create({
      key: 'eat',
      frames: this.anims.generateFrameNumbers('chicken_eat', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: 0
    });
    
    // 建立雞角色並設定互動
    this.chicken = this.add.sprite(400, 300, 'chicken_idle');
    this.chicken.setInteractive();
    this.chicken.on('pointerdown', () => this.interact());
    
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
    // 遊戲邏輯更新，可擴充更多動態效果
  }

  private interact() {
    // 當雞角色被點擊，根據當前狀態觸發不同互動
    if (this.state === PetState.Hungry) {
      // 進食後回復快樂狀態
      this.chicken.play('eat');
      this.state = PetState.Happy;
    } else {
      // 當雞不是飢餓時，使用隨機邏輯改變狀態
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

// Service Worker 註冊：僅在生產環境下註冊
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