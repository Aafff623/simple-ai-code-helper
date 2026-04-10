# Java 基础⾯试题速记通关版 _ ⾯试刷题 mianshiya.com

本资源来自面试鸭：https://www.mianshiya.com

推荐更多免费学编程资源：

1.编程导航学习网站：学编程、做项目、拿Offer！

2.企业高频面试题库：开始刷题，面试遇原题！

3.精选简历模板大全：1分钟搞定简历！

4.AI资源导航网站：获取最新AI黑科技！

5.1对1模拟面试：随时随地提升面试能力

# 你使⽤过哪些JDK提供的⼯具？

JDK⾃带的⼯具其实是⽇常排查问题的利器，很多场景下压根不需要额外依赖第三⽅⼯具。

jps相当于Java版的ps，能快速列出当前机器上所有正在运⾏的Java进程PID。排查多实例部署时特别有⽤，⼏秒钟就能定位到⽬标进程。

jstat是看JVM运⾏状态最轻量的⽅式，尤其是监控GC频率和堆内存变化。⽐如想确认是不是频繁FullGC，⽤jstat -gcutil <pid> 1000 每秒打⼀次数据，趋势⼀⽬了然。

jstack对应线程分析，定位死锁或⾼CPU很直接。拿到进程PID后执⾏ jstack <pid> ，输出的线程栈⾥如果看到WAITING状态集中在某个锁对象，基本就能锁定问题点。线上服务响应卡顿，第⼀反应就是抓threaddump看有没有线程堆积。

jmap 可以导出堆内存快照，配合 jhat 或 MAT 分析内存泄漏。不过要注意的是， jmap -dump 在堆⼤的时候会触发⻓时间STW，⽣产环境得谨慎操作。

其实从JDK8开始，Arthas虽然是阿⾥开源的，但已经成了事实标准。它把上⾯这些命令都整合了，还能动态trace⽅法调⽤、watch参数返回值，排查线上问题效率提升⾮常明显。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/f3f78875ae390d451c9d49fd59454ccec7a3c1a0128caf62aecf6a5dd3c87fcd.jpg)


什么是 Selector？

Selector是JavaNIO⾥⽤来做事件监听的核⼼组件，⼀个线程通过它就能同时监控多个通道的I/O状态，⽐如有没有数据可读、能不能写⼊。

你想想，传统 IO ⼀个连接就得占⼀个线程，1000 个连接就得分 1000 个线程去处理，系统压根扛不住。⽽⽤了Selector，⼀个线程轮询多个Channel的就绪事件，资源利⽤率直接拉满，这就是为什么Netty、Dubbo这些⾼性能中间件底层都靠它撑着。

每个 Channel 注册到 Selector 上时得绑定⼀个 SelectionKey，表⽰“我对哪些事件感兴趣”，⽐如 OP_READ、OP_WRITE。调⽤select()⽅法后，线程会阻塞直到有⾄少⼀个通道就绪，然后返回就绪的key集合，挨个处理就⾏。


代码上⼤概是这样：


Selector selector $=$ Selector.open();   
channel.configureBlocking(false);   
channel.register(selector,SelectionKey.0P_READ);   
while(true）{ int readyChannels $\equiv$ selector.select();//阻塞等待就绪事件 if（readyChannels $\equiv = 0$ ）continue; Set<SelectionKey> keys $=$ selector.selectedKeys(); for（SelectionKeykey：keys）{ if(key.isReadable()）{//处理读\*/} keys.remove(key); }   
1

注意⾮阻塞模式是前提，阻塞IO调了select()也没意义。另外select()返回的是就绪的通道数，不是所有注册的。整个模型叫多路复⽤，Linux上实际是epoll在背后⼲活。

# 什么是 Channel？

Channel是JavaNIO的核⼼组件，可以看作是数据传输的通道，负责从缓冲区读写数据。它和传统的IO流不同，Channel是双向的，既能读也能写，⽽流⼀般是单向的。

1）常⻅的 Channel 实现有 FileChannel、SocketChannel、ServerSocketChannel 和 DatagramChannel。⽐如Netty就基于NioSocketChannel做⽹络通信，⽤统⼀的抽象屏蔽底层差异。

2）Channel本⾝不直接操作数据，数据总是流向Buffer。读数据时，数据从Channel进⼊Buffer；写数据时，数据从Buffer写⼊Channel。这种设计让数据处理更灵活，也便于零拷⻉技术的应⽤。

3）在⾼并发场景下，Channel配合Selector实现多路复⽤。⼀个线程就能监控多个Channel的事件，⽐如连接就绪、读就绪，避免为每个连接开线程，扛住⼏万并发连接很常⻅。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/01a9e76d0d3bff0425f26737d7efd66e57cd682ed614db794f1bba89f07888d4.jpg)


使⽤时要注意，Channel必须配置为⾮阻塞模式才能注册到Selector，否则会抛异常。另外，关闭Channel会释放对应的⽂件描述符，这个资源很宝贵，Linux下⼀般默认最多1024个，⽤完就得调优。

# 如果⼀个线程在Java中被两次调⽤start()⽅法，会发⽣什么？

调⽤ start() ⽅法的本质是让JVM将线程加⼊调度队列，真正触发 run() 的执⾏。线程的状态机决定了它只能从NEW状态被启动⼀次。

1）第⼀次调⽤ start() ，线程状态从 NEW 变为 RUNNABLE，等待 CPU 调度执⾏ run() ⽅法。

2）第⼆次再调⽤ start() ，JVM会检查线程当前状态，发现已经不是NEW，直接抛出IllegalThreadStateException 。

这个异常是运⾏时异常，不强制捕获，但⼀旦发⽣程序就会中断。常⻅于误把线程对象当⼯具复⽤，⽐如在循环⾥反复启动同⼀个线程。

```txt
Thread t = new Thread() -> System.out.println("hello");  
t.start();  
t.start(); // 这里炸了
```

正确做法是每次都需要新线程，就得new⼀个新实例，或者⽤线程池管理⽣命周期。像ThreadPoolExecutor这种，你submit任务，它背后复⽤worker线程，不会出现重复启动的问题。

根本原因在于Thread类的设计就是“⼀次性”的，run⽅法执⾏完，线程⽣命周期就结束了，不能回退到NEW状态重来。

# Java 的 Optional 类是什么？它有什么⽤？

Optional其实是Java8引⼊的⼀个容器类，⽤来包装可能为null的值。它的核⼼意图不是消灭null，⽽是让开发者明确表达“这⾥可能没有值”，从⽽减少空指针异常。

⽤ Optional 后，⽅法返回类型会直接告诉调⽤⽅：这个结果可能不存在。⽐如 Optional<String> ⽐ String更清晰地传达语义，避免隐式null带来的误解。

常⻅⽤法有⼏种： 1）构建 Optional： Optional.of(value) ⽤于⾮ null 值，Optional.ofNullable(value) 可处理 null。 2）取值： orElse(default) 提供默认值， orElseThrow()在⽆值时抛异常。3）链式操作： map() 对值进⾏转换， filter() 进⾏条件过滤，都不⽤担⼼NPE。

```cpp
Optional<String> name = Optional.ofNullable(getName());  
String result = name.map(String::toUpperCase)  
    .otherwise("UNKNOWN"); 
```

但别滥⽤。Optional不该⽤在集合元素⾥，也不该作为类字段⸺它不是序列化的友好选择。像Guava早期就有类似设计，但Java8的标准库⽀持让它成了主流做法。

它更适合⽤在⽅法返回值上，尤其是⼯具类或查找⽅法，⽐如 findUserById() 返回 Optional<User> ，调⽤⽅⾃然知道要处理“找不到”的情况。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/0ef8c30989961916fb4df914f0db2cce6d37dd2f851e1d6d0120433a99593c80.jpg)


# Java 的 I/O 流是什么？

Java的I/O流本质上是数据传输的抽象模型，把数据的输⼊输出看作“流动”的字节或字符。它不关⼼数据源具体是⽂件、⽹络还是内存，只关注“从哪来、到哪去”这个流动过程。

输⼊流负责读，输出流负责写。字节流处理8位的原始⼆进制数据，⽐如图⽚、视频，⽤ InputStream 和OutputStream 这两个抽象基类。字符流则⾯向⽂本，⾃动处理编码转换，基于 Reader 和 Writer ，适合读写字符串。

实际开发中不会直接⽤这些顶层抽象类，⽽是组合具体实现。⽐如要⾼效读⽂件，会⽤ BufferedInputStream 包⼀层 FileInputStream ，缓冲机制能减少系统调⽤次数，提升性能。⽹络通信⾥常⻅的 ObjectOutputStream就是⽤来序列化对象发到远端。

1）字节流处理⼆进制，⽐如 FileInputStream 读图⽚

2）字符流处理⽂本，避免乱码，⽐如 InputStreamReader 转换编码

3）装饰器模式很关键， Buffered 、 Data 、 Object 这些都是增强功能

举个例⼦，读⼀个UTF-8⽂本⽂件：

```rust
try (var br = new BufferedReader(   new InputStreamReader(   new FileInputStream("data.txt"), "UTF-8")) ) { br-lines(   ).forEach(System.out::println); } 
```

现在更推荐⽤ NIO 的 Files.newBufferedReader(Paths.get("data.txt")) ，⼀⾏搞定，底层⾃动处理编码和缓冲。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/e31d08416574afab2180ade1632fb631c67eebe4ef3a0bacfb742b04caf31bd5.jpg)


# Java中的基本数据类型有哪些？

Java的基本数据类型⼀共8种，是构建程序的最基础单元。它们直接存储值，不涉及对象引⽤，性能⾼，⽤起来也简单。

# 整数类型有4种：

1） byte ：1字节，范围-128到127，适合节省内存的场景，⽐如数组⾥存⼤量⼩数字。

2） short ：2字节，范围-32768到32767，⽤得不多，偶尔在⽂件格式或⽹络协议⾥⻅。

3） int ：4字节，最常⽤，⼀般循环计数、数学计算都⽤它。

4） long ：8 字节，⼤数才⽤，⽐如时间戳 System.currentTimeMillis() 返回的就是 long。

浮点类型2种：

5） float ：4 字节，单精度，声明时要加 f，⽐如 3.14f ，科学计算或图形处理可能⽤到。

6） double ：8字节，双精度，⽇常⼩数计算的主⼒，⽐如 3.14 默认就是double。

字符类型1种：

7） char ：2 字节，存 Unicode 字符，⽐如 'a' 或 '汉' ，本质是⽆符号整数，可以做加减。

布尔类型 1 种：

8） boolean ：真假值，只有 true 和 false ，控制逻辑分⽀，JVM 内部其实⽤ 1 字节实现，虽然理论上只需要1 位。

这些类型对应各⾃的包装类，⽐如 Integer 、 Boolean ，⽤在集合或者需要 null 的场景。但⾃动装箱拆箱有性能损耗，⾼频场景要⼩⼼。

# 什么是Java中的⾃动装箱和拆箱？

Java⾥的⾃动装箱和拆箱，其实就是编译器在基本类型和对应的包装类之间⾃动转换的语法糖。你写代码的时候不⽤⼿动调 Integer.valueOf() 或 .intValue() ，但底层其实都给你处理了。

1）⾃动装箱是指把基本类型转成包装对象，⽐如 Integer $\dot { \textbf { 1 } } = \textbf { 1 0 0 }$ ; 这⾏代码，编译后其实是 Integer i =Integer.valueOf(100); 。这⾥有个关键点， valueOf 在 -128 到 127 范围内会⽤缓存对象，所以这个区间内的Integer ⽐较可以⽤ $= =$ ，超出就得⽤equals。

2）拆箱反过来，是从包装类取基本值，像 int ${ \begin{array} { l } { { \dot { \mathrm { ~  ~ j ~ } } } } \end{array} } =$ new Integer(100); 会被编译成调⽤ intValue() 。但如果对象是null，拆箱时就会抛出 NullPointerException ，这种空指针问题在集合操作⾥特别容易踩坑。

```java
List<Integer> list = new ArrayList<>();  
list.add(100); // 装箱  
int value = list.get(0); // 拆箱，如果 get 出 null 就 NPE
```

这种机制⽤起来⽅便，但在⾼频循环或性能敏感场景要⼩⼼，频繁创建包装对象会增加GC压⼒。像Kafka、Netty这些⾼性能中间件⾥，能⽤primitive就不⽤wrapper，就是这个道理。

# Java 中 for 循环与 foreach 循环的区别是什么？

Java⾥的for和foreach看似都能遍历，但底层机制和适⽤场景其实有挺⼤差别。

1）传统for循环靠索引控制，你得⾃⼰管理下标，适合需要访问索引的场景。⽐如你想处理数组中偶数位的元素，或者反向遍历，这时候⽤for更直接。

```javascript
for (int i = 0; i < arr.length; i++) { System.out.println(arr[i]); } 
```

2）foreach（增强 for）本质是 迭代器 的语法糖，编译后会转成 Iterator 的 hasNext() 和 next() 调⽤。它屏蔽了索引细节，代码更简洁，也避免越界错误。但正因为没有索引，你没法在遍历过程中修改集合（⽐如remove不通过迭代器会抛 ConcurrentModificationException）。

```txt
for (String s : list) {
    System.out.println(s);
} 
```

3）性能上，数组类型两者基本没差，JVM会优化。但对 ArrayList 这种实现了RandomAccess的集合，for通过get(i) 访问很快。⽽ LinkedList ⽤ foreach 更好，因为每次 get(i) 都要从头遍历， ${ \mathsf { O } } ( { \mathsf { n } } ^ { 2 } )$ 的代价，压根不推荐。

4）foreach不能⽤于需要并发修改的场景，也不能做条件跳步（⽐如 $\mathrm { i } + = 2$ ）。遇到这些情况，⽼⽼实实⽤传统for或显式迭代器。

总的来说，能⽤foreach就⽤，代码⼲净安全。需要索引或复杂控制逻辑时，再切回for。

# 你使⽤过Java的反射机制吗？如何应⽤反射？

Java反射这东西，平时写业务代码可能不常碰，但框架⾥到处都是它的影⼦。你⽤Spring的时候，那个@Autowired 注⼊、 @RequestMapping 映射，底层全靠反射搞定。

1）运⾏时动态操作类是反射的核⼼能⼒。⽐如你有个字符串 "com.example.User" ，想在程序跑起来之后创建这个类的实例，常规的new是做不到的，因为编译时根本不知道具体类型。这时候Class.forName加newInstance（或者现在的 getDeclaredConstructor().newInstance()）就能派上⽤场。

2）访问私有成员也是常⻅⽤途。单元测试⾥有些private⽅法要测，或者像某些⼯具类需要绕过访问限制，通过setAccessible(true)就能强⾏读写。不过这招别乱⽤，破坏了封装性，维护起来头疼。

3）典型的场景就是ORM框架。像MyBatis处理结果集映射时，查出⼀⾏数据，它得知道怎么塞进User对象的字段⾥。通过反射拿到ResultMap定义的属性名，再找对应的setter或字段直接赋值，完全不⽤提前写死转换逻辑。

```javascript
Class<> clazz = Class.forName("com.example.User"); Object obj = clazz.getDeclaredConstructor().newInstance(); Field field = clazz.getDeclaredField("name"); field.setAccessible(true); field.set(obj, "John"); 
```

性能⽅⾯，反射⽐直接调⽤慢个⼏倍到⼏⼗倍，关键路径上频繁使⽤会拖垮系统。所以像JSON解析库（如Jackson）会在⾸次反射后缓存Method/Field引⽤，后续复⽤提升效率。

要不要⽤？框架作者躲不开，业务开发尽量少碰。真要⽤，记得做缓存，别让反射成为瓶颈。

# 什么是Java中的继承机制？

Java⾥的继承，说⽩了就是⼦类可以拿⽗类的属性和⽅法来⽤，不⽤重复写。⼀个类只能继承⼀个⽗类，这是单继承，靠的是 extends 关键字。

1）⼦类会⾃动拥有⽗类的⾮私有字段和⽅法。⽐如你写个 Animal 类有 eat() ⽅法， Dog extends Animal就可以直接调⽤ eat() 。

2）构造过程是先跑⽗类构造器，再跑⼦类的。如果你没⼿动调 super() ，编译器会⾃动插⼀句 super() 在⼦类构造器第⼀⾏。

3）⽅法重写（Override）是重点。⼦类可以改写⽗类的⽅法逻辑，但签名得⼀样。加个 @Override 注解能防⽌你写错签名，也⽅便别⼈看。

```groovy
class Animal {
    void sound() { System.out.println("叫了一声"); }
}  
class Dog extends Animal {
    @Override
    void sound() { System.out.println("汪汪"); }
}
```

多态也是基于继承来的。你⽤ Animal a $=$ new Dog() 这种写法，调 a.sound() 实际执⾏的是 Dog 的版本，这就是运⾏时动态绑定。

不过别滥⽤继承。⽗类⼀改，⼦类可能就出问题。⼀般来说，is-a关系才考虑继承，⽐如 Dog is an Animal 。要是只是想复⽤代码，优先⽤组合，不然后期搞不定。

# Java中的访问修饰符有哪些？

Java ⾥的访问修饰符主要就四个： private 、 default （也叫包访问权限）、 protected 和 public 。它们控制的是类、⽅法、变量这些成员能被访问的范围。

1） private 最严格，只能在定义它的那个类内部访问，别的类哪怕同⼀个包都不⾏。

2） default 是不写任何修饰符时的默认⾏为，同⼀个包内的类可以访问。跨包就不⾏，哪怕继承也不管⽤。

3） protected ⽐ default 宽⼀点，同⼀个包⾥的类能访问，不同包的⼦类也能访问，这是它和 default 的关键区别。

4） public 最开放，谁都能访问，不管是不是同⼀个包，也不管有没有继承关系。

举个例⼦，你在写⼀个⼯具类的时候，核⼼算法可能⽤private封装起来，只暴露public的调⽤⽅法；⽽在继承体系⾥，⽗类想让⼦类⽤某个⽅法但⼜不想对外公开，就会⽤protected。

<table><tr><td>修饰符</td><td>同一类</td><td>同一包</td><td>不同包子类</td><td>不同包非子类</td></tr><tr><td>private</td><td>✓</td><td>×</td><td>×</td><td>×</td></tr><tr><td>default</td><td>✓</td><td>✓</td><td>×</td><td>×</td></tr><tr><td>protected</td><td>✓</td><td>✓</td><td>✓</td><td>×</td></tr><tr><td>public</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr></table>

这个表格记熟了，基本就不会搞混了。实际开发中，优先缩⼩访问范围，能⽤private就不⽤public，这是封装的基本原则。

# Java中静态⽅法和实例⽅法的区别是什么？

静态⽅法属于类本⾝，直接通过类名调⽤，不依赖任何实例。实例⽅法则必须在对象创建后才能调⽤，它能访问当前实例的成员变量。

1）内存分配时机不同。静态⽅法随着类加载就存在了，实例⽅法得等 new 出对象后才可使⽤。⽐如 Math.max()是静态的，不⽤newMath对象就能⽤。

2）访问权限有区别。静态⽅法只能直接访问静态成员，不能⽤this或super，也不能访问实例变量。实例⽅法啥都能访问。写⼯具类时常⽤ static，像 Collections.sort(list) 。

3）多态性表现不⼀样。实例⽅法⽀持重写，运⾏时动态绑定，⽗类引⽤指向⼦类对象能调⽤⼦类实现。静态⽅法没有这回事，它是编译期绑定的，⼦类定义同名静态⽅法只是隐藏⽗类的，不会发⽣动态分派。

```java
class Parent {
    static void say() { System.out.println("Parent static"); }
    void speak() { System.out.println("Parent instance"); }
}  
class Child extends Parent {
    static void say() { System.out.println("Child static"); } // 隐藏，非重写
    void speak() { System.out.println("Child instance"); } // 重写
```

调⽤ new Child().speak() 输出 "Child instance"，⽽ Parent.say() 或 Child.say() 只看左边声明类型，和对象⽆关。

⼀般⼯具⽅法、⼯⼚⽅法⽤静态，业务⾏为、需要状态的操作⽤实例。搞不定选型时问⾃⼰：这个⽅法要不要依赖对象的状态？要就上实例⽅法。

# JDK和JRE有什么区别？

JDK是给开发者⽤的，它⾥⾯不仅包含了写Java代码需要的编译器、调试⼯具，还打包了JRE。你可以把它看作⼀个完整的开发套件。

JRE则是运⾏Java程序的基础环境，它包含JVM和运⾏时需要的核⼼类库。⽐如你只是想跑⼀个别⼈写好的.jar⽂件，装JRE就够了，不需要编译功能。

所以关键在于⽤途不同：开发选 JDK，纯运⾏选 JRE。

打个⽐⽅，JDK像是整套厨房设备，有⼑具、灶台、调料（编译、调试、运⾏全都有），⽽JRE只是⼀个微波炉，负责把做好的饭菜热⼀下（只负责运⾏）。

现在主流的 JDK 发⾏版，像 OpenJDK、Oracle JDK 或者国内常⽤的 Alibaba Dragonwell，其实都⾃带了 JRE，安装后可以直接编译也能直接运⾏程序。

1）JDK 包含 JRE，JRE 包含 JVM

2）没有JDK也能运⾏Java程序，只要有JRE

3）javac命令在JRE中不可⽤，因为它属于编译⼯具，只存在于JDK

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/e518feda98638a09957c4bcee0abc018ea6c74943397c46641c35c8a9bafc40e.jpg)


⾯试如果问到，记住⼀句话就⾏：JDK是开发环境，JRE是运⾏环境。

# Java 中 wait() 和 sleep() 的区别？

wait() 和 sleep() 看起来都是让线程“停下来”，但它们的使⽤场景和底层机制完全不同。

1） wait() 是 Object 的⽅法，调⽤后线程会释放持有的监视器锁（monitorlock），进⼊等待队列，直到其他线程执⾏ notify() 或 notifyAll() 才能被唤醒。它必须在 synchronized 块或⽅法中使⽤，否则会抛出IllegalMonitorStateException 。

```javascript
synchronized(obj）{ obj.wait();//释放锁，进入等待 }
```

2） sleep() 是 Thread 类的静态⽅法，它只是让当前线程暂停指定时间，不释放任何锁。时间⼀到，线程进⼊就绪状态等待CPU调度。

```txt
try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } 
```

关键区别在于锁的释放与协作机制。 wait() 是线程间通信的⼀部分，常⽤于⽣产者-消费者模式，配合notify() 实现线程协作。⽽ sleep() 更像是“我先歇会⼉”，跟同步⽆关。

还有⼀点， wait() 可以被外部唤醒， sleep() 虽然也能被中断，但需要捕获 InterruptedException ，并且不会⾃动重新获取锁。

所以别搞混了，想做线程协调，⽤ wait()/notify() ；只想暂停⼀下，⽤ sleep() 就⾏。

# PO、VO、BO、DTO、DAO、POJO 有什么区别？

这⼏个对象在分层架构⾥各司其职，搞清楚它们的职责边界，代码才不会乱成⼀锅粥。

PO是跟数据库表直接对应的实体类，字段和表列⼀⼀对应，⼀般⽤于ORM框架⽐如MyBatis或JPA。它待在持久层，不往外传。

DTO 是⽤来传输数据的，跨服务或跨层传递时⽤。⽐如 Controller 和远程接⼝之间，字段可能⽐ PO 少，也可能组合了多个表的数据，⽬的就是减少⽹络传输量。

VO⼀般是给前端展⽰⽤的，可能聚合了⽤户信息、订单状态、商品详情等，结构完全为⻚⾯定制。⽐如⼀个订单详情⻚要显⽰⽤户名、地址、物流进度，VO就把这些都打包好。

BO承担业务逻辑，可能包含⼀些计算⽅法或流程控制。⽐如OrderBO可能有 calculateDiscount() 或isOverdue() 这种带⾏为的对象，通常在 service 内部流转。

DAO 是数据访问对象，专⻔负责操作数据库，⽐如 UserDao 定义了 insertUser() 、 findByPhone() 等⽅法。它是个接⼝或类，⼲的是和DB交互的脏活累活。

POJO是最普通的Java对象，不依赖任何框架接⼝，上⾯这些对象本质上都是POJO，只要没继承特殊类、没实现框架接⼝，就是POJO。

1）PO 数据库映射

2）DTO 跨层数据搬运

3）VO 前端视图组装

4）BO 业务逻辑承载

5）DAO 操作数据库的⽅法集合

6）POJO 所有普通Java对象的统称

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/f22c0b7c483db25baad6093fd8912a09343711c13ee9be48318406f3d80f72f2.jpg)


# 你认为Java的优势是什么？

Java的优势其实体现在⼯程落地的稳定性上，尤其适合⼤型复杂系统。

⾸先，JVM是它的核⼼护城河。⼀次编写，到处运⾏不是⼝号，是实打实的⽣产⼒保障。你写的服务在开发机跑得好好的，扔到线上⼤概率还是稳的，不⽤操⼼底层操作系统差异带来的诡异问题。

类库⽣态也成熟得离谱。从Spring全家桶做Web服务，到Netty写⾼性能通信，再到Kafka、Flink这些⼤数据组件，清⼀⾊Java栈。公司⾥搞个微服务，SpringBoot加⼏个starter就能快速搭起来，省了多少脏活累活。

1）内存管理⾃动搞定，GC虽然偶尔会停顿，但G1、ZGC这些新收集器已经能把暂停压到毫秒级甚⾄更低

2）并发编程有完整的⼯具链，ConcurrentHashMap、CompletableFuture、ForkJoinPool 都是实战利器

3）语⾔本⾝虽不算炫，但泛型、注解、Lambda这些该有的都有，代码可读性和维护性拿捏住了

企业级应⽤⾥，Java拿来就能扛住⾼并发场景。像阿⾥早期的交易系统、银⾏的核⼼账务，都是靠Java堆出来的。不是它完美，⽽是整个技术闭环太完整，从诊断（jstack、jmap）、监控（Micrometer）、部署到调优，⼯具链⼀套接⼀套。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/2bae3b899d6f3ff1b4f37299b1f6b87ccce7a5c133dca203c24beffbdbd62836.jpg)


# Java21有哪些新特性？

Java21是⼀个⻓期⽀持（LTS）版本，带来了不少实⽤的新特性，主要集中在语法简化、性能提升和底层机制增强。

1）虚拟线程是最⼤亮点。它属于ProjectLoom的成果，把并发编程从“每个请求⼀个线程”切换到“成千上万协程共享少量OS线程”。以前⽤Tomcat线程池扛1万并发都吃⼒，现在⽤虚拟线程轻松应对。写法也简单，⼏乎不⽤改代码。

```txt
Thread.startVirtualThread() -> System.out.println("运行在虚拟线程");
```

2）结构化并发处于孵化阶段，配合虚拟线程使⽤。它让多个⼦任务的⽣命周期统⼀管理，异常传递更清晰，适合批处理或分⽚查询场景。

3）记录模式（RecordPatterns）和数组解构是模式匹配的进⼀步落地。以前要写⼀堆if-elseinstanceof判断再拆字段，现在可以直接匹配数据结构。

```txt
if (obj instanceof Point(int x, int y)) { System.out.println(x + "", " + y); } 
```

4）字符串模板（ STR ）是预览功能，取代繁琐的 String.format 或 StringBuilder 拼接。写 SQL 或 JSON 组装时特别顺⼿。

```txt
String name = "Alice"; System.out.println(STR."Hello \{name\})；//Hello Alice 
```

这些特性⾥，虚拟线程对系统吞吐量影响最⼤。像WebFlux这类响应式框架的部分压⼒其实来⾃回调复杂性，⽽虚拟线程⽤同步代码就能写出⾼并发服务，直接降低⼼智负担。

要不要升级？如果你的应⽤是典型的I/O密集型，⽐如⽹关、微服务接⼝层，升级后可能不改代码就提升3-5倍QPS。但计算密集型服务收益就不明显。

# Java⽅法重载和⽅法重写之间的区别是什么？

⽅法重载和重写看起来都是“同名不同义”，但它们的使⽤场景和底层逻辑完全不同。

1）⽅法重载发⽣在同⼀个类⾥，靠的是参数列表的不同。⽐如 Math.max(int, int) 和 Math.max(double,double) ，返回类型可以不⼀样，但光靠返回类型不同是搞不定重载的。它在编译期就决定了调⽤哪个⽅法，属于编译时多态。

2）⽅法重写是⼦类对⽗类⽅法的覆盖，要求⽅法名、参数列表、返回类型都⼀致（⼦类返回类型可以是⽗类的⼦类型），⽽且访问权限不能更严格。它是运⾏时才确定调⽤哪个版本，⽐如 ArrayList.toString() 覆盖了Object.toString() ，这就是运⾏时多态的体现。

代码上看：

```dart
class Parent {
    void show() {}
}  
class Child extends Parent {
    @Override
    void show() {} // 重写
}
```

重载更像是⼀个类内部的多个同名⼯具⽅法，像 Arrays.sort() 就有好⼏种参数形式；⽽重写是为了实现多态，让 List<String> list $=$ new ArrayList<>() 调⽤ list.add() 时，实际执⾏的是 ArrayList 的逻辑。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/e8053e46bf011e126399d8feca8a3606462a5267fdef50f8bcbd8becb95841a8.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/e80114fbe2064e93555e6a6164771b0d508ebb2b3eee3c9fc6203e0b9c167c80.jpg)


# Java17有哪些新特性？

Java17是⼀个⻓期⽀持（LTS）版本，直接从Java11跳过来的，所以积累了不少实⽤更新。重点不是语法⼤改，⽽是让代码更安全、更简洁、运⾏更⾼效。

# 1）密封类（Sealed Classes）

想限制⼀个类只能被指定的⼏个⼦类继承，⽤ sealed 关键字就⾏。以前靠⽂档约定，现在编译器能强制校验。⽐如你定义 Shape 只能由 Circle 、 Rect 实现，别的类继承直接报错。

```txt
public sealed interface Shape permits Circle, Rect {}  
public record Circle(double r) implements Shape {}  
public final class Rect implements Shape {} 
```

# 2）switch 模式匹配（预览功能）

虽然Java17还是预览版，但已经能看出趋势。以前switch⾥要先判断类型再强转，现在⼀步到位。

switch(obj）{ case Strings->System.out.println("字符串：" $^+$ s); caseIntegeri->System.out.println("数字：" $^+$ i); default->System.out.println("其他");   
}

3）移除了AppletAPI，彻底跟⽼旧浏览器插件说再⻅。同时ZGC和Shenandoah在这个版本已经可⽤，⼤堆内存（⽐如 1TB）下也能把 GC 停顿压到 10ms 以内，适合对延迟敏感的服务。

4）默认启⽤弹性元空间，减少 Full GC 中元空间回收的开销。底层实现上，把很多原来⽤ ${ \mathsf { C } } { + } { + }$ 写的脏活累活交给了Java，维护起来更⽅便。

总的来说，Java17更像是“成熟期”的⼀次加固，密封类和模式匹配这些特性，都在引导你写出更可读、更少出错的代码。升级后⼀般不需要改业务逻辑，但能明显提升系统稳定性和可维护性。

# Float经过⼀系列的操作后(加减乘除)，如何判断是否和另⼀个数相等呢？

浮点数相等判断是个经典坑，根本原因在于⼆进制⽆法精确表⽰所有⼗进制⼩数。⽐如 0.1 在⼆进制⾥是⽆限循环的，存的时候就存在舍⼊误差，经过⼏次运算后误差累积，直接⽤ $= =$ 判断等于基本会翻⻋。

解决办法是⽤“误差范围”来判断，也就是看两个数的差值是否⾜够⼩。这个⾜够⼩的值通常称为epsilon，Java⾥可以借助 Math.ulp() 或者直接定义⼀个极⼩阈值。

```txt
float a = 0.1f * 3;  
float b = 0.3f;  
// 错误做法  
// if (a == b) // 可能为 false  
// 正确做法  
if (Math.abs(a - b) < 1e-6) {  
    // 认为相等  
}
```

实际业务中，⾦融计算压根不会⽤ float 或 double ，⽽是上 BigDecimal 。像⽀付宝、银⾏系统这些对精度要求⾼的场景，都是 BigDecimal 在扛住，因为它是基于⼗进制的精确计算。

有个细节是， 1e-6 这种阈值不是万能的，对于很⼤或很⼩的数值可能不适⽤。更稳妥的做法是结合相对误差：

```java
public static boolean floatEquals(float a, float b) { return Math.abs(a - b) <= Math.max(Math.ulp(a), Math.ulp(b)); } 
```

总之，浮点数判等别⽤ $= =$ ，要么⽤误差容忍⽐较，要么直接上 BigDecimal 做精确计算。

Java25是⼀个短期⽀持版本（仅维护半年），更多是为⻓期版本探路，真正值得关注意的是它背后的实验性功能和语⾔演进⽅向。

# 1）虚拟线程（Virtual Threads）进⼊第⼆轮预览

这是ProjectLoom的核⼼成果，⽬标是让⾼并发编程变得简单。传统线程成本⾼，每个线程占⽤MB级栈内存，最多开⼏万条就到头了。⽽虚拟线程由JVM调度，轻量到可以同时跑百万级，像Tomcat的NIO处理模型可以直接⽤同步代码写出来。

```txt
Thread.startVirtualThread((   ) -> System.out.println("Hello, Loom")); 
```

# 2）未命名变量和模式（Unnamed Variables and Patterns）

当你写模式匹配或lambda时，有些变量根本不⽤命名，⽐如只关⼼集合结构不关⼼内容，现在可以⽤下划线 _ 占位，代码更⼲净。

```c
if (obj instanceof String_) { /* 只判断类型 */ }
```

# 3）外部函数与内存 API（Foreign Function & Memory API）再次孵化

允许Java直接调⽤native库，替代⽼旧的JNI。你可以像Go或Rust那样操作堆外内存、调⽤C函数，性能更好且更安全。⽐如⽤这个API调SQLite原⽣接⼝，延迟能压到微秒级。

4）其他⼩更新包括：ZGC⽀持提前终⽌、权限默认禁⽤、record类扩展等，但都不是⽣产级强需求。

真正影响深远的是虚拟线程，⼀旦稳定，整个中间件⽣态都会重构，像Netty、SpringWebFlux的异步模型可能会被同步 $^ +$ 虚拟线程取代。⽬前建议在测试环境试⽔，别直接上⽣产。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/69244ae8c8ea4e9345ca4a68c398d87f57daf4e89ddd13b28d2016733d49b9c9.jpg)


Java11是⼀个⻓期⽀持（LTS）版本，直接接替Java8，带来不少实⽤改进。它不光是语法升级，更多是精简和增强平台能⼒。

# 1）HTTP Client 标准化

原⽣ HttpClient ⽀持同步异步请求，WebSocket 也⼀并⽀持。以前得靠第三⽅库⽐如 OkHttp，现在 JDK ⾃带就能⼲。

```txt
HttpClient.newHttpClient() .sendAsync(request,BodyOperators.ofString()) .thenApply(Response::body) .thenAccept(System.out::println); 
```

# 2）字符串操作更顺⼿

String 新增了 isBlank() 、 lines() 、 strip() （⽐ trim 更智能，处理 Unicode 空格）、repeat(n) 。⽇常处理⽂本省了不少事。

# 3）⽂件读写⼀⾏搞定

Files.readString() 和 Files.writeString() ⽀持 UTF-8 编码的⼀次性读写，⼩⽂件场景不⽤再套BufferedReader 套路了。

```javascript
String content = Files.readString(Path.of("data.txt")); 
```

# 4）运⾏单⽂件源码

可以直接 java HelloWorld.java 运⾏，不⽤先 javac 。适合脚本类场景或教学演⽰，开发调试更轻量。

# 5）ZGC 初登场

虽然ZGC在Java11还是实验性功能，但它主打“低延迟”，⽬标是停顿时间不超过10ms，能扛住TB级堆内存。后来在 Java 15 转正。

# 6）移除部分旧内容

彻底移除了 Java EE 和 CORBA 模块（⽐如 javax.xml.ws ），官⽅明确这些技术已经过时，推荐⽤ Spring Boot 或Micronaut 替代。

总的来说，Java11把实⽤性和现代化推进了⼀⼤步，尤其是HTTP客户端和字符串API，基本成了新项⽬的标配底座。

# JavaObject类中有什么⽅法，有什么作⽤？

每个Java类都默认继承Object，它提供的⽅法是JVM和语⾔层⾯协作的结果。这些⽅法构成了对象⾏为的基础，像equals、hashCode 这种在集合类⾥天天⽤。

1） equals(Object obj) 判断两个对象是否逻辑相等。默认实现是 $= =$ ⽐较，但像 String、Integer 都重写了它，按值⽐较。注意要满⾜⾃反、对称、传递等特性。

2） hashCode() 返回对象的哈希码。散列表⽐如HashMap、HashSet就靠它定位桶位置。重写equals时必须重写hashCode，不然HashMap⾥可能找不到你存的对象。

3） toString() 返回对象的字符串表⽰。打印对象或字符串拼接时⾃动调⽤。建议所有类都重写它，不然输出像java.lang.Object@6504e3ll ，看不出内容。

4） clone() 创建并返回对象的拷⻉。要实现Cloneable接⼝，否则抛异常。浅拷⻉只复制基本类型和引⽤地址，深拷⻉得⾃⼰递归处理。

5） getClass() 返回运⾏时类对象，final ⽅法不能被重写。它是反射的⼊⼝，⽐如 Class.forName 就能拿到类信息。

6） wait() 、 notify() 、 notifyAll() 配合 synchronized 实现线程间通信。wait 会释放锁并挂起线程，直到被notify唤醒。⽤的时候必须在同步块⾥。

7） finalize() 对象被回收前可能调⽤的⽅法。但不保证执⾏，也不推荐⽤，资源释放应该⽤⼿动 close 或 try-with-resources。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/358dcfdf7f60ce052b7e02d385ec69116a9a43a2edea37ad7cce8150a956daed.jpg)


# 接⼝和抽象类有什么区别？

接⼝和抽象类虽然都能定义⽅法契约，但它们的定位和能⼒完全不同。

抽象类本质还是个类，它允许你写具体的⽅法实现，也能定义成员变量。⼦类继承它的时候，可以复⽤⾥⾯已有的代码。⽐如你有个 BaseService 抽象类，⾥⾯写了通⽤的⽇志记录逻辑，所有业务服务继承它就能直接⽤。

接⼝就更纯粹了，从Java8开始允许默认⽅法实现，但它主要还是⽤来声明“能做什么”。⼀个类可以实现多个接⼝，⽐如 ArrayList 既实现了 List ⼜实现了 RandomAccess 。这在设计扩展点时特别有⽤，像 Spring 的ApplicationContextAware 、 InitializingBean 都是通过接⼝让 Bean 感知容器⽣命周期。

1）抽象类强调“是什么”，适合有共同属性和⾏为的场景

2）接⼝强调“有什么能⼒”，适合解耦和横向扩展

3）抽象类只能单继承，接⼝可以多实现

```java
public abstract class Animal { protected String name; public abstract void makeSound(); public void sleep() { System.out.println("Sleeping..."); }   
public interface Flyable { default void fly() { System.out.println("Flying..."); } 
```

实际开发⾥，⼀般⽤抽象类做⻣架实现，接⼝定义⾏为规范。像 JDK ⾥的 InputStream 是抽象类，因为有共⽤的读取逻辑；⽽ Comparable 就是典型的能⼒接⼝。

# Java中的序列化和反序列化是什么？

序列化就是把内存⾥的对象变成字节流，⽅便存储或传输。反序列化则是把这个字节流重新还原成对象。

1）要让⼀个类⽀持序列化，必须实现 Serializable 接⼝，这个接⼝是个标记接⼝，不带任何⽅法。JVM会通过反射机制⾃动处理字段的读写。

```dart
class User implementsSerializable { private String name; private int age; } 
```

2）序列化时会⽣成⼀个 serialVersionUID ，⽤来校验版本⼀致性。如果反序列化时类结构变了，但serialVersionUID 匹配，就能成功加载，否则抛 InvalidClassException 。建议显式定义它，避免因字段变动导致意外失败。

3）静态变量和被 transient 修饰的字段不会被序列化。⽐如密码这类敏感信息，可以⽤ transient 标记，让它绕过持久化过程。

场景上，RMI、Dubbo的⽹络调⽤底层就依赖序列化传对象。Redis存Java对象时也常做序列化，⽐如⽤JdkSerializationRedisSerializer。

不过默认的序列化性能差，产⽣的字节流⼤，跨语⾔也搞不定。实际项⽬⾥更多⽤Kryo、Protobuf或JSON（如Jackson）替代。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/56603e5327d524fe3b3d4dd539fcfb316bb1bc3bfcb4c9f7e54a2b2eddaebf70.jpg)


# 为什么Java不⽀持多重继承？

Java不⽀持类的多重继承，主要是为了避免“菱形问题”带来的歧义和复杂性。想象两个⽗类有同名⽅法，⼦类继承时就不知道该调⽤哪个，编译器压根没法决定。

1）类只能单继承，这是Java语⾔设计时的明确选择，保证继承链清晰。每个类有且只有⼀个直接⽗类，Object是所有类的最终祖先。

2） 接⼝可以多继承，从 Java 8 开始，接⼝允许默认⽅法，解决了部分多重⾏为复⽤的需求。⽐如⼀个类实现多个接⼝，每个接⼝提供默认实现，只要⽅法签名不冲突就没问题。

3）如果多个接⼝有同名默认⽅法，编译器会报错，必须由⼦类显式重写该⽅法，明确指出逻辑如何处理。这样就把决策权交给开发者，⽽不是让系统猜测。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/5347cb37cfc35c6e0d8d0bd4b8c53db890fab76d8e4c2db8ce0f7cabf8c57f0b.jpg)


代码上，你得⼿动解决冲突：

```java
class C implements A, B {
    @override
    public void method() {
        // 必须重写，可以选择调用A或B的默认实现，或者自己写
        A.super.method();
    }
}
```

说⽩了，Java⽤“单继承 $^ +$ 多接⼝”的组合，既规避了复杂性，⼜保留了灵活性。像Spring框架⾥⼤量依赖接⼝做解耦，就是这种设计的实际受益场景。

# Java运⾏时异常和编译时异常之间的区别是什么？

Java的异常体系设计是为了让程序在出错时能有清晰的处理路径。我们平时说的运⾏时异常和编译时异常，其实是Exception体系下的两个分⽀，关键区别在于“编译器是否强制你处理”。

运⾏时异常，也就是 RuntimeException 及其⼦类，⽐如 NullPointerException、

ArrayIndexOutOfBoundsException，这类异常编译器不强制你在代码⾥ try-catch 或 throws。它们通常是由程序逻辑错误导致的，⽐如空指针、数组越界。你可以处理，但不是必须的。

⽽编译时异常，像IOException、SQLException这些，只要⽅法⾥可能抛出，你就得显式处理，要么catch，要么继续往上throws。否则，代码根本过不了编译。这类异常往往是外部因素引起的，⽐如⽂件不存在、⽹络断开，属于“可预期但不可控”的问题。

简单说，编译时异常是编译器逼你⾯对的问题，你不写处理逻辑就编译不过；运⾏时异常是你⾃⼰代码的“bug”，编译器默认你已经校验好了，出了问题你⾃⼰负责。

// 编译时异常：必须处理

FileInputStream fis $=$ new FileInputStream("a.txt"); // 不处理会编译失败

// 运⾏时异常：可以不处理

int[] arr $=$ new int[5]; 

arr[10] $\ c = ~ 1$ ; // 数组越界，程序直接崩，但编译没问题

所以设计上，如果你希望调⽤者必须考虑某种错误场景，就⽤编译时异常；如果是程序内部逻辑问题，⽤运⾏时异常更合适。现在很多框架⽐如Spring，也倾向于⽤运⾏时异常来减少模板代码。

# 如何在Java中调⽤外部可执⾏程序或系统命令？

Java ⾥执⾏外部命令，主要靠 Runtime.exec() 或 ProcessBuilder 。虽然都能⼲这活，但后者更灵活，是现在推荐的⽅式。

1）⽤ Runtime.exec() 最简单，⼀⾏代码就⾏

```javascript
Process p = Runtime.getRuntime().exec("ls -l"); 
```

但它对环境变量、⼯作⽬录这些控制很弱，搞复杂场景容易翻⻋。

2） ProcessBuilder 就是为了弥补这个短板设计的，能精细控制命令的执⾏环境

```javascript
ProcessBuilder pb = new ProcessBuilder("ping", "baidu.com");  
pbdirectory(new File("/tmp")); //指定工作目录  
pb.inheritIO(); //输出直接打到控制台，方便调试  
Process p = pb.start();
```

真正关键的是别忘了处理输⼊输出流。⼦进程的stdout和stderr如果不读，缓冲区满了就会卡住，程序直接僵死。常⻅写法是⽤线程异步消费这两个流。

另外， Process.waitFor() 会阻塞等命令结束，返回退出码，0 ⼀般是成功。超时控制⽤ waitFor(long,TimeUnit) ，避免⽆限等下去。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/1ddf4382f66f5b23d5b06e94d45a28c19f4d47a5b82e8267d46ee2c4bd54ae80.jpg)


# 栈和队列在Java中的区别是什么？

栈和队列最根本的区别在于数据访问的顺序。

1）栈是后进先出（LIFO），就像⼀摞盘⼦，只能从顶部拿或放。Java⾥可以⽤ ArrayDeque 模拟栈操作，⽐如调⽤push() ⼊栈， pop() 出栈，取值永远在顶端。

2）队列是先进先出（FIFO），像排队打饭，新来的⼈排尾，前⾯的⼈先⾛。Java中 Queue 接⼝定义了 offer()⼊队， poll() 出队，处理顺序从头到尾。

实际开发中，栈常⽤于⽅法调⽤链、表达式求值，JVM就靠虚拟机栈管理⽅法执⾏上下⽂。⽽队列多⽤于解耦⽣产消费，⽐如消息中间件Kafka的底层就是⾼性能队列在⽀撑，线程池的任务队列也是典型场景。


代码上对⽐也很直观：


```txt
ArrayDeque<Integer> stack = new ArrayList<>();  
stack.push(1);  
stack.push(2);  
stack.pop(); //返回2  
Queue<Integer> queue = new ArrayList<>();  
queue.offer(1);  
queue Offer(2);  
queue poll(); //返回1
```

注意别⽤过时的 Stack 类，它线程安全但性能差，直接⽤ ArrayDeque 做栈更⾼效。同样，普通场景⽤ArrayDeque 实现队列，⽐ LinkedList 更快，内存更紧凑。

# 什么是Java的⽹络编程？

Java的⽹络编程，说⽩了就是⽤Java代码实现不同机器上的程序能互相通信。最基础的就是基于TCP和UDP这两种协议来收发数据。

1）TCP是⾯向连接的，⽐如你⽤Socket写个聊天程序，服务端得先启动ServerSocket监听端⼝，客户端再⽤Socket发起连接。⼀旦连上，双⽅就能通过输⼊输出流交换数据，保证可靠、有序。

```java
// 服务端简单示例  
ServerSocket server = new ServerSocket(8080);  
Socket client = server.accept();  
BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));  
String msg = in.readLine(); // 读客户端消息
```

2）UDP不建⽴连接，直接发数据包，适合对实时性要求⾼但能容忍丢包的场景，⽐如视频直播。Java⽤DatagramSocket 和 DatagramPacket 来处理。

3）实际开发中，没⼈会直接裸写这些底层API。Netty才是主流选择，它把NIO那套复杂的事件驱动模型封装得很⼲净，像Dubbo、RocketMQ都靠它撑起⾼性能通信。

NIO和Netty是进阶关键，尤其是Reactor模式怎么通过⼀个线程管理成千上万个连接。传统IO每个连接⼀个线程，扛不住并发；NIO⽤Selector监听多个通道，压根不经过阻塞等待。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/27f4d1f86ac59962390de1a7cd3b634527f46a5d24e7e1cecc56307fee321fca.jpg)


# 什么是 Java 中的迭代器（Iterator）？

Java⾥的迭代器（Iterator）就是专⻔⽤来遍历集合的⼀个对象，它让你能⼀个⼀个地访问集合⾥的元素，⼜不暴露底层结构。

1）核⼼⽅法就那⼏个： hasNext() 判断还有没有下⼀个， next() 拿出下⼀个元素， remove() 删除刚拿到的那个。⽐如遍历 ArrayList 或 HashSet 的时候，你⽤ foreach 其实背后就是 Iterator 在⼲活。

```java
Iterator<String> it = list.iterator(); while (it.hasNext()) { String item = it.next(); System.out.println(item); } 
```

2）它最⼤的好处是统⼀了遍历⽅式。不管你是 ArrayList 还是 LinkedList，TreeSet 还是 HashMap 的 key 集合，只要实现了Iterable接⼝，就能⽤同样的⽅式遍历。这其实就是迭代器模式的典型应⽤，解耦了集合和遍历逻辑。

3）fail-fast机制也得提⼀嘴。像ArrayList的迭代器，如果遍历过程中别⼈修改了集合，它会直接抛ConcurrentModificationException。这不是bug，是故意设计的，避免你在脏数据上操作。但如果你真要边遍历边删，记得⽤ it.remove() ，别直接调集合的 remove。

4）有些场景不适合⽤普通Iterator。⽐如你要并发遍历，就得考虑CopyOnWriteArrayList这种⾃带快照的结构，它的迭代器基于副本，改不影响读。

# 什么是Java的封装特性？

封装说⽩了就是把数据和操作数据的⽅法绑在⼀起，同时隐藏内部实现细节。你对外暴露的越少，别⼈就越难误⽤，后期修改也越安全。

⽐如⼀个银⾏账户类，余额这种关键数据不能让外部直接访问，得通过 deposit 或 withdraw ⽅法来操作。这些⽅法可以加校验逻辑，防⽌余额被随意篡改。

public class BankAccount { private double balance; public void deposit(double amount) { if (amount $>\theta$ ) balance $+=$ amount; } 

```txt
public double getBalance(){ return balance; }   
1 
```

你看，balance是private的，外部没法绕过deposit直接改数值。这就是封装的价值⸺把“改余额”这个脏活累活关在类⾥，⾃⼰控制流程。

实际开发中，像 Spring 的 Bean、MyBatis 的 Mapper 接⼝，都靠封装把复杂逻辑收在背后。你调个 service.save() 就⾏，不⽤管它背后开了事务、刷了缓存、发了消息。

1）属性私有化，⽤ getter/setter 控制访问

2）内部实现细节不暴露，⽐如集合⽤ArrayList还是LinkedList外部不关⼼

3）增强安全性，避免对象状态被⾮法破坏

该藏的藏，该露的露，这才是合格的封装。

# BigDecimal为什么能保证精度不丢失?

浮点数精度问题，根源在⼆进制表⽰上。像 0.1 这种⼗进制⼩数，在⼆进制⾥是⽆限循环的， float 和double 存的时候就只能近似，计算多了误差就越滚越⼤。

BigDecimal不⼀样，它根本不玩⼆进制浮点那⼀套。它把⼀个数拆成两部分来看：⼀个是⽆符号整数（⽤BigInteger 存），另⼀个是缩放因⼦（scale），也就是⼩数点要往左移多少位。

⽐如 new BigDecimal("0.1") ，内部存的是 1 这个整数，scale 是 1 ，意思是 1 / $\tt { 1 0 ^ { \sim } 1 }$ 。所有运算都基于整数算，最后再按scale恢复⼩数位置，中间压根不经过浮点计算，⾃然不会丢精度。

关键得⽤字符串构造。写 new BigDecimal(0.1) 就糟了，因为 0.1 这个 double 值传进去之前就已经失真了。必须⽤字符串，让BigDecimal从字符逐位解析，才能保证原始值准确。

```txt
// 对  
BigDecimal bd = new BigDecimal("0.1");  
// 错，0.1 已经是 double 的近似值了  
BigDecimal wrong = new BigDecimal(0.1);
```

它适合⾦融、交易这种⼀分钱都不能错的场景，像⽀付宝、银⾏系统⾥⾦额计算基本都靠它。但代价是⽐ double慢得多，内存占⽤也⼤，⼀般业务没必要上。

1）内部⽤整数 $^ +$ scale模式避开了⼆进制浮点误差

2）必须⽤字符串构造，避免double先失真

3）性能差，只在需要精确计算时⽤

# 什么是 Java 的 BigDecimal？

Java⾥的BigDecimal不是简单⽤来存⼩数的，它是为了解决浮点数计算精度丢失问题⽽存在的。像float和double在做加减乘除时，经常会出现 $0 . 1 + 0 . 2$ 不等于0.3这种情况，这在⾦融、交易、计费系统⾥是完全不能接受的。

BigDecimal能精确表⽰⼩数，它的底层⽤int类型的 scale 表⽰⼩数位数，⽤BigInteger存数值，所以能保证任意精度的运算准确。⽐如余额计算、汇率转换、订单⾦额拆分这些场景，必须⽤BigDecimal。

但注意，它不是万能的。构造时别⽤ new BigDecimal(double) ，因为double本⾝就不准，得⽤字符串构造：

```javascript
BigDecimal amount = new BigDecimal("0.1"); 
```

做除法更要⼩⼼，⽐如1除以3是⽆限循环⼩数，不指定精度会抛异常：

```txt
BigDecimal result = a.divide(b, 4, RoundingMode.HALF_UP); // 保留4位，四舍五入
```

性能上，BigDecimal⽐基本类型慢得多，毕竟是对象操作，还有⼗进制的对⻬和舍⼊处理。⾼频计算场景得权衡精度和性能。

另外，⽐较两个 BigDecimal 别⽤ equals，因为它会⽐ scale。0.1 和 0.10 ⽤ equals 判断是 false，应该⽤compareTo：

```javascript
if (a compareTo(b) == 0) { // 正确的值比较 // 相等 }
```

# Java泛型擦除是什么？

Java的泛型擦除指的是编译器在编译期把泛型信息拿掉，⽣成的字节码⾥压根不带类型参数。也就是说，List<String> 和 List<Integer> 到运⾏时都变成了 List ，这个过程就叫类型擦除。

1）编译器会在编译阶段检查泛型类型是否合法，⽐如你往 List<String> ⾥加整数，会直接报错。但⼀旦通过检查，就会把泛型信息擦掉，替换成对应的原始类型（rawtype），⽐如 List<T> 变成 List ， T 是引⽤类型的话默认⽤ Object 替代。

2） 如果泛型有上界，⽐如 T extends Number ，那擦除后 T 就会被替换成 Number ，⽽不是 Object 。这样能保证⽅法调⽤的安全性。

3）为了保证类型安全，编译器还会⾃动插⼊强制转换代码。⽐如你从 List<String> 取元素，虽然字节码是Object ，但编译器会⾃动加⼀句 (String) 转换。

```java
List<String> list = new ArrayList<>();  
list.add("hello");  
String s = list.get(0); //编译后实际是(String) list.get(0)
```

4） 因为擦除发⽣在编译期，所以⽆法在运⾏时获取泛型的实际类型。这也是为什么不能 new T() 或 if (objinstanceof List<String>) ⸺ 运⾏时根本没这信息。

有个例外是反射，如果泛型信息被保留在⽅法签名或字段上（⽐如作为成员变量或⽅法返回值），可以通过getGenericTypes() 拿到，但这也只是“残留”的签名信息，不是运⾏时动态的。

# Java中的字节码是什么？

Java源代码编译后⽣成的中间指令集，就是字节码。它不依赖具体硬件，运⾏在JVM上，实现“⼀次编写，到处运⾏”。

字节码⽂件以 .class 为后缀，内部是⼆进制格式，可以⽤ javap -c 反编译查看助记符形式的指令。⽐如⼀个简单的加法操作，会变成 iconst_1 、 iconst_2 、 iadd 这样的栈指令。

JVM执⾏时，解释器逐条读取字节码并执⾏，热点代码会被即时编译器（JIT）编译成机器码，提升性能。这个过程对开发者透明。

public class Add { public static int add(){ return $1 + 2$ 1 

反编译后你会看到：

```txt
0:iconst_1  
1:iconst_2  
2:iadd  
3:ireturn 
```

这说明Java的运算基于操作数栈，⽽不是寄存器。

字节码的好处在于可移植性，但这也带来了⼀层抽象开销。不过现代JVM通过JIT优化，⼤部分场景下性能接近原⽣代码。

像SpringAOP的动态代理、Lombok编译期⾃动插⼊getter/setter，都是在编译后修改字节码实现的。ASM、Javassist这类库就是⽤来操作字节码的。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/66cfd33583cf23dfbaac799437037d372eb6032f6a54e4cb1dfe4274d8cc948f.jpg)


# Java 和 Go 的区别

Java和Go的设计哲学完全不同，⼀个追求企业级的稳重，⼀个追求现代并发的简洁。

Java⾛的是虚拟机路线，靠JVM实现跨平台，⼀套字节码跑在各种操作系统上。你写个SpringBoot服务，其实底层是JVM在做内存管理、GC、JIT编译这些脏活累活。它适合⼤型系统，像阿⾥巴巴的电商架构、⾦融系统的交易核⼼，依赖丰富，⽣态庞⼤。

Go直接编译成机器码，启动快，部署就是⼀个⼆进制⽂件，没有JVM依赖。它的goroutine是轻量级线程，⽤channel做通信，写并发服务特别爽。⽐如etcd、Docker、Kubernetes都是⽤Go写的，微服务⽹关、API中台这类场景它能轻松扛住⾼并发。

语法上Java更啰嗦，接⼝、抽象类、泛型层层套娃，Go就简单多了，没有继承，⽤组合和接⼝隐式实现，函数返回多值，错误处理靠显式判断。

性能⽅⾯，Java有JIT优化，⻓期运⾏的服务性能很稳，但GC可能带来停顿。Go的GC虽然也在进步，但⽬前还是更偏向低延迟，适合短平快的请求处理。

1）Java适合复杂业务逻辑、已有⽣态深厚的⼤中型系统

2）Go适合云原⽣、⾼并发、需要快速启停的微服务和基础设施

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/f09a9380a242252a1a3d1b6837b063a7f1bc083cfbb78280cd9743be60d4b84c.jpg)


选哪个？看团队技术栈和场景。搞不定⾼并发微服务拆分，Java $^ +$ SpringCloud也能扛，但要写个⾼性能代理⽹关，Go⼏百⾏代码就能搞定。

# 什么是Java中的动态代理？

Java的动态代理其实是在运⾏时，给⼀个对象⽣成代理类的技术。这个代理类会帮你把⽅法调⽤转发出去，典型的就是在不改原代码的情况下加⽇志、事务、权限控制这些逻辑。

JDK⾃带的动态代理靠的是 java.lang.reflect.Proxy ，它要求被代理的对象必须实现⾄少⼀个接⼝。代理类在运⾏时创建，和⽬标对象实现同⼀个接⼝，然后把调⽤分发给 InvocationHandler 。

1）你写个类实现 InvocationHandler ，重写 invoke ⽅法，在⾥⾯控制实际的⽅法调⽤2）⽤Proxy.newProxyInstance() ⽣成代理实例，传⼊类加载器、接⼝数组和 handler 3）调⽤代理对象的⽅法时，全部会⾛到 invoke ⾥

⽐如SpringAOP在接⼝场景下就⽤JDK动态代理，像加个事务注解，⽅法执⾏前后⾃动开启提交事务。

代码⻓这样：

Object proxy $=$ Proxy.newProxyInstance( target.class().getClassLoader(), target.class().getInterfaces(), (proxy，method，args）- $\rightharpoondown$ { System.out.println("前置逻辑"); return method.invoke(target，args);   
1

还有⼀种是CGLIB动态代理，基于字节码⽣成⼦类，能代理普通类，Spring内部混合使⽤这两种。动态代理的关键就是运⾏时⽣成，不⽤提前写死代理类。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/dcb20e996e8450cc7be6c69fceeaace20f3659e893847e750830f8ea3a8a2257.jpg)


BIO就是传统阻塞IO，每个连接配⼀个线程处理。像早期的Tomcat⽤BIO模式，1000个客户端连上来就得开1000个线程，系统压根扛不住。线程⼀多上下⽂切换开销爆炸，资源消耗⼤。

NIO的核⼼是多路复⽤，通过Selector统⼀管理多个连接。⼀个线程就能轮询上千个连接的状态，有数据才去读写。Java ⾥的 NIO 基于 epoll（Linux）或 kqueue（macOS），Netty 就是典型的 NIO 框架，能轻松⽀撑⼏⼗万并发。

AIO更进⼀步，是真正的异步⾮阻塞。读写操作由系统内核完成，完成后通知程序回调。⽐如读⽂件时发起请求就直接返回，等数据准备好了操作系统主动告诉你。Windows的IOCP是典型实现，但Java中AIO使⽤较少，主要因为编程模型复杂，且Linux对AIO⽀持不如epoll成熟。

1）BIO适合连接数少、业务耗时⻓的场景，⽐如内部⼯具服务

2）NIO适合⾼并发、短消息的场景，主流都是它，像Dubbo、RocketMQ内部通信都基于NIO

3）AIO理论性能最好，但实际落地难，⽬前更多⽤NIO $^ +$ 多线程模拟异步

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/0a562b1bf9d3511ef463c64ff26589b3ab0498c530fb03009e93b84f52cebb5f.jpg)


# 什么是Java的多态特性？

多态是Java⾯向对象的三⼤特性之⼀，它让同⼀个⾏为在不同对象上有不同的实现⽅式。说⽩了，就是“⼀个接⼝，多种实现”。

# 1）编译时多态

主要靠⽅法重载（overload）实现。同⼀个类⾥，⽅法名⼀样但参数列表不同，编译器在编译阶段就能确定调⽤哪个⽅法。

# 2）运⾏时多态

靠⽅法重写（override）和继承来实现。⽗类引⽤指向⼦类对象，调⽤被重写的⽅法时，实际执⾏的是⼦类的版本。

这个绑定过程发⽣在运⾏时，由 JVM 动态决定。

Animal a $=$ new Dog(); 

a.makeSound(); // 调⽤ Dog 的 makeSound

这种机制的核⼼在于动态分派，JVM会根据对象的实际类型去⽅法区找对应的实现，⽽不是看引⽤的声明类型。这也是为什么多态能⽀持灵活的扩展性⸺上层代码只需要依赖抽象，⽐如Spring中的Bean处理、MyBatis的插件链，都⼤量利⽤了这⼀特性。

不过要注意，静态⽅法、private⽅法、构造⽅法不参与多态，它们的调⽤在编译期就定死了。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/a94b04a89afe68ce7ab400c150cb4073b913d59c254c36d891514f4215941af7.jpg)


这样设计的好处是解耦。新增动物类型不⽤改原有逻辑，只要继承Animal实现makeSound就⾏，系统更容易维护和扩展。

# Java中的参数传递是按值还是按引⽤？

Java⾥所有参数传递都是按值传递，不存在按引⽤传递。这个“值”指的是变量副本，具体分两种情况。

基本类型传的是数据副本，⽐如int、boolean，⽅法内部改了参数，外⾯的变量完全不受影响。你改你的，我这⼉还是原来的值。

对象类型传的是引⽤的副本，也就是说，两个变量指向同⼀个堆内存对象。⽅法内部通过这个参数修改对象的字段，外部能看得到，因为操作的是同⼀个实例。但如果你在⽅法⾥给参数重新赋值，⽐如new⼀个新对象，那只是改变了参数副本的指向，原始变量依然指向旧对象。

void modify(Person p) {p.name $=$ "new"; //外部可见，改的是共享对象p $=$ new Person(); //外部不可见，只是参数副本换了指向

很多⼈混淆是因为看到对象内容能被改，就以为是引⽤传递。其实关键在于：参数本⾝是传了个拷⻉，⽅法没法改变原变量的指向。String这种不可变类更明显，任何“修改”都会⽣成新对象，原字符串压根不变。

1）基本类型：传值，互不影响

2）对象类型：传引⽤的副本，能改对象内容，不能改原引⽤指向

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/0fc78ab32d3525a085612841706578ad45dd44dde037239e3d0662bd33f8ee24.jpg)


# 什么是Java中的不可变类？

不可变类指的是实例⼀旦创建，其内部状态就⽆法被修改的类。Java⾥的String就是最典型的例⼦，你对字符串做拼接，其实是⽣成了新对象，原字符串并没变。

要写⼀个真正的不可变类，得把⼏个关键点都守住。⾸先是类本⾝要⽤final修饰，防⽌被继承破坏规则。然后所有字段必须是private且⽤final修饰，确保外部不能直接改，初始化后也不能再赋值。

1）所有字段在构造函数⾥完成初始化，⽽且必须深拷⻉，特别是集合或数组这种引⽤类型，否则外部拿到引⽤还是能改⾥⾯的内容。

2） 不提供任何 set ⽅法或能修改内部状态的 public ⽅法。

3）如果有返回可变字段的⽅法，⽐如返回⼀个List，那得⽤Collections.unmodifiableList包⼀层，防⽌外部通过返回值去修改内部数据。

```java
public final class OnClickListener {
    private final String name;
    private final List<String> tags;
    public OnClickListener(String name, List<String> tags) {
        this.name = name;
        this-tags = new ArrayList<> (tags); // 深拷贝
    }
    public String getName() {
        return name;
    }
    public List<String> getTags() {
        return Collections/unmodifiableListtags); // 只读视图
    }
}
```

这种设计在多线程环境下特别省⼼，因为状态不会变，天然线程安全，像ConcurrentHashMap的key就推荐⽤不可变对象。但代价是每次“修改”都要新建对象，频繁变更的场景可能产⽣⼤量临时对象，GC压⼒会⼤。

Java ⾥ Exception 和 Error 都继承⾃ Throwable，但代表的完全是两类问题。

Exception指程序能预⻅并处理的异常情况，⽐如⽂件没找到、⽹络超时、数组越界。这类问题通常可以通过代码逻辑恢复，像 try-catch 捕获后重试或降级。常⻅的 IOException、SQLException 都属于这⼀类。

Error 则代表 JVM ⾃⾝出了严重问题，⽐如内存溢出（OutOfMemoryError）、栈溢出（StackOverflowError）、类加载失败（NoClassDefFoundError）。这些问题程序本⾝搞不定，即使捕获也很难恢复，⼀般会导致应⽤崩溃。你写业务代码⼏乎不需要去 catch Error。

1）Exception 分为 checked 和 unchecked。checked 异常必须显式处理，⽐如在⽅法签名上 throws，或者⽤ try-catch 包住。unchecked 异常（即 RuntimeException 及其⼦类）则不⽤强制处理。

2）Error 和 RuntimeException 都属于 unchecked，编译器不强制你处理。

3）实际开发中，服务间调⽤超时、数据库连接失败这些该做重试或熔断，属于Exception的处理范畴；⽽⼀旦出现OOM，整个进程可能已经不稳定，这时候最好的做法反⽽是快速失败，让监控告警，⽽不是试图“修复”。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/e11a57e4c91a9aff1ada99320c1343ed1e9beaf56b03bb6fea4926416b7ff75c.jpg)


# Java⾯向对象编程与⾯向过程编程的区别是什么？

⾯向过程是写⼀堆函数，数据散在外⾯，谁要⽤谁就去调。

Java的⾯向对象不是简单把函数打包，⽽是把数据和操作数据的⽅法绑在⼀起，形成⼀个独⽴的“对象”。⽐如⽤户信息和它的验证逻辑、更新逻辑都封装在User类⾥，外⾯只能通过暴露的⽅法来交互。

1）你改内部实现，只要接⼝不变，外部压根不感知。

2）不同对象之间通过⽅法调⽤协作，像拼积⽊⼀样搭系统。

3）继承和多态让你能复⽤代码，也能做到运⾏时动态替换⾏为。

举个例⼦，处理订单流程，⾯向过程可能是⼀连串函数：checkStock calcPrice createOrder sendSms。数据在各个函数间传来传去，⼀改结构就得动全部。

⽽⾯向对象会有⼀个 OrderService，它依赖 Inventory、Pricing、Notification 这些对象，每个对象⾃⼰管⾃⼰的状态和逻辑。调⽤⽅只关⼼“下单”这个动作，背后怎么协调是它⾃⼰的事。

代码上差别的关键是抽象层级：

```txt
// 面向过程风格
void processOrder(long userId, List<item> items) {
    if (!Inventory.check(items)) throw new.IllegalStateException();
    double price = Pricing+Calc(items);
    long orderId = DB.saveOrder(userId, items, price);
    Notification.send userId, "Order" + orderId + "created");
}
```

说⽩了，⾯向对象是靠封装、职责划分和消息传递来管理复杂度，适合 $1 0 \mathsf { w } ^ { + }$ ⾏以上的系统。⼩脚本搞个main函数⼀路写到底，其实也没问题。

# 什么是Java内部类？它有什么作⽤？

内部类就是定义在另⼀个类⾥⾯的类。它能直接访问外部类的所有成员，包括私有的，这种紧密的耦合关系在某些场景下特别有⽤。

1）解决逻辑相关的类组织问题。⽐如 LinkedList ⾥的 Node ，作为链表的节点结构，天⽣属于 LinkedList的内部实现细节，⽤内部类封装就很⾃然。

2）实现事件监听、回调等机制时更⽅便。像AWT/Swing的事件处理，监听器作为内部类可以直接拿到外部界⾯组件的状态，不⽤到处传引⽤。

3）替代函数式接⼝或简化匿名类写法。虽然现在有Lambda，但在需要维护状态的回调⾥，局部内部类还是更灵活。

匿名内部类在创建线程或注册监听时很常⻅：

```java
new Thread(new Runnable() { public void run() { System.out.println("来自内部类的线程"); } ).start();
```

注意内存泄漏⻛险。⾮静态内部类会隐式持有外部类引⽤，如果它的实例⽣命周期⽐外部类⻓（⽐如被缓存了），就会导致外部类⽆法回收。Android开发⾥经常踩这个坑。

静态嵌套类没有这个问题，它和普通类差不多，只是命名空间被包装了⼀下：

```txt
public class Outer {
    static class Nested {} // 不依赖外部类实例
}
```

内部类最终会被编译成独⽴的 .class ⽂件，⽐如 Outer$Inner.class ，JVM 其实并不认识“内部类”这个概念，全是靠编译器⽣成代码和桥接⽅法实现的。

# Java8有哪些新特性？

Lambda表达式不是语法糖，它在字节码层⾯通过invokedynamic指令实现，运⾏时动态绑定调⽤点。写匿名内部类的代码量直接砍掉⼀⼤半。

⽅法引⽤让你⽤ System::out::println 这种写法替代lambda，可读性提升明显，尤其在流操作⾥连贯性很强。

接⼝可以定义default⽅法，JDK8⾥的 Collection 接⼝新增的 stream() 就是典型例⼦。接⼝演化不再破坏实现类，这点对库开发者太重要了。

Stream API 是集合处理的⼀次升级，filter、map、reduce 链式调⽤，逻辑表达更接近业务语⾔。⽐如users.stream().filter(u -> u.getAge() > 18).count() 统计成年⼈，代码意图⼀眼就懂。

Optional 不是解决空指针的银弹，但它强制你显式处理 null 情况。 isPresent() 和 ifPresent() 配合使⽤，能避免随意调⽤可能为空的对象⽅法。

时间 API 全⾯重构， LocalDateTime 、 ZonedDateTime 、 Duration 这⼀套⽐原来 Date 和 Calendar 好⽤太多。线程安全，语义清晰，解析格式也统⼀交给 DateTimeFormatter 。

ConcurrentHashMap 在 JDK8 ⾥数据结构变了，底层从分段锁改成 Node 数组 $^ +$ 链表/红⿊树，CAS $^ +$ synchronized控制并发，吞吐量明显提升。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/e90f724bc311f1703210a9404604aa9b03292d223387d27efd559b7176d5d5d4.jpg)


这些特性⾥，Stream和Lambda彻底改变了Java的编程⻛格，后续版本的函数式⽀持都在这基础上演进。

# 为什么 JDK 9 中将 String 的 char 数组改为 byte 数组？

JDK9这个改动其实是为了解决字符串内存占⽤过⾼的问题。以前 String ⽤ char[] 存储，每个字符固定占2字节，但现实中⼤部分字符串⽐如英⽂、数字、符号，其实⽤1字节的ISO-8859-1或UTF-8就够了。

于是JDK9引⼊了紧凑字符串（CompactStrings）设计，底层改⽤ byte[] 加⼀个编码标识 coder 。如果是纯Latin-1字符，就⽤1字节存储；如果有中⽂、特殊字符等需要UTF-16，才切到2字节模式。这样在普通业务场景下，字符串内存直接省了接近⼀半。

这个 coder 标志位决定了编码⽅式，取值通常是0表⽰LATIN1，1表⽰UTF16。所有String操作都会先判断coder再处理数据，对开发者完全透明。

举个例⼦，像⽇志系统⾥⼤量路径、参数名、状态码这类⽂本，基本都是ASCII，原来⽩⽩浪费⼀倍空间。现在Logback、Spring Boot 这些框架跑在 JDK $^ { 9 + }$ 上，堆内存压⼒明显降低。

当然也有代价。混合编码意味着每次访问都要判断coder，会有少量性能损耗。但在绝⼤多数以读为主的场景下，空间换时间是划算的。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/c2595d74d91b866ab43d7bd50c21b1e94766c156c9bceb5cce886fda735846de.jpg)


所以这波操作本质是JVM层⾯的空间优化，针对真实业务负载做的妥协和平衡。对于搞中间件或者调优的⼈来说，理解这点有助于分析堆dump时更清楚字符串的真实开销。

# Java 中 String、StringBuffer 和 StringBuilder 的区别是什么？

字符串操作在Java⾥太常⻅了，这三个类总被拿来问。关键得说清楚它们的线程安全和性能差异。

String是不可变的，每次拼接都会⽣成新对象，频繁操作就搞不定，⽐如⽤ $^ +$ 循环拼字符串，底层其实是不断newStringBuilder 再转回 String，效率低。

StringBuilder 是可变的，⾮线程安全，单线程下拼接字符串⾸选它，性能最好，append 操作就是直接往 char 数组后⾯加，扩容时⼀般是当前容量的1.5倍再加1。

StringBuffer 和 StringBuilder 接⼝⼏乎⼀样，但它的⽅法都加了 synchronized，线程安全，适合多线程环境，但锁带来开销，性能⽐ StringBuilder 低⼤概 $1 0 \text{‰}$ 。

1）如果字符串内容不变，⽤ String

2）单线程⼤量拼接，⽐如⽇志组装、JSON 构建，⽤ StringBuilder

3）多线程共享拼接场景，⽐如Web应⽤中多个请求共⽤⼀个缓冲区，才考虑StringBuffer

代码上看区别：

```java
// String 拼接，不推荐循环内使用  
String s = "";  
for (int i = 0; i < 1000; i++) {  
    s += "a"; // 每次都 new 对象  
}  
// 正确做法  
StringBuilder sb = new StringBuilder();  
for (int i = 0; i < 1000; i++) {  
    sb.append("a");  
}  
String result = sb.toString();
```

其实⽇常开发⾥，StringBuffer 已经很少⻅了，⼤多被 StringBuilder $^ +$ ⼿动同步或 ConcurrentHashMap 这类结构替代。

# Java 的 StringBuilder 是怎么实现的？

StringBuilder的本质是个可变的字符数组，解决字符串拼接时频繁创建对象的问题。每次⽤ $^ +$ 拼字符串，底层其实会 new 多个 String 和 StringBuilder，循环⾥搞这个，分分钟 OOM。

它内部维护⼀个char[]，叫value，初始容量是16。你append字符，就是往这个数组⾥塞数据，有个count记当前⻓度。数组不够了，就扩容，新⼤⼩是原来 2 倍再加 2，然后⽤ System.arraycopy 搬数据。

StringBuilder sb $=$ new StringBuilder(); 

sb.append("hello"); 

sb.append("world"); 

上⾯这段，全程只操作⼀个char[]，压根不经过GC，性能⽐String拼接⾼好⼏个量级。单线程下，拼接超过3次的字符串，基本都该⽤ StringBuilder。

和 StringBuffer 的区别？后者所有⽅法都加了 synchronized，线程安全但慢。StringBuilder 就是它的⾮同步版本，$9 9 \%$ 的场景都应该⽤它。

扩容机制要注意，如果预估不准容量，反复扩容拷⻉数组，也会影响性能。⽐如⼀开始就 append ⼀个 1000 ⻓度的字符串，最好指定初始⼤⼩：

new StringBuilder(1024) 

避免后续多次扩容。

1）内部是可变char[]2）默认容量16，扩容策略为2*old+23）⾮线程安全，性能⾼，适合单线程拼接4）⼤字符串拼接建议预设容量

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/0a2e8ecb55390ab15eba29734d7cf0a700b0a3d9afba1999adf63ab57fb724aa.jpg)


# Java中包装类型和基本类型的区别是什么？

Java⾥基本类型和包装类型最根本的区别在于，⼀个是栈上存的原始值，⼀个是堆上的对象实例。

1）基本类型像int、boolean这些直接在栈上分配，访问快，不涉及对象开销。⽐如 int $\textsf { a } = \textsf { 1 }$ ; 就是个纯粹的32位整数。

2）包装类型是类，⽐如Integer、Boolean，它们封装了基本类型，提供了⼯具⽅法，还能表⽰null。但每次创建可能产⽣对象，有GC压⼒。⽐如 Integer $~ \mathsf { b } ~ = ~ 1 \Theta \Theta \Theta$ ; 实际是 new Integer(1000) 的⾃动装箱。

⾃动装箱和拆箱在集合操作时特别常⻅。List存的是对象，所以int会⾃动转成Integer。但这⾥有个坑：-128到127的Integer会被缓存，超出范围⽤ $= =$ ⽐较会出错。

Integer $\textsf { a } = \lfloor 2 7$ ; 

Integer $\ b \ = \ 1 2 7$ ; 

$\textsf { a } = = \textsf { b }$ ; // true，缓存命中

Integer $c \ = \ 1 2 8$ ; 

Integer ${ \textsf { d } } = 1 2 8$ ; 

$c \ = - \ d$ ; // false，两个不同对象

性能敏感场景优先⽤基本类型，避免频繁装箱拆箱带来的开销。⽽需要泛型、反射或允许null值时，就得⽤包装类。像JSON反序列化到字段，字段定义成Integer能区分“没传”和“传了0”。

装箱过程其实调的是Integer.valueOf()，不是new，所以能复⽤缓存对象。这个细节很多⼈忽略，但⾯试⼀问就露馅。

# Java 中的 hashCode 和 equals ⽅法之间有什么关系？

重写equals⽅法时，必须同时重写hashCode⽅法，这是为了保证对象在哈希集合中的⾏为⼀致性。

1）如果两个对象通过 equals ⽐较返回 true，它们的 hashCode 必须相等。反过来，hashCode 相等，equals 不⼀定为true，因为可能存在哈希碰撞。

2）⽐如你在HashMap⾥存⼀个⾃定义对象作为key，map会先通过hashCode找到桶位置，再⽤equals判断是否是同⼀个key。如果你只重写了equals⽽没重写hashCode，两个逻辑上相等的对象可能算出不同的hash值，导致get的时候压根不经过你put进去的那个桶，直接找不到。

3）反过来说，不重写equals只重写hashCode⼀般问题不⼤，但失去了⾃定义相等逻辑的意义。常⻅错误是只改了equals判断字段，⽐如User按name和age判等，但忘了同步更新hashCode计算逻辑。

代码⽰例：

@override   
public boolean equals(Object o) { if (this $= =$ o) return true; if (!o instanceof User)) return false; User user $=$ (User) o; return age $= =$ user.age && Objects.equals(name, user.name);   
}   
@override   
public int hashCode(){ return Objects.hashCode(name, age); //字段要和equals保持一致

简单说，这两个⽅法得“绑定”着重写，不然像HashSet、HashMap这些依赖哈希⾏为的集合就会出错。

# 为什么在Java中编写代码时会遇到乱码问题？

Java中的乱码问题，本质是字符集不⼀致导致的。你从哪读数据、往哪写数据，每个环节⽤的编码规则必须对得上，不然就是“鸡同鸭讲”。

⽐如你⽤ UTF-8 写了个中⽂⽂件，结果别⼈⽤ GBK 去读，那“你好”可能就变成“浣犲ソ”。反过来也⼀样。这种问题在IO操作、⽹络传输、数据库交互时特别常⻅。

1）⽂件读写时，没指定编码，默认⽤了系统编码。Windows⼀般是 GBK ，Linux/Max是 UTF-8 ，跨平台⼀跑，直接出事。

2） Web 应⽤⾥，前端⻚⾯声明的是 UTF-8 ，但后端 Servlet 没设置 request.setCharacterEncoding("UTF-8") ，请求体⾥的中⽂就废了。

3） 数据库连接 URL 没加 characterEncoding=utf8 ，存的时候就歪了。

代码上要盯住⼏个点：

```txt
// 读文件别用默认编码  
new String Files.readAllBytes(Paths.get("a.txt"), StandardCharrsets.UTF_8);  
// 写也要明确  
Files.write(path, "内容".getBytes(StandardCharrsets.UTF_8));
```

还有个坑是 String.getBytes() 和 new String(bytes) 这俩操作，不带参数就⽤平台默认编码，⼀换环境就崩。所以⼀定要显式传 Charset 。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/5df524a54c80ecbb872a5cd1b21d060aa942f9caa9a86a550e94246ea5cc237d.jpg)


只要记住：所有涉及字节和字符转换的地⽅，都得明确指定字符集，别偷懒。尤其是跨系统、跨语⾔、跨存储的时候，这个环节压根不经过⼤脑去猜，必须写死。

# JDK动态代理和CGLIB动态代理有什么区别？

JDK动态代理和CGLIB的根本差异在于代理对象的⽣成⽅式和适⽤范围。

JDK动态代理要求⽬标类必须实现⾄少⼀个接⼝，它通过 java.lang.reflect.Proxy 在运⾏时为接⼝创建代理实例。代理逻辑由 InvocationHandler 处理，⽅法调⽤会⾛到它的 invoke ⽅法⾥。这种⽅式不侵⼊原始类，但只能代理接⼝⽅法。

CGLIB不依赖接⼝，⽽是通过继承⽬标类⽣成⼦类来实现代理。它使⽤ASM操作字节码，在⼦类中重写⽗类⽅法并插⼊拦截逻辑。这意味着final类或final⽅法⽆法被代理，因为不能被重写。

性能上，CGLIB⽣成的代理类是具体⼦类，调⽤是直接的⽅法调⽤；⽽JDK代理多⼀层反射，早期版本慢⼀些，但从Java8开始差距不⼤。现在选型更多看是否需要基于类代理。

Spring AOP 默认优先⽤ JDK 动态代理，只有当⽬标没有实现接⼝时才退化到 CGLIB。

代码层⾯，JDK代理的核⼼是：

```txt
Proxy.newProxyInstance(ClassLoader, interfaces, handler) 
```

CGLIB 则是：

```txt
Enhancer.create(Class, Callback) 
```

1）JDK代理基于接⼝，CGLIB基于继承

2）JDK使⽤反射调度，CGLIB是直接调⽤增强⽅法

3）CGLIB能处理⽆接⼝的类，但⽆法代理final类或⽅法

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/86c2118ffe63b7433cb04019013c4d1caf1f79bfdafc987e6b1ad7ae7f37f3b4.jpg)


# Java中的注解原理是什么？

注解本质是⼀个继承了Annotation接⼝的接⼝，你定义的每个注解在运⾏时都会⽣成⼀个动态代理实例，JVM通过AnnotationInvocationHandler 来管理属性和值。

1）编译时，javac会处理源码中的注解，部分注解（如 $@$ Override）会在这个阶段触发检查。如果使⽤了注解处理器（APT），像 Dagger 或 Lombok 就能在这个阶段⽣成新代码。

2）class ⽂件⾥会保留注解信息，靠的是 Class ⽂件的 Attribute 结构，⽐如 RuntimeVisibleAnnotations 和RuntimeInvisibleAnnotations 这两个属性表，决定了注解是否保留到运⾏时。

3）运⾏时通过反射获取注解，调⽤ Class、Method 或 Field 的 getAnnotation() ⽅法，底层其实是从 class ⼆进制数据中解析出注解数据，再通过动态代理还原成注解对象。

```java
@Retention(RetentionPolicy.RUNTIME) @interface MyConfig { String value();   
public class Example { @MyConfig("test") public void run(){ 
```

# 拿到⽅法上的注解：

```txt
Method m = Example.class-method("run");  
MyConfig ann = m.getAnnotation(MyConfig.class);  
System.out.println(ann.value()); // 输出 test
```

注解本⾝不改变程序逻辑，它只是元数据。真正起作⽤的是读取这些注解的框架，⽐如Spring在启动时扫描@Component，MyBatis 解析 @Select 注解绑定 SQL。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/28519ea8a75c8307afab51a2387df30c2c880a8bf96438cc069ccb2729fd1015.jpg)


# 什么是 Java 的 SPI（Service Provider Interface）机制？

Java⾥的SPI其实是⼀种服务发现机制，它让接⼝的实现类可以在运⾏时动态加载，⽽不是写死在代码⾥。

你定义⼀个接⼝，不同的⼚商或模块提供各⾃的实现，JVM在启动时会去读取 META-INF/services/ ⽬录下的配置⽂件，⾃动把实现类加载进来。这个机制⽤得最典型的就是JDBC。⽐如你写 Connection conn $=$ DriverManager.getConnection(url) ，底层其实靠 SPI 把 MySQL、PostgreSQL 等驱动实现⾃动注册进来。

# 具体流程是这样的：

1）你在项⽬⾥引⼊ mysql-connector-java

2）这个 jar 包⾥有个⽂件叫 META-INF/services/java.sql.Driver

3）⽂件内容是 com.mysql.cj.jdbc.Driver

4）JVM 通过 ServiceLoader 读这个⽂件，反射加载并实例化这个类

```txt
ServiceLoader<Driver> loader = ServiceLoader.load(Driver.class);  
for (Driver driver : loader) {  
    System.out.println(driver);  
} 
```

这种设计的好处是解耦。框架只定义协议，具体实现由第三⽅提供，插件化扩展特别⽅便。Dubbo、SpringBoot的⾃动装配也借鉴了这套思路。

不过要注意， ServiceLoader 是全量加载的，所有实现都会被创建出来，如果某个实现初始化很重，会影响性能。⽽且没有优先级控制，多个实现时顺序不确定。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/483c2885026e0443a2d01cbccd5eafbb311b523673e0cc1edaf82c9e79429568.jpg)


# Java泛型的作⽤是什么？

泛型的本质是编译期的类型检查机制，它让集合类能记住装的是什么类型的对象。没有泛型的时候，往ArrayList⾥塞String 或 Integer 都没问题，但取出来时容易 ClassCastException，得靠开发者⾃⼰记。

⽤了泛型之后，⽐如 List<String> ，编译器就会在编译阶段就报错，⽽不是运⾏时抛异常。这叫类型安全，其实底层字节码压根不带泛型信息，因为会经过类型擦除，也就是泛型只存在于源码和编译期，JVM运⾏时根本看不到。

1）定义类或⽅法时⽤ <T> 表⽰类型参数，⽐如 class Box<T> { T value; }

2）调⽤时指定具体类型， Box<Integer> box $=$ new Box<>() ，编译器⾃动做类型推断

3）不能⽤于静态变量，因为静态成员属于类，⽽泛型实例属于对象，⽣命周期不匹配

代码⽰例：

```txt
List<String> list = new ArrayList<>();  
list.add("hello");  
String s = list.get(0); // 不需要强转
```

常⻅坑是泛型数组不能直接创建，⽐如 new List<String>[10] 会编译失败。还有像 List<Object> 和List<String> 没有继承关系，虽然 String 是 Object ⼦类，但泛型不继承类型关系。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/1b30c4adba577d3db4084a0893e2a7bbaf81ad07de8acdc3d3d7f9a5ef55f378.jpg)


# 什么是Java泛型的上下界限定符？

Java泛型的上下界限定符，是⽤来约束类型参数取值范围的语法。它让你能更精确地控制泛型能接受哪些类型。

上界⽤ extends 关键字表⽰，意思是“这个类型必须是某个类或接⼝的⼦类（包括⾃⾝）”。⽐如 List<?extends Number> 就只能装 Integer、Double 这种 Number 的实现类，但不能装 String。这种场景在你只想从集合⾥读数据时特别有⽤，毕竟都是Number，按⽗类处理没问题。

下界⽤ super 关键字，意思是“这个类型必须是某个类或其⽗类”。像 Lis $\mathbf { \zeta } < ?$ super Integer> 可以存Integer，也能存Object。这种⼀般⽤在你要往集合写数据的场景，确保⽬标类型能接住你塞进去的东西。

有个经典例⼦就是 Collections.copy() ⽅法。它的逻辑是把⼀个列表的内容复制到另⼀个列表。源列表⽤ ?extends T ，只读；⽬标列表⽤ ? super T ，只写。这样既能保证类型安全，⼜能最⼤限度保持灵活性。

public static<T>void copy(List<? super T>dest，List<? extendsT>src){ for(int $\mathbf{i} = 0$ ；i $<$ src.size();i++){ dest.set(i，src.get(i)); }   
1 

记住 PECS 原则：Producer-extends, Consumer-super。如果是⽣产数据的地⽅，⽤上界；消费数据的地⽅，⽤下界。

# Java中的深拷⻉和浅拷⻉有什么区别？

对象拷⻉这事⼉，关键看引⽤类型的成员变量怎么处理。

1）浅拷⻉是把对象⾥的值都复制⼀份，基本类型没问题，但遇到数组、集合这些引⽤类型，只复制了引⽤地址。这就意味着，原对象和副本操作的是同⼀个堆内存⾥的数据，改⼀个，另⼀个也跟着变。

2）深拷⻉会递归复制所有引⽤对象，直到每⼀层都是新创建的实例。两个对象彻底断开联系，互不影响。

举个例⼦，⽐如你⽤ Object.clone() ，默认就是浅拷⻉。要想实现深拷⻉，常⻅做法有⼏种。⼀种是重写clone() ⽅法，在⾥⾯对引⽤类型⼿动new或clone。另⼀种更省事的是序列化⽅案，⽐如⽤Java原⽣序列化或者Kryo这类库，直接把对象序列化再反序列化回来，相当于⽣成了⼀个全新的对象树。

public class Person implements Cloneable { String name; Address address; //引用类型 public Person clone() throws CloneNotSupportedException { Person copy $=$ (Person) super.clone();

copy.address $=$ (Address）address clones();//手动深拷贝引用对象 return copy; }   
}

还有⼀种情况，如果引⽤对象是不可变的，⽐如 String 、 Integer ，那浅拷⻉其实也够⽤，因为它们的值压根不能改。

要不要做深拷⻉，得看业务场景。像配置对象、DTO传输这种需要完全隔离的，就得深拷⻉。要是只是临时读取，共享引⽤反⽽能节省内存。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/9c11467fb1906cb4650af31a2764894b28a13a46640c3a9c3e8083486e17dc83.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/07e29e1e3d1f275ad9425427e5e68bfbaa26f887bb6809536ed8b5219de527b6.jpg)


# 什么是 Java 的 Integer 缓存池？

Java⾥对 Integer 类型有个缓存机制，主要⽤来优化频繁使⽤的⼩整数对象的创建和内存消耗。这个缓存池在JVM启动时就初始化好了，范围默认是-128到127。

1）当你⽤ Integer.valueOf(100) 或者⾃动装箱⽐如 Integer $\dot { \textbf { 1 } } = \textbf { 1 0 } \Theta$ 时，如果值在这个范围内，JVM不会新建对象，⽽是从缓存池⾥复⽤已有的实例。这能减少GC压⼒，提升性能。

2）但超出这个范围，⽐如 Integer $\dot { \textbf { 1 } } = 2 \Theta \Theta$ ，就会⾛new路径，每次都是新对象。这也是为什么 $= =$ ⽐较在⼩数值上可能为true，⼤数值却不⾏的根本原因。

```c
Integer a = 100;  
Integer b = 100;  
System.out.println(a == b); // true  
Integer c = 200;  
Integer d = 200;  
System.out.println(c == d); // false 
```

3）这个范围可以通过 -XX:AutoBoxCacheMax=N 参数调⼤，⽐如启动时加 -XX:AutoBoxCacheMa $\mathtt { \Omega } = 5 \Theta \Theta$ ，就能让 $0 { \sim } 5 0 0$ 的值也被缓存。不过⼀般没必要改，除⾮你明确知道应⽤⾥有⼤量装箱操作集中在某个⾼位区间。

注意：不只是 Integer ， Byte 、 Short 、 Long 也有类似机制，范围固定在它们的最⼩到最⼤值之间（如Long 也是 -128~127），⽽ Float 和 Double 没有缓存。

# Java的类加载过程是怎样的？

⼀个Java类从被加载到虚拟机内存中开始，直到卸载出内存为⽌，它的整个⽣命周期包括：加载、验证、准备、解析、初始化、使⽤和卸载七个阶段。我们重点关注前五个核⼼阶段。

1）加载通过类的全限定名获取该类的⼆进制字节流，通常是从class⽂件、jar包或者⽹络中读取。将字节流代表的静态存储结构转化为⽅法区的运⾏时数据结构，在堆中⽣成⼀个 java.lang.Class 对象作为⼊⼝。

2）验证确保Class⽂件的字节流符合当前虚拟机的要求，不会危害虚拟机安全。⽐如格式检查、元数据检查、字节码检查等。这⼀步防⽌恶意代码搞破坏。

3）准备 为类变量（static 修饰的变量）分配内存并设置初始值。⽐如 public static int value = 123; 这⾥会先设成0，⽽不是123，真正的赋值要等到初始化阶段。

4）解析将常量池内的符号引⽤替换为直接引⽤。⽐如某个⽅法调⽤了 System.out.println() ，这时候就会把符号引⽤定位到具体的⽅法内存地址上。

5）初始化执⾏类构造器 <clinit>() ⽅法的过程，真正开始执⾏Java代码来初始化类变量。这个⽅法由编译器⾃动收集类中所有静态变量的赋值动作和静态代码块合并⽽成。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-04-10/3b27abd9-ab2f-4ff4-b31f-76ee51504545/00d5436d1f4adcbc2f2414c0e925f1e30d8829b5e774c830769164804a278163.jpg)


双亲委派模型就是在这个过程中起作⽤的机制，它保证像 java.lang.Object 这种核⼼类不会被⾃定义类加载器重复加载，避免安全问题。

# 什么是Java中的双亲委派模型？

类加载器在加载⼀个类时，不会⾃⼰先动⼿，⽽是把请求往上抛给⽗类加载器去尝试加载。这个过程⼀层层向上委托，直到最顶层的启动类加载器（BootstrapClassLoader），这就叫双亲委派模型。

⽐如你写了个 java.lang.String ，想搞点⼩动作。但系统类加载器收到请求后，会⼀路委托给 BootstrapClassLoader。它发现⾃⼰已经加载过核⼼包⾥的String，直接返回，你的恶意类压根没机会加载。这样就保证了核⼼类库的安全性。

整个链条通常是这样的：应⽤类加载器 扩展类加载器 启动类加载器。每⼀级都优先让⽗级处理，只有⽗级搞不定时，才轮到⼦级出⼿。

当然也有例外，像JDBC或JNDI这种SPI场景就得打破双亲委派。这时候⽤Thread.getContextClassLoader() 拿到当前线程的类加载器，反向向下委托，才能加载⽤户实现的驱动或服务。

⾃定义类加载器时，⼀般也不建议随便破坏这个模型，除⾮你真的清楚后果，不然容易引发类冲突或重复加载问题。

Java 中 hashCode 和 equals ⽅法是什么？它们与 == 操作符有什么区别？

Java ⾥每个对象都继承⾃ Object 类，所以天然就有 hashCode 和 equals 这两个⽅法。 $= =$ 操作符⽐较的是变量指向的内存地址，看是不是同⼀个实例。

equals ⽅法默认⾏为其实和 $= =$ ⼀样，也是⽐地址。但它的设计意图是⽤来判断逻辑相等。⽐如两个 User 对象，id都是1001，我们觉得它们是“同⼀个⽤户”，就得重写 equals 去⽐较关键字段。

hashCode 的作⽤是为对象⽣成⼀个整型哈希值，主要⽤在哈希结构⾥，⽐如HashMap、HashSet。它有个硬性规定：如果两个对象 equals 返回true，那它们的 hashCode 必须相同。反过来不成⽴，不同对象可以有相同哈希值，这就是哈希冲突。

这两个⽅法通常⼀起重写。你把对象放进 HashMap 当 key 时，流程是这样的：

```java
// 举个例子  
public class User {  
    private Long id;  
}  
public boolean equals(Object o) {  
    // 标准写法略去null和类型判断  
    User u = (User) o;  
    return id.equals(u.id);  
}  
@override  
public int hashCode() {  
    return id.hashCode();  
}
```

1）先调 hashCode 定位到桶位置

2）再⽤ equals 和桶⾥的每个元素⽐较，确认是否存在

要是只重写 equals 不重写 hashCode ，同⼀个逻辑对象可能被当成两个key存进去，HashMap就乱了。这在实际开发中很容易踩坑，尤其是做缓存、去重的时候。

# 使⽤ new String("yupi") 语句在 Java 中会创建多少个对象？

这个问题看着简单，但得把字符串的底层机制理清楚。

⾸先，Java的字符串有常量池这个概念。当代码⾥出现字⾯量⽐如 "yupi" 时，JVM会在类加载阶段就把这个字符串放到字符串常量池⾥。所以 "yupi" 这个对象在常量池中只会有⼀份。

⽽ new String("yupi") 是运⾏时操作，它会强制在堆上创建⼀个新的String对象，哪怕常量池⾥已经有"yupi" 了。这个新对象的内容是拷⻉⾃常量池⾥的那个。

所以整个过程会创建⼏个对象？

1）如果 "yupi" 字符串是第⼀次使⽤，还没进常量池，那么先在常量池⾥创建⼀个。2）然后 new String() ⼜在堆上创建⼀个，独⽴的对象。

也就是说，最多可能创建2个对象：1个在常量池，1个在堆。

但通常⾯试题默认 "yupi" 已存在于常量池（⽐如之前⽤过），那 new String("yupi") 就只会在堆上创建 1 个新对象。

关键点在于：常量池对象是共享的，new 出来的对象是独⽴的，不⾛共享逻辑。

//示例  
String s = new String("yupi");  
//如果"yupi"没出现过 $\rightarrow 2$ 个对象  
//如果"yupi"已存在 $\rightarrow 1$ 个对象（仅堆上）

判断到底⼏个，得看上下⽂。但标准答案⼀般是：最多2个，最少1个。

# Java 中 final、finally 和 finalize 各有什么区别？

final、finally 和 finalize 这三个东西名字像，但完全是三码事，别搞混了。

final是个关键字，⽤来修饰类、⽅法、变量。被它修饰的类不能被继承，⽐如String类就是final的。修饰⽅法时，这⽅法就不能被⼦类重写。修饰变量，那这个变量就成了常量，必须初始化，⽽且之后不能再改。基本类型值不变，引⽤类型的话，引⽤地址不能变，但对象内部数据还是可以改的。

final int $x = 10$ // $\texttt{x} = 20$ //编译报错

finally是异常处理⾥的⼀个块，跟try搭配⽤。不管有没有异常，只要JVM没崩，finally⾥的代码⼀定会执⾏。常⽤来做资源清理，⽐如关闭⽂件流、数据库连接。不过注意，如果在try⾥调⽤了System.exit()，那就直接退出了，finally 也压根不经过。

```txt
try{ //可能出错的代码   
}finally{ //总会执行，比如close()   
}
```

finalize是Object类的⼀个⽅法，每个对象都有。以前设计是⽤来做垃圾回收前的清理⼯作，但现在根本不推荐⽤。因为它的执⾏时机完全不可控，可能永远不被调⽤，Java9开始已经标记为deprecated了。真要清理资源，应该⽤try-with-resources 或者⼿动 close。

这三个词唯⼀共同点就是都以"final"开头，别的啥关系都没有。

本资源来自面试鸭：https://www.mianshiya.com

推荐更多免费学编程资源：

1.编程导航学习网站：学编程、做项目、拿Offer！

2.企业高频面试题库：开始刷题，面试遇原题！

3.精选简历模板大全：1分钟搞定简历！

4.AI资源导航网站：获取最新AI黑科技！

5.1对1模拟面试：随时随地提升面试能力