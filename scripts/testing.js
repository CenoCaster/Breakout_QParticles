const Application = PIXI.Application;

const app = new Application(
	{
		width: 905,
		height: 1000,
		transparent: false,
		antialias: true
	}
);

app.renderer.backgroundColor = 0x23395D;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = 'absolute';

document.body.appendChild(app.view);


const Graphics = PIXI.Graphics;

const rectangle = new Graphics();

rectangle.beginFill(0xAA33BB)
.lineStyle(4,0xFFEA00, 1)
.drawRect(200,200,100,120)
.endFill();
app.stage.addChild(rectangle);

const poly = new Graphics();
poly.beginFill(0xFF66FF)
.lineStyle(4,0xEACC45,1)
.drawPolygon([
		600, 50,
		800, 150,
		900, 300,
		400, 400
])
.endFill();
app.stage.addChild(poly);

const circle = new Graphics();
circle.beginFill(0x22AACC)
.drawCircle(440,200, 80)
.endFill();
app.stage.addChild(circle);

const line = new Graphics();
line.lineStyle(5, 0x0080EE, 1)
.moveTo(400,400)
.lineTo(400, 800)
.endFill();
app.stage.addChild(line);

const torus = new Graphics();
torus.beginFill(0x9900EE)
.drawTorus(100,700,70,100, 0, Math.PI / 2)
.endFill();
app.stage.addChild(torus);

const star = new Graphics();
star.beginFill(0xCA3520)
.drawStar(700, 700, 0xfff, 200)
.endFill()
app.stage.addChild(star);

const style = new PIXI.TextStyle({
	fontFamily: 'Comic Sans MS',
	fontSize: 48,
	fill: 'deepskyblue',
	stroke: '#ffffff',
	dropShadow: true,
	dropShadowDistance: 10,
	dropShadowAngle: Math.PI/2,
	dropShadowBlur: 5,
	dropShadowColor: '#000000'

});
const myText = new PIXI.Text('Hello world!', style);
app.stage.addChild(myText);

myText.text = 'Goodbye World!';

// app.ticker.add(delta => loop(delta));

// function loop(delta) {
// 	// const rect = new Graphics();

// 	// rect.beginFill(0xeedddd)
// 	// .drawRect(Math.random()*app.screen.width, Math.random()*app.screen.height,10,10)
// 	// .endFill();
// 	// app.stage.addChild(rect);
// }

const char1Texture = PIXI.Texture.from('./assets/up.png');
const char1Sprite = new PIXI.Sprite(char1Texture, true);
app.stage.addChild(char1Sprite);

// char1Sprite.scale.x = 1.5;
// char1Sprite.scale.y = 2;
// char1Sprite.scale.set(2,2);

// char1Sprite.x = 200;
// char1Sprite.y = 200;
char1Sprite.position.set(200,200);
char1Sprite.anchor.set(0.5,0.5);

app.ticker.add(delta => moveImg(delta));
function moveImg(delta) {
	// char1Sprite.x = ((char1Sprite.x+5) % app.screen.width);
	char1Sprite.rotation += 0.01;
}

char1Sprite.interactive = true;
char1Sprite.buttonMode = true;
char1Sprite.on('pointerdown', function() {
	char1Sprite.scale.x += 0.1;
	char1Sprite.scale.y += 0.1;
});

document.addEventListener('keydown', event => {
	console.log(event.code);
	if(event.code === 'KeyD' || event.code === "ArrowRight")
		char1Sprite.x += 10;
	if(event.code === 'KeyA' || event.code === "ArrowLeft")
		char1Sprite.x -= 10;
});

const container = new PIXI.Container();
const char2Sprite = new PIXI.Sprite(char1Texture, true);
container.addChild(char2Sprite);

const char3Sprite = new PIXI.Sprite(char1Texture, true);
container.addChild(char3Sprite);

app.stage.addChild(container);

char2Sprite.position.set(50,50);
container.x = 200;
console.log(char3Sprite.x);
console.log(char3Sprite.getGlobalPosition());


const particleContainer = new PIXI.ParticleContainer(1000, {
	position: true,
	rotation: true,
	vertices: true,
	tint: true,
	uvs: true
});

const loader = PIXI.Loader.shared;

loader.add('char4Texture', './assets/charged.png')
.add('char5Texture', './assets/neutrino.png')
.load(setup);

function setup(loader, resources) {
	const char4Sprite = new PIXI.Sprite(
		resources.char4Texture.texture
	);
	char4Sprite.position.set(400,345);
	app.stage.addChild(char4Sprite);
}

loader.onLoad.add(function(){console.log("successful load!")});
loader.onError.add(function(){console.log("load failed!")});