function PrintTable(billList){
    for (var i = 0; i < billList.length; i++) {
        var printOrders = billList[i];
        //如果原发货人，电话不为空，显示原发货人信息，否则现在发货人信息
        if (printOrders.shipperCompanyName != null
            && printOrders.shipperCompanyName != ''
            && printOrders.shipperCompanyPhone != null
            && printOrders.shipperCompanyPhone != '') {
            printOrders.shipperTel = printOrders.shipperCompanyPhone;
            printOrders.shipperName = printOrders.shipperCompanyName;
            printOrders.saddress = printOrders.shipperCompanyAddress;
            printOrders.shipperPhone = '';
        }
    }
    var len = $(".waybillNum").length;
    var wayNum = "";
    for (var i = 0; i < len; i++) {
        wayNum += $(".waybillNum")[i].innerText + ",";
    }
    wayNum = wayNum.substring(0, wayNum.length - 1);
    //newPrintWayBill(billList, wayNum); //打印
    lodopPrintTable(billList, wayNum); //打印
}
//当前打印模板
var htmlTemplateObj = null;

function lodopPrintTable(billList, wayNum){
    //获取打印模板
    htmlTemplateObj = $("#printContext");
    //console.log("shipperName"+htmlTemplateObj.find("span.shipperName").text())
    var LODOP = null;
    try{
        LODOP=getLodop();
        if ((LODOP!=null)&&(typeof(LODOP.VERSION)!="undefined")){
            $("#lodopTips").hide();
        }
        else{
            $("#lodopTips").show();
            return;
        }
    }catch(err){
        $("#lodopTips").show();
        return;
    }
    //打印
    print(billList, wayNum);

}
//打印模板
function templateDataProcess(data, index){
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    var printHtml = null;
    if(data==undefined || data == null || data== ""){
        return printHtml;
    }

    htmlTemplateObj.find("span.conPhone").text(data.conPhone);
    htmlTemplateObj.find("span.conTel").text(data.conTel);
    htmlTemplateObj.find("span.shipperTel").text(data.shipperTel);
    htmlTemplateObj.find("span.shipperName").text(data.shipperName);
    htmlTemplateObj.find("span.shipperPhone").text(data.shipperPhone);
    htmlTemplateObj.find("span.conName").text(data.conName);

    if(data.caddress.length>42){
        $('#conMsg').attr('style','border-right:0mm;font-size:8pt;width:90mm;font-family:黑体;font-weight:bold;text-align:left; ');
        $('#conMsg2').attr('style','font-family:黑体;text-align:left; font-size:8px;font-weight:bold; ');

    }else{
        $('#conMsg').attr('style','border-right:0mm;font-size:10pt;width:90mm;font-family:黑体;font-weight:bold;text-align:left; ');
        $('#conMsg2').attr('style','font-family:黑体;text-align:left; font-size:10px;font-weight:bold; ');
    }
    htmlTemplateObj.find("span.caddress").text(data.caddress);
    htmlTemplateObj.find("span.saddress").text(data.saddress);
    htmlTemplateObj.find("span.cargoName").text(data.cargoName);
    htmlTemplateObj.find("span.cargoWeight").text(data.cargoWeight);
    htmlTemplateObj.find("span.refundPayment").text(data.refundPayment);

    // if (data.refundPayment > 0) {
    //     $("#refundPaymentId").text("代收货款");
    //     $('#refundPaymentId').attr('style','border-top:0mm;background:#000000;line-height:72px;font-weight:bold; text-align:center; color:#FFFFFF; font-size:20px;');
    // } else {
        $("#refundPaymentId").text("");
        $('#refundPaymentId').attr('style','border-top:0mm;background:#000000;line-height:72px; text-align:center; color:#FFFFFF;');
    // }

    // if (data.payType.length > 2) {
    //
        $('#payTypeId').attr('style','border-top:0mm;background:#000000;line-height:72px;font-weight:bold; text-align:center; color:#FFFFFF; font-size:10px;');
    //
    // } else {
    //
    //     $('#payTypeId').attr('style','border-top:0mm;background:#000000;line-height:72px;font-weight:bold; text-align:center; color:#FFFFFF; font-size:20px;');
    //
    // }
    $("#payTypeId").text(data.payType);

    if ("" == data.transType) {

        $('#transTypeId').attr('style','border-top:0mm;background:#FFFFFF;line-height:72px;font-weight:bold; text-align:center; color:#000000; font-size:13px;');
        htmlTemplateObj.find("span.transType").text("无法匹配");

    } else {

        if (data.transType.length > 4) {

            $('#transTypeId').attr('style','border-top:0mm;background:#FFFFFF;line-height:72px;font-weight:bold; text-align:center; color:#000000; font-size:8px;');

        } else {

            $('#transTypeId').attr('style','border-top:0mm;background:#FFFFFF;line-height:72px;font-weight:bold; text-align:center; color:#000000; font-size:13px;');

        }

        htmlTemplateObj.find("span.transType").text(data.transType);
    }

    // htmlTemplateObj.find("span.destination").text(data.destination);
    // htmlTemplateObj.find("span.billWeight").text(data.billWeight);
    // htmlTemplateObj.find("span.transportCharge").text(data.transportCharge);
    // htmlTemplateObj.find("span.totalCharge").text(data.totalCharge);
    // htmlTemplateObj.find("span.insuranceMoney").text(data.insuranceMoney);
    // htmlTemplateObj.find("span.signSheet").text(data.signSheet);
    // htmlTemplateObj.find("span.outerField1").text(data.outerField1);
    // htmlTemplateObj.find("span.lastOutLoadOrgName").text(data.lastOutLoadOrgName);
    // htmlTemplateObj.find("span.departCityName").text(data.departCityName);
    // htmlTemplateObj.find("span.departCityName").text(data.departCityName);
    // htmlTemplateObj.find("span.secondLoadOrgName").text(data.secondLoadOrgName);
    // htmlTemplateObj.find("span.stationNumber").text(data.stationNumber);
    // htmlTemplateObj.find("span.custOrderLine").text(data.custOrderLine);
    htmlTemplateObj.find("span.originalNumber").text(data.originalNumber);
    htmlTemplateObj.find("span.transNote").text(data.transNote);

    if ("" == data.markerPen) {

        $('#markerPen').attr('style','text-align: center; line-height: 13mm; vertical-align: middle;font-size: 35px; font-weight: bold; margin: 0px; padding: 0px;');
        $("#refundPaymentId").text("无大头笔信息");
    } else {

        if (data.markerPen.length > 10) {

            $('#markerPen').attr('style','text-align: center; line-height: 13mm; vertical-align: middle;font-size: 18px; font-weight: bold; margin: 0px; padding: 0px;');
            $("#markerPen").text(data.markerPen);
        } else {

            $('#markerPen').attr('style','text-align: center; line-height: 13mm; vertical-align: middle;font-size: 35px; font-weight: bold; margin: 0px; padding: 0px;');
            $("#markerPen").text(data.markerPen);
        }
    }
//	htmlTemplateObj.find("span.markerPen").text(data.markerPen);



    htmlTemplateObj.find("span.orderNumber").text(data.orderNumber);
    htmlTemplateObj.find("span.printTime").text(new Date().Format("yyyyMMdd HH:mm:ss"));
    // htmlTemplateObj.find("span.billTime").text(data.billTime.substring(0,10));
    var cargoCount = data.cargoCount;
    if(data.cargoCount>1){
        cargoCount += "-" + (index+1);
    }
    htmlTemplateObj.find("span.cargoCount").text(cargoCount);

    //代收账号
    var account = data.reciveLoanAccount;
    if (account != null && account != '') {
        account = account.substring(0, 3) + "*"
            + account.substring(account.length - 4, account.length);
    } else {
        account = "";
    }
    htmlTemplateObj.find("span.reciveLoanAccount").text(account);

    if (data.conTel != '' && data.conTel != null) {
        if (data.conPhone != '' && data.conPhone != null) {
            htmlTemplateObj.find("span.conTel").text(data.conTel + "/");
        }
    }
    if (data.shipperTel != '' && data.shipperTel != null) {
        if (data.shipperPhone != ''
            && data.shipperPhone != null) {
            htmlTemplateObj.find("span.shipperTel").text(data.shipperTel + "/");
        }
    }
//	return htmlTemplateObj.html();
}
/**
 * 打印
 * @param list
 */
function print(billList, wayNum){
    for(var i=0; i<billList.length; i++){

        var data = billList[i];
        data.cargoCount = 1;
        for(var j=0; j<data.cargoCount; j++){

            var serialNo = data.printSerialNos;
            if(data.cargoCount>1){
                serialNo = data.printSerialNos.split(",")[j];
            }
            //条码
            var barcode = data.waybillNumber + serialNo + data.stationNumber;

            var isHideWareHouse  = data.isHideWareHouse;

            //模板数据处理
            templateDataProcess(data, j);
            console.log("XXXX: "+ htmlTemplateObj.find("span.shipperName").text())
            //打印电子运单1
            printEWaybill(data, serialNo, barcode, wayNum);

            //打印仓库分拣单
//			if("N"==isHideWareHouse){
//				printWareHouseWaybill(data, serialNo, barcode);
//			}

        }
    }
    if(billList.length>0){
        //$.myAlert("本次共打印"+billList.length+"张，已成功添加到打印列表！");

    }else {
        //$.myAlert('请先勾选需要打印的面单');
    }
}
/**
 * 打印电子运单
 * @param data
 * @param serialNo
 */
function printEWaybill(data, serialNo, barcode, wayNum){
    //打印内容
    var printHtml = htmlTemplateObj.find("div#expressPrintArea").html();

    LODOP.PRINT_INIT("二级模板");
    LODOP.SET_PRINT_PAGESIZE(0,"110mm","180mm","CreateCustomPage");

    // LODOP.ADD_PRINT_TEXT(130,30,150,130,$(".markerPenCode").text());
    // LODOP.ADD_PRINT_TEXT(130,30,150,130,"河南郑州");
    LODOP.SET_SHOW_MODE("BKIMG_WIDTH","100mm");
    LODOP.SET_SHOW_MODE("BKIMG_HEIGHT","180mm");


    LODOP.ADD_PRINT_TABLE("2mm","0.6mm","95mm","177mm",printHtml);
    LODOP.ADD_PRINT_BARCODE("79mm","10mm","84mm","15mm","128C", data.waybillNumber);
    LODOP.ADD_PRINT_BARCODE("117mm","45mm","50mm","8mm","128C", data.waybillNumber);

    //打印
    LODOP.PREVIEW();
    //LODOP.PRINT();
//	LODOP.PRINT_DESIGN();

    //记录打印日志
    try {
        printLogses(data);
    } catch (e) {
    }
}
function printTest(data) {
    var printOrder = {};

    printOrder.waybillNumber = data.data.mailNo;   //运单号
    printOrder.shipperCompanyPhone = data.data.sender.mobile;   //发货人联系方式
    printOrder.shipperCompanyAddress = data.data.sender.province+"-"+data.data.sender.city+"-"+data.data.sender.address;   //发货地址
    printOrder.shipperTel = data.data.sender.mobile;     //发货人电话
    printOrder.saddress =data.data.sender.province+"-"+data.data.sender.city+"-"+data.data.sender.address;     //发货人地址
    printOrder.shipperPhone = data.data.sender.phone;     //发货人手机

    printOrder.conPhone = data.data.receiver.phone;     //收货人手机
    printOrder.conTel = data.data.receiver.mobile;     //收货人电话
    printOrder.shipperName = data.data.sender.name;       //发货人姓名
    printOrder.conName = data.data.receiver.name;       //收货人姓名
    printOrder.caddress = data.data.receiver.province+"-"+data.data.receiver.city+"-"+data.data.receiver.address;     //到达地址
    printOrder.cargoName = "衣物";      //货物名称
    // printOrder.cargoWeight = $("#cargoWeight").val();       //货物重量
    printOrder.refundPayment ="";   //代收货款
    printOrder.payType = "支付方式";       //付款方式  月结/日结
    printOrder.transType = "运输性质";       //运输性质
    printOrder.destination = data.data.sender.province+"-"+data.data.sender.city+"-"+data.data.sender.address;       //目的地
    // printOrder.billWeight = $("#billWeight").val();         //计费重量
    // printOrder.transportCharge = $("#transportCharge").val();       //运费
    // printOrder.totalCharge = $("#totalCharge").val();       //总费用
    // printOrder.insuranceMoney = $("#insuranceMoney").val();     //报价声明
    // printOrder.signSheet = $("#signSheet").val();       //签收单
    // printOrder.outerField1 = $("#outerField1").val();       //受理部门名称
    // printOrder.lastOutLoadOrgName = $("#lastOutLoadOrgName").val();     //最终外场
    // printOrder.departCityName = $("#departCityName").val();     //原寄地
    // printOrder.secondLoadOrgName = $("#secondLoadOrgName").val();       //第二外场
    // printOrder.stationNumber = $("#stationNumber").val();       //提货网点id
    // printOrder.custOrderLine = $("#custOrderLine").val();       //客户订单号
    printOrder.transNote = "备注";      //备注
    printOrder.markerPen = data.data.receiver.province+data.data.receiver.city;      //大头笔信息简码
    printOrder.orderNumber = $("#orderNo").val();       //订单号
    // printOrder.billTime = $("#billTime").val();     //下单时间
    // printOrder.cargoCount = $("#cargoCount").val();     //揽货总件数
    // printOrder.reciveLoanAccount = $("#reciveLoanAccount").val();       //代收账号
    // printOrder.printSerialNos = $("#printSerialNos").val();     //流水号
    // printOrder.isHideWareHouse = $("#isHideWareHouse").val();   //isHideWareHouse
    printOrder.originalNumber = $("#orderNo").val();     //isHideWareHouse


    var printList = [];
    printList.push(printOrder);
    PrintTable(printList);
}