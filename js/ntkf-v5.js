/**
 * Created by Arimis Wang on 2015/6/23.
 * @author Arimis Wang
 * @date 2015年6月23日17:29:47
 */

define(function(require, exports) {
    require("base.js");
    //var cart = require("KelaCart");

    var browser = {
        versions : function() {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident : u.indexOf('Trident') > -1, //IE内核
                presto : u.indexOf('Presto') > -1, //opera内核
                webKit : u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile : !!u.match(/(iPhone|iPod|Android|ios|iPad)/i) || !!u.match(/AppleWebKit.*Mobile.*/), //|| !!u.match(/AppleWebKit/), //是否为移动终端
                ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone : u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp : u.indexOf('Safari') == -1,//是否web应该程序，没有头部与底部
                google:u.indexOf('Chrome')>-1
            };
        }(),
        language : (navigator.browserLanguage || navigator.language).toLowerCase()
    };

    exports.init = function(config, unload_js) {
        var user_info = $.parseJSON($.cookie("user_info"));
        NTKF_PARAM = {
            siteid:"kf_9777",		//企业ID，必填，取值参见文档开始表
            settingid:"kf_9777_1435912897298",		//缺省客服配置ID，必填，取值参见文档开始表
            uid: user_info ? user_info.user_id : "",		//用户ID,未登录可以为空
            uname: user_info && user_info.user_name ? user_info.user_name : "",		//用户名，未登录可以为空
            isvip: "0" ,         //是否为vip用户ntkf-chat
            userlevel:	"", 	//网站自定义会员级别
            ntalkerparam: {}
        };
        //跟订单相关的页面
        if (config && config.order_sn) {
            NTKF_PARAM.orderid = config.order_sn; //订单ID
            NTKF_PARAM.orderprice = config.pay_cash; //订单总价
        }
        // 购物车
        if (config && config.total_cash) {
            NTKF_PARAM.ntalkerparam.cartprice = config.total_cash; //购物车总价、订单页无
        }
        // 购物车、订单页 用的goods items
        var items = [];
        var cart_info = $(".goods-list-item");
        if(cart_info && cart_info.length > 0) {
            $(cart_info).each(function() {
                var num = $(this).attr('data-goods-num');
                var type = $(this).data('goods-type');
                var id = $(this).data('id');
                var item_id = '';
                switch (type) {
                    case 'diamond_container':
                        item_id = 'jietuo'; break;
                    case 'diamond':
                        item_id = 'luozuan'; break;
                    default :
                        item_id = 'chengpin'; break;
                }
                items.push({id: item_id, count: num});
            });
            if (items.length > 0) {
                NTKF_PARAM.ntalkerparam.items = items;
            }
        }
        // 商品详情页
        if (config && config.goods_id) {
            NTKF_PARAM.ntalkerparam.item = {id: config.goods_id};
        }
        // 列表页
        if (config && config.cid) {
            //分类ID,多分类可以用分号(;)分隔, 长路径父子间用冒号(:)分割
            NTKF_PARAM.ntalkerparam.categoryid = config.cid;
            NTKF_PARAM.ntalkerparam.brandid = ""; // 品牌
        }

        var shop_ntkf_cfg = {
            //4: 'kf_9777_1435912926303', // Z北京-西单
            //56: 'kf_9777_1435913434611', // 上海-南京东路
            38: 'kf_9777_1435913048499', // Z广州-广晟
            83: 'kf_9777_1435913113098', // Z广州-吉邦
            9: 'kf_9777_1435913015697', // Z深圳-地王
            //4: 'kf_9777_1435913271860', // Z深圳-南山
            40: 'kf_9777_1435913487585', // Z武汉
            30: 'kf_9777_1435912970651', // Z杭州
            31: 'kf_9777_1435913207715', // Z南京
            60: 'kf_9777_1435913080680', // Z天津
            43: 'kf_9777_1435913163208', // Z长沙
            41: 'kf_9777_1435913586279', // Z成都
            48: 'kf_9777_1435913348606', // Z重庆
            44: 'kf_9777_1435913409762', // Z郑州
            42: 'kf_9777_1435913240904', // Z苏州
            47: 'kf_9777_1435913381510', // Z合肥
            45: 'kf_9777_1435913319610', // Z青岛
            68: 'kf_9777_1435913524168', // Z乌鲁木齐
            // 104: 'kf_9777_1444641400035', //长春西安大路体验店
            133: 'kf_9777_1444641400035',  //长春新天地购物中心体验店
            137: 'kf_9777_1445239957484'  //乌海金盘商厦体验店
        };

        var shop_53_cfg = {
            4: "10119386",
            56: "10119385" //http://www15.53kf.com/kf.php?arg=10119385&style=1
        };

        var _kf_shop_id_ = $('#site_city').attr('shop-id');

        //动态加载小能js库
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript= document.createElement("script");
        oScript.type = "text/javascript";
        if(_kf_shop_id_ == 4 || _kf_shop_id_ == 56) {
            if(!unload_js) {
                var cfg_id = shop_53_cfg[_kf_shop_id_];
                oScript.src="http://www15.53kf.com/kf.php?arg=" + cfg_id + "&style=1";
            }
        }
        else {
            oScript.src="http://dl.ntalker.com/js/xn6/ntkfstat.js?siteid=kf_9777";
        }
        oHead.appendChild( oScript);

        $(document).delegate(".ntkf-chat", 'click', function () {

            if(_kf_shop_id_ == 4 || _kf_shop_id_ == 56) {
                var cfg_id = shop_53_cfg[_kf_shop_id_];
                var target_url = 'http://www15.53kf.com/webCompany.php?arg=' + cfg_id + '&style=1&language=cn&lytype=0&charset=utf8';
                if($(this).is('a')) {
                    $(this).attr('target', "_blank").attr('href', target_url);
                }
                else {
                    window.open(target_url);
                }
                
            }
            else {
                var is_after_sale = parseInt($(this).attr("data-after-sale"));
                if (!isNaN(is_after_sale) && is_after_sale == 1) {
                    NTKF_PARAM = NTKF_PARAM || {};
                    NTKF_PARAM.settingid = "kf_9777_1435912863646"; //售后客服组
                } else {

                    var settingid = shop_ntkf_cfg[_kf_shop_id_];
                    if (settingid && settingid.length > 0) {
                        NTKF_PARAM.settingid = settingid; // 地方站
                    } else {
                        NTKF_PARAM.settingid = "kf_9777_1435912897298"; // 全国官网
                    }
                }
                NTKF.im_openInPageChat();
            }

        });

        //打开网页30秒后自动弹出对话框
        /*$(document).ready(function () {
            var firstStart = $.cookie("ntkf_first_landing");
            var now = parseInt(new Date().getTime() / 1000);
            var window_closed = $.cookie('ntkf_close_window');
            var shop_id = $('#site_city').attr('shop-id');
            //北京上海不弹出小能
            if (shop_id == 4 || shop_id == 56) {
                return false;
            }
            var settingid = shop_ntkf_cfg[shop_id];
            if (settingid && settingid.length > 0) {
                NTKF_PARAM.settingid = settingid; // 地方站
            } else {
                NTKF_PARAM.settingid = "kf_9777_1435912897298"; // 全国官网
            }
            popChatWindowLoop();

            return true;

            //后面的逻辑根据业务需求再变动
            //如果用户手动关闭窗口，则不再主动弹出
            if (window_closed) {
                return false;
            }

            //无论刷新还是新开页面，120秒内不弹出
            if (firstStart && (now - firstStart > 120)) {
                setTimeout(function () {
                    NTKF.im_openInPageChat();
                }, 30000);
            }
            else {
                $.cookie("ntkf_first_landing", now, {
                    path: "/",
                    expire: 'session',
                    domain: window.JsDomain
                });
                setTimeout(function () {
                    NTKF.im_openInPageChat();
                    checkWindowDisplay();
                }, 120000);
            }
        });*/

        function popChatWindowLoop(timeout) {
            if(typeof timeout != 'Number') {
                timeout = false;
            }

            NTKF.im_openInPageChat();
            if(timeout) {
                setTimeout(function() {
                    NTKF.im_openInPageChat();
                    //确保一直弹出对话框
                    popChatWindowLoop();
                }, timeout);
            }
            
        }

        function checkWindowDisplay() {
            var window_ = $(".window-containter");
            if(window_ && window_.length > 0) {
                setTimeout(function() {
                    checkWindowDisplay();
                }, 3000);
                return true;
            }
            else {
                $.cookie("ntkf_close_window", 1);
                return false;
            }
        }
    };
});
