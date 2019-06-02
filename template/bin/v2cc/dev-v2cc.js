const $path = require('path');
const shelljs = require('shelljs');
const { getFilesByExt, getFilename, isExist } = require('../utils');
const {
  isdev,
  env,
  paths: { root, src, ccSrc },
  [env]: { assetsRoot, assetsPublicPath }
} = require('../config');

const V2CC_FILE = 'v2cc.json';
const v2ccPath = $path.join(root, V2CC_FILE);
const getGameScriptsPath = gameName =>
  $path.join(ccSrc, gameName, 'assets/scripts/cc_modules');
const OUTPUT_FILENAME = '__webpack__app__.js';
// 编译到 cocos 后会多出一个 .meta 文件
const OUTPUT_FILENAME_CCMETA = OUTPUT_FILENAME + '.meta';
const safeExit = msg => {
  console.log(msg.red);
  process.exit(1);
};

/**
 * @description 根据 process.env.CC_DEV 变量， 得到当前的 entry 和 output
 * @param  {[type]} env [description]
 * @return {[type]}     [description]
 */
exports.getIOPathWhenDevCc = function() {
  if (process.env.CC_DEV) {
    const GAME_NAME = process.env.GAME;
    if (!utils.isExist(v2ccPath)) {
      safeExit(`[Error]: Can't find ${V2CC_FILE} in project root path`);
    }
    if (!GAME_NAME) {
      safeExit('Argument `game-name` is missing');
    }
    const v2cc = require(v2ccPath);
    if (!v2cc[GAME_NAME]) {
      safeExit(`game [${GAME_NAME}] doesn't declare entry js file`);
    }
    const entry = $path.join(src, 'js', v2cc[GAME_NAME]);
    console.log(
      `\nV2CC enabled!!!!!!\nEntry: ${entry}\nOutput path: ${getGameScriptsPath(
        GAME_NAME
      )}\nfilename: ${OUTPUT_FILENAME}`.red.bold
    );
    const output = {
      path: getGameScriptsPath(GAME_NAME),
      filename: OUTPUT_FILENAME,
      publicPath: assetsPublicPath
    };

    return {
      entry,
      output
    };
  } else
    return {
      entry: getFilesByExt('.js', { path: src, skips: ['_', /\./] }),
      output: {
        path: assetsRoot,
        filename: getFilename(isdev, true, 'js'),
        chunkFilename: isdev ? '[id].js' : '[id]-[chunkhash].js',
        publicPath: assetsPublicPath
      }
    };
};

/**
 * @description 根据 V2CC_FILE 文件， 删除所有游戏下的 OUTPUT_FILENAME OUTPUT_FILENAME_CCMETA 文件
 * @return {[type]} [description]
 */
exports.deleteDevCcEntry = function() {
  if (isExist(v2ccPath)) {
    const v2cc = require(v2ccPath);

    Object.keys(v2cc).forEach(game => {
      const scriptPath = getGameScriptsPath(game);
      shelljs.rm($path.join(scriptPath, OUTPUT_FILENAME));
      shelljs.rm($path.join(scriptPath, OUTPUT_FILENAME_CCMETA));
    });
  }
  process.exit(0);
};

/**
 * @description 根据 process.env.CC_DEV 得到 url-loader 的实际 limit， 因为在 cocos 的服务下是无法根据 publicPath 找到具体的文件的
 * @param  {[type]} limit [description]
 * @return {[type]}       [description]
 */
exports.getLoaderBase64Limit = function(limit) {
  if (process.env.CC_DEV) return 10000000;
  // 10M
  else return limit;
};
