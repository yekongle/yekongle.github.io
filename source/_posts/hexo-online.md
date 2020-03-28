---
title: Hexo更换电脑如何同步博客配置解决办法
comments: true
date: 2020-03-28 16:42:03
tags:
    - hexo
categories:
    - Interesting
---
### 前言
关于使用 Hexo 搭建个人博客可参考本人另一篇博文: [Hexo框架+NextT主题搭建博客教程](https://blog.csdn.net/qq_23483671/article/details/78635372)

相信有不少小伙伴使用 Hexo 来搭建自己的个人博客，但问题是如果你电脑突然坏了，或者你想在其他电脑编辑发表你的博客，又要花费时间精力来重新配置你的站点，这样就比较麻烦。这时，我们可以将我们的站点放到 Github 或者其他 Git 托管平台，如此一来，无论你在哪里，都可以随时 clone 下来，简单配置下，就可以继续玩耍。
<!--more-->

### 实践
#### 准备新仓库或新分支
首先，你可以在 Github 创建一个新仓库或者直接在自己的 Gihubpage 仓库创建一条新 branch 来存放你的 hexo 相关配置文件。

```bash
# 本地创建新分支 hexo 并切换到该分支
git checkout -b hexo
# 推送分支并merge到远程分支hexo, 没有会自动创建
git push origin hexo:hexo
```
**或者用 eclipse 管理仓库，创建新分支**
![image](https://wx4.sinaimg.cn/mw690/005GXpqPgy1gd9psy57o5j30gv0bf74p.jpg)


**推送分支到远程**
![image](https://wx1.sinaimg.cn/mw690/005GXpqPgy1gd9pt9yif0j30iu0ghjs7.jpg)


#### 删掉分支 hexo 下面除了 git 的内容
![image](https://wx3.sinaimg.cn/mw690/005GXpqPgy1gd9ptqwgf8j30ld0e0ab4.jpg)


#### 将现有的 hexo 目录拷贝到该分支目录下
要拷贝的文件或目录有：
```bash
_config.yml
package.json
scaffolds/
source/
themes/
.gitignore
```
.gitignore 里的内容如下：
```bash
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
```
![image](https://wx3.sinaimg.cn/mw690/005GXpqPgy1gd9ptuwmgoj30l405vq35.jpg)

#### 推送到远程分支
```bash
git add .
git commit -m "Add hexo"
git push
```

#### 使用 hexo 分支
当需要在其他电脑编写博客时，就可以 clone 下来
```bash
git clone -b hexo https://github.com/yourname/xxx.github.io.git 
```
然后在新电脑配置 hexo 环境(需先安装 node.js 环境)
```bash
# 安装 hexo-cli
npm install hexo-cli -g

# 安装依赖
npm install
```
#### 使用回顾
进入 hexo 分支目录，打开命令行
```bash
# 新建文章
hexo new ""

# 新建类别
hexo new page ""

# 生成静态文件
hexo g

# 本地运行
hexo s

# 部署到 github page
hexo d
```
部署完毕后记得将源文件 push 到远程，同步博客内容。

