# kgrid

## 一. 简介
如果你想用异步请求的方式去查询符合条件的记录， 并把返回的json对象解析后渲染到table中，而且还想根据返回的总记录数自动生成分页（支持真分页、假分页和不分页）， 那就试试这个插件吧！

## 二. 插件依赖
kgrid插件是依赖于jQuery和Bootstrap的, 使用前请先引入jQuery和Bootstrap, 然后再引入[kgrid.min.js](http://kangyonggan.com/static/app/js/kgrid.min.js)

```html
<head>
    <link href="static/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <script src="static/libs/jquery/jquery.min.js"></script>
    <script src="http://kangyonggan.com/static/app/js/kgrid.min.js"></script>
</body>
```

## 三. 例子

有图有真相, no图no bb

![kgrid](http://kangyonggan.com/static/app/images/kgrid.png)

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>index</title>
    <link href="static/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="static/app/css/index.css" rel="stylesheet">
</head>
<body>

<div class="space-20"></div>

<div class="col-xs-8 col-xs-offset-2">

    <div class="row">
        <div class="col-xs-12">
            <form id="user-search-form" action="user">
                <div class="form-group col-xs-4">
                    <div class="input-group">
                        <span class="input-group-addon">姓名</span>
                        <input type="text" name="username" class="form-control" placeholder="请输入姓名"/>
                    </div>
                </div>
                <div class="form-group col-xs-4">
                    <div class="input-group">
                        <span class="input-group-addon">邮箱</span>
                        <input type="text" name="email" class="form-control" placeholder="请输入邮箱"/>
                    </div>
                </div>
                <div class="form-group col-xs-4">
                    <div class="input-group">
                        <span class="input-group-addon">手机号</span>
                        <input type="text" name="mobile" class="form-control" placeholder="请输入手机号"/>
                    </div>
                </div>
                <div class="form-group col-xs-4">
                    <div class="input-group">
                        <span class="input-group-addon">省份</span>
                        <select id="province" name="province" class="form-control">
                            <option value="00">-- 请选择省份 --</option>
                            <option value="01">安徽省</option>
                            <option value="02">江苏省</option>
                            <option value="02">河南省</option>
                        </select>
                    </div>
                </div>

                <div class="col-xs-12">
                    <button type="submit" id="user-search" class="btn btn-primary">查询</button>

                    <div class="pull-right">
                        <button type="button" id="user-add" class="btn btn-success">添加</button>
                        <button type="button" id="user-del" class="btn btn-danger">删除</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="space-20"></div>

    <div class="row">
        <div class="col-xs-12">
            <table id="user-table" class="table table-bordered table-striped table-hover"></table>
        </div>
    </div>
</div>

<script src="static/libs/jquery/jquery.min.js"></script>
<script src="static/app/js/kgrid.min.js"></script>
<script src="static/app/js/index.js"></script>
</body>
</html>
```

### `index.css`

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

### `index.js`

```js
$(function () {

    var options = {
        multi: true,
        type: 1,
        fields: {
            id: "ID",
            username: "姓名",
            email: "邮箱",
            mobile: "手机号",
            province: "省份"
        },
        form: "user-search-form"
    };
    var userTable = $("#user-table").kgrid(options);

    $("#user-search").click(function () {
        userTable.kgrid("load");
        return false;
    });

    $("#user-add").click(function () {
        alert("弹出添加框");
    });

    $("#user-del").click(function () {
        var items = userTable.kgrid("selected");
        if (items.length == 0) {
            alert("至少选择一条记录!");
            return;
        }

        var ids = [];
        for (var i = 0; i < items.length; i++) {
            ids[i] = items[i].id;
        }

        alert("删除ids:" + ids);
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

## 四. kgrid文档说明

### `配置`

所有配置均可通过`options`来配置, 如:

```
var options = {
    fields: {
        id: "ID",
        username: "姓名",
        email: "邮箱",
        mobile: "手机号",
        province: "省份"
    },// 必填项
    form: "user-search-form",// 必填项
    
    empty: "Empty item Of Search",// 默认配置
    multi: false,// 默认配置 false:单选, true:多选
    type: 0,// 默认配置 0: 不分页, 1: 真分页, 2: 假分页
    pageSize: 10,// 默认配置
    maxPage: 5,// 默认配置
    beforeSend: function(url, data) {
        //alert("查询请求提交之前会调用此方法");
    },// 默认配置
    complete: function(result) {
        //alert("查询请求返回之后会调用此方法");
    }// 默认配置
};
```

也可以调用方法去设置上面这些配置的值

```js
userTable.kgrid(key, value);
```

比如:设置分页大小为每页20条

```js
userTable.kgrid("pageSize", 20);
```

- `fields` 

    必填项, 是一个对象, 目前没做输入校验, 请自觉输入一个类似上面的对象, 请参照例子中的`图`和后台返回的`json数据`理解名值对的意义.
    
- `form`

    必填项, 是form的id, form中的输入会自动的作为参数传到后台, form的url为请求的地址, 目前只做get请求的查询, 请求为异步, 请求时只需要调用`userTable.kgrid("load");`

- `empty` 

    默认值为"Empty item Of Search", 在查询结果为空的时候显示在表格中

- `multi`

    默认值为`false`, 表示可以多选, 设为`true`后可以多选

- `type`

    默认值为`0`, 表示不分页, 默认配置 0: 不分页, 1: 真分页, 2: 假分页

- `pageSize`

    默认值为`10`, 表示每页大小为1条记录
    
- `maxPage`

    默认值为`5`, 表示显示5个分页按钮
    
- `beforeSend`

    默认值为`function(url, data) {}`, 在请求提交之前会调用此方法, url是即将提交的地址, 可以在此方法内修改请求的url, 例如`function(url, data) {userTable.kgrid("url", "/menu");}`, data是即将提交的参数, 也可以修改参数 `userTable.kgrid("data", {key: value});`
    
    
- `complete`

    默认值为`function(result) {}`, 在请求返回之后会调用此方法, result是后台返回的`json数据`, 请看上文的json数据长什么样的
    
### `方法`

`init` 方法

初始化时调用

`load` 方法

发出get异步请求, 会带上form中的参数, 局部刷新表格及分页(如果配置了分页), 用法如下:

```js
userTable.kgrid("load");// 加载第一页
userTable.kgrid("load", 1);// 加载第一页
userTable.kgrid("load", n);// 加载第n页
```


`jump` 方法

发出get异步请求, 但是不会带上form中的参数, 局部刷新表格及分页(如果配置了分页), 异步用于分页的跳转, 用法如下:

```js
userTable.kgrid("jump");// 跳转至第一页
userTable.kgrid("jump", 1);// 跳转至第一页
userTable.kgrid("jump", n);// 跳转至第n页
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
userTable.kgrid("url", "/menu");// set
```

类似这样的有get和set的属性有:

`url` `data` `pageSize` `multi` `maxPage` `type` 

`fields` `empty` `items` `beforeSend` `complete`

还有几个只有get没有set的属性, 如下:

```js
var version = userTable.kgrid("version"); // 获取当前插件的版本号
var author = userTable.kgrid("author"); // 获取当前插件的作者
var date = userTable.kgrid("date"); // 获取当前插件的最后跟新时间
```

## 五. 后续

由于时间和精力以及能力有限, 此插件还有很多地方没去完善, 毕竟从开始写插件, 到写完插件说明文档(就是这篇文章)就一天半的时间, 而且早上还去做入职体检.

比如:对于一些输入没有去做校验, 后台传回的json要求太苛刻, key必须为"items"等

也没有经过专业的测试, 目的只是为了在这次工作中使用. 所以可能不怎么适合其他人使用, 符合条件的使用者应该不多.

如果有时间,我会再完善一下, 目测应该没时间, 我还要搞其他东西.
