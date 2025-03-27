const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 配置静态文件服务
app.use(express.static(path.join(__dirname, '')));

// 根路由指向游戏页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'snake.html'));
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});

module.exports = app;