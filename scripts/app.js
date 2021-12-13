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

class Fermion extends PIXI.Sprite {
	constructor(texture) {
		super(texture);
		this.ferm_type = 0;
	}

	Ferm_Type() {
		return this.ferm_type;
	}

	Ferm_Type(type) {
		this.ferm_type = type;
	}
}

let proton_count = 0;
let neutron_count = 0;
let pion_count = 0;
let antipion_count = 0;
let destroyed = 0;

const score = new PIXI.Text(
	`\
Protons: ${proton_count}
Neutrons: ${neutron_count}
Pions: ${pion_count}
Antipions: ${antipion_count}
Destroyed: ${destroyed}
`);
app.stage.addChild(score);

const instruction_style = new PIXI.TextStyle({
	fontSize: 20,
	fill: 'white',
	
});

const instructions = new PIXI.Text("Press 'S' or Down Arrow to cycle\nthrough particles for the emitter'", instruction_style);
instructions.x = app.screen.width/2,
instructions.y = 30;
app.stage.addChild(instructions);

var sheet_keys = [];

let current_particle_type_num = 0;
let current_particle_type_str = 0;

const current_particle_type_text = new PIXI.Text(`Current Particle Type: ${current_particle_type_str}`);
current_particle_type_text.position.set(app.screen.width/2, 0);
app.stage.addChild(current_particle_type_text);

const emitter_texture = new PIXI.Texture.from("./assets/emitter.png");
const emitter_sprite = new PIXI.Sprite(emitter_texture);
emitter_sprite.anchor.set(0.5, 0.5);
emitter_sprite.scale.set(0.5,0.5);
emitter_sprite.position.set(700,900);
app.stage.addChild(emitter_sprite);

const bullet_texture = new PIXI.Texture.from("./assets/raw/up.png");
const bullet_sprite = new PIXI.Sprite(bullet_texture);
bullet_sprite.position.set(-10, -10);
bullet_sprite.scale.set(0.5,0.5)
bullet_sprite.anchor.set(0.5,0.5);
bullet_sprite.scale.set(0.01, 0.01);
app.stage.addChild(bullet_sprite);

var fermion_list = [];
PIXI.Loader.shared.add('./assets/spritesheet.json').load(setup);

function setup() {
	const sheet = PIXI.Loader.shared.resources["./assets/spritesheet.json"].spritesheet;
	sheet_keys = Object.keys(sheet.textures);
	current_particle_type_str = sheet_keys[current_particle_type_num];
	current_particle_type_text.text = `Current Particle Type: ${current_particle_type_str}`;

	for(let i = 0; i < 20; i++){
		fermion_list[i] = [];

		for(let j = 0; j < 10; j++){
			const rand_num = Math.floor(Math.random()*100) % sheet_keys.length;
			fermion_list[i][j] = new Fermion(sheet.textures[ 
				sheet_keys[rand_num] 
			]);

			fermion_list[i][j].Ferm_Type(sheet_keys[rand_num]);

			fermion_list[i][j].anchor.set(0, 0);
			fermion_list[i][j].width = fermion_list[i][j].height = 60;
			fermion_list[i][j].position.set((60*(i+1)), (60*(j+1))+100);
		
			// fermion_list[i][j].interactive = true;
			// fermion_list[i][j].on('pointerdown', () => {
			// 	app.stage.removeChild(fermion_list[i][j]);
			// })
			app.stage.addChild(fermion_list[i][j]);
		}
	}
}

function update_bullet() {
	current_particle_type_num = ++current_particle_type_num % sheet_keys.length;
	current_particle_type_str = sheet_keys[current_particle_type_num];
	current_particle_type_text.text = `Current Particle Type: ${current_particle_type_str}`;
}

function update_destroyed() 
{
	destroyed++;
	score.text = `\
	Protons: ${proton_count}
	Neutrons: ${neutron_count}
	Pions: ${pion_count}
	Antipions: ${antipion_count}
	Destroyed: ${destroyed}
	`;
}

function update_proton() 
{
	proton_count++;
	score.text = `\
	Protons: ${proton_count}
	Neutrons: ${neutron_count}
	Pions: ${pion_count}
	Antipions: ${antipion_count}
	Destroyed: ${destroyed}
	`;
}

function update_pion() 
{
	pion_count++;
	score.text = `\
	Protons: ${proton_count}
	Neutrons: ${neutron_count}
	Pions: ${pion_count}
	Antipions: ${antipion_count}
	Destroyed: ${destroyed}
	`;
}

function update_antipion() {
	antipion_count++;
	score.text = `\
	Protons: ${proton_count}
	Neutrons: ${neutron_count}
	Pions: ${pion_count}
	Antipions: ${antipion_count}
	Destroyed: ${destroyed}
	`;
}

function update_neutron() {
	neutron_count++;
	score.text = `\
	Protons: ${proton_count}
	Neutrons: ${neutron_count}
	Pions: ${pion_count}
	Antipions: ${antipion_count}
	Destroyed: ${destroyed}
	`;
}

document.addEventListener('keydown', event => {
	if(event.code === 'KeyD' || event.code === "ArrowRight")
		emitter_sprite.x += 10;
	if(event.code === 'KeyA' || event.code === "ArrowLeft")
		emitter_sprite.x -= 10;
	if(event.code === 'Space' || event.code === "ArrowUp")
		if(bullet_sprite.x < 0 || bullet_sprite.y < 0)
			bullet_sprite.position.set(emitter_sprite.x, emitter_sprite.y+10);
	if(event.code === 'KeyS' || event.code === 'ArrowDown')
		if(bullet_sprite.x < 0 || bullet_sprite.y < 0)
			update_bullet()
});

app.ticker.add(delta => move_bullet(delta));
function move_bullet(delta) {
	bullet_sprite.y -= 5;
}

app.ticker.add(delta => collision_check(delta));
function collision_check(delta) 
{
	for(let i = 0; i < fermion_list.length; i++) 
	{
		for(let j = 0; j < fermion_list[i].length; j++) 
		{
			if(fermion_list[i][j] != null) 
			{
				if(
					fermion_list[i][j].x + fermion_list[i][j].width > bullet_sprite.x &&
					fermion_list[i][j].x < bullet_sprite.x + bullet_sprite.width &&
					fermion_list[i][j].y + fermion_list[i][j].height > bullet_sprite.y &&
					fermion_list[i][j].y < bullet_sprite.y + bullet_sprite.height )
					{
						const left = (i > 0 && fermion_list[i-1][j] != null) ? fermion_list[i-1][j].ferm_type : null;
						const right = (i < 19 && fermion_list[i+1][j] != null) ? fermion_list[i+1][j].ferm_type : null;
						const current = fermion_list[i][j].ferm_type;

						console.log(`left: ${left}  right: ${right}  current: ${current}  cur par: ${current_particle_type_str}`);

						// checking for UU- DD- LL- NN-
						if(current_particle_type_str.includes("anti") && !current.includes("anti") ||
						   !current_particle_type_str.includes("anti") && current.includes("anti")) 
						{
							if(current_particle_type_str.includes("lepton") && current.includes("lepton")) 
							{
								update_destroyed();
							}
							if(current_particle_type_str.includes("neutrino") && current.includes("neutrino"))
							{	
								update_destroyed();
							}
							if(current_particle_type_str.includes("down") && current.includes("down")) 
							{
								update_destroyed();
							}
							if(current_particle_type_str.includes("up") && current.includes("up")) 
							{
								update_destroyed();
							}
						}
						else
						{
							// checking for UUD
							if(left != null && 
								(left.includes("up") && current.includes("up") && current_particle_type_str.includes("down") ||
								left.includes("down") && current.includes("up") && current_particle_type_str.includes("up") ||
								left.includes("up") && current.includes("down") && current_particle_type_str.includes("up"))) 
							{
								update_proton();
								app.stage.removeChild(fermion_list[i-1][j]);
								fermion_list[i-1][j] = null;
							}
							// checking for UDD
							if(left != null && 
								(left.includes("up") && current.includes("down") && current_particle_type_str.includes("down") ||
								left.includes("down") && current.includes("down") && current_particle_type_str.includes("up") ||
								left.includes("down") && current.includes("up") && current_particle_type_str.includes("down"))) 
							{
								update_neutron();
								app.stage.removeChild(fermion_list[i-1][j]);
								fermion_list[i-1][j] = null;
							}
							
							// checking for UUD
							if(right != null &&
								(right.includes("up") && current.includes("up") && current_particle_type_str.includes("down") ||
								right.includes("down") && current.includes("up") && current_particle_type_str.includes("up") ||
								right.includes("up") && current.includes("down") && current_particle_type_str.includes("up"))) 
							{
								update_proton();
								app.stage.removeChild(fermion_list[i+1][j]);
								fermion_list[i+1][j] = null;
							}
							//checking for UDD
							if(right != null &&
								(right.includes("up") && current.includes("down") && current_particle_type_str.includes("down") ||
								right.includes("down") && current.includes("down") && current_particle_type_str.includes("up") ||
								right.includes("down") && current.includes("up") && current_particle_type_str.includes("down"))) 
							{
								update_neutron();
								app.stage.removeChild(fermion_list[i+1][j]);
								fermion_list[i+1][j] = null;
							}
						}
						
						// checking for UD-
						if(
							current_particle_type_str.includes("up") && 
							( current.includes("down") && current.includes("anti") ) ||

							current.includes("up") && 
							( current_particle_type_str.includes("down") && current_particle_type_str.includes("anti") )
						) 
						{
							update_pion();
						}

						// checking for DU- 
						if(
							current_particle_type_str.includes("down") && 
							( current.includes("up") && current.includes("anti") ) ||

							current.includes("down") && 
							( current_particle_type_str.includes("up") && current_particle_type_str.includes("anti") )
						) 
						{
							update_antipion();
						}


					app.stage.removeChild(fermion_list[i][j]);
					fermion_list[i][j] = null;
					bullet_sprite.position.set(-10,-10);
				}
			}
		}	
	}
}