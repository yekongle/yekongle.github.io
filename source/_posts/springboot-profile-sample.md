---
title: Spring Boot2 实战系列之多环境Profile
comments: true
date: 2020-03-29 16:28:18
tags:
    - SpringBoot
categories:
    - Spring Boot
---
### 前言
在开发软件中，一个值得注意的问题就是当程序从一个环境迁移到另一个环境时，我们的程序是否依然正常运行，因为在开发阶段时，某些环境配置可能与生产环境不同，例如数据库配置，加密算法等。

在 Spring 中，你可以分别为不同的环境设置一个配置类，然后在运行时再根据环境来确定应该创建哪个 bean 和 不创建哪个 bean。在 Spring3.1 中，引入了 bean profile 的概念，可以将它理解为我们在Spring容器中所定义的Bean的逻辑组名称，对应到环境一般就是 dev(开发环境)，uat(用户测试环境), prod(生产环境)，在部署时指定激活哪个 profile 就行了。
<!--more-->
在 SpringBoot 中，可以通过创建 application-{profile}.properties, 然后在application.properties 中来指定激活的 profile, 比如指定active profile 为 prod 后，spring就会加载 application-prod.properties。
```
spring.profiles.active=prod
```
但这样如果每次更换环境时都要更改配置，就比较麻烦，所以可以利用 maven profiles 在构建应用时指定用什么 pofile，springboot 再将这个值替换就行了。


下面利用 server 端口来做一个例子， 分别为每个环境设置一个对应的端口。

### 创建项目
项目结构图如下：
![image](https://wx3.sinaimg.cn/mw690/005GXpqPgy1gdaw0tn5ptj30cs0d53yw.jpg)

pom 依赖如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.2.5.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>top.yekongle</groupId>
	<artifactId>springboot-profile-sample</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>springboot-profile-sample</name>
	<description>Profile sample for Spring Boot</description>

	<properties>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
			<exclusions>
				<exclusion>
					<groupId>org.junit.vintage</groupId>
					<artifactId>junit-vintage-engine</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
	</dependencies>

	<profiles>
		<profile>
			<id>dev</id>
			<!--默认激活 dev 环境-->
			<activation>
				<activeByDefault>true</activeByDefault>
			</activation>
			<properties>
				<active.profile>dev</active.profile>
			</properties>
		</profile>
		<profile>
			<id>uat</id>
			<properties>
				<active.profile>uat</active.profile>
			</properties>
		</profile>
		<profile>
			<id>prod</id>
			<properties>
				<active.profile>prod</active.profile>
			</properties>
		</profile>
	</profiles>

	<build>
		<finalName>${project.artifactId}</finalName>
		<resources>
			<resource>
				<directory>src/main/resources</directory>
				<filtering>true</filtering>
                <!--只包含全局 properties 和指定 profile 的properties-->
				<includes>
					<include>application.properties</include>
					<include>application-${active.profile}.properties</include>
				</includes>
			</resource>
		</resources>

		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>

```

### 代码编写
编辑 application.properties
```bash
# 对应 pom 中的 active.profile 属性，默认是 dev
spring.profiles.active=@active.profile@
```

创建 application-dev.properties
```bash
server.port=8080
```

创建 application-uat.properties
```bash
server.port=8081
```

创建 application-prod.properties
```bash
server.port=80
```

创建 HelloController.java
```java
@RestController
public class HelloController {

    @RequestMapping("/")
    public String index() {
        return "Hello world!";
    }

}

```

### 运行测试
打开 IDEA 命令行, 分别输入如下命令
```bash
# 使用 dev 环境
mvn clean spring-boot:run -P dev

# 使用 uat 环境
mvn clean spring-boot:run -P uat

# 使用 prod 环境
mvn clean spring-boot:run -P prod
```

打开浏览器

访问 http://localhost:8080
![image](https://wx3.sinaimg.cn/mw690/005GXpqPgy1gd9q21b1d3j30dr04idfv.jpg)

访问 http://localhost:8081
![image](https://wx4.sinaimg.cn/mw690/005GXpqPgy1gdaw16ax2xj30b7040dfr.jpg)

访问 http://localhost
![image](https://wx2.sinaimg.cn/mw690/005GXpqPgy1gdaw19f74kj30at03twee.jpg)

可见为不同环境配置的端口访问成功。

项目已上传至 Github: [https://github.com/yekongle/springboot-code-samples/tree/master/springboot-profile-sample](https://github.com/yekongle/springboot-code-samples/tree/master/springboot-profile-sample) , 希望对小伙伴们有帮助哦。