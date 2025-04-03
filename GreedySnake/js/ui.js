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
        this.difficultyDialogElement = null;
        this.leaderboardDialogElement = null;
        this.realtimeLeaderboardElement = null;
        
        // 按钮元素
        this.boardSizeButtons = {};
        this.difficultyButtons = {};
        
        // 实时排行榜元素
        this.realtimeLeaderboardTabs = {};
        this.realtimeLeaderboardLists = {};
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
        this.difficultyDialogElement = document.getElementById('difficulty-dialog');
        
        // 初始化棋盘大小按钮
        this.boardSizeButtons = {
            small: document.getElementById('btn-size-small'),
            medium: document.getElementById('btn-size-medium'),
            large: document.getElementById('btn-size-large')
        };
        
        // 初始化难度按钮
        this.difficultyButtons = {
            easy: document.getElementById('btn-diff-easy'),
            medium: document.getElementById('btn-diff-medium'),
            hard: document.getElementById('btn-diff-hard')
        };
        
        // 初始化排行榜对话框元素
        this.leaderboardDialogElement = document.getElementById('leaderboard-dialog');
        this.leaderboardTabs = {
            easy: document.getElementById('leaderboard-easy'),
            medium: document.getElementById('leaderboard-medium'),
            hard: document.getElementById('leaderboard-hard')
        };
        this.leaderboardLists = {
            easy: document.getElementById('leaderboard-list-easy'),
            medium: document.getElementById('leaderboard-list-medium'),
            hard: document.getElementById('leaderboard-list-hard')
        };
        
        // 初始化实时排行榜元素
        this.realtimeLeaderboardElement = document.getElementById('realtime-leaderboard');
        this.realtimeLeaderboardTabs = {
            easy: document.getElementById('realtime-leaderboard-easy'),
            medium: document.getElementById('realtime-leaderboard-medium'),
            hard: document.getElementById('realtime-leaderboard-hard')
        };
        this.realtimeLeaderboardLists = {
            easy: document.getElementById('realtime-leaderboard-list-easy'),
            medium: document.getElementById('realtime-leaderboard-list-medium'),
            hard: document.getElementById('realtime-leaderboard-list-hard')
        };
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
        // 隐藏开始对话框
        this.hideStartDialog();
        this.boardSizeDialogElement.style.display = 'block';
    }
    
    /**
     * 隐藏棋盘大小选择对话框
     */
    hideBoardSizeDialog() {
        this.boardSizeDialogElement.style.display = 'none';
    }
    
    /**
     * 显示难度选择对话框
     */
    showDifficultyDialog() {
        // 隐藏棋盘大小对话框
        this.hideBoardSizeDialog();
        this.difficultyDialogElement.style.display = 'block';
    }
    
    /**
     * 隐藏难度选择对话框
     */
    hideDifficultyDialog() {
        this.difficultyDialogElement.style.display = 'none';
    }
    
    /**
     * 高亮选中的棋盘大小按钮
     * @param {String} size 棋盘大小 ('small', 'medium', 'large')
     */
    highlightBoardSizeButton(size) {
        // 移除所有按钮的active类
        Object.values(this.boardSizeButtons).forEach(button => {
            if (button) button.classList.remove('active');
        });
        
        // 为选中的按钮添加active类
        if (this.boardSizeButtons[size]) {
            this.boardSizeButtons[size].classList.add('active');
        }
    }
    
    /**
     * 高亮选中的难度按钮
     * @param {String} difficulty 难度级别 ('easy', 'medium', 'hard')
     */
    highlightDifficultyButton(difficulty) {
        // 移除所有按钮的active类
        Object.values(this.difficultyButtons).forEach(button => {
            if (button) button.classList.remove('active');
        });
        
        // 为选中的按钮添加active类
        if (this.difficultyButtons[difficulty]) {
            this.difficultyButtons[difficulty].classList.add('active');
        }
    }
    
    /**
     * 显示排行榜对话框
     */
    showLeaderboard() {
        // 隐藏游戏结束界面
        this.gameOverElement.style.display = 'none';
        // 显示排行榜
        this.leaderboardDialogElement.style.display = 'block';
        this.highlightLeaderboardTab(config.currentDifficulty);
        this.updateLeaderboardDisplay(config.currentDifficulty);
    }

    /**
     * 隐藏排行榜对话框
     */
    hideLeaderboard() {
        // 隐藏排行榜
        this.leaderboardDialogElement.style.display = 'none';
        // 重新显示游戏结束界面
        this.gameOverElement.style.display = 'block';
    }

    /**
     * 高亮选中的排行榜选项卡
     */
    highlightLeaderboardTab(difficulty) {
        Object.values(this.leaderboardTabs).forEach(tab => tab.classList.remove('active'));
        this.leaderboardTabs[difficulty].classList.add('active');
    }

    /**
     * 更新排行榜显示
     */
    updateLeaderboardDisplay(difficulty) {
        Object.values(this.leaderboardLists).forEach(list => list.style.display = 'none');
        this.leaderboardLists[difficulty].style.display = 'block';
    }

    /**
     * 渲染排行榜内容
     */
    renderLeaderboard(leaderboardData) {
        Object.entries(leaderboardData).forEach(([difficulty, entries]) => {
            const listElement = this.leaderboardLists[difficulty];
            listElement.innerHTML = entries
                .map((entry, index) => `
                    <li class="leaderboard-item">
                        <span class="rank">${index + 1}.</span>
                        <span class="score">${entry.score}</span>
                        <span class="date">${new Date(entry.timestamp).toLocaleDateString()}</span>
                    </li>`)
                .join('');
                
            // 同时更新实时排行榜
            const realtimeListElement = this.realtimeLeaderboardLists[difficulty];
            if (realtimeListElement) {
                realtimeListElement.innerHTML = entries
                    .map((entry, index) => `
                        <li class="leaderboard-item">
                            <span class="rank">${index + 1}.</span>
                            <span class="score">${entry.score}</span>
                            <span class="date">${new Date(entry.timestamp).toLocaleDateString()}</span>
                        </li>`)
                    .join('');
            }
        });
    }
    
    /**
     * 高亮选中的实时排行榜选项卡
     */
    highlightRealtimeLeaderboardTab(difficulty) {
        Object.values(this.realtimeLeaderboardTabs).forEach(tab => tab.classList.remove('active'));
        this.realtimeLeaderboardTabs[difficulty].classList.add('active');
    }

    /**
     * 更新实时排行榜显示
     */
    updateRealtimeLeaderboardDisplay(difficulty) {
        Object.values(this.realtimeLeaderboardLists).forEach(list => list.style.display = 'none');
        this.realtimeLeaderboardLists[difficulty].style.display = 'block';
    }
    
    /**
     * 渲染实时排行榜内容
     * @param {Object} leaderboardData 排行榜数据
     */
    renderRealtimeLeaderboard(leaderboardData) {
        Object.entries(leaderboardData).forEach(([difficulty, entries]) => {
            const listElement = this.realtimeLeaderboardLists[difficulty];
            if (listElement) {
                listElement.innerHTML = entries
                    .map((entry, index) => {
                        // 为当前游戏分数添加高亮样式
                        const isCurrentClass = entry.isCurrent ? 'style="background-color: rgba(76, 175, 80, 0.3);"' : '';
                        return `
                            <li class="leaderboard-item" ${isCurrentClass}>
                                <span class="rank">${index + 1}.</span>
                                <span class="score">${entry.score}</span>
                                <span class="date">${new Date(entry.timestamp).toLocaleDateString()}</span>
                            </li>`;
                    })
                    .join('');
            }
        });
    }
}