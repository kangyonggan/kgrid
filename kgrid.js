(function ($) {
    $.fn.kgrid = function (options) {

        /**
         * 插件名称
         */
        var PLUGIN_NAME = "kgrid";

        /**
         * 当前版本
         */
        var VERSION = "v1.2.0";

        /**
         * 作者
         */
        var AUTHOR = "康永敢";

        /**
         * 最后跟新时间
         */
        var UPDATEDTIME = "2016-04-29 00:13:09";

        /**
         * table对象
         */
        var $this = $(this);

        /**
         * table的id
         */
        var idOfTable = $this.attr("id");

        /**
         * table的tbody
         */
        var $tbody = $("#" + idOfTable + " tbody");

        /**
         * 分页按钮的id
         *
         * @type {string}
         */
        var idOfPageBtn = idOfTable + "-page-btn";

        /**
         * 分页信息的id
         *
         * @type {string}
         */
        var idOfPageInfo = idOfTable + "-page-info";

        /**
         * 分页首页按钮的class
         *
         * @type {string}
         */
        var classOfPageBtnFirst = idOfTable + "-page-btn-first";

        /**
         * 分页上一页按钮的class
         *
         * @type {string}
         */
        var classOfPageBtnPre = idOfTable + "-page-btn-pre";

        /**
         * 分页下一页按钮的class
         *
         * @type {string}
         */
        var classOfPageBtnNext = idOfTable + "-page-btn-next";

        /**
         * 分页尾页按钮的class
         *
         * @type {string}
         */
        var classOfPageBtnLast = idOfTable + "-page-btn-last";

        /**
         * 其他分页按钮的class
         *
         * @type {string}
         */
        var classOfPageBtnOther = idOfTable + "-page-btn-other";

        /**
         * thead多选框的class
         */
        var classOfHeadCheck = idOfTable + "-head-checkbox";

        /**
         * tbody多选框的class
         */
        var classOfBodyCheck = idOfTable + "-body-checkbox";

        /**
         * tbody忽略选择的class
         */
        var classOfIgnore = idOfTable + "-ignore";

        /**
         * get请求之前调用此方法
         *
         * @param data
         * @returns {*}
         */
        var beforeSend = function (data) {
            return data;
        };

        /**
         * get请求成功之后调用此方法
         *
         * @param result
         * @returns {*}
         */
        var success = function (result) {
        };

        /**
         * get请求失败之后调用此方法
         *
         * @param result
         * @returns {*}
         */
        var failure = function (result) {
        };

        /**
         * 发送get请求
         *
         * @param data
         */
        var send = function (data) {
            $.get(getData("url"), data, function (result) {
                if (typeof result == "string") {
                    result = eval('(' + result + ')');
                }
                if (result) {
                    if (result.status == "success") {
                        // 把数据写入数据空间
                        var pageType = getData("pageType");

                        setData("items", result.items);
                        if (pageType == 1) {
                            setData("total", result.total);
                        } else {
                            setData("total", result.items.length);
                        }
                        flush();

                        // 调用请求成功后的回调函数
                        $this.data(PLUGIN_NAME).success(result);
                    } else {
                        $this.data(PLUGIN_NAME).failure(result);
                    }
                } else {
                    $this.data(PLUGIN_NAME).failure(result);
                }
            });
        };

        /**
         * 向数据空间中数据
         *
         * @param key
         * @param val
         */
        var setData = function (key, val) {
            var cfg = $this.data(PLUGIN_NAME);
            cfg[key] = val;
            $this.data(PLUGIN_NAME, cfg);
        };

        /**
         * 从数据空间中数据
         *
         * @param key
         * @returns {*}
         */
        var getData = function (key) {
            return $this.data(PLUGIN_NAME)[key];
        };

        /**
         * 初始化校验
         *
         * @param options
         */
        var valid = function (options) {
            if (!options) {
                $.error("Not bind options on kgrid plugin!");
                return;
            }
            if (options.fields == undefined) {
                $.error("Not bind fields on kgrid plugin!");
                return;
            }
        };

        /**
         * 刷新tbody, 根据传入的result
         *
         * @returns {*|HTMLElement}
         */
        var flush = function () {
            writeBody();
            writePageBtn();
            writePageInfo();

            return $this;
        };

        /**
         * 写thead, 根据配置初始化表头, 只在初始化时调用
         *
         * @param options
         * @returns {*|HTMLElement}
         */
        var writeHead = function (options) {
            var thead = "<thead><tr>";

            // 判断是否支持多选
            if (options.multi.enabled) {
                thead += "<th width='" + options.multi.width + "'><input type='checkbox' class='" + classOfHeadCheck + "'/> " + options.multi.text + "</th>";
            }

            thead += "<th width='" + options.serNo.width + "'>" + options.serNo.text + "</th>";

            var fields = options.fields;

            // 循环写入fields
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];

                // 显示在thead的列名
                var text = field.text;

                // 判断是否显示这个字段
                if (!field.hide) {
                    var width = field.width;
                    if (width != undefined) {
                        thead += "<th width='" + width + "'>" + text + "</th>";
                    } else {
                        thead += "<th>" + text + "</th>";
                    }
                }

            }
            thead += "</tr></thead>";

            // 把thead接到table里
            $this.append(thead);

            // 给thead多选框绑定 全选/全不选 的单击事件
            if (options.multi.enabled) {
                $("." + classOfHeadCheck).click(function () {
                    // tbody中的全部多选框
                    var $allBodyCheck = $("." + classOfBodyCheck);

                    if ($("." + classOfHeadCheck).is(":checked")) {
                        // 全选
                        $allBodyCheck.prop("checked", true);
                        $allBodyCheck.parent().parent().addClass("selected");
                    } else {
                        // 全不选
                        $allBodyCheck.prop("checked", false);
                        $allBodyCheck.parent().parent().removeClass("selected");
                    }
                });
            }

            return $this;
        };

        /**
         * 把null, undefined转为""
         *
         * @param val
         * @returns {*}
         */
        var trim = function (val) {
            if (val == undefined || val == null) {
                return "";
            }
            return val;
        };

        /**
         * 写tbody
         *
         * @param result
         * @returns {*|HTMLElement}
         */
        var writeBody = function () {
            // 清空tbody
            $tbody.empty();

            var items = getData("items");

            // 把items写入tbody
            var tbody = "";
            if (!items || items.length == 0) {
                // 查询记录为空时显示的tr
                tbody += "<tr class='" + classOfIgnore + "'><td colspan='100'><div class='empty'>" + getData('empty') + "</div></td></tr>";
                tbody += "</tbody>";

                // 把tbody拼接到table之后
                return $this.append(tbody);
            }

            var fields = getData("fields");
            var multi = getData("multi");
            var pageNo = getData("pageNo");
            var pageSize = getData("pageSize");

            // 循环的把items拼接到tbody
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // 拼接tbody的tr
                var tr = "<tr class='tr-cursor'>";

                // 判断是否多选
                if (multi.enabled) {
                    tr += "<td><input type='checkbox' class='" + classOfBodyCheck + "'/></td>";
                }

                tr += "<td>" + ((pageNo * 1 - 1) * pageSize + 1 + i) + "</td>";

                // 循环拼接每个字段
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];

                    // 对应实体属性
                    var name = field.name;

                    // 用户判断是否隐藏
                    var hide = field.hide;
                    if (!hide) {
                        // 数据格式化
                        var format = field.format;
                        var val = item[name];

                        val = trim(val);

                        if (format != undefined) {
                            val = format(val, item);
                        }

                        tr += "<td>" + val + "</td>";
                    }
                }
                tr += "</tr>";
                tbody += tr;
            }

            tbody += "</tbody>";
            // 把tbody拼接到table之后
            $this.append(tbody);

            // 绑定tbody中多选框的 选择/取消 事件
            var $trs = $("#" + idOfTable + " tbody tr").not("." + classOfIgnore);
            $trs.click(function () {
                if (multi.enabled) {// 多选的情况
                    // 当前点击的tr所在行的checkbox
                    var $checkInput = $($(this).children("td")[0]).children("input");

                    if ($checkInput.is(":checked")) {
                        $checkInput.prop("checked", false);
                        $(this).removeClass("selected");
                    } else {
                        $checkInput.prop("checked", true);
                        $(this).addClass("selected");
                    }
                } else {// 单选的情况
                    if ($(this).attr("class") && $(this).attr("class").indexOf("selected") != -1) {
                        $(this).removeClass("selected");
                        $trs.css("border-left", "");
                    } else {
                        $trs.removeClass("selected");
                        $(this).addClass("selected");
                        $trs.css("border-left", "");
                        $(this).css("border-left", "3px solid green");
                    }
                }
            });

            return $this;
        };

        /**
         * 写分页按钮
         *
         * @returns {*|HTMLElement}
         */
        var writePageBtn = function () {
            $("#" + idOfPageBtn).remove();

            var pageType = getData("pageType") * 1;
            if (pageType == 0) {
                return $this;
            }

            var total = getData("total") * 1;
            if (!total) {
                return $this;
            }
            var pageSize = getData("pageSize") * 1;
            var pageCount = Math.floor((total - 1) / pageSize + 1);
            var pageNo = getData("pageNo") * 1;
            var maxPageBtn = getData("maxPageBtn") * 1;

            var page = "<nav id='" + idOfPageBtn + "' class='pull-left'>";
            page += "<ul class='pagination'>";
            page += "<li><a href='javascript:' class='" + classOfPageBtnFirst + "'>&laquo;</a></li>";
            page += "<li><a href='javascript:' class='" + classOfPageBtnPre + "'>&lsaquo;</a></li>";

            var start = pageNo - Math.floor(maxPageBtn / 2);
            var end = pageNo + Math.floor(maxPageBtn / 2);

            if (start < 1) {
                end += 1 - start;
            }

            if (end > pageCount) {
                start -= end - pageCount;
            }

            start = Math.max(1, start);
            end = Math.min(pageCount, end);

            for (var i = start; i <= end; i++) {
                if (i == pageNo) {
                    page += "<li class='active'><a href='javascript:' class='" + classOfPageBtnOther + "'>" + i + "</a></li>";
                } else {
                    page += "<li><a href='javascript:' class='" + classOfPageBtnOther + "'>" + i + "</a></li>";
                }
            }

            page += "<li><a href='javascript:' class='" + classOfPageBtnNext + "'>&rsaquo;</a></li>";
            page += "<li><a href='javascript:' class='" + classOfPageBtnLast + "'>&raquo;</a></li>";
            page += "</ul></nav>";
            $this.after(page);

            $("." + classOfPageBtnFirst).click(function () {
                $this.kgrid("jump", 1);
            });
            $("." + classOfPageBtnPre).click(function () {
                $this.kgrid("jump", Math.max(1, pageNo - 1));
            });
            $("." + classOfPageBtnOther).click(function () {
                $this.kgrid("jump", $(this).text() * 1);
            });
            $("." + classOfPageBtnNext).click(function () {
                $this.kgrid("jump", Math.min(pageNo + 1, pageCount));
            });
            $("." + classOfPageBtnLast).click(function () {
                $this.kgrid("jump", pageCount);
            });

            return $this;
        };

        /**
         * 写分页信息
         *
         * @returns {*|HTMLElement}
         */
        var writePageInfo = function () {
            $("#" + idOfPageInfo).remove();

            var pageType = getData("pageType") * 1;
            if (pageType == 0) {
                return $this;
            }

            var total = getData("total") * 1;
            if (!total) {
                return $this;
            }
            var pageSize = getData("pageSize") * 1;
            var pageCount = Math.floor((total - 1) / pageSize + 1);
            var pageNo = getData("pageNo") * 1;

            var pageInfo = "<nav id='" + idOfPageInfo + "' class='pull-right'>";
            pageInfo += "<ul class='pagination'>";
            pageInfo += "<li><a href='javascript:' class='page-info'>" + pageNo + " of " + pageCount + " page, " + ((pageNo - 1) * pageSize + 1) + "~" + pageNo * pageSize + " of " + total + " item</a></li>";
            pageInfo += "</ul></nav>";
            $this.after(pageInfo);
            return $this;
        };

        var methods = {
            /**
             * 只在初始化时调用一次
             *
             * @param options
             * @returns {*|HTMLElement}
             */
            init: function (options) {
                /**
                 * 默认配置
                 */
                var defaults = {
                    empty: "Empty item Of Search",// 结果集为空的时候的提示信息
                    fields: undefined,// 字段 必填
                    serNo: {
                        width: "8%",
                        text: "序号"
                    },
                    url: undefined,// 请求的url
                    form: undefined,// 绑定的表单, 调用load时会把form中的字段加到请求头
                    multi: {
                        enabled: true,
                        width: "8%",
                        text: "全选"
                    },// 是否多选
                    pageType: 0,// 0: 不分页, 1: 真分页(后台必须传total到前台), 2: 假分页
                    pageSize: 6,// 每页显示记录数
                    maxPageBtn: 5,// 分页按钮的个数
                    beforeSend: beforeSend,// 调用load方法的get请求之前会调用此方法
                    success: success,// load方法成功时会调用此方法
                    failure: failure// load方法失败时会调用此方法
                };

                // options没的就使用defaults的默认值
                options = $.extend(defaults, options);

                // 校验options
                valid(options);

                // 把数据写入插件数据空间
                $this.data(PLUGIN_NAME, options);

                // 如果没配置url, 则使用form.action
                if (options.form != undefined && options.url == undefined) {
                    setData("url", $("#" + options.form).attr("action"));
                }

                // 写表头
                writeHead(options);

                // 刷新
                flush();

                return $this;
            },

            /**
             * 会带上最新参数去后台请求, 分页跳转请调用jump方法
             *
             * @returns {*|HTMLElement}
             */
            load: function () {
                var form = getData("form");
                var data = {};
                // 判断是否绑定了表单, 如果绑定了表单, 就把表单参数传给后台
                if (form != undefined) {
                    var a = $("#" + form).serializeArray();
                    $.each(a, function () {
                        if (data[this.name] !== undefined) {
                            if (!data[this.name].push) {
                                data[this.name] = [data[this.name]];
                            }
                            data[this.name].push(this.value || '');
                        } else {
                            data[this.name] = this.value || '';
                        }
                    });
                }

                // 判断是否是真分页, 如果是真分页就需要把pageNo和pageSize传给后台
                var pageType = getData("pageType");
                if (pageType == 1) {
                    data.pageSize = getData("pageSize");
                    data.pageNo = 1;
                }

                // get请求之前调用此方法(可以覆写)
                data = $this.data(PLUGIN_NAME).beforeSend(data);

                // 把当前页写进数据空间
                if (pageType == 1) {
                    setData("data", data);
                } else {
                    setData("data", {});
                }

                // 需要把当前页放入数据空间供生成序号时使用
                setData("pageNo", 1);

                // 发出get请求
                return send(data);
            },

            /**
             * 不会带上最新参数去后台请求, 分页跳转专用的方法
             *
             * @returns {*|HTMLElement}
             */
            jump: function (pageNo) {
                // 需要把当前页放入数据空间供生成序号时使用
                setData("pageNo", pageNo);

                // 判断是否是真分页, 如果是真分页就需要把pageNo传给后台(其余的数据使用data中的老数据)
                var pageType = getData("pageType");
                var data = getData("data");
                if (pageType == 1) {
                    data.pageNo = pageNo;
                } else if (pageType == 2) {
                    // 假分页不需要去后台查询, 直接更改pageNo, 然后刷新flush
                    flush();
                    $this.data(PLUGIN_NAME).success({items: getData("items"), total: getData("total")});
                    return $this;
                }

                // 发出get请求
                return send(getData("data"));
            },

            /**
             * 取得所选择的行
             *
             * @returns {Array}
             */
            selected: function () {
                var returnItems = [];
                var multi = getData("multi");
                var pageNo = getData("pageNo") * 1;
                var pageSize = getData("pageSize") * 1;
                var items = getData("items");

                var $selectedTrs = $("#" + idOfTable + " .selected");
                for (var i = 0; i < $selectedTrs.length; i++) {
                    var serNo = 1;
                    if (multi.enabled) {
                        serNo = $($($selectedTrs[i]).children("td")[1]).text() * 1;
                    }
                    serNo = serNo - (pageNo - 1) * pageSize - 1;
                    returnItems[i] = items[serNo];
                }

                return returnItems;
            },
            /**
             * 刷新界面, 如果数据或配置有变化会重新渲染
             */
            flush: function () {
                flush();
            },
            items: function (items) {
                if (items == undefined) {
                    return getData("items");
                } else {
                    setData("items", items);
                }
            },
            pageNo: function (pageNo) {
                if (pageNo == undefined) {
                    return getData("pageNo");
                } else {
                    setData("pageNo", pageNo);
                }
            },
            data: function (data) {
                if (data == undefined) {
                    return getData("data");
                } else {
                    setData("data", data);
                }
            },
            url: function (url) {
                if (url == undefined) {
                    return getData("url");
                } else {
                    setData("url", url);
                }
            },
            pageSize: function (pageSize) {
                if (pageSize == undefined) {
                    return getData("pageSize");
                } else {
                    setData("pageSize", pageSize);
                }
            },
            pageType: function (pageType) {
                if (pageType == undefined) {
                    return getData("pageType");
                } else {
                    setData("pageType", pageType);
                }
            },
            maxPageBtn: function (maxPageBtn) {
                if (maxPageBtn == undefined) {
                    return getData("maxPageBtn");
                } else {
                    setData("maxPageBtn", maxPageBtn);
                }
            },
            empty: function (empty) {
                if (empty == undefined) {
                    return getData("empty");
                } else {
                    setData("empty", empty);
                }
            },
            fields: function (fields) {
                if (fields == undefined) {
                    return getData("fields");
                } else {
                    setData("fields", fields);
                }
            },
            serNo: function (serNo) {
                if (serNo == undefined) {
                    return getData("serNo");
                } else {
                    setData("serNo", serNo);
                }
            },
            form: function (form) {
                if (form == undefined) {
                    return getData("form");
                } else {
                    setData("form", form);
                }
            },
            success: function (success) {
                if (success == undefined) {
                    return getData("success");
                } else {
                    setData("success", success);
                }
            },
            failure: function (failure) {
                if (failure == undefined) {
                    return getData("failure");
                } else {
                    setData("failure", failure);
                }
            },
            beforeSend: function (beforeSend) {
                if (beforeSend == undefined) {
                    return getData("beforeSend");
                } else {
                    setData("beforeSend", beforeSend);
                }
            },
            classOfIgnore: function () {
                return classOfIgnore;
            },
            append: function (tr) {
                if (tr != undefined) {
                    $("#" + idOfTable + " tbody").append(tr);
                }
            },
            version: function () {
                return VERSION;
            },
            author: function () {
                return AUTHOR;
            },
            updatedtime: function () {
                return UPDATEDTIME;
            }
        };

        // 第一个参数为方法名
        var method = arguments[0];

        if (methods[method]) {
            // 调用普通方法
            method = methods[method];
            // 取出第二个往后的参数, 传个调用的方法
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method == "object" || !method) {
            // 调用初始方法
            method = methods.init;
        } else {
            // 方法不存在
            $.error("Not find method " + method + " on kgrid plugin!");
            return this;
        }
        // 执行方法
        return method.apply(this, arguments);
    };
})(jQuery);
