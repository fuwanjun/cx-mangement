
//打印订单
function printOrder(lists) {
  var LODOP = getLodop();
  console.log(LODOP)
  if (LODOP == undefined) {
    return false;
  }
  for (let i=0,len=lists.length;i<len;i++){
    myPrintA(lists[i], i, lists.length);
  }

}
function getTimeString(){
  var oDate = new Date();
  var Year = oDate.getFullYear(),
    Month = (oDate.getMonth() + 1) >= 10 ? (oDate.getMonth() + 1) : '0' + (oDate.getMonth() + 1),
    Day = (oDate.getDate()) >= 10 ? (oDate.getDate()) : '0' + (oDate.getDate()),
    Hour = (oDate.getHours()) >= 10 ? (oDate.getHours()) : '0' + (oDate.getHours()),
    Minute = (oDate.getMinutes()) >= 10 ? (oDate.getMinutes()) : '0' + (oDate.getMinutes()),
    Second = (oDate.getSeconds()) >= 10 ? (oDate.getSeconds()) : '0' + (oDate.getSeconds());
  return Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second
}
/**
 * 选择打印机
 */
function myPrintA(list, currentIndex, totalList) {
    var OrderResponse=list.parse.Response.Body.OrderResponse;
    var detail=OrderResponse.rls_info.rls_detail;
    var receiver=list.sfReceiver;
    var sender=list.sfSender;
  var printNo = currentIndex+'-'+totalList,
    printNum = 1,
    printDate = getTimeString(),
    mailno = OrderResponse.mailno,
    twoDimensionCode = detail.twoDimensionCode,
    proCode = detail.proCode,
    destRouteLabel = detail.destRouteLabel,
    d_contact = receiver.name,
    d_tel = receiver.mobile,
    // d_tel=list.dtel,
    d_company = receiver.company,
    d_address = receiver.province+"-"+receiver.city+"-"+receiver.company+"-"+receiver.address,
    destTeamCode = detail.destTeamCode?detail.destTeamCode:"",
    //0:寄付 1：到付 2 第三方付
    pay_method = '寄付',
    // codingMapping = list.codingMapping,
    // destTransferCode=list.sourceTransferCode,
    abFlag = detail.xbFlag,
    // codingMappingOut = list.codingMappingOut,
    j_contact = sender.name,
    j_tel = sender.mobile,
    // j_tel=list.jtel,
    j_company = sender.company,
    j_address = sender.province+"-"+sender.city+"-"+sender.company+"-"+sender.address,
    things="",
    COD='',
    POD='',
    // remark=list.remark,
    expressType=detail.expressTypeCode;
    // if(list.mailing == "承兑汇票"){
    // 	j_tel = sender.phone,
    // 	things = list.mailing + list.number +"件  票号:"+list.ticketNo
    // }else{
    // 	j_tel = sender.mobile,
    // 	things = list.mailing
    // }
  //定义Icon路径
  // var printIcony = "<img border='0' src='./static/sui.png' />";
  var printIcony ='';
  var printIcond = "<img border='0' src='../img/boss_color.jpg' />";


  //获取运单号数量
  // var n = mailno.split(",");//生成运单号数组
   var m = 1;//运单号数量
  //主单号
  // mailno = n[0];
  //取proCode最后一个字符
  var proCode = proCode.charAt(proCode.length - 1);

  LODOP = getLodop(); //获取打印驱动
  LODOP.PRINT_INITA(0, 7, 378, 790, "顺丰丰密210热敏");//预览窗口标题
  LODOP.SET_PRINT_PAGESIZE(0, 1000, 1000, "")//设置纸张大小100mm*150mm
  LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);//设置以纸张边缘为基点
  // for (j = 0; j < m; j++) {
  //   children_nos = n[j];
    CreateFullBill2(1,printNo, printNum, printDate, mailno, mailno, twoDimensionCode, proCode, destRouteLabel, d_contact, d_tel, d_company, d_address, destTeamCode, pay_method, '', '', abFlag, '', j_contact, j_tel, j_company, j_address, things, '', m, COD, POD, printIcond, printIcony, '', expressType);
  // };
  LODOP.SET_PREVIEW_WINDOW(0, 0, 0, 0, 0, "");
//   LODOP.PREVIEW();
//   LODOP.PRINT()
	 LODOP.PRINT_DESIGN()
};


function CreateFullBill2(m,printNo, printNum, printDate, mailno, children_nos, twoDimensionCode, proCode, destRouteLabel, d_contact, d_tel, d_company, d_address, destTeamCode, pay_method, codingMapping, destTransferCode, abFlag, codingMappingOut, j_contact, j_tel, j_company, j_address, things, j, m, COD, POD, printIcond, printIcony, remark, expressType) {
  LODOP.NewPage();
  //表格底版
  LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='../img/'>");
  LODOP.SET_SHOW_MODE("BKIMG_PRINT",1);//打印包含背景图
  printTemp(m);
  //**************************
  //打印序号
  LODOP.ADD_PRINT_TEXT(10, 239, 64, 20, printNo);
  LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  //打印次数和打印时间
  LODOP.ADD_PRINT_TEXT(29, 111, 260, 10, "打印时间" + printDate);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
  //运单号条码
  LODOP.ADD_PRINT_BARCODE(42, 63, "42.00mm", "13.00mm", "128C", mailno);
  LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
  //取twoDimensionCode值,二维码
  LODOP.ADD_PRINT_BARCODE(253, 150, 115, 115, "QRCode", twoDimensionCode);
  LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
   //子母件分数标识
  LODOP.ADD_PRINT_TEXT(96, 8, 58, 16, j + 1 + "/" + m);
  LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
//判断是否是子母单
	if(m>1 && j>0){
	  //子单号
	  LODOP.ADD_PRINT_TEXT(93, 120, 121, 16, children_nos);
	  LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
	  LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);

	  //母单号
		LODOP.ADD_PRINT_TEXT(113, 120, 118, 16, mailno);
		LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
		LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
	}else{
		LODOP.ADD_PRINT_TEXT(93, 120, 121, 16, mailno);
		LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
	  LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
	}
//取pro_code值
	LODOP.ADD_PRINT_TEXT(64, 307, 44, 64, proCode);
	LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
	LODOP.SET_PRINT_STYLEA(0, "FontSize", 49);
	LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
//取destRouteLabel值
  LODOP.ADD_PRINT_TEXT(137, 17, 278, 27, destRouteLabel);
  LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 26);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

//收件人信息
  LODOP.ADD_PRINT_TEXT(180, 48, 100, 14, d_contact);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  LODOP.ADD_PRINT_TEXT(195, 48, 200, 15, d_tel);
//LODOP.ADD_PRINT_TEXT(181, 215, 123, 15, d_company);
  LODOP.ADD_PRINT_TEXT(212, 48, 297, 30, d_address);
  //COD标识
  LODOP.ADD_PRINT_TEXT(152, 300, 100, 20, COD);
  LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  LODOP.SET_PRINT_STYLEA(0, "TextFrame", 11);
//取destTeamCode值
// 	LODOP.ADD_PRINT_TEXT(192, 149, 93, 36, destTeamCode);
// 	LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
// 	LODOP.SET_PRINT_STYLEA(0, "FontSize", 30);
// 	LODOP.SET_PRINT_STYLEA(0, "FontColor", "#C0C0C0");
// 	LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
//付款方式
  LODOP.ADD_PRINT_TEXT(245, 23, 85, 20, pay_method);
  LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
//取codingMapping值
  LODOP.ADD_PRINT_TEXT(271, 25, 85, 25, codingMapping);
	LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
	LODOP.SET_PRINT_STYLEA(0, "FontSize", 24);
	LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
//取sourceTransferCode值
  LODOP.ADD_PRINT_TEXT(311, 23, 85, 20, destTransferCode);
  LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
//取abFlag值
  LODOP.ADD_PRINT_TEXT(248, 312, 45, 47, abFlag);
  LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 36);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
//取codingMappingOut值
  LODOP.ADD_PRINT_TEXT(310, 315, 46, 25, codingMappingOut);
  LODOP.SET_PRINT_STYLEA(0, "FontName", "ARial");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 19);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
//寄件人信息
  LODOP.ADD_PRINT_TEXT(348, 52, 297, 15, j_contact);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  LODOP.ADD_PRINT_TEXT(365, 52, 297, 35, j_tel);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
//LODOP.ADD_PRINT_TEXT(352, 214, 123, 15, j_company);
  LODOP.ADD_PRINT_TEXT(395, 52, 297, 20, j_address);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
//其他
  LODOP.ADD_PRINT_TEXT(444, 70, 255, 25, expressType);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  LODOP.ADD_PRINT_TEXT(500, 90, 262, 65, things);
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  LODOP.ADD_PRINT_TEXT(700,48,311,70,remark);//备注
  LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
// 图标标签
//   LODOP.ADD_PRINT_IMAGE(497, 35, 60, 63, printIcony);
  LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);//(可变形)扩展缩放模式
  // LODOP.ADD_PRINT_IMAGE(496, 149, 60, 63, printIcond);
  // LODOP.SET_PRINT_STYLEA(0, "Stretch", 1);//(可变形)扩展缩放模式

// LODOP.ADD_PRINT_TEXT(505, 260, 90, 66, POD);
// LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
// LODOP.SET_PRINT_STYLEA(0, "FontSize", 30);
// LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
// LODOP.SET_PRINT_STYLEA(0, "TextFrame", 11);
};

//打印底板
function printTemp(m) {
  //表格底版
  LODOP.ADD_PRINT_LINE(53, "74mm", 52, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(137, "1.75mm", 136, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(243, "2.00mm", 242, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(341, "2.00mm", 340, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(425, "2.00mm", 424, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(53, 279, "36.00mm", 280, 0, 1);
  LODOP.ADD_PRINT_LINE(340, "35mm", "64.00mm", 133, 0, 1);
  LODOP.ADD_PRINT_LINE(339, "67.0mm", "64.00mm", 254, 0, 1);
  LODOP.ADD_PRINT_LINE(340, "77.00mm", "64.00mm", 292, 0, 1);
  LODOP.ADD_PRINT_LINE(266, "2.00mm", 265, "35mm", 0, 1);
  LODOP.ADD_PRINT_LINE(307, "2.00mm", 306, "35mm", 0, 1);
  LODOP.ADD_PRINT_LINE(306, "77.00mm", 305, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(175, "2.00mm", 175, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(485, "2.00mm", 484, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(575, "2.00mm", 574, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(690, 31, 689, "98mm", 0, 1);
  LODOP.ADD_PRINT_LINE(484,69,574,70,0,1);
	LODOP.ADD_PRINT_LINE(575,30,780,31,0,1);
  LODOP.ADD_PRINT_LINE(780,6,136,7,0,1);
  LODOP.ADD_PRINT_LINE(781,370,51,371,0,1);
  LODOP.ADD_PRINT_LINE(781,"1.75mm",780,"97.55mm",0,1);
  //文字底版
  if(m>1 && j>0){
		LODOP.ADD_PRINT_TEXT(95, 67, 53, 16, "子单号");
		LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
		LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
		LODOP.ADD_PRINT_TEXT(113, 66, 53, 16, "母单号");
		LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
		LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
	}else{
		LODOP.ADD_PRINT_TEXT(95, 67, 53, 16, "单号");
		LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
		LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
	}
	LODOP.ADD_PRINT_TEXT(57, 285, 44, 32, "T");
	LODOP.SET_PRINT_STYLEA(0, "FontName", "Arial");
	LODOP.SET_PRINT_STYLEA(0, "FontSize", 28);
  LODOP.ADD_PRINT_TEXT(258, 262, 25, 70, "已\r\n验\r\n视");
  LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
  LODOP.SET_PRINT_STYLEA(0, "FontColor", "#C0C0C0");
  LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  LODOP.ADD_PRINT_TEXT(444, "2.00mm", 72, 22, "产品类型：");
  LODOP.ADD_PRINT_TEXT(500, "2.00mm", 60, 22, "托寄物：");

  LODOP.ADD_PRINT_ELLIPSE(181, "2.00mm", 35, 35, 0, 1);
  LODOP.ADD_PRINT_ELLIPSE(347, "2.00mm", 35, 35, 0, 1);
  LODOP.ADD_PRINT_TEXT(189, 15, 22, 20, "收");
  LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
  LODOP.ADD_PRINT_TEXT(355, 15, 20, 20, "寄");
  LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
  LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);

  // 备注栏
//LODOP.ADD_PRINT_TEXT(500,"1.75mm",27,70,"备注：");
//LODOP.SET_PRINT_STYLEA(0,"FontName","宋体");
//LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
  //新增
  LODOP.ADD_PRINT_TEXT(590,48,311,94,"");
  LODOP.SET_PRINT_STYLEA(0,"FontName","宋体");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
  // 备注栏2
  LODOP.ADD_PRINT_TEXT(645,"2mm",27,70,"备注");
  LODOP.SET_PRINT_STYLEA(0,"FontName","宋体");
  LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
};
