# 敏捷开发管理神器【敏捷之道】（AgileDao）

以 pingcode 和禅道为案例分析软件功能，复刻开源的一个极简敏捷开发 scrum 管理软件

## 开始使用

测试地址：[http://129.226.159.129/](http://129.226.159.129/)
登录账号密码：

- 用户名：123@qq.com
- 密码：123456

本项目为 SCRUM 前端项目，需要搭配后端项目使用

- 前端地址：[https://gitee.com/ideaswork/scrum-frontend](https://gitee.com/ideaswork/scrum-frontend)
- 后端地址：[https://gitee.com/ideaswork/scrum-service](https://gitee.com/ideaswork/scrum-service)

### 本项目使用技术：

- next.js 框架
- shadcn UI 框架
- tainwindcss 样式
- react-data-grid 表格编辑
- @hello-pangea/dnd 拖拽库

### 如何运行

环境依赖： nodejs version 18

首先，运行开发服务器：

```bash
npm install
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

登录账号密码：

- 用户名：123@qq.com
- 密码：123456

### 如何部署

局域网内直接在员工电脑运行即可。

如需公网访问推荐 [腾讯云轻量服务器国外节点}(https://cloud.tencent.com/product/lighthouse)

#### 软件版本：

首先安装如下软件

- nodejs 18
- jdk 11
- mysql 5.7
- nginx 1.24.0

#### 前端部署

在服务器目录上克隆仓库,安装依赖后直接运行

```bash
git clone https://gitee.com/ideaswork/scrum-frontend.git
cd scrum-frontend
npm install
npm run dev &
```

注：目前使用 build 方式有组件样式冲突暂未解决，后期修复

### 配置 nginx 代理：

- 80 端口转发到 本地 3001 端口
- 公网:3001/service/** 转发到 本地:8080/**

nginx 参考配置
···conf
server
{
listen 80;
server_name 129.226.159.129;
index index.html index.htm default.htm default.html;
#root /www/wwwroot/frontend/scrum-frontend;

    #SSL-START SSL相关配置
    #error_page 404/404.html;

    #SSL-END

    #ERROR-PAGE-START  错误页相关配置
    #error_page 404 /404.html;
    #error_page 502 /502.html;
    #ERROR-PAGE-END


    #REWRITE-START 伪静态相关配置
    include /www/server/panel/vhost/rewrite/node_scrum_frontend.conf;
    #REWRITE-END

    #禁止访问的文件或目录
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md|package.json|package-lock.json|\.env) {
        return 404;
    }

    #一键申请SSL证书验证目录相关设置
    location /.well-known/ {
        root  /www/wwwroot/frontend/scrum-frontend;
    }

    #禁止在证书验证目录放入敏感文件
    if ( $uri ~ "^/\.well-known/.*\.(php|jsp|py|js|css|lua|ts|go|zip|tar\.gz|rar|7z|sql|bak)$" ) {
        return 403;
    }


    # HTTP反向代理相关配置开始 >>>
    location ~ /purge(/.*) {
        proxy_cache_purge cache_one $host$request_uri$is_args$args;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST $remote_addr;
        add_header X-Cache $upstream_cache_status;
        proxy_set_header X-Host $host:$server_port;
        proxy_set_header X-Scheme $scheme;
        proxy_connect_timeout 30s;
        proxy_read_timeout 86400s;
        proxy_send_timeout 30s;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
      location /service/{
          proxy_pass http://127.0.0.1:8080/;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header REMOTE-HOST $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header Referer $http_referer;
          server_tokens off;
    }

    # HTTP反向代理相关配置结束 <<<

    access_log  /www/wwwlogs/scrum_frontend.log;
    error_log  /www/wwwlogs/scrum_frontend.error.log;

}
···

#### 后端部署

本地 maven 打包后上传服务器,注意修改数据库连接地址

···bash
java -jar 打包.jar

···

## 软件开发实际问题

- 工作量不透明
- 开发进度难预测
- 团队积极性低
- 团队信息不一致

软件研发管理一般会遇到哪些问题呢？工作中主要有这几点：每个人工作量不透明，整体开发进度无法预测，另外无法保持团队的积极性，团队人员理解的信息不一致。
如何解决这些问题呢？

## SCRUM 简介

- 简单而强大的项目管理框架
- 连接项目经理、产品经理、团队成员
- 迭代和增量的开发方式

今天要讲的这个项目管理框架可以解决这些问题
联系项目干系人，并增量迭代开发

## SCRUM 的核心元素

## 三个角色：

- 产品负责人（PO）
- 开发团队（DT）
- Scrum Master（SM）

![三个角色](https://www.visual-paradigm.com/servlet/editor-content/scrum/what-is-scrum-team/sites/7/2018/10/what-is-scrum-team.png)

scrum 有 3 个角色，其中产品负责人负责制定产品需求列表；开发团队包括设计师、程序员和测试人员交付产品功能；scrum master 类似于项目经理，管理整个开发流程

## 四个活动

- Sprint 计划会议
- 每日站会
- Sprint 评审会议
- Sprint 回顾会议

4 个活动： sprint 计划会议确定接下来 1 到 4 周内要开发哪些产品需求，并估算每个产品待办的开发时间。

每日站会中开发团队汇报已完成工作与今日任务；

sprint 评审会议：演示一个迭代周期开发的产品结果

sprint 回顾会议：回顾开发过程中需要改进的地方

## 三个产出

- 产品待办（Product Backlog）
- Sprint 待办（Sprint Backlog）
- 增量（Increment）

scrum 有三个产出：
产品负责人制定的产品待办列表、全体成员制定的 sprint 代办列表、
开发团队每日交付的开发成果

## 名词解析

Sprint（迭代）：原义是短距离赛跑，这里指一次迭代。

Kanban（看板）：类似报表，管理研发的过程。

## scrum 流程

![scrum 流程](https://miro.medium.com/v2/resize:fit:1400/1*pAjNWHhl2kERAU3JzZaN2A.jpeg)

这张图展示了 scrum 的管理流程
首先产品负责人制定一个产品的待办清单。scrum master 召开一个 SPRINT planning 会议。这个会议呢，所有团队人员一起来制定，在下一个 sprint 开发周期内。我们要完成哪些 product backlog，并且评估一下每个 backlog 需要花费多长时间。

在这一个周期内团队开始工作，每天都交付开发成果.当一个 Sprint 周期完成之后，scrum master 组织一个评审会议，来演示成果。并且组织一个回顾会议，回顾哪些改进的地方。然后每个团队成员进行反思。这样一次 sprint 流程完成。

## 如何快速上手 SCRUM？

### 明确团队角色和责任

- 产品负责人（PO）：定义产品愿景、维护 Product Backlog、优先级排序

- Scrum Master（SM）：确保 Scrum 流程被正确遵循，移除障碍

- 开发团队（DT）：在每个 Sprint 中交付潜在可交付的产品增量

在团队中明确产品负责人和 scrum master，其中产品负责人可由项目经理或产品经理承担，scrum master 可由项目经理或开发组长承担。

### 产品负责人管理产品待办

（Product Backlog）

- 包含所有待开发的功能、特性和需求
- 每个条目有明确的描述、优先级和估计值

![product backlog](https://res.cloudinary.com/mitchlacey/image/upload/v1601140627/Sample-Product-Backlog_mrmgso.png)

这是一个产品待办的列表，包含优先级，时间估计，用户故事

### Scrum Master 管理冲刺计划会议

（Sprint Planning Meeting）

- 从 Product Backlog 中选取高优先级条目放入 Sprint Backlog
- 团队共同评估并承诺完成 Sprint Backlog 中的工作

![sprint planning](https://www.slideteam.net/media/catalog/product/cache/1280x720/s/p/sprint_review_scrum_artifacts_ppt_demonstration_Slide01.jpg)

这是会议议程案例，首先介绍下一个 sprint 的目标，讨论要开发的产品需求并估计进度，最后听取反馈

### 冲刺开发（Sprint）

- 固定的时间周期（1-4 周）
- 每日站会（Daily Scrum）同步进度、识别问题

确定好一个 sprint 后团队进入开发阶段，每日站会沟通开发进度

![daily scrum](https://www.zohowebstatic.com/sites/zweb/images/sprints/seo/daily-stand-up.png)

这是每日站会中每个人需要回答的问题，我昨天做了什么，今天要做什么，遇到了什么困难

### 冲刺评审会议

（Sprint Review Meeting）

- 展示 Sprint 成果，邀请利益相关者评审
- 收集反馈，了解哪些工作做得好，哪些需要改进

![Sprint Review](https://resources.scrumalliance.org/uploads/2021/11/9/Sprint_Review_Agenda-cyujUwvcokKPB0YhXrRpKg.png)

![每日站会](https://files.sitebuilder.webafrica.co.za/64/24/6424676f-cc0e-4654-b08f-b11cd3afa039.PNG)

产品负责人给领导介绍项目背景，开发人员演示新的产品功能，全体讨论下个发布版本的时间线、预算、阻碍、潜在市场机遇，讨论接下来要做什么，为下次 sprint 准备内容

### 冲刺回顾会议

（Sprint Retrospective Meeting）

- 团队自我反思和改进的机会
- 讨论问题、挑战和成功，决定改进措施

![Sprint Retrospective](https://scrum-institute.org/images_scrum/sprint-retrospective-objectives.png)

有效经验分享，什么导致了问题，下次如何提高

## 市面 SCRUM 软件

- PingCode https://pingcode.com/
- 禅道（Zentao）https://www.zentao.net/

![PingCode](https://cdn.easycorp.cn/web/data/upload/zentao/202312/f_40df61432ff4f4b423c8adf7aa43e04f.png)

禅道有免费开源版本，因此用户数量较多

![禅道](https://s3.cn-northwest-1.amazonaws.com.cn/pc-blog/2020/08/-PingCode----Kanban--.png)

pingcode 是比较新的平台，界面设计美观，流程简洁

本项目是根据两个平台的功能设计的一个免费开源的版本，可以自行添加功能

## 引用

- https://juejin.cn/post/6967239863628202015
- https://juejin.cn/post/6844903746049146888
