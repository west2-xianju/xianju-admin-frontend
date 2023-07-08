# xianju-admin-frontend

![闲橘 Logo](https://raw.githubusercontent.com/west2-xianju/xianju-admin-frontend/main/docs/logo-text.png)

该仓库包含了使用 Vue.js 和 TDesign Starter（vite + pinia + vue-router + echarts）实现的 闲橘后台管理 的前端代码，提供 闲橘App 的各项功能管理。

![后台管理页面预览](https://raw.githubusercontent.com/west2-xianju/xianju-admin-frontend/main/docs/xianju-preview.jpeg)

## 特点

- **用户管理：**管理用户账户、角色和权限。
- **数据可视化：**使用图表和图形可视化数据。
- **仪表盘：**查看和分析关键指标和统计数据。
- **动态路由：**用户路由由后端服务管理。
- **聊天演示：**集成的聊天演示。
- ~~**设置：**配置应用程序设置和首选项。~~

## 先决条件

在运行 闲橘后台管理 之前，请确保系统上安装了以下软件：

- Node.js（版本 14 或更高）
- npm（版本 6 或更高）或 Yarn（版本 1.22 或更高）

## 安装

按照以下步骤安装和设置 闲橘后台管理：

1. 将该仓库克隆到本地机器：

   ```shell
   git clone <repository-url>
   ```

2. 进入项目目录：

   ```shell
   cd <repository-name>
   ```

3. 安装项目依赖项：

   ```shell
   npm install   # 如果使用 npm
   # 或者
   yarn install  # 如果使用 Yarn
   ```


## 使用方法

要启动 xianju-admin-frontend，请使用以下命令：

```shell
npm run dev   # 如果使用 npm
# 或者
yarn dev      # 如果使用 Yarn
```

这将启动开发服务器，应用程序可以在 `http://localhost:3002` 上访问。

## 部署

要构建和部署生产环境的 闲橘管理后台，请使用以下命令：

```shell
npm run build   # 如果使用 npm
# 或者
yarn build      # 如果使用 Yarn
```

这将在 `dist` 或 `build` 目录中生成一个可用于部署到 Web 服务器或静态服务的生产就绪构建。

## 联系方式

如果您对 闲橘后台管理 有任何问题或建议，请随时通过 [zenor0@outlook.com](mailto:zenor0@outlook.com) 联系我们。感谢您的反馈和支持。

访问查看在线演示 [此处](https://example.com)。