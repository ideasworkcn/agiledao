# 敏捷开发管理神器【敏捷之道】（AgileDao）

以 pingcode 和禅道为案例分析软件功能，复刻开源的一个极简敏捷开发 scrum 管理软件，适合小型开发团队和独立开发者使用。

![软件主页](home.png)
![dashboard](dashboard.png)
![userstory](userstory.png)
![backlog](backlog.png)
![sprint](sprint.png)
![task](task.png)


## 开始使用

测试地址：[http://scrum.ideaswork.cn/](http://scrum.ideaswork.cn/)
登录账号密码：

- 用户名：123@qq.com
- 密码：123456

项目地址：[https://gitee.com/ideaswork/agiledao](https://gitee.com/ideaswork/agiledao)

### 本项目使用技术：

- next.js 框架
- shadcn UI 框架
- tainwindcss 样式
- react-data-grid 表格编辑
- @hello-pangea/dnd 拖拽库

### 如何运行

环境依赖： nodejs 18、jdk11、mysql、nginx

首先，运行前后端代码

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

登录账号密码：

- 用户名：123@qq.com
- 密码：123456

### 如何部署

局域网内直接在员工电脑运行即可。

如需公网访问推荐 [腾讯云轻量服务器国外节点}(https://cloud.tencent.com/product/lighthouse)

#### 软件版本：

云服务使用操作系统 ubuntu 24

#### 部署

拷贝 ubuntu-deploy.sh 到服务器直接运行即可，必要时自行修改脚本中的配置

```
sh ubuntu-deploy.sh
```

## 其他

本项目永久开源免费，欢迎 star ，求赞助～

打赏二维码：
![微信](wechatpay.png)

![支付宝](alipay.png)




关于 scrum 知识请查看 ![scrum 是什么](./scrum.md)