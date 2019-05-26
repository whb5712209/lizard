# 极简mock工具
> 简单配置  
> 支持参数
###  安装

```
git clone git@github.com:whb5712209/lizard.git
cd lizard && npm install
```
### 启动
```
npm start // 开发
```
```
// vscode中直接启动,用于扩展开发
```
### 使用须知
1.  config/index.js 文件中 resourcePath指定数据访问来源
2.  启动服务后,请求`api`,`api1`,`ap2`,`api3`将会被过滤到mock数据,api后面的路径会转换成文件路径,在resourcePath目录中查找
3.  mock数据类型支持XML,json,js
    1. json:`直接输出`
    2. js非函数类型:`直接输出`
    3. js函数类型:`执行函数,并且输出结果`
    4. xml:主要功能是用来过滤参数,同样的请求地址不同的参数,可以返回不同的结果

### xml/多参数支持
> 为了实现对mock数据多参数的支持此处引入了`xml`

### xml示例
```
<?xml version="1.0" encoding="UTF-8"?>
<param>
    <query value='xxx/xxx1.js'>
       <property name="id" value='10086' ></property>
       <property name="name" value='tom' ></property>
    </query>
    <query value='xxx/xxx2.json'>
      <property name="id" value='10086' ></property>
      <property name="name" value='*' ></property>
    </query>
    <query value='xxx/xxx3.json'>
      <property name="id" value='10086' ></property>
    </query>
    <query value='xxx/xxx4.json'></query>
</param>
```
### xml详解
1. 所有的内容都包裹在param标签内
2. 每个query标签内都包裹着一组用来匹配请求参数的数据,当匹配到一个query标签时,去取出value里面的路径,查找到具体文件,读取并返回(此处的目录相对于根目录)
3. property可以支持类型参数,可以使用type指定参数类型,默认类型为String
   1. String
   2. Number
   3. Boolean
   4. Object (在指定Object,类型时候需要可以json字符串的形式存入)
   5. Array  (在指定Array,类型时候需要可以json字符串的形式存入)
4. 优先级:完全匹配 > *(星号) > 无
5. 一般query里面为空会当做默认值输出


### todo

- [ ] xml:property参数中对象数据,将以标签嵌套的形式处理
