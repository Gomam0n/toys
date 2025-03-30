/**
 * 输入处理模块
 */

/**
 * 输入控制器类，处理键盘输入
 */
export class InputController {
    constructor() {
        this.nextDirection = 'right';
        this.currentDirection = 'right';
        this.keydownHandler = this.handleKeyDown.bind(this);
    }

    /**
     * 初始化输入控制
     */
    init() {
        document.addEventListener('keydown', this.keydownHandler);
    }

    /**
     * 停止输入控制
     */
    stop() {
        document.removeEventListener('keydown', this.keydownHandler);
    }

    /**
     * 重置方向
     * @param {String} direction 初始方向
     */
    resetDirection(direction) {
        this.currentDirection = direction;
        this.nextDirection = direction;
    }

    /**
     * 处理键盘按键事件
     * @param {KeyboardEvent} event 键盘事件
     */
    handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowUp':
                if (this.currentDirection !== 'down') this.nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (this.currentDirection !== 'up') this.nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (this.currentDirection !== 'right') this.nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (this.currentDirection !== 'left') this.nextDirection = 'right';
                break;
        }
    }

    /**
     * 获取下一个方向
     * @returns {String} 下一个方向
     */
    getNextDirection() {
        return this.nextDirection;
    }

    /**
     * 更新当前方向
     */
    updateCurrentDirection() {
        this.currentDirection = this.nextDirection;
        return this.currentDirection;
    }
}