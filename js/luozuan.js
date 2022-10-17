// 裸钻搜索
var Luozuan = {
    initDiamond: function () {
        showHistoryDiamond();
        diamondListSearch();        
        diamondContrast();
        SortingEffect();
        chooseRing();
        tabSwitch(".content", ".title", ".box", ".conbox");
        tabSwitch(".choose_series", ".series_title", ".box1", ".conbox1");
        
        $("#info_win").mouseover(function(){
            $("#is_on_info").val(1);
        });
        setInterval(function(){
            if($('#is_on_info').val() == 0){
                $("#info_win").fadeOut("slow");
            }
        }, 1000);
    },
      //初始化区间滑动
    // diamondSlider:function () {
    //     $("#weightSlider").noUiSlider({
    //          snap: true,
    //          range: {
    //           'min': 0.3,
    //           '10%': 0.4,
    //           '20%': 0.5,
    //           '30%': 0.6,
    //           '40%': 0.7,
    //           '50%': 0.8,
    //           '60%': 0.9,
    //           '70%': 1.0,
    //           '80%': 1.5,
    //           '90%': 2.0,
    //           'max': 2.5
    //         },
    //         format: wNumb({
    //             decimals: 1
    //         }),
    //         start: [0.3, 2.5]
    //     }, true);        
    //     $("#weightSlider").on({
    //         set: function(){
    //             if ($(this).val()[1] == '2.5') {
    //                 $('#weight_upper').text('2.5 ct以上');
    //                 $('#weight_upper_b').hide();
    //             }else{
    //                 $('#weight_upper_b').show();
    //             }
    //         }
    //     });
    //     $("#weightSlider").Link('lower').to($('#weight_lower'));
    //     $("#weightSlider").Link('upper').to($('#weight_upper'));
    //     if ($('#weightSlider').val()[1] == '2.5') {
    //         $('#weight_upper').text('2.5 ct以上');
    //         $('#weight_upper_b').hide();
    //     };
    //     $("#priceSlider").noUiSlider({
    //         snap: true,
    //         range: {
    //           'min': 1000,
    //           '10%': 5000,
    //           '20%': 10000,
    //           '30%': 15000,
    //           '40%': 20000,
    //           '50%': 25000,
    //           '60%': 30000,
    //           '70%': 50000,
    //           '80%': 100000,
    //           '90%': 150000,
    //           'max': 200000
    //         },
    //         format: wNumb({
    //             thousand: ','
    //         }),
    //         start: [1000, 200000]
    //     }, true);
    //     $("#priceSlider").on({
    //         set: function(){
    //             if ($(this).val()[1] == '200,000') {
    //                 $('#price_upper').text('200,000 RMB以上');
    //                 $('#price_upper_b').hide();
    //             }else{
    //                 $('#price_upper_b').show();
    //             }
    //         }
    //     });
    //     $("#priceSlider").Link('lower').to($('#price_lower'));
    //     $("#priceSlider").Link('upper').to($('#price_upper'));
    //     if ($('#priceSlider').val()[1] == '200,000') {
    //         $('#price_upper').text('200,000 RMB以上');
    //         $('#price_upper_b').hide();
    //     }
    // },
          // 戒拖详情页
// diamondSlider2 : function (min,max,min1,max1) { 
//    	var limit = Number(max)-Number(min);
//        $("#weightSlider").noUiSlider({
//            start:[ min,max ],
//            limit:limit,
//             range: {
//              'min': 0,
//              'max': 2.5
//            },
//            format: wNumb({
//                decimals: 2
//            })
//        }, true);            
//        $("#weightSlider").on({
//            set: function(){
//                if ($(this).val()[1] == '2.5') {
//                    $('#weight_upper').text('2.5 ct以上');
//                    $('#weight_upper_b').hide();
//                }else{
//                    $('#weight_upper_b').show();
//                }
//            }
//        });        
//        $("#weightSlider").Link('lower').to($('#weight_lower'));
//        $("#weightSlider").Link('upper').to($('#weight_upper'));
//        var wvalue = $("#weightSlider").val(); 
//        if (wvalue[1] == '2.5') {
//            $('#weight_upper').text('2.5 ct以上');
//            $('#weight_upper_b').hide();
//        };
//        var limit1 = Number(max1)-Number(min1);
//        $("#priceSlider").noUiSlider({            
//            start:[ min1,max1],
//            limit:limit1,
//            range: {
//              'min': 1000,
//              'max': 200000
//            },
//            format: wNumb({
//                decimals: 0,
//                thousand: ','
//            }),
//        }, true);
//        $("#priceSlider").on({
//            set: function(){
//                if ($(this).val()[1] == '200,000') {
//                    $('#price_upper').text('200,000 RMB以上');
//                    $('#price_upper_b').hide();
//                }else{
//                    $('#price_upper_b').show();
//                }
//            }
//        });
//        $("#priceSlider").Link('lower').to($('#price_lower'));
//        $("#priceSlider").Link('upper').to($('#price_upper'));
//        var pvalue = $("#priceSlider").val();
//        if (pvalue[1] == '200,000') {
//            $('#price_upper').text('200,000 RMB以上');
//            $('#price_upper_b').hide();
//        }
//    },
    goodsDiamond: function () {
        // 戒托详情页
        $('#again_diam').on('click', function(event) {
            event.preventDefault();
            $('#diam_box').show();
            var href = $(this).attr("href"); 
            var pos = $(href).offset().top; 
            $("html,body").animate({scrollTop: pos}, 1000); 
            return false;
        });
        $('#diam_box').on('click', 'a.diam-title-close', function(event) {
            event.preventDefault();
            $('#diam_box').hide();
            var pos = $("#preview").offset().top; 
            $("html,body").animate({scrollTop: pos}, 1000); 
            return false;
            
        });
    }
}
//排序效果
var SortingEffect = function(){
	$('.seqdia li').on('click',function(){
		//选中状态
        if(!($(this).hasClass('seqcur'))){
            $(this).siblings('.seqcur').removeClass('seqcur').removeAttr('data-sort');
            $(this).addClass('seqcur').attr('data-sort','asc');
            
        }else{
            $(this).find('i').toggleClass('seqdn');
            if($(this).attr('data-sort')=='desc'){
                $(this).attr('data-sort','asc');
            }else{
                $(this).attr('data-sort','desc');
            }
        }
		 var data = util.diaSearch();
		 var sort_item = $('.seqdia li.seqcur').attr('data-item');
         var sort_type = $('.seqdia li.seqcur').attr('data-sort');
         data['type'] = $("#choose_series a[class='hover']").attr('href');
         data['sorting'] = sort_item + ' ' + sort_type;
         $.post("/home/diamond/index", data, function(res) {
             $(".con_list").html('');
             if (res.list == null || res.list.length < 0 ) {
                 $(".con_list").append('<tr><td  colspan="13">没有数据了</td></tr>');
                 $(".page").html('');
             } else {
                 $(".page").html(res.page);
                 util.diaList(res.list,res.type);
             }
         }, 'json');
	})
}
/* 裸钻搜索
   * tab切换
     * box 父级
     * title 切换tiele ul>li结构
     * content 切换内容父级
     * label 切换内容索引
  */
    var tabSwitch = function (box,title,content,label) {
        var box = $(box);
        var content = $(content);
        var title = $(title);
        box.each(function(i) {
            title.eq(i).find("li").click(function(){
                var key = $(this).index();
                title.eq(i).find("li").removeClass("active").eq(key).addClass("active");
                content.eq(i).find(label).hide().removeClass("active").eq(key).addClass("active").show();
                
            });
        });
  }
    // 裸钻搜索页面点击效果
    // var effectHover = function() {
    //         $(".effect_hover").on('click', '.dia-control label', function() {
    //             if($(this).hasClass('hover')){
    //                 $(this).toggleClass('hover');
    //                 $(this).next("input").attr('checked',false);
    //             }else{
    //                 $(this).siblings('label').removeClass('hover');
    //                 $(this).siblings('input').attr('checked',false);
    //                 console.log($(this).next("input").attr('name'),(!!($(this).next("input").attr('checked'))));
    //                 if(!(!!($(this).next("input").attr('checked')))){
    //                     $(this).toggleClass('hover');
    //                     $(this).next("input").attr('checked',true);
    //                 }
    //             }
    //             diamondSearch();
    //         });
    //     }

      var effectHover = function() {
            $(".effect_hover").on('click', '.dia-control label', function() {
                //event.preventDefault();
                if($(this).hasClass('hover')){
                	$(this).removeClass('hover').next('input[type="checkbox"]').removeAttr('checked');
                }else{
                	$(this).addClass('hover').next('input[type="checkbox"]').attr('checked','checked');
                }
            });
            
            diareset();
        }
    // 重置搜索
    var diareset = function(){
        $("#dia-reset").on('click', function(event) {
                event.preventDefault();
                $(".diamond-search label").removeClass("hover");
                $(".diamond-search input[type='checkbox']").removeAttr("checked");
              //  $("#weightSlider").val([0.3, 2.5]);
              //  $("#priceSlider").val([1000, 200000]);
                $("#price_lower").val('1000');
                $("#price_upper").val('10,000,000.00');
                $("#weight_lower").val('0.1');
                $("#weight_upper").val('10');    
                $('.cert_id').val(''); 
            });
    }
   // //戒托详情页点击效果
   //  var effectHover1 = function() {
   //      $(".effect_hover1").on('click', '.dia-control label', function() {
   //          if($(this).hasClass('hover')){
   //              $(this).toggleClass('hover');
   //              $(this).next("input").attr('checked',false);
   //          }else{
   //              $(this).siblings('label').removeClass('hover');
   //              $(this).siblings('input').attr('checked',false);
   //              console.log($(this).next("input").attr('name'),(!!($(this).next("input").attr('checked'))));
   //              if(!(!!($(this).next("input").attr('checked')))){
   //                  $(this).toggleClass('hover');
   //                  $(this).next("input").attr('checked',true);
   //              }
   //          }
   //          diamondSearch1();
   //      });
   //  }
    var effectHover1 = function() {
            $(".effect_hover1").on('click', '.dia-control label', function() {
                //event.preventDefault();
            	if($(this).hasClass('hover')){
                	$(this).removeClass('hover').next('input[type="checkbox"]').removeAttr('checked');
                }else{
                	$(this).addClass('hover').next('input[type="checkbox"]').attr('checked','checked');
                }
            });
            
            diareset();
        }
    // 裸钻类别搜索
    var diamondListSearch = function () {
        $('#choose_series').on('click', 'li a', function(event) {
            event.preventDefault();
            $("#diamond_middle_ad").html('');
             $("#dia-reset").click();
             $(this).addClass('hover').parents('li').siblings('li').children('a').removeClass('hover');
            var a = $(this).attr('href');
            var data = {'type':a};
            //console.log(data);
            $.post("/home/diamond/index", data, function(res) {
            	//搜索下方广告
            	var has_ad = false;
            	var ad_obj = res.diamond_search_ad.ads;
            	for(var i in ad_obj){
            		if(typeof(ad_obj[i])!='undefined')has_ad = true;
            		break;
            	}
            	if(has_ad){
            		var html_ad = '';
            		for(var i in ad_obj){
            			if(i<1){
            				$("#diamond_middle_ad").html('<li><a href="'+ad_obj[i].clickurl+'"><img src="'+ad_obj[i].params.imageurl+'" alt="'+ad_obj[i].params.alt+'" /></a></li>');
            				if(!$("#diamond_middle_ad li").hasClass("apear")){  
            					$("#diamond_middle_ad li").addClass('apear');  
            					$("#diamond_middle_ad").show().animate({height:'370px'},'slow')
            				}
            			}else{
            				html_ad += '<li><a href="'+ad_obj[i].clickurl+'"><img src="'+ad_obj[i].params.imageurl+'" alt="'+ad_obj[i].params.alt+'" /></a></li>';
            			}
            		}
            		// if(html_ad){
            		// 	$(".diagds-cmd ul").html(html_ad);
              //           $(".diagds-cmd ul").removeClass('diatos').addClass('diatos');
              //         	$(".diatos").animate({height:"260px"},"slow");
              //         	$(".diaad-ct a").text("隐藏裸钻推荐");
            		// }else{
            		// 	$(".diagds-cmd ul").height(0);
            		// 	$(".diagds-cmd ul").html(html_ad);
            		// 	 $(".diagds-cmd ul").removeClass('diatos');
            		// 	$(".diaad-ct a").text("展开看看");
            		// }
            		 
            	}else{
            		$("#diamond_middle_ad").html('');
            	}
            	
            	//分页列表数据
                $(".con_list").html('');
                if (res.list == null || res.list.length < 0 ) {
                    $(".con_list").append('<tr><td colspan="13">没有数据了</td></tr>');
                } else {
                    $(".page").html(res.page);
                    util.diaList(res.list,res.type);
                }
            }, 'json');
        });
    }
    // 裸钻搜索
    var diamondSearch = function() {
            $("#dia-submit").on('click', function(event) {
                event.preventDefault();
                var data = util.diaSearch();
                var sort_item = $('.seqdia li.seqcur').attr('data-item');
                var sort_type = $('.seqdia li.seqcur').attr('data-sort');
                data['sorting'] = sort_item + ' ' + sort_type;
                data['type'] = $("#choose_series a[class='hover']").attr('href');
                //console.log(data);
                $.post("/home/diamond/index", data, function(res) {
                    $(".con_list").html('');
                    if (res.list == null || res.list.length < 0 ) {
                        $(".con_list").append('<tr><td colspan="13">没有数据了</td></tr>');
                        if($('.diamond_list1').length>0){
                            $('.diamond_list1').html('');
                        }
                        $(".page").html('');
                    } else {
                        $(".page").html(res.page);
                        util.diaList(res.list,res.type);
                    }
                }, 'json');
            });
           
        }
    // 裸钻搜索
    // var diamondSearch = function() {
            
    //             var data = util.diaSearch();
    //             var sort_item = $('.seqdia .seqcur').attr('data-item');
    //             var sort_type = $('.seqdia .seqcur').attr('data-sort');
    //             data['sorting'] = sort_item + ' ' + sort_type;
    //             data['type'] = $("#choose_series a[class='hover']").attr('href');
    //             $.post("index.php?m=Home&c=Diamond&a=index", data, function(res) {
    //                 $(".con_list").html('');
    //                 if (res.list == null || res.list.length < 0 ) {
    //                     $(".con_list").append('<tr><td colspan="13">没有数据了</td></tr>');
    //                     $(".page").html('');
    //                 } else {
    //                     $(".page").html(res.page);
    //                     util.diaList(res.list,res.type);
    //                 }
    //             }, 'json');
            
           
    //     }
   //戒托页面裸钻搜索
    // var diamondSearch1 = function() {
        
    //     var data = util.diaSearch();
    //     data['type'] = $("#choose_series a[class='hover']").attr('href');
    //     data['goods_sn'] = $(".effect_hover1").attr('goods_sn');
    //     $.post("index.php?m=Home&c=Diamond&a=jieTuo_details", data, function(res) {
    //         $(".con_list").html('');
    //         if (res.list == null || res.list.length < 0 ) {
    //             $(".con_list").append('<tr><td colspan="13">没有数据了</td></tr>');
    //             $(".page").html('');
    //         } else {
    //             $(".page").html(res.page);
    //             util.diaList1(res.list,res.type);
    //         }
    //     }, 'json');
    
   
    // }

    //戒托页面裸钻搜索
    var diamondSearch1 = function() {

        $("#dia-submit").on('click', function(event) {
                event.preventDefault();
                var data = util.diaSearch();
                data['type'] = $("#choose_series a[class='hover']").attr('href');
                data['goods_sn'] = $(".effect_hover1").attr('goods_sn');
                $.post("/home/diamond/jieTuo_details", data, function(res) {
                    $(".con_list").html('');
                    if (res.list == null || res.list.length < 0 ) {
                        $(".con_list").append('<tr><td colspan="13">没有数据了</td></tr>');
                        $(".page").html('');
                    } else {
                        $(".page").html(res.page);
                        util.diaList1(res.list,res.type);
                    }
                }, 'json');
            });
   
    }
    
    // 裸钻对比
    var diamondContrast = function() {
        //关闭对比
        $('.dia-contrast').on('click', 'a.close', function(event) {
            event.preventDefault();
            $('.dia-contrast').hide();//对比框隐藏
            $('#dia_con_list').html('');//清空内容
            $('#dia_con_title').html('');//清空title
            $(".diamond-list label").removeClass("hover");//清除列表中的选中状态

            COMPARE.star = {};
            COMPARE.results = {};
            COMPARE.compareItem = {};
            COMPARE.compareResult = {};
        });
        // 对比框显示，判断不能超过3颗钻
        $('.diamond-list').on('click', '.list-box label', function(event) {
            COMPARE.star = {};
            COMPARE.results = {};
            COMPARE.compareItem = {};
            COMPARE.compareResult = {};
            var num = $('#dia_con_list').children('tr').length;
            var diatit = $('.thead_list tr').html();
            var diatit_tsyd = $('.thead_list').html();
            var datapid = $("#choose_series").find('a.hover').attr("href");
            var shop_id = $('.diamond-list').attr('data-shop-id');

            if(parseInt(shop_id)>0){
                diatit = diatit.replace("<th>网络优惠价</th>","");
            }else{
                diatit = diatit.replace("<th>市场价</th>","");
            }
            

            diatit = diatit.replace("<th>对比</th>","");
            diatit = "<tr><th>对比</th><th>星级推荐</th>" + diatit + "</tr>";            
            if (num === 0 && datapid !== "1"   ) {//设置title
                $('#dia_con_title').html(diatit);
            }
            if(num === 0 && datapid == "1" ){
                $('#dia_con_title').html(diatit_tsyd);
            }
            if (num < 3 && $(this).hasClass('hover') === false ) {
                $(this).addClass('hover');
                if(datapid !== "1"){            
                var text = $(this).parents('tr').html();      
               if(parseInt(shop_id)>0){
                var mrp = $(this).parents('tr').find("td").eq(10).html();
               } else{
                var mrp = $(this).parents('tr').find("td").eq(9).html();
               }
                
                var le = $(this).parents('tr').find("td").eq(0).html();
                text =  text.replace("<td>"+mrp+"</td>","");
                
                text =  text.replace("<td>"+le+"</td>","");

                text = "<td>"+le+"</td><td></td>"+text;
                $('#dia_con_list').append('<tr id="'+$(this).attr('id')+'" data-compare="'+$(this).closest('tr').attr('data-compare')+'" data-shape="'+$(this).closest('tr').attr('data-shape')+'">'+text+'</tr>');

                COMPARE.startCompare(this);
                var stars = COMPARE.star;
                var Items = COMPARE.results;
               for(var i in stars){
                    $('#dia_con_list tr').each(function(){                
                            if($(this).attr('id')==i){
                                if(stars[i]>0){
                                    var star_html = '';
                                    for(j=1;j<=stars[i];j++){
                                        star_html +='<img src="/Public/css/home/img/diamond/star.png" class="diastar" />';
                                       
                                    }
                                    $(this).find("td").eq(1).html(star_html);
                                    
                                     //钻重、颜色、净度、切工、抛光、荧光、对称、珂兰价

                                    var carat = $(this).find('td').eq(3).text();//钻重
                                    if(carat==Items[i][0]) 
                                        $(this).find('td').eq(3).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(3).css({ color: "" });

                                    var color = $(this).find('td').eq(4).text();//颜色
                                    if(color==Items[i][1]) 
                                        $(this).find('td').eq(4).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(4).css({ color: "" });

                                    var clarity  = $(this).find('td').eq(5).text();//净度
                                    if(clarity==Items[i][2]) 
                                        $(this).find('td').eq(5).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(5).css({ color: "" });

                                    var cut  = $(this).find('td').eq(6).text();//切工
                                    if(cut==Items[i][3]) 
                                        $(this).find('td').eq(6).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(6).css({ color: "" });

                                    var polishing  = $(this).find('td').eq(7).text();//抛光
                                    if(polishing==Items[i][4]) 
                                        $(this).find('td').eq(7).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(7).css({ color: "" });

                                    var fluorescence  = $(this).find('td').eq(8).text();//荧光
                                    if(fluorescence==Items[i][5]) 
                                        $(this).find('td').eq(8).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(8).css({ color: "" });

                                    var symmetry  = $(this).find('td').eq(9).text();//对称
                                    if(symmetry==Items[i][6]) 
                                        $(this).find('td').eq(9).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(9).css({ color: "" });
                                    
                                    var kela_price  = $(this).find('td').eq(10).text();//珂兰价
                                    if(100*kela_price==100*Items[i][7]) 
                                        $(this).find('td').eq(10).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(10).css({ color: "" });

                              //  }
                                }
                               
                               
                            }
                    })
                }
                }  
                else{
                    var text = $(this).parents('tr').html();
                    $('#dia_con_list').append('<tr id='+$(this).attr('id')+'>'+text+'</tr>');
                }
                $('.dia-contrast').fadeIn();
            }
            
            else if ($(this).hasClass('hover') === true) {
                $(this).removeClass('hover');
                if (num === 1) {//当对比框中还剩一个的时候，模拟点击关闭按钮
                    $('.dia-contrast a.close').trigger('click');
                }else{
                    $('#dia_con_list').find('tr[id ="'+$(this).attr('id')+'"]').remove();
                    $('#dia_con_list tr').find('td').css({color: ''});
                    $('#dia_con_list tr').find('td').eq(1).text('');
                }

                COMPARE.startCompare(this);
                var stars = COMPARE.star;
                var Items = COMPARE.results;
                for(var i in stars){
                    $('#dia_con_list tr').each(function(){                
                            if($(this).attr('id')==i){
                                if(stars[i]>0){
                                    var star_html = '';
                                    for(j=1;j<=stars[i];j++){
                                        star_html +='<img src="/Public/css/home/img/diamond/star.png" class="diastar" />';
                                       
                                    }
                                    $(this).find("td").eq(1).html(star_html);
                                    
                                     //钻重、颜色、净度、切工、抛光、荧光、对称、珂兰价

                                    var carat = $(this).find('td').eq(3).text();//钻重
                                    if(carat==Items[i][0]) 
                                        $(this).find('td').eq(3).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(3).css({ color: "" });
                                    var color = $(this).find('td').eq(4).text();//颜色
                                    if(color==Items[i][1]) 
                                        $(this).find('td').eq(4).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(4).css({ color: "" });
                                    var clarity  = $(this).find('td').eq(5).text();//净度
                                    if(clarity==Items[i][2]) 
                                        $(this).find('td').eq(5).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(5).css({ color: "" });
                                    var cut  = $(this).find('td').eq(6).text();//切工
                                    if(cut==Items[i][3]) 
                                        $(this).find('td').eq(6).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(6).css({ color: "" });
                                    var polishing  = $(this).find('td').eq(7).text();//抛光
                                    if(polishing==Items[i][4]) 
                                        $(this).find('td').eq(7).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(7).css({ color: "" });
                                    var fluorescence  = $(this).find('td').eq(8).text();//荧光
                                    if(fluorescence==Items[i][5]) 
                                        $(this).find('td').eq(8).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(8).css({ color: "" });
                                    var symmetry  = $(this).find('td').eq(9).text();//对称
                                    if(symmetry==Items[i][6]) 
                                        $(this).find('td').eq(9).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(9).css({ color: "" });
                                    var kela_price  = $(this).find('td').eq(10).text();//珂兰价
                                    if(100*kela_price==100*Items[i][7]) 
                                        $(this).find('td').eq(10).css({ color: "red" });
                                    else
                                        $(this).find('td').eq(10).css({ color: "" });

                              //  }
                                }
                               
                               
                            }
                    })
                }
            }else{
                $('.dia-modal-ce,#dia_modal').show();
                event.preventDefault();
            }
        });
        // 关闭错误提示框
        $('#dia_modal').on('click', '.modal-close,a.confirm', function(event) {
            event.preventDefault();
            $('.dia-modal-ce,#dia_modal').hide();
        });
        // 配拖按钮点击事件
        $('.choose-diamond').on('click', 'a.list-btn-pt', function(event) {
            event.preventDefault();
            //记录选中的裸钻
           var chosen_diamond = $(this).parents('tr').find('label').attr('id');
           $('#ring_con_title').attr('chosen_diamond',chosen_diamond);
           $('#ring_con_title').html($('.thead_list').html());
            var text = $(this).parents('tr').html();
            $('#ring_con_list').html('<tr id="'+$(this).attr('id')+'">'+text+'</tr>');
            $('#ring_con_title tr').append('<th id="ring_con_close"><a href="javascript:;">×</a></th>');
            $('#ring_con_list tr').each(function(){
          	  $(this).find('td:last').attr('colspan',2);
            })
            $('.ring-contrast').fadeIn();
            $("#ring_con_close").on('click','a',function(){
            	$('.ring-contrast').fadeOut();
            	$('#ring_con_title').html('');
            	$('#ring_con_list').html('');                
            })
            $('#choose_ring').trigger('click');
        });
    }
    //显示之前选中的钻石信息
    var showHistoryDiamond = function () {
        var chosen_diamond =$('#ring_con_title').attr('chosen_diamond');
        if(parseInt(chosen_diamond)){
             $('#choose_ring').trigger('click');
             $('#ring_con_title').html($('.thead_list').html());
             $.post("ajax.php?m=Api&c=Goods&a=getDiamondInfo",{id:chosen_diamond},function(res){
                  $('#ring_con_list').html(res.html);
                  $('#ring_con_title tr').append('<th id="ring_con_close"><a href="javascript:;">×</a></th>');
                  $('#ring_con_list tr').each(function(){
                	  $(this).find('td:last').attr('colspan',2);
                  })
                 $('.ring-contrast').fadeIn();
                 $("#ring_con_close").on('click','a',function(){
                	 $('.ring-contrast').fadeOut();
                	 $('#ring_con_title').html('');
                 	$('#ring_con_list').html('');
                 })
                 $('#choose_ring').trigger('click');
             });
             
        }
       
    }
            //获取挑选戒托搜索项
    var ringSearch = function () {
        var searchArry = {};
        $('.ring-search a').each(function(){
            if($(this).hasClass('hover')){
                var aaa = $(this).parents('dd').attr('data-key');
                searchArry[aaa] = $(this).html();
            }
        });
        searchArry['dia']= $('#ring_con_title').attr('chosen_diamond');
        return searchArry;
    }
    //获取挑选戒托搜索项
    var ringList = function (obj) {
    	if(!!obj){
	        $.each(obj,function(n,value) {
	        		var diamond_id = $('#ring_con_title').attr('chosen_diamond');
	        		var text = '<li><a target="_black" href="/home/diamond/jieTuo_details/goods_sn/'+value.style_sn+'/dia/'+diamond_id+'"><img src="'+value.img+'" width="272" height="250" alt="" /><span class="msghide">'+value.goods_name+'</span><span class="msgshow"><i>销量：'+value.sales_num+'</i></span></a></li>';//￥ '+value.dingzhichengben+'
	                //console.log(text);
	                $("#ringGoodsList").append(text);
	        	
	            
	        });
    	}else{
    		$("#ringGoodsList").append('<div class="zjnoData"><img src="/Public/css/home/img/search_notice.png">没有找到</div>');
    	}
    }
    var pageList = function (obj) {
        var page = '<a href="javascript:;"  data-id="next">下一页</a><a href="javascript:;"  data-id="prev">上一页</a><span class="span">'+obj.p+' / '+obj.pageCount+'</span><span>共 <i>'+obj.count+'</i> 件商品</span><input type="hidden" id="p" value="'+obj.p+'"><input type="hidden" id="pageNum" value="'+obj.pageCount+'">';
        $(".rtools-page").html(page);
    }
    // 挑选戒托
    var chooseRing = function () {
    	$('#choose_ring').on('click',function(){
    		showRing();
    	})
        //戒托搜索特效
        $('.choose-ring').on('click', '.ring-search a', function(event){
            event.preventDefault();
            $(this).addClass('hover').siblings('a').removeClass('hover');
            var data = ringSearch();
            $.post("ajax.php?m=home&c=diamond&a=diamond_search", data, function(data) {
                //console.log(data);
                $("#ringGoodsList").html('');
                ringList(data.list);
                pageList(data.page);
            }, "json");
        });
        $('.rtools-btn').on('click', 'a', function(event){
            event.preventDefault();
            $(this).addClass('hover').siblings('a').removeClass('hover');
            var data = ringSearch();
            data['sorting'] = $(this).attr("data-id");
            //console.log(data);
            $.post("ajax.php?m=home&c=diamond&a=diamond_search", data, function(data) {
                //console.log(data);
                $("#ringGoodsList").html('');
                pageList(data.page);
                ringList(data.list);
            }, "json");
        });
        $('.rtools-page').on('click', 'a', function(event){
            event.preventDefault();
            var data = ringSearch();
            data['act'] = $(this).attr("data-id");
            data['p'] = $('#p').val();
            data['pageNum'] = $('#pageNum').val();
            data['sorting'] = $('.rtools-btn a[class="hover"]').attr("data-id");
            //console.log(data);
            $.post("ajax.php?m=home&c=diamond&a=diamond_search", data, function(data) {
                //console.log(data);
                $("#ringGoodsList").html('');
                ringList(data.list);
                pageList(data.page);
            }, "json");
        });
    }
    var showRing = function(){
        var data = ringSearch();
         data['act'] =  $('.rtools-page a').attr("data-id");
         data['p'] = $('#p').val();
         data['pageNum'] = $('#pageNum').val();
         data['type'] = $('#choose_series .hover').attr('href');
         $.post("ajax.php?m=home&c=diamond&a=diamond_search", data, function(data) {
                $("#ringGoodsList").html('');
                ringList(data.list);
                pageList(data.page);
            }, "json");
    }
    //公共类
    var util = {};
    //裸钻搜索页面点击搜索获取搜索值
    util.diaSearch = function (){
//        var w = $("#weightSlider").val(),p = $("#priceSlider").val(),data = {};
//        for (var i in p) {
//        	var a = p[i].toString();
//            var a = a.replace(',', "");
//            p[i] = a;
//        };
//        data['weight'] = w;
//        data['price'] = p;
    	var minweight = $('#weight_lower').val();
    	var maxweight = $('#weight_upper').val();
    	var minprice = $('#price_lower').val();
    	var maxprice = $('#price_upper').val();
    	
        var nb1 = minprice.split(",");
        var nb2 = maxprice.split(",");
        var pb1 = 0;
        var pb2 = 0;
        for(var i=0; i<nb1.length; i++){
          pb1+=nb1[i];
        }
        for(var i=0; i<nb2.length; i++){
          pb2+=nb2[i];
        }

    	var data = {};
    	data['minweight'] = minweight;
    	data['maxweight'] = maxweight;
    	data['minprice'] = parseFloat(pb1);
    	data['maxprice'] = parseFloat(pb2);
        if($('.cert_id:visible').length>0){
            var cert_id = $('.cert_id:visible').val();
            data['cert_id'] = cert_id;
        }
    	
         var shape=[];//形状
        $("#diamond_search input[name='shape[]']:checkbox").each(function(){
        	if($(this).attr('checked')=='checked')
        		shape.push($(this).val());
        })
        data['shape'] = shape;
        var clarity=[];//净度
        $("#diamond_search input[name='clarity[]']:checkbox").each(function(){
        	if($(this).attr('checked')=='checked')
        		clarity.push($(this).val());
        })
        data['clarity'] = clarity;
        var color=[];//颜色
        $("#diamond_search input[name='color[]']:checkbox").each(function(){
        	if($(this).attr('checked')=='checked')
        		color.push($(this).val());
        })
        data['color'] = color;
        var symmetry=[];//对称
        $("#diamond_search input[name='symmetry[]']:checkbox").each(function(){
        	if($(this).attr('checked')=='checked')
        		symmetry.push($(this).val());
        })
        data['symmetry'] = symmetry;
        var cut=[];//切工
        $("#diamond_search input[name='cut[]']:checkbox").each(function(){
        	if($(this).attr('checked')=='checked')
        		cut.push($(this).val());
        })
        data['cut'] = cut;
        var cert=[];//证书
        $("#diamond_search input[name='cert[]']:checkbox").each(function(){
        	if($(this).attr('checked')=='checked')
        		cert.push($(this).val());
        })
        data['cert'] = cert;
        var polish=[];//抛光
        $("#diamond_search input[name='polish[]']:checkbox").each(function(){
        	if($(this).attr('checked')=='checked')
        		polish.push($(this).val());
        })
        data['polish'] = polish;
        return data;
    }
    // 从新编辑列表
    util.diaList = function (obj,type) {
        var shop_id = $('.diamond-list').attr('data-shop-id');
    	$('.dia-contrast').hide();//对比框隐藏
        $('#dia_con_list').html('');//清空内容
        $('#dia_con_title').html('');//清空title
        $(".diamond-list label").removeClass("hover");//清除列表中的选中状态
        if(type == 1){//天生一对
        	$('.diamond-list .list-box').show();
            $('.diamond-list .list-box').attr("data-proid","1");
        	$('.diamond_list').hide();
            if(shop_id>0){
                $(".thead_list").html("<tr><th>对比</th><th>形状</th><th>钻重</th><th>颜色</th><th>净度</th><th>切工</th><th>抛光</th><th>荧光</th><th>对称</th><th>珂兰价</th><th>网络优惠价</th><th>证书</th><th style='width: 180px;'>操作</th></tr>");
            }else{
                $(".thead_list").html("<tr><th>对比</th><th>形状</th><th>钻重</th><th>颜色</th><th>净度</th><th>切工</th><th>抛光</th><th>荧光</th><th>对称</th><th>市场价</th><th>珂兰价</th><th>证书</th><th style='width: 180px;'>操作</th></tr>");
            }
            
            $.each(obj,function(i,val){   
                  if(shop_id>0){
                     var dprice = val.discount_price>0 ? val.discount_price : val.shop_price;
                     var adprice = val.add.discount_price>0 ? val.add.discount_price : val.add.shop_price;
                     var htmprice = '<td>'+val.shop_price+'<br/>'+val.add.shop_price+'</td>'+'<td>'+dprice+'<br/>'+adprice+'</td>';
                  }else{
                    var dprice = val.market_price;
                    var adprice = val.add.market_price;
                    var htmprice ='<td>'+dprice+'<br/>'+adprice+'</td>'+'<td>'+val.shop_price+'<br/>'+val.add.shop_price+'</td>';
                  }                  
                var dmsg = "'"+val.shape+","+val.carat+","+val.color+","+val.clarity+","+val.cut+","+val.symmetry+","+val.polish+","+val.fluorescence+"'",
                   dmsg2 = "'"+val.add.carat+","+val.add.color+","+val.add.clarity+","+val.add.cut+","+val.add.symmetry+","+val.add.polish+","+val.add.fluorescence+"'",
                    durl = "'/home/diamond/diamond_details/goods_id/"+val.goods_id+"'",
                      zs = "'"+val.cert+val.cert_id+"'";
                  
                $(".con_list").append(
                    '<tr onMouseOver="util.hoverOn(this,'+zs+','+dmsg+','+dmsg2+','+durl+')" onMouseOut="util.hoverOff()">'
                    +'<td><label id="'+val.goods_id+'"></label></td>'
                    +'<td><span class="shape'+val.shape+'"></span></td>'
                    +'<td>'+val.carat+'<br/>'+val.add.carat+'</td>'
                    +'<td>'+val.color+'<br/>'+val.add.color+'</td>'
                    +'<td>'+val.clarity+'<br/>'+val.add.clarity+'</td>'
                    +'<td>'+val.cut+'<br/>'+val.add.cut+'</td>'
                    +'<td>'+val.polish+'<br/>'+val.add.polish+'</td>'
                    +'<td>'+val.fluorescence+'<br/>'+val.add.fluorescence+'</td>'
                    +'<td>'+val.symmetry+'<br/>'+val.add.symmetry+'</td>'
                    +htmprice
                    +'<td>'+val.cert+''+val.cert_id+'<br/>'+val.add.cert+''+val.add.cert_id+'</td>'
                    +'<td><a class="list-btn list-btn-pt" href="">配托</a><a class="list-btn list-btn-ck" target="_black" href="/home/diamond/dia_tsyd_details/kuan_sn/'+val.kuan_sn+'">查看</a> <a class="list-btn ntkf-chat" href="javascript:;">咨询</a></td></tr>');
            });
        }else if(type == 4){//彩钻
        	$('.diamond-list .list-box').hide();
            $('.diamond-list .list-box').attr("data-proid","4");
        	$('.diamond_list').show();
        	$('.diamond_list1').html('');
        	var colorobj=[],shapeobj=[];
        	colorobj['Yellow']='黄色';
        	colorobj['Blue']='蓝色';
        	colorobj['Pink']='粉色';
        	colorobj['Green']='绿色';
        	colorobj['Orange']='橙色';
        	colorobj['Champagne']='香槟';
        	colorobj['Purple']='紫色';
        	colorobj['Royal_purple']='蓝紫色';
        	colorobj['Red']='红色';
        	//colorobj['Gray']='灰色';
        	colorobj['Chameleon']='变色龙';
        	colorobj['Black']='黑';
        	colorobj['Grey']='格雷恩';
        	colorobj['Multicolor']='混色';
        	//colorobj['White']='白色';
        	shapeobj['Round']='圆形';
        	shapeobj['Princess']='公主方';
        	shapeobj['Emerald']='祖母绿';
        	shapeobj['Oval']='椭圆形';
        	shapeobj['Marquise']='橄榄形';
        	shapeobj['Asscher']='阿斯切形';
        	//shapeobj['Pear']='水滴形';
        	shapeobj['Heart']='心型';
        	//shapeobj['Trilliant']='三角形';
        	shapeobj['Radiant']='雷迪恩';
        	shapeobj['Cushion']='枕型';
            $.each(obj,function(i,val){
            	var fls = !!(val.fluorescence) ? val.fluorescence : ''; 
            	var durl = "/home/diamond/caizuan_details/goods_id/"+val.id;
            	var color = colorobj[val.color] ? colorobj[val.color] : '其他';
            	var shape = shapeobj[val.shape] ? shapeobj[val.shape] : '其他';
            	$('.diamond_list1').append(
            	' <li class="br1' + ((i > 0 && ((i + 1) % 4 == 0)) ? " br2" : "") + '"><div class="diamond_show1 show1"><div class="img"><a href="'+durl+'" target="_blank">'
            	+ '<img src="'+val.image1+'"  onerror="this.src=l_img;" /></a>'
            	+'</div><span class="text"><a href="'+durl+'" target="_blank">'+val.carat+'克拉，'+color+','+shape+'形状,'+val.clarity+'净度,'+val.cert+',商品编号'+val.goods_sn+'</span><span class="price_l">￥'+val.price+'</a></span></div>'
            	);
            });
        }else{//GIA 星耀
        	$('.diamond-list .list-box').show();
            $('.diamond-list .list-box').attr("data-proid","2");
        	$('.diamond_list').hide();
            if(shop_id>0){
                 $(".thead_list").html("<tr><th>对比</th><th>形状</th><th>钻重</th><th>颜色</th><th>净度</th><th>切工</th><th>抛光</th><th>荧光</th><th>对称</th><th>珂兰价</th><th>网络优惠价</th><th>证书</th><th style='width: 180px;'>操作</th></tr>");
            
            }else{
                 $(".thead_list").html("<tr><th>对比</th><th>形状</th><th>钻重</th><th>颜色</th><th>净度</th><th>切工</th><th>抛光</th><th>荧光</th><th>对称</th><th>市场价</th><th>珂兰价</th><th>证书</th><th style='width: 180px;'>操作</th></tr>");
            
            }
           
            $.each(obj,function(i,val){
                if(shop_id>0){
                     var dprice = val.discount_price>0 ? val.discount_price : val.shop_price;
                     var htmlprice = '<td>'+val.shop_price+'</td>'+'<td>'+dprice+'</td>';
                  }else{
                    var dprice = val.market_price;
                    var htmlprice = '<td>'+dprice+'</td>' +'<td>'+val.shop_price+'</td>';
                   
                  }    
                var compare = val.carat+","+val.color+","+val.clarity+","+val.cut+","+val.polish+","+val.fluorescence+","+val.symmetry+","+val.shop_price,
                 dmsg = "'"+val.shape+","+val.carat+","+val.color+","+val.clarity+","+val.cut+","+val.polish+","+val.fluorescence+"',''",
                    durl = "'/home/diamond/diamond_details/goods_id/"+val.goods_id+"'",
                      zs = "'"+val.cert+val.cert_id+"'" ;
                
                $(".con_list").append(
                    '<tr onMouseOver="util.hoverOn(this,'+zs+','+dmsg+','+durl+')" onMouseOut="util.hoverOff()" data-shape="'+val.shape+'" data-compare="'+compare+'" data-id="'+val.goods_id+'">'
                    +'<td><label id="'+val.goods_id+'"></label></td>'
                    +'<td><span class="shape'+val.shape+'"></span></td>'
                    +'<td>'+val.carat+'</td>'
                    +'<td>'+val.color+'</td>'
                    +'<td>'+val.clarity+'</td>'
                    +'<td>'+val.cut+'</td>'
                    +'<td>'+val.polish+'</td>'
                    +'<td>'+val.fluorescence+'</td>'
                    +'<td>'+val.symmetry+'</td>'
                    + htmlprice
                    +'<td>'+val.cert+''+val.cert_id+'</td>'
                    +'<td><a class="list-btn list-btn-pt" href="">配托</a><a class="list-btn list-btn-ck" target="_black" href="/home/diamond/diamond_details/goods_id/'+val.goods_id+'">查看</a> <a class="list-btn ntkf-chat" href="javascript:;">咨询</a></td></tr>');
            });
        }
    }
    //戒托详情页裸钻列表
    util.diaList1 = function (obj,type) {
    	var goods_sn = $('.effect_hover1').attr('goods_sn');
        var shop_id = $('.effect_hover1').attr('shop_id');
        var ti = parseInt(shop_id)>0 ? '<th>珂兰价</th><th>网络优惠价</th>' : '<th>市场价</th><th>珂兰价</th>';
        
        if(type == 1){//天生一对
            $(".thead_list").html("<tr><th>形状</th><th>钻重</th><th>颜色</th><th>净度</th><th>切工</th><th>抛光</th><th>荧光</th><th>对称</th>"+ti+"<th>证书</th><th style='width: 150px;'>操作</th></tr>");
            $.each(obj,function(i,val){  
                var price =  parseInt(shop_id)>0 ? val.discount_price : val.market_price;  
                var price1 =  parseInt(shop_id)>0 ? val.add.discount_price : val.add.market_price;    
                var htmprice =  parseInt(shop_id)>0 ?  ('<td>'+val.shop_price+'<br/>'+val.add.shop_price+'</td>'+'<td>'+price+'<br/>'+price1+'</td>') :   ('<td>'+price+'<br/>'+price1+'</td>'+'<td>'+val.shop_price+'<br/>'+val.add.shop_price+'</td>')  ;     
                $(".con_list").append(
                    '<tr>'
                    +'<td><span class="shape'+val.shape+'"></span></td>'
                    +'<td>'+val.carat+'<br/>'+val.add.carat+'</td>'
                    +'<td>'+val.color+'<br/>'+val.add.color+'</td>'
                    +'<td>'+val.clarity+'<br/>'+val.add.clarity+'</td>'
                    +'<td>'+val.cut+'<br/>'+val.add.cut+'</td>'
                    +'<td>'+val.polish+'<br/>'+val.add.polish+'</td>'
                    +'<td>'+val.fluorescence+'<br/>'+val.add.fluorescence+'</td>'
                    +'<td>'+val.symmetry+'<br/>'+val.add.symmetry+'</td>'
                    +htmprice
                    +'<td>'+val.cert+''+val.cert_id+'<br/>'+val.add.cert+''+val.add.cert_id+'</td>'
                    +'<td><a class="list-btn" href="/home/diamond/jieTuo_details/goods_sn/'+goods_sn+'/dia='+val.goods_id+'">选择</a> <a class="list-btn ntkf-chat" href="javascript:;">咨询</a></td></tr>');
            });
        }else if(type==2 || type==3){//GIA 星耀
            $(".thead_list").html("<tr><th>形状</th><th>钻重</th><th>颜色</th><th>净度</th><th>切工</th><th>抛光</th><th>荧光</th><th>对称</th>"+ti+"<th>证书</th><th style='width: 150px;'>操作</th></tr>");
            $.each(obj,function(i,val){
                var price =  parseInt(shop_id)>0 ? val.discount_price : val.market_price;  
                var htmprice =  parseInt(shop_id)>0 ? '<td>'+val.shop_price+'</td>'+'<td>'+price+'</td>' : '<td>'+price+'</td>'+'<td>'+val.shop_price+'</td>';
                $(".con_list").append(
                    '<tr>'
                    +'<td><span class="shape'+val.shape+'"></span></td>'
                    +'<td>'+val.carat+'</td>'
                    +'<td>'+val.color+'</td>'
                    +'<td>'+val.clarity+'</td>'
                    +'<td>'+val.cut+'</td>'
                    +'<td>'+val.polish+'</td>'
                    +'<td>'+val.fluorescence+'</td>'
                    +'<td>'+val.symmetry+'</td>'
                    +htmprice
                    +'<td>'+val.cert+''+val.cert_id+'</td>'
                    +'<td><a  class="list-btn" href="/home/diamond/jieTuo_details/goods_sn/'+goods_sn+'/dia='+val.goods_id+'">选择</a> <a style="margin-left: 8px;"  class="list-btn ntkf-chat" href="javascript:;">咨询</a></td></tr>');
            });
        }
    }
    
    // 分页
    util.diaListPage = function(id){
        //user函数名 一定要和action中的第三个参数一致上面有
        var arr = util.diaSearch();
        var type =  $("#choose_series a[class='hover']").attr('href');
        var sorting = [];
        var page_list = [];
       var sort_item = $('.seqdia li.seqcur').attr('data-item');
        var sort_type = $('.seqdia li.seqcur').attr('data-sort');
        page_list = arr;
        page_list['p'] = id;
       page_list['sorting'] = sort_item + ' ' + sort_type;
        page_list['type'] = type;
        $.get('/home/diamond/index', page_list , function(data){
            $(".page").html(data.page);
            $(".con_list").html('');
            util.diaList(data.list,data.type);
        });
    }
 // 戒托详情裸钻分页
    util.diaListPage1 = function(id){
        //user函数名 一定要和action中的第三个参数一致上面有
        var arr = util.diaSearch();
        var page_list = [];
        page_list = arr;
        page_list['p'] = id;
        page_list['goods_sn'] = $('.effect_hover1').attr('goods_sn');
        page_list['dia'] = $('.effect_hover1').attr('dia');
        $.get('/home/diamond/jieTuo_details', page_list , function(data){
            $(".page").html(data.page);
            $(".con_list").html('');
            util.diaList1(data.list,data.type);
        });
    }
    // table 滑动
    util.hoverOn = function (id,zs,data1,data2,aurl){
        $("#is_on_info").val(1);
        var data1_msg = data1.split(','),data2_msg = data2.split(','),textcon1 = '',textcon2 = '';
        $('.list-msg-title').text('证书编号：'+zs);
        for (var i = 0; i < data1_msg.length; i++) {
            if (data1_msg[0] === '1') {
                data1_msg[0] = '圆形'
            }else if (data1_msg[0] === '2') {
                data1_msg[0] = '公主方'
            }else if (data1_msg[0] === '3') {
                data1_msg[0] = '祖母绿'
            }else if (data1_msg[0] === '4') {
                data1_msg[0] = '椭圆形'
            }else if (data1_msg[0] === '5') {
                data1_msg[0] = '橄榄形'
            }else if (data1_msg[0] === '6') {
                data1_msg[0] = '雷迪恩'
            }else if (data1_msg[0] === '7') {
                data1_msg[0] = '水滴形'
            }else if (data1_msg[0] === '8') {
                data1_msg[0] = '心形'
            }else if (data1_msg[0] === '9') {
                data1_msg[0] = '三角形'
            }else if (data1_msg[0] === '10') {
                data1_msg[0] = '垫形'
            }
            if (data1_msg[i] === '') {
                data1_msg[i] = '-'
            };
            textcon1 += '<li>'+data1_msg[i]+'</li>'
        };
        $('#listmsg_con1').html(textcon1);
        if (data2_msg.length>1) {
            $("#info_win").addClass('listmsg2').removeClass('listmsg1');
            for (var i = 0; i < data2_msg.length; i++) {
                if (data2_msg[i] === '') {
                    data2_msg[i] = '-'
                };
                textcon2 += '<li>'+data2_msg[i]+'</li>'
            }; 
            $('.listmsg-title2').show();
            $('#listmsg_con2').show().html(textcon2);
        }else{
            $("#info_win").addClass('listmsg1').removeClass('listmsg2');
        }    
        $("#view_url").attr("href" , aurl);
        $("#info_win").show();
        $('#is_on_info').val(1);
        // 定位 
        var wh = $(window).height(),divh = $("#info_win").height(),nt = id.getBoundingClientRect().top+document.documentElement.scrollTop+document.body.scrollTop,ntop=0;        
        if ((wh - nt) < divh) {
            ntop = nt-(divh-(wh-nt))-20
        }else{
            ntop = nt;
        }
        $("#info_win").css('top', ntop);
    }
    util.hoverOff = function(){
        $("#is_on_info").val(0);
    }