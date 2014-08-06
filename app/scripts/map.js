function Map (mapId, viewport) {

	var addPlatform = function (x, y, w, h) {
		elements.push(Physics.body('platform', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  }));
	};

	var addBridge = function (x, y, w, h) {
		elements.push(Physics.body('bridge', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  }));
	};

	var addMovingBridge = function (x, y, w, h, min, max, orientation, speed) {
		var element = Physics.body('movingBridge', {
	    x: x,
	    y: y,
	    width: w,
	    height: h,
	    min: min,
	    max: max,
	    orientation: orientation,
	    speed: speed
	  });
		elements.push(Physics.behavior('platform-moving', { platform: element }));
    elements.push(element);
	};

	var addFlag = function (x, y, color, team, goalX, goalY) {
		var element = Physics.body('flag', {
	    x: x,
	    y: y,
	    color: color,
	    team: team,
	    goalX: goalX,
	    goalY: goalY
	  });
	  elements.push(Physics.behavior('flag-behavior', { flag: element }));
    elements.push(element);
	};

	var elements = [];

	switch (mapId) {
		case Map.MAP_TYPES.standard.id:
			addPlatform(viewport.width / 2, viewport.height / 2 + 195, 700, 140);
			addBridge(viewport.width / 2 - 200, viewport.height / 2, 200, 50);
			addBridge(viewport.width / 2 + 200, viewport.height / 2, 200, 50);
			addMovingBridge(viewport.width / 2, viewport.height / 2 -125, 200, 50, -100, 100, 0, 0.07);
			break;
		case Map.MAP_TYPES.flag.id:
			addPlatform(viewport.width / 2, viewport.height / 2 + 300, 700, 140);
			addBridge(viewport.width / 2 - 400, viewport.height / 2 + 150, 200, 50);
			addBridge(viewport.width / 2 + 400, viewport.height / 2 + 150, 200, 50);
			addBridge(viewport.width / 2 - 400, viewport.height / 2 -100, 200, 50);
			addBridge(viewport.width / 2 + 400, viewport.height / 2 - 100, 200, 50);
			addBridge(viewport.width / 2 - 200, viewport.height / 2, 200, 50);
			addBridge(viewport.width / 2 + 200, viewport.height / 2, 200, 50);
			addMovingBridge(viewport.width / 2, viewport.height / 2 + 120, 200, 50, -100, 100, 0, 0.07);
			addMovingBridge(viewport.width / 2, viewport.height / 2 -125, 200, 50, -60, 60, 1, 0.05);
			addFlag(viewport.width / 2 - 400, viewport.height / 2 + 90, Game.TINT_COLORS[0], 0, viewport.width / 2 + 400, viewport.height / 2 + 90);
			addFlag(viewport.width / 2 + 400, viewport.height / 2 + 90, Game.TINT_COLORS[1], 1, viewport.width / 2 - 400, viewport.height / 2 + 90);
			break;
	}

	return elements;
}

Map.MAP_TYPES = {
	standard: {
		id: 0,
		width: 500,
		life: 3,
		teams: 4
	},
	flag: {
		id: 1,
		width: 980,
		life: 1,
		teams: 2
	}
};
