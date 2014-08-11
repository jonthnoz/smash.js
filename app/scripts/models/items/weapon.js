function Weapon (image, type, power, stun, ammo, extra, extra2) {
	Item.call(this, Item.Types.WEAPON, image);

	this.player = null;
	this.ammo = ammo;

	this.equip = function (player) {
		this.player = player;
		if (this.player.weapon) {
			this.player.weapon.unequip(this.player);
		}
		this.player.weapon = this;
		if (this.image) {
			this.player._world.emit('updateGUI', {
				type: 'item_add',
				target: this.player
			});
		}
	};

	this.unequip = function () {
		this.player._world.emit('updateGUI', {
			type: 'item_remove',
			target: this.player
		});
		this.player.weapon = Item.baseWeapon;
	};

	this.attack = function (attackPower) {
		switch(type) {

			case Weapon.Types.GUN:
				var world = this.player._world;
        var pos = this.player.state.pos;
        var bullet = Physics.body('bullet', {
          x: pos.get(0),
          y: pos.get(1),
          image: 'bullet.png',
          power: power,
          stun: stun,
					gameType: extra
        });
        bullet.state.pos.set(pos.get(0) + this.player.orientation * 40, pos.get(1) - 6);
        bullet.state.vel.set(this.player.orientation * 3, 0);

        setTimeout(function () {
          bullet.explode();
        }, 500);
        world.add(bullet);

        // animate fire
        var anim = PIXI.Sprite.fromImage(Game.IMAGES_PATH + 'muzzle.png');
	      anim.alpha = 0.8;
	      anim.anchor = {
	        x: 0.5,
	        y: 0.5
	      };
	      anim.x = this.player.state.pos.x + this.player.orientation * 35;
	      anim.y = this.player.state.pos.y - 6;
	      anim.rotation = this.player.orientation > 0 ? Math.PI : 0;
	      world._renderer.stage.addChild(anim);
	      
	      var tween = new TWEEN.Tween( { x: 0, y: 0 } )
	        .to( { x: 1, y: 1 }, 100)
	        .onUpdate(function () {
	            anim.scale.x = this.x;
	            anim.scale.y = this.y;
	        })
	        .onComplete(function () {
	          world.emit('removeBody', anim);
	        })
	        .start();
				break;

			case Weapon.Types.CONTACT:
				var slash = Physics.body('contact-weapon', {
			    x: this.player.state.pos.x + this.player.orientation * 33,
			    y: this.player.state.pos.y,
			    power: power,
			    stun: stun,
			    player: this.player,
			    tint: extra
				});
				var world = this.player._world;
				world.add(slash);
				setTimeout(function () {
					world.emit('removeBody', slash);
				}, 20);
				break;

			case Weapon.Types.DROP:
				this.player._world.add(Physics.body('drop-weapon', {
					x: this.player.state.pos.x + this.player.orientation * 55,
					y: this.player.state.pos.y,
					vx: this.player.orientation * attackPower * 0.1,
					vy: - 0.1 * attackPower,
					image: image,
					power: power,
					stun: stun
				}));
				break;

			case Weapon.Types.THROW:
			  var world = this.player._world;
        var pos = this.player.state.pos;
        var scratch = Physics.scratchpad();
        var rnd = scratch.vector();
        rnd.set(this.player.orientation * 40, -0.7 * 40);        

        var throwingWeapon = Physics.body('throw-weapon', {
          x: pos.get(0),
          y: pos.get(1),
          image: image,
          power: power,
          stun: stun,
					gameType: extra
        });
        throwingWeapon.state.pos.set(pos.get(0) + rnd.get(0), pos.get(1) + rnd.get(1));
        throwingWeapon.state.vel.set(this.player.orientation * attackPower * 1.2, - 0.16 * attackPower);
        throwingWeapon.state.angular.vel = (Math.random() - 0.5) * 0.06;

        setTimeout(function () {
          throwingWeapon.explode();
        }, extra2);
        world.add(throwingWeapon);
        scratch.done();
			break;
			
		}

		// consume ammo
		if (this.ammo) {
			this.ammo--;
		}

		// check if player still has some ammo left
		if (this.ammo == 0) {
			this.unequip();
      Item.buildBaseWeapon().equip(this.player);
		} else if (this.ammo > 0) {
			this.player._world.emit('updateGUI', {
				type: 'item_update',
				target: this.player
			});
		}
	};
}

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.Types = {
	GUN: 0,
	CONTACT: 1,
	DROP: 2,
	THROW: 3
};