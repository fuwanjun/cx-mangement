var animate;
var shopName2;
$(function () {
    joinShop();
    getNoFinish();
});
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
    laydate.render({
        elem: '#date2',
        type: 'date'
    });

    form.on('select(shop)', function () {
        var shopId = $("#shopName").val();
        if (shopId) {
            // shopName2=$("#shopName option[value='"+shopId+"']").html();
            thisShop(shopId);
        }
    })
});
// layui.use('form', function () {
//     var form = layui.form;
//     form.on('select(shop)', function () {
//         var shopId = $("#shopName").val();
//         if (shopId) {
//             // shopName2=$("#shopName option[value='"+shopId+"']").html();
//             thisShop(shopId);
//         }
//     })
// });


$(".layui-tab-title li").click(function () {
    var i = $(this).index();
    $(".layui-tab-title li").removeClass("layui-this");
    $(".layui-tab-title li").eq(i).addClass("layui-this");
    $(".layui-tab-content .layui-tab-item").removeClass("layui-show");
    $(".layui-tab-content .layui-tab-item").eq(i).addClass("layui-show");
    if (i == 1) {
        backCheckMsg(1);
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
    }
});

$("#entry").click(function () {
    if ($("#shopName option:selected").val() == "") {
        layer.msg('请选择店铺');
        return;
    }
    layui.use('form', function () {
        var form = layui.form;
        $("#shopName").attr("disabled", true);
        form.render();
    });
    var shopName = $("#shopName option:selected").html();

    var tel = $("#joinPhone").val();
    var shopAddress = $("#joinAddress").val();
    var phoneName = $("#joinUser").val();
    var region = $("#area").val();
    var shopId = $("#shopName").val();
    var styleId = $("#shopName").attr("styleId");
    // getNoFinish();

    saveShop(shopName, phoneName, tel, shopAddress, region, styleId);
    // $("#addClothesItem").show();

});

$("#backSearchBtn").live("click",function(){
    var startTime = $("#date").val();
    var endTime = $("#date2").val();
    backCheckMsg(1,startTime,endTime);
});

$("#addClothesItem").click(function () {
    var item = '<tr>' +
        '<td class="clothesName"></td>' +
        '<td class="price2"></td>' +
        '<td class="oriCode">' +
        '<input style="border: none;height: 30px;width: 100%;text-align: center" type="text">' +
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
        '<button class="layui-btn layui-btn-normal layui-btn-xs">上传</button>' +
        '<div class="photos"></div>' +
        '</td>' +
        '<td class="barcode">' +
        '</td>' +
        '<td class="del">' +
        '<button class="layui-btn layui-btn-danger layui-btn-xs clear">删除</button>' +
        '</td>' +
        '<td class="print">' +
        '<button class="layui-btn layui-btn-normal layui-btn-xs pre-one">打印</button>' +
        '</td>' +
        '</tr>';
    $(item).appendTo($("table tbody"));
    pageScrollBottom();
});

//选择衣物名称
$(".clothesName").live("click", function () {
    if ($(this).parent().find($(".barcode")).html()) {
        layer.msg('已保存，不能修改');
        return;
    }
    thisName = $(this);
    thisPrice = $(this).parent().find($(".price2"));
    thisDiff = $(this).parent().find($(".diffPrice"));
    beforePrice = parseFloat($(this).parent().find($(".buyPrice")).html());
    allClothesName();
    $(".nameOperation").fadeIn();
    $(".brandOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
    pageScrollBottom();
});

//    获取所有衣服名称
function allClothesName() {
    $.ajax({
        url: globalUrl + "api/param/list;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {
            paramType: 5,
            statusType: 2
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            $("#clothesName").html(" ");
            for (var i = 0; i < data.data.length; i++) {
                var item = '<div class="brandLi" brandName="' + data.data[i].id + '" price="' + data.data[i].paramPrice + '">' +
                    '<p>' + data.data[i].paramName + '</p>' +
                    '<i class="layui-icon layui-icon-close-fill"></i>' +
                    '</div>';
                $(item).appendTo($("#clothesName"));
            }
        }
    });
}

//	添加衣物名称
$("#addName").live("click", function () {
    var newName = $("#inName").val();
    var newPrice = $("#inPrice").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newName, paramType: 5, paramPrice: newPrice, statusType: 2},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                allClothesName();
                $("#inName").val("");
            } else if (data.status == 210) {
                alert(data.msg);
            } else {
                alert("数据异常");
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
                allClothesName();
            } else if (data.status == 210) {
                alert(data.msg);
            } else {
                alert("数据异常");
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
        data: {paramType: 5, pinYin: brandVal, statusType: 2},
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
                alert(data.msg);
            } else {
                alert("数据异常");
            }
        }
    })
});

//	配件数量加减
$(".reduceBtn").live("click", function () {
    if ($(this).parent().parent().parent().find($(".barcode")).html()) {
        layer.msg('商品已保存，不能修改');
        return;
    }
    var val = $(this).next("input").val();
    if (val <= 0) {
        $(this).next("input").val(0);
    } else {
        $(this).next("input").val(--val);
    }

});
$(".addBtn").live("click", function () {
    if ($(this).parent().parent().parent().find($(".barcode")).html()) {
        layer.msg('商品已保存，不能修改');
        return;
    }
    var val = $(this).prev("input").val();
    $(this).prev("input").val(++val);
});

//	点击确定衣物名称
$("#clothesName .brandLi").live("click", function () {
    var clothesName = $(this).find("p").html();
    var price = parseFloat($(this).attr("price"));
    thisName.html(clothesName);
    thisPrice.html(price);
    thisDiff.html(price - beforePrice);
    $(".nameOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
});

//	选择品牌
$(".brand").live("click", function () {
    if ($(this).parent().find($(".barcode")).html()) {
        layer.msg('商品已保存，不能修改');
        return;
    }
    thisBrand = $(this);
    $(".brandOperation").fadeIn();
    getAllBrands($("#brand"));
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
            statusType: 2
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
                alert(data.msg);
            } else {
                alert("数据异常");
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
        data: {paramName: newBrand, paramType: 1, statusType: 2},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                getAllBrands($("#brand"));
                $("#addBrand").val("").focus();
            } else if (data.status == 210) {
                alert(data.msg);
            } else {
                alert("数据异常");
            }
        }
    })
});
$("#brandSearch2").live("click", function () {
    var newBrand = $("#addBrand2").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newBrand, paramType: 1, statusType: 2},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                getAllBrands($("#brand2"));
                $("#addBrand2").val("").focus();
            } else if (data.status == 210) {
                alert(data.msg);
            } else {
                alert("数据异常");
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
        data: {paramType: 1, pinYin: brandVal, statusType: 2},
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
                alert(data.msg);
            } else {
                alert("数据异常");
            }
        }
    })
});

//
$(".color").live("click", function () {
    if ($(this).parent().find($(".barcode")).html()) {
        layer.msg('商品已保存，不能修改');
        return;
    }
    $("#colorPicker").html("");
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
            statusType: 2
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

//	添加瑕疵
$("#spotBtn").live("click", function () {
    var newSpot = $("#inSpot").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newSpot, paramType: 3, statusType: 2},
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
                alert(data.msg);
            } else {
                alert("数据异常");
            }
        }
    })
});

$("#spotBtn2").live("click", function () {
    var newSpot = $("#inSpot2").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newSpot, paramType: 3, statusType: 2},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                allClothesBug($("#clothesBug2"));
                $("#inSpot2").val("").focus();
            } else if (data.status == 210) {
                alert(data.msg);
            } else {
                alert("数据异常");
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
                alert(data.msg);
            } else {
                alert("数据异常");
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
        data: {paramType: 3, pinYin: spotVal, statusType: 2},
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
                alert(data.msg);
            } else {
                alert("数据异常");
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
    if ($(this).parent().find($(".barcode")).html()) {
        layer.msg('商品已保存，不能修改');
        return;
    }
    $(".spotOperation").fadeIn();
    thisSpots = $(this);
    allClothesBug($("#clothesBug"));
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
            statusType: 2
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

//	添加洗后效果
$("#effectBtn").live("click", function () {
    var newSpot = $("#addEffect").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newSpot, paramType: 4, statusType: 2},
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
                alert(data.msg);
            } else {
                alert("数据异常");
            }
        }
    })
});

$("#effectBtn2").live("click", function () {
    var newSpot = $("#addEffect2").val();
    $.ajax({
        url: globalUrl + "api/param/add;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {paramName: newSpot, paramType: 4, statusType: 2},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                allEffect($("#effectCon2"));
                $("#addEffect2").val("").focus();
            } else if (data.status == 210) {
                alert(data.msg);
            } else {
                alert("数据异常");
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
                alert(data.msg);
            } else {
                alert("数据异常");
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
        data: {paramType: 4, pinYin: spotVal, statusType: 2},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#effectCon").html(" ");
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                        '<p>' + data.data[i].paramName + '</p>' +
                        '<i class="layui-icon layui-icon-close-fill"></i>' +
                        '</div>';
                    $(item).appendTo($("#effectCon"));
                }
            } else if (data.status == 210) {
                alert(data.msg);
            } else {
                alert("数据异常");
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
            spots += '<p style="display: inline-block;">' + $("#effectCon .brandLi").eq(i).find("p").html() + '</p>,';
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
    if ($(this).parent().find($(".barcode")).html()) {
        layer.msg('已保存，不能修改');
        return;
    }
    $(".effectOperation").fadeIn();
    thisEffect = $(this);
    allEffect($("#effectCon"));
    $(".nameOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".brandOperation").fadeOut();
    pageScrollBottom();
});

//	点击拍照
$(".takePhoto button").live("click", function () {
    animate = layer.load();
    if ($(this).parent().parent().find($(".barcode")).html()) {
        layer.close(animate);
        layer.msg('照片已上传');
        return;
    }
    var photos = $(this).next("div");

    $.ajax({
        url: "http://localhost:8010/upload/uploadImg",
        async: false,
        type: "post",
        data: {id: 1},
        success: function (data) {
            console.log(data);
            if (data.data == "") {
                layer.msg("请拍摄衣物照片");
            } else {
                photos.html(data.data);
                layer.msg(data.message);
            }
            layer.close(animate);
        }
    })
});

//	保存单条数据
$(".pre-one").live("click", function () {
    var data = {};
    var pre = $(this).parent().parent();
    var nowTime = new Date();
    var orderNo = $("#shopName").attr("orderNo");
    var beforeCode = pre.find($(".oriCode input")).val();
    var beforeName = pre.find($(".clothesName")).html();
    var beforePrice = pre.find($(".price2")).html();
    var modeNum = pre.find($(".fjNum div input")).val();
    var brand = pre.find($(".brand")).html();
    var colour = pre.find($(".color")).html();
    var startTime = timestampToTime(nowTime);
    var flaw = "";
    data.orderNo = orderNo;
    data.startTime = startTime;
    data.creatType = 1;
    data.brand = brand;
    data.colour = colour;
    data.modeNum = modeNum;
    for (var i = 0; i < pre.find($(".spot p")).length; i++) {
        flaw += pre.find($(".spot p")).eq(i).html() + ",";
    }
    data.flaw = flaw;
    var effect = "";
    for (var i = 0; i < pre.find($(".effect p")).length; i++) {
        effect += pre.find($(".effect p")).eq(i).html() + ",";
    }
    data.effect = effect;
    var picture = pre.find($(".takePhoto .photos")).html();

    if (!beforeName) {
        layer.msg('请选择衣物');
        return false;
    }
    data.beforeName = beforeName;
    data.beforePrice = beforePrice
    if (!beforeCode) {
        layer.msg('请填写原条码');
        return false;
    }
    data.beforeCode = beforeCode;
    if (!picture) {
        layer.msg('请上传图片');
        return false;
    }
    data.picture = picture;

    if (pre.find($(".barcode")).html()) {
        data.barCode = pre.find($(".barcode")).html();
    }
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
                pre.find($(".oriCode input")).attr("disabled", true).addClass("disabled");
                // pre.find($(".print button")).attr("disabled", true).addClass("layui-btn-disabled");
                pre.find($(".del button")).attr("disabled", true).addClass("layui-btn-disabled");
                var code = pre.find($(".barcode")).html();
                print(code, beforeName, colour);
            }
        }
    })

});

$("#ok").click(function () {
    animate=layer.load();
    if (!$("#table1 tbody").html()) {
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.close(animate);
            layer.msg('没有已分拣的商品请新增');
        });
        return;
    } else {
        for (var i = 0; i < $("#table1 tbody tr").length; i++) {
            if ($("#table1 tbody tr").eq(i).find($(".barcode")).html() == '') {
                layer.close(animate);
                layer.msg('还有衣物未分拣');
                return;
            }
        }
    }
    sortOver(function (data) {
        if (data.status == 200) {
            var code2 = false;
            var orderNo = $("#shopName").attr("orderNo");
            var id = $("#shopName").val();
            if (orderNo) {
                for (var i = 0; i < $("#table1 tbody tr").length - 1; i++) {
                    if (!$("#table1 tbody tr").eq(i).find($(".barcode")).html()) {
                        code2 = true;
                        break;
                    }
                }
                if (code2) {
                    layer.close(animate);
                    layer.msg("衣物信息未填写完整");
                } else {
                    $.cookie("orderNo", orderNo);
                    $.cookie("shopId", id);
                    layer.msg('分拣完成',function(){
                        layer.close(animate);
                        window.location.reload();
                    });
                }
            } else {
                layer.close(animate);
                layer.msg("请输入运单号");
            }
        }
    });

});

//	点击删除
$(".clear").live("click", function () {
    var clear = $(this).parent().parent();
    clear.remove();
});

function print(barCode, name, color) {
    $.ajax({
        url: globalUrl + "api/work/sortPrint;jsessionid=" + $.cookie("token"),
        type: "get",
        async: false,
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
                    var item = '<div class="printCode" style="display: flex;justify-content: flex-start;">' +
                        '<div class="mainCode" style="width:55%;height: 100px;margin-left: 15px;">' +
                        '<img style="width: 80%; height: 100%;" src="http://' + data.data.images[0] + '" alt="">' +
                        '<div class="code2" style="font-size: 50px;">' + data.data.barCodes + '</div>' +
                        '</div>' +
                        '<div style="width: 45%; ">' +
                        '<p style="font-size:30px;">店铺名：<span>' + shopName2 + '</span></p>' +
                        '<p class="orderNo" style="font-size:30px;">订单号：<span>' + data.data.orderNo + '</span></p>' +
                        '<p style="margin-top: 0;font-size:30px;">名称:<span>' + name + '</span></p>' +
                        '<p style="margin-top: 0;font-size:30px;">颜色:<span>' + color + '</span></p>' +
                        '</div>' +
                        '</div>';

                    $(item).appendTo($("#codeBox"));
                    // $(item).appendTo($("#codeBox table tbody"));
                } else {
                    for (var i = 0; i < data.data.images.length; i++) {
                        var item = '<div class="printCode" style="display: flex;justify-content:flex-start;margin-bottom: 20px;">' +
                            '<div class="mainCode" style="width:55%;height: 100px;">' +
                            '<img style="width: 80%; height: 100%;" src="http://' + data.data.images[i] + '" alt="">' +
                            '<div class="code2" style="font-size: 50px;">' + data.data.barCodes[i] + '</div>' +
                            '</div>' +
                            '<div style="45%;">' +
                            '<p style="font-size:30px;">店铺名：<span>' + shopName2 + '</span></p>' +
                            '<p class="orderNo" style="text-align:left;font-size:30px;">订单号：<span>' + data.data.orderNo + '</span></p>' +
                            '<p style="text-align:left;font-size:30px;">名称:<span>' + name + '</span></p>' +
                            '<p style="text-align:left;font-size:30px;">颜色:<span>' + color + '</span></p>' +
                            '</div>' +
                            '</div>';
                        $(item).appendTo($("#codeBox"));
                    }
                }
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        type: 1,
                        content: $("#codeBox"),
                        area: ['600px', '600px']
                    });
                });

                $("#codeBox").jqprint();
                layer.closeAll();
            }
        }
    })
}

//获取加盟店
function joinShop() {
    $.ajax({
        url: globalUrl + "api/store/listAll;jsessionid=" + $.cookie("token"),
        type: "get",
        async: false,
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#shopName").html("");
                var top = '<option value=""></option>';
                $(top).appendTo($("#shopName"));
                for (var i = 0; i < data.data.length; i++) {
                    var item = '<option value="' + data.data[i].id + '">' + data.data[i].storeName + '</option>';
                    $(item).appendTo($("#shopName"));
                }
            }
        }
    })
}

function thisShop(shopId) {
    $.ajax({
        url: globalUrl + "api/store/getById;jsessionid=" + $.cookie("token"),
        type: 'get',
        data: {id: shopId},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#shopName").attr('styleId', data.data.styleId);
                shopName2 = data.data.storeName;
                $("#joinUser").val(data.data.consumerName);
                $("#area").val(data.data.region);
                $("#joinAddress").val(data.data.storeAddress);
                $("#joinPhone").val(data.data.storePhone);
            }
        }
    })
}

function getNoFinish() {
    $.ajax({
        url: globalUrl + "api/work/getCachedData;jsessionid=" + $.cookie("token"),
        type: 'get',
        data: {sortType: 1},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                if (data.data.cached) {

                    layui.use('form', function () {
                        var form = layui.form;
                        $("#shopName").attr("disabled", true);
                        $("#shopName").addClass("disabled");
                        $("#shopName option:selected").html(data.data.agent.shopName);
                        shopName2 = data.data.agent.shopName;
                        form.render();
                    });

                    $("#entry").hide();
                    $("#addClothesItem").show();
                    $("#shopName").attr("orderNo", data.data.agent.orderId);
                    $("#joinUser").val(data.data.agent.consumerName);
                    $("#joinPhone").val(data.data.agent.tel);
                    $("#area").val(data.data.agent.region);
                    $("#joinAddress").val(data.data.agent.shopAddress);
                    $("#orderNo").val(data.data.agent.orderId);
                    $("#table1 tbody").html("");
                    for (var i = 0; i < data.data.washItems.length; i++) {
                        var btns = "";
                        if (data.data.washItems[i].barCode) {
                            btns = '<td class="del">' +
                                '<button class="layui-btn layui-btn-danger layui-btn-xs layui-btn-disabled clear" disabled>删除</button>' +
                                '</td>' +
                                '<td class="print">' +
                                '<button class="layui-btn layui-btn-normal layui-btn-xs pre-one">打印</button>' +
                                '</td>';
                        } else {
                            btns = '<td class="del">' +
                                '<button class="layui-btn layui-btn-danger layui-btn-xs clear">删除</button>' +
                                '</td>' +
                                '<td class="print">' +
                                '<button class="layui-btn layui-btn-normal layui-btn-xs pre-one">打印</button>' +
                                '</td>';
                        }
                        var item = '<tr>' +
                            '<td class="clothesName">' + data.data.washItems[i].beforeName + '</td>' +
                            '<td class="price2">' + data.data.washItems[i].beforePrice + '</td>' +
                            '<td class="oriCode">' +
                            '<input style="border: none;height: 30px;width: 100%;text-align: center" disabled type="text" value="' + data.data.washItems[i].beforeCode + '">' +
                            '</td>' +
                            '<td class="fjNum">' +
                            '<div class="attachment">' +
                            '<span class="reduceBtn">-</span>' +
                            '<input style="text-align: center;" type="number" class="attachmentNumber" value="' + data.data.washItems[i].modeNum + '"/>' +
                            '<span class="addBtn">+</span>' +
                            '</div>' +
                            '</td>' +
                            '<td class="brand">' + data.data.washItems[i].brand + '</td>' +
                            '<td class="color">' + data.data.washItems[i].colour + '</td>' +
                            '<td class="spot">' + data.data.washItems[i].flaw + '</td>' +
                            '<td class="effect"></td>' +
                            '<td class="takePhoto">' +
                            '<button class="layui-btn layui-btn-normal layui-btn-xs">上传</button>' +
                            '<div class="photos">' + data.data.washItems[i].barImage + '</div>' +
                            '</td>' +
                            '<td class="barcode">' + data.data.washItems[i].barCode + '</td>' +
                            btns +
                            '</tr>';
                        $(item).appendTo($("#table1 tbody"));
                    }
                }
                // layer.close(animate);
            }
        }, error: function () {
            layer.close(animate);
        }
    })
}

function saveShop(shopName, name, tel, shopAddress, region, id) {
    $.ajax({
        url: globalUrl + "api/agent/putAgent;jsessionid=" + $.cookie("token"),
        type: 'post',
        data: {
            shopName: shopName,
            consumerName: name,
            tel: tel,
            shopAddress: shopAddress,
            region: region,
            styleId: id
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                $("#entry").hide();
                $("#addClothesItem").show();
                $("#orderNo").val(data.data.orderId);
                $("#shopName").attr("orderNo", data.data.orderId);
            } else {
                layer.msg(data.msg);
            }
        }

    })
}

//分拣完成
function sortOver(success) {
    $.ajax({
        url: globalUrl + "api/work/sortAllSave;jsessionid=" + $.cookie("token"),
        type: "post",
        data: {sortType: 1},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: success
    })
}

//返检处理
function backCheckMsg(page,startTime,endTime) {
    $.ajax({
        url: globalUrl + "api/work/backList;jsessionid=" + $.cookie("token"),
        type: "get",
        data: {page: page,startTime:startTime,endTime:endTime, sortType: 1},
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            console.log(data);
            $("#backTable tbody").html("");
            for (var i = 0; i < data.data.list.length; i++) {
                var flaw2 = "";
                if (data.data.list[i].flaw &&data.data.list[i].flaw!="null") {
                    var flaws = data.data.list[i].flaw.split(",");
                    for (var j = 0; j < flaws.length; j++) {
                        var item2 = '<p>' + flaws[j] + '</p>';
                        flaw2 += item2;
                    }
                } else {
                    flaw = "";
                }
                var effect2 = "";
                if (data.data.list[i].effect&&data.data.list[i].effect!="null") {

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
                            backCheckMsg(obj.curr, status,startTime,endTime);
                        }
                    }
                })

            })
        }
    })
}

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
    pageScrollBottom();
});

$(".backColor").live("click", function () {
    $(".colorOperation2").fadeIn();
    thisColor2 = $(this);
    $(".nameOperation2").fadeOut();
    $(".brandOperation2").fadeOut();
    $(".spotOperation2").fadeOut();
    $(".effectOperation2").fadeOut();
    pageScrollBottom();
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
    pageScrollBottom();
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
    pageScrollBottom();
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
            if (data.status == 200) {
                backCheckMsg(1);
            } else {
                layer.msg(data.msg);
            }
        }
    })
});