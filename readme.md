# SCUPLUS - 微信小程序[We川大]

> 这是一个主要服务四川大学师生的一个综合工具类微信小程序
> 这应该是目前为止四川大学功能最为全面也是最好的工具类应用了
> 目前小程序在积极开发阶段主要以实现功能为主，代码结构以及API随时可能改变，稳定版本出来之后会整理一份API，方便其他学校想要快速搭建小程序的同学

小程序采用wepy开发，不知道怎么取名字，仿照we重邮取了一个

## APIDOC

开发者已经毕业，小程序不会有大的变动，1.0版本已经发布，接下来会陆续完善小程序当中所涉及到的所有API
[https://documenter.getpostman.com/view/364695/RWaGUpsy](https://documenter.getpostman.com/view/364695/RWaGUpsy)

## 后端
https://github.com/mohuishou/scuplus-go

## 功能概要

- [x] 成绩查询/绩点计算器/成绩更新通知
- [x] 我的课程表（完善的课程表，包含时间日期，并且可以自定义）
- [x] 图书搜索/我的借阅/续借/历史借阅/图书到期通知
- [x] 空闲/自习教室
- [x] 一卡通信息
- [x] 考表/考试通知
- [x] 校历（基础的日历功能，事件订阅功能待开发）
- [x] 校车时刻表
- [x] 资讯(完善的资讯功能，类似今日头条，网易新闻，可以选择不超过10个栏目)
- [x] 反馈/查看/评论/通知(已整合github issues)
- [x] 寻课（课程助手，可以获取课程详细信息，拥有该课程的用户可以进行评价）
- [x] 寻物/寻卡(失物招领,并且针对校园卡单独分类)

## 预览
> 部分页面，截止于0.9.2

![img/preview.jpg](img/preview.jpg)

## 安装说明

> 已经配置好了容器化开发环境只需要安装 vscode、docker 即可快速使用

### 开发工具

- vscode（已安装扩展: ms-vscode-remote.remote-containers）
- docker 

### 1. 克隆本仓库

```bash
git clone git@github.com:mohuishou/scuplus-wechat.git
```

### 2. vscode 中点击左下角, 选择 remote-container: open in 

### 3. 修改配置文件
```bash
cd src/config
mv index.example.js index.js
```

### 4. 开启实时编译
```bash
npm run dev
```