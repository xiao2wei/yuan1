/**
 * Created by Arimis on 2015/4/28.
 * @depandency JQuery.cookie， JQuery.base64, JSON
 */
/**
 * 购物车的html结构约定：
 * 见shopcart.demo.html
 * 购物车中单个商品的信息记录如下
 * {
 * 	key: goods_id + "-" + 复合规格key-val值组合（key按数字大小升序排序）, //防止同款商品不同规格时会出现覆盖
 *  goods_id：商品ID,
 *  price: 商品被加入购物车时的单价,
 *  type: 裸钻、彩钻、对钻、其他,
 *  num: 购买数量,
 *  is_prom: 是否促销产品,
 *  spec_key: 规格组合key,
 *  //以下数据暂时不存
 *  spec_data: [{
 *      id: 规格ID,
 *      name: 规格名称,
 *      val: 规格值ID,
 *      val_name: 规格值,
 *  },
 *  is_promoted: 1, //1 or 0
 *  activity: 0 //活动ID
 *  ]
 * }
 *
 */
window.KelaCart = {
    total_fee: 0,
    total_num: 0,
    settle_url: "",
    data: {},
    /**
     * 初始化，将把cookies解析并导入到对象的数据容器；其他操作
     * @param String settleUrl 结算时的URL地址
     */
    init: function(settleUrl, e) {
        if(settleUrl) {
            this.settle_url = settleUrl;
        }
        this.parse();
        this.editor.init(e);
        //去购买，生成订单
        $(document).delegate('.go-settle-btn', 'click', function(e) {KelaCart.goToSettle(this, e)});
    },
    // 计算所有
    calculateAll: function () {
        var allParam = [];
        var total = 0;
        var allChecked = true;
        var _this = this;
        var allItems = $('.goods-list-item .chk');
        allItems.each(function () {
            var checked = $(this).prop("checked");
            var num = parseInt($(this).attr("data-goods-num"));
            var promote_price = parseFloat($(this).attr('data-promote-price'));
            var sell_price = parseFloat($(this).attr("data-sell-price"));
            var price = promote_price;
            var bind_price = parseFloat($(this).attr('data-bind-price'));
            var cart_key = $(this).attr("data-cart-key");
            var bind_code = $(this).attr('data-bind-code');
            /*var bind_goods = $(".goods-list-item .chk:checked[data-bind-code='" + bind_code + "']");
            if(bind_goods.length > 1) {
                price = bind_price;
            }*/

            if(bind_code){
                var bind_goods = $(".goods-list-item .chk:checked[data-bind-code='" + bind_code + "']");
                if(bind_goods.length > 1) {
                    price = bind_price;
                }
            }


            var subtotal = (num * price);
            $(this).attr('data-item-total', subtotal);
            var price_html = "&yen;" + price.toFixed(2);
            /*if(sell_price > price) {
                price_html += '<span class="original" style="text-decoration: line-through">原价&yen;' + sell_price.toFixed(2) + '</span>';
            }
            $(this).parents('tr').find('.zcart-prize').html(price_html);*/

            if(checked) {
                total += subtotal;
                var item = _this.data[cart_key];
                allParam.push(item);
            }
            else {
                allChecked = false;
            }

        });

        if(allChecked) {
            $('.choose-all').removeAttr("data-checked").removeClass('checked').prop('checked', false);
        }
        else {
            $('.choose-all').attr("data-checked", 'checked').addClass("checked").prop('checked', true);
        }
        // 设置总数
        //$(".cart-total").html("&yen; " + total.toFixed(2));
        $(".cart-total").html(total.toFixed(2));

        if (allParam.length > 0) {
            // 设置参数
            $(".go-settle-btn").attr("data-param", this.__encodeData(allParam));
            $('.go-settle-btn').addClass("btn-red").attr("data-can-settle", "checked");
        } else {
            $(".go-settle-btn").removeAttr("data-param");
            $('.go-settle-btn').removeClass("btn-red").removeAttr("data-can-settle");
        }
    },
    __encodeData: function(data) {
        if(!data) {
            return "";
        }
        if(typeof data == "object" || typeof data == "array") {
            data = Base64.encode(JSON.stringify(data));
        }
        data = data.replace(/(\+)/gm,'!').replace(/(\/)/gm, '_');
        return data;
    },
    /**
     * 解析cookies数据，并导入到对象容器
     */
    parse: function() {
        var cookie_data = $.cookie('shop_cart');
        // 原有购物车数据
        if (cookie_data) {
        	cookie_data = cookie_data.replace(/(\!)/gm,'+').replace(/(_)/gm, '\\');
            var old_data = JSON.parse(Base64.decode(cookie_data));
            this.data = old_data;
            this.total_num = 0;
            if(this.data) {
                for(cartKey in this.data) {
                    var item = this.data[cartKey];
                    this.total_num += parseInt(item.num);
                }
            }
        }
    },
    save: function() {
        var data = this.__encodeData(this.data);
        $.cookie('shop_cart', data, { expires: 7, domain:window.JsDomain, path: "/"});
        $('.go-settle-btn').attr('data-param', data);
        return true;
    },
    getItem: function(cart_key) {
        if(this.data[cart_key]) {
            return this.data[cart_key];
        }
        else {
            return false;
        }
    },
    addItem: function(item) {
        this.parse();
        var old_data = this.data;
        var cart_key = item.cart_key;//item.goods_id + "-" + SpecChooser.chosen_spec + $.base64.encode(ConvUtf(JSON.stringify(item.other_attrs)));
        // 原有订单数据
        //方案一 重复添加同一规格商品，则自动增加商品数量。当有捆绑商品时，会出现不可控数据
        /*if (old_data) {
            if (old_data[cart_key]) {
                // 替换原有数据
                var data_tmp = old_data[cart_key];
                data_tmp.num = parseInt(data_tmp.num);
                data_tmp.num += parseInt(item.num);
                old_data[cart_key] = data_tmp;
                delete(data_tmp);
            }
            else {
                // 增加新数据
                old_data[cart_key] = item;
            }
            // replace
            this.data = old_data;
        } else {
            // 避免数组自动长度
            this.data[cart_key] = item;
        }*/

        //方案二 同一规格商品，直接覆盖之前的数据，不再做数量累加
        var numChanged = 0;
        if (old_data) {
            if (old_data[cart_key]) {
                // 替换原有数据
                var data_tmp = old_data[cart_key];
                numChanged = item.num - data_tmp.num;
                data_tmp.num = parseInt(item.num);
                old_data[cart_key] = data_tmp;
                delete(data_tmp);
            }
            else {
                // 增加新数据
                old_data[cart_key] = item;
                numChanged = item.num;
            }
            // replace
            this.data = old_data;
        } else {
            // 避免数组自动长度
            this.data[cart_key] = item;
            numChanged = item.num;
        }

        this.total_num += parseInt(numChanged);
        this.save();
        $('.link-cart').text("购物车(" + this.total_num + ")");
        return  true;
    },
    removeItem: function(key) {
        if(this.data[key]) {
            var item = this.data[key];
            this.total_num -= parseInt(item.num);
            delete(this.data[key]);
        }
        this.save();
        $('.link-cart').text("购物车(" + this.total_num + ")");
        this.calculateAll();
        return true;
    },
    updateQuantity: function (cart_key, num) {
        var item = this.data[cart_key];
        if(!item) {
            return false;
        }
        item.num = num;
        var changedNum = parseInt(num) - parseInt(item.num);
        this.total_num += changedNum;
        this.data[cart_key] = item;
        this.save();
        $('.link-cart').text("购物车(" + this.total_num + ")");
        return true;
    },
    clear: function() {
        var rs = $.cookie("shop_cart", null, { expires: -1, domain:window.JsDomain});
        console.log(rs);
    },
    editor: {
        _this: this,
        /**
         * 绑定各种事件
         */
        init: function(e) {
            //开启修改功能
            $(document).delegate('.open-edit-model-btn', 'click', function(e) {KelaCart.editor.openEditor(this, e)});

            //修改购物车后保存信息
            $(document).delegate('.save-cart-btn', 'click', function(e) {KelaCart.editor.saveChange(this, e)});

            //增加商品数量
            $(document).delegate('.plus-btn',  'click', function(e) {KelaCart.editor.addQuantity(this, e)});

            //减少商品数量
            $(document).delegate('.minus-btn', 'click', function(e) {KelaCart.editor.minusQuantity(this, e)});

            //修改库存数量
            $(document).delegate('.item_quantity', 'change', function(e) {KelaCart.editor.manualChangeQuantity(this, e)});

            //删除商品
            $(document).delegate('.remove-cart-item', 'click', function(e) {KelaCart.editor.removeItem(this, e)});

            //复选框全选
            $(document).delegate(".choose-all", 'click', function(e) {KelaCart.editor.checkAll(this, e)});

            //单个复选框选择
            $(document).delegate(".goods-list-item .chk", 'click', function(e) {KelaCart.editor.checkOne(this, e)});
        },
        /**
         * 更新购物车的总计显示数据
         * @param id
         * @param num
         * @param total_price
         */
        setCart: function (cart_key, num, total_price) {
            $('.item_quantity[data-cart-key="' + cart_key + '"]').val(num);
            $('.item_total[data-cart-key="' + cart_key + '"]').html('&yen; ' + total_price.toFixed(2));

            // 购物车页面
            $('.num[data-cart-key="' + cart_key + '"]').text(num);
            $('.chk[data-cart-key="' + cart_key + '"]').attr('data-num', num).attr('data-item-total', total_price.toFixed(2));
        },

        /**
         * 复选框多选,反选
         */
        checkAll: function(obj, e) {
            var isChecked = $(obj).prop('checked');
            if (isChecked) {
                $(obj).removeAttr('data-checked').removeClass("checked");
                $(" .goods-list-item .chk").removeAttr("data-checked").removeClass('checked').prop("checked",true);
            } else {
                $(" .goods-list-item .chk").attr("data-checked", "checked").addClass("checked").prop("checked", false);
                $(obj).attr('data-checked', "checked").addClass("checked");
            }


           /* KelaCart.editor.calculateAll();*/
            KelaCart.calculateAll();
            e.stopImmediatePropagation();
        },
        /**
         * 选择某个复选框
         */
        checkOne: function(btn, e) {
            var isChecked = $(btn).prop('checked');
            if (isChecked) {
                $(btn).removeAttr("data-checked").removeClass("checked");
            } else {
                $(btn).attr("data-checked", "checked").addClass("checked");
            }

            KelaCart.calculateAll();
            e.stopImmediatePropagation();
        },
        /**
         * 编辑后保存设置
         * @param e
         */
        saveChange: function(btn, e) {

            $(' .goods-list-item .detail').show();
            $(' .goods-list-item .edit').hide();
            $(' .goods-list-item .del-cart').hide();

            /*$('.openEditModelBtn').css("display", "inline-block").show();*/
            $('.open-edit-model-btn').css("display", "inline-block").show();
            $(btn).hide();

            // 开启checkbox功能
            $('.chooseTotal').removeAttr('disabled');
            $('.chk').removeAttr('disabled');

            // update cart db
            var data = [];
            $(' .item_quantity').each(function () {
                //var id = $(this).attr('data-id');
                var num = $(this).val();
                //var item = {"id": id, "num": num};
                var cart_key = $(this).attr('data-cart-key');
                KelaCart.updateQuantity(cart_key, num);
                //data.push(item);
            });
            // 显示复选框
            $(".cart-page .chk").show();
            $(".cart-page .chooseTotal").show();
            window.location.reload();
            e.stopImmediatePropagation();
        },
        /**
         * 打开编辑功能
         * @param btn
         * @param e
         */
        openEditor: function(btn, e) {
            var cart_key = $(btn).attr("data-cart-key");
            $(' .goods-list-item .detail').hide();
            $(' .goods-list-item .edit[data-cart-key="'+cart_key+'"]').show();
            $(' .goods-list-item .del-cart').show();

            $(btn).hide();
            $('.save-cart-btn[data-cart-key="'+cart_key+'"]').css("display", "inline-block").show();

            // 禁用checkbox功能
            //$('.chooseTotal').attr('disabled', true);
            //$('.chk').attr('disabled', true);

            // 取消选中
            //$(" .goods-list-item .chk").prop("checked", false);
            //$(".settlement .chooseTotal").prop("checked", false);
            //$(".settlement .total").html("&yen; 0.00");
            //KelaCart.total_fee = 0;

            //禁止结算
            $('.settleBtn').removeClass('btn-red');

            //$(btn).hide();
            // 隐藏复选框
            //$(".cart-page .chk").hide();
            //$(".cart-page .chooseTotal").hide();

            //清空购物车总金额
            //$(".cart-total").text("￥0.00");

            e.stopImmediatePropagation();
        },
        /**
         * 增加商品的数量
         * @param btn
         * @param e
         */
        addQuantity: function(btn, e) {
            var cart_key = $(btn).siblings('.item_quantity').attr('data-cart-key');
            //var inventory = parseInt($(btn).siblings('.item_quantity').attr('data-inventory'));
            //var limit_num = parseInt($(btn).siblings('.item_quantity').attr('data-limit'));
            var price = parseFloat($(btn).siblings('.item_quantity').attr('data-price'));
            var quantity = parseInt($('.item_quantity[data-cart-key="' + cart_key + '"]').val());

            // 购买限制
            //inventory = (!isNaN(limit_num) && limit_num > 0) ? limit_num : inventory;

            //if (quantity < inventory) {
            var num = 1 + quantity;
            var total_price = (num * price);
            $(btn).parent().siblings('.detail').text(num);
            KelaCart.updateQuantity(cart_key, num);
            KelaCart.editor.setCart(cart_key, num, total_price);
            KelaCart.calculateAll();
            //}
            e.stopImmediatePropagation();
        },
        /**
         * 减少商品数量
         * @param btn
         * @param e
         */
        minusQuantity: function(btn, e) {
            var cart_key = $(btn).siblings('.item_quantity').attr('data-cart-key');
            var inventory = parseInt($(btn).siblings('.item_quantity').attr('data-inventory'));
            var price = parseFloat($(btn).siblings('.item_quantity').attr('data-price'));

            var quantity = parseInt($('.item_quantity[data-cart-key="' + cart_key + '"]').val());
            if (quantity > 1) {
                var num = quantity - 1;
                var total_price = (num * price);
                $(btn).parent().siblings('.detail').text(num);
                KelaCart.updateQuantity(cart_key, num);
                KelaCart.editor.setCart(cart_key, num, total_price);
                KelaCart.calculateAll();
            }
            e.stopImmediatePropagation();
        },
        /**
         * 删除商品
         * @param btn
         * @param e
         */
        removeItem: function(btn, e) {
            //setup模式
            var cm = window.confirm("您确定要删除该商品吗~！");
            if (cm) {
                var cart_key = $(btn).attr('data-cart-key');
                var rmItem = KelaCart.getItem(cart_key);
                $('.goods-list-item[data-cart-key="' + cart_key + '"]').remove();
                var items = $(".chk");
                KelaCart.removeItem(cart_key);
                if(rmItem.bind_code && rmItem.bind_code.length > 0) {
                    window.location.reload();
                }
                if(!items || items.length < 1) {
                    window.location.reload();
                }
                //window.location.reload();
            }
            e.stopImmediatePropagation();

        },
        /**
         * 手动修改商品数量，商品数量变化后做校验
         * @param btn
         */
        manualChangeQuantity: function(btn) {
            var id = $(btn).attr('data-id');
            var inventory = parseInt($(btn).attr('data-inventory'));
            var quantity = parseInt($(btn).val());
            var price = parseFloat($(btn).attr('data-price'));
            var limit_num = parseInt($(btn).attr('data-limit'));

            // 避免类似12ewe不合理数据存在
            $(btn).parent().siblings('.detail').text(quantity);
            KelaCart.editor.setCart(id, quantity, (quantity * price));

            // 购买限制
            if (quantity < 1) {
                KelaCart.editor.setCart(id, 1, price);
            }

            if (isNaN(quantity)) {
                KelaCart.editor.setCart(id, 1, price);
            }
            e.stopImmediatePropagation();
        }
    },

    /**
     * 从购物车结算
     * @param btn .settlement .chooseTotal
     */
    goToSettle: function (btn, e) {
        if(!btn) {
            return false;
        }
        // check
        if (!checkLogin()) {
            alert("您还没有登录");
            window.location.href="ajax.php?m=User&c=user&a=login";
            return false;
        }

        var param = $(btn).attr("data-param");
        if ($(btn).attr("data-can-settle") == "checked") {
            // 跳转到结算
            window.location.href = 'ajax.php?m=user&c=order&a=settle' + '&data=' + encodeURI(param) + '&f=cart';
        } else {
            alert('请选择至少一件商品！');
            return false;
        }
        e.stopImmediatePropagation();
    }
};

define(function(require,exports,module){
    require("base");
    module.exports = KelaCart;
}
);
