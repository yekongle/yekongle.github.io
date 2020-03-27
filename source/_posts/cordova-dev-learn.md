---
title: Cordova开发篇
comments: true
date: 2019-01-29 23:06:16
tags:
    - Cordova 
categories:
    - mobile
---
### Android 平台
支持的Android API级别和过去几个cordova-android版本的Android版本：


cordova-android 版本 | 支持的 API 级别| 实际安卓版本
---|---|---
7.X.X | 19 - 27| 4.4 - 8.1
6.X.X | 16 - 26| 4.1 - 8.0.0
5.X.X | 14 - 23| 4.0 - 6.0.1
4.1.X | 14 - 22| 4.0 - 5.1
4.0.X | 10 - 22| 2.3.3 - 5.1
3.7.X | 10 - 21| 2.3.3 - 5.0.2
<!--more-->
需要注意的是，此处列出的版本适用于Cordova的Android软件包，cordova-android，而不适用于Cordova CLI。 要确定Cordova项目中安装的Cordova Android软件包的版本，请在包含项目的目录中运行命令cordova platform ls。

通常情况下，当某个Android版本在谷歌的发布平台上的支持率低于5%时，Cordova 就不再支持该Android版本。

#### 需求安装

1. Java Development Kit(JDK)

下载安装 Java 开发工具包 [JDK8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)。

2. Gradle

从Cordova-Android 6.4.0 起, 要构建 Android应用就必须安装[Gradle](https://gradle.org/)。

3. Android SDK

安装 [Android Studio](https://developer.android.com/studio/index.html), 具体安装说明请查看 Android 开发网站。

4. 添加 SDK 包

在安装完 Android SDK后，您还必须安装您希望开发的任何API级别的包,建议您安装您的cordova-android 所支持的最高 API 版本。

具体：打开 Android SDK 管理器，并且确保安装以下内容：
- 您要开发的 Android SDK 版本
- Android SDK 管理工具，版本在 19.1.0 以上。
- Android支持库(可在“Extras”下找到)

#### 环境变量设置
1. 将 $JAVA_HOME 环境变量设置为JDK安装的位置
2. 将 $ANDROID_HOME 环境变量设置为 Android SDK 安装的位置
3. 同时也将 Android SDK 安装目录中的 tools， tools/bin 和 platfrom-tools 添加到环境变量。


如果您是 OS X 或 Linux 系统，可以编辑 ~/.bash_profile 文件进行环境变量设置，如：

``` bash
export ANDROID_HOME=/Development/android-sdk/
```
更新系统 PATH：

``` bash
export PATH=${PATH}:/Development/android-sdk/platform-tools:/Development/android-sdk/tools
```
使添加的环境变量生效：

``` bash
$ source ~/.bash_profile
```
如果您是windows 系统，网上有很多设置设置安卓环境变量的教程，这里不再说明。

#### 项目配置
##### 模拟器配置：

如果您希望你的Cordova App 运行在安卓模拟器上，您首先需要创建一个安卓虚拟机(AVD), 通常可以在 Android Studio 上快速创建和配置。AVD 创建完后，便可以通过 Cordova 命令运行App在模拟器上：

``` bash
$ cordova run --emulator
```

##### Gradle 配置：

对于cordova-android@4.0.0 以上，Cordova的安卓项目是使用Gradle构建的。 有关使用Ant构建的说明，请参阅文档的旧版本，注意，从Android SDK Tools 25.3.0开始，就已经不推荐使用Ant版本。

Gradle属性配置：

可以通过设置 Cordova 公开的一些属性来配置 Gradle，以下是关于这些属性的说明：


属性 | 说明
---|---
cdvBuildMultipleApks |配置这个属性，将生成多个 APK 文件，分别对应支持 X86、ARM 等平台，如果您的项目使用大型本地库，这个很重要，可以大大增加生成的APK 大小。如果不设置，则会生成一个可在多平台架构上使用的APK。
cdvVersionCode|  会覆盖 AndroidManifest.xml 中的版本号
cdvReleaseSigningPropertiesFile| 配置发行应用的签名文件，默认：release-signing.properties
cdvDebugSigningPropertiesFile| 构建调试应用的签名文件，默认：debug-signing.properties, 在需要与其他开发人员共享签名密钥时非常有用
cdvMinSdkVersion|  覆盖 AndroidManifest.xml 中的 minSdkVersion, 在根据 SDK 版本创建多个 APK时有用。 
cdvBuildToolsVersion| 覆盖自动检测到的 android.buildToolsVersion 值
cdvCompileSdkVersion| 覆盖自动检测到的 android.compileSdkVersion  值

你可以通过以下 4 种方式来设置这些属性：

1. 通过设置环境变量：


``` bash
  $ export ORG_GRADLE_PROJECT_cdvMinSdkVersion=20
  $ cordova build android
```

2. 在 Cordova build 或 run 命令中使用 --gradleArg 参数：


``` bash
$ cordova run android -- --gradleArg=-PcdvMinSdkVersion=20
```

3. 在 <your-project>/platforms/android 目录下创建一个文件：gradle.properties，输入类似以下内容：


``` bash
# In <your-project>/platforms/android/gradle.properties
cdvMinSdkVersion=20
```

4. 使用 build-extras.gradle 文件对 build.gradle 进行扩展，类似如下所示设置属性：


``` bash
// In <your-project>/platforms/android/build-extras.gradle
ext.cdvMinSdkVersion = 20
```

后面两种方式都是通过在您的安卓平台目录下添加一个额外的文件来进行属性配置，通常，不建议您编辑此文件夹的内容，因为这些更改很容易丢失或覆盖。 相反，应使用before_build hook 将这两个文件从另一个位置复制到该文件夹中作为构建命令的一部分。

##### 扩展 build.gradle 文件

如果您需要自定义 build.gradle 文件，您应该创建一个名为build-extras.gradle的兄弟文件。此文件必须放在android平台目录（<your-project> / platforms / android）中，因此建议您通过附加到before_build挂钩的脚本将其复制。

一个例子如下：


``` bash
// Example build-extras.gradle
// This file is included at the beginning of `build.gradle`
ext.cdvDebugSigningPropertiesFile = '../../android-debug-keys.properties'

// When set, this function allows code to run at the end of `build.gradle`
ext.postBuildExtras = {
    android.buildTypes.debug.applicationIdSuffix = '.debug'
}
```
请注意，插件还可以通过以下方式包含build-extras.gradle文件：

``` bash
<framework src="some.gradle" custom="true" type="gradleReference" />
```

##### 设置版本号
要更改应用程序生成的apk的版本代码，请在应用程序的config.xml文件的widget元素中设置android-versionCode属性。 如果未设置android-versionCode，则将使用version属性确定版本代码。 例如，如果版本是MAJOR.MINOR.PATCH：


``` bash
versionCode = MAJOR * 10000 + MINOR * 100 + PATCH
```

如果您的应用程序已启用cdvBuildMultipleApks Gradle属性（请参阅设置Gradle属性），则应用程序的版本代码也将乘以10，以便代码的最后一位数字可用于指示apk构建的体系结构。 无论版本代码是从android-versionCode属性获取还是使用 version 生成，都会发生这种乘法。 请注意，添加到项目中的某些插件（包括cordova-plugin-crosswalk-webview）可能会自动设置此Gradle属性。

请注意：更新android-versionCode属性时，从构建的apks获取的版本号来增加是不明智的。 相反，您应该根据config.xml文件的android-versionCode属性中的值来增加。 这是因为cdvBuildMultipleApks属性导致版本号在构建的apks中乘以10，因此使用该值将导致您的下一个版本代码是原始版本号的100倍，等等。


#### 签署应用程序
##### 使用标志
要签署应用程序，您需要用到以下参数：

参数 | 标志| 说明
---|---|---
Keystore| --keystore | 二进制文件的路径，可以容纳一组密钥
Keystore Password | --storePassword | 密钥库的密码
Alias | --alias | id指定用于签名的私钥
Password | --password | 指定私钥的密码
Type of the Keystore | --keystoreType | 默认值：基于文件扩展名自动检测
无论是pkcs12还是jks默认值：基于文件扩展名自动检测
无论是pkcs12还是jks
 

可以使用上面的命令行参数为Cordova CLI构建或运行命令指定这些参数。

注意：您应该使用双 "-" 表示这些是特定于平台的参数，例如：


``` bash
cordova run android --release -- --keystore=../my-release-key.keystore --storePassword=password --alias=alias_name --password=password
```

##### 使用 build.json
或者，您可以使用相同命令的--buildConfig参数在构建配置文件（build.json）中指定它们。 以下是构建配置文件的示例：


``` json
{
    "android": {
        "debug": {
            "keystore": "../android.keystore",
            "storePassword": "android",
            "alias": "mykey1",
            "password" : "password",
            "keystoreType": ""
        },
        "release": {
            "keystore": "../android.keystore",
            "storePassword": "",
            "alias": "mykey2",
            "password" : "password",
            "keystoreType": ""
        }
    }
}
```
对于发布签名，可以排除密码，构建系统将发出询问密码的提示。

还支持在build.json中混合和匹配命令行参数和参数。 命令行参数中的值将优先。 这对于在命令行上指定密码很有用。

##### 使用 Gradle
您还可以通过包含.properties文件并使用cdvReleaseSigningPropertiesFile和cdvDebugSigningPropertiesFile Gradle属性指向它来指定签名属性（请参阅设置Gradle属性）。 该文件应如下所示：

``` bash
storeFile=relative/path/to/keystore.p12
storePassword=SECRET1
storeType=pkcs12
keyAlias=DebugSigningKey
keyPassword=SECRET2
```
storePassword和keyPassword是可选的，如果省略则会提示输入。

#### 调试
有关Android SDK随附的调试工具的详细信息，请参阅Android的开发人员文档以进行调试。 此外，Android的用于调试Web应用程序的开发人员文档提供了有关调试Webview中运行的应用程序部分的简介。

##### Android Studio中打开一个项目
Cordova-Android 项目可以在 Android Studio中打开。 如果您希望使用Android Studio内置的Android调试/分析工具，或者您正在开发Android插件，这将非常有用。 请注意，在Android studio中打开项目时，建议您不要在IDE中编辑代码。 这将编辑项目的平台文件夹（而不是www）中的代码，并且可能会覆盖更改。您应该编辑www文件夹并通过运行cordova build复制您的更改。

希望在IDE中编辑其本机代码的插件开发人员在通过cordova插件添加将其插件添加到项目时应使用--link标志。 这将链接文件，以便对平台文件夹中的插件文件的更改反映在插件的源文件夹中（反之亦然）。

要在Android Studio中打开Cordova-Android 项目：

1. 启动 Android Studio
2. 选择导入一个项目
![image](http://wx3.sinaimg.cn/mw690/005GXpqPgy1fznuqimewhj30ff0c140y.jpg)
3. 选择 Android 平台目录，(<your-project>/platforms/android).

![image](http://wx4.sinaimg.cn/mw690/005GXpqPgy1fznuqj7lpoj309r0b6jt6.jpg)
4. 对于Gradle Sync问题，您只需回答“是”即可。

完成导入后，您应该能够直接从Android Studio构建和运行应用程序。 有关详细信息，请参阅Android Studio概述以及从Android Studio构建和运行。
![image](http://wx1.sinaimg.cn/mw690/005GXpqPgy1fznuqk4xd4j30jr0ceadh.jpg)

#### 以平台为中心的工作流程

cordova-android包含许多脚本，允许在没有完整Cordova CLI的情况下使用该平台。 在某些情况下，此开发路径可为您提供比跨平台cordova CLI更多的开发选项。 例如，在将自定义Cordova WebView与本机组件一起部署时，需要使用shell工具。 在使用此开发路径之前，您仍必须按照上面的“要求和支持”中的说明配置Android SDK环境。

有关下面讨论的每个脚本，请参阅 [Cordova CLI](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html)。 每个脚本都有一个与相应CLI命令匹配的名称。 例如，cordova-android / bin / create相当于cordova创建。

首先，从npm或Github下载cordova-android软件包。

要使用此包创建项目，请在bin文件夹中运行create script：

``` bash
$ cordova-android/bin/create
```
创建的项目将在其中包含一个名为cordova的文件夹，其中包含项目特定Cordova命令的脚本（例如，运行，构建等）。 此外，该项目将采用与普通Cordova项目不同的结构。 值得注意的是，/ www被移至/ assets / www。


#### 声明周期
##### Cordova 与 Android
原生Android应用程序通常包含用户与之交互的一系列活动。 可以将活动视为构成应用程序的各个屏幕; 应用程序中的不同任务通常会有自己的活动。 每个活动都有自己的生命周期，在活动进入和离开用户设备的前台时进行维护。

相比之下，Android平台上的Cordova应用程序在嵌入在单个Android活动中的Webview中执行。 此活动的生命周期通过触发的文档事件向您的应用程序公开。 这些事件不能保证与Android的生命周期一致，但它们可以提供保存和恢复状态的指南。 这些事件大致映射到Android回调，如下所示：


Cordova 事件 |对应的 Andrid 事件| 说明
---|---|---
deviceready |onCreate()| 应用程序正在启动（不是从后台）
pause| onPause()| 应用程序进入后台运行
resume| onResume()| 应用程序返回到前台


大多数其他Cordova平台都有类似的生命周期概念，并且当用户的设备上发生类似的操作时，应触发这些相同的事件。 然而，Android带来了一些独特的挑战，由于原生活动生命周期，这些挑战有时会出现。

##### 为什么 Android 与众不同？
在Android中，操作系统可以选择在后台终止活动，以便在设备内存不足时释放资源。 不幸的是，当您的应用程序活动被终止时，您的应用程序所在的Webview也将被销毁。 在这种情况下，您的应用程序维护的任何状态都将丢失。 当用户导航回您的应用程序时，操作系统将重新创建活动和Web视图，但不会为您的Cordova应用程序自动恢复状态。 因此，您的应用程序必须了解触发的生命周期事件并维护适当的状态，以确保应用程序中的用户上下文在离开应用程序时不会丢失。

##### 什么时候会发生？
您的应用程序在离开用户视线时很容易被操作系统破坏， 有两种主要情况可能发生。 第一个也是最明显的情况是用户按下主页按钮或切换到另一个应用程序。

但是，某些插件可以引起第二种（更微妙的）情况。 如上所述，Cordova应用程序通常仅限于包含Webview的单个活动。 但是，有些情况下插件可以启动其他活动，并暂时将Cordova活动推送到后台。 通常会启动这些其他活动，以便使用设备上安装的本机应用程序执行特定任务。 例如，Cordova相机插件会启动设备上原生安装的任何相机活动以拍摄照片。 以这种方式重新使用已安装的相机应用程序会使您的应用程序在用户尝试拍照时更像本机应用程序。 不幸的是，当本机Activity将您的应用推送到后台时，操作系统有可能会将其杀死。

为了更清楚地理解第二种情况，让我们来看一个使用相机插件的例子。 想象一下，您有一个需要用户拍摄个人资料照片的应用程序。 一切按计划进行时，应用程序中的事件流将如下所示：
1. 用户正在与您的应用进行交互，需要拍照
2. 相机插件启动本地相机活动
    - *Cordova活动被推送到后台(触发暂停事件)*
3. 用户拍了一张照片
4. 相机活动结束
5. Cordova活动被移到前台（恢复事件被触发）
6. 用户返回到他们中断的应用程序

但是，如果设备内存不足，则可能会中断此事件流。 如果活动被操作系统杀死，则上述事件序列将显示如下： 

1. 用户正在使用您的应用程序并且需要拍一张照片
2. 相机插件启动本地相机活动
    - *操作系统破坏Cordova活动（暂停事件被触发*）
3. 用户拍了一张照片
4. 相机活动完成
    - *操作系统重新创建Cordova活动（deviceready 和resume 事件被触发）* 
5. 用户对于他们突然回到您应用的登录屏幕的原因感到困惑

在这种情况下，操作系统在后台杀死了应用程序，并且应用程序没有将其状态维持为生命周期的一部分。 当用户返回到应用程序时，Webview被重新创建，并且应用程序似乎已从头开始重新启动（因此用户感到困惑）。 这一系列事件等同于按下主页按钮或用户切换应用程序时发生的事件。 防止上述情况出现的关键是订阅事件并将状态正确地保持为活动生命周期的一部分。

##### 遵循生命周期
在上面的示例中，触发的javascript事件(斜体显示部分)。 这些事件是您保存和恢复应用程序状态的机会。 您应该在应用程序的 bindEvents 函数中注册回调，该函数通过保存状态来响应生命周期事件。 您保存的信息以及保存方式由您自行决定，但您应确保保存足够的信息，以便用户可以在用户返回应用程序时将其恢复到原来的位置。

在上面的示例中还有一个附加因素仅适用于第二个讨论的情况（即插件启动外部活动时）。 当用户完成拍照时，不仅应用程序的状态丢失，而且用户拍摄的照片也是如此。 通常，该照片将通过在相机插件中注册的回调传送到您的应用程序。 然而，当Webview被破坏时，回调永远丢失了。 幸运的是，cordova-android 5.1.0及更高版本提供了一种在应用程序恢复时获取该插件调用结果的方法。


##### 获取插件回调结果(cordova-android 5.1.0+)
当操作系统破坏通过插件推送到后台的Cordova活动时，任何挂起的回调也会丢失。 这意味着如果您将回调传递给启动新活动的插件（例如相机插件），则在重新创建应用程序时不会触发该回调。 但是，从cordova-android 5.1.0开始，resume 事件的有效负载将包含插件请求中的任何挂起的插件结果，这些结果来自于在活动被销毁之前启动外部活动的插件请求。

resume事件的有效负载遵循以下格式：


``` json
{
    action: "resume",
    pendingResult: {
        pluginServiceName: string,
        pluginStatus: string,
        result: any
    }
}
```
该有效载荷的字段定义如下：

- pluginServiceName：返回结果的插件的名称（例如“Camera”）。 这可以在插件的plugin.xml文件的<name>标记中找到
- pluginStatus：插件调用的状态（见下文）
- result：无论插件调用的结果是什么


pendingResult字段中pluginStatus的可能值包括以下内容：

- "OK" - 插件调用成功
- "No Result" - 插件调用结束，没有结果
- "Error" - 插件调用导致一些常见错误
- 其他杂项错误
    - "找不到类"
    - "非法访问”
    - "实例化错误”
    - "格式错误的网址”
    - "IO错误”
    - "无效的动作”
    - "JSON错误”

请注意，由插件决定结果字段中包含的内容以及返回的pluginStatus的含义。 查看您正在使用的插件的相关API，这些字段应该包含的内容以及如何使用它们的值。

##### 例子

下面是一个简短的示例应用程序，它使用resume和pause事件来管理状态。 它使用Apache相机插件作为如何从resume事件有效负载检索插件调用结果的示例。 处理resume的event.pendingResult对象的代码部分需要cordova-android 5.1.0+

``` javascript
// This state represents the state of our application and will be saved and
// restored by onResume() and onPause()
var appState = {
    takingPicture: true,
    imageUri: ""
};

var APP_STORAGE_KEY = "exampleAppState";

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        // Here we register our callbacks for the lifecycle events we care about
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onDeviceReady: function() {
        document.getElementById("take-picture-button").addEventListener("click", function() {
            // Because the camera plugin method launches an external Activity,
            // there is a chance that our application will be killed before the
            // success or failure callbacks are called. See onPause() and
            // onResume() where we save and restore our state to handle this case
            appState.takingPicture = true;

            navigator.camera.getPicture(cameraSuccessCallback, cameraFailureCallback,
                {
                    sourceType: Camera.PictureSourceType.CAMERA,
                    destinationType: Camera.DestinationType.FILE_URI,
                    targetWidth: 250,
                    targetHeight: 250
                }
            );
        });
    },
    onPause: function() {
        // Here, we check to see if we are in the middle of taking a picture. If
        // so, we want to save our state so that we can properly retrieve the
        // plugin result in onResume(). We also save if we have already fetched
        // an image URI
        if(appState.takingPicture || appState.imageUri) {
            window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
        }
    },
    onResume: function(event) {
        // Here we check for stored state and restore it if necessary. In your
        // application, it's up to you to keep track of where any pending plugin
        // results are coming from (i.e. what part of your code made the call)
        // and what arguments you provided to the plugin if relevant
        var storedState = window.localStorage.getItem(APP_STORAGE_KEY);

        if(storedState) {
            appState = JSON.parse(storedState);
        }

        // Check to see if we need to restore an image we took
        if(!appState.takingPicture && appState.imageUri) {
            document.getElementById("get-picture-result").src = appState.imageUri;
        }
        // Now we can check if there is a plugin result in the event object.
        // This requires cordova-android 5.1.0+
        else if(appState.takingPicture && event.pendingResult) {
            // Figure out whether or not the plugin call was successful and call
            // the relevant callback. For the camera plugin, "OK" means a
            // successful result and all other statuses mean error
            if(event.pendingResult.pluginStatus === "OK") {
                // The camera plugin places the same result in the resume object
                // as it passes to the success callback passed to getPicture(),
                // thus we can pass it to the same callback. Other plugins may
                // return something else. Consult the documentation for
                // whatever plugin you are using to learn how to interpret the
                // result field
                cameraSuccessCallback(event.pendingResult.result);
            } else {
                cameraFailureCallback(event.pendingResult.result);
            }
        }
    }
}

// Here are the callbacks we pass to getPicture()
function cameraSuccessCallback(imageUri) {
    appState.takingPicture = false;
    appState.imageUri = imageUri;
    document.getElementById("get-picture-result").src = imageUri;
}

function cameraFailureCallback(error) {
    appState.takingPicture = false;
    console.log(error);
}

app.initialize();
```
对应的 html：


``` html
<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        <title>Cordova Android Lifecycle Example</title>
    </head>
    <body>
        <div class="app">
            <div>
                <img id="get-picture-result" />
            </div>
            <Button id="take-picture-button">Take Picture</button>
        </div>
        <script type="text/javascript" src="cordova.js"></script>
        <script type="text/javascript" src="js/index.js"></script>
    </body>
</html>
```
##### 测试 Activity(活动)的生命周期
Android提供了一个开发人员设置，用于测试低内存上的Activity销毁。 在设备或仿真器的“开发人员选项”菜单中启用“不要保留活动”设置，以模拟低内存情况。 您应始终在启用此设置的情况下进行一些测试，以确保您的应用程序正确维护状态。

### IOS 平台

#### 要求与支持
构建iOS应用程序所需的Apple®工具需在基于Intel的Mac上的OS X操作系统上运行。 Xcode®7.0（最低要求版本）需要在OS X版本10.10.4（Yosemite）或更高版本上运行，并包含iOS 9 SDK（软件开发工具包）。 要将应用程序提交到Apple App Store，需要最新版本的Apple工具。

您可以使用随iOS SDK和Xcode一起安装的iOS模拟器测试许多Cordova功能，但在提交到App Store之前，您需要一个实际的设备来完全测试应用程序的所有设备功能。 该设备必须至少安装iOS 8，从Cordova 4.0.0开始支持最低iOS版本。 支持的设备包括iPhone 4S，iPhone 5，iPhone 5C，iPhone 5S，iPhone 6，iPhone 6 Plus，iPhone 6S，iPhone 6S Plus，iPhone SE，iPad 2，iPad 3，iPad 4，iPad Air，iPad Air 2，iPad Pro ，iPad Mini，iPad Mini 2，iPad Mini 3，iPod Touch 5th gen和iPod Touch 6th或更高版本。

#### 要求安装
##### Xcode

有两种方式可以安装 Xcode:
- 在[App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)中下载，可通过在App Store应用程序中搜索“Xcode”获得。
- 在[Apple 开发平台](https://idmsa.apple.com/IDMSWebAuth/signin?appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757&path=%2Fdownload%2Fmore%2F&rv=1)中下载，需要注册为Apple 开发人员。

安装Xcode后，需要启用多个命令行工具才能运行Cordova。 在终端执行命令：

``` bash
$ xcode-select --install
```
##### 部署工具
ios-deploy工具允许您从命令行在iOS设备上启动iOS应用程序。在终端执行命令：

``` bash
$ npm install -g ios-deploy
```
#### 项目配置
安装完上面的东西后，您现在就可以创建和构建一个 Cordova 项目了，更多细节，请参考另一篇博文《Cordova快速入门篇》。

##### 部署应用到模拟器
要在iOS模拟器中预览应用程序：
1. 从Xcode或命令行打开工作区文件（platforms / ios / HelloWorld.xcworkspace）：
```
$ open ./platforms/ios/HelloWorld.xcworkspace/
```
2. 确保在左侧面板中选择了HelloWorld项目（1）。
![image](http://wx2.sinaimg.cn/large/005GXpqPgy1fznuqknlcyj30v80b20v8.jpg)

- 从工具栏的 **Scheme** 菜单中选择目标设备，例如（2）中突出显示的iPhone 7 Plus Simulator
- 按 **Scheme** 菜单左侧相同工具栏中的 **Run** 按钮（3）。 它将在模拟器中构建，部署和运行应用程序。 将打开一个单独的模拟器应用程序以显示该应用：

一次只能运行一个模拟器，因此如果要在不同的模拟器中测试应用程序，则需要退出模拟器应用程序并在Xcode中运行不同的目标。

Xcode捆绑了最新版iPhone和iPad的模拟器。 可以从Xcode→首选项...→组件 面板中获得旧版本。

##### 部署应用到设备
有关部署到设备的各种要求的详细信息，请参阅Apple的 [App 部署流程](https://help.apple.com/xcode/mac/current/#/dev8b4250b57) 。 简而言之，在部署之前需要执行以下操作：

1. 在 [ios 配置面板](https://idmsa.apple.com/IDMSWebAuth/signin?appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757&path=%2Faccount%2F&rv=1)  中创建配置文件。 您可以使用 Apple 的 *开发配置助手*    来创建和安装 Xcode 所需的配置文件和证书。

2. 验证构建设置中*代码签名部分*中的*代码签名标识*设置是否设置为您的配置文件名称。

部署应用到设备：
1. 使用 USB 接口将您的设备连接到 Mac。
2. 在 Xcode 的左侧面板的项目列表中选择您要运行的项目
3. 在 Xcode 的 Scheme 菜单左侧的下拉列表中选择您的设备。
4. 按下 **Run** 按钮，将会执行构建，部署并运行应用程序到您的设备上。


#### App 签名
首先，请查看 Apple 开发人员网站的 [代码签名支持](https://developer.apple.com/support/code-signing/) 和 [应用部署流程](https://help.apple.com/xcode/mac/current/#/dev8b4250b57)

##### 使用标识符
要对 App 进行签名，您需要了解以下参数：


参数名 | 标识符 | 说明
---|---|---
代码签名身份 |--codeSignIdentity2| 用于签名的代码签名身份。 它可以使用Xcode创建并添加到您的钥匙串中。 从Xcode 8开始，您应该使用--codeSignIdentity =“iPhone Developer”进行调试和发布。
开发团队 | --developmentTeam |  用于代码签名的开发团队（团队ID）。 您可以使用此设置和简化的代码签名身份（即只是“iPhone开发人员”）来签署您的应用程序，无需提供配置文件。
打包类型| --packageType | 这会决定 Xcode 构建什么类型的 App。 有效选项包括开发（默认），企业，ad-hoc和应用商店。 
配置文件|--provisioningProfile  |  （可选）用于手动签名的配置文件的GUID。 它会在 Mac 上复制：〜/ Library / MobileDevice / Provisioning \ Profiles /。 在文本编辑器中打开它，如果使用手动签名，您可以找到需要在此处指定的GUID。
代码签名资源规则|--codesignResourceRules| (可选)用来配置哪些文件会作为代码签名的捆绑，查看 [OS X 代码签名](https://developer.apple.com/library/archive/technotes/tn2206/_index.html#//apple_ref/doc/uid/DTS40007919-CH1-TNTAG206) 了解更多信息。
自动配置|--automaticProvisioning|  （可选）启用以允许Xcode自动管理配置文件。 有效选项为false（默认值）和true。

##### 使用 build.json

或者，您可以使用相同命令的--buildConfig参数在构建配置文件（build.json）中指定它们。 以下是构建配置文件的示例：

对于自动签名，配置配置文件由Xcode自动管理（推荐）：


``` json
{
    "ios": {
        "debug": {
            "codeSignIdentity": "iPhone Developer",
            "developmentTeam": "FG35JLLMXX4A",
            "packageType": "development",
            "automaticProvisioning": true,
            "buildFlag": [
                "EMBEDDED_CONTENT_CONTAINS_SWIFT = YES",
                "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES=NO",
                "LD_RUNPATH_SEARCH_PATHS = \"@executable_path/Frameworks\""
            ]
        },
        "release": {
            "codeSignIdentity": "iPhone Developer",
            "developmentTeam": "FG35JLLMXX4A",
            "packageType": "app-store",
            "automaticProvisioning": true,
            "buildFlag": [
                "EMBEDDED_CONTENT_CONTAINS_SWIFT = YES",
                "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES=NO",
                "LD_RUNPATH_SEARCH_PATHS = \"@executable_path/Frameworks\""
            ]
        }
    }
}
```
对于手动签名，要根据 UUID 指定配置文件：

``` json
{
    "ios": {
        "debug": {
            "codeSignIdentity": "iPhone Development",
            "provisioningProfile": "926c2bd6-8de9-4c2f-8407-1016d2d12954",
            "developmentTeam": "FG35JLLMXX4A",
            "packageType": "development"
        },
        "release": {
            "codeSignIdentity": "iPhone Distribution",
            "provisioningProfile": "70f699ad-faf1-4adE-8fea-9d84738fb306",
            "developmentTeam": "FG35JLLMXX4A",
            "packageType": "app-store"
        }
    }
}
```
#### Xcode 构建标志符

如果您有自定义情况需要将其他构建标志传递给Xcode  - 您将使用一个或多个 --buildFlag 选项将这些标志传递给 xcodebuild。 如果您使用 xcodebuild 内置标志，它将显示警告。 您还可以在上面的build.json中指定buildFlag选项（buildFlag键的值是字符串或字符串数组）。

``` bash
cordova build --device --buildFlag="MYSETTING=myvalue" --buildFlag="MY_OTHER_SETTING=othervalue"
cordova run --device --buildFlag="DEVELOPMENT_TEAM=FG35JLLMXX4A" --buildFlag="-scheme TestSchemeFlag"
```
#### 调试
有关Xcode附带的调试工具的详细信息，请查看这篇[Apple 开发调试部分](https://developer.apple.com/support/debugging/)。

用于iOS项目的Cordova可以在Xcode中打开。如果您希望使用内置调试/分析工具的Xcode，或者您正在开发iOS插件，这将非常有用。请注意，在Xcode中打开项目时，建议您不要在IDE中编辑代码。这将编辑项目的平台文件夹（而不是www）中的代码，并且可能会覆盖更改。而是编辑www文件夹并通过运行cordova build复制您的更改。

希望在IDE中编辑其原生代码的插件开发人员在通过cordova插件添加将其插件添加到项目时应使用--link标志。这将链接文件，以便对平台文件夹中的插件文件的更改反映在插件的源文件夹中（反之亦然）。

将ios平台添加到项目并使用cordova构建后，您可以在Xcode中打开它。双击打开$ {PROJECT_NAME} / platforms / ios / $ {PROJECT_NAME} .xcworkspace文件或从终端打开Xcode：


``` bash
$ open -a Xcode platforms/ios
```
界面如下所示：
![image](http://wx3.sinaimg.cn/large/005GXpqPgy1fznuqm5s1lj30wy0mf0wn.jpg)

#### 更新

有关升级cordova-ios版本的说明，请参阅此[文章](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/upgrade.html)。
 