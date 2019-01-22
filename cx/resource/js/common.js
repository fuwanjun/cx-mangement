var globalUrl = "http://192.168.3.217:8080/";
//var globalUrl="http://192.168.3.211:8081/";
// var globalUrl="http://47.96.78.174:8088/";

// var globalUrl="http://www.changwash.com:8088/";
function formatDate(now) {
    var now = new Date(now);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + date + ' ' + hour + ":" + minute + ":" + second;
}

function timeFormate(now) {
    var hour = now.getHours();
    var minute = now.getMinutes();
    return hour + ":" + minute;
}

function getQueryString(name, noUnescape) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);     //window.location控制获取当前页面的URL参数

    noUnescape = noUnescape == undefined ? false : noUnescape;
    if (noUnescape) {
        if (r != null) return r[2];
        return null;
    }
    else {
        if (r != null) return unescape(r[2]);
        return null;
    }
}

//时间戳转时间
function timestampToTime(timestamp) {
    var date = new Date(timestamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}


/**
 * 开始时间设置完整日期
 * @param val
 * @returns {*}
 */
function startTimeCinfg(val) {
    if (!val) {
        return val;
    }
    return val + " 00:00:00";
}

/**
 * 结束时间设置完整日期
 * @param val
 * @returns {*}
 */
function endTimeCinfg(val) {
    if (!val) {
        return val;
    }
    return val + " 23:59:59";
}

/**
 * 清除所有缓存
 */
function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}