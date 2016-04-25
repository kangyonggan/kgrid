(function ($) {
    $.fn.kgrid = function (options) {

        var $this = $(this);

        var beforeSend = function (url, data) {
            return $this;
        };

        var complete = function (result) {
            return $this;
        };

        var flush = function (result) {
            $this.kgrid("items", result.items);

            $this.empty();

            writeHead();

            writeBody(result);

            if ($this.data("kgrid").type != 0) {
                writePage(result);

                writePageInfo(result);
            }

            return $this;
        };

        var writeHead = function () {
            var thead = "<thead><tr>";

            var multi = $this.data("kgrid").multi;
            if (multi) {
                thead += "<th><input type='checkbox' class='" + $this.attr("id") + "-checkbox-all'/></th>";
            }

            var fields = $this.data("kgrid").fields;

            $.each(fields, function (key, val) {
                thead += "<th>" + val + "</th>";
            });

            thead += "</tr></thead>";
            $this.append(thead);

            $("." + $this.attr("id") + "-checkbox-all").click(function () {
                var all = $("." + $this.attr("id") + "-checkbox-item");

                if ($("." + $this.attr("id") + "-checkbox-all:checked").length > 0) {
                    all.prop("checked", true);
                } else {
                    all.prop("checked", false);
                }
            });

            return $this;
        };

        var writeBody = function (result) {
            var tbody = "<tbody>";

            var items = result.items;

            var fields = $this.data("kgrid").fields;

            if (!items || items.length == 0) {
                tbody += "<tr class='no-item'><td colspan='100'><div style='padding: 40px 0px;font-size: 14px;text-align: center;'>" + $this.data("kgrid").empty + "</div></td></tr>";
            }

            var type = $this.data("kgrid").type;
            if (type == 2) {
                var pageNow = $this.data("kgrid").pageNow;
                var pageSize = $this.data("kgrid").pageSize;
                var total = result.items.length;

                for (var i = (pageNow - 1) * pageSize; i < pageNow * pageSize && i < total; i++) {
                    var item = items[i];

                    tbody += "<tr style='cursor: pointer;'>";
                    var multi = $this.data("kgrid").multi;
                    if (multi) {
                        tbody += "<td><input type='checkbox' class='" + $this.attr("id") + "-checkbox-item'/></td>";
                    }

                    $.each(fields, function (key, val) {
                        $.each(item, function (itemKey, itemVal) {
                            if (key == itemKey) {
                                tbody += "<td>" + itemVal + "</td>";
                            }
                        });
                    });

                    tbody += "</tr>";
                }
            } else {
                for (var i = 0; items && i < items.length; i++) {
                    var item = items[i];

                    tbody += "<tr style='cursor: pointer;'>";
                    var multi = $this.data("kgrid").multi;
                    if (multi) {
                        tbody += "<td><input type='checkbox' class='" + $this.attr("id") + "-checkbox-item'/></td>";
                    }

                    $.each(fields, function (key, val) {
                        $.each(item, function (itemKey, itemVal) {
                            if (key == itemKey) {
                                tbody += "<td>" + itemVal + "</td>";
                            }
                        });
                    });

                    tbody += "</tr>";
                }
            }

            tbody += "</tbody>";
            $this.append(tbody);


            var trs = $("#" + $this.attr("id") + " tbody tr").not(".no-item");

            trs.click(function () {
                var multi = $this.data("kgrid").multi;

                if (multi) {
                    var cb = $($(this).children("td")[0]).children("input");

                    if (cb.is(":checked")) {
                        cb.prop("checked", false);
                    } else {
                        cb.prop("checked", true);
                    }
                } else {
                    if ($(this).attr("class") && $(this).attr("class").indexOf("selected") != -1) {
                        $(this).css("border-left", "");
                        $(this).css("color", "");
                        $(this).removeClass("selected");
                        return;
                    }

                    trs.css("border-left", "");
                    trs.css("color", "");
                    trs.removeClass("selected");
                    $(this).css("border-left", "3px solid green");
                    $(this).css("color", "green");
                    $(this).addClass("selected");
                }
            });

            return $this;
        };

        var writePage = function (result) {
            $("#" + $this.attr("id") + "-page").remove();

            var total = 0;
            var type = $this.data("kgrid").type;

            if (type == 1) {
                total = result.total;
                if (total == undefined) {
                    $.error('The total of items can not be null on jQuery.kgrid');
                    return $this;
                }
            } else if (type == 2) {
                total = result.items.length;
            } else {
                return $this;
            }

            if (total == 0) {
                return $this;
            }

            var pageSize = $this.data("kgrid").pageSize;
            var pageCount = Math.floor((total - 1) / pageSize + 1);
            var pageNow = $this.data("kgrid").pageNow;
            var maxPage = $this.data("kgrid").maxPage;

            var page = "<nav id='" + $this.attr("id") + "-page' class='pull-left'>";
            page += "<ul class='pagination'>";
            page += "<li><a href='javascript:' class='" + $this.attr("id") + "-first-page'>&laquo;</a></li>";
            page += "<li><a href='javascript:' class='" + $this.attr("id") + "-pre-page'>&lsaquo;</a></li>";

            var start = pageNow * 1 - Math.floor(maxPage / 2);
            var end = pageNow * 1 + Math.floor(maxPage / 2);

            if (start < 1) {
                end += 1 - start;
            }

            if (end > pageCount) {
                start -= end - pageCount;
            }

            for (var i = Math.max(1, start); i <= Math.min(pageCount, end); i++) {
                if (i == pageNow) {
                    page += "<li class='active'><a href='javascript:' class='" + $this.attr("id") + "-page-no'>" + i + "</a></li>";
                } else {
                    page += "<li><a href='javascript:' class='" + $this.attr("id") + "-page-no'>" + i + "</a></li>";
                }
            }

            page += "<li><a href='javascript:' class='" + $this.attr("id") + "-next-page'>&rsaquo;</a></li>";
            page += "<li><a href='javascript:' class='" + $this.attr("id") + "-last-page'>&raquo;</a></li>";
            page += "</ul></nav>";
            $this.after(page);

            $("." + $this.attr("id") + "-first-page").click(function () {
                $this.kgrid("jump", 1);
            });
            $("." + $this.attr("id") + "-pre-page").click(function () {
                $this.kgrid("jump", Math.max(1, pageNow * 1 - 1));
            });
            $("." + $this.attr("id") + "-page-no").click(function () {
                $this.kgrid("jump", $(this).text());
            });
            $("." + $this.attr("id") + "-next-page").click(function () {
                $this.kgrid("jump", Math.min(pageNow * 1 + 1, pageCount));
            });
            $("." + $this.attr("id") + "-last-page").click(function () {
                $this.kgrid("jump", pageCount);
            });

            return $this;
        };

        var writePageInfo = function (result) {
            $("#" + $this.attr("id") + "-page-info").remove();

            var total = 0;
            var type = $this.data("kgrid").type;

            if (type == 1) {
                total = result.total;
            } else if (type == 2) {
                total = result.items.length;
            } else {
                return $this;
            }

            if (total == 0) {
                return $this;
            }

            var pageSize = $this.data("kgrid").pageSize;
            var pageCount = Math.floor((total - 1) / pageSize + 1);
            var pageNow = $this.data("kgrid").pageNow;

            var pageInfo = "<nav id='" + $this.attr("id") + "-page-info' class='pull-right'>";
            pageInfo += "<ul class='pagination'>";
            pageInfo += "<li><a href='javascript:' style='color: #000;cursor: default;'>" + pageNow + " of " + pageCount + " page, " + ((pageNow - 1) * pageSize + 1) + "~" + pageNow * pageSize + " of " + total + " item</a></li>";
            pageInfo += "</ul></nav>";
            $this.after(pageInfo);
            return $this;
        };

        var vaild = function (options) {
            var formId = options.form;

            if (formId) {
                var action = $("#" + formId).attr("action");
                if (action != undefined) {
                    options.url = action;
                    $this.data("kgrid", options);
                } else {
                    $.error('The action of form can not be null on jQuery.kgrid');
                }
            } else {
                $.error('The form of table can not be null on jQuery.kgrid');
            }

            if (options.fields.length == 0) {
                $.error('The fields of table can not be null on jQuery.kgrid');
            }

            return $this;
        };

        var getAndSet = function(key, val) {
            var cfg = $this.data("kgrid");
            if (val != undefined) {
                cfg[key] = val;
                $this.data("kgrid", cfg);
            } else {
                return eval("cfg." + key);
            }
        };

        var methods = {
            init: function (options) {
                var defaults = {
                    empty: "Empty item Of Search",
                    fields: [],
                    form: null,
                    multi: false,
                    type: 0,
                    pageSize: 10,
                    maxPage: 5,
                    pageNow: 1,
                    version: "1.0.0",
                    author: "kangyonggan",
                    date: "2016-04-25",
                    beforeSend: beforeSend,
                    complete: complete
                };

                options = $.extend(defaults, options);
                vaild(options);
                $this.data("kgrid", options);

                flush({items: [], total: 0});
                return $this;
            },
            load: function (pageNow) {
                var form = $("#" + $this.data("kgrid").form);

                var data = {};
                var a = form.serializeArray();
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

                if (!pageNow || pageNow * 1 < 1) {
                    pageNow = 1;
                }

                data.pageNow = pageNow;
                data.pageSize = $this.data("kgrid").pageSize;
                var cfg = $this.data("kgrid");
                cfg.pageNow = pageNow;
                cfg.data = data;
                $this.data("kgrid", cfg);

                $this.data("kgrid").beforeSend($this.data("kgrid").url, data);

                $.get($this.data("kgrid").url, $this.data("kgrid").data, function (result) {
                    if (result) {
                        result = eval("(" + result + ")");
                        if (result.status == "success") {
                            flush(result);
                            $this.data("kgrid").complete(result);
                        } else {
                            $.error('Load item failed on jQuery.kgrid');
                        }
                    } else {
                        $.error('Load item failed on jQuery.kgrid');
                    }
                });
                return $this;
            },
            jump: function (pageNow) {
                var data = $this.data("kgrid").data;

                if (!pageNow || pageNow * 1 < 1) {
                    pageNow = 1;
                }

                data.pageNow = pageNow;
                data.pageSize = $this.data("kgrid").pageSize;
                var cfg = $this.data("kgrid");
                cfg.pageNow = pageNow;
                cfg.data = data;
                $this.data("kgrid", cfg);

                if ($this.data("kgrid").type == 2) {
                    var result = {items: $this.kgrid("items")};
                    flush(result);
                    return $this;
                }

                $this.data("kgrid").beforeSend($this.data("kgrid").url, data);

                $.get($this.data("kgrid").url, $this.data("kgrid").data, function (result) {
                    if (result) {
                        result = eval("(" + result + ")");
                        if (result.status == "success") {
                            flush(result);
                            $this.data("kgrid").complete(result);
                        } else {
                            $.error('Load item failed on jQuery.kgrid');
                        }
                    } else {
                        $.error('Load item failed on jQuery.kgrid');
                    }
                });
                return $this;
            },
            selected: function () {
                var items = [];
                var trs = [];
                var multi = $this.data("kgrid").multi;

                if (multi) {
                    trs = $("#" + $this.attr("id") + " ." + $this.attr("id") + "-checkbox-item:checked").parent().parent();
                } else {
                    trs = $("#" + $this.attr("id") + " tbody .selected");
                }

                for (var i = 0; i < trs.length; i++) {
                    var tds = $(trs[i]).children("td");
                    var item = {};
                    var j = multi ? 1 : 0;
                    $.each($this.data("kgrid").fields, function (key, val) {
                        item[key] = $(tds[j++]).text();
                    });
                    items[i] = item;
                }

                return items;
            },
            url: function (url) {
                return getAndSet("url", url);
            },
            data: function (data) {
                return getAndSet("data", data);
            },
            pageSize: function (pageSize) {
                return getAndSet("pageSize", pageSize);
            },
            multi: function (multi) {
                return getAndSet("multi", multi);
            },
            maxPage: function (maxPage) {
                return getAndSet("maxPage", maxPage);
            },
            type: function (type) {
                return getAndSet("type", type);
            },
            empty: function (empty) {
                return getAndSet("empty", empty);
            },
            items: function (items) {
                return getAndSet("items", items);
            },
            fields: function (fields) {
                return getAndSet("fields", fields);
            },
            version: function () {
                return $this.data("kgrid").version;
            },
            author: function () {
                return $this.data("kgrid").author;
            },
            date: function () {
                return $this.data("kgrid").date;
            },
            beforeSend: function (beforeSend) {
                return getAndSet("beforeSend", beforeSend);
            },
            complete: function (complete) {
                return getAndSet("complete", complete);
            }
        };

        var method = arguments[0];

        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method == "object" || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.kgrid');
            return this;
        }
        return method.apply(this, arguments);
    };
})(jQuery);
