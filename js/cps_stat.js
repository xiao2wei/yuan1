/**
 * Created by Arimis on 2015/6/10.
 * 为了不适用其他依赖包，需要使用原生的javascript功能
 */
/**
 * 获取ip地址信息，使用sohu接口
 */
//document.write('<script type="text/javascript" src="http://pv.sohu.com/cityjson?ie=utf-8" charset="utf-8"></script>');
/**
 * 定义原生ajax方法
 * @param url
 * @param method
 * @param data
 * @param okFn
 * @param failedFn
 */
function CpsAjaxRequest(url, method, data, okFn, failedFn) {
   
}


/**
 * 浏览器信息检测
 *
 * @类型：公共方法
 * @参数：无
 * @返回：浏览器名称
 * @作者：[BI]CJJ http://www.imcjj.com
 * @时间：2006-11-7 Last update at 2006-11-8
 * @备注：
 */
function CpsCheckBrowse() {
    var sUA = navigator.userAgent;
    var browseKernel;
    var bt = new BrowserTester();
    //检测IE浏览器
    if ((navigator.appName == "Microsoft Internet Explorer")) {
        //检测模拟IE浏览的OPERA。edit at 2006-11-08(ver 0.1.2)
        if (sUA.indexOf('Opera') != -1) {
            browseKernel = 'Presto';
            if (window.opera && document.childNodes) {
                return 'Opera 7+';
            } else {
                return 'Opera 6-';
            }
        }
        browseKernel = 'Trident';
        if (sUA.indexOf('Maxthon') != -1) {
            return 'Maxthon';
        }
        if (sUA.indexOf('TencentTraveler') != -1) { //ver 0.1.3
            return '腾迅TT';
        }
        if (document.getElementById) {
            return "IE5+";
        } else {
            return "IE4-";
        }
    }
    //检测Gecko浏览器
    if (sUA.indexOf('Gecko') != -1) {
        browseKernel = 'Gecko';
        if (navigator.vendor == "Mozilla") {
            return "Mozilla";
        }
        if (navigator.vendor == "Firebird") {
            return "Firebird";
        }
        if (sUA.indexOf('Firefox') != -1) {
            return 'Firefox';
        }
        return "Gecko";
    }
    //Netscape浏览器
    if (sUA.indexOf('Netscape') != -1) {
        browseKernel = 'Gecko';
        if (document.getElementById) {
            return "Netscape 6+";
        } else {
            return 'Netscape 5-';
        }
    }
    //检测Safari浏览器
    if (sUA.indexOf('Safari') != -1) {
        browseKernel = 'KHTML';
        return 'Safari';
    }
    if (sUA.indexOf('konqueror') != -1) {
        browseKernel = 'KHTML';
        return 'Konqueror';
    }
    //谷歌浏览器

    //目前世界公认浏览网页速度最快的浏览器，但它占用的系统资源也很大。
    if (sUA.indexOf('Opera') != -1) {
        browseKernel = 'Presto';
        if (window.opera && document.childNodes) {
            return 'Opera 7+';
        } else {
            return 'Opera 6-';
        }
        return 'Opera';
    }
    if ((sUA.indexOf('hotjava') != -1) && typeof( navigator.accentColorName ) == 'undefined') {
        return 'HotJava';
    }
    if (document.all && document.getElementById && navigator.savePreferences && (sUA.indexOf('netfront') < 0 ) && navigator.appName != 'Blazer') {
        return 'Escape 5';
    }
    //Konqueror / Safari / OmniWeb 4.5+
    if (navigator.vendor == 'KDE' || ( document.childNodes && ( !document.all || navigator.accentColorName ) && !navigator.taintEnabled )) {
        browseKernel = 'KHTML';
        return 'KDE';
    }
    if (navigator.__ice_version) {
        return 'ICEbrowser';
    }
    if (window.ScriptEngine && ScriptEngine().indexOf('InScript') + 1) {
        if (document.createElement) {
            return 'iCab 3+';
        } else {
            return 'iCab 2-';
        }
    }
    if (document.layers && !document.classes) {
        return 'Omniweb 4.2-';
    }
    if (document.layers && !navigator.mimeTypes['*']) {
        return 'Escape 4';
    }
    if (navigator.appName.indexOf('WebTV') + 1) {
        return 'WebTV';
    }
    if (sUA.indexOf('netgem') != -1) {
        return 'Netgem NetBox';
    }
    if (sUA.indexOf('opentv') != -1) {
        return 'OpenTV';
    }
    if (sUA.indexOf('ipanel') != -1) {
        return 'iPanel MicroBrowser';
    }
    if (document.getElementById && !document.childNodes) {
        return 'Clue browser';
    }
    if (document.getElementById && ( (sUA.indexOf('netfront') != -1) || navigator.appName == 'Blazer' )) {
        return 'NetFront 3+';
    }
    if ((sUA.indexOf('msie') + 1 ) && window.ActiveXObject) {
        return 'Pocket Internet Explorer';
    }
    return "Unknown";
}

/**
 * 操作系统信息检测
 *
 * @类型：公共方法
 * @参数：无
 * @返回：操作系统名称
 * @作者：[BI]CJJ http://www.imcjj.com
 * @时间：2006-11-7
 * @备注：
 */
function CpsCheckOS() {
    var sUA = navigator.userAgent.toLowerCase();
    if (sUA.indexOf('win') != -1) {
        if (sUA.indexOf("nt 5.2") != -1) {
            return "Windows 2003";
        }
        if ((sUA.indexOf("nt 5.1") != -1) || (sUA.indexOf("XP") != -1)) {
            return "Windows XP";
        }
        if ((sUA.indexOf('nt 5.0') != -1) || (sUA.indexOf('2000') != -1)) {
            return 'Windows 2000';
        }
        if ((sUA.indexOf("winnt") != -1) || (sUA.indexOf("windows nt") != -1)) {
            return "Windows NT";
        }
        if ((sUA.indexOf("win98") != -1) || (sUA.indexOf("windows 98") != -1)) {
            return "Windows 98";
        }
        return "Windows";
    }
    if (sUA.indexOf('linux') != -1) {
        return 'Linux';
    }
    if (sUA.indexOf("freebsd") != -1) {
        return 'FreeBSD';
    }
    if (sUA.indexOf('x11') != -1) {
        return 'Unix';
    }
    if (sUA.indexOf('mac') != -1) {
        return "Mac";
    }
    if (sUA.indexOf("sunos") != -1) {
        return 'Sun OS';
    }
    if ((sUA.indexOf("os/2") != -1) || (navigator.appVersion.indexOf("OS/2") != -1) || (sUA.indexOf("ibm-webexplorer") != -1)) {
        return "OS 2"
    }
    if (navigator.platform == 'PalmOS') {
        return 'Palm OS';
    }
    if ((navigator.platform == 'WinCE' ) || ( navigator.platform == 'Windows CE' ) || ( navigator.platform == 'Pocket PC' )) {
        return 'Windows CE';
    }
    if (sUA.indexOf('webtv') != -1) {
        return 'WebTV Platform';
    }
    if (sUA.indexOf('netgem') != -1) {
        return 'Netgem';
    }
    if (sUA.indexOf('opentv') != -1) {
        return 'OpenTV Platform';
    }
    if (sUA.indexOf('symbian') != -1) {
        return 'Symbian';
    }
    return "Unknown";
}

var BrowserTester = function () {
    /**
     * @module core/navigator/shell
     */
    'use strict';

    var ieAX = window.ActiveXObject;
    var ieMode = document.documentMode;
    var ieVer = _getIeVersion() || ieMode || 0;
    var isIe = ieAX || ieMode;
    var chromiumType = _getChromiumType();

    /**
     * 判断是否为 IE 浏览器
     *
     * @example
     * shell.isIE;
     * // true or false
     */
    var isIE = (function () {
        return !!ieVer;
    })();
    /**
     * IE 版本
     *
     * @example
     * shell.ieVersion;
     * // 6/7/8/9/10/11/12...
     */
    var ieVersion = (function () {
        return ieVer;
    })();
    /**
     * 是否为谷歌 chrome 浏览器
     *
     * @example
     * shell.isChrome;
     * // true or false
     */
    var isChrome = (function () {
        return chromiumType === 'chrome';
    })();
    /**
     * 是否为360安全浏览器
     *
     * @example
     * shell.is360se;
     * // true or false
     */
    var is360se = (function () {
        return chromiumType === '360se';
    })();
    /**
     * 是否为360极速浏览器
     *
     * @example
     * shell.is360ee;
     * // true or false
     */
    var is360ee = (function () {
        return chromiumType === '360ee';
    })();
    /**
     * 是否为猎豹安全浏览器
     *
     * @example
     * shell.isLiebao;
     * // true or false
     */
    var isLiebao = (function () {
        return chromiumType === 'liebao';
    })();
    /**
     * 是否搜狗高速浏览器
     *
     * @example
     * shell.isSogou;
     * // true or false
     */
    var isSogou = (function () {
        return chromiumType === 'sogou';
    })();
    /**
     * 是否为 QQ 浏览器
     *
     * @example
     * shell.isQQ;
     * // true or false
     */
    var isQQ = (function () {
        return chromiumType === 'qq';
    })();

    /**
     * 检测 external 是否包含该字段
     * @param reg 正则
     * @param type 检测类型，0为键，1为值
     * @returns {boolean}
     * @private
     */
    function _testExternal(reg, type) {
        var external = window.external || {};
        for (var i in external) {
            if (reg.test(type ? external[i] : i)) {
                return true;
            }
        }

        return false;
    }

    /**
     * 获取 Chromium 内核浏览器类型
     * @link http://www.adtchrome.com/js/help.js
     * @link https://ext.chrome.360.cn/webstore
     * @link https://ext.se.360.cn
     * @return {String}
     *         360ee 360极速浏览器
     *         360se 360安全浏览器
     *         sougou 搜狗浏览器
     *         liebao 猎豹浏览器
     *         chrome 谷歌浏览器
     *         ''    无法判断
     * @version 1.0
     * 2014年3月12日20:39:55
     */

    function _getChromiumType() {
        if (isIe || typeof window.scrollMaxX !== 'undefined') {
            return '';
        }

        var _track = 'track' in document.createElement('track');
        var webstoreKeysLength = window.chrome && window.chrome.webstore ? Object.keys(window.chrome.webstore).length : 0;

        // 搜狗浏览器
        if (_testExternal(/^sogou/i, 0)) {
            return 'sogou';
        }

        // 猎豹浏览器
        if (_testExternal(/^liebao/i, 0)) {
            return 'liebao';
        }

        // chrome
        if (window.clientInformation && window.clientInformation.languages && window.clientInformation.languages.length > 2) {
            return 'chrome';
        }

        if (_track) {
            // 360极速浏览器
            // 360安全浏览器
            return webstoreKeysLength > 1 ? '360ee' : '360se';
        }

        return '';
    }

    // 获得ie浏览器版本

    function _getIeVersion() {
        var v = 3,
            p = document.createElement('p'),
            all = p.getElementsByTagName('i');

        while (
            p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]);

        return v > 4 ? v : 0;
    }
};
//cookies读取JS
function CpsGetCookie(Name) {
    var search = Name + "="
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search)
        if (offset != -1) {
            offset += search.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) end = document.cookie.length;
            var cookieVal = CpsBase64decode(decodeURIComponent(document.cookie.substring(offset, end)));
            jsonObj = CpsJSON.parse(cookieVal);
            if (jsonObj) {
                delete cookieVal;
                return jsonObj;
            }
            else {
                return cookieVal;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

/**
 * @param name
 * @param value
 * @param expires 秒
 * @param path
 * @param domain
 * @param secure
 * @constructor
 */
function CpsSetCookie(name, value, expires, path, domain, secure) {
    var argv = CpsSetCookie.arguments;
    var argc = CpsSetCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    if (typeof value == 'object') {
        value = CpsJSON.stringify(value);
    }
    var now = new Date();
    var nowMicroSec = now.getTime();
    expires = new Date(nowMicroSec + expires * 1000);


    value = CpsBase64encode(value);
    document.cookie = name + "=" + decodeURI
        (value) +
        ((expires == null) ? "" : (";expires="
        + expires.toUTCString())) +
        ((path == null) ? "" : (";path=" + path)) +
        ((domain == null) ? "" : (";domain=" +
        domain)) +
        ((secure == true) ? ";secure" : "");
}

var CpsJSON = (typeof JSON != 'undefined') ? JSON : {};
// implement JSON.stringify serialization
CpsJSON.stringify = (typeof CpsJSON.stringify != "undefined") ? CpsJSON.stringify : function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

// implement JSON.parse de-serialization
CpsJSON.parse = (typeof CpsJSON.parse != 'undefined') ? CpsJSON.parse : function (str) {
        if (str === "") str = '""';
        eval("var p=" + str + ";");
        return p;
    };

var CpsBase64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var CpsBase64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
//客户端Base64编码
function CpsBase64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += CpsBase64EncodeChars.charAt(c1 >> 2);
            out += CpsBase64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += CpsBase64EncodeChars.charAt(c1 >> 2);
            out += CpsBase64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CpsBase64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CpsBase64EncodeChars.charAt(c1 >> 2);
        out += CpsBase64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CpsBase64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CpsBase64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
//客户端Base64解码
function CpsBase64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = CpsBase64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = CpsBase64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = CpsBase64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = CpsBase64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
/**
 * 获取浏览器URL参数值
 * @param name
 * @returns {null}
 * @constructor
 */
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){return  unescape(r[2]);}else{return null};
}

/*进入网页时记录相关数据，只记录有推广码的用户浏览信息*/
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var p = CpsGetCookie("cpsviewlog") ;
        //var vtc = p, vp = null, vs = null, vurl = null, vip = "", vtype = 1;
        var vtc = GetQueryString('__t__') , target;
        var shop_id = document.getElementById("site_city") ? document.getElementById("site_city").getAttribute("shop-id") : 0;
        target = CpsGetCookie("kelacps");
        if(vtc) 
        {
            p.target_code = vtc;
            p.promoted_url = window.location.href;
            CpsSetCookie("kelacps", {
                'target_code': vtc,
                'url': window.location.href,
                'entry_time': Date.now(),
                'promoter': '',
                'shop_id': shop_id,
                'client_ip': ""
            }, 2592000, "/", window.JsDomain); /*有效期30天*/
        }
        else if(target)
        {
                p.target_code = target.target_code;
                p.promoter = target.promoter;
                p.shop_id = target.shop_id;
                p.promoted_url = target.url;
                p.type = 2;
        }
        
        var data = {
            target_code: '',
            promoter: '',
            shop_id: '',
            promoted_url: '',
            referrer: CpsBase64encode(document.referrer),
            land_url: CpsBase64encode(location.href),
            land_time: new Date().getTime(),
            browser: CpsCheckBrowse(),
            os: CpsCheckOS(),
            type: '',
        };
        for(var name in data) { if(! data[name]) data[name] = p[name]};
        
        CpsSetCookie("cpsviewlog", data, 2592000, "/", window.JsDomain); /*有效期30天*/
        
        /*如果用户超过30分钟没有操作页面，自动上报日志*/
        CpsReportData();
    }
};

/*离开网页时提交统计，只有*/
window.onbeforeunload = CpsReportData;

function CpsReportData() {
    var data = CpsGetCookie("cpsviewlog");
    data.exit_time = new Date().getTime();
    for(var name in data ) { if(! data[name]) data[name] = ''};
    
    var host = window.location.host;
    CpsAjaxRequest("http://" + host + "ajax.php?m=api&c=cps&a=log", 'get', data, function () {  });
}

