/**
 * Created by Administrator on 2015/6/2.
 */
define(function (require, exports) {
    // var $ = require('/Public/js/home/jquery-1.10.2.js');
    var dialog = require("dialog");
    require("base");
    exports.init = function() {
        this.cancelOrder();
        this.delOrder();
        this.confirmOrder();
        this.rejectOrder();
    },
    exports.delOrder = function() {
        $(document).delegate('.del-order-btn', 'click', function (e) {
            var order = $(this).attr('data-order-sn');

            var cm = window.confirm('您确认需要删除该订单吗，删除后数据不存在?');
            if (!cm) {
                return false;
            }

            requestApi("/index.php?m=user&c=order_api&a=delOrder", {order: order}, function (res) {
                if (res.result == 1) {
                    $('.order-list-container[data-order-sn="' + order + '"]').fadeOut();
                    /*setTimeout(function () {
                        $('.cancel-order-btn[data-order-sn="' + order + '"]').remove();
                    }, 1000);*/
                    showTip('订单已删除', 'success');
                    setTimeout(function(){
                        window.location.reload();
                    },1000)
                }else{
                    showTip('删除失败!', 'error');
                }
            });

            e.stopImmediatePropagation();
        });
    },

    exports.cancelOrder = function() {
        $(document).delegate('.cancel-order-btn', 'click', function (e) {
            var order = $(this).attr('data-order-sn');

            var cm = window.confirm('您确认需要取消该订单吗?');
            if (!cm) {
                return false;
            }

            requestApi("/index.php?m=user&c=order_api&a=cancelOrder", {order: order}, function (res) {
                if (res.result == 1) {
                    setTimeout(function () {
                        $('.cancel-order-btn[data-order-sn="' + order + '"] .cancel-order-btn').text('删除订单').removeClass("cancel-order-btn").addClass("del-order-btn");
                    }, 300);

                    showTip('订单已取消', 'success');
                    setTimeout(function(){
                        window.location.reload();
                        //$(".order-list-container[data-order-sn="+order+"]").remove();
                    },1000)
                }else{
                    showTip(res.msg,'error');
                }
            });

            e.stopImmediatePropagation();
        });
    },

    exports.confirmOrder = function() {
        //$(document).delegate('.confirm-receipt-btn', 'click', function (e) {
        $(document).delegate('.confirm-order-btn', 'click', function (e) {
            var order = $(this).attr('data-order-sn');
            var _this = $(this);

            var cm = window.confirm('你确定需要确认收货吗?');
            if (!cm) {
                return false;
            }

            requestApi("/index.php?m=user&c=order_api&a=confirmReceiving", {order: order}, function (res) {
                if (res.result == 1) {
                    setTimeout(function () {
                       $(".order-status-column[data-order-sn=" + order + "]").html("已完成");
                    }, 300);
                    showTip('签收成功!','success');
                    setTimeout(function(){
                        window.location.reload();
                    },1000)

                }else{
                    showTip('签收失败!','error');
                }
            });

            e.stopImmediatePropagation();
        });
    },

    exports.rejectOrder = function(){
        $(document).delegate('.reject-order-btn', 'click', function (e) {
            var order = $(this).attr('data-order-sn');
            var _this = $(this);

            var cm = window.confirm('你确定要拒绝收货吗?');
            if (!cm) {
                return false;
            }

            requestApi("/index.php?m=user&c=order_api&a=rejectReceiving", {order: order}, function (res) {
                if (res.result == 1) {
                    setTimeout(function () {
                        $(".order-status-column[data-order-sn=" + order + "]").html("已拒绝收货");
                    }, 300);
                    showTip('拒签成功!','success');
                    setTimeout(function(){
                        window.location.reload();
                    },1000)
                }else{
                    showTip('拒签失败!','error');
                }
            });

            e.stopImmediatePropagation();
        });
    }

    /**
     * 弹窗提示
     * @param msg
     * @param timeout
     * @param callback
     */
    function showTip(msg,skin, timeout, callback) {
        if (!skin) {
            skin = "general";
        }
        var d = dialog({
            button: [
                {
                    value: '确定'
                }
            ],
            title: " ",
            content: msg,
            skin: skin
            /*skin的样式有success 、error 、warning 、general   */

        });
        d.show();
        if (!timeout) {
            timeout = 2000;
        }
        setTimeout(function () {
            d.close().remove();
        }, timeout);
    }
});