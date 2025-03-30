/**
 * 游戏配置参数
 */
export const config = {
    gridSize: 20,      // 网格大小
    speed: 300,       // 移动速度（毫秒）- 值越大，移动越慢
    initialSpeed: 300, // 初始移动速度
    minSpeed: 50,     // 最小速度限制（最快速度）
    speedDecrement: 2, // 每次吃到食物减少的速度值
    initialLength: 3,  // 蛇的初始长度
    initialScore: 10,  // 初始食物得分
    initialMultiplier: 1.0  // 初始分数倍率
};