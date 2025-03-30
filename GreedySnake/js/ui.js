/**
 * UI管理模块
 */
import { config } from './config.js';

/**
 * UI管理器类，负责游戏界面元素
 */
export class UIManager {
    constructor() {
        this.scoreElement = null;
        this.gameOverElement = null;
        this.finalScoreElement = null;
        this.startDialogElement = null;
        this.boardSizeDialogElement = null;
    }

    /**
     * 初始化UI元素
     */
    init() {
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.startDialogElement = document.getElementById('start-dialog');
        this.boardSizeDialogElement = document.getElementById('board-size-dialog');
    }

    /**
     * 更新分数显示
     * @param {Number} score 当前分数
     * @param {Number} multiplier 当前倍数
     */
    updateScore(score, multiplier) {
        // 显示当前分数和倍数
        this.scoreElement.textContent = `分数: ${score} (x${multiplier.toFixed(1)})`;
        this.finalScoreElement.textContent = score;
        
        // 更新分数显示的颜色，反映当前倍率
        if (multiplier >= 2.5) {
            this.scoreElement.style.color = '#FFD700'; // 金色 - 2.0倍
        } else if (multiplier >= 2) {
            this.scoreElement.style.color = '#C0C0C0'; // 银色 - 1.5倍
        } else if (multiplier >= 1.5) {
            this.scoreElement.style.color = '#CD7F32'; // 铜色 - 10倍
        } else {
            this.scoreElement.style.color = '#000000'; // 默认黑色 - 1倍
        }
    }

    /**
     * 显示得分动画
     * @param {Number} points 得分点数
     * @param {Object} position 位置
     * @param {Number} multiplier 当前倍数
     */
    showScoreAnimation(points, position, multiplier) {
        // 创建一个临时元素显示得分
        const scoreAnim = document.createElement('div');
        scoreAnim.textContent = `+${points}`;
        scoreAnim.style.position = 'absolute';
        const canvas = document.getElementById('game-canvas');
        scoreAnim.style.left = `${position.x * config.gridSize + canvas.offsetLeft}px`;
        scoreAnim.style.top = `${position.y * config.gridSize + canvas.offsetTop}px`;
        
        // 根据倍率设置不同的颜色
        if (multiplier >= 2.5) {
            scoreAnim.style.color = '#FFD700'; // 金色 - 20倍
            scoreAnim.style.fontSize = '20px'; // 更大的字体
        } else if (multiplier >= 2.0) {
            scoreAnim.style.color = '#C0C0C0'; // 银色 - 15倍
            scoreAnim.style.fontSize = '18px';
        } else if (multiplier >= 1.5) {
            scoreAnim.style.color = '#CD7F32'; // 铜色 - 10倍
            scoreAnim.style.fontSize = '17px';
        } else {
            scoreAnim.style.color = '#FF9800'; // 默认橙色 - 1倍
            scoreAnim.style.fontSize = '16px';
        }
        
        scoreAnim.style.fontWeight = 'bold';
        scoreAnim.style.pointerEvents = 'none'; // 确保不会干扰用户交互
        scoreAnim.style.zIndex = '100';
        scoreAnim.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
        
        // 添加到游戏容器
        document.getElementById('game-container').appendChild(scoreAnim);
        
        // 添加动画效果
        scoreAnim.style.transition = 'all 0.8s ease-out';
        scoreAnim.style.opacity = '1';
        
        // 设置动画
        setTimeout(() => {
            scoreAnim.style.transform = 'translateY(-20px)';
            scoreAnim.style.opacity = '0';
        }, 50);
        
        // 移除元素
        setTimeout(() => {
            if (scoreAnim.parentNode) {
                scoreAnim.parentNode.removeChild(scoreAnim);
            }
        }, 800);
    }

    /**
     * 显示游戏结束界面
     * @param {Number} finalScore 最终得分
     */
    showGameOver(finalScore) {
        this.gameOverElement.style.display = 'block';
        this.finalScoreElement.textContent = finalScore;
    }

    /**
     * 隐藏游戏结束界面
     */
    hideGameOver() {
        this.gameOverElement.style.display = 'none';
    }

    /**
     * 显示开始对话框
     */
    showStartDialog() {
        this.startDialogElement.style.display = 'block';
    }

    /**
     * 隐藏开始对话框
     */
    hideStartDialog() {
        this.startDialogElement.style.display = 'none';
    }
    
    /**
     * 显示棋盘大小选择对话框
     */
    showBoardSizeDialog() {
        this.boardSizeDialogElement.style.display = 'block';
    }
    
    /**
     * 隐藏棋盘大小选择对话框
     */
    hideBoardSizeDialog() {
        this.boardSizeDialogElement.style.display = 'none';
    }
}