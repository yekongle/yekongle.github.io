---
title: Cordova快速入门
comments: true
date: 2019-01-22 00:39:51
tags: 
    - Cordova 
categories: 
    - mobile
---
### 背景介绍
#### 数说移动端的几种开发模式
- Native App: 采用原生代码进行，优点就是体验好，缺点是需要为不同的系统平台独立开发一套应用，开发成本较高。
- Web app: 一般是指 SAP(SinglePageApplication) 模式开发出的网站，体验较差。
-  React Native App: 是 Facebook 开源的一套App开发解决方案，让你只使用 JavaScript 也能够编写原生移动应用，它在设计原理上和 React 一致，通过声明式的组件机制来搭建丰富多彩的用户界面，能够实现大部分的跨平台，体验较好。
- Hybrid App: 混合开发模式，由Native 通过 JSBridge(一种)等方法提供统一的API，然后用前端语言(HTML、JS、CSS) 来写实际的界面和逻辑，再调用API，最终应用的页面是在 webview中示，从而达到跨平台效果，常见的是用Phonegap或Cordova中间件组合其他移动UI框架进行开发。
- 值得注意的是，RN App 和 Hybrid App 还是有本质区别的，RN App 是用JavaScript告诉原生语言做什么，所以最终在平台上运行的都是原生语言，包括UI等，也是原生的组件，而 Hybrid App中显示的大多是 webview，webview 里套常见的移动UI框架。Hybird App的原理图如下W：

<!--more-->

![image](http://wx2.sinaimg.cn/large/005GXpqPgy1fznuqhlz3vj30cc0fa74e.jpg)


#### Cordova的前世今生
Cordova前身是 Phonegap，最先由 Nitobi 软件公司在2008年推出，旨在弥补 web 和 ios 之间的不足，使得 web 和 iphone SDK 之间的交互更容易，后来陆续加入了更多的平台。

2011年，Adobe公司收购 Nitobi 后，将phonegap 项目的核心代码捐赠给了 Apache软件基金会(ASF), 使其保持透明和持续的发展，Apchae将其命名为 Cordova，而Adobe PhoneGap则发展出了一些服务型工具，如 Phonegap destop App、 Phonegap developer App、Phonegap build、Phonegap CLI等。

很多人可能会问：那 Cordova 和 Phonegap 的区别到底是什么，其实Cordova相当于驱动 Phonegap 的核心引擎，就好比如 WebKit 是现在大多数浏览器的引擎一样，因此 Adobe PhoneGap可理解为是Apache Cordova 的应用发行版。

Cordova的架构原理图如下，可知 Cordova 是混合App开发的一个中间件。

![image](http://wx1.sinaimg.cn/large/005GXpqPgy1fznuqi2d0oj30nf0ijgmp.jpg)


### Cordova安装
安装 Cordova 前，需要准备两样东西。
1. 下载安装 Node.js，这样就可以使用 Node.js 的 npm 软件管理包。
2. 安装 Git，因为当涉及到一些 git 仓库时会使用 git 来下载相关的资源。

Mac Os 或 Linux平台：

``` bash
sudo npm install -g cordova
```
Windows：

``` bash
C:\>npm install -g cordova
```
-g 参数是指告诉 npm 要全局安装 Cordova，不然会被安装在当前目录的子目录 node_modules 下。

### Cordova使用
#### 创建一个 App 项目

``` bash
cordova create hello[Required] com.example.hello[Optional] HelloWorld[Optional]
```
hello 是指项目文件夹名，com.example.hello 是应用程序的 ID 名，可在 config.xml 中更改。 HelloWorld，是 App 的名称，也可在 config.xml 中更改
这样就会创建最基本的App目录结构，默认会生成基于的web的应用主页，即为项目目录下的 www/index.html

#### 目录结构
Cordova 默认创建的 App 目录如下：

``` bash
myapp/
|-- config.xml
|-- hooks/
|-- merges/
| | |-- android/
| | |-- windows/
| | |-- ios/
|-- www/
|-- platforms/
| |-- android/
| |-- windows/
| |-- ios/
|-- plugins/
  |--cordova-plugin-camera/
```
- config.xml: 在这你可以自定义 App 项目的信息
- www/: 包括项目的web代码，如 html, css 和 js 文件，你将在这开发你 App 的主要代码，另外在 plaform 目录下的ios 目录或 android 目录下，也会有一个 www 目录，是基于 project/www 目录编译覆盖的。
- platform/: 包括你添加的平台的源码和脚本，注意一般不要该目录下的代码，否则可能造成在相关平台运行不了。
- plugins/: 插件目录，所有添加的插件都会被解压并复制到该目录下。
- hooks/：可以包含用于自定义 Cordova-CLI 命令的脚本， 您添加到这些目录的任何脚本都将在与目录名对应的命令之前和之后执行。 用于集成您自己的构建系统或与版本控制系统。
- merges/: 包含一些与特定平台相关联的 web 资源(HTML, CSS 和 JavaScript 文件),放在merges /下的文件将覆盖相关平台的www /文件夹中的匹配文件。 一个简单的例子，假设一个项目结构：

``` bash
merges/
|-- ios/
| -- app.js
|-- android/
| -- android.js
www/
-- app.js
```
在构建Android和iOS项目之后，Android应用程序将同时包含app.js和android.js，而iOS应用程序则只包含app.js，它是将 merges/ios/app.js，覆盖位于www/内的通用的app.js。


#### 添加平台
首先进入项目目录:

``` bash
$ cd hello
```
添加开发平台，会在 config.xml 和 package.json 中有记录:

``` bash
$ cordova platform add ios
$ cordova platform add android
```
执行上面两条命令后会在 platform 目录下生成 ios 和 android 两个子目录，用来存放编译后的代码和一些app的内容。

查看项目已添加的平台：

``` bash
$ cordova platform ls
```
当在 www 目录下开发完毕后，用以下命令构建项目到各个平台：

#### 构建前准备

要构建和运行应用程序，您需要为您想要开发的每个平台安装对应的SDK。 或者，如果您使用浏览器进行开发，则可以使用不需要任何平台SDK的浏览器平台。

查看您是否满足必须条件：

``` bash
$ cordova requirements
Requirements check results for android:
Java JDK: installed .
Android SDK: installed
Android target: installed android-19,android-21,android-22,android-23,Google Inc.:Google APIs:19,Google Inc.:Google APIs (x86 System Image):19,Google Inc.:Google APIs:23
Gradle: installed

Requirements check results for ios:
Apple OS X: not installed
Cordova tooling for iOS requires Apple OS X
Error: Some of requirements check failed
```


#### 应用构建与运行
##### 构建应用

``` bash
cordova build [<platform> [...]]
    [--debug|--release]
    [--device|--emulator]
    [--buildConfig=<configfile>]
    [--browserify]
    [-- <platformOpts>]
```

参数 | 说明
---|---
<platform>[...]| 要构建的平台名，没指定则为所有平台进行编译构建
--debug | 构建调试模式
--release  |  构建发布模式
--device| 构建到设备
--emulator|  构建到模拟器
--buildConfig=<configFile>|  使用特定的配置文件来编译构建，如指定签名等。 
--browserity|  在构建时编译JS插件而不是运行时
<platformOpts>| 提供特定的选项


##### 运行应用

``` bash
cordova run [<platform> [...]]
    [--list | --debug | --release]
    [--noprepare] [--nobuild]
    [--device|--emulator|--target=<targetName>]
    [--buildConfig=<configfile>]
    [--browserify]
    [-- <platformOpts>]
```


参数 | 说明
---|---
<platform>[...]| 要运行的平台名，没指定则所有平台都运行
--list | 列出可用的运行目标，包括模拟器和设备，除非特定指定
--debug | 默认选型，运行调试模式
--release  | 运行发布模式
--noprepare| 跳过准备阶段，适用于Cordova v6.2及其之后版本。
--nobuild|  跳过重新构建阶段
--device|  在设备上运行
--emulator|  在模拟器上运行
--target|  指定运行目标
--buildConfig=<configFile>|  使用特定的配置文件来编译构建，如指定签名等。 
--browserity|  在构建时编译JS插件而不是在运行时
<platformOpts>| 提供特定的选项


#### 添加插件
可以在 [Cordova插件资源](https://cordova.apache.org/plugins/) 页面中查询需要的插件，也可以使用命令行搜索相关插件：

``` bash
$ cordova plugin search camera
```

添加某个插件：
 
``` bash
$ cordova plugin add cordova-plugin-camera
Fetching plugin "cordova-plugin-camera@~2.1.0" via npm
Installing "cordova-plugin-camera" for android
Installing "cordova-plugin-camera" for ios
```
插件也可以通过目录或 Git 仓库的形式添加

注意：（CLI为每个平台添加适当的插件代码。 如果您希望使用概述中讨论的低级shell工具或平台SDK进行开发，则需要运行Plugman实用程序以为每个平台单独添加插件。 （有关更多信息，请参阅使用Plugman管理插件。）

查看已安装的插件

``` bash
$ cordova plugin ls
cordova-plugin-camera 2.1.0 "Camera"
cordova-plugin-whitelist 1.2.1 "Whitelist"
```

#### 使用合并功能

虽然Cordova允许您能够轻松地为许多不同平台部署应用程序，但实际上您时常需要添加一些自定义项。在这种情况下，您当然不希望修改不同平台下的www目录中的源文件，因为它们经常被顶级www目录的资源替换。

因此，Cordova 在顶级目录下提供了一个位置(merge目录)可以指定在哪个平台部署资源。merge目录中的平台子目录都对应着 www源码目录机构，允许您根据需要覆盖或添加文件。例如，你可能会使用合并功能为 Android 设备设置默认的字体大小：
- 在 www/index.html 文件中，添加一条指向额外的CSS样式文件的链接：overrides.css

``` bash
<link rel="stylesheet" type="text/css" href="css/overrides.css" />
```
- （可选）创建一个空的www / css / overrides.css文件，该文件适用于所有非Android版本，防止丢失文件错误。
- 在merges / android中创建一个css子目录，然后添加一个相应的overrides.css文件。 指定覆盖www / css / index.css中指定的12磅默认字体大小的CSS，例如：

``` bash
body { font-size:14px; }
```
当你重新构建项目后，只有 android 平台会应用自定义字体大小的样式，而其他平台保持不变。

#### 更新 Cordova 和您的项目
升级 Cordova 版本:

``` bash
$ sudo npm update -g cordova
```
安装指定的 Cordova 版本：

``` bash
$ sudo npm install -g cordova@3.1.0-0.2.0
```
查看 Cordova 版本：

``` bash
cordova -v
```
查看最新 Cordova 最新版本相关信息：

``` bash
$ npm info cordova version
```

更新指定的平台：

``` bash
$ cordova platform update android --save
$ cordova platform update ios --save
...etc.
```



