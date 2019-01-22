//var globalUrl="http://192.168.3.171:8080/";
// var globalUrl="http://192.168.3.211:8080/";
// var globalUrl="http://47.99.150.184:8089/";
// var globalUrl="http://47.99.150.184:8091/";
var globalUrl="http://192.168.3.29:8080/";
// var globalUrl="http://erp.changwash.com:8086/";
function formatDate(now) {
	var now=new Date(now);
     var year=now.getFullYear(); 
     var month=now.getMonth()+1; 
     var date=now.getDate(); 
     var hour=now.getHours();  
     var minute=now.getMinutes(); 
     var second=now.getSeconds(); 
     if(hour<10){
     	hour="0"+hour;
     }
     if(minute<10){
     	minute="0"+minute;
     }
     if(second<10){
     	second="0"+second;
     }
     return year+"-"+month+"-"+date+' '+hour+":"+minute+":"+second;
}
function timeFormate(now){
	var hour=now.getHours(); 
    var minute=now.getMinutes();
    return hour+":"+minute;
}

/**
 * 获取当前时间 年-月-日
 * @returns {string}
 */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//时间戳转时间
function timestampToTime(timestamp) {
    var date = new Date(timestamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y+'-'+ m +'-'+ d+' '+h+':'+minute+':'+second;
}

function getQueryString(name,noUnescape) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);     //window.location控制获取当前页面的URL参数

    noUnescape = noUnescape == undefined ? false : noUnescape;
    if(noUnescape){
        if (r != null) return r[2]; return null;
    }
    else{
        if (r != null) return unescape(r[2]); return null;
    }
}
function EncodeUtf8(s1) {
    var s = escape(s1).replace(/\%u/g,"&#x");
    return s;
}

