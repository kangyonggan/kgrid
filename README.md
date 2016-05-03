# kgrid

参考文献: [http://kangyonggan.com/2016/04/02/jqueryplugin01](http://kangyonggan.com/2016/04/02/jqueryplugin01)

项目托管地址: [https://github.com/kangyonggan/kgrid](https://github.com/kangyonggan/kgrid)

### 一. 简介
如果你想用异步请求的方式去查询符合条件的记录， 并把返回的json对象解析后渲染到table中，而且还想根据返回的总记录数自动生成分页（支持真分页、假分页和不分页）， 那就试试这个插件吧！

### 二. 插件依赖
kgrid插件是依赖于jQuery和Bootstrap的, 使用前请先引入jQuery和Bootstrap, 然后再引入[kgrid.js](http://kangyonggan.com/static/app/js/kgrid.js) 和 [kgrid.css](http://kangyonggan.com/static/app/css/kgrid.css)

```html
<head>
    <link href="static/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="http://kangyonggan.com/static/app/css/kgrid.css" rel="stylesheet">
</head>

<body>
    <script src="static/libs/jquery/jquery.min.js"></script>
    <script src="http://kangyonggan.com/static/app/js/kgrid.js"></script>
</body>
```

### 三. 例子

有图有真相, no图no bb

![kgrid](http://kangyonggan.com/static/app/images/kgrid.png)

#### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>index</title>
    <link href="static/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="static/app/css/index.css" rel="stylesheet">
    <link href="static/app/css/kgrid.css" rel="stylesheet">
</head>
<body>

<div class="space-20"></div>

<div class="col-xs-8 col-xs-offset-2">

<div class="row">
    <button type="submit" id="user-search" class="btn btn-primary">查询</button>

    <div class="space-20"></div>

    <div class="row">
        <div class="col-xs-12">
            <table id="user-table" class="table table-bordered table-striped table-hover"></table>
        </div>
    </div>
</div>

<script src="static/libs/jquery/jquery.min.js"></script>
<script src="static/app/js/kgrid.js"></script>
<script src="static/app/js/index.js"></script>
</body>
</html>
```

#### `index.css`

```css
* {
    margin: 0;
    padding: 0;
}

.space-20 {
    clear: both;
    height: 20px;
}
```

#### `index.js`

```js
$(function () {
    var options = {
        url: "user",
        fields: [{
            name: "id",
            text: "ID",
            width: "10%"
        }, {
            name: "username",
            text: "姓名",
            hide: false,
            format: function (val, item) {
                return "<span style='color: red;'>" + val + "</span>";
            }
        }, {
            name: "email",
            text: "邮箱",
            hide: true
        }]
    };

    var userTable = $("#user-table").kgrid(options);

    $("#user-search").click(function () {
        userTable.kgrid("load");
        return false;
    });
});
```

后台返回的json数据

```json
{
    "total": 2345, 
    "status": "success", 
    "items":
    [{
        "email": "kangyonggan@gmail.com",
        "id": 1001,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {
        "email": "kangyonggan@gmail.com",
        "id": 1002,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {
        "email": "kangyonggan@gmail.com",
        "id": 1003,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {
        "email": "kangyonggan@gmail.com",
        "id": 1004,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {
        "email": "kangyonggan@gmail.com",
        "id": 1005,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {
        "email": "kangyonggan@gmail.com",
        "id": 1006,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {
        "email": "kangyonggan@gmail.com",
        "id": 1007,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {
        "email": "kangyonggan@gmail.com",
        "id": 1008,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {
        "email": "kangyonggan@gmail.com",
        "id": 1009,
        "mobile": "18221372104",
        "province": "安徽省",
        "username": "康永敢"
    }, {"email": "kangyonggan@gmail.com", "id": 1010, "mobile": "18221372104", "province": "安徽省", "username": "康永敢"}]
}
```

其中, status 和 items 为必送项, total仅在真分页必送

### 四. kgrid文档说明

#### `配置`

所有配置均可通过`options`来配置, 如:

```js
var options = {
        url: "user",// url 和 form 至少必配一个
        fields: [{
            name: "id",
            text: "ID",
            width: "10%"
        }, {
            name: "username",
            text: "姓名",
            hide: false,
            format: function (val, item) {
                return "<span style='color: red;'>" + val + "</span>";
            }
        }, {
            name: "email",
            text: "邮箱",
            hide: true
        }],// 列表的字段, 必填!
        
        // 下面不是必填项, 默认配置如下
        empty: "Empty item Of Search",
        serNo: {
            width: "8%",
            text: "序号"
        },
        form: undefined,
        multi: {
            enabled: true,
            width: "8%",
            text: "全选"
        },
        pageType: 0,
        pageSize: 6,
        maxPageBtn: 5,
        beforeSend: function (data) {
            return data;
        },
        success: function (result) {
        },
        failure: function (result) {
        }
    };
```

各个配置的说明见下文, 也可以调用方法去动态的设置配置的值

```js
userTable.kgrid(key, value);
```

比如:设置分页大小为每页20条

```js
userTable.kgrid("pageSize", 20);
```

- `fields` 

    必填项, 是一个数组, 数组中的每一个元素表示一个列, 目前没做输入校验, 请自觉输入一个类似上面的对象, 请参照例子中的`图`和后台返回的`json数据`理解名值对的意义.
    
- `form`

    是form的id, 如果配置了此项, form的action会作为请求的url(如果同时配置了url和form, 则优先使用url), form中的数据会自动的作为参数传到后台, 目前只做get请求的查询, 请求为异步, 请求时只需要调用`userTable.kgrid("load");`
    但是在分页跳转页面时是不带form中最新的数据的

- `url`
    
    是请求的url

- `empty` 

    默认值为"Empty item Of Search", 在查询结果为空的时候显示在表格中

- `multi`

    默认值为`multi: {enabled: true, width: "8%", text: "全选" }`, 其中`enabled`表示允许多选, `width` 表示此列的宽度, `text` 表示显示在表头的名称

- `serNo`

    默认值为`serNo: {width: "8%", text: "序号"}`, 显示每行的序号, `width` 表示列的宽度, `text` 表示显示在表头的名称

- `pageSize`

    默认值为`6`, 表示每页显示6条记录
    
- `maxPageBtn`

    默认值为`5`, 表示显示5个分页按钮
        
- `pageType`

    默认值为`0`, 表示不分页, 0: 不分页, 1: 真分页(后台必须传total到前台), 2: 假分页(items.length将自动作为total)
    
- `beforeSend`

    默认值为`function(data) {return data;}`, 调用load方法的get请求之前会调用此方法
    
- `success`

    默认值为`function(result) {}`, load方法成功时会调用此方法
    
- `failure`

    默认值为`function(result) {}`, load方法失败时会调用此方法
    
#### `方法`

`init` 方法

初始化时调用(不要主动调用)

`load` 方法

发出get异步请求, 会带上form中的参数(如果配置了form选项), 局部刷新表格及分页(如果配置了分页), 分页跳转时请不要使用此方法, 而是使用`jump`方法, 用法如下:

```js
userTable.kgrid("load");
```

`jump` 方法

专用于分页跳转, 如果是真分页, 会发出get异步请求, 但是不会带上form中的`最新参数`, 而是使用之前的参数(会保存在插件的数据空间), 局部刷新表格及分页(如果配置了分页), 
如果是假分页, 则不发出get请求, 而是加载原先的数据, 用法如下:

```js
userTable.kgrid("jump");// 跳转至第一页
userTable.kgrid("jump", 1);// 跳转至第一页
userTable.kgrid("jump", n);// 跳转至第n页
```

`flush` 方法

用于刷新表格, 如果items中的数据有改变, 则会自动渲染在表格中, 用法如下:

```js
var items = userTable.kgrid("flush");
```

`append` 方法

用于向表格中追加一条记录, 自带时时刷新, 不需要再次调用`flush`刷新, 用法如下:

```js
var items = userTable.kgrid("append", "<tr><td>...</td><td>...</td><td>...</td></tr>");
```

`selected`方法

用于获取所选择的行, 返回一个数组, 数组中的每个对象代表一行, 用法如下:

```js
var items = userTable.kgrid("selected");
```

`get & set` 方法

就是一些属性配置的get和set方法, 用法如下:

```js
var url = userTable.kgrid("url");// get
userTable.kgrid("url", "dashboard/menu");// set
```

类似这样的有get和set的属性有:

`pageNo` `items` `data` `url` `pageSize` `pageType` 

`maxPageBtn` `empty` `fields` `serNo` `form` `success` `failure` `beforeSend`

还有几个只有get没有set的属性, 如下:

```js
var author = userTable.kgrid("classOfIgnore"); // 给行加上此class, 选择行时会忽略此行
var version = userTable.kgrid("version"); // 获取当前插件的版本号
var author = userTable.kgrid("author"); // 获取当前插件的作者
var date = userTable.kgrid("updatedtime"); // 获取当前插件的最后跟新时间
```

### 五. 后续

比如:对于一些输入没有去做校验, 后台传回的json要求太苛刻, key必须为"items"等

也没有经过专业的测试, 目的只是为了在这次工作中使用. 所以可能不怎么适合其他人使用, 符合条件的使用者应该不多.

如果有时间,我会再完善一下, 目测应该没时间, 我还要搞其他东西.

