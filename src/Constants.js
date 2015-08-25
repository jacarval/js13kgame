var WORLD = {
  gravity: -1000,
  width: 800.0,
  height: 600.0,
  phase: 1,
  base: 600.0
}

var CONSTANTS = {
  PLATFORM_WIDTH: 100,
  PLATFORM_HEIGHT: 20,
  PLATFORM_COLOR: '#0095DD',
  PLATFORM_X: (WORLD.width / 2 - 100 / 2),
  PLATFORM_Y: (WORLD.height - 20 * 2),
  PLAYER_JUMPSPEED: -600,
  STOMPER_WIDTH: 100,
  STOMPER_HEIGHT: 100,
  STOMPER_COLOR: 'red'
};



module.exports.CONSTANTS = CONSTANTS;
module.exports.WORLD = WORLD;