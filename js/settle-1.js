/**
 * Created by Administrator on 2015/5/9.
 */

define(function (require, exports) {
    require("base");
    var dialog = require("dialog");
    var cart = require("KelaCart");
    var SYS_SITE_URL = "/";
    exports.init = function (site_url) {
        if(typeof site_url == 'string') {
            SYS_SITE_URL = site_url;
        }
        this.pickLogistics();
        this.pickShop();
        this.setAddressWithoutLogin();
        this.setInvoice();
        this.useActivity();
        this.confirmOrder();
        this.deliveryDisplay();//收货方式动态显示
        this.invoiceDisplay();//发票信息动态显示
        this.addressDefaultDisplay();//默认显示的收货地址
        this.changeAddressDisplay();//选择收货地址
        //this.checkRecommend();//检查推荐人是否存在
        this.change_payout_type();
        this.checkdingjinvalid();
        this.setDefaultZTInfo();//用户选择到体验店自提时，给提货人和提货人手机号加默认值（默认值为当前登录用户对应的信息）
        this.clickExpress();
    };
    //使用优惠券
    exports.useActivity = function () {
        exports.useDiscountCode();
        exports.pickCoupon();
        exports.pickGift();

        $('[name="activity"]').on('click', function() {
            $('[id^=activity_]').hide();

            var currval = $('[name="activity"]:checked').val();
            if(currval=='cpcode') {
                var sameTypeCoupons = $(".coupon-list-item.current");
                sameTypeCoupons.removeClass("current");
                sameTypeCoupons.find(":checkbox").prop("checked", false);
                calculateOrderCash();

            } else if (currval=='coupon') {

                $('#activity_coupon').show();
                $("#DiscountCode").val('').next().html("");
                calculateOrderCash();

            } else if(currval=='gain') {

                var orderCash = parseFloat($(".total-cash").data("total-cash"));
                var gain = $('[name="activity"]:checked').data('gain');
                var finalPayCash = orderCash - gain;
                $(".discount-cash").text(gain.toFixed(2));
                changeFinalPayCash(finalPayCash.toFixed(2));
            }
        });
    };
    //使用优惠码
    exports.useDiscountCode = function () {
        $('#DiscountCode').on('click',function(){
            // 点击输入code 框，自动选中cpcode
            $('#coupon_code').prop('checked', true);
            $('#coupon_code').click();
        }).on('blur',function(){
            // 优惠码验证
            var code = $.trim($(this).val());
            $('#DiscountCode').val(code);
            if(code){
                 $.get('ajax.php?m=Api&c=Coupon&a=checkCouponSn&sn='+code,function(res){
                     if(res.result==1) {
                         $("#DiscountCode").next().html("<input type=\"checkbox\" data-coupon-sn=\""+code+"\" class=\"coupon-list-item current\" style=\"display:none\"/>");
                     } else {
                         $("#DiscountCode").val('').next().html("");
                         alert('优惠码不可用！');
                     }
                     calculateOrderCash();
                 }, 'json');
            }
        });
    };
    //选择礼物
    exports.pickGift = function() {
        $('#gift_list li').on('click', function() {
            // 没有售完的才可以选择
            if ($(this).find('.info-noprod').length==0) {
                $('#gift_list').find('.l_chec').removeClass('active');
                $(this).find('.l_chec').addClass('active');
                // 礼物
                $('#gift_id').val($(this).data('gift-id'));
            }
        });
    };
    exports.pickLogistics = function () {
        $(document).delegate('.postage-radio', 'change', function () {
            if (this.value == '0') {
                //$('.address-picker').show();
                $('.shop-list').hide();
            }
            else {
                //$('.address-picker').hide();
                $('.shop-list').show();
            }
        });
    };

    exports.setAddressWithoutLogin = function () {

    };

    exports.pickShop = function () {
        $(document).delegate('.shop-id', 'change', function () {
            var currentOption = $(this).find("option:selected");
            var addr = currentOption.attr('data-address');
            var phone = currentOption.attr('data-phone');
            var traffic = currentOption.attr('data-traffic');
            $(this).parent().siblings(".shop-tip").html("地址：" + addr + " 电话：" + phone + " 交通：" + traffic);
        })
    };

    exports.setInvoice = function () {
        $(document).delegate("#need_invoice", "click", function () {
            var isChecked = $(this).prop('checked');
            if (isChecked) {
                $('.invoice-title-info').show();
            }
            else {
                $('.invoice-title-info').hide();
            }
        })
    };

    //仅限使用一张
    exports.pickCoupon  = function() {

        $(document).delegate(".coupon-list-item", "click", function(e) {
            var isPicked = $(this).hasClass("current");
            if(isPicked) {
                $(this).removeClass("current");
                $(this).find(":checkbox").prop("checked", false);
            }
            else {
                //获取当前选中优惠券编号
                var couponSn = $(this).attr("data-coupon-sn");
                if(!couponSn) {
                    return false;
                }

                //获取当前选中优惠券的详细信息
                var coupon = getCouponItem(couponSn);

                //同时可使用数量限制检测
                var use_limit = parseInt(coupon.use_limit);
                if(!isNaN(use_limit) && use_limit > 0) {
                    var pickedSiblings = $(".coupon-list-item.current[data-coupon-id=" + coupon.coupon_id + "]");
                    if(pickedSiblings && pickedSiblings.length >= use_limit) {
                        alert("该优惠券最多允许同时使用" + use_limit + "张，已经达到允许上限了。");
                        return false;
                    }
                }

                //订单最低限额检测
                var cash_limit = parseFloat(coupon.cash_limit);
                if(!isNaN(cash_limit) && cash_limit > 0) {
                    var orderCash = parseFloat($(".total-cash").data('total-cash'));
                    if(isNaN(orderCash) || cash_limit > orderCash) {
                        alert("该优惠券要求订单最低金额达到￥" + cash_limit + "，您的订单金额不足，不能使用此优惠券。");
                        return false;
                    }
                }

                //检查特价券是否有满足要求的商品
                var coupon_type = $(this).attr('data-type');
                if(coupon_type == 1003) {
                    var allGoods = getGoodsInfo();
                    var hasAdapted = false;
                    for(var i in allGoods) {
                        var goods = allGoods[i];
                        if(checkSpecialCouponAndGoods(goods, coupon)) {
                            hasAdapted = true;
                        }
                    }
                    if(!hasAdapted) {
                        alert("您的订单里没有适用该优惠券的商品");
                        return false;
                    }
                }

                var sameTypeCoupons = $(".coupon-list-item.current"); //[data-type=" + coupon_type + "]
                sameTypeCoupons.removeClass("current");
                sameTypeCoupons.find(":checkbox").prop("checked", false);
                $(this).addClass("current");
                $(this).find(":checkbox").prop("checked", true);
            }

            calculateOrderCash();
        });
    };
    exports.confirmOrder = function () {
        $(document).delegate('.order-save-btn', 'click', function (e) {
            //todo 检查各种数据是否已经依法填写
            var kuaidi = $("#kuaidi").prop("checked");
            if(kuaidi){
                var addressData = $('.address-box.current').attr("data-address-data");
                if (!addressData) {
                    alert("选择收货地址！");
                    return false;
                } else{
                    addressData = JSON.parse(Base64.decode(addressData));
                }
            }
            var reserveBtn = $('#reserve_pay_btn').prop("checked");
            var reserveCash = 0;
            if(reserveBtn) {
                reserveCash = $('#reserve_pay_cash').val();
            }
            var coupons = $('.coupon-list-item.current');
            var couponSns = [];
            if(coupons && coupons.length > 0) {
                $(coupons).each(function() {
                    var cSn = $(this).attr("data-coupon-sn");
                    couponSns.push(cSn);
                });
            }
            var shopId = parseInt($('.shop-id option:selected').val());
            //var shopId = parseInt($('.shop-id').attr('data-shop-dep-id'));
            var postage = $("#ziti").prop("checked");
            var th_uname = $.trim($('#th_uname').val());//新加提货人姓名
            var th_umobile = $.trim($('#th_umobile').val());//新加提货人手机号
            if(postage && shopId == -1) {
                alert("您选择了门店自提，必须选择取货的体验店");
                $(".shop-id").focus();
                return false;
            }else if(postage && shopId > -1){
                var phone_pattern = /^1[3|4|5|7|8][0-9]{9}$/;
                if(th_uname == '' || th_umobile == ''){
                    alert("请填写提货人姓名和手机号!");
                    return false;
                }else if(!phone_pattern.test(th_umobile)){
                    alert("手机号格式不正确!");
                    return false;
                }

            }
           var selected_pay_type = $(".is_fullpayout:checked").val();
           if(selected_pay_type == '2'){
            	//定金支付
            	var dingjinzhifu_money = parseFloat($(".dingjinzhifu_money").val());
            	var orderAmount = parseFloat($(".dingjinzhifu_money").attr("order_amount"));
            	var min_paid = parseFloat($(".dingjinzhifu_money").attr("min_paid"));
            	if(isNaN(dingjinzhifu_money)){
            		showTip("请填写正确的金额数据 ！",'error');
            		return false;
            	}
            	if(orderAmount > min_paid && dingjinzhifu_money < min_paid){
            		showTip('定金金额不能不能少于 '+min_paid+" 元！",'error');
            		return false;
            	}
            }
            $(".order-save-btn").attr("disabled",true);
            var selected_transfer = $(".postage-radio:checked").val();
            var data = {
                transfer: selected_transfer,
                gift_id: $('#gift_id').val(),
                discount_type: $('[name="activity"]:checked').val(),
                shop_id: isNaN(shopId) ? 0 : shopId,
                items: $(this).attr('data-items'),
                invoice_title: $('#invoice-title').val(),
                use_coupon: couponSns,
                reserve_cash: reserveCash,
                recommend: $.trim($("#recommend").val()) , //推荐人
                is_fullpayout:$(".is_fullpayout:checked").val(),
                dingjinzhifu_money:parseFloat($(".dingjinzhifu_money").val()),
                remark: $.trim($("#note_content").val()) //订单备注
            };
            if(selected_transfer == '1'){  //体验店自提
            	$(".order-save-btn").attr("disabled",true);
                var shop_address = $('.shop-id').find('option:selected').attr('data-address');

                data.address = {
                    address: shop_address,
                    //consignee: $(this).attr('data-login-user-mobile'),//当前登录用户电话号码
                    //mobile: $(this).attr('data-login-user-mobile')//当前登录用户手机号码
                    consignee:th_uname,
                    mobile:th_umobile
                };

                checkRecommend(submitToGenerateOrder, data);
            } else if(selected_transfer == '0'){ //快递发货
                data.address = {
                    consignee: addressData.consignee,
                    province: addressData.province,
                    provinceName: addressData.province_name,
                    city: addressData.city,
                    cityName: addressData.city_name,
                    district: addressData.district,
                    districtName: addressData.district_name,
                    address: addressData.address,
                    mobile: addressData.mobile,
                    best_time: addressData.best_time
                };
                //submitToGenerateOrder(data);
                checkRecommend(submitToGenerateOrder, data);
            }
        });
    };

    exports.deliveryDisplay = function(){
        //动态显示收货信息
        var delivery_mode = $("input[name='postage']:checked").val();
        //alert(delivery_mode);
        /*var delivery_time = $("input[name='best_rec_time']:checked").siblings('label').text();*/
        var delivery_time = $(".current .best-rec-time").text();

        /*$("input[name='best_rec_time']").change(function(){
            delivery_time = $("input[name='best_rec_time']:checked").siblings('label').text();
            if(delivery_mode == 0){
                $(".receiving_mode").html('快递送货(<small>'+delivery_time+'</small>)');
            }
        })*/
        if(delivery_mode == 0){
            //快递
            $(".shfs").hide();
            $(".receiving_mode").html('快递送货(<small>'+delivery_time+'</small>)');
        }
        if(delivery_mode == 1){
            //体验店自提
            $(".shxx").hide();
            $(".receiving_mode").html('到店自提&nbsp;&nbsp;您选择了'+$("select[name='shop_id']:selected").text());
        }



        //$(".receiving_mode").html(delivery_mode);
        $("input[name='postage']").change(function(){
            delivery_mode = $("input[name='postage']:checked").val();
            if(delivery_mode == 0){
                $(".shfs").hide();
                $(".shxx").show();
                //delivery_time = $("input[name='best_rec_time']:checked").siblings('label').text();
                delivery_time = $(".current .best-rec-time").text();
                $(".receiving_mode").html('快递送货(<small>'+delivery_time+'</small>)');
            }
            if(delivery_mode == 1){
                $(".shxx").hide();
                $(".shfs").show();
                //判断用户是否选择了体验店
                if($(".shop-id").find("option:selected").val() == '-1'){
                    $(".receiving_mode").html('到店自提&nbsp;&nbsp;您还未选择体验店!');
                }else{
                    $(".receiving_mode").html('到店自提&nbsp;&nbsp;您选择了'+$(".shop-id").find("option:selected").text());
                }

                //$(".receiving_mode").html('到店自提&nbsp;&nbsp;您选择了'+$(".shop-id").find("option:selected").text());
                /*$(".shop-id").change(function(){
                    $(".receiving_mode").html('到店自提&nbsp;&nbsp;您选择了'+$(".shop-id").find("option:selected").text());
                })*/
            }
        })

        //选择体验店下拉框改变，若收货方式单选框为到店自提，则最下方收货方式内容改变，若为快递，则不作处理；如果未选择体验店，下方提示请选择体验店
        $(".shop-id").change(function(){
            if(delivery_mode == 1){
                //判断用户是否选择了体验店
                if($(".shop-id").find("option:selected").val()){
                    $(".receiving_mode").html('到店自提&nbsp;&nbsp;您选择了'+$(".shop-id").find("option:selected").text());
                }else{
                    $(".receiving_mode").html('到店自提&nbsp;&nbsp;您还未选择体验店!');
                }
            }
        })

    };

    exports.invoiceDisplay = function(){
        //动态显示发票信息
        $(document).delegate('#invoice-title','change',function(){
            var fptt = $(this).val();
            $('.fp_title').html("("+fptt+")");
        })
    };

    exports.addressDefaultDisplay = function(){
        delivery_info();
    };

    exports.changeAddressDisplay = function(){
        $(document).delegate(".address-box",'click',function(){
            $(".address-box").removeClass('current');
            $(this).addClass('current');
            delivery_info();
        })
    };
    exports.change_payout_type = function() {
    	$(".is_fullpayout").change(function(e) {
			var $selectedvalue = $("input[name='is_fullpayout']:checked").val();
			if ($selectedvalue == 2) {
				$(".dingjinzhifu_money").removeAttr("disabled", "disabled");
				minPaid = parseFloat($(".dingjinzhifu_money").attr("min_paid"));
        		$(".dingjinzhifu_money").val(minPaid);
				$(".final-pay-cash").text(minPaid);
			}else if($selectedvalue == 1){
				$(".dingjinzhifu_money").val(""); 
				$(".dingjinzhifu_money").attr("disabled", "disabled"); 
				orderAmount = parseFloat($(".dingjinzhifu_money").attr("order_amount"))
				$(".final-pay-cash").text(orderAmount);
			}
		});
    };
    exports.checkdingjinvalid = function() {
    	$(".dingjinzhifu_money").keyup(function(){
		    var $selectedvalue = $("input[name='is_fullpayout']:checked").val();
    		if($selectedvalue == 2){
    			dingjinzhifu_money = parseFloat($(".dingjinzhifu_money").val());
    			minPaid = parseFloat($(".dingjinzhifu_money").attr("min_paid"));
    	    	orderAmount = parseFloat($(".dingjinzhifu_money").attr("order_amount"));
    	    	e = $(this).event || window.event;  
    	    	code = parseInt(e.keyCode);
    	    	
    	       dingjin = dingjinzhifu_money;
	    	   if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8 || code == 110 || code == 190) {
	    		   if (isNaN(dingjinzhifu_money)) {
	    			   if($(".dingjinzhifu_money").val() != ""){
	    				   dingjin = minPaid;
	    				   showTip('请输入合法的订单金额！', 'error');
	    			   }else{
	    				   dingjin="";
	    			   }
	              } else {
	            	  if (dingjinzhifu_money > orderAmount) {
                          showTip('定金金额已大于订单金额！', 'error');
                          dingjin = minPaid;
                      }
	              }
	    	   } else {
	    		   dingjin = minPaid;
	    		   showTip('请不要输入非法数字！', 'error');
	           }
	    	   $(".dingjinzhifu_money").val(dingjin);
	    	   if(dingjin > minPaid){
	    		   $(".final-pay-cash").text(dingjin);
	    	   }
    		}
    	});
    };
    exports.checkRecommend = function(){
        $(document).delegate("#recommend",'focus',function(){
            //禁用提交订单按钮
            $(".order-save-btn").prop('disabled',true).css({"cursor":"not-allowed"});;
        })

        $(document).delegate("#recommend",'blur',function(){
            var recommend = $.trim($(this).val());
            if(recommend == ''){
                //推荐人为空，启用提交订单按钮
                $(".order-save-btn").prop('disabled',false).css({"cursor":"pointer"});
            }else{
                //推荐人不为空，请求接口查询推荐人是否存在
                $.get("ajax.php?m=User&c=UserApi&a=checkRecommend&recommend="+recommend,function(res){
                    /*if(res.result === 1){
                        $(".order-save-btn").prop('disabled',false).css({"cursor":"pointer"});
                    }else{
                        showTip('推荐人不存在!',1000);
                        $("#recommend").val('');
                        $(".order-save-btn").prop('disabled',false).css({"cursor":"pointer"});
                    }*/
                    if(res.result !== 1){
                        showTip('推荐人不存在!','error');
                        $("#recommend").val('');
                    }
                    $(".order-save-btn").prop('disabled',false).css({"cursor":"pointer"});
                },'json')
            }
        })
    },

    exports.setDefaultZTInfo = function(){
        $(document).delegate("#ziti",'click',function(){
            //点击自提初始化提货人（姓名 ，手机号）和体验店信息（如果是客服登录，取user_info中的kefu_shop，如果是普通用户，则取目前所在的体验店  如：shenzhen.kela.cn）
            //var checked = $(this).prop('checked');
            var user_info = checkLogin();
            $("#th_uname").val(user_info.user_name);
            $("#th_umobile").val(user_info.mobile);
            if(parseInt(user_info.is_kefu) > 0){
                console.log(user_info);
                //当前登录用户是客服
                var customer_dep_id = parseInt(user_info.kefu_shop);
                $.each($(".shop-id").find('option'),function(){
                    if(parseInt($(this).val()) == customer_dep_id){
                        $(this).siblings("option").attr('selected',false);
                        $(this).attr('selected',true);
                    }
                })
            }else if(parseInt(user_info.is_kefu) == 0){
                //普通用户登录
                var current_shop_id = parseInt($("#ziti").attr('current-shop-id'));
                $.each($(".shop-id").find('option'),function(){
                    if(parseInt($(this).val()) == current_shop_id){
                        $(this).siblings("option").attr('selected',false);
                        $(this).attr('selected',true);
                    }
                })
            }
            $(".receiving_mode").html('到店自提&nbsp;&nbsp;您选择了'+$('.shop-id option:selected').text());
        })
    }

    exports.clickExpress = function(){
        //点击快递发货时，清空上面默认的提货人信息,选中的体验店也清除
        $(document).delegate("#kuaidi",'click',function(){
            $("#th_uname").val('');
            $("#th_umobile").val('');
            $(".shop-id").find('option').attr('selected',false);
        })
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
            skin:skin  /*skin的样式有success 、error 、warning 、general   */
        });
        d.show();
        if (!timeout) {
            timeout = 2000;
        }
        setTimeout(function () {
            d.close().remove();
        }, timeout);
    }

    /**
     * 获取coupon信息
     * @param couponSn
     */
    function getCouponItem(couponSn) {
        //获取用户拥有的所有优惠券json信息
        var couponJson = $("#couponJson").val();
        if(!couponJson) {
            return false;
        }
        couponJson = JSON.parse(Base64.decode(ConvUtf(couponJson)));
        var coupons = {};
        for(var i in couponJson) {
            var item = couponJson[i];
            coupons[item.coupon_sn] = item;
        }

        if(couponSn) {
            return coupons[couponSn];
        } else {
            return coupons;
        }
    }

    function getGoodsInfo(goodsSn) {
        var goods = {};
        $(".goods-list-item").each(function() {
            var item = $(this).data();
            goods[item['goodsSn']] = item;
        });
        return (goodsSn) ? goods[goodsSn] : goods;
    }

    function calculateOrderCash() {
        //根据优惠券种类改变商品金额和订单金额
        var allPickedCoupons = $(".coupon-list-item.current");
        var allGoods = getGoodsInfo();
        var goodsPriceChanges = {};
        var orderCash = parseFloat($(".total-cash").data("total-cash"));
        var discountCash = parseFloat($(".discount-cash").data("discount-cash"));
        //var discountCash = 0;
        if(isNaN(discountCash)) {
            discountCash = 0.00;
        }
        if(allPickedCoupons && allPickedCoupons.length > 0) {
            var timeNow = Math.round(new Date().getMilliseconds() / 1000);
            $(allPickedCoupons).each(function(index, node) {
                var cSn = $(node).attr('data-coupon-sn');
                var couponItem = getCouponItem(cSn);
                if(couponItem) {
                    switch (parseInt(couponItem.coupon_type)) {
                        //现金券
                        case 1001: {
                            var discount = parseFloat(couponItem.coupon_param);
                            if(isNaN(discount)) {
                                discount = 0;
                            }
                            discountCash += discount;
                            if(orderCash - discountCash > orderCash) {
                                discountCash = orderCash;
                            }
                            break;
                        }
                        //折扣券
                        case 1002: {
                            var discount = parseFloat(couponItem.coupon_param);
                            if(isNaN(discount) || discount > 100) {
                                discount = 100;
                            }
                            else if(discount < 0) {
                                discount = 0;
                            }
                            discountCash = orderCash * (100 - discount) / 100;
                            break;
                        }
                        //特价券
                        case 1003: {
                            for(var i in allGoods) {
                                var goods = allGoods[i];
                                if(!checkSpecialCouponAndGoods(goods, couponItem)) {
                                    continue;
                                }
                                if(!goodsPriceChanges[goods['goodsSn']]) {
                                    goodsPriceChanges[goods['goodsSn']] = {
                                        original_price: goods['sellPrice'],
                                        discount_price: goods['goodsPrice'],
                                        discount: 0,
                                        num: goods['goodsNum'],
                                        coupon: {}
                                    };
                                }
                                var priceItem = goodsPriceChanges[goods['goodsSn']];
                                var goodsDiscountPrice = executeFormula(couponItem.common_formula, priceItem.original_price);
                                if(priceItem.discount_price > goodsDiscountPrice) {
                                    priceItem.discount_price = goodsDiscountPrice;
                                    priceItem.coupon = {
                                        coupon_sn: couponItem.coupon_sn,
                                        coupon_code: couponItem.coupon_code
                                    };
                                    discountCash += (priceItem.original_price - priceItem.discount_price) - priceItem.discount;
                                    priceItem.discount = priceItem.original_price - priceItem.discount_price;
                                }
                            }
                            break;
                        }
                    }

                }
            });
        }
        var finalPayCash = orderCash - discountCash;
        if(finalPayCash <= 0) {
            finalPayCash = 0;
            discountCash = orderCash;
        }
        $(".discount-cash").text(discountCash.toFixed(2));
        changeFinalPayCash(finalPayCash.toFixed(2));
    }
    
    function changeFinalPayCash(finalPayCash){
    	//判断是否选择了定金支付,如选择了则将其乘上定金比例
    	 $('.final-pay-cash').text(finalPayCash);
    	 $(".dingjinzhifu_money").attr("order_amount",finalPayCash);
    	 var selected_pay_type = $(".is_fullpayout:checked").val();
    	 minPaid = parseFloat($(".dingjinzhifu_money").attr("min_paid"));
         if(selected_pay_type == '2'){
          	//定金支付,将定金改为代付款
        	 dingjinzhifu_money = parseFloat($(".dingjinzhifu_money").val());
        	 if(isNaN(dingjinzhifu_money)){
        		 dingjinzhifu_money = minPaid;
        	 }
        	 if(dingjinzhifu_money > finalPayCash){
        		 dingjinzhifu_money = finalPayCash;
        	 }
        	 $(".dingjinzhifu_money").val(dingjinzhifu_money);
        	 $('.final-pay-cash').text(dingjinzhifu_money);
         }
    }
    function executeFormula(formula, data) {
        var formula = formula.replace('{price}', data);
        return eval(formula);
    }

    function checkSpecialCouponAndGoods(goodsData, couponData) {
        var filterType = parseInt(couponData.filter_type);
        switch (filterType) {
            //全局通用
            case 1: {
                return true;
            }
            //按规则过滤：erp分类，自定义分类，风格，款式，裸钻
            case 2: {
                var filters = couponData.filters;
                for(var type in filters) {
                    var f = filters[type];
                    switch (type) {
                        //erp分类
                        case 1: {
                            if($.inArray(goodsData.goodsType, ['normal', 'couple_goods', 'couple_rings', 'diamond_container'])) {
                                var erpCats = goodsData.erpCats.split(',');
                                if(erpCats && erpCats.length > 0) {
                                    for(var j in erpCats) {
                                        var cid = erpCats[j];
                                        if($.inArray(cid, f)) {
                                            return true;
                                        }
                                    }
                                }
                            }
                            break;
                        }
                        case 2: {
                            if($.inArray(goodsData.goodsType, ['normal', 'couple_goods', 'couple_rings', 'diamond_container'])) {
                                var localCats = goodsData.localCats.split(',');
                                if(localCats && localCats.length > 0) {
                                    for(var j in localCats) {
                                        var cid = localCats[j];
                                        if($.inArray(cid, f)) {
                                            return true;
                                        }
                                    }
                                }
                            }
                            break;
                        }
                        case 3: {
                            if(goodsData.seriesId && goodsData.seriesId > 0 && $.inArray(goodsData.seriesId, f)) {
                                return true;
                            }
                            break;
                        }
                        case 4: {
                            if(goodsData.styleId && goodsData.styleId > 0 && $.inArray(goodsData.styleId, f)) {
                                return true;
                            }
                            break;
                        }
                        case 5: {
                            if($.inArray(goodsData.goodsType, ['diamond', 'couple_diamond'])) {
                                return true;
                            }
                        }
                    }
                }
                break;
            }
            //指定商品
            case 3: {
                var goods = couponData.specify_goods;
                for(i in goods) {
                    var gs = goods[i];
                    for(var j in gs) {
                        var g = gs[j];
                        if(g == goodsData.goodsSn) {
                            return true;
                        }
                    }
                }
                break;
            }
            default : {
                return false;
            }
        }
        return false;
    }

    //更改收货方式
    function change_delivery_mode(){

    }

    //默认选中的收货地址
    function delivery_info(){
        //动态显示选中的收货人及地址信息(默认选中被用户设为默认地址的信息)
        var selected_add = $(".address-list .current");
        if(selected_add.length > 0){
            //用户设置了默认地址，则默认选中该地址
            var destination = selected_add;
        }else{
            //用户没有设置默认地址，则默认选中地址列表中的第一个地址
            var destination = $(".address-list .address-box:first").addClass('current');
        }

        //获取收货人及详细地址
        var consignee = destination.children('.consignee').text();
        var add_detail = destination.children('.district').text() + ' ' + destination.children('.addr-detail').text();

        //将收货人及详细地址动态添加到相应位置
        $(".final_consignee").text(consignee);
        $(".final_add").text(add_detail);


        var delivery_mode = $("input[name='postage']:checked").val();
        //alert(delivery_mode);
        /*var delivery_time = $("input[name='best_rec_time']:checked").siblings('label').text();*/
        var delivery_time = $(".current .best-rec-time").text();

        if(delivery_mode == 0){
            $(".receiving_mode").html('快递送货(<small>'+delivery_time+'</small>)');
        }
        if(delivery_mode == 1){
            if($(".shop-id").find("option:selected").val() == '-1'){
                $(".receiving_mode").html('到店自提&nbsp;&nbsp;您还未选择体验店!');
            }else{
                $(".receiving_mode").html('到店自提&nbsp;&nbsp;您选择了'+$(".shop-id").find("option:selected").text());
            }
            //$(".receiving_mode").html('到店自提&nbsp;&nbsp;您选择了'+$("select[name='shop_id']:selected").text());
        }

    }

    function getUrlParameter(sParam)
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++)
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam)
            {
                return sParameterName[1];
            }
        }
    }


    function submitToGenerateOrder(data){
        var from = getUrlParameter("f");
        $.post('/user/orderApi/generateOrder', data, function (res) {
            if (res.result == 1) {
                if(from && from.toLowerCase() == 'cart') {
                    items = JSON.parse(Base64.decode(data.items));
                    if(items) {
                        $(items).each(function() {
                            cart.removeItem(this.cart_key);
                        });
                    }

                }
                var order_sn = res.data.order_sn;
                var final_pay = res.data.pay_fee;
                if(final_pay >= 0) {
                    window.location.href = SYS_SITE_URL + "ajax.php?m=user&c=order&a=pay&type=1&order=" + order_sn;
                } else {
                    window.location.href = SYS_SITE_URL + "ajax.php?m=user&c=order&a=detail&order=" + order_sn;
                }

                /*var bank_type = $('[name=bank_type]:checked').val();
                 if (bank_type == 'alipay') {
                 window.location.href = "/payment/alipay/pay/1/" + order_sn;
                 }
                 else {
                 window.location.href = "/payment/tenpay/pay/1/" + order_sn + '/' + bank_type;
                 }*/
            } else {
            	$(".order-save-btn").attr("disabled",false);
                showTip("生成订单失败，请联系客服处理！" + res.msg);
            }
        }, 'json');
    }


    function checkRecommend(callback, param){
        var recommend = $.trim($('#recommend').val());
        if(recommend == ''){
            //推荐人为空，启用提交订单按钮
            $(".order-save-btn").prop('disabled',false).css({"cursor":"pointer"});
            if(typeof callback == 'function') {
                callback(param);
            }
            return true;
        }else{
            //推荐人不为空，请求接口查询推荐人是否存在
            $.get("ajax.php?m=User&c=UserApi&a=checkRecommend&recommend="+recommend,function(res){
                    if(res.result === 1){
                    $(".order-save-btn").prop('disabled',false).css({"cursor":"pointer"});
                    if(typeof callback == 'function') {
                        callback(param);
                    }
                    return true;
                }else{
                    showTip('推荐人不存在!','error');
                    $("#recommend").focus();
                    $(".order-save-btn").prop('disabled',false).css({"cursor":"pointer"});
                    return false;
                }
            },'json')


        }
    }
});