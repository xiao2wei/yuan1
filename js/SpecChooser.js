/**
 * Created by Administrator on 2015/5/8.
 */
/**
 * 规格部分的html约定：
 * @link http://12345709.m.saleasy.net/shop/item/NZQX-N-0
 */
window.SpecChooser = {
    chosen_spec: "",
    goods_id: "",
    goods_price: 0,
    goods_num: 1,
    spec_all_data:false,
    spec_chooser_btn: ".product-spec .spec_value",
    choose_kuan: ".product-spec .chose_kuan .kindf",
    attr_chooser_btn: ".product-spec .attr_val",
    buy_immediately_btn: ".btn-buy",
    add_to_cart_btn: ".btn-addToCart",
    settle_url: "ajax.php?m=user&c=order&a=settle",//结算页面地址
    check_inventory: "ajax.php?m=home&c=goods&a=checkInventory",//库存检测地址
    cart_url: "", //购物车页面地址
    user_login_url: "ajax.php?m=user&c=user&a=login",
    /**
     * 初始化数据
     * @param configData
     */
    init: function(configData) {
        if(configData && configData instanceof Array) {
            for (var i in configData) {
                this[i] = configData[i]
            };
        }
        //解析规格数据
        var spec_all_data = $('.product-spec .spec_all_data').val();
        if (spec_all_data) {
            spec_all_data = JSON.parse($.base64.decode(spec_all_data));
            this.spec_all_data = spec_all_data;
        }
        console.log(this.spec_all_data );
        //绑定规格选择事件处理机制
        this.chooseSpec(this.spec_chooser_btn, true);
        this.chooseAttr(this.attr_chooser_btn);
        //绑定选货款事件
        this.chooseKuan(this.choose_kuan);
        //绑定立即购买事件
        this.buyImmediately(this.buy_immediately_btn, false); // 不显示弹框登录
        //绑定加入购物车事件
        this.addToCart(this.add_to_cart_btn);
        this.initStyle();
    },
    initStyle: function(){
    	var spec_all_data = this.spec_all_data;
    	if($(".product-spec .spec_value").length){
    		for (var p in spec_all_data){
    			var init_chose = p;
    			break;
    		}
	    	$(".product-spec .spec_value").each(function(){
	    		var data_sn = $(this).attr('data-goods-sn');
	    		var spec_id = $(this).attr('data-spec-id');
    			var spec_key = $(this).attr('data-spec-key');
    			var key_string = spec_id + ':' + spec_key + ';';
    			var parent = $(this).parents('dl[data-name]').attr('data-name');
    			var patt = new RegExp(key_string);
    			if(patt.test(init_chose)){
    				$(this).click();
    				if($('a[data-name="'+parent+'"][data-kuan-key*="'+key_string+'"]:first').length>0){
    					$('a[data-name="'+parent+'"][data-kuan-key*="'+key_string+'"]:first').addClass('current');
    					$('a[data-name="'+parent+'"][data-kuan-key*="'+key_string+'"]:first').find('i').addClass('curchose');
    				}
    			}
	    	});
    	}
    },
    //是否对戒
    isCouple: function() {
        var is_couple = $('.product-spec').attr('data-couple');
         if(parseInt(is_couple)){
            return true;
         }else{
            return false;
         }
    },
    /**
     * 立即购买事件处理机制，将不会影响购物车内的商品信息
     * @param btn
     * @param showLoginDialog, 是否用登录框 登录
     */
    buyImmediately: function (btn, showLoginDialog) {
        if (!btn) return;
        var _this = this;
        $(document).delegate(btn, 'click', function (e) {
            // check login
            if (!checkLogin(showLoginDialog)) {
                if (!showLoginDialog) {
                    var from_url = location.pathname + location.search;
                    //window.location.href = _this.user_login_url+'&from_url='+from_url;
                    window.location.href = _this.user_login_url
                }
                return;
            }
            var item = _this.__addCartData(this);
            if(item === false) {
                return false;
            }
            // 跳转到结算
            window.location.href = ((_this.settle_url.indexOf('?') > 0) ? (_this.settle_url + '&data=') :  (_this.settle_url + '?data='))  + encodeURI(_this.__encodeData([item])) + '&f=item';
            e.stopImmediatePropagation();
        })
    },
    /**
     * 添加商品到购物车
     */
    addToCart: function (btn) {
        if (!btn) return;
        var _this = this;
        $(document).delegate(btn, 'click', function (e) {
            //var num = $('.buy-wrap .item_quantity').val();
            var result = _this.__addCartData(this, true);
            if(result === false) {
            	
                return false;
            }
            tip.showTip('ok', '已加入购物车', 500);
            e.stopImmediatePropagation();
        })
    },
    /**
     * 添加数据进购物车
     * @param obj 按钮对象
     * @param addToCart 是否加入到购物车，直接购买操作数据不进入购物车
     * @private
     */
    __addCartData: function(obj, addToCart) {
        var goods_id = $(obj).attr('data-id');
        var activity_id = $(obj).attr('data-activity-id');
        var bind_code = $(obj).attr('data-bind-code');
        var goods_sn = $(obj).attr('data-sn');
        var goods_type = $(obj).attr('data-type');
        var spec_key = $(obj).attr('data-spec-key');
        var goods_price = parseFloat($(obj).attr('data-price'));
        var shopId = parseInt($(obj).attr('data-shop-id'));
        if($('.strnum').length>0){
        	 var num = parseInt($('.stornum').val());
        }else{
        	var num = 1;
        }
        if(isNaN(shopId)) {
            shopId = -1;
        }

        var specs = $(".product-spec dl[data-spec-id]");
        var has_spec = false;
        if(specs && specs.length > 0) {
            has_spec = true;
        }

        if(has_spec && isNaN(goods_price)) {
            alert("您还没有选择规格");
            return false;
        }

        if (has_spec == "must" && this.chosen_spec == "") {
            tip.showTip("err", '请先选择商品规格~！', 3000);
            $('.buy-wrap .product-spec').show();
            return false;
        }
        
        var flag = true;
        //检测下拉选择框是否有未选择
        $("select[data-choose-attr]").each(function(){
        	if($(this).val()=='-请选择-'){
        	
        		flag = false;
        		return false;
        	}
        })
        if(!flag){
        	 alert("请先选择商品规格~！");
        	 return false;
        }
        
        //检测库存
        if($('.strnum').length>0){
	      	 $.ajax({async:false//要设置为同步的
	                ,url:this.check_inventory,data:{goods_id:goods_id,attr_key:spec_key}
	                ,success:function(res){
	                if (parseInt(res)< num ) {
	                	tip.showTip("err", '库存不足！', 3000);
	                    result=false;
	                } else {
	                   result=true;
	                }
	        }});
	      	if(!result)
	      		return result;
        }
        //其他用户需要选择或者填写的属性
        var attrs = $(".product-spec [data-attr-id], .spec_value.current");
        var attrsData = {};
        if(attrs && attrs.length > 0) {
            $(attrs).each(function(i, node) {
                var isSpec = $(this).hasClass('spec_value');
                if(isSpec) {
                    var attr_id = parseInt($(this).attr("data-spec-id"));
                    var attr_goods_sn = $(this).attr("data-goods-sn");
                    var attr_val = $(this).attr('data-spec-key');
                }
                else {
                    var attr_id = parseInt($(this).attr("data-attr-id"));
                    var attr_goods_sn = $(this).attr("data-goods-sn");
                    var attr_val = $(this).val();
                }
                if(attr_id > 0) {
                    if(attr_goods_sn && attr_goods_sn.length > 0) {
                        if(!attrsData[attr_goods_sn]) {
                            attrsData[attr_goods_sn] = {};
                        }
                        attrsData[attr_goods_sn][attr_id.toString()] = (attr_val && attr_val.length > 0) ? attr_val : "";
                    }
                    else {
                        attrsData[attr_id.toString()] = (attr_val && attr_val.length > 0) ? attr_val : "";
                    }
                }
            });
        }
        var cart_key = goods_id + "-" + $.base64.encode(JSON.stringify(attrsData));
        console.log(cart_key);
        var item = {
            "cart_key": cart_key,
            "goods_id": goods_id,
            "is_prom":activity_id,
            'bind_code': bind_code,
            "goods_sn": goods_sn,
            "num":num,
            "type": goods_type,
            "price": goods_price,
            "spec_key": spec_key,
            "other_attrs": attrsData,
            "shop_id": shopId
        };
        console.log(item);
        if(addToCart) {
            KelaCart.addItem(item);
        }
        return item;
    },
    /**
     * 积分换购
     */
    redemption: function () {
        $('.btn-buy').click(function (e) {
            // check
            if (!checkLogin(false)) {
                return;
            }
            var has_spec = $(this).attr('data-has-spec');

            if (has_spec == "must" && KelaCart.chosen_spec == "") {
                tip.showTip("err", '请先选择商品规格~！', 3000);
                $('.buy-wrap .product-spec').show();
                return;
            }

            var prod_id = $(this).attr('data-id');
            var quantity = $('.item_quantity[data-id="' + prod_id + '"]').val();
            // get need point
            var cost_point = $(this).attr('data-point');

            if (!(app.user_point && app.user_point >= cost_point * quantity)) {
                tip.showTip('err', '积分不够！ 您的积分:' + app.user_point + ' 所需积分:' + cost_point * quantity, 3000);
                return;
            }

            if (!confirm("兑换提示:\n积分商城的商品，一经兑换，概不退货，不退积分！")) {
                return false;
            }

            var item = {
                "id": prod_id,
                "num": quantity,
                "spec": KelaCart.chosen_spec
            };
            var location = '/addon/pointmall/settle';
            // 跳转到结算
            window.location.href = location + '/' + $.base64.encode(ConvUtf(JSON.stringify(item)));

            e.stopImmediatePropagation();
        });

    },

    /**
     * 选择商品规格
     * '.product-spec .spec .spec_val'
     * @param btn
     */
    chooseSpec: function (btn) {
        var _this = this;
        // 选择型号
        $(document).delegate(btn, 'click', function () {
        	if(!(!!$(this).hasClass('spec_gray'))){
	            _this.__disableStyle($(this));
	            _this.__updateSpecInfo($(this));
        	}
        });
    },
    /**
     * 选择货款
     * 
     * @param btn
     */
    chooseKuan: function(btn) {
    	var _this = this;
    	$(document).delegate(btn, 'click', function () {
    		
    		if(!$(this).hasClass('current')){
    			//重置已选规格
    			//_this.reset();
    			$(this).siblings('.current').removeClass('current');
    			var data_kuan_key = $(this).attr('data-kuan-key');
        		var key_arr = data_kuan_key.split(';');
        		var data_sn = $(this).attr('data-name');
        		for(i in key_arr){
        			var key_val_arr = key_arr[i].split(':');
        			var key = key_val_arr[0];
        			var val = key_val_arr[1];
                    if(key!='91'){
                        $('.product-spec a.spec_value[data-spec-id="'+key+'"][data-spec-key="'+val+'"]').click();
                    }
        			
        		}
        		$(this).addClass('current');
        		$(this).siblings().find('i').removeClass('curchose');
        		$(this).find('i').addClass('curchose');
        		 //实时检测库存
        		if($('.strnum').length>0){
        			var goods_id = $(_this.add_to_cart_btn).attr('data-id');
           		 	var spec_unique_key = $(_this.add_to_cart_btn).attr('data-spec-key');
    	       		 $.post(_this.check_inventory,{goods_id:goods_id,attr_key:spec_unique_key},function(res){
    	       			
    	          		if (res==0) {
    	          			$('.strnum').html('库存0件');
    	          			$('.strnum').attr('data-num',res);
    	                      tip.showTip('err', '该规格商品库存不足,请联系客服确认', 3000);
    	                      return false;
    	                   }else{
    	                	   $('.strnum').attr('data-num',res);
    	                	   if(parseInt($('.stornum').val())>parseInt(res)){
    	                		   $('.stornum').val(res);
    	                	   }
    	                	   $('.strnum').html('库存'+res+'件');
    	                   }
    	                  
    	                   
    	          	})
        		}
    		}
    	})
    },
    /**
     * 选择商品规格时禁用无价格关联其他属性
     */
    __disableStyle: function (elem){
    	 var d = $($(elem).closest('dl').siblings('dl[class="spec"]').not($(elem).closest('dl')).find('.spec_value')).length;
    	 if(d){
    		 $(elem).closest('dl').siblings('dl[class="spec"]').not($(elem).closest('dl')).find('.spec_value').addClass('spec_gray');
    		 var key = $(elem).attr('data-spec-key'),
          	 spec_id = $(elem).attr('data-spec-id'),
             key_string = spec_id + ':' + key,
             patt = new RegExp(key_string),
             patt1 = /|/,
             key_array = [],
             key_string = '';
    		 for(var p in this.spec_all_data){
            	 if(patt.test(p)){
            		//是否对戒
            		 if(patt1.test(p)){
            			 key_string = p.split('|'),
            			 key_array.push(key_string[0]);
            			 key_array.push(key_string[1]);
            		 }else{
            			 key_array.push(p);
            		 }
            	 }
             }
             $(this.spec_chooser_btn).each(function(){
            	 var key = $(this).attr('data-spec-key'),
              	     spec_id = $(this).attr('data-spec-id'),
              	     key_string = spec_id + ':' + key,
              	     patt = new RegExp(key_string);
	            	 for(var p in key_array){
	            		 if(patt.test(key_array[p])) {
	            			 $(this).removeClass('spec_gray');
	            		 }
	            	 }
             });
    	 }else{
    		 
    		 $(elem).parent().find('.spec_value').addClass('spec_gray');
    		 var patt1 = /|/,
    		 key_array = [],
    		 key_string = '';
    		 for(var p in this.spec_all_data){
        		 if(patt1.test(p)){
        			 key_string = p.split('|'),
        			 key_array.push(key_string[0]);
        			 key_array.push(key_string[1]);
        		 }else{
        			 key_array.push(p);
        		 }
            	 
             }
             $(this.spec_chooser_btn).each(function(){
            	 var key = $(this).attr('data-spec-key'),
              	     spec_id = $(this).attr('data-spec-id'),
              	     key_string = spec_id + ':' + key,
              	     patt = new RegExp(key_string);
	            	 for(var p in key_array){
	            		 if(patt.test(key_array[p])) {
	            			 $(this).removeClass('spec_gray');
	            		 }
	            	 }
             });
    	 }
         if(!($(elem).hasClass('spec_gray'))){
        	 var key = $(elem).attr('data-spec-key');
             var spec_id = $(elem).attr('data-spec-id');
	         $(elem).closest('.product-spec .spec[data-spec-id="' + spec_id + '"]').attr('data-spec-key', key);
	         $(elem).siblings().removeClass('current');
	         $(elem).addClass('current');
	         $(elem).siblings().find('i').removeClass('curchose');
	         $(elem).find('i').addClass('curchose');
	         var attrhtml = $(elem).text();   
	         if(spec_id=='128'){
	        	 	if(attrhtml.indexOf('约')<0){
	        	 		var attrhtml = '约'+attrhtml+'g';
	        	 	}
	         }else if(spec_id=='136' || spec_id=='140'){
	        	 attrhtml = (1000*key/10)+'分';
	         }
	         $('*[data-r-1="'+spec_id+'"]').html(attrhtml);
	         $("span[data-param-"+spec_id+"]").each(function(){
	        	 
	         	$(this).html('<i>'+$(this).find('i').text()+'</i>'+attrhtml);
	         })
         }
         
         
         if($("a[name='caizhi'].current").length){
        	 var spec_all_data = this.spec_all_data;
        	 $("a[data-spec-id=106]").hide();
        	 $($("a[name='caizhi'].current").each(function(){
        		 var parent = $(this).parents('dl[data-name]').attr('data-name');
            	 var  key = $('dl[data-name="'+parent+'"]').find("a[name='caizhi'].current").attr('data-spec-key');
                 var spec_id = $('dl[data-name="'+parent+'"]').find("a[name='caizhi'].current").attr('data-spec-id');
                 var key_string = spec_id + ':' + key; 
                 
               //选择材质时对应的颜色的显示
                 var patt = new RegExp(key_string);
                 var patt1 = /106:/;
                 for(var i in spec_all_data){
                	 if(patt.test(i) && patt1.test(i)){
                		 var star = i.indexOf('106:');
                		 var str = i.substr(star);
                		 var end = i.indexOf(';');
                		 var color_key_string = str.substr(0,end+1);
                		 var color_key_arr = color_key_string.split(':');
                		 $("a[data-spec-id="+color_key_arr[0]+"][data-spec-key="+color_key_arr[1]+"]").show();
                	 }
                 }
                 
                 $('a[data-name="'+parent+'"][data-kuan-key]').addClass('spec_gray').hide().removeClass('gdseemore');
                 $('a[data-name="'+parent+'"][data-kuan-key*="'+key_string+'"]').removeClass('spec_gray').show();
                 
                 
                 if($('a[data-name="'+parent+'"][data-kuan-key*="'+key_string+'"]').length>5){
                	 $('a[data-name="'+parent+'"][data-kuan-key*="'+key_string+'"]:gt(5)').addClass('gdseemore');
                	  $('.gdsmore-kf').show();
                	 if(!($('.gdsmore-main').length)){
                         $('a[data-name="'+parent+'"][data-kuan-key*="'+key_string+'"]:gt(5)').hide();
                    	 if ($('.gdsmore-kf').hasClass("gdsmore-main")) {
                    		 $('.gdsmore-kf').text("更多选择");
                    		 $('.gdsmore-kf').removeClass("gdsmore-main");
             			}
                    }
                 }else{
                	 
                	 $('.gdsmore-kf').hide();
                 }
                 
        	 }))
            if($(elem).attr('name')=='caizhi' && $("a[data-spec-id='106']").length>0){
                 $("a[data-spec-id='106']:hidden").removeClass('current');
                 if($("a[data-spec-id='106']:visible.current").length==0){
                     var dspeckey = $("a[data-spec-id='106']:visible").first().attr('data-spec-key');
                      $("a[data-spec-id='106']:visible").first().addClass('current');
                     $("dl[data-spec-id='106']").attr('data-spec-key',dspeckey);
                     $("a[data-spec-id='106']:visible").first().find('i').addClass('curchose');
                 }
             }
        }
         if($(elem).attr('name')=='caizhi'){
            $('.chose_kuan').find('a:visible').first().click();
         }
         

         $(this.spec_chooser_btn).each(function(){
        	 if(!!($(this).hasClass('current')) && !!($(this).hasClass('spec_gray'))){
        		 $(this).removeClass('current');
        		 $(this).closest('dl').removeAttr('data-spec-key');
        		 $(SpecChooser.buy_immediately_btn).removeAttr('data-spec-key');
                 $(SpecChooser.buy_immediately_btn).removeAttr('data-price');
                 $(SpecChooser.add_to_cart_btn).removeAttr('data-spec-key');
                 $(SpecChooser.add_to_cart_btn).removeAttr('data-price');
        	 }
         })
         

        
    },
    chooseAttr: function (btn) {

        var _this = this;
       
        $(document).delegate(btn, 'change', function(){
        	var id =$(this).attr('data-goods-sn');
            var spec_id = $(this).attr('data-attr-id');
            
           if(spec_id=='93'){
        	   var attrhtml = $(this).val();
           }else if(spec_id=='128'){
        	   var attrhtml = '约'+$(this).text()+'g';
           }else{
        	   var attrhtml = $(this).children('option:selected').text();
           }
           console.log(attrhtml);
           $('div[data-choose-attr*="'+id+'"]').find("span[data-param-"+spec_id+"]").html('<i>'+$('div[data-choose-attr*='+id+']').find("span[data-param-"+spec_id+"]").find('i').text()+'</i>'+attrhtml);
        })
    },
    /**
     * 更新规格信息
     * @param elem
     * @private
     */
    __updateSpecInfo: function (elem) {
        // 清空旧数据
        this.chosen_spec = "";
        var data_names = [];
        var spec_unique_key = "";
       /* $(elem).closest('.product-spec .spec[data-name]').each(function(){
        	var data_name = $(this).attr('data-name');
        	data_names[data_name] = data_name;
        	
        }) 
        
        
        */
        var data_name = $(elem).attr('data-goods-sn');
        
        //对戒
        if(this.isCouple()){
            var data_name_str = $(this.buy_immediately_btn).attr('data-sn');
            var data_name_arr = data_name_str.split(',');
            spec_unique_key = this.__concatSpecKey(data_name_arr[0]) + '|' + this.__concatSpecKey(data_name_arr[1]);
        }else{

            spec_unique_key = this.__concatSpecKey(data_name);
        }
        this.chosen_spec = spec_unique_key;
        var chosen_spec = this.spec_all_data[spec_unique_key];
        var activity_prices = SpecChooser.prices;
        // 匹配选择
        if (chosen_spec) {
        	
            // 设置价格
        	if(SpecChooser.isactivity){
        		$('#priceSale').html('活动价&nbsp;&nbsp;<font><span style="font-size: 14px;">￥</span>'+chosen_spec.sell_price+'</font></span>');
        	}else{
        		$('#priceSale').html('珂兰价&nbsp;&nbsp;<font><span style="font-size: 14px;">￥</span>'+chosen_spec.sell_price+'</font></span>');
        	}
            
            $('#saleprice').html('￥'+chosen_spec.market_price);
	        if(chosen_spec.huo_sn){
	            if(!!($('#huo_sn').html())){
	            	$('#huo_sn').html('<span>货号：&nbsp;&nbsp;'+chosen_spec.huo_sn+'</span>');
	            }else{
	            	$('.bm1').after('<li id="huo_sn"><span>货号：&nbsp;&nbsp;'+chosen_spec.huo_sn+'</span></li>');
	            }
	        }
          
            var price = chosen_spec.sell_price;
            if(activity_prices){
            	var final_price = 0;
            	if(typeof(activity_prices)=='number'){
            		final_price = activity_prices;
            	}else{
            		final_price = activity_prices[spec_unique_key];
            	}
            	
            	if(final_price && final_price > 0) {
                    price = final_price;
                   
                }
            	$('#priceSale').html('活动价&nbsp;&nbsp;<font><span style="font-size: 14px;">￥</span>'+price+'</font></span>');
            }
           
            this.goods_price = chosen_spec.sell_price;
            $(this.add_to_cart_btn).attr('data-spec-key', spec_unique_key);
            $(this.add_to_cart_btn).attr('data-price', price);
            $(this.buy_immediately_btn).attr('data-spec-key', spec_unique_key);
            $(this.buy_immediately_btn).attr('data-price', price);
            
            var main_goods_price = final_price = bind_goods_price =  new Number;
            var has_spec = $(this.add_to_cart_btn).attr('data-has-spec');
            if(has_spec=='must'){
   	    	 	var spec_unique_key = $(SpecChooser.add_to_cart_btn).attr('data-spec-key');
   	     	}
            if($('#B_addtoCart') && $(".bindgoods a").length>0){
	            //更新捆绑商品统计信息
	            var bind_code = $(this.add_to_cart_btn).attr('data-bind-code');
	            var Bindgood = SpecChooser.bindGood;
	            
                for(i in Bindgood[bind_code]){
                    if(Bindgood[bind_code][i]['goods_sn'] == $(this.add_to_cart_btn).attr('data-sn')){
                    	 if(has_spec=='must'){
                     		main_goods_price = Bindgood[bind_code][i]['prices'][spec_unique_key];
                     	}else{
                     		main_goods_price = Bindgood[bind_code][i]['prices'];
                     	}
                    }
                }
	    		var html = '';
	    		
	    		if(!isNaN(main_goods_price)){
	    			final_price = main_goods_price;
	    		}else{
	    			final_price =  Number($(this.add_to_cart_btn).attr('data-min-price'));
	    		}
	    		
	    		//捆绑商品
	    		$(".bindgoods a").each(function(){
	    			bind_goods_price =  Number($(this).attr('data-price'));
	    			if(!isNaN(bind_goods_price)){
	    				final_price += bind_goods_price;
	    			}else{
	    				final_price +=  Number($(this).attr('data-min-price'));
	    			}
	    		});
	    		html = "￥<span>"+Number(final_price).toFixed(2)+"</span>";
	    		
	    		$('#B_addtoCart').closest('.caculate').find('.total_p').html(html);
            }
        }
    },
    /**
     * 拼接规格key，按规格属性id的字典升序排列
     * @returns {string}
     * @private
     */
    __concatSpecKey: function(elem) {
        var spec_keys = [];
        var spec_ids = [];
        var spec_unique_key = "";
        $('.product-spec .spec[data-name="'+elem+'"]').each(function () {
            var spec_id = parseInt($(this).attr('data-spec-id'));
            if(!isNaN(spec_id)) {
                var spec_key = $(this).attr('data-spec-key');
                var key_string = spec_id + ':' + spec_key;
                spec_keys[spec_id] = key_string;
                spec_ids.push(spec_id);
            }
        });
        
        spec_ids.sort(this.__compare);
      
        $(spec_ids).each(function() {
            spec_unique_key += spec_keys[this] + ";";
        });
        return spec_unique_key;
    },

    /**
     * 转化json到可以url传递的string
     * @param data
     * @returns {*}
     * @private
     */
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
     * 比较函数
     */
    __compare: function(value1,value2){
		  if (value1 < value2) {
		       return -1;
		   } else if (value1 > value2) {
		       return 1;
		   } else {
		       return 0;
		   } 
    }
};

define(function(require,exports,module){
    module.exports = SpecChooser;
});