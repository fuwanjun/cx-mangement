layui.use(['element', 'form', 'layer','table', 'laydate', 'laypage','colorpicker'],function(){
    var element = layui.element;
    var laydate = layui.laydate;
    var laypage = layui.laypage
        ,table = layui.table
        ,colorpicker = layui.colorpicker
        , layer = layui.layer;

    var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
});
var animate;
function table1Show(page,pageSize,status,time){
    animate=layer.load();
    $.ajax({
        url: globalUrl + "api/wash/list;jsessionid=" + $.cookie("token"),
        type: 'get',
        data: {
            page: page,
            pageSize:pageSize,
            status: status,
            time: time
        },
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("JSESSIONID", $.cookie("token"));
        },
        success:function(data){
            if(data.status==200){
                $("#table1 tbody").html("");
                for (var i = 0; i < data.data.list.length; i++) {
                    var afterName = data.data.list[i].afterName ? data.data.list[i].afterName : data.data.list[i].beforeName;
                    var colour = data.data.list[i].colour ? data.data.list[i].colour : "";
                    var flaw = data.data.list[i].flaw ? data.data.list[i].flaw : "";
                    var pics = data.data.list[i].picture ? data.data.list[i].picture : "";
                    var item = '<tr itemId="' + data.data.list[i].id + '">' +
                        '<td class="barCode">' + data.data.list[i].barCode + '</td>' +
                        '<td>' + afterName + '</td>' +
                        '<td class="color">' + colour + '</td>' +
                        '<td class="spot">' + flaw + '</td>' +
                        '<td>' +
                        '<button class="layui-btn layui-btn-primary lookPhoto">查看照片</button>' +
                        '<p class="pics" style="display: none;">' + pics + '</p>' +
                        '</td>' +
                        // '<td><button class="layui-btn layui-btn-danger layui-btn-sm leak">是</button></td>' +
                        // '<td><button class="layui-btn layui-btn-danger layui-btn-sm wrong">是</button></td>' +
                        // '<td>' +
                        // '<button class="layui-btn layui-btn-sm outsource1">外包</button>' +
                        // '<button class="layui-btn layui-btn-sm backPiece1">退件</button>' +
                        // '</td>' +
                        '</tr>';
                    $(item).appendTo($("#table1 tbody"));
                }
                layui.use('laypage', function () {
                    var laypage = layui.laypage;
                    laypage.render({
                        elem: "page1",
                        count: data.data.total,
                        limit: pageSize,
                        curr: page,
                        jump: function (obj, first) {
                            tablePage1=obj.curr;
                            if (!first) {
                                animate = layer.load();
                                table1Show(obj.curr,pageSize,status, time);
                            }
                        }
                    })
                })
            }
            layer.close(animate);
        },error:function(){
            layer.close(animate);
        }
    });
    layer.close(animate);
}