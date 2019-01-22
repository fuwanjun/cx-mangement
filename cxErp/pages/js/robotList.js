layui.use(['element', 'form', 'layer', 'laydate', 'laypage'], function () {
    var element = layui.element;
    var laydate = layui.laydate;
    var laypage = layui.laypage,
        layer = layui.layer;

    var $ = layui.jquery,
        layer = layui.layer; //独立版的layer无需执行这一句

    var table = layui.table;

    //时间选择器
    laydate.render({
        elem: '#test5',
        type: 'datetime'
    })

    //时间选择器
    laydate.render({
        elem: '#test6',
        type: 'datetime'
    })

    
    //  这个是分页的设置 
    laypage.render({
        elem: 'demo7',
        count: 100,
        layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
        jump: function (obj) {
            console.log(obj)
        }
    });


});


// 这边是增加机器人的逻辑
$("#addjiqiren").live("click", function () {

    $(".bg_common").show()

    $(".add_Robot_shadow").show()


})


$("#add_RobotCancer").live("click", function () {
    $(".bg_common").hide()

    $(".add_Robot_shadow").hide()


})

$("#add_RobotSure").live("click", function () {

    $(".bg_common").hide()

    $(".add_Robot_shadow").hide()


    layer.open({
        type: 1,
        title: false,
        closeBtn: false,
        area: ['400px', '200px'],
        shade: 0.5,
        id: 'LAY_layuipro',
        btnAlign: 'c',
        moveType: 1,
        content: `<div style="text-align: center">
          <i class="layui-icon" style="line-height: 150px;font-size: 100px; color: #000000;">&#x1005;</i>  
          <p style="font-size: 22px">增加成功</p>
        </div>`,
        time: 2000,
    })


})


// 这边是删除机器人的逻辑
$("#reducejiqiren").live("click", function () {
    $(".bg_common").show();
    $(".reduce_Robot_shadow").show()

})

$("#reduce_RobotCancer").live("click", function () {

    $(".bg_common").hide();
    $(".reduce_Robot_shadow").hide()

})



//  // 全选
//  var isSelectAll = false;

//  var selectArry = [];
//  $('.selectitem').live('click', function () {
//    var isSelected = $(this).attr('isSelected');
//    isSelected = (isSelected == 'false') ? false : true;
//    if (isSelected) {
//      // 选中状态
//      $(this).html("<i class='layui-icon unSelected'>&#xe63f;</i>");
//      $(this).attr('isSelected', !isSelected);
//    } else {
//      // 非选中
//      $(this).html("<i class='layui-icon selected'>&#xe616;</i>");
//      $(this).attr('isSelected', !isSelected);
//    }
//    // 存入最新的状态
//    $(this).attr('isSelected', !isSelected);
//    updataStatus()
//  });

//  $('.selectAll').live('click', function () {
//    var isSelected = $(this).attr('isSelected');
//    // 先改变原有状态再赋值判断
//    isSelected = (isSelected == 'false') ? false : true;
//    isSelectAll = isSelected;
//    console.log('是否全选' + isSelected);
//    if (isSelectAll) {
//      // 选中状态
//      selectArry = [1, 2, 3];
//      $(this).html("全选&nbsp;<i class='layui-icon selected'>&#xe616;</i>");
//      $('.selectitem').html("<i class='layui-icon selected'>&#xe616;</i>");
//      $('.selectitem').attr('isSelected', !isSelected);
//    } else {
//      // 非选中
//      selectArry = [];
//      $(this).html("全选&nbsp;<i class='layui-icon unSelected'>&#xe63f;</i>");
//      $('.selectitem').html("<i class='layui-icon unSelected'>&#xe63f;</i>");
//      $('.selectitem').attr('isSelected', !isSelected);
//    }
//    // 存入最新的状态
//    $(this).attr('isSelected', !isSelected);

//    updataStatus()
//  });



var isSelectAll = false;
$(".tatalselect").live("click", function () {

    if (isSelectAll) {
        $(this).html("全选&nbsp;<i class='layui-icon unSelected'>&#xe63f;</i>");
        $('.selectitem').html("<i class='layui-icon unSelected'>&#xe63f;</i>");
        $(".selectitem").removeClass('tdSelect')
    } else {
        $(this).html("全选&nbsp;<i class='layui-icon selected'>&#xe616;</i>");

        $('.selectitem').html("<i class='layui-icon selected'>&#xe616;</i>");
        $(".selectitem").addClass("tdSelect");
    }

    isSelectAll = !isSelectAll;
})


$(".selectitem").live("click", function () {

    if ($(this).hasClass('tdSelect')) {
        $(this).removeClass('tdSelect')
        $(this).html("<i class='layui-icon unSelected'>&#xe63f;</i>");
    } else {
        $(this).addClass("tdSelect");
        $(this).html("<i class='layui-icon selected'>&#xe616;</i>");

    }

})


$("#reduce_RobotSure").live("click", function () {

    if ($(".tdSelect").length) {

    } else {

        layer.msg("请选择要删除的机器人")
        return;
    }



    $(".bg_common").hide();
    $(".reduce_Robot_shadow").hide()

    layer.open({
        type: 1,
        title: false,
        closeBtn: false,
        area: ['400px', '200px'],
        shade: 0.5,
        id: 'LAY_layuipro',
        btnAlign: 'c',
        moveType: 1,
        content: `<div style="text-align: center">
          <i class="layui-icon" style="line-height: 150px;font-size: 100px; color: #000000;">&#x1005;</i>  
          <p style="font-size: 22px">删除成功</p>
        </div>`,
        time: 2000,
    })


})




//  点击操作的逻辑
$("td").click(function () {

    if ($(this).text() == "操作") {
        $(".caozuoShadow").show();

        $(".caozuoShadow_sonBox").show()

    }
})

//这边是点击操作取消的逻辑

$("#cancel").live("click", function () {

    $(".caozuoShadow_sonBox").hide()

    $(".bg_common").hide();


})



// 这边是第一层的点击
$(".caozuoBtnBox   button").click(function () {


    if ($(this).text() == "点击刷新坐标位置") {

        layer.msg("刷新成功")

    } else {
        $(".caozuoShadow_sonBox").hide();


        if ($(this).text() == "去充电") {

            $(".gochongdian_shadow").show()

        }


        if ($(this).text() == "修改IP地址") {


            $(".changeIP_shadow").show();

        }


        if ($(this).text() == "暂停使用") {

            $(".stopUsing_shadow").show()

        }


        if ($(this).text() == "详情") {

            $(".xiangqing_shadow").show();
        }


    }






})


//这边是去充电的逻辑

$("#gochongdianCancer").live("click", function () {

    $(".caozuoShadow_sonBox").show()
    $(".gochongdian_shadow").hide()

})

$("#gochongdianSure").live("click", function () {
    $(".gochongdian_shadow").hide()

    layer.open({
        type: 1,
        title: false,
        closeBtn: false,
        area: ['400px', '200px'],
        shade: 0.5,
        id: 'LAY_layuipro',
        btnAlign: 'c',
        moveType: 1,
        content: `<div style="text-align: center">
          <i class="layui-icon" style="line-height: 150px;font-size: 100px; color: #000000;">&#x1005;</i>  
          <p style="font-size: 22px">操作成功</p>
        </div>`,
        time: 2000,
    })

    setTimeout(function () {

        $(".caozuoShadow_sonBox").show()
    }, 2000)



})


//这边是修改IP对应的逻辑


$("#changeIPCancer").live("click", function () {
    $(".caozuoShadow_sonBox").show()
    $(".changeIP_shadow").hide()

})

$("#changeIPSure").live("click", function () {

    $(".changeIP_shadow").hide()

    layer.open({
        type: 1,
        title: false,
        closeBtn: false,
        area: ['400px', '200px'],
        shade: 0.5,
        id: 'LAY_layuipro',
        btnAlign: 'c',
        moveType: 1,
        content: `<div style="text-align: center">
<i class="layui-icon" style="line-height: 150px;font-size: 100px; color: #000000;">&#x1005;</i>  
<p style="font-size: 22px">修改成功</p>
</div>`,
        time: 2000,
    })

    setTimeout(function () {

        $(".caozuoShadow_sonBox").show()
    }, 2000)
})



// 这边是暂停使用对应的逻辑

$("#stopUsingCancer").live("click", function () {
    $(".caozuoShadow_sonBox").show()
    $(".stopUsing_shadow").hide()


})

$("#stopUsingSure").live("click", function () {

    $(".stopUsing_shadow").hide()

    layer.open({
        type: 1,
        title: false,
        closeBtn: false,
        area: ['400px', '200px'],
        shade: 0.5,
        id: 'LAY_layuipro',
        btnAlign: 'c',
        moveType: 1,
        content: `<div style="text-align: center">
<i class="layui-icon" style="line-height: 150px;font-size: 100px; color: #000000;">&#x1005;</i>  
<p style="font-size: 22px">操作成功</p>
</div>`,
        time: 2000,
    })

    setTimeout(function () {

        $(".caozuoShadow_sonBox").show()
    }, 2000)
})




// 这边是详情页面对应的取消按钮
$("#xiangqingCancer").click(function () {
    $(".xiangqing_shadow").hide()
    $(".caozuoShadow_sonBox").show()
})