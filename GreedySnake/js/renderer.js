/**
 * 游戏渲染模块
 */
import { config } from './config.js';

/**
 * 渲染器类，负责游戏画面的绘制
 */
export class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    /**
     * 渲染游戏画面
     * @param {Array} snake 蛇的身体部分
     * @param {Object} food 食物位置
     * @param {String} direction 蛇的移动方向
     * @param {Number} currentScoreMultiplier 当前得分倍数
     * @param {Array} obstacles 障碍物位置数组
     */
    render(snake, food, direction, currentScoreMultiplier, obstacles = []) {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格（可选）
        this.drawGrid();
        
        // 绘制障碍物
        this.drawObstacles(obstacles);
        
        // 绘制蛇
        this.drawSnake(snake, direction);
        
        // 绘制食物
        this.drawFood(food, currentScoreMultiplier);
    }

    /**
     * 绘制网格
     */
    drawGrid() {
        this.ctx.strokeStyle = '#eee';
        for (let i = 0; i < this.canvas.width; i += config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height; i += config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
    }

    /**
     * 绘制蛇
     * @param {Array} snake 蛇的身体部分
     * @param {String} direction 蛇的移动方向
     */
    drawSnake(snake, direction) {
        this.ctx.fillStyle = '#4CAF50';
        snake.forEach((segment, index) => {
            this.ctx.fillRect(
                segment.x * config.gridSize,
                segment.y * config.gridSize,
                config.gridSize - 1,
                config.gridSize - 1
            );
            
            // 绘制蛇头的眼睛
            if (index === 0) {
                this.drawSnakeEyes(segment, direction);
            }
        });
    }

    /**
     * 绘制蛇头的眼睛
     * @param {Object} headSegment 蛇头部分
     * @param {String} direction 蛇的移动方向
     */
    drawSnakeEyes(headSegment, direction) {
        this.ctx.fillStyle = '#000';
        const eyeSize = 3;
        const eyeOffset = 4;
        
        // 根据方向绘制眼睛
        let eyeX1, eyeY1, eyeX2, eyeY2;
        switch (direction) {
            case 'right':
                eyeX1 = eyeX2 = headSegment.x * config.gridSize + config.gridSize - eyeOffset;
                eyeY1 = headSegment.y * config.gridSize + eyeOffset;
                eyeY2 = headSegment.y * config.gridSize + config.gridSize - eyeOffset;
                break;
            case 'left':
                eyeX1 = eyeX2 = headSegment.x * config.gridSize + eyeOffset;
                eyeY1 = headSegment.y * config.gridSize + eyeOffset;
                eyeY2 = headSegment.y * config.gridSize + config.gridSize - eyeOffset;
                break;
            case 'up':
                eyeX1 = headSegment.x * config.gridSize + eyeOffset;
                eyeX2 = headSegment.x * config.gridSize + config.gridSize - eyeOffset;
                eyeY1 = eyeY2 = headSegment.y * config.gridSize + eyeOffset;
                break;
            case 'down':
                eyeX1 = headSegment.x * config.gridSize + eyeOffset;
                eyeX2 = headSegment.x * config.gridSize + config.gridSize - eyeOffset;
                eyeY1 = eyeY2 = headSegment.y * config.gridSize + config.gridSize - eyeOffset;
                break;
        }
        
        this.ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize);
        this.ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize);
        this.ctx.fillStyle = '#4CAF50';
    }

    /**
     * 绘制食物
     * @param {Object} food 食物位置
     * @param {Number} currentScoreMultiplier 当前得分倍数
     */
    drawFood(food, currentScoreMultiplier) {
        // 根据倍率设置不同的颜色
        let foodColor;
        if (currentScoreMultiplier >= 20.0) {
            foodColor = '#FFD700'; // 金色 - 20倍
        } else if (currentScoreMultiplier >= 15.0) {
            foodColor = '#C0C0C0'; // 银色 - 15倍
        } else if (currentScoreMultiplier >= 10.0) {
            foodColor = '#CD7F32'; // 铜色 - 10倍
        } else {
            foodColor = '#FF5722'; // 默认橙色 - 1倍
        }
        
        this.ctx.fillStyle = foodColor;
        this.ctx.fillRect(
            food.x * config.gridSize,
            food.y * config.gridSize,
            config.gridSize - 1,
            config.gridSize - 1
        );
        
        // 添加光晕效果
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.arc(
            food.x * config.gridSize + config.gridSize/2,
            food.y * config.gridSize + config.gridSize/2,
            config.gridSize * 0.8,
            0,
            Math.PI * 2
        );
        this.ctx.fillStyle = foodColor;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * 绘制障碍物
     * @param {Array} obstacles 障碍物位置数组
     */
    drawObstacles(obstacles) {
        if (!obstacles || obstacles.length === 0) return;
        
        this.ctx.fillStyle = '#FF0000'; // 红色障碍物
        
        obstacles.forEach(obstacle => {
            this.ctx.fillRect(
                obstacle.x * config.gridSize,
                obstacle.y * config.gridSize,
                config.gridSize - 1,
                config.gridSize - 1
            );
            
            // 添加边框效果使障碍物更明显
            this.ctx.strokeStyle = '#880000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                obstacle.x * config.gridSize,
                obstacle.y * config.gridSize,
                config.gridSize - 1,
                config.gridSize - 1
            );
        });
    }
}