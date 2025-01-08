# 安装指南

## 下载和安装

### 1. 环境要求
在开始安装之前，请确保您的系统满足以下要求：
- **Node.js**: 版本 18.x 或更高
- **npm** 或 **yarn**: 用于管理依赖
- **Git**: 用于克隆项目仓库


   ```bash
   sudo apt update
   sudo apt install nodejs npm
      ```

### 2. 下载项目
1. 打开终端或命令行工具。
2. 克隆项目仓库：
   ```bash
   git clone https://gitee.com/ideaswork/agiledao
   ```
3. 进入项目目录：
   ```bash
   cd project-name
   ```

### 3. 安装依赖
1. 使用 npm 或 yarn 安装项目依赖：
   ```bash
   npm install
   ```
   或
   ```bash
   yarn install
   ```

### 4. 配置环境变量
1. 在项目根目录下创建 `.env` 文件：
   ```bash
   touch .env
   ```
2. 打开 `.env` 文件并填写以下配置项：
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_jwt_secret_key"
   ```
   请根据您的数据库配置和需求修改这些值。

### 5. 数据库迁移
1. 运行 Prisma 迁移以创建数据库表：
   ```bash
   npm run migrate
   ```
2. 如果需要生成 Prisma 客户端，请运行：
   ```bash
   npx prisma generate
   ```

### 6. 启动开发服务器
1. 启动开发服务器：
   ```bash
   npm run dev
   ```
   或
   ```bash
   yarn dev
   ```
2. 打开浏览器并访问 `http://localhost:3000`，您应该会看到项目的首页。

### 7. 生产环境部署
1. 构建项目：
   ```bash
   npm run build
   ```
   或
   ```bash
   yarn build
   ```
2. 启动生产服务器：
   ```bash
   npm start
   ```
   或
   ```bash
   yarn start
   ```

### 8. 常见问题
- **问题 1**: 数据库连接失败。
  - **解决方案**: 检查 `.env` 文件中的 `DATABASE_URL` 配置是否正确。
- **问题 2**: 依赖安装失败。
  - **解决方案**: 确保您的 Node.js 和 npm/yarn 版本符合要求，并尝试清除缓存后重新安装：
    ```bash
    npm cache clean --force
    npm install
    ```
