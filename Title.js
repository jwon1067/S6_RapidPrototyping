// Beveal Shape for button
class Beveal extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        // Shapes
        let topT = scene.add.triangle(0, 0, 73, 23, 148, 73, 223, 23, 0x83C5BE);
        let leftT = scene.add.triangle(0, 0, 23, 33, 73, 66, 23, 103, 0x42999B);
        let rightT = scene.add.triangle(0, 0, 173, 103, 123, 66, 173, 33, 0x218389);
        let bottomT = scene.add.triangle(0, 0, 73, 98, 148, 38, 223, 98, 0x006D77);
        
        let rect = scene.add.graphics();
            rect.fillGradientStyle(0x006D77, 0x006D77, 0x006D77, 0x83C5BE, 1);
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
        this.nextScene = data.next || 'title';
    }
    preload(){}
    create(){  
    
        // Rectangle frame: rectangle with no fill (centerX, centerY, width, height) border (width, color, opacity)
        this.add.rectangle(400, 270, 600, 50).setStrokeStyle(8, 0x83c5be);
        
        // Loading Text
        this.textObject = this.add.text(
            300,     // x
            150,    // y
            "Loading...", // text
            { font: "50px Press Start 2P", color: "#83c5be" } // size & font, color
        );

        // Fade in Scene
        this.cameras.main.fadeIn(500);

        // Loading Bar
        this.tweens.add({ //bar: rectangle(x, y, fade at x of bar, height, color).setOrigin(Left to Right)
            targets: this.add.rectangle(110, 270, 0, 30, 0x83c5be).setOrigin(0, 0.5), 
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

class Title extends Phaser.Scene{
    constructor(){
        super('title');
    }
    preload(){
        this.load.image('storyBook', 'assets/AdobeStock_1052679189.jpeg');
        this.load.image('fairy1', 'assets/greenFairy.png');
    }
    create(){
        //set background image
        let bg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'storyBook');
        bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        //green fairy picture
        this.imageObject = this.add.image(550, 275, 'fairy1');
        this.imageObject.setScale(0.48);

        //Add buttons
        new Button(this, 160, 180, 'Start', () => {
            this.scene.start('victory'); 
        });

        new Button(this, 160, 260, 'Exit', () => {});

        new Button(this, 160, 340, 'Menu', () => {});

        this.textObject = this.add.text(
            120,     // x
            100,    // y
            "Roly Poly:   To the End",
            { font: "60px Press Start 2P", color: "#ffffff" } // white text
        );

        // Fade in Scene
        this.cameras.main.fadeIn(500);
    }
    update(){}
}

class Victory extends Phaser.Scene{
    constructor(){
        super('victory');
    }
    preload(){
        //background image
        this.load.image('background', 'assets/anarkaliart-ai-generated-8309295.png');
        //fairy images
        this.load.image('fairy1', 'assets/greenFairy.png');
        this.load.image('fairy2', 'assets/pinkFairy.png');
        this.load.image('fairy3', 'assets/blueFairy.png');
        this.load.image('fairy4', 'assets/tealFairy.png');
        this.load.image('fairy5', 'assets/purpleFairy.png');
        //snail images
        this.load.image('snail1', 'assets/brownSnail.png');
        this.load.image('snail2', 'assets/greySnail.png');
        //roly poly image
        this.load.image('rolyPoly', 'assets/rolyPoly.png');
        //banner image
        this.load.image('banner', 'assets/AdobeStock_415886775.png');
    }
    create(){
        //set background image
        let bg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'background');
        bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        // add fairies in an array
        this.fairies = [];

        this.fairies.push(this.add.image(350, 100, 'fairy4'));
        this.fairies.push(this.add.image(650, 300, 'fairy1'));
        this.fairies.push(this.add.image(100, 200, 'fairy5'));
        this.fairies.push(this.add.image(520, 170, 'fairy2'));
        this.fairies.push(this.add.image(250, 350, 'fairy3'));

        // add snails
        this.imageObject = this.add.image(140, 400, 'snail1');
        this.imageObject.setScale(0.2);

        this.imageObject = this.add.image(500, 400, 'snail2');
        this.imageObject.setScale(0.2);

        // add roly poly
        this.imageObject = this.add.image(370, 420, 'rolyPoly');
        this.imageObject.setScale(0.35);

        // Add moving fairies
        let i = 0; // index for fairies

        this.fairies.forEach(fairy => {
            fairy.setAlpha(0); // Invisible fairies
            fairy.setScale(0.4); // full size fairies
            fairy.scaleX = 0.4; // ensure consistent start
        });

        let playFairy = () => {
            if (i >= this.fairies.length){ 
                   this.imageObject = this.add.image(380, 250, 'banner').setScale(0.12);
                return; 
            }

            let fairy = this.fairies[i];

            this.tweens.add({ // fairy pop in
                targets: fairy,
                alpha: 1,
                scale: 0.4,
                duration: 500,
                ease: 'Back.out(2)',

                onComplete: () => {
                    this.tweens.add({ // horizontal spin
                        targets: fairy,
                        scaleX: 0, 
                        duration: 100,
                        yoyo: true,
                        ease: 'Sine.inOut',

                        onComplete: () => { // move to next fairy
                            i++;
                            playFairy();
                        }
                    });
                }
            });
        };
        playFairy();
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
    backgroundColor: 0x006d77,
    scene: [Loading, Title, Victory],
}

let game = new Phaser.Game(config);
