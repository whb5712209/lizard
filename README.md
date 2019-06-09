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
<param >
    <query value='data/list.js' method='post'>
       <property name="id" type='Number'>100</property>
       <property name="name">*</property>
        <property name="flag" type='Boolean'>false</property>
       <property name='obj'>
            <property name='id'>10086</property>
       </property>
       <property name='classId'>10086</property>
       <property name='obj'>
            <property name='obj1'>
               <property name='obj2'>
                  <property name='obj3'>
                        <property>10087</property>
                        <property>10088</property>      
                  </property>
                  <property name='obj4'>
                        <property name='id'>aaaaa</property>
                        <property  name='storeId'>bbbbb</property>      
                  </property>
               </property>
            </property>
       </property>
       <property name='list'>
            <property>10087</property>
            <property>10088</property>
       </property>
       <property name='array'>
            <property>
               <property >1111</property>
               <property type='Number'>2222</property>
            </property>
            <property>
               <property type='Number'>3333</property>
               <property type='Number'>4444</property>
            </property>
       </property>
        <property name='array1'>
            <property >
               <property name='key' type='Number'>100</property>
               <property name='value'>*</property>
            </property>
            <property>
               <property name='key'>key2</property>
               <property  name='value'>value2</property>
            </property>
       </property>
    </query>
    <query  value='data/list.json'>
         <property name="id" type='Number'>100</property>
         <property name="name" >222</property>
    </query>
</param>
<!-- 转译为 -->
[
    {
        "id": 100,
        "name": "*",
        "flag": false,
        "obj": {
            "obj1": {
                "obj2": {
                    "obj3": [
                        "10087",
                        "10088"
                    ],
                    "obj4": {
                        "id": "aaaaa",
                        "storeId": "bbbbb"
                    }
                }
            }
        },
        "classId": "10086",
        "list": [
            "10087",
            "10088"
        ],
        "array": [
            [
                "1111",
                2222
            ],
            [
                3333,
                4444
            ]
        ],
        "array1": [
            {
                "key": 100,
                "value": "*"
            },
            {
                "key": "key2",
                "value": "value2"
            }
        ],
        "__url__": "data/list.js"
    },
    {
        "id": 1001,
        "name": "*",
        "__url__": "data/list.json"
    }
]
```
### xml详解
1. 所有的内容都包裹在param标签内
2. 每个query标签内都包裹着一组用来匹配请求参数的数据,当匹配到一个query标签时,去取出value里面的路径,查找到具体文件,读取并返回(此处的目录相对于根目录)
3. property可以支持类型参数,可以使用type指定参数类型(不包括数组,对象),默认类型为String
4. 数组,对象等可以使用property嵌套的方式完成,若嵌套内容无name将会最为数组输出,若嵌套对象有名称则做对象输出
5. 优先级:完全匹配 > *(星号) > 无
6. 一般query里面为空会当做默认值输出


### todo

- [x] xml:property参数中对象数据,将以标签嵌套的形式处理
- [ ] 将数据源与代码分离
