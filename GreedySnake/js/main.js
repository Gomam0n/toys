/**
 * 游戏主入口文件
 */
import { Game } from './game.js';

// 创建游戏实例
const game = new Game();

// 在页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏
    game.init();
});

// 将游戏控制函数暴露到全局作用域，以便HTML按钮可以调用
window.startGame = function() {
    game.startGame();
};

window.confirmStartGame = function() {
    game.confirmStartGame();
};