/**
 * 游戏配置参数
 */
export const config = {
    // 棋盘大小配置
    boardSizes: {
        small: {
            width: 300,
            height: 300,
            gridSize: 20,  // 较大的网格，较少的网格数量 (15x15)
            gridCount: 15
        },
        medium: {
            width: 400,
            height: 400,
            gridSize: 20,  // 中等网格，中等网格数量 (20x20)
            gridCount: 20
        },
        large: {
            width: 500,
            height: 500,
            gridSize: 20,  // 相同的网格大小，更多的网格数量 (25x25)
            gridCount: 25
        }
    },
    currentBoardSize: 'medium', // 默认中等大小
    gridSize: 20,      // 网格大小（会根据选择的棋盘大小动态调整）
    speed: 300,       // 移动速度（毫秒）- 值越大，移动越慢
    initialSpeed: 300, // 初始移动速度
    minSpeed: 50,     // 最小速度限制（最快速度）
    speedDecrement: 2, // 每次吃到食物减少的速度值
    initialLength: 3,  // 蛇的初始长度
    initialScore: 10,  // 初始食物得分
    initialMultiplier: 1.0  // 初始分数倍率
};