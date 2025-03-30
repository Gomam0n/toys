/**
 * 游戏主入口文件
 */
import { Game } from './game.js';
import { config } from './config.js';

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

window.showBoardSizeDialog = function() {
    game.showBoardSizeDialog();
};

// 设置棋盘大小的函数
window.setBoardSize = function(size) {
    if (['small', 'medium', 'large'].includes(size)) {
        config.currentBoardSize = size;
        game.updateBoardSize();
        // 高亮选中的按钮
        game.uiManager.highlightBoardSizeButton(size);
    }
};

// 显示难度选择对话框
window.showDifficultyDialog = function() {
    game.showDifficultyDialog();
};

// 设置游戏难度的函数
window.setDifficulty = function(difficulty) {
    if (['easy', 'medium', 'hard'].includes(difficulty)) {
        game.setDifficulty(difficulty);
        // 高亮选中的按钮
        game.uiManager.highlightDifficultyButton(difficulty);
    }
};