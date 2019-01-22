$(function () {
    getNoFinish();
    joinShop();
});
layui.use('form', function () {
    var form = layui.form;
    form.on('select(shop)', function () {
        var shopId = $("#shopName").val();
        if(shopId){
            thisShop(shopId);
        }
    })
});


$(".layui-tab-title li").click(function () {
    var i = $(this).index();
    $(".layui-tab-title li").removeClass("layui-this");
    $(".layui-tab-title li").eq(i).addClass("layui-this");
    $(".layui-tab-content .layui-tab-item").removeClass("layui-show");
    $(".layui-tab-content .layui-tab-item").eq(i).addClass("layui-show");

});

$("#entry").click(function () {
    var shopName = $("#shopName option:checked").html();
    var tel = $("#joinPhone").val();
    var shopAddress = $("#joinAddress").val();
    var phoneName = $("#joinUser").val();
    var region = $("#area").val();
    var shopId = $("#shopName").val();
    // getNoFinish();
    if($("#shopName").val()==""){
        layer.msg('请选择店铺');
        return;
    }
    saveShop(shopName, phoneName, tel, shopAddress, region, shopId);
    // $("#addClothesItem").show();

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
});

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
    allClothesName();
    $(".nameOperation").fadeIn();
    $(".brandOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
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
    if($(this).parent().find($(".barcode")).html()){
        layer.msg('商品已保存，不能修改');
        return;
    }
    thisBrand = $(this);
    $(".brandOperation").fadeIn();
    getAllBrands();
    $(".nameOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".effectOperation").fadeOut();
});

//	加载所有品牌
function getAllBrands() {
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
            $("#brand").html(" ");
            for (var i = 0; i < data.data.length; i++) {
                var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                    '<p>' + data.data[i].paramName + '</p>' +
                    '<i class="layui-icon layui-icon-close-fill"></i>' +
                    '</div>';
                $(item).appendTo($("#brand"));
            }
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
                getAllBrands();
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
                getAllBrands()
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
    if($(this).parent().find($(".barcode")).html()){
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
function allClothesBug() {
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
            $("#clothesBug").html(" ");
            for (var i = 0; i < data.data.length; i++) {
                var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                    '<p>' + data.data[i].paramName + '</p>' +
                    '<i class="layui-icon layui-icon-close-fill"></i>' +
                    '</div>';
                $(item).appendTo($("#clothesBug"));
            }
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
                allClothesBug()
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
                allClothesBug();
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
    if($(this).parent().find($(".barcode")).html()){
        layer.msg('商品已保存，不能修改');
        return;
    }
    $(".spotOperation").fadeIn();
    thisSpots = $(this);
    allClothesBug();
    $(".nameOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".brandOperation").fadeOut();
    $(".effectOperation").fadeOut();
});

//	所有洗后效果
function allEffect() {
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
            $("#effectCon").html("");
            for (var i = 0; i < data.data.length; i++) {
                var item = '<div class="brandLi" brandName="' + data.data[i].id + '">' +
                    '<p>' + data.data[i].paramName + '</p>' +
                    '<i class="layui-icon layui-icon-close-fill"></i>' +
                    '</div>';
                $(item).appendTo($("#effectCon"));
            }
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
                allEffect()
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
                allEffect();
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
    if($(this).parent().find($(".barcode")).html()){
        layer.msg('已保存，不能修改');
        return;
    }
    $(".effectOperation").fadeIn();
    thisEffect = $(this);
    allEffect();
    $(".nameOperation").fadeOut();
    $(".colorOperation").fadeOut();
    $(".spotOperation").fadeOut();
    $(".brandOperation").fadeOut();
});

//	点击拍照
$(".takePhoto button").live("click", function () {
    if($(this).parent().parent().find($(".barcode")).html()){
        layer.msg('照片已上传');
        return;
    }
    var photos = $(this).next("div");
    $.ajax({
        url: "http://localhost:8010/upload/uploadImg",
        async:false,
        type: "post",
        data: {id: 1},
        success: function (data) {
            console.log(data);
            if (data.data == "") {
                alert("请拍摄衣物照片");
            } else {
                photos.html(data.data);
                layer.msg(data.message);
            }

        }
    })
});

//	保存单条数据
$(".pre-one").live("click", function () {
    var pre = $(this).parent().parent();
    var nowTime = new Date();
    var orderNo = $("#shopName").attr("orderNo");
    var beforeCode = pre.find($(".oriCode input")).val();
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
    var startTime = timestampToTime(nowTime);
    if (!afterName) {
        layer.msg('请选择衣物');
        return false;
    }
    if (!beforeCode) {
        layer.msg('请填写原条码');
        return false;
    }
    if (!picture) {
        layer.msg('请上传图片');
        return false;
    }
    $.ajax({
        url: globalUrl + "api/work/sortSave;jsessionid=" + $.cookie("token"),
        type: 'post',
        crossDomain: true,
        data: {
            orderNo: orderNo,
            beforeName: afterName,
            beforePrice: afterPrice,
            //afterName:afterName,
            //afterPrice:afterPrice,
            beforeCode: beforeCode,
            modeNum: modeNum,
            brand: brand,
            colour: colour,
            flaw: flaw,
            effect: effect,
            picture: picture,
            // fillPrice:fillPrice,
            startTime: startTime,
            creatType: 1
        },
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success: function (data) {
            if (data.status == 200) {
                pre.find($(".barcode")).html(data.data.barCode);
                pre.find($(".oriCode input")).attr("disabled", true).addClass("disabled");
                pre.find($(".print button")).attr("disabled", true).addClass("layui-btn-disabled");
                pre.find($(".del button")).attr("disabled", true).addClass("layui-btn-disabled");
                var code = pre.find($(".barcode")).html();
                print(code,afterName,colour);
            }
        }
    })

});

$("#ok").click(function () {
    if(!$("#table1 tbody").html()){
        layui.use('layer',function(){
            var layer=layui.layer;
            layer.msg('没有已分拣的商品请新增');

        });
        return;
    }else{
        for(var i=0;i<$("#table1 tbody tr").length;i++){
            if($("#table1 tbody tr").eq(i).find($(".barcode")).html()==''){
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
                    alert("衣物信息未填写完整");
                } else {
                    $.cookie("orderNo", orderNo);
                    $.cookie("shopId", id);
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

//	点击删除
$(".clear").live("click", function () {
    var clear = $(this).parent().parent();
    clear.remove();
});

function print(barCode,name,color) {
    $.ajax({
        url: globalUrl + "api/work/sortPrint;jsessionid=" + $.cookie("token"),
        type: "get",
        async:false,
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
                    // $(item).appendTo($("#codeBox table tbody"));
                } else {
                    for (var i = 0; i < data.data.images.length; i++) {
                        var item = '<div class="printCode" style="display: flex;justify-content: space-between;margin-bottom: 10px;">' +
                            '<div class="mainCode" style="width:50%;height: 100px;margin-left: 15px;">' +
                            '<img style="width: 80%; height: 100%;" src="http://' + data.data.images[i] + '" alt="">' +
                            '<div class="code2" style="font-size:30px; margin-top: 40px;">' + data.data.barCodes[i] + '</div>' +
                            '</div>' +
                            '<div style="width: 50%;">' +
                                '<p class="orderNo" style="margin-top: 0;font-size:30px;">订单号：<span>' + data.data.orderNo + '</span></p>' +
                                '<p style="margin-top: 0;font-size:30px;">名称:<span>'+name+'</span></p>' +
                                '<p style="margin-top: 0;font-size:30px;">颜色:<span>'+color+'</span></p>' +
                            '</div>' +
                            '</div>';

                        $(item).appendTo($("#codeBox"));
                        // $(item).appendTo($("#codeBox  table tbody"));
                    }
                }
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        type: 1,
                        content: $("#codeBox"),
                        area:['600px','600px']
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
                        $("#shopName option:checked").html(data.data.agent.shopName);
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
                                '<button class="layui-btn layui-btn-normal layui-btn-xs layui-btn-disabled pre-one " disabled>打印</button>' +
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
            }
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
            }else{
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

// $(".orderManage").live("click",function(){
//     layui.use('layer',function(){
//         var layer=layui.layer;
//         layer.open({
//             type:1,
//             content:$("#codeBox"),
//             area:[]
//         })
//     })
// });