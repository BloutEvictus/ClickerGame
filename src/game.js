var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
 
game.state.add('play', {
    preload: function() {
		//Monster images
        this.game.load.image('aerocephal', 'assets/allacrost_enemy_sprites/aerocephal.png');
		this.game.load.image('arcana_drake', 'assets/allacrost_enemy_sprites/arcana_drake.png');
		this.game.load.image('aurum-drakueli', 'assets/allacrost_enemy_sprites/aurum-drakueli.png');
		this.game.load.image('bat', 'assets/allacrost_enemy_sprites/bat.png');
		this.game.load.image('daemarbora', 'assets/allacrost_enemy_sprites/daemarbora.png');
		this.game.load.image('deceleon', 'assets/allacrost_enemy_sprites/deceleon.png');
		this.game.load.image('demonic_essence', 'assets/allacrost_enemy_sprites/demonic_essence.png');
		this.game.load.image('dune_crawler', 'assets/allacrost_enemy_sprites/dune_crawler.png');
		this.game.load.image('green_slime', 'assets/allacrost_enemy_sprites/green_slime.png');
		this.game.load.image('nagaruda', 'assets/allacrost_enemy_sprites/nagaruda.png');
		this.game.load.image('rat', 'assets/allacrost_enemy_sprites/rat.png');
		this.game.load.image('scorpion', 'assets/allacrost_enemy_sprites/scorpion.png');
		this.game.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
		this.game.load.image('snake', 'assets/allacrost_enemy_sprites/snake.png');
		this.game.load.image('spider', 'assets/allacrost_enemy_sprites/spider.png');
		this.game.load.image('stygian_lizard', 'assets/allacrost_enemy_sprites/stygian_lizard.png');
		//Background images
		this.game.load.image('forest-back', 'assets/parallax_forest_pack/layers/parallax-forest-back-trees.png');
		this.game.load.image('forest-lights', 'assets/parallax_forest_pack/layers/parallax-forest-lights.png');
		this.game.load.image('forest-middle', 'assets/parallax_forest_pack/layers/parallax-forest-middle-trees.png');
		this.game.load.image('forest-front', 'assets/parallax_forest_pack/layers/parallax-forest-front-trees.png');
		//LOOT!!!
		this.game.load.image('gold_coin', 'assets/496_RPG_icons/I_GoldCoin.png');
		//Button images
		this.game.load.image('dagger', 'assets/496_RPG_icons/W_Dagger002.png');
        this.game.load.image('swordIcon1', 'assets/496_RPG_icons/S_Sword15.png');
		this.game.load.image('fireIcon1', 'assets/496_RPG_icons/S_Fire01.png');
		
		var healthBar = this.game.add.bitmapData(100,20);
		healthBar.ctx.strokeStyle = '#000000';
		healthBar.ctx.fillStyle = '#FF0000';
		healthBar.ctx.lineWidth = 2;
		healthBar.ctx.fillRect(0,0,100,20);
		healthBar.ctx.strokeRect(0,0,100,20);
		this.game.cache.addBitmapData('healthBar', healthBar);
		
		/******UI elements******/
		// build panel for upgrades
		var bmd = this.game.add.bitmapData(250, 500);
		bmd.ctx.fillStyle = '#9a783d';
		bmd.ctx.strokeStyle = '#35371c';
		bmd.ctx.lineWidth = 12;
		bmd.ctx.fillRect(0, 0, 250, 500);
		bmd.ctx.strokeRect(0, 0, 250, 500);
		this.game.cache.addBitmapData('upgradePanel', bmd);
		 
		var buttonImage = this.game.add.bitmapData(476, 48);
		buttonImage.ctx.fillStyle = '#e6dec7';
		buttonImage.ctx.strokeStyle = '#35371c';
		buttonImage.ctx.lineWidth = 4;
		buttonImage.ctx.fillRect(0, 0, 225, 48);
		buttonImage.ctx.strokeRect(0, 0, 225, 48);
		this.game.cache.addBitmapData('button', buttonImage);
		
		// world progression
		this.level = 1;
		// how many monsters have we killed during this level
		this.levelKills = 0;
		// how many monsters are required to advance a level
		this.levelKillsRequired = 10;
    },
    create: function() {
		//Loading screen setup
        var skeletonSprite = game.add.sprite(450, 290, 'skeleton');
        skeletonSprite.anchor.setTo(0.5, 0.5);
		
		//Background image setup
		var state = this;
		this.background = this.game.add.group();
		// setup each of our background layers to take the full screen
		['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
			.forEach(function(image) {
				var bg = state.game.add.tileSprite(0, 0, state.game.world.width,
					state.game.world.height, image, '', state.background);
				bg.tileScale.setTo(4,4);
			});
			
		//Monster sprites setup
		var monsterData = [
			{name: 'Aerocephal',        image: 'aerocephal',        maxHealth: 20},
			{name: 'Arcana Drake',      image: 'arcana_drake',      maxHealth: 20},
			{name: 'Aurum Drakueli',    image: 'aurum-drakueli',    maxHealth: 20},
			{name: 'Bat',               image: 'bat',               maxHealth: 20},
			{name: 'Daemarbora',        image: 'daemarbora',        maxHealth: 20},
			{name: 'Deceleon',          image: 'deceleon',          maxHealth: 20},
			{name: 'Demonic Essence',   image: 'demonic_essence',   maxHealth: 20},
			{name: 'Dune Crawler',      image: 'dune_crawler',      maxHealth: 20},
			{name: 'Green Slime',       image: 'green_slime',       maxHealth: 20},
			{name: 'Nagaruda',          image: 'nagaruda',          maxHealth: 20},
			{name: 'Rat',               image: 'rat',               maxHealth: 20},
			{name: 'Scorpion',          image: 'scorpion',          maxHealth: 20},
			{name: 'Skeleton',          image: 'skeleton',          maxHealth: 20},
			{name: 'Snake',             image: 'snake',             maxHealth: 20},
			{name: 'Spider',            image: 'spider',            maxHealth: 20},
			{name: 'Stygian Lizard',    image: 'stygian_lizard',    maxHealth: 20}
			//TODO add chest monster
			//TODO add boss monsters
		];
		
		this.monsters = this.game.add.group();

		var monster;
		monsterData.forEach(function(data) {
			// create a sprite for them off screen
			monster = state.monsters.create(1000, state.game.world.centerY, data.image);
			
			// center anchor
			monster.anchor.setTo(0.5);
			
			// reference to the database
			monster.details = data;
						
			// use the built in health component
			monster.health = monster.maxHealth = data.maxHealth;
			
			// hook into health and lifecycle events
			monster.events.onKilled.add(state.onKilledMonster, state);
			monster.events.onRevived.add(state.onRevivedMonster, state);
		 
			//enable input so we can click it!
			monster.inputEnabled = true;
			monster.events.onInputDown.add(state.onClickMonster, state);
		});
		
		this.currentMonster = this.monsters.getRandom();
		this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
		
		// the main player
		this.player = {
			clickDmg: 2,
			gold: 0,
			dps: 0
		};
		
		//Group to display monster information
		this.monsterInfoUI = this.game.add.group();
		this.monsterInfoUI.position.setTo(this.currentMonster.x - 220, this.currentMonster.y + 120);
		this.monsterNameText = this.monsterInfoUI.addChild(this.game.add.text(0, 0, this.currentMonster.details.name, {
			font: '32px Arial Black',
			fill: '#fff',
			strokeThickness: 3
		}));
		this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(0, 80, this.currentMonster.health + ' HP', {
			font: '24px Arial Black',
			fill: '#ff0000',
			strokeThickness: 3
		}));
		this.healthBar = this.game.add.image(this.currentMonster.x - 50, this.currentMonster.y - 150, this.game.cache.getBitmapData('healthBar'));
		
		//Show scrolling damage text
		this.dmgTextPool = this.add.group();
		var dmgText;
		for (var d=0; d<50; d++) {
			dmgText = this.add.text(0, 0, '1', {
				font: '64px Arial Black',
				fill: '#fff',
				strokeThickness: 4
			});
			// start out not existing, so we don't draw it yet
			dmgText.exists = false;
			dmgText.tween = game.add.tween(dmgText)
				.to({
					alpha: 0,
					y: 100,
					x: this.game.rnd.integerInRange(100, 900)
				}, 1000, Phaser.Easing.Cubic.Out);
		 
			dmgText.tween.onComplete.add(function(text, tween) {
				text.kill();
			});
			this.dmgTextPool.add(dmgText);
		}
		
		//create a pool of gold coins
		this.coins = this.add.group();
		this.coins.createMultiple(50, 'gold_coin', '', false);
		this.coins.setAll('inputEnabled', true);
		this.coins.setAll('goldValue', 1);
		this.coins.callAll('events.onInputDown.add', 'events.onInputDown', this.onClickCoin, this);
		
		this.currentGoldValue = 1;
		
		//Gold text		
		this.playerGoldText = this.add.text(30, 30, 'Gold: ' + this.player.gold, {
			font: '24px Arial Black',
			fill: '#fff',
			strokeThickness: 4
		});
		
		//Button array
		var upgradeButtonsData = [
			{icon: 'dagger', name: 'Attack', baseDamage: 2, currentDamage: 2, level: 1, cost: 10, purchaseHandler: function(button, player) {
				button.details.currentDamage = 2 * button.details.level;
				player.clickDmg = button.details.currentDamage;
			}, costHandler: function(button, player) {
				button.details.cost = Math.round(10 * Math.pow(1.08, button.details.level));
			}},
			{icon: 'swordIcon1', name: 'Auto-Attack', baseDamage: 5, currentDamage: 0, level: 0, cost: 40, purchaseHandler: function(button, player) {
				if(button.details.level == 1) {
					player.dps = Math.round(button.details.baseDamage);
					button.details.currentDamage = Math.round(button.details.baseDamage);
				} else {
					button.details.currentDamage = Math.round(5 * button.details.level);
					player.dps += button.details.currentDamage;
					console.log("Player dps: " + player.dps);
				}
			}, costHandler: function(button, player) {
				button.details.cost = Math.round(40 * Math.pow(1.08, button.details.level));
			}}/*,
			{icon: 'fireIcon1', name: 'Fire Attack', baseDamage: 70, currentDamage: 0, level: 0, cost: 300, purchaseHandler: function(button, player) {
				if(button.details.level == 1) {
					player.dps += button.details.baseDamage;
					button.details.currentDamage = button.details.baseDamage;
				} else {
					button.details.currentDamage += Math.round((button.details.baseDamage + button.details.level) * 1.24);
					player.dps += Math.round((button.details.baseDamage + button.details.level) * 1.24);
				}
			}, costHandler: function(button, player) {
				button.details.cost = Math.round(0.056*Math.pow(button.details.level,3) + 0.343*Math.pow(button.details.level,2) + 8.844*button.details.level + 300);
			}}*/
		];

		//UI Button panel
		this.upgradePanel = this.game.add.image(10, 70, this.game.cache.getBitmapData('upgradePanel'));
		var upgradeButtons = this.upgradePanel.addChild(this.game.add.group());
		upgradeButtons.position.setTo(8, 8);
		
		//Add buttons to button panel
		var button;
		upgradeButtonsData.forEach(function(buttonData, index) {
			button = state.game.add.button(0, (50 * index), state.game.cache.getBitmapData('button'));
			button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
			button.text = button.addChild(state.game.add.text(42, 4, buttonData.name + ': ' + buttonData.level, {font: '12px Arial Black'}));
			button.details = buttonData;
			button.costText = button.addChild(state.game.add.text(42, 16, 'Cost: ' + buttonData.cost, {font: '12px Arial Black'}));
			button.damageText = button.addChild(state.game.add.text(42, 28, 'Damage: ' + buttonData.currentDamage, {font: '12px Arial Black'}));
			button.events.onInputDown.add(state.onUpgradeButtonClick, state);
		 
			upgradeButtons.addChild(button);
		});
		
		// 100ms 10x a second
		this.dpsTimer = this.game.time.events.loop(100, this.onDPS, this);
		
		// setup the world progression display
		this.levelUI = this.game.add.group();
		this.levelUI.position.setTo(this.game.world.centerX, 30);
		this.levelText = this.levelUI.addChild(this.game.add.text(0, 0, 'Level: ' + this.level, {
			font: '24px Arial Black',
			fill: '#fff',
			strokeThickness: 4
		}));
		this.levelKillsText = this.levelUI.addChild(this.game.add.text(0, 30, 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired, {
			font: '24px Arial Black',
			fill: '#fff',
			strokeThickness: 4
		}));
		
		this.goldMultiplierKill = 0.67;
    },
	
	onClickMonster: function(monster, pointer) {
		// apply click damage to monster
		this.currentMonster.damage(this.player.clickDmg);
		
		// grab a damage text from the pool to display what happened
		var dmgText = this.dmgTextPool.getFirstExists(false);
		if (dmgText) {
			dmgText.text = Math.round(this.player.clickDmg);
			dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
			dmgText.alpha = 1;
			dmgText.tween.start();
		}
		
		this.game.cache.getBitmapData('healthBar').ctx.fillRect(0,0,Math.round((this.currentMonster.health/this.currentMonster.maxHealth)*100),20);
		this.healthBar = this.game.add.image(this.currentMonster.x - 50, this.currentMonster.y - 150, this.game.cache.getBitmapData('healthBar'));
		
		// update the health text
		this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
	},
	
	onKilledMonster: function(monster) {
		// move the monster off screen again
		monster.position.set(1000, this.game.world.centerY);
		
		var coin;
		// spawn a coin on the ground
		coin = this.coins.getFirstExists(false);
		coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY+100);
		this.currentGoldValue += Math.ceil(this.levelKills * this.goldMultiplierKill);
		this.goldMultiplierKill += 1000000.01;
		//coin.goldValue = Math.ceil(Math.pow(this.level,2) * 2.3 + this.levelKills * 1.4);
		
		this.levelKills++;
 
		if (this.levelKills >= this.levelKillsRequired+1) {
			this.level++;
			this.levelKills = 0;
			coin.goldValue = 5*this.currentGoldValue;
			this.currentGoldValue += Math.pow(this.level,3);
			this.goldMultiplierKill += 0.15;
		} else {
			coin.goldValue = this.currentGoldValue;
		}
		
		this.game.time.events.add(Phaser.Timer.SECOND/2, this.onClickCoin, this, coin);
		
		this.levelText.text = 'Level: ' + this.level;
		this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;
		
		var newMonsterHP = Math.ceil(this.currentMonster.maxHealth*0.95 + Math.pow(this.level,3) * 9.6 + Math.pow(this.levelKills,2));
		if(this.levelKills == 10) {
			newMonsterHP *= 3.5;
		} else if(this.levelKills == 0) {
			newMonsterHP = Math.ceil(0.25*newMonsterHP);
		}
		// pick a new monster
		this.currentMonster = this.monsters.getRandom();
		// upgrade the monster based on level
		this.currentMonster.maxHealth = newMonsterHP;
		// make sure they are fully healed
		this.currentMonster.revive(this.currentMonster.maxHealth);
		//console.log("New monster HP: " + newMonsterHP);
	},
	
	onRevivedMonster: function(monster) {
		monster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
		// update the text display
		this.monsterNameText.text = monster.details.name;
		this.monsterHealthText.text = monster.health + 'HP';
	},
	
	onClickCoin: function(coin) {
		if (!coin.alive) {
			return;
		}
		// give the player gold
		//console.log("Gold value: " + coin.goldValue);
		this.player.gold += coin.goldValue;
		// update UI
		this.playerGoldText.text = 'Gold: ' + this.player.gold;
		// remove the coin
		coin.kill();
	},
	
	onUpgradeButtonClick: function(button, pointer) {
		// make this a function so that it updates after we buy
		function getAdjustedCost() {
			console.log("button level: " + button.details.level + " button cost: " + button.details.cost + " adjusted cost " + Math.ceil(0.8*(button.details.level^2) + 1.08*button.details.level + 2.5 + button.details.cost));
			return Math.ceil(0.8*(button.details.level^2) + 1.08*button.details.level + 2.5 + button.details.cost);
		}
		//   0.8(x^2) + 1.08x + 7.5
		
		if (this.player.gold - button.details.cost >= 0) {
            this.player.gold -= button.details.cost;
            this.playerGoldText.text = 'Gold: ' + this.player.gold;
            button.details.level++;
            button.text.text = button.details.name + ': ' + button.details.level;
			button.details.costHandler.call(this, button, this.player);
            button.costText.text = 'Cost: ' + button.details.cost;
            button.details.purchaseHandler.call(this, button, this.player);
			button.damageText.text = 'Damage: ' + button.details.currentDamage;
			console.log("Current damage for " + button.details.name + " is " + button.details.currentDamage);
		}
	},
	
	onDPS: function() {
		if (this.player.dps > 0) {
			if (this.currentMonster && this.currentMonster.alive) {
				var dmg = this.player.dps / 10;
				this.currentMonster.damage(dmg);
				// update the health text
				this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
			}
		}
	}
});
 
game.state.start('play');