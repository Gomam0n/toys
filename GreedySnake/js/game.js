/**
 * 游戏核心逻辑模块
 */
import { config } from './config.js';
import { Renderer } from './renderer.js';
import { InputController } from './input.js';
import { UIManager } from './ui.js';

/**
 * 游戏管理器类，负责游戏核心逻辑
 */
export class Game {
    constructor() {
        // 游戏状态
        this.snake = [];
        this.food = null;
        this.obstacles = []; // 添加障碍物数组
        this.score = 0;
        this.gameLoop = null;
        this.gameStartTime = null;
        this.currentScoreMultiplier = 1.0;
        
        // 组件
        this.renderer = null;
        this.inputController = null;
        this.uiManager = null;
        
        // DOM元素
        this.canvas = null;
        this.ctx = null;
    }

    /**
     * 初始化游戏
     */
    init() {
        // 初始化DOM元素
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 应用默认棋盘大小
        this.applyBoardSize();
        
        // 初始化组件
        this.renderer = new Renderer(this.canvas, this.ctx);
        this.inputController = new InputController();
        this.uiManager = new UIManager();
        
        // 初始化UI管理器
        this.uiManager.init();
        
        // 加载排行榜数据
        this.loadLeaderboard();
        
        // 初始化实时排行榜
        this.uiManager.highlightRealtimeLeaderboardTab(config.currentDifficulty);
        this.uiManager.updateRealtimeLeaderboardDisplay(config.currentDifficulty);
        
        // 显示开始对话框
        this.showStartDialog();
    }
    
    /**
     * 应用当前选择的棋盘大小
     */
    applyBoardSize() {
        const boardConfig = config.boardSizes[config.currentBoardSize];
        this.canvas.width = boardConfig.width;
        this.canvas.height = boardConfig.height;
        config.gridSize = boardConfig.gridSize;
    }
    
    /**
     * 更新棋盘大小
     */
    updateBoardSize() {
        this.applyBoardSize();
        
        // 如果在开始对话框中，重新渲染一次游戏画面作为背景
        //if (!this.gameLoop) {
        //   this.resetGame();
        //    this.renderer.render(this.snake, this.food, this.inputController.getNextDirection(), this.currentScoreMultiplier);
       // }
    }

    setBoardSize(size) {
        config.currentBoardSize = size;
        this.updateBoardSize();
        //this.startGame();
    }

    /**
     * 设置游戏难度
     * @param {String} difficulty 难度级别 ('easy', 'medium', 'hard')
     */
    setDifficulty(difficulty) {
        if (['easy', 'medium', 'hard'].includes(difficulty)) {
            config.currentDifficulty = difficulty;
            
            // 应用难度设置
            const difficultyConfig = config.difficulties[difficulty];
            config.initialSpeed = difficultyConfig.speed;
            config.speed = difficultyConfig.speed;
            config.speedDecrement = difficultyConfig.speedDecrement;
            config.initialLength = difficultyConfig.initialLength;
            config.initialScore = difficultyConfig.initialScore;
            
            console.log(`难度已设置为: ${difficulty}`);
        }
    }
    
    /**
     * 显示难度选择对话框
     */
    showDifficultyDialog() {
        this.uiManager.showDifficultyDialog();
        // 高亮当前选中的难度
        this.uiManager.highlightDifficultyButton(config.currentDifficulty);
    }
    
    /**
     * 重置游戏状态
     */
    resetGame() {
        // 重置游戏速度
        config.speed = config.initialSpeed;
        this.currentScoreMultiplier = config.initialMultiplier;

        // 初始化蛇
        this.snake = [];
        
        // 清空障碍物
        this.obstacles = [];
        
        // 生成随机起始点（确保在画布范围内）
        const boardConfig = config.boardSizes[config.currentBoardSize];
        const gridCount = boardConfig.gridCount;
        const maxX = gridCount - config.initialLength;
        const maxY = gridCount - config.initialLength;
        
        let headX, headY;
        
        // 根据方向生成不同排列的蛇身
        do {
            headX = Math.floor(Math.random() * (maxX - 3)) + 2;
            headY = Math.floor(Math.random() * (maxY - 3)) + 2;
        } while (
            headX < 1 || headX >= maxX || 
            headY < 1 || headY >= maxY
        );

        // 随机生成初始方向
        const directions = ['up', 'down', 'left', 'right'];
        const initialDirection = directions[Math.floor(Math.random() * 4)];
        
        // 重置输入控制器方向
        this.inputController.resetDirection(initialDirection);

        // 根据方向生成蛇身
        for (let i = 0; i < config.initialLength; i++) {
            switch(initialDirection) {
                case 'right':
                    this.snake.unshift({x: headX + i, y: headY});
                    break;
                case 'left':
                    this.snake.unshift({x: headX - i, y: headY});
                    break;
                case 'up':
                    this.snake.unshift({x: headX, y: headY - i});
                    break;
                case 'down':
                    this.snake.unshift({x: headX, y: headY + i});
                    break;
            }
        }
        
        // 生成第一个食物
        this.generateFood();
        
        // 生成障碍物（仅在困难模式下）
        const difficultyConfig = config.difficulties[config.currentDifficulty];
        if (difficultyConfig.obstacles > 0) {
            this.generateObstacles(difficultyConfig.obstacles);
        }
        
        // 重置分数
        this.score = 0;
        this.uiManager.updateScore(this.score, this.currentScoreMultiplier);
        
        // 隐藏游戏结束界面
        this.uiManager.hideGameOver();
    }

    /**
     * 生成食物
     */
    generateFood() {
        const boardConfig = config.boardSizes[config.currentBoardSize];
        const gridCount = boardConfig.gridCount;
        
        while (true) {
            this.food = {
                x: Math.floor(Math.random() * gridCount),
                y: Math.floor(Math.random() * gridCount)
            };
            
            // 确保食物不会生成在蛇身上或障碍物上
            if (!this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y) &&
                !this.obstacles.some(obstacle => obstacle.x === this.food.x && obstacle.y === this.food.y)) {
                break;
            }
        }
    }
    
    /**
     * 生成障碍物
     * @param {Number} count 障碍物数量
     */
    generateObstacles(count) {
        const boardConfig = config.boardSizes[config.currentBoardSize];
        const gridCount = boardConfig.gridCount;
        
        for (let i = 0; i < count; i++) {
            let obstacle;
            let validPosition = false;
            
            // 尝试生成一个有效的障碍物位置
            while (!validPosition) {
                obstacle = {
                    x: Math.floor(Math.random() * gridCount),
                    y: Math.floor(Math.random() * gridCount)
                };
                
                // 确保障碍物不会生成在蛇身上、食物上或其他障碍物上
                validPosition = !this.snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) &&
                               !(this.food && this.food.x === obstacle.x && this.food.y === obstacle.y) &&
                               !this.obstacles.some(existingObstacle => existingObstacle.x === obstacle.x && existingObstacle.y === obstacle.y);
                
                // 额外检查：确保障碍物不会生成在蛇头周围的一定范围内，给玩家一些反应空间
                if (validPosition && this.snake.length > 0) {
                    const head = this.snake[0];
                    const safeDistance = 3; // 安全距离
                    
                    if (Math.abs(obstacle.x - head.x) < safeDistance && Math.abs(obstacle.y - head.y) < safeDistance) {
                        validPosition = false;
                    }
                }
            }
            
            this.obstacles.push(obstacle);
        }
    }

    /**
     * 更新实时排行榜
     */
    updateRealtimeLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem(config.leaderboard.storageKey)) || {};
        
        // 确保所有难度级别的排行榜都存在
        config.leaderboard.difficulties.forEach(difficulty => {
            if (!leaderboard[difficulty]) {
                leaderboard[difficulty] = [];
            }
        });
        
        // 添加当前游戏分数到临时排行榜进行实时显示
        if (this.score > 0) {
            const tempLeaderboard = JSON.parse(JSON.stringify(leaderboard));
            const difficulty = config.currentDifficulty;
            
            // 添加当前分数（临时，不保存到localStorage）
            const currentScoreEntry = {
                score: this.score,
                timestamp: Date.now(),
                isCurrent: true // 标记为当前游戏
            };
            
            // 将当前分数添加到临时排行榜
            tempLeaderboard[difficulty].push(currentScoreEntry);
            
            // 按分数降序排序
            tempLeaderboard[difficulty].sort((a, b) => b.score - a.score);
            
            // 只保留前N名
            if (tempLeaderboard[difficulty].length > config.leaderboard.maxEntries) {
                tempLeaderboard[difficulty] = tempLeaderboard[difficulty].slice(0, config.leaderboard.maxEntries);
            }
            
            // 更新UI显示临时排行榜
            this.uiManager.renderRealtimeLeaderboard(tempLeaderboard);
        } else {
            // 如果没有当前分数，直接显示保存的排行榜
            this.uiManager.renderLeaderboard(leaderboard);
        }
    }
    
    /**
     * 游戏主循环
     */
    gameStep() {
        // 更新蛇的方向
        const direction = this.inputController.updateCurrentDirection();
        
        // 计算新的头部位置
        const head = {...this.snake[0]};
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 检查碰撞
        if (this.isCollision(head)) {
            this.gameOver();
            return;
        }
        
        // 移动蛇
        this.snake.unshift(head);
        
        // 更新得分倍数（基于游戏时间，阶梯式增长）
        if (this.gameStartTime) {
            const gameTimeInSeconds = (Date.now() - this.gameStartTime) / 1000;
            
            // 阶梯式增长倍率
            if (gameTimeInSeconds < 60) { // 前60秒
                this.currentScoreMultiplier = 1.0;
            } else if (gameTimeInSeconds < 120) { // 60-120秒
                this.currentScoreMultiplier = 1.5;
            } else if (gameTimeInSeconds < 180) { // 120-180秒
                this.currentScoreMultiplier = 2.0;
            } else { // 180秒以上
                this.currentScoreMultiplier = 2.5;
            }
        }
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            // 计算得分（基础分数 * 当前倍数）
            const pointsEarned = Math.floor(config.initialScore * this.currentScoreMultiplier);
            this.score += pointsEarned;
            
            // 显示得分动画
            this.uiManager.showScoreAnimation(pointsEarned, head, this.currentScoreMultiplier);
            
            // 更新分数显示
            this.uiManager.updateScore(this.score, this.currentScoreMultiplier);
            
            // 更新实时排行榜
            this.updateRealtimeLeaderboard();
            
            // 生成新食物
            this.generateFood();
            
            // 增加游戏速度（减小间隔时间）
            if (config.speed > config.minSpeed) {
                config.speed = Math.max(config.speed - config.speedDecrement, config.minSpeed);
                
                // 如果游戏循环正在运行，更新游戏循环速度
                if (this.gameLoop) {
                    clearInterval(this.gameLoop);
                    this.gameLoop = setInterval(this.gameStep.bind(this), config.speed);
                    console.log('游戏速度已更新:', config.speed);
                }
            }
        } else {
            // 如果没有吃到食物，移除蛇尾
            this.snake.pop();
        }
        
        // 渲染游戏
        this.renderer.render(this.snake, this.food, direction, this.currentScoreMultiplier, this.obstacles);
    }

    /**
     * 碰撞检测
     * @param {Object} head 蛇头位置
     * @returns {Boolean} 是否碰撞
     */
    isCollision(head) {
        const boardConfig = config.boardSizes[config.currentBoardSize];
        const gridCount = boardConfig.gridCount;
        
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= gridCount ||
            head.y < 0 || head.y >= gridCount) {
            return true;
        }
        
        // 检查自身碰撞
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
                return true;
            }
        }
        
        // 检查障碍物碰撞
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].x === head.x && this.obstacles[i].y === head.y) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 游戏结束
     */
    gameOver() {
        // 清除游戏循环
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        // 保存分数到排行榜
        this.saveScore(this.score);
        
        // 更新实时排行榜
        // this.updateRealtimeLeaderboard();
        
        // 显示游戏结束界面
        this.uiManager.showGameOver(this.score);
        
        // 停止输入控制
        this.inputController.stop();
    }
    
    /**
     * 显示棋盘大小选择对话框
     */
    showBoardSizeDialog() {
        // 隐藏游戏结束界面
        this.uiManager.hideGameOver();
        
        // 显示棋盘大小选择对话框
        this.uiManager.showBoardSizeDialog();
        // 高亮当前选中的棋盘大小
        this.uiManager.highlightBoardSizeButton(config.currentBoardSize);
    }

    /**
     * 开始游戏
     */
    startGame() {
        console.log('开始游戏初始化...');

        this.uiManager.hideBoardSizeDialog();
        this.uiManager.hideDifficultyDialog();
        
        // 清除现有的游戏循环
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        // 初始化游戏状态
        this.resetGame();
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 记录游戏开始时间并重置得分倍率
        this.gameStartTime = Date.now();
        this.currentScoreMultiplier = 1.0;
        
        // 初始化输入控制
        this.inputController.init();
        
        // 开始新的游戏循环
        this.gameLoop = setInterval(this.gameStep.bind(this), config.speed);
        console.log('游戏循环已启动，间隔:', config.speed);
        console.log('初始蛇长度:', this.snake.length);
    }

    /**
     * 显示开始对话框
     */
    showStartDialog() {
        // 初始化游戏状态但不启动游戏循环
        this.resetGame();
        
        // 渲染一次游戏画面作为背景
        this.renderer.render(this.snake, this.food, this.inputController.getNextDirection(), this.currentScoreMultiplier, this.obstacles);
        
        // 显示开始对话框
        this.uiManager.showStartDialog();
    }

    /**
     * 确认开始游戏
     */
    confirmStartGame() {
        this.uiManager.hideStartDialog();
        this.showBoardSizeDialog();
    }
    
    /**
     * 保存得分到排行榜
     * @param {Number} score 得分
     */
    saveScore(score) {
        const leaderboard = JSON.parse(localStorage.getItem(config.leaderboard.storageKey)) || {};
        const difficulty = config.currentDifficulty;
        
        // 确保当前难度的排行榜存在
        if (!leaderboard[difficulty]) {
            leaderboard[difficulty] = [];
        }
        
        // 添加新的得分记录
        leaderboard[difficulty].push({
            score: score,
            timestamp: Date.now()
        });
        
        // 按分数降序排序
        leaderboard[difficulty].sort((a, b) => b.score - a.score);
        
        // 只保留前N名
        if (leaderboard[difficulty].length > config.leaderboard.maxEntries) {
            leaderboard[difficulty] = leaderboard[difficulty].slice(0, config.leaderboard.maxEntries);
        }
        
        // 保存到localStorage
        localStorage.setItem(config.leaderboard.storageKey, JSON.stringify(leaderboard));
        
        // 更新UI显示
        this.uiManager.renderLeaderboard(leaderboard);
    }
    
    /**
     * 加载排行榜数据
     */
    loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem(config.leaderboard.storageKey)) || {};
        
        // 确保所有难度级别的排行榜都存在
        config.leaderboard.difficulties.forEach(difficulty => {
            if (!leaderboard[difficulty]) {
                leaderboard[difficulty] = [];
            }
        });
        
        // 更新UI显示
        this.uiManager.renderLeaderboard(leaderboard);
    }

    /**
     * 保存得分到排行榜
     */
    saveScore(score) {
        const leaderboard = JSON.parse(localStorage.getItem(config.leaderboard.storageKey)) || {};
        const difficulty = config.currentDifficulty;
        
        if (!leaderboard[difficulty]) {
            leaderboard[difficulty] = [];
        }
    
        leaderboard[difficulty].push({
            score: score,
            timestamp: Date.now()
        });
    
        // 排序并保留前3名
        leaderboard[difficulty].sort((a, b) => b.score - a.score);
        leaderboard[difficulty] = leaderboard[difficulty].slice(0, config.leaderboard.maxEntries);
    
        localStorage.setItem(config.leaderboard.storageKey, JSON.stringify(leaderboard));
        this.uiManager.renderLeaderboard(leaderboard);
    }

    /**
     * 显示开始对话框
     */
    showStartDialog() {
        // 初始化游戏状态但不启动游戏循环
        this.resetGame();
        
        // 渲染一次游戏画面作为背景
        this.renderer.render(this.snake, this.food, this.inputController.getNextDirection(), this.currentScoreMultiplier, this.obstacles);
        
        // 显示开始对话框
        this.uiManager.showStartDialog();
    }

    /**
     * 确认开始游戏
     */
    confirmStartGame() {
        this.uiManager.hideStartDialog();
        this.showBoardSizeDialog();
    }
    
    /**
     * 保存得分到排行榜
     * @param {Number} score 得分
     */
    saveScore(score) {
        const leaderboard = JSON.parse(localStorage.getItem(config.leaderboard.storageKey)) || {};
        const difficulty = config.currentDifficulty;
        
        // 确保当前难度的排行榜存在
        if (!leaderboard[difficulty]) {
            leaderboard[difficulty] = [];
        }
        
        // 添加新的得分记录
        leaderboard[difficulty].push({
            score: score,
            timestamp: Date.now()
        });
        
        // 按分数降序排序
        leaderboard[difficulty].sort((a, b) => b.score - a.score);
        
        // 只保留前N名
        if (leaderboard[difficulty].length > config.leaderboard.maxEntries) {
            leaderboard[difficulty] = leaderboard[difficulty].slice(0, config.leaderboard.maxEntries);
        }
        
        // 保存到localStorage
        localStorage.setItem(config.leaderboard.storageKey, JSON.stringify(leaderboard));
        
        // 更新UI显示
        this.uiManager.renderLeaderboard(leaderboard);
    }
    
    /**
     * 加载排行榜数据
     */
    loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem(config.leaderboard.storageKey)) || {};
        
        // 确保所有难度级别的排行榜都存在
        config.leaderboard.difficulties.forEach(difficulty => {
            if (!leaderboard[difficulty]) {
                leaderboard[difficulty] = [];
            }
        });
        
        // 更新UI显示
        this.uiManager.renderLeaderboard(leaderboard);
    }
}