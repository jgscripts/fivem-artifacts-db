module.exports = {
    apps: [
      {
        name: "fivem-artifacts-db",      // 应用名称
        script: "npm",                   // 使用 npm 脚本启动
        args: "start",                   // 执行 npm start
        cwd: "./",                       // 当前工作目录，默认为项目根目录
        env: {
          NODE_ENV: "production",        // 设置为生产模式
          PORT: 5000                     // 启动端口号
        }
      }
    ]
  };
  