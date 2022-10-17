/**
 * Created by Administrator on 2015/5/12.
 */
define(function (require, exports) {
    exports.pickBank = function() {
        $(".zotherw").click(function(){
            $(".listpay-way").show();
            $(this).hide()
        });

        /*$(".listpay-way li input[type='radio']").click(function(){
            $(".zcard-cate").fadeIn();
            var clname = $(this).parent().parent().attr('class');
            $(".zcard-catel span[data-cate='bankcate']").removeClass();
            $(".zcard-catel span[data-cate='bankcate']").addClass(clname);
            $(".listpay-way li").removeClass("zbankch");
            if($(this).prop("checked")){
                $(this).parent().parent(".listpay-way li").addClass("zbankch");
            }
        });
        $(".x_pw_u_l input[type='radio']").click(function(){
            $(".zotherw").fadeIn();
            $(".listpay-way").hide();
            $(".zcard-cate").hide();
        });*/

        $(document).delegate("[name=bank_type], img[data-type-id], span.bank", "click", function(e) {
            /*if(e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }*/

            var typeId = $(this).attr("data-type-id");

            if(typeId && (typeId == "alipay" || typeId == 'tenpay')) {
                $(".zotherw").fadeIn();
                $(".listpay-way").hide();
                $(".zcard-cate").hide();
            }

            $("[name=bank_type]").attr("checked", false);
            $(".x_pw_u_l_c").hide();

            $("#" + typeId).prop("checked", true);
            $("img[data-type-id=" + typeId + "]").siblings().show();

            $(".listpay-way li").removeClass("zbankch");
            $(this).parent("li").addClass("zbankch");

            e.stopImmediatePropagation();
        });
    };
    exports.setReserve = function(btn) {
        $(document).delegate(btn, "click", function(e) {
            var isChecked = $(this).prop('checked');
            if(isChecked) {
                $('.reserve-pay-info').show();
            }
            else {
                $('.reserve-pay-info').hide();
            }
            e.stopImmediatePropagation();
        });
    },
    exports.gotoPay = function(btn) {
        $(document).delegate(btn, "click", function(e) {
            //阻止默认事件触发
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }

            var pay_type = $("[name=bank_type]:checked").val();
            var order_type = $(this).data('data-order-type');
            var order_sn = $(this).attr('data-order-sn');
            if (!order_type) {
                order_type = 1;
            }
            if (!order_sn) {
                return false;
            }
            //支付宝
            if (pay_type == "alipay") {
                window.location.href = "/payment/alipay/pay/order_type/" + order_type + "/order_sn/" + order_sn;
            }
            //财付通
            else if (pay_type == "0") {
                window.location.href = "/payment/tenpay/pay/order_type/" + order_type + "/order_sn/" + order_sn;
            }
            //京东支付
            else if (pay_type == "jdpay") {
                window.location.href = "/payment/jdpay/pay/order_type/" + order_type + "/order_sn/" + order_sn;
            }
            //网银在线支付
            else if (pay_type == "chinabank") {
                window.location.href = "/payment/chinabank/pay/order_type/" + order_type + "/order_sn/" + order_sn;
            }
            //
            else {
                window.location.href = "/payment/tenpay/pay/order_type/" + order_type + "/order_sn/" + order_sn + "/pay_mod/" + pay_type;
            }

            //阻止事件冒泡
            e.stopImmediatePropagation();
        });
    }
});