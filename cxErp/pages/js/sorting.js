$("#orderNum").focus();
var expressType = 2;
layui.use(['element', 'form', 'layer', 'table', 'laydate', 'laypage', 'colorpicker'], function () {
    var element = layui.element;
    var laydate = layui.laydate;
    var form = layui.form;
    var laypage = layui.laypage
        , table = layui.table
        , colorpicker = layui.colorpicker
        , layer = layui.layer;

    var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句

    //时间选择器
    laydate.render({
        elem: '#date',
        type: 'date'
    });

    //时间选择器
    laydate.render({
        elem: '#test6',
        type: 'datetime'
    });

    $.ajax({
        type: "get",
        url: "json/color.json",
        async: true,
        success: function (res) {
//				console.log(res.data);
            var str = '';
            $.each(res.data, function (index, value) {
                if (value.doubled) {
                    str += '<div class="colorLi"><div class="colorLi_child" style="background-color:' + value.color.split(",")[0] + '">' + value.colorText.split(",")[0] + '</div><div class="colorLi_child" style="background-color:' + value.color.split(",")[1] + '">' + value.colorText.split(",")[1] + '</div></div>'
                } else if (!value.doubled) {
                    str += '<div class="colorLi" style="background-color:' + value.color + '">' + value.colorText + '</div>'
                }
            });
            $("#colorPicker").append(str);
        },
        error: function (err) {
            console.log(err)
        }
    });
    $.ajax({
        type: "get",
        url: "json/color.json",
        async: true,
        success: function (res) {
//				console.log(res.data);
            var str = '';
            $.each(res.data, function (index, value) {
                if (value.doubled) {
                    str += '<div class="colorLi"><div class="colorLi_child" style="background-color:' + value.color.split(",")[0] + '">' + value.colorText.split(",")[0] + '</div><div class="colorLi_child" style="background-color:' + value.color.split(",")[1] + '">' + value.colorText.split(",")[1] + '</div></div>'
                } else if (!value.doubled) {
                    str += '<div class="colorLi" style="background-color:' + value.color + '">' + value.colorText + '</div>'
                }
            });
            $("#colorPicker2").append(str);
        },
        error: function (err) {
            console.log(err)
        }
    });
    form.on("select", function (data) {
        expressType = data.value;
        $("#orderNum").focus();
    });
});

getNoFinish();

var animate = "";
$("#ydNum").bind("input propertychange", function () {
    layui.use('layer', function () {
        var layer = layui.layer;
        var orderNum = $("#orderNum").val();
        if (expressType == 3 && $("#orderNum").val().length == 10) {
            animate = layer.load();
            showOrderMsg(orderNum, 1);
        }
        if (expressType == 2 && $("#orderNum").val().length == 11) {
            animate = layer.load();
            showOrderMsg(orderNum, 1);
        }
        if (expressType == 1 && $("#orderNum").val().length == 12) {
            animate = layer.load();
            showOrderMsg(orderNum, 1);
        }
    });
});

var excute = true;
$("#codeIn1").bind("input propertychange", function () {
    var codeNum = $("#codeIn1").val();
    if (codeNum.length == 16 && excute) {
        console.log(codeNum);
        excute = searchBack(codeNum);
    } else {
        excute = true;
    }
    return true
});

//	展示分拣信息
function showOrderMsg(signNum, page) {
    $.ajax({
        url: globalUrl + "api/work/sortView;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {
            signNumber: signNum,
            page: page
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                if (data.data.cached == false) {

                } else {
                    var nowTime = Date.parse(new Date());
                    $("#orderNo").val(data.data.orderShipping.orderNo);
                    $("#qsTime").val(timestampToTime(data.data.orderShipping.takeEndTime));
                    $("#userName").val(data.data.address.userName);
                    $("#userPhone").val(data.data.address.phone);
                    $("#userAddress").val(data.data.address.region + data.data.address.detailAddress);
                    $("#inTime").val(timestampToTime(nowTime));
                    if (data.data.taker) {
                        $("#pickerName").val(data.data.taker.takerName);
                        $("#pickerPhone").val(data.data.taker.phone);
                    }

                    $("#recording tbody").html(" ");
                    for (var i = 0; i < data.data.washItems.length; i++) {
                        var item = '<tr>' +
                            '<td class="beforeName">' + data.data.washItems[i].beforeName + '</td>' +
                            '<td class="buyPrice">' + data.data.washItems[i].beforePrice + '</td>' +
                            '<td class="clothesName"></td>' +
                            '<td class="price2">' +
                            //							'<input class="presentPrice" style="border: none;width:100%;height: 30px;text-align: center;" type="number">' +
                            '</td>' +
                            '<td class="fjNum">' +
                            '<div class="attachment">' +
                            '<span class="reduceBtn">-</span>' +
                            '<input style="text-align: center;" type="number" class="attachmentNumber" value="0"/>' +
                            '<span class="addBtn">+</span>' +
                            '</div>' +
                            '</td>' +
                            '<td class="brand"></td>' +
                            '<td class="color"></td>' +
                            '<td class="spot"></td>' +
                            '<td class="effect"></td>' +
                            '<td class="takePhoto">' +
                            '<button type="button" class="layui-btn layui-btn-normal layui-btn-xs">上传</button>' +
                            '<div class="photos"></div>' +
                            '</td>' +
                            '<td class="diffPrice">0</td>' +
                            '<td class="barcode"></td>' +
                            '<td class="reset">' +
                            '<button class="layui-btn layui-btn-danger layui-btn-xs clear">重置</button>' +
                            '</td>' +
                            '<td>' +
                            '<button type="button" class="layui-btn layui-btn-normal layui-btn-xs pre-one">保存</button>' +
                            '</td>' +
                            '</tr>';
                        $(item).appendTo($("#recording"));
                    }
                    layer.close(animate);
                }
            } else {
                if (data.msg) {
                    layer.close(animate);
                    layer.msg(data.msg);
                } else {
                    layer.close(animate);
                    layer.msg("数据异常");

                }
            }
        }
    })

}

// function layer.msgMsg(type, msg) {
//     var icon = '';
//     switch (true) {
//         case (type == ('success')):
//             icon = '&#x1005;';
//             break;
//         case (type == ('error')):
//             icon = '&#x1007;';
//             break;
//     }
// };

//	配件数量加减
$(".reduceBtn").live("click", function () {
    var val = $(this).next("input").val();
    if (val <= 0) {
        $(this).next("input").val(0);
    } else {
        $(this).next("input").val(--val);
    }

});
$(".addBtn").live("click", function () {
    var val = $(this).prev("input").val();
    $(this).prev("input").val(++val);
});

// 下面是删除的弹框
$("#zhuanyiCancer").click(function () {
    $(".zhuanyi_shadow").hide();
    parent.ableBtn()
});
var thisName = "";
var thisPrice = "";
var thisBrand = "";
var thisColor = "";
var thisSpots = "";
var thisEffect = "";
var thisName2 = "";
var thisPrice2 = "";
var thisBrand2 = "";
var thisColor2 = "";
var thisSpots2 = "";
var thisEffect2 = "";


//选择衣物名称
$(".clothesName").live("click", function () {
    if($(this).parent().find($(".barcode")).html()){
        layer.msg('已保存，不能修改');
        return;
    }
    thisName = $(this);
    thisPrice = $(this).parent().find($(".price2"));
    thisDiff = $(this).parent().find($(".diffPrice"));
    beforePrice = parseFloat($(this).parent().find($(".buyPrice")).html());
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        allClothesName($("#clothesName"));
    });
    $(".nameOperation").fadeIn();
    $(".brandOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
    pageScrollBottom();
});

//    获取所有衣服名称
function allClothesName(con) {
    $.ajax({
        url: globalUrl + "api/param/list;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {
            paramType: 5,
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            con.html("");
            for (var i = 0; i < data.data.length; i++) {
                var item = '<div class="brandLi" brandName="' + data.data[i].id + '" price="' + data.data[i].paramPrice + '">' +
                    '<p>' + data.data[i].paramName + '</p>' +
                    '<i class="layui-icon layui-icon-close-fill"></i>' +
                    '</div>';
                $(item).appendTo(con);
            }
            layer.close(animate);
        }
    });
}

//	添加衣物名称
$("#addName").live("click", function () {
    var newName = $("#inName").val();
    var newPrice = $("#inPrice").val();
    if (!newName) {
        layer.msg('衣物名称不能为空');
        return false
    }
    if (!newName || newName > 0) {
        layer.msg('请填写正确的商品名称');
        return false
    }
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newName, paramType: 5, paramPrice: newPrice},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                allClothesName($("#clothesName"));
                $("#inName").val("");
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});
//	删除衣物名称
$("#clothesName .brandLi i").live("click", function (event) {
    event.stopPropagation();
    var id = $(this).parent().attr("brandName");
    $.ajax({
        url: globalUrl + "api/param/delete;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {id: id},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                allClothesName($("#clothesName"));
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }

    })
});
//	搜索衣物名称
$("#searchNameBtn").live("click", function () {
    var brandVal = $("#searchName").val();
    $.ajax({
        url: globalUrl + "api/param/search;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {paramType: 5, pinYin: brandVal},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#clothesName").html(" ");
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                        '<p>' + data.data[i].paramName + '</p>' +
                        '<i class="layui-icon layui-icon-close-fill"></i>' +
                        '</div>';
                    $(item).appendTo($("#clothesName"));
                }
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});

//	点击确定衣物名称
$("#clothesName .brandLi").live("click", function () {
    var clothesName = $(this).find("p").html();
    var price = parseFloat($(this).attr("price"));
    thisName.html(clothesName);
    thisPrice.html(price);
    var nowDiff = "";
    if (price > beforePrice) {
        nowDiff = price - beforePrice;
    } else {
        nowDiff = 0
    }
    thisDiff.html(nowDiff);
    $(".nameOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
});

//	选择品牌
$(".brand").live("click", function () {
    if($(this).parent().find($(".barcode")).html()){
        layer.msg('商品已保存，不能修改');
        return;
    }
    thisBrand = $(this);
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        getAllBrands($("#brand"));
    });
    $(".brandOperation").fadeIn();
    $(".nameOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
    pageScrollBottom();
});

//	加载所有品牌
function getAllBrands(con) {
    $.ajax({
        url: globalUrl + "api/param/list;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {
            paramType: 1,
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            con.html("");
            for (var i = 0; i < data.data.length; i++) {
                var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                    '<p>' + data.data[i].paramName + '</p>' +
                    '<i class="layui-icon layui-icon-close-fill"></i>' +
                    '</div>';
                $(item).appendTo(con);
            }
            layer.close(animate);
        }
    });
}

//	点击确定品牌
$("#brand .brandLi").live("click", function () {
    var brandName = $(this).find("p").html();
    thisBrand.html(brandName);
    $(".nameOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
});

//	删除品牌
$("#brand .brandLi i").live("click", function (event) {
    event.stopPropagation();
    var id = $(this).parent().attr("brandName");
    $.ajax({
        url: globalUrl + "api/param/delete;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {id: id},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                getAllBrands($("#brand"));
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }

    })
});

//	添加品牌
$("#brandSearch").live("click", function () {
    var newBrand = $("#addBrand").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newBrand, paramType: 1},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                getAllBrands($("#brand"))
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});
//	搜索品牌
$("#searchBrandBtn").live("click", function () {
    var brandVal = $("#searchBrand").val();
    $.ajax({
        url: globalUrl + "api/param/search;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {paramType: 1, pinYin: brandVal},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#brand").html(" ");
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                        '<p>' + data.data[i].paramName + '</p>' +
                        '<i class="layui-icon layui-icon-close-fill"></i>' +
                        '</div>';
                    $(item).appendTo($("#brand"));
                }
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});


$(".color").live("click", function () {
    if($(this).parent().find($(".barcode")).html()){
        layer.msg('商品已保存，不能修改');
        return;
    }
    $(".colorOperation").fadeIn();
    thisColor = $(this);
    $(".nameOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
    pageScrollBottom();
});
//	点击确定颜色
$("#colorPicker .colorLi").live("click", function () {
    var colorName = $(this).html();
    var color = $(this).css("background-color");
    thisColor.html(colorName);
    thisColor.css("background-color", color);
    $(".nameOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
});

//	所有瑕疵类型
function allClothesBug(con) {
    $.ajax({
        url: globalUrl + "api/param/list;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {
            paramType: 3,
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            con.html(" ");
            for (var i = 0; i < data.data.length; i++) {
                var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                    '<p>' + data.data[i].paramName + '</p>' +
                    '<i class="layui-icon layui-icon-close-fill"></i>' +
                    '</div>';
                $(item).appendTo(con);
            }
            layer.close(animate);
        }
    });
}

//	添加瑕疵
$("#spotBtn").live("click", function () {
    var newSpot = $("#inSpot").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newSpot, paramType: 3},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                allClothesBug($("#clothesBug"));
                $("#inSpot").val("").focus();
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});

//	删除瑕疵
$("#clothesBug .brandLi i").live("click", function (event) {
    event.stopPropagation();
    var id = $(this).parent().attr("brandName");
    $.ajax({
        url: globalUrl + "api/param/delete;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {id: id},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                allClothesBug($("#clothesBug"));
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }

    })
});
//	搜索瑕疵
$("#searchBtn").live("click", function () {
    var spotVal = $("#searchSpot").val();
    $.ajax({
        url: globalUrl + "api/param/search;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {paramType: 3, pinYin: spotVal},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#clothesBug").html(" ");
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                        '<p>' + data.data[i].paramName + '</p>' +
                        '<i class="layui-icon layui-icon-close-fill"></i>' +
                        '</div>';
                    $(item).appendTo($("#clothesBug"));
                }
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});
//	点击确定瑕疵
$("#clothesBug .brandLi").live("click", function () {
    if (!$(this).hasClass("spot-active")) {
        $(this).addClass("spot-active");
    } else {
        $(this).removeClass("spot-active");
    }
});
//  提交瑕疵
$("#subSpots").click(function () {
    var spots = "";
    for (var i = 0; i < $("#clothesBug .brandLi").length; i++) {
        if ($("#clothesBug .brandLi").eq(i).hasClass("spot-active")) {
            spots += '<p style="display: inline-block;">' + $("#clothesBug .brandLi").eq(i).find("p").html() + '</p>,';
        }
    }
    thisSpots.html(spots);
    $(".nameOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".effectOperation").fadeOut();
});

$(".spot").live("click", function () {
    if($(this).parent().find($(".barcode")).html()){
        layer.msg('商品已保存，不能修改');
        return;
    }
    $(".spotOperation").fadeIn();
    thisSpots = $(this);
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        allClothesBug($("#clothesBug"));
    });
    $(".nameOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".effectOperation").fadeOut();
    pageScrollBottom();
});

//	所有洗后效果
function allEffect(con) {
    $.ajax({
        url: globalUrl + "api/param/list;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {
            paramType: 4,
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            con.html(" ");
            for (var i = 0; i < data.data.length; i++) {
                var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                    '<p>' + data.data[i].paramName + '</p>' +
                    '<i class="layui-icon layui-icon-close-fill"></i>' +
                    '</div>';
                $(item).appendTo(con);
            }
            layer.close(animate);
        }
    });
}

//	添加洗后效果
$("#effectBtn").live("click", function () {
    var newSpot = $("#addEffect").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newSpot, paramType: 4},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                allEffect($("#effectCon"));
                $("#addEffect").val("").focus();
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});

//	删除洗后效果
$("#effectCon .brandLi i").live("click", function (event) {
    event.stopPropagation();
    var id = $(this).parent().attr("brandName");
    $.ajax({
        url: globalUrl + "api/param/delete;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {id: id},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                allEffect($("#effectCon"));
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }

    })
});
//	搜索洗后效果
$("#searchEffectBtn").live("click", function () {
    var spotVal = $("#searchEffect").val();
    $.ajax({
        url: globalUrl + "api/param/search;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {paramType: 4, pinYin: spotVal},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                $("#effectCon").html("");
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                        '<p>' + data.data[i].paramName + '</p>' +
                        '<i class="layui-icon layui-icon-close-fill"></i>' +
                        '</div>';
                    $(item).appendTo($("#effectCon"));
                }
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});
//	点击确定洗衣效果
$("#effectCon .brandLi").live("click", function () {
    if (!$(this).hasClass("spot-active")) {
        $(this).addClass("spot-active");
    } else {
        $(this).removeClass("spot-active");
    }
});
//  提交洗衣效果
$("#subEffect").click(function () {
    var spots = "";
    for (var i = 0; i < $("#effectCon .brandLi").length; i++) {
        if ($("#effectCon .brandLi").eq(i).hasClass("spot-active")) {
            spots += '<p>' + $("#effectCon .brandLi").eq(i).find("p").html() + '</p>';
        }
    }
    thisEffect.html(spots);
    $(".nameOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".effectOperation").fadeOut();
});

$(".effect").live("click", function () {
    if($(this).parent().find($(".barcode")).html()){
        layer.msg('已保存，不能修改');
        return;
    }
    $(".effectOperation").fadeIn();
    thisEffect = $(this);
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        allEffect($("#effectCon"));
    });

    $(".nameOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".brandOperation").fadeOut();
    pageScrollBottom();
});
//	点击拍照
$(".takePhoto button").live("click", function () {
    if($(this).parent().parent().find($(".barcode")).html()){
        layer.msg('照片已上传');
        return;
    }
    var photos = $(this).next("div");
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        $.ajax({
            url: "http://localhost:8010/upload/uploadImg",
            type: "post",
            data: {id: 1},
            success: function (data) {
                layer.close(animate);
                console.log(data);
                photos.html(data.data);
                layer.msg(data.message);
            }
        })
    });
});

//	点击重置
$(".clear").live("click", function () {
    var clear = $(this).parent().parent();
    if(clear.find($(".barcode")).html()){
        layer.msg('已保存，无法重置');
        return;
    }
    clear.find($(".clothesName")).html("");
    clear.find($(".price2")).html("");
    clear.find($(".fjNum div input")).val("");
    clear.find($(".brand")).html("");
    clear.find($(".color")).html("").css("background", "");
    clear.find($(".spot")).html("");
    clear.find($(".effect")).html("");
    clear.find($(".diffPrice")).html("");
});

//	保存单条数据
$(".pre-one").live("click", function () {
    var data={};
    var pre = $(this).parent().parent();
    var nowTime = new Date();
    var orderNo = $("#orderNo").val();
    var beforeName = pre.find($(".beforeName")).html();
    var beforePrice = pre.find($(".buyPrice")).html();
    var afterName = pre.find($(".clothesName")).html();
    var afterPrice = pre.find($(".price2")).html();
    var modeNum = pre.find($(".fjNum div input")).val();
    var brand = pre.find($(".brand")).html();
    var colour = pre.find($(".color")).html();
    var flaw = "";
    for (var i = 0; i < pre.find($(".spot p")).length; i++) {
        flaw += pre.find($(".spot p")).eq(i).html() + ",";
    }
    var effect = "";
    for (var i = 0; i < pre.find($(".effect p")).length; i++) {
        effect += pre.find($(".effect p")).eq(i).html() + ",";
    }
    var picture = pre.find($(".takePhoto .photos")).html();
    var fillPrice = pre.find($(".diffPrice")).html();
    var startTime = timestampToTime(nowTime);
    data.orderNo=orderNo;
    data.beforeName=beforeName;
    data.beforePrice=beforePrice;
    data.afterName=afterName;
    data.afterPrice=afterPrice;
    data.modeNum=modeNum;
    data.brand=brand;
    data.colour=colour;
    data.flaw=flaw;
    data.effect=effect;
    data.fillPrice=fillPrice;
    data.startTime=startTime;
    data.picture=picture;

    if(pre.find($(".barcode")).html()){
        data.barCode=pre.find($(".barcode")).html();
    }
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        if (picture) {
            $.ajax({
                url: globalUrl + "api/work/sortSave;jsessionid=" + $.cookie("token"),
                type: 'post',
                crossDomain: true,
                data: data,
                beforeSend: function (request) {
                    request.setRequestHeader("JSESSIONID", $.cookie("token"));
                },
                success: function (data) {
                    if (data.status == 200) {
                        pre.find($(".barcode")).html(data.data.barCode);
                        var code = pre.find($(".barcode")).html();
                        print(code,afterName,colour);
                    } else {
                        layer.close(animate);
                        layer.msg(data.msg);
                    }
                    layer.close(animate);
                }
            })
        } else {
            layer.msg("请上传衣物图片");
            layer.close(animate)
        }
    })
});

function print(barCode,name,color) {
    $.ajax({
        url: globalUrl + "api/work/sortPrint;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {barCode: barCode},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                $("#codeBox").html("");
                if (data.data.images.length == 1) {
                    var item = '<div class="printCode" style="display: flex;justify-content: space-between;margin-bottom: 10px;">' +
                        '<div class="mainCode" style="width:50%;height: 100px;margin-left: 15px;">' +
                        '<img style="width: 80%; height: 100%;" src="http://' + data.data.images[0] + '" alt="">' +
                        '<div class="code2" style="font-size: 30px;">' + data.data.barCodes + '</div>' +
                        '</div>' +
                        '<div>' +
                        '<p class="orderNo" style="margin-top: 0;font-size:30px;">订单号：<span>' + data.data.orderNo + '</span></p>' +
                        '<p style="margin-top: 0;font-size:30px;">名称:<span>'+name+'</span></p>' +
                        '<p style="margin-top: 0;font-size:30px;">颜色:<span>'+color+'</span></p>' +
                        '</div>' +
                        '</div>';
                    $(item).appendTo($("#codeBox"));
                } else {
                    for (var i = 0; i < data.data.images.length; i++) {
                        var item = '<div class="printCode" style="display: flex;justify-content:flex-start;margin-bottom: 40px;">' +
                            '<div class="mainCode" style="width:50%;height: 100px;">' +
                            '<img style="width: 80%; height: 100%;" src="http://' + data.data.images[i] + '" alt="">' +
                            '<div class="code2" style="font-size: 30px;">' + data.data.barCodes[i] + '</div>' +
                            '</div>' +
                            '<div style="50%;margin-left: 50px;">' +
                            '<p class="orderNo" style="text-align:left;font-size:30px;">订单号：<span>' + data.data.orderNo + '</span></p>' +
                            '<p style="text-align:left;font-size:30px;">名称:<span>'+name+'</span></p>' +
                            '<p style="text-align:left;font-size:30px;">颜色:<span>'+color+'</span></p>' +
                            '</div>' +
                            '</div>';
                        $(item).appendTo($("#codeBox"));
                    }
                }
                layer.close(animate);
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        type: 1,
                        content: $("#codeBox"),
                        area: ['250px', '400px']
                    });
                });
                $("#codeBox").jqprint();
                layer.closeAll();

            }
        }
    })
}

$("#ok").click(function () {
    sortOver(function (data) {
        if (data.status == 200) {
            var code2 = false;
            var orderNo = $("#orderNo").val();
            if (orderNo) {
                for (var i = 0; i < $("tbody tr").length - 1; i++) {
                    if (!$("tbody tr").eq(i).find($(".barcode")).html()) {
                        code2 = true;
                        break;
                    }
                }
                if (code2) {
                    layer.msg("仍有衣物未分拣");
                }else{
                    layer.msg('分拣完成');
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500);
                }
            } else {
                layer.msg("请输入运单号");
            }
        }
    });
});

$(".layui-tab-title li").live("click", function () {
    var i = $(this).index();
    $(".layui-tab-title li").removeClass("layui-this");
    $(".layui-tab-title li").eq(i).addClass("layui-this");
    $(".layui-tab-content .layui-tab-item").removeClass("layui-show");
    $(".layui-tab-content .layui-tab-item").eq(i).addClass("layui-show");
    if (i == 1) {
        backCheckMsg(1);
    }
});


//	选择品牌(返检)
$(".backBrand").live("click", function () {
    thisBrand2 = $(this);
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        getAllBrands($("#brand2"));
    });
    $(".brandOperation2").fadeIn();
    $(".nameOperation2").fadeOut();
    $(".colorOperation2").fadeOut();
    $(".spotOperation2").fadeOut();
    $(".effectOperation2").fadeOut();
});

//	点击确定品牌(返检)
$("#brand2 .brandLi").live("click", function () {
    var brandName = $(this).find("p").html();
    thisBrand2.html(brandName);
    $(".nameOperation2").fadeOut();
    $(".brandOperation2").fadeOut();
    $(".colorOperation2").fadeOut();
    $(".spotOperation2").fadeOut();
    $(".effectOperation2").fadeOut();
});

//	删除品牌(返检)
$("#brand2 .brandLi i").live("click", function (event) {
    event.stopPropagation();
    var id = $(this).parent().attr("brandName");
    $.ajax({
        url: globalUrl + "api/param/delete;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {id: id},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                getAllBrands($("#brand2"));
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                ("数据异常");
            }
        }

    })
});

//	添加品牌(返检)
$("#brandSearch2").live("click", function () {
    var newBrand = $("#addBrand2").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newBrand, paramType: 1},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                getAllBrands($("#brand2"))
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});
//	搜索品牌(返检)
$("#searchBrandBtn2").live("click", function () {
    var brandVal = $("#searchBrand2").val();
    $.ajax({
        url: globalUrl + "api/param/search;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {paramType: 1, pinYin: brandVal},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#brand2").html("");
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                        '<p>' + data.data[i].paramName + '</p>' +
                        '<i class="layui-icon layui-icon-close-fill"></i>' +
                        '</div>';
                    $(item).appendTo($("#brand2"));
                }
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});

$(".backColor").live("click", function () {
    $(".colorOperation2").fadeIn();
    thisColor2 = $(this);
    $(".nameOperation2").fadeOut();
    $(".brandOperation2").fadeOut();
    $(".spotOperation2").fadeOut();
    $(".effectOperation2").fadeOut();
});
//	点击确定颜色(返检)
$("#colorPicker2 .colorLi").live("click", function () {
    var colorName = $(this).html();
    var color = $(this).css("background-color");
    thisColor2.html(colorName);
    thisColor2.css("background-color", color);
    $(".nameOperation2").fadeOut();
    $(".colorOperation2").fadeOut();
    $(".brandOperation2").fadeOut();
    $(".spotOperation2").fadeOut();
    $(".effectOperation2").fadeOut();
});

//	添加瑕疵(返检)
$("#spotBtn2").live("click", function () {
    var newSpot = $("#inSpot2").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newSpot, paramType: 3},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                allClothesBug($("#clothesBug2"))
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});

//	删除瑕疵(返检)
$("#clothesBug2 .brandLi i").live("click", function (event) {
    event.stopPropagation();
    var id = $(this).parent().attr("brandName");
    $.ajax({
        url: globalUrl + "api/param/delete;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {id: id},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                allClothesBug($("#clothesBug2"));
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }

    })
});
//	搜索瑕疵(返检)
$("#searchBtn2").live("click", function () {
    var spotVal = $("#searchSpot").val();
    $.ajax({
        url: globalUrl + "api/param/search;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {paramType: 3, pinYin: spotVal},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#clothesBug").html(" ");
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                        '<p>' + data.data[i].paramName + '</p>' +
                        '<i class="layui-icon layui-icon-close-fill"></i>' +
                        '</div>';
                    $(item).appendTo($("#clothesBug2"));
                }
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});
//	点击确定瑕疵(返检)
$("#clothesBug2 .brandLi").live("click", function () {
    if (!$(this).hasClass("spot-active")) {
        $(this).addClass("spot-active");
    } else {
        $(this).removeClass("spot-active");
    }
});
//  提交瑕疵(返检)
$("#subSpots2").click(function () {
    var spots = "";
    for (var i = 0; i < $("#clothesBug2 .brandLi").length; i++) {
        if ($("#clothesBug2 .brandLi").eq(i).hasClass("spot-active")) {
            spots += '<p>' + $("#clothesBug2 .brandLi").eq(i).find("p").html() + '</p>';
        }
    }
    thisSpots.html(spots);
    $(".nameOperation2").fadeOut();
    $(".spotOperation2").fadeOut();
    $(".colorOperation2").fadeOut();
    $(".brandOperation2").fadeOut();
    $(".effectOperation2").fadeOut();
});

$(".backSpot").live("click", function () {

    $(".spotOperation2").fadeIn();
    thisSpots = $(this);
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        allClothesBug($("#clothesBug2"));
    });
    $(".nameOperation2").fadeOut();
    $(".colorOperation2").fadeOut();
    $(".brandOperation2").fadeOut();
    $(".effectOperation2").fadeOut();
});

//	添加洗后效果
$("#effectBtn").live("click", function () {
    var newSpot = $("#addEffect").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newSpot, paramType: 4},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                allEffect($("#effectCon"))
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});

//	删除洗后效果
$("#effectCon .brandLi i").live("click", function (event) {
    event.stopPropagation();
    var id = $(this).parent().attr("brandName");
    $.ajax({
        url: globalUrl + "api/param/delete;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {id: id},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                allEffect($("#effectCon"));
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }

    })
});
//	搜索洗后效果
$("#searchEffectBtn").live("click", function () {
    var spotVal = $("#searchEffect").val();
    $.ajax({
        url: globalUrl + "api/param/search;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {paramType: 4, pinYin: spotVal},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                $("#effectCon").html("");
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                        '<p>' + data.data[i].paramName + '</p>' +
                        '<i class="layui-icon layui-icon-close-fill"></i>' +
                        '</div>';
                    $(item).appendTo($("#effectCon"));
                }
            } else if (data.status == 210) {
                layer.msg(data.msg);
            } else {
                layer.msg("数据异常");
            }
        }
    })
});
//	点击确定洗衣效果
$("#effectCon2 .brandLi").live("click", function () {
    if (!$(this).hasClass("spot-active")) {
        $(this).addClass("spot-active");
    } else {
        $(this).removeClass("spot-active");
    }
});
//  提交洗衣效果
$("#subEffect2").click(function () {
    var spots = "";
    for (var i = 0; i < $("#effectCon2 .brandLi").length; i++) {
        if ($("#effectCon2 .brandLi").eq(i).hasClass("spot-active")) {
            spots += '<p style="display: inline-block;">' + $("#effectCon2 .brandLi").eq(i).find("p").html() + '</p>,';
        }
    }
    thisEffect2.html(spots);
    $(".nameOperation2").fadeOut();
    $(".spotOperation2").fadeOut();
    $(".colorOperation2").fadeOut();
    $(".brandOperation2").fadeOut();
    $(".effectOperation2").fadeOut();
});

$(".backEffect").live("click", function () {
    $(".effectOperation2").fadeIn();
    thisEffect2 = $(this);
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        allEffect($("#effectCon2"));
    });

    $(".nameOperation2").fadeOut();
    $(".colorOperation2").fadeOut();
    $(".spotOperation2").fadeOut();
    $(".brandOperation2").fadeOut();
});

//	点击上传照片
$(".backPhoto button").live("click", function () {
    var photos = $(this).next("div");
    // if()
    layui.use('layer', function () {
        var layer = layui.layer;
        animate = layer.load();
        $.ajax({
            url: "http://localhost:8010/upload/uploadImg",
            type: "post",
            data: {id: 1},
            success: function (data) {
                layer.close(animate);

                photos.html(data.data);

                layer.msg(data.message);
            }
        })
    });
});

//点击保存
$(".save button").live("click", function () {
    var obj = {};
    var pre = $(this).parent().parent();
    var id = pre.attr("id");
    var brand = pre.find($(".backBrand")).html();
    var colour = pre.find($(".backColor")).html();
    var flaw = "";
    for (var i = 0; i < pre.find($(".backSpot p")).length; i++) {
        flaw += pre.find($(".backSpot p")).eq(i).html() + ",";
    }
    var effect = "";
    for (var i = 0; i < pre.find($(".backEffect p")).length; i++) {
        effect += pre.find($(".backEffect p")).eq(i).html() + ",";
    }

    var picture = pre.find($(".backPhoto .photos2")).html();
    obj.id = id;
    obj.brand = brand;
    obj.colour = colour;
    if (flaw) {
        obj.flaw = flaw;
    }
    if (effect) {
        obj.effect = effect;
    }
    if (picture) {
        obj.picture = picture;
    }
    $.ajax({
        url: globalUrl + "api/work/sortUpdate;jsessionid=" + $.cookie("token"),
        type: 'post',
        data: obj,
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if(data.status==200){
                backCheckMsg(1);
            }else{
                layer.msg(data.msg);
            }
        }
    })
});

function searchBack(code){
    $.ajax({
        url: globalUrl + "api/work/search;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {barCode:code},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success:function(data){
            if(data.status==200){
                $("#backTable tbody").html("");
                    var afterPrice = data.data.afterPrice ? data.data.afterPrice : "";
                    var brand = data.data.brand ? data.data.brand : "";
                    var colour = data.data.colour ? data.data.colour : "";
                    var flaw2=data.data.flaw?data.data.flaw:'';
                    var effect2=data.data.effect?data.data.effect:'';
                    var item = '<tr id="' + data.data.id + '">' +
                        '<td class="backCode">' + data.data.barCode + '</td>' +
                        '<td class="backName">' + data.data.beforeName + '</td>' +
                        '<td class="backPrice">' + afterPrice + '</td>' +
                        '<td class="backBrand">' + brand + '</td>' +
                        '<td class="backColor">' + colour + '</td>' +
                        '<td class="backSpot">' + flaw2 + '</td>' +
                        '<td class="backEffect">' + effect2 + '</td>' +
                        '<td class="backPhoto">' +
                        '<button type="button" class="layui-btn layui-btn-normal layui-btn-xs">上传</button>' +
                        '<div class="photos2" style="display: none;"></div>' +
                        '<td class="save">' +
                        '<button type="button" class="layui-btn layui-btn-normal layui-btn-xs">保存</button>' +
                        '</td>' +
                        '</tr>';
                    $(item).appendTo($("#backTable tbody"));
            }
        }
    })
}

//返检处理
function backCheckMsg(page, time) {
    $.ajax({
        url: globalUrl + "api/work/backList;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {page: page, time: time},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            $("#backTable tbody").html("");
            for (var i = 0; i < data.data.list.length; i++) {
                var flaw2 = "";
                if (data.data.list[i].flaw) {
                    var flaws = data.data.list[i].flaw.split(",");
                    for (var j = 0; j < flaws.length; j++) {
                        var item2 = '<p>' + flaws[j] + '</p>';
                        flaw2 += item2;
                    }
                } else {
                    flaw = "";
                }
                var effect2 = "";
                if (data.data.list[i].effect) {

                    var effects = data.data.list[i].effect.split(",");

                    for (var j = 0; j < effects.length; j++) {
                        var item2 = '<p>' + effects[j] + '</p>';
                        effect2 += item2;
                    }
                } else {
                    effect2 = ""
                }
                var afterPrice = data.data.list[i].afterPrice ? data.data.list[i].afterPrice : data.data.list[i].beforePrice;
                var brand = data.data.list[i].brand ? data.data.list[i].brand : "";
                var colour = data.data.list[i].colour ? data.data.list[i].colour : "";
                var item = '<tr id="' + data.data.list[i].id + '">' +
                    '<td class="backCode">' + data.data.list[i].barCode + '</td>' +
                    '<td class="backName">' + data.data.list[i].beforeName + '</td>' +
                    '<td class="backPrice">' + afterPrice + '</td>' +
                    '<td class="backBrand">' + brand + '</td>' +
                    '<td class="backColor">' + colour + '</td>' +
                    '<td class="backSpot">' + flaw2 + '</td>' +
                    '<td class="backEffect">' + effect2 + '</td>' +
                    '<td class="backPhoto">' +
                    '<button type="button" class="layui-btn layui-btn-normal layui-btn-xs">上传</button>' +
                    '<div class="photos2" style="display: none;"></div>' +
                    '<td class="save">' +
                    '<button type="button" class="layui-btn layui-btn-normal layui-btn-xs">保存</button>' +
                    '</td>' +
                    '</tr>';
                $(item).appendTo($("#backTable tbody"));
            }
            layui.use('laypage', function () {
                var laypage = layui.laypage;
                laypage.render({
                    elem: "page2",
                    count: data.data.total,
                    limit: data.data.pageSize,
                    curr: page,
                    jump: function (obj, first) {
                        if (!first) {
                            backCheckMsg(obj.curr, status, time);
                        }
                    }
                })

            })
        }
    })
}

//获取缓存
function getNoFinish() {
    $.ajax({
        url: globalUrl + "api/work/getCachedData;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {sortType: 0},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                if(!data.data.cached){

                }else{
                    var nowTime = Date.parse(new Date());
                    $("#orderNo").val(data.data.orderShipping.orderNo);
                    $("#qsTime").val(timestampToTime(data.data.orderShipping.takeEndTime));
                    $("#userName").val(data.data.address.userName);
                    $("#userPhone").val(data.data.address.phone);
                    $("#userAddress").val(data.data.address.region + data.data.address.detailAddress);
                    $("#inTime").val(timestampToTime(nowTime));
                    if (data.data.taker) {
                        $("#pickerName").val(data.data.taker.takerName);
                        $("#pickerPhone").val(data.data.taker.phone);
                    }

                    $("#recording tbody").html(" ");
                    for (var i = 0; i < data.data.washItems.length; i++) {
                        let beforeName=data.data.washItems[i].beforeName?data.data.washItems[i].beforeName:'';
                        let beforePrice=data.data.washItems[i].beforePrice?data.data.washItems[i].beforePrice:'';
                        let afterName=data.data.washItems[i].afterName?data.data.washItems[i].afterName:'';
                        let afterPrice=data.data.washItems[i].afterPrice?data.data.washItems[i].afterPrice:'';
                        let modeNum=data.data.washItems[i].modeNum?data.data.washItems[i].modeNum:0;
                        let brand=data.data.washItems[i].brand?data.data.washItems[i].brand:'';
                        let colour=data.data.washItems[i].colour?data.data.washItems[i].colour:'';
                        let flaw=data.data.washItems[i].flaw?data.data.washItems[i].flaw:'';
                        let effect=data.data.washItems[i].effect?data.data.washItems[i].effect:'';
                        let fillPrice=data.data.washItems[i].fillPrice?data.data.washItems[i].fillPrice:'';
                        let barCode=data.data.washItems[i].barCode?data.data.washItems[i].barCode:'';
                        var item = '<tr>' +
                            '<td class="beforeName">' + beforeName + '</td>' +
                            '<td class="buyPrice">' + beforePrice + '</td>' +
                            '<td class="clothesName">' + afterName + '</td>' +
                            '<td class="price2">' + afterPrice + '</td>' +
                            '<td class="fjNum">' +
                            '<div class="attachment">' +
                            '<span class="reduceBtn">-</span>' +
                            '<input style="text-align: center;" type="number" class="attachmentNumber" value="' + modeNum + '"/>' +
                            '<span class="addBtn">+</span>' +
                            '</div>' +
                            '</td>' +
                            '<td class="brand">' + brand + '</td>' +
                            '<td class="color">' + colour + '</td>' +
                            '<td class="spot">' + flaw + '</td>' +
                            '<td class="effect">' + effect + '</td>' +
                            '<td class="takePhoto">' +
                            '<button type="button" class="layui-btn layui-btn-normal layui-btn-xs">上传</button>' +
                            '<div class="photos"></div>' +
                            '</td>' +
                            '<td class="diffPrice">' + fillPrice + '</td>' +
                            '<td class="barcode">' + barCode + '</td>' +
                            '<td class="reset">' +
                            '<button class="layui-btn layui-btn-danger layui-btn-xs clear">重置</button>' +
                            '</td>' +
                            '<td>' +
                            '<button type="button" class="layui-btn layui-btn-normal layui-btn-xs pre-one">保存</button>' +
                            '</td>' +
                            '</tr>';
                        $(item).appendTo($("#recording"));
                    }
                    // layer.close(animate);
                }
            }
        }
    })
}

function sortOver(success) {
    $.ajax({
        url: globalUrl + "api/work/sortAllSave;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {sortType: 0},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: success
    })
}
