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
        
        // 初始化组件
        this.renderer = new Renderer(this.canvas, this.ctx);
        this.inputController = new InputController();
        this.uiManager = new UIManager();
        
        // 初始化UI管理器
        this.uiManager.init();
        
        // 显示开始对话框
        this.showStartDialog();
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
        
        // 生成随机起始点（确保在画布范围内）
        const maxX = Math.floor(this.canvas.width / config.gridSize) - config.initialLength;
        const maxY = Math.floor(this.canvas.height / config.gridSize) - config.initialLength;
        
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
        while (true) {
            this.food = {
                x: Math.floor(Math.random() * (this.canvas.width / config.gridSize)),
                y: Math.floor(Math.random() * (this.canvas.height / config.gridSize))
            };
            
            // 确保食物不会生成在蛇身上
            if (!this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y)) {
                break;
            }
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
        this.renderer.render(this.snake, this.food, direction, this.currentScoreMultiplier);
    }

    /**
     * 碰撞检测
     * @param {Object} head 蛇头位置
     * @returns {Boolean} 是否碰撞
     */
    isCollision(head) {
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.canvas.width / config.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / config.gridSize) {
            return true;
        }
        
        // 检查自身碰撞
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
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
        
        // 显示游戏结束界面
        this.uiManager.showGameOver(this.score);
        
        // 停止输入控制
        this.inputController.stop();
    }

    /**
     * 开始游戏
     */
    startGame() {
        console.log('开始游戏初始化...');
        
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
        this.renderer.render(this.snake, this.food, this.inputController.getNextDirection(), this.currentScoreMultiplier);
        
        // 显示开始对话框
        this.uiManager.showStartDialog();
    }

    /**
     * 确认开始游戏
     */
    confirmStartGame() {
        // 隐藏开始对话框
        this.uiManager.hideStartDialog();
        
        // 开始游戏
        this.startGame();
    }
}