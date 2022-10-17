define(function(require,exports) {
    require('base.js?1');
    exports.init = function () {
        this.displayDefaultShops();
        this.displayShops();
        this.clickHotCity();//点击输入框中的热门城市
        this.chooseShop();
        this.searchShop();//下拉选择框搜索
        this.showHotCities();//点击输入框显示热门城市        
        this.showSimilarCities();//输入框输入时下方显示相似城市
        this.clickShop();
        this.goToShop();
        //头部体验店改动后的部分
        //this.displayNowCity();
        this.ipShopSelc();//首次进入时，是否弹出体验店选择框
    },
    exports.displayDefaultShops = function(){
        var need_select_shop = $(".site-city").attr('data-need-select-shop');//首次进入时是否需要弹框选店
        var match = $(".site-city").attr('data-match');//首次进入时是否匹配上体验店
        var is_first_in = $(".site-city").attr('data-is-first-in');//是否首次进入
        var shop_id = $("#site_city").attr('shop-id');
        var shop_name = $("#site_city").text();
        var province_id = $("#site_city").attr('province-id');
        var city_id = $("#site_city").attr('city-id');

        var now_city_id = $("#site_city").attr('now-city');
        /*$(".province_name").removeClass('default_display');
        $(".province_name[province-id='"+province_id+"']").addClass('default_display');*/
        $(".city_name").removeClass('default_display');
        $(".city_name[city-id='"+city_id+"']").addClass('default_display');        
        //if(is_first_in){
            /*if(need_select_shop){
                //首次进入，所在城市有多家店
                $("#siteCity").fadeIn(200);
            }*/

            //如果在全国店，点击选择体验店时，显示热门城市、地区选择下拉框、城市输入框等，省市默认显示所在地省市，下方体验店显示所在城市体验店;若所在城市无体验店，userbasecontroller中已将当前省市均设为北京，则默认省市均为北京，下方待进入的体验店显示北京的体验店
            //如果不是全国店，点击选择体验店时，热门城市、地区选择下拉框、城市输入框均隐藏，只显示当前城市体验店和全国店
            /*if( shop_id == 0 && province_id == 0 && city_id == 0){
                //全国店
                getShopsByCityId(now_city_id);
                //$(".hot_city_list").hide();
            }else{
                $(".pleasecity,.citysch,.shench,.hostcity").hide()
                getShopsByCityId(city_id);
            }*/

           $(document).delegate(".nearcl","click",function(){
               var province_id = $(this).attr('province-id');
               var city_id = $(this).attr('city-id');
               var shop_id = $(this).attr('shop-id');
               var now_city_id = $(this).attr('now-city');
               $(".pleasecity").text("请选择城市");
               if( parseInt(shop_id) == 0 && parseInt(province_id) == 0 && parseInt(city_id) == 0){
                   //全国店

                   getShopsByCityId(now_city_id,".nearcl");
                   //$(".hot_city_list").hide();
               }else{
                   $(".citysch,.shench,.hostcity").hide()

                   getShopsByCityId(city_id,"#site_city");
               }
           })

        /*$(function(){
            var o = $(".high_light_shop").text();
            $(".tabsel-wrap").find("label").html(o);
        })*/

        var x_city_id = parseInt($(".nearly").attr('city-id'));
        //alert(x_city_id);

        getShopsByCityId(x_city_id,"#site_city");

    },

    /*exports.displayShops = function(){
        $(document).delegate('.province_name','click',function(){
            var select_province = $(this).attr('province-id');
            getShops(select_province);
            $('.province_name').removeClass("default_display");
            $(this).addClass("default_display");
        })
    },*/

    exports.displayShops = function(){
        $(document).delegate('.city_name','click',function(){
            var select_city = $(this).attr('city-id');

            getShopsByCityId(select_city,'.nearcl');
            $('.city_name').removeClass("default_display");
            $(this).addClass("default_display");
        })
    },
    exports.chooseShop = function() {
        $(document).delegate(".select_shop","click",function(){
            var shop_id = $(this).attr('data-shop-id');
            var province_id = $(this).attr('data-province-id');
            var city_id = $(this).attr('data-city-id');
            $.post('ajax.php?m=Api&c=Region&a=storeShopSelection',{sid:shop_id,province_id:province_id,city_id:city_id},function(res){
                if(res.result && res.result == 1){
                    $("#siteCity").hide();
                    window.location.href = res.data.shop_url + window.location.pathname + "?" + window.location.search.substring(1);
                }
                else {
                    alert(res.msg);
                }
            },'json')

            //请求接口以city_id取城市名称
            if(shop_id && shop_id > 0) {
                $.post('ajax.php?m=Api&c=Region&a=getCityInfo',{shop_id:shop_id},function(res){
                    if(res.result && res.result == 1){
                        $(".nowstay_cityname").html(res.data.province_name +'-'+ res.data.city_name);
                    }
                    else {
                        alert(res.msg);
                    }
                },'json');
            }
            else {
                $(".nowstay_cityname").html("全国");
            }
        })
    },

    exports.clickShop = function(){
        $(document).delegate('.basecor','click',function(){
            var shop_id = $(this).attr('data-shop-id');
            var province_id = $(this).attr('data-province-id');
            var city_id = $(this).attr('data-city-id');
            $.post('ajax.php?m=Api&c=GetShop&a=getShopInfo',{shop_id:shop_id,province_id:province_id,city_id:city_id},function(res){
                if(res.result && res.result == 1){
                    //var shop_address_html = "<div class='citydetail' data-province-id='"+province_id+"' data-city-id='"+city_id+"' data-shop-id='"+shop_id+"'>"+res.data.shop_address+"</div>";
                    //$(".city-wrap").append(shop_address_html);
                    $('.citydetail').attr('data-province-id',province_id);
                    $('.citydetail').attr('data-city-id',city_id);
                    $('.citydetail').attr('data-shop-id',shop_id);
                    $('.citydetail').html(res.data.shop_address);
                }
                else {
                    alert(res.msg);
                }
            },'json')
        })
    },

    exports.goToShop = function() {
        $(document).delegate('.gothere','click',function(){
            var province_id = parseInt($(".high_light_shop").attr('data-province-id'));
            var city_id = parseInt($(".high_light_shop").attr('data-city-id'));
            var shop_id = parseInt($(".high_light_shop").attr('data-shop-id'));

            $.post('ajax.php?m=Api&c=Region&a=storeShopSelection',{sid:shop_id,province_id:province_id,city_id:city_id},function(res){
                if(res.result && res.result == 1){
                    $("#siteCity").hide();
                    window.location.href = res.data.shop_url + window.location.pathname + "?" + window.location.search.substring(1);
                }
                else {
                    alert(res.msg);
                }
            },'json')
        })
    },

    exports.searchShop = function(){
        /*$(document).delegate(".search_shop_btn","focus",function(){
            var city_id = $("[name='city']").val();
            getShopsByCityId(city_id)            
        })*/
        $(document).delegate("#select_province,#select_city","change",function(){
            setTimeout(function(){
                var city_id = $("#select_city").val();

                getShopsByCityId(city_id,'.nearcl')
            },200)
        })
    },

    exports.clickHotCity = function(){
        $(document).delegate(".hot_city","click",function(){
            var city_id = $(this).attr('city-id');
            var city_name = $(this).text();

            getShopsByCityId(city_id,'.nearcl');
            $("[name='search_city_shop']").val(city_name);
            setTimeout(function(){
                $(".hot_city_list").hide();
            },300)
        })
    },
    exports.showHotCities = function(){
        $(document).delegate("[name='search_city_shop']","click",function(){
            $(".hot_city_list").show()
        })
        $(document).delegate("[name='search_city_shop']","blur",function(){
            var input = $.trim($(this).val());
            $.post("ajax.php?m=Api&c=Region&a=getSimilarCities",{cityName:input},function(res){
                var str = '';
                if(res.result === 1){
                    $.each(res.data,function(){
                        str += '<li class="hot_city" city-id="'+this.region_id+'">'+this.region_name+'</li>';
                        //str += '<li><a href="javascript:;" class="select_shop" data-shop-id="'+this.dep_id+'" data-province-id="'+this.province_id+'" data-city-id="'+this.city_id+'">'+this.shop_name+'</a></li>';
                    });
                    $(".hot_city_list").html(str);
                }else{
                    /*if(input == ''){
                        $(".hot_city_list").html(html);
                    }else{
                        $(".hot_city_list").html('');
                    }*/

                    if(input != ''){
                        $(".hot_city_list").html('');
                        $(".sear_tips").html("抱歉!您搜索城市珂兰体验店暂未入驻,<br><a href='javascript:;' class='select_shop' data-province-id='0' data-city-id='0' data-shop-id='0'>点击进入全国站 &gt;&gt;</a>");
                    }
                }
            },'json')
            setTimeout('$(function(){$(".hot_city_list").hide();})',100);
        })
    },

    exports.showSimilarCities = function(){
        var html = $(".hot_city_list").html();

        $(document).delegate("[name='search_city_shop']","focus",function(){
            $(".sear_tips").html('');

            //$(".hot_city_list").find('ins').remove();
            $(".hot_city_list").show();
            $(this).val('');
            var con = $(this).val();
            $.each($(".hot_city"),function(){
                if(con == $(this).text()){
                    $("[name='search_city_shop']").val('');
                }
            })
        })

        $(document).delegate("[name='search_city_shop']","keyup",function(){
            //$(this).val('');

            var input = $.trim($(this).val());

            $.post("ajax.php?m=Api&c=Region&a=getSimilarCities",{cityName:input},function(res){
                var str = '';
                if(res.result === 1){
                    $.each(res.data,function(){
                        str += '<li class="hot_city" city-id="'+this.region_id+'">'+this.region_name+'</li>';
                        //str += '<li><a href="javascript:;" class="select_shop" data-shop-id="'+this.dep_id+'" data-province-id="'+this.province_id+'" data-city-id="'+this.city_id+'">'+this.shop_name+'</a></li>';
                    });
                    $(".hot_city_list").html(str);
                }else{
                    if(input == ''){
                        $(".hot_city_list").html(html);
                    }else{
                        $(".hot_city_list").html('');
                    }
                }
            },'json')
        })
    },

    exports.displayNowCity = function(){
        var province_id = parseInt($(".nearly").attr('province-id'));
        var city_id = parseInt($(".nearly")[0].city-id);
        var shop_id = parseInt($(".nearly").attr('shop-id'));


        if(province_id == 0 && city_id == 0 && shop_id == 0){
            $(".whch").html('全国');
            $(".wheng").html('QUANGUO');
            $("#site_city").css({"cursor":"default"});
            $("#site_city").removeClass("nearcl");
            $(".nearly").removeAttr('id').html("<a id='header-qg' href='/home/shop/home' target='_blank'>查看全国珂兰体验店</a>");
        }else{
            //以now_city_id取城市信息
            $.post('ajax.php?m=Api&c=Region&a=getCityInfoByCityId',{city_id:city_id},function(res){
                if(res.result == 1){
                    $(".whch").html(res.data.city_name);
                    $(".wheng").html(res.data.city_name_quanpin);
                    $(".nowstay_cityname").html(res.data.province_name +'-'+ res.data.city_name);
                }
            },'json')
        }
    },

    exports.ipShopSelc = function(){
        var ip_shop_selc = $('#siteCity').attr('ip-shop-selc');
        var ip_province_id = parseInt($('#siteCity').attr('ip-province-id'));
        var ip_city_id = parseInt($('#siteCity').attr('ip-city-id'));
        var ip_shop_id = parseInt($('#siteCity').attr('ip-shop-id'));
        if(parseInt(ip_shop_selc) === 1){
            $(".citysch,.shench,.hostcity").hide()
            $('#siteCity').show();
            $('.city-close2').click(function(){
                $.post('ajax.php?m=Api&c=Region&a=storeShopSelection',{sid:0,province_id:0,city_id:0},function(res){
                    if(res.result && res.result == 1){
                        $("#siteCity").hide();
                        window.location.href = res.data.shop_url + window.location.pathname + "?" + window.location.search.substring(1);
                    }
                    else {
                        alert(res.msg);
                    }
                },'json')
            })
        }
    }


    //获取省内所有体验店
    function getShops(province_id){
        $.get('ajax.php?m=Api&c=GetShop&a=getShops&province_id='+province_id,function(res){
            if(res.result == 1){
               var str = '';
                $.each(res.data.list,function(){
                    str += '<li><a href="javascript:;" class="basecor" data-shop-id="'+this.dep_id+'" data-province-id="'+this.province_id+'" data-city-id="'+this.city_id+'">'+this.shop_name+'</a></li>';
                });
                $(".city_right_shop").html(str);
            }
        },'json')
    }

    //获取城市内所有体验店
    function getShopsByCityId(city_id,cls){

        if(parseInt(city_id) == 0 ||isNaN(city_id) ){
            var str = '<li><a href="javascript:;" class="basecor high_light_shop" data-shop-id="0" data-province-id="0" data-city-id="0">全国店</a></li>';
            $(".city_right_shop").html(str);
            $(".citydetail").hide();
            var o = $(".high_light_shop").html();
            if(o == "全国店"){
               $(".tabsel-wrap").find("label").html("选择预约体验店");
            }
            else{
              $(".tabsel-wrap").find("label").html(o)  
            }
        }else{
            $.get('ajax.php?m=Api&c=GetShop&a=getCityShops&city_id='+city_id,function(res){
                if(res.result == 1){
                    var str = '';
                    $.each(res.data.list,function(k,v){
                        str += '<li><a href="javascript:;" class="basecor" data-shop-id="'+this.dep_id+'" data-province-id="'+this.province_id+'" data-city-id="'+this.city_id+'">'+this.shop_name+'</a></li>';
                        if(cls == '.nearcl'){
                            if(k == 0) {
                                $('.citydetail').html(v.shop_address);
                            }
                        }else if(cls == '#site_city'){
                            var now_shop_id = parseInt($("#site_city").attr('shop-id'));
                            if(parseInt(v.dep_id) == now_shop_id){
                                $('.citydetail').html(v.shop_address);
                            }
                        }

                    });
                    $(".city_right_shop").html(str);
                    $(".citydetail").show();
                    var province_id = $(cls).attr('province-id');
                    var city_id = $(cls).attr('city-id');
                    var shop_id = $(cls).attr('shop-id');

                    if(province_id == 0 && city_id == 0 && shop_id == 0){
                        $("#siteCity").addClass("homeshop");
                        $("#siteCity").removeClass("siteshop");
                        var winh = $(window).height();
                        var chh = $(".homeshop").height()+40;
                        var winhhf = (winh-chh)/2;
                        //console.log(chh+"h");地址选择弹窗高度对比
                        $(".homeshop").css({"top":winhhf+"px"});
                        $(window).resize(function(){
                            var winh = $(window).height();
                            var winhhf = (winh-chh)/2;
                            $(".homeshop").css({"top":winhhf+"px"});
                        })
                        $(".cityin").removeClass("has_single_shop")
                        $(".cityin").removeClass("has_more_shop")
                        $('.citynw li:eq(0) a').addClass('high_light_shop');
                        var add_html = res.data.list[0].shop_address;
                        $(".citydetail").html(add_html);


                        $(".city_right_shop").removeClass("ftcitynw");
                        $(".citycomtit").removeClass("new_citycomtit");
                        $(".cityin .citycomtit").show();
                        $(".cityin .new_citycomtit").hide();
                        $(".pleasecity,.citysch,.shench,.hostcity").show()
                    }else{
                        $(".city_right_shop").addClass("ftcitynw");
                        //$(".cityfortop").html("<span class='nowstay'>您所在的城市：<span class='nowstay_cityname'></span></span><a class='city-close2' href='javascript:;' data-shop-id='0' data-province-id='0' data-city-id='0' title='关闭'></a>");
                        $(".cityin .citycomtit").hide();
                        $(".pleasecity").text("选择就近的体验店，了解分店活动资讯 >");
                        var length = parseInt($(".city_right_shop").find("li").length);
                        if(length == 1){
                            $(".cityin").addClass('has_single_shop');
                        }
                        if(length > 1){
                            $(".cityin").addClass('has_more_shop');
                        }
                        // $(".city-wrap").append("<div class='citydetail' data-province-id='' data-city-id='',data-shop-id=''> </div>");
                        var now_shop_id = $("#site_city").attr('shop-id');
                        $(".basecor[data-shop-id="+now_shop_id+"]").addClass("high_light_shop");

                        var o = $(".high_light_shop").html();
                        $(".tabsel-wrap").find("label").html(o)
                    }
                }
                $("#siteCity").addClass("siteshop");
                $("#siteCity").removeClass("homeshop");
                var winh = $(window).height();
                var chh = $(".siteshop").height()+40;
                var winhhf = (winh-chh)/2;
                //console.log(chh+"s"); 地址选择弹窗高度对比
                $(".siteshop").css({"top":winhhf+"px"});
                $(window).resize(function(){
                    var winh = $(window).height();
                    var winhhf = (winh-chh)/2;
                    $(".siteshop").css({"top":winhhf+"px"});
                })
            },'json')
        }

        $(document).delegate(".citynw li a","click",function(){
            $(".citynw li a").removeClass("high_light_shop");
            $(this).addClass("high_light_shop")
        })        
    }
})
