// Beveal Shape for button
class Beveal extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        // Shapes
        let topT = scene.add.triangle(0, 0, 73, 23, 148, 73, 223, 23, 0xADB5BD);
        let leftT = scene.add.triangle(0, 0, 23, 33, 73, 66, 23, 103, 0x495057);
        let rightT = scene.add.triangle(0, 0, 173, 103, 123, 66, 173, 33, 0x343A40);
        let bottomT = scene.add.triangle(0, 0, 73, 98, 148, 38, 223, 98, 0x212529);
        
        let rect = scene.add.graphics();
            rect.fillGradientStyle(0x212529, 0x212529, 0x212529, 0xADB5BD, 1);
            rect.fillRect(13, 8, 119, 48);
        
        // Container of shapes
        this.add([topT, leftT, rightT, bottomT, rect]);

        // Add the container to the scene's display list
        scene.add.existing(this);
    }
}

//Interactive Button
class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, callback) {
        super(scene, x, y);

        // Interactive button        
        let buttonShape = new Beveal(scene, 0, 0);

        // Add label text: text(x,y,text,size, color).orgin(x, y)
        let label = scene.add.text(29, 17, text, { 
            fontSize: '30px', 
            fill: '#fff' });

        // center text inside button
        label.setPosition(223 / 8, 103 / 6);

        // Add components to the container
        this.add([buttonShape, label]);
        
        // Make the whole container interactive // define interaction area
        this.setSize(223, 103);
        this.setInteractive();

        // Add events (Hover effects and click)
        this.on('pointerover', () => this.setScale(1.05));
        this.on('pointerout', () => this.setScale(1));
        this.on('pointerdown', () => this.setScale(0.95));
        this.on('pointerup', () => {
            this.setScale(1.05);
            callback();
        });

        // Add the container to the scene
        scene.add.existing(this);
    }
}

class Loading extends Phaser.Scene{
    constructor(){
        super('loading');
    }
    init(data){
        this.nextScene = data.next || 'intro';
    }
    preload(){}
    create(){  
    
        // Rectangle frame: rectangle with no fill (centerX, centerY, width, height) border (width, color, opacity)
        this.add.rectangle(400, 270, 600, 50).setStrokeStyle(8, 0xb6f0deff);
        
        // Loading Text
        this.textObject = this.add.text(
            300,     // x
            150,    // y
            "Loading...", // text
            { font: "50px Press Start 2P", color: "#b6f0deff" } // size & font, color
        );

        // Fade in Scene
        this.cameras.main.fadeIn(500);

        // Loading Bar
        this.tweens.add({ //bar: rectangle(x, y, fade at x of bar, height, color).setOrigin(Left to Right)
            targets: this.add.rectangle(110, 270, 0, 30, 0xb6f0deff).setOrigin(0, 0.5), 
            width: 580, 
            alpha: 1, // Opacity: full
            duration: 2000, //duration of action
            delay: 200, // delay start
            ease: 'Power2', //rate of change of animation
            onComplete: () => {
                this.cameras.main.fadeOut(300);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start(this.nextScene);
                });
            },
        });
    }
    update(){}
}

class Intro extends Phaser.Scene{
    constructor(){
        super('intro');
    }
    preload(){
        this.load.image('background', 'assets/anarkaliart-ai-generated-8309295.png');
    }
    create(){
        //set background image (WhitePawBlkBg.png)
        let bg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'background');
        bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        // Add Moving Text
        let title = "Roly Poly:\nTo the End";

        [...title].forEach((letter, i) => {

            let char = this.add.text(
                75 + (i * 50), // horizontal spacing
                i % 2 === 0 ? -100 : 600, // alternate top/bottom
                letter,
                {
                    font: "80px Press Start 2P",
                    color: "#ffffff"
                }
            );

            this.tweens.add({
                targets: char,
                y: 200,
                duration: 500,
                delay: i * 220,
                ease: 'Back.Out',

                onComplete: () => { // only on last letter
                    if (i === title.length - 1) {
                        // 2s delay then loading then menu
                        this.time.delayedCall(1000, () => {
                            this.cameras.main.fadeOut(300);
                            this.scene.start('loading', { next: 'menu' });
                        });
                    }
                }
            });
        });

        // Fade in Scene
        this.cameras.main.fadeIn(500);

    }
    update(){}
}

class Menu extends Phaser.Scene{
    constructor(){
        super('menu');
    }
    preload(){
        this.load.image('background', 'assets/anarkaliart-ai-generated-8309295.png');
        this.load.image('fairy', 'assets/greenFairy.png');
    }
    create(){
        //set background image (WhitePawBlkBg.png)
        let bg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'background');
        bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        //cat picture
        this.imageObject = this.add.image(650, 250, 'fairy');
        this.imageObject.setScale(0.48);

        //Add buttons
        new Button(this, 160, 180, 'Start', () => {
            this.scene.start('loading'); 
        });

        new Button(this, 160, 260, 'Exit', () => {});

        new Button(this, 160, 340, 'Menu', () => {});

        this.textObject = this.add.text(
            80,     // x
            100,    // y
            "Roly Poly: To the End",
            { font: "60px Press Start 2P", color: "#ffffff" } // white text
        );

        // Fade in Scene
        this.cameras.main.fadeIn(500);
    }
    update(){}
}

let config = {
    type: Phaser.WEBGL,
    scale: { // automatic fit screen size
        mode: Phaser.Scale.FIT, // FIT or ENVELOP
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800, 
        height: 500, 
    },
    backgroundColor: #76bdafff,
    scene: [Loading, Intro, Menu],
}

let game = new Phaser.Game(config);
