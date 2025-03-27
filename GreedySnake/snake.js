// 游戏配置
const config = {
    gridSize: 20,      // 网格大小
    speed: 300,       // 移动速度（毫秒）- 值越大，移动越慢
    initialLength: 3  // 蛇的初始长度
};

// 游戏状态
let snake = [];
let food = null;
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop = null;

// 声明DOM元素变量
let canvas, ctx, scoreElement, gameOverElement, finalScoreElement;

// 在页面加载完成后初始化DOM元素
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    scoreElement = document.getElementById('score');
    gameOverElement = document.getElementById('game-over');
    finalScoreElement = document.getElementById('final-score');
    
    // 初始化游戏
    startGame();
});

// 初始化游戏
function initGame() {
    // 确保DOM元素已经初始化
    if (!canvas || !ctx || !scoreElement || !gameOverElement || !finalScoreElement) {
        console.error('DOM元素未初始化');
        return;
    }

    // 初始化蛇
    snake = [];
    // 生成随机起始点（确保在画布范围内）
    const maxX = Math.floor(canvas.width / config.gridSize) - config.initialLength;
    const maxY = Math.floor(canvas.height / config.gridSize) - config.initialLength;
    
    let headX, headY;
    
    // 根据方向生成不同排列的蛇身
    do {
        headX = Math.floor(Math.random() * (maxX - 3)) + 2;
        headY = Math.floor(Math.random() * (maxY - 3)) + 2;
    } while (
        headX < 1 || headX >= maxX || 
        headY < 1 || headY >= maxY
    );

    // 重置方向
    // 随机生成初始方向
    const directions = ['up', 'down', 'left', 'right'];
    direction = directions[Math.floor(Math.random() * 4)];
    nextDirection = direction;

    for (let i = 0; i < config.initialLength; i++) {
        switch(direction) {
            case 'right':
                snake.unshift({x: headX + i, y: headY});
                break;
            case 'left':
                snake.unshift({x: headX - i, y: headY});
                break;
            case 'up':
                snake.unshift({x: headX, y: headY - i});
                break;
            case 'down':
                snake.unshift({x: headX, y: headY + i});
                break;
        }
    }
    console.log(direction)
    console.log(nextDirection)
    
    // 生成第一个食物
    generateFood();
    
    // 重置分数
    score = 0;
    updateScore();
    
    
    // 隐藏游戏结束界面
    gameOverElement.style.display = 'none';

    // 注意：游戏循环不在这里启动，而是在startGame函数中启动
}

// 生成食物
function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / config.gridSize)),
            y: Math.floor(Math.random() * (canvas.height / config.gridSize))
        };
        
        // 确保食物不会生成在蛇身上
        if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            break;
        }
    }
}

// 更新分数显示
function updateScore() {
    scoreElement.textContent = `分数: ${score}`;
    finalScoreElement.textContent = score;
}

// 键盘事件处理
function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
}

// 游戏主循环
function gameStep() {
    // 更新蛇的方向
    direction = nextDirection;
    
    // 计算新的头部位置
    const head = {...snake[0]};
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    console.log(direction)
    console.log(nextDirection)
    for(let i = 0; i < snake.length; i++) {
        console.log(snake[i].x,snake[i].y)
    }
    console.log(head.x,head.y)
    
    // 检查碰撞
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    // 移动蛇
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
    } else {
        snake.pop();
    }
    
    // 渲染游戏
    render();
}

// 碰撞检测
function isCollision(head) {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= canvas.width / config.gridSize ||
        head.y < 0 || head.y >= canvas.height / config.gridSize) {
        return true;
    }
    
    // 检查自身碰撞
    // 我们需要检查蛇身（除了蛇尾，因为蛇尾会在移动时离开当前位置）
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    
    return false;
}

// 渲染游戏
function render() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格（可选）
    ctx.strokeStyle = '#eee';
    for (let i = 0; i < canvas.width; i += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        ctx.fillRect(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            config.gridSize - 1,
            config.gridSize - 1
        );
        
        // 绘制蛇头的眼睛
        if (index === 0) {
            ctx.fillStyle = '#000';
            const eyeSize = 3;
            const eyeOffset = 4;
            
            // 根据方向绘制眼睛
            let eyeX1, eyeY1, eyeX2, eyeY2;
            switch (direction) {
                case 'right':
                    eyeX1 = eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    eyeY1 = segment.y * config.gridSize + eyeOffset;
                    eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'left':
                    eyeX1 = eyeX2 = segment.x * config.gridSize + eyeOffset;
                    eyeY1 = segment.y * config.gridSize + eyeOffset;
                    eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'up':
                    eyeX1 = segment.x * config.gridSize + eyeOffset;
                    eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    eyeY1 = eyeY2 = segment.y * config.gridSize + eyeOffset;
                    break;
                case 'down':
                    eyeX1 = segment.x * config.gridSize + eyeOffset;
                    eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    eyeY1 = eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
            }
            
            ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize);
            ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize);
            ctx.fillStyle = '#4CAF50';
        }
    });
    
    // 绘制食物
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(
        food.x * config.gridSize,
        food.y * config.gridSize,
        config.gridSize - 1,
        config.gridSize - 1
    );
}

// 游戏结束
function gameOver() {
    // 清除游戏循环
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // 显示游戏结束界面
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;
    
    // 移除键盘事件监听器
    document.removeEventListener('keydown', handleKeyPress);
}

// 开始游戏
function startGame() {
    console.log('开始游戏初始化...');
    // 确保DOM元素已经初始化
    if (!canvas || !ctx || !scoreElement || !gameOverElement || !finalScoreElement) {
        console.error('DOM元素未初始化，无法开始游戏');
        console.debug('当前元素状态:', {
            canvas: !!canvas,
            ctx: !!ctx,
            scoreElement: !!scoreElement,
            gameOverElement: !!gameOverElement,
            finalScoreElement: !!finalScoreElement
        });
        return;
    }
    
    // 清除现有的游戏循环
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // 初始化游戏状态
    initGame();
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 开始新的游戏循环 - 确保只有一个游戏循环在运行
    gameLoop = setInterval(gameStep, config.speed);
    console.log('游戏循环已启动，间隔:', config.speed);
    console.log('初始蛇长度:', snake.length);
    
    // 重新添加键盘事件监听器
    document.addEventListener('keydown', handleKeyPress);
}

// 键盘控制
document.addEventListener('keydown', function(event) {
    if (!gameLoop) return; // 如果游戏未开始，不处理按键事件
    
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});