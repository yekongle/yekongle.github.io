---
title: Java常见设计模式
comments: true
date: 2019-03-19 21:35:43
tags:
  - Java
categories:
  - Java
---
### 前言
设计模式的概念最早来源于建筑大师 Alexander 的《建筑的永恒方法一书》，书中的观点实际上也适用于软件设计领域。Alexander 是这样描述模式的：
**模式是一条有三个部分组成的通用规则：它表示了一个特定环境、一类问题和一个解决方案之间的关系。每一个模式描述了一个不断重复发生的问题，以及该问题解决方案的核心设计。**
<!--more-->

软件设计模式通常被分成三类：
1. 创建型：创建对象时，不再直接实例化对象，而是根据特定场景，由程序来确定创建对象的方式，从而保证更高的性能、更好的架构优势。创建型模式主要有简单工厂模式、工厂方法、抽象工厂模式、单例模式、生成器模式和原型模式。
2. 结构型：用于帮助将多个对象组织成更大的结构。结构型模式主要有适配器模式、桥接模式、组合器模式、装饰器模式、门面模式、享元模式和代理模式。
3. 行为型：用于帮助系统间各对象的通信，以及如何控制复杂系统中的流程。行为型模式主要有命令模式、解释器模式、迭代器模式、中介者模式、备忘录模式、观察者模式、状态模式、策略模式、模板模式和访问模式。



### 设计模式
#### 单例模式
如何一个类始终只能创建一个实例，则这个类被称为单例类，这种模式就被称为单例模式。有时候访问系统的某些组件时只需访问其一个实例，而不需重复创建实例，如对spring 框架而言，推荐将一些公共的业务逻辑组件、DAO组件、数据源组件配置成单例的行为方式，因为这些组件无须保存任何用户状态，设为单例的行为方式，所有客户端都可以共享这些组件。

单例模式需保证类只能产生一个实例，因此需要隐藏类的构造器，同时设置一个公共静态方法用于访问该实例对象。

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 19, 2019 10:07:07 PM
* @Description 单例模式:1.减少重复创建实例带来的系统开销 2.便于跟踪单个实例生命周期、状态
*/
public class Singleton {
	private static Singleton instance;
	private Singleton() {}
	
	public static Singleton getInstance() {
		if (instance == null) {
			instance = new Singleton();
		}
		return instance;
	}
	public static void main(String[] args) {
		Singleton instance1 = Singleton.getInstance();
		Singleton instance2 = Singleton.getInstance();
		// 查看两个对象是否相等
		System.out.println(instance1 == instance2);
	}
}

```

#### 简单工厂
日常开发中，常常会遇到应用中各实例之间存在复杂的调用关系，即依赖关系，如 A 实例需要调用 B 实例，则称 A 实例依赖于 B 实例。在 A 对象需要调用 B 对象的方法时，最普通的做法是使用 new 关键字来创建 B对象，再用 B 对象来调用其方法。从语法的角度，这不会出现任何问题，但该做法的弊端在于：A 类方法内直接调用了 B 类的类名，这种方式便是硬编码耦合，当系统需要重构时，如果需要用 C 替换 B，那么就需要修改 A 方法，如果有成百上千个类都以类似 A 的方式耦合了 B，那么要修改的地方也有成百上千个，这是非常可怕的。

如果换一个角度来思考这个问题， A 不关心 B 的构造过程是怎么的，它只需要用到 B 的方法而已。考虑让 B 实现一个接口 IB，而 A 只需要 IB 接口耦合， A 不需直接通过 new 的方式来获得 B 实例，而是通过一个工厂类 IBFactory 来负责创建 B实例；A 只需通过工厂的方法即可获得B实例。如果系统重构时需要用 C 替换B，则 C 也实现 IB 接口，并且工厂原来创建 B 实例的方法改为创建 C 实例就可以了。

观看以下一个例子， 某位主人想撸猫, 他不关心猫是怎样产生的，只想在撸猫过程中听到猫叫和看到猫吃东西， 则通过动物工厂拿到了猫的实例对象，然后调用猫的行为方法，在这个过程中，猫实现了动物接口的基本行为，主人只需与猫的特殊抽象：动物接口耦合，并通过工厂返回动物接口的猫实例，就能与猫互动了。假若有一天，他觉得猫太高冷了不想撸猫想撸狗了，则同样将狗这个对象实现动物接口的基本方法，然后修改工厂方法改为生产狗就行了，不需要修改这位主人的主体行为方法。


```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 19, 2019 10:54:33 PM
* @Description 接口动物的行为
*/
public interface Animal {
	void speak();
	void eat();
}
```


```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 19, 2019 10:48:34 PM
* @Description 猫的行为
*/
public class Cat implements Animal{
	
	public void speak() {
		System.out.println("喵喵喵~~");
	}
	public void eat() {
		System.out.println("我要吃鱼。");
	}
}
```


```
/**
* @author Kevin Lau
* @version 创建时间：Mar 19, 2019 10:51:06 PM
* @Description 狗的行为
*/
public class Dog implements Animal{

	public void speak() {
		System.out.println("旺旺旺~~");
	} 
	public void eat() {
		System.out.println("我要啃骨头。");
	}
}
```


```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 19, 2019 10:55:25 PM
* @Description 动物梦工厂
*/
public class AnimalFactory {

	public Animal getAnimal() {
		return new Cat();
		//return new Dog();
	}
}
```

 
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 19, 2019 10:53:09 PM
* @Description 人的行为
*/
public class Master {
	public static void playWithAnimal() {
		// 传统做法
		// Cat cat = new Cat();
		// Dog dog = new Dog();
		AnimalFactory factory = new AnimalFactory();
		Animal animal = factory.getAnimal();
		animal.speak();
		animal.eat();
	}
	
	public static void main(String[] args) {
		playWithAnimal();
	}	
}
```

#### 工厂方法
在简单工厂模式中，系统使用工厂类来生产实例，由该工厂类来决定生产哪个类的实例，若要返回不同实例则需修改逻辑判断，如果不想在工厂类中进行逻辑判断，可以为不同产品类提供不同的工厂，由不同的工厂类来生产对应的实例。

以上面为例子，将动物工厂抽象成接口，同时提供生产猫和生产狗的两个工厂实现类


```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 19, 2019 10:55:25 PM
* @Description 动物梦工厂
*/
public interface AnimalFactory {
	 Animal getAnimal();
}
```

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 20, 2019 9:27:38 PM
* @Description 猫工厂
*/
public class CatFactory implements AnimalFactory{
	@Override
	public Animal getAnimal() {
		return new Cat();
	}
}

```

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 20, 2019 9:25:13 PM
* @Description 狗工厂
*/
public class DogFactory implements AnimalFactory{
	@Override
	public Animal getAnimal() {
		return new Dog();
	}
}

```

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 19, 2019 10:53:09 PM
* @Description 人的行为
*/
public class Master {
	public static void playWithAnimal() {
		// 撸猫
		CatFactory catFactory = new CatFactory();
		Animal cat = catFactory.getAnimal();
		cat.speak();
		cat.eat();
		
		// 撸狗
		DogFactory dogFactory = new DogFactory();
		Animal dog = dogFactory.getAnimal();
		dog.speak();
		dog.eat();
	}
	
	public static void main(String[] args) {
		playWithAnimal();
	}
}
```

#### 抽象工厂
从上面工厂方法的例子可看出，如果客户端需要调用多个不同的 Animal 实例时，程序必须要显式地创建不同的 AnimalFactory 实例，虽然客户端代码避免了与被调用对象的耦合，却需要与不同的工厂类进行耦合，这依然是个问题。

为了解决客户端与不同工厂类耦合的问题，考虑新增一个工厂类，但这个工厂类不是生产 Animal 实例，而是生产 AnimalFactory 实例，也就是说这个工厂类不再生产具体的被调用对象，而是生产工厂对象，这种设计模式也被称为抽象工厂模式。


```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 20, 2019 9:51:04 PM
* @Description 抽象工厂
*/
public class AnimalFactoryFactory {
	public static AnimalFactory getAnimalFactory(String type) {
		if ("cat".equalsIgnoreCase(type)) {
			return new CatFactory();
		} else if ("dog".equalsIgnoreCase(type)) {
			return new DogFactory();
		}
		return null;
	}
}

```


#### 代理模式
代理模式是指当客户端需要调用某个对象时，客户端实际上不关心是否调用真正的对象，它只需要一个能够提供一个功能的对象即可，这样就可以使用真实对象的代理来达到使用该功能的目的。

总而言之，只要客户端不能或不想直接访问被调用对象，都可以通过设置代理对象来访问被代理对象的功能，出现这种情况的原因有很多，比如当需要创建一个系统开销比较大的对象或者被调用对象在远程主机上，又或者被调用对象需要增强功能时都可以设置代理。

观察下面一个例子，首先创建了一个图片接口，提供了一个对应的大图片实现类，其中从该实现类的构建方法可知实例化该对象时会有3秒的停顿，其实是为了模拟真实情况下大图片加载所带来的一定时间的花销。如果采用代理模式，直接实例化 BigImage，则系统会产生 3s 延迟，为了避免这种延迟，采用代理模式，新建了一个代理类，ImageProxy，同样实现了 Image 接口，内部有一个Image接口成员，用来指向被代理对象，从 show()方法可看出，当需要使用 show 功能时才会实例化被代理对象，因此系统初始化时实例化代理类不会产生额外的花销。


```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 20, 2019 10:21:32 PM
* @description 图片接口
*/
public interface Image {
	void show();
}

```

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 20, 2019 10:22:02 PM
* @Description 大图片
*/
public class BigImage implements Image {
	public  BigImage() {
		try {
			// 暂停3秒，模拟系统花销
			Thread.sleep(3000);
			System.out.println("图片装载成功");
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void show() {
		System.out.println("绘制大图片");
	}
}

```

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 20, 2019 10:24:45 PM
* @description 图片代理
*/
public class ImageProxy implements Image {
	private Image image;
	
	public ImageProxy(Image image) {
		this.image = image;
	}

	@Override
	public void show() {
		// 只有真正需要用到 show 方法时才会创建被代理对象
		if (image == null) {
			image = new BigImage();
		}
		image.show();
	}
}

```

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 20, 2019 10:43:03 PM
*/
public class ProxyTest {
	public static void main(String[] args) {
		long start = System.currentTimeMillis();
		Image image = new ImageProxy(null);
		System.out.println("系统得到 Image 对象的时间开销: " + (System.currentTimeMillis() - start));
		// 只有真正调用show方法时才会创建被代理对象
		image.show();
	}
}

```
上面运行输出：

```bash
系统得到 Image 对象的时间开销:0
图片装载成功
绘制大图片
```
从结果可知，代理类其实是延迟了被代理对象的实例化，也就是延迟了系统开销，系统开销并不会减少，既然如此，使用代理类的好处是？可以从两个方面来回答该问题：

1.将被代理对象 BigImage 推迟到真正需要时才实例化可以保证前面程序的流畅性，减少 BigImage 在内存中的存活时间，从宏观上来看的确是节省了系统的内存开销。

2.在某些情况下，系统可能永远不会真正调用到 ImageProxy 的 show 方法，意味着系统无需创建 BigImage 对象，从而在一定程序性上避免了系统内1  ··  


存开销。比如在使用对象映射框架 Hibernate 时，Hibernate 的延迟加载就是采用这种这种设计模式，当 A 实体和 B 实体存在依赖关系时，Hibernate 默认启用延迟加载，当系统加载 A 实体时，A 关联的 B 实体并未被加载出来，A 关联的都是 B实体的代理对象，当 A 真正需要访问 B 时，系统才会去数据库抓取 B 实体对应的记录。可见， Hibernate 的延迟加载充分体现了代理模式的优势, 如果不使用代理模式，系统加载 A 时，同时也加载 A 关联的所有实体，这是多么大的一笔开销。 


除了上面处于系统性能考虑使用到代理模式之外，还有一种场景需要用到代理模式，便是需要增强目标对象功能的时候，当目标对象的功能不满足需求时，可以通过代理对象为被代理对象增强功能。借助 Java 提供的 Proxy 和 Invocationhandler，可以实现在运行时生成动态代理的对象，该动态代理对象就可以充当目标对象使用，同时也可增强目标对象的功能。

JDK 只能创建指定接口的动态代理，因此首先创建一个接口：


```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 12:11:59 AM
*/
public interface Man {
	void desc();
	void run();
}
```

创建 Gunman 类实现 Man 接口

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 12:12:48 AM
*/
public class GunMan implements Man{
	@Override
	public void desc() {
		System.out.println("我是男人");
	}

	@Override
	public void run() {
		System.out.println("我奔跑迅速");
	}
}
```

假设客户端需要增强 Gunman 类的功能，比如添加事务控制，在目标方法执行之前开始事务，在目标方法执行之后结束事务。为了实现该功能，可以为目标对象创建一个代理对象，该代理对像实现了目标对象的接口，拥有目标对象的方法，并且增加了事务控制功能。

首先创建一个事务控制类，包括两个方法分别代表开始和结束事务。

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 12:15:35 AM
*/
public class TxUtil {
	public void beginTx() {
		System.out.println("=== 模拟事务开始 ===");
	}
	public void endTx() {
		System.out.println("=== 模拟事务结束 ===");
	}
}
```
创建 InvocationHandler 接口的实现类，该接口的方法 invoke 方法将会作为代理对象的方法实现。通过这种方式，使得代理对象的方法既回调了被代理对象的方法，也为被代理对象的方法增加了事务功能。
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 12:17:04 AM
* @Description 动态处理器
*/
public class MyInvokationHandler implements InvocationHandler{
	// 被代理对象
	private Object target;

	public void setTarget(Object target) {
		this.target = target;
	}
	
	// 当执行动态代理对象方法时，会被替换成执行以下方法
	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		TxUtil tx = new TxUtil();
		// 模拟事务开始
		tx.beginTx();
		// 以 target 作为主调来执行 method 方法
		Object result = method.invoke(target, args);
		// 模拟事务结束
		tx.endTx();
		return result;
	}
}

```

下面的动态代理工厂类将为指定的被代理对象生成动态代理实例，这个动态代理对象与被代理对象实现了相同的接口，当程序调用动态代理对象的公共方法时，实际上将会变成执行 MyInvokationHandler 的 invoke() 方法。
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 12:24:16 AM
* @Description 动态代理工厂
*/
public class MyProxyFactory {
	public static Object getProxy(Object target) throws Exception{
		MyInvokationHandler handler = new MyInvokationHandler();
		handler.setTarget(target);
		return Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), handler);
	}
}
```

测试类
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 12:28:21 AM
*/
public class Test {
	public static void main(String[] args) throws Exception {
		Man target = new GunMan();
		// 指定 target 来创建动态代理对象
		Man manProxy = (Man)MyProxyFactory.getProxy(target);
		manProxy.desc();
		manProxy.run();
	}
}

```
执行main方法，输出：

```bash
=== 模拟事务开始 ===
我是男人
=== 模拟事务结束 ===
=== 模拟事务开始 ===
我奔跑迅速
=== 模拟事务结束 ===
```


#### 策略模式

策略模式用来封装系列算法，这些算法通常被封装在一个被称为 Context 的类中，客户端程序可以自由选择其中一种算法，或者让 Context 为客户端选择一个最佳的算法，使用策略模式的目的是为了支持算法的自由切换。


考虑一种场景，比如网上书店会偶尔进行优惠购书的促销活动，那么网站需要考虑各种打折促销的活动。为了实现这些需求，程序传统做法使用如下方式来实现：

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 11:05:33 PM
*/
public class Discount {
	private final static int VIP_DISCOUNT = 1;
	private final static int OLD_DISCOUNT = 2;
	
	private int discountType;
	
	public int getDiscountType() {
		return discountType;
	}
	public void setDiscountType(int disCountType) {
		this.discountType = disCountType;
	}
	
	public double discount(double price) {
		// 针对不同情况采取不同的算法
		switch (getDiscountType()) {
			case VIP_DISCOUNT:
				return vipDiscount(price);
			case OLD_DISCOUNT:
				return oldDiscount(price);
			default:
				break;
		}
		return 1.0;
	}
	
	public double vipDiscount(double price) {
		return price * 0.5;
	}
	
	public double oldDiscount(double price) {
		return price * 0.7;
	}
}
```

这段程序没有什么问题，但如果继续添加不同种类的折扣，则要至少要修改程序3个地方，首先要添加一个表示折扣种类的常量，然后在 switch 中新增一个case，最后还要添加一个计算新折扣的方法。根据 Java 设计对扩展开放对修改关闭的原则，这段程序显然不符合我们的要求。这种情况下，可以考虑使用策略模式来实现打折促销的功能。


创建一个折扣策略接口
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 11:07:35 PM
*/
public interface DiscountStrategy {
	// 定义一个用于计算打折价的方法
	double getDiscount(double originPrice);
}

```
创建两个策略类
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 11:09:47 PM
*/
public class OldDiscount implements DiscountStrategy{
	@Override
	public double getDiscount(double originPrice) {
		System.out.println("使用旧书折扣...");
		return originPrice * 0.7;
	}
}
```


```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 11:08:18 PM
*/
public class VipDiscount implements DiscountStrategy{
	@Override
	public double getDiscount(double originPrice) {
		System.out.println("使用 VIP 折扣");
		return originPrice * 0.5;
	}
}
```

DiscountContext 类，为用户推荐折扣策略，也允许用户自行选择折扣策略。该 Context 类扮演了决策者的角色，它决定调用那个折扣策略来处理图书打折。

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 11:10:51 PM
*/
public class DiscountContext {
	// 组合一个 DiscountStrategy 对象
	private DiscountStrategy strategy;
	// 构造器，传入一个 DiscountStrategy 对象
	public DiscountContext(DiscountStrategy strategy) {
		this.strategy = strategy;
	}
	
	// 根据实际所使用的 DiscountStrategy 对象得到折扣价
	public double getDiscountPrice(double price) {
		// 如果 strategy 为 null，则自动选择 oldDiscount 方法 
		if (strategy == null) {
			strategy = new OldDiscount();
		}
		return this.strategy.getDiscount(price);
	}
	
	// 提供切换算法的方法
	public void changeDiscount(DiscountStrategy strategy) {
		this.strategy = strategy;
	}
}

```


测试类
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 21, 2019 11:16:17 PM
*/
public class StrategyTest {
	public static void main(String[] args) {
		DiscountContext dContext = new DiscountContext(null);
		double price1 = 100;
		System.out.println("100 元书默认打折后的价格是：" + dContext.getDiscountPrice(price1));
		dContext.changeDiscount(new VipDiscount());
		double price2 = 100;
		System.out.println("100 元书VIP打折后的价格是：" + dContext.getDiscountPrice(price2));
	}
}


```
重新考虑前面的需求，当业务需要新增一种打折类型，系统只需要新定义一个 DiscountStrategy实现类，实现接口的 getDiscount() 方法，用于实现新的折扣算法。当客户端需要改变折扣策略时，使用 DiscountContext 的 changeDiscount() 方法切换为新定义的折扣策略即可。


#### 观察者模式
观察者模式是指在对象之间定义了一对多的依赖关系，当一个对象的状态发生改变时，依赖它的对象(观察者对象)就能收到系统的通知，从而使得观察者对象能够自动更新。

就相当于订阅者模式，发布者发布消息，订阅者订阅了发布者后就能收到通知或提示，比如你在社交平台上关注了某个人，当他/她更新了动态后，你就能收到系统通知。


观察下面例子来了解观察者模式：


首先创建一个观察者接口
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 26, 2019 10:02:21 PM
* @Description 观察者接口，每个观察者都要实现该接口
*/
public interface Observer {
	void update(Observable observer, Object arg);
}
```

被观察者抽象基类，被观察者需要继承该抽象基类，类中提供了注册、删除观察者和通知观察者的方法。
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 26, 2019 10:07:00 PM
* @Description 被观察者抽象基类
*/
public abstract class Observable {
	// List 集合用来保存该对象上所有绑定的事件监听器
	List<Observer> observers = new ArrayList<Observer>();
	
	// 从该主题上注册观察者/订阅者
	public void registObserver(Observer observer) {
		observers.add(observer);
	}
	
	// 从该主题中删除观察者/订阅者
	public void removeObserver(Observer observer) {
		observers.remove(observer);
	}
	
	// 通知该主题上订阅的所有观察者
	public void notifyObservers(Object value) {
		for(Observer observer : observers) {
			// 显示调用每个观察者的 update 方法
			observer.update(this, value);
		}
	}
	
}
```

下面创建了一个具体的被观察类：产品类，有两个属性名称和价格，当其属性改变时，调用抽象基类的通知方法。
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 26, 2019 10:16:10 PM
* @Description 被观察者，产品
*/
public class Product extends Observable{
	private String name;
	private double price;
	
	public Product() {}
	
	public Product(String name, double price) {
		this.name = name;
		this.price = price;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
		notifyObservers(name);
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
		notifyObservers(price);
	}
}

```

具体的观察者，名称观察者，当产品名称发生改变，将收到通知并打印名称消息。
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 26, 2019 10:21:42 PM
* @Description  名称观察者
*/
public class NameObserver implements Observer{
	@Override
	public void update(Observable observer, Object arg) {
		if (arg instanceof String) {
			String name  = (String)arg;
			System.out.println("被观察者"+ observer + "产品名称更改为：" + name);
		}
	}
}

```

具体的观察者，价格观察者，具体的观察者，当产品价格发生改变，将收到通知并打印价格消息。
```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 26, 2019 10:25:41 PM
* @Description 价格观察者
*/
public class PriceObserver implements Observer{
	@Override
	public void update(Observable observer, Object arg) {
		if (arg instanceof Double) {
			System.out.println("被观察者"+ observer + "产品价格改变为：" + arg);
		}
	}
}

```
测试类

```java
/**
* @author Kevin Lau
* @version 创建时间：Mar 26, 2019 10:30:25 PM
* @Description 测试类
*/
public class Test {
	public static void main(String[] args) {
		// 被观察者
		Product product = new Product("手机", 1999);
		// 观察者
		NameObserver nameObserver = new NameObserver();
		PriceObserver priceObserver = new PriceObserver();
		// 向被观察者注册两个观察者对象
		product.registObserver(nameObserver);
		product.registObserver(priceObserver);
		
		product.setName("电脑");
		product.setPrice(4999);
	}
}


```
参考链接：

 - [轻量级Java EE企业应用实战](https://item.jd.com/12327466.html)
 - [罗汉果](https://www.cnblogs.com/luohanguo/p/7825656.html)



