window.Goods = {
	countDown: function(c_timestamp, callback){
		 //var t_timestamp = Date.parse(targetTime);
		   // var s_timestamp = new Date();

		  //  c_timestamp = t_timestamp - s_timestamp; // 倒计时间戳
	
		    if (c_timestamp > 0) {
		        setTimeout(function callee() {
		        	Goods.countdownTime(c_timestamp,callback);
		            if (c_timestamp > 0) {
		                c_timestamp -= 1000;
		                setTimeout(callee, 1000);
		            }
		        }, 1);
		    }
	},
	countdownTime: function(c_timestamp,callback){
		  var d, h, m, s;
	        c_timestamp = c_timestamp / 1000;
	 
	        d = parseInt(c_timestamp / 3600 / 24, 10); // 天数
	        h = parseInt(c_timestamp / 3600 % 24, 10); // 小时
	        m = parseInt(c_timestamp % 3600 / 60, 10); // 分钟
	        s = parseInt(c_timestamp % 3600 % 60, 10); // 秒
	 
	        if (typeof callback === 'function') {
	            callback(d, h, m, s);
	        }
	}
	
};		 
define(function(require,exports,module){
    module.exports = Goods;
});

var gds = {
	init : function(){
		piczoom();
		menulf();
		gdsmenu();
		surnum();
	}
}
// 好评晒图
var piczoom = function(){
		$(document).delegate(".pubfpic li img","click",function(){		
			if($(this).hasClass("active")){
				$(this).parent().find("i").remove();
				$(this).removeClass("active");
				$(this).parent().removeClass("liactive");
				$(this).closest(".pubfpic").next(".show-pubp").animate({"width":0+'px',"height":0+'px'},"1000",function(){
					$(this).hide()
				})	
			}else{
				$(this).addClass("active").parent().siblings().find("img").removeClass("active");
				$(this).parent().addClass("liactive").siblings().removeClass("liactive");
				$(".pubfpic li i").remove();
				$(this).parent("li").append("<i></i>");
				$(this).closest(".pubfpic").next(".show-pubp").show();
				$(this).closest(".pubfpic").next(".show-pubp").find("img").attr("src",$(this).attr('src'));
				$(this).closest(".pubfpic").next(".show-pubp").animate({"width":394+'px',"height":406+'px'},"1000")
			}
		});
		$(document).delegate(".bigp","click",function(){
			$(this).closest(".show-pubp").prev(".pubfpic").find("li i").remove();
			$(this).closest(".show-pubp").prev(".pubfpic").find("li img").removeClass("active");
			$(this).closest(".show-pubp").prev(".pubfpic").find("li").removeClass("liactive");
			$(this).parent().animate({"width":0+'px',"height":0+'px'},"1000",function(){
				$(this).hide()
			})		
		});
	}
// 左侧菜单
var	menulf = function(){
	$(function(){
        var pmwidth=$(window).width();
        if(pmwidth > 1379){
            pmwidth=pmwidth-1374;
            pmwidth = pmwidth/2 +"px";
            $(".wrapforn").css({"left":pmwidth});
        }else{
            $(".wrapforn").css({"left":5+"px"});
        }
        var oldMethod = window.onscroll;
        if(typeof oldMethod == 'function'){
            window.onscroll = function(){
                oldMethod.call(this);
                if ($(document).scrollTop() > 100) {
                    $(".wrapforn").show();
                }
            }
        }
		var bdtal = (($("#bound").length > 0)?($("#bound").get(0).offsetHeight):0);		
		var contaih = $(".container").get(0).offsetHeight;
		var bmh = contaih;
		var enh = -290 - ($(document).scrollTop()-bmh)
		var gotn = 0- $(document).scrollTop();
		var mtall = $(".gds-wrap").get(0).offsetHeight + bdtal + $(".breadCrumb").get(0).offsetHeight+$("#header").get(0).offsetHeight;
		if ($(document).scrollTop() < 300) {
				$(".wrapforn").css({"top":300+"px"});
				$(".godwrap").css({"top":gotn+"px"});
			}
		else if ($(document).scrollTop() > 300 && $(document).scrollTop() < mtall ) {
				$(".godwrap").css({"top":'-'+290+"px"});
			}
		else if ($(document).scrollTop() > mtall && $(document).scrollTop() < bmh ) {
				$(".godwrap").css({"top":'-'+230+"px"});
			}
		else if ($(document).scrollTop() > bmh ) {
				$(".godwrap").css({"top":enh+"px"});
				$(".gds-menu").fadeOut();
			}
			if($(document).scrollTop() < bmh){
			$(".gds-menu").show();
			}
        var uls=$(".gdnavul");
        uls.eq(0).show();
        uls.eq(1).show();
        uls.eq(2).hide();
        uls.eq(3).hide();
        $(".gdnavli-tit").eq(2).on('click',function(){
            $(this).parent().find(".gdnavul").slideToggle();
            var ishide = $(this).next().is(":hidden");
            console.log(ishide);
            if (!ishide) {
                $(this).next().show();
                $(".gdnavli-tit").eq(3).next().hide();
            } else {
                $(this).next().hide();
                $(".gdnavli-tit").eq(3).next().show();
            }
        });
        $(".gdnavli-tit").eq(3).on('click',function(){
            $(this).parent().find(".gdnavul").slideToggle();
            var ishide = $(this).next().is(":hidden");
            if (!ishide) {
                $(this).next().show();
                $(".gdnavli-tit").eq(2).next().hide();
            } else {
                $(this).next().hide();
                $(".gdnavli-tit").eq(2).next().show();
            }
        });
	})
    $('.gdnavul li').each(function() {
        var a = $(this).find('a');
        var ahref = a.attr('href');
        if (ahref == 'http://dev.kela.cn'+location.pathname) {
            $(this).addClass('actt');
        }
    });
	window.onscroll = function(){
		var bdtal = (($("#bound").length > 0)?($("#bound").get(0).offsetHeight):0);
		var contaih2 = $(".container").get(0).offsetHeight;
		var bmh2 = contaih2-390;
		var got = 0- $(document).scrollTop();
		var gol = 5 - $(document).scrollLeft();
		var enh2 = -290 - ($(document).scrollTop()-bmh2)
		var mtall2 = $(".gds-wrap").get(0).offsetHeight+ bdtal +$(".breadCrumb").get(0).offsetHeight+$("#header").get(0).offsetHeight;
		$(".wrapforn").css({"top":300+"px"});
		if ($(document).scrollTop() < 300) {			
			$(".godwrap").css({"top":got+"px"});
		}
		else if($(document).scrollTop() > 300 && $(document).scrollTop() < mtall2){
            $(".godwrap").css({"top":'-'+35+"%"});
		}
		else if($(document).scrollTop() > mtall2 && $(document).scrollTop() < bmh2){
			$(".godwrap").css({"top":'-'+230+"px"});
			$(".gds-menu li").click(function(){
				if($(document).scrollTop() > mtall2) {window.scrollTo(0,mtall2)}
			});
		}
		else if ($(document).scrollTop() > bmh2 ) {
			$(".godwrap").css({"top":enh2+"px"});
			$(".gds-menu").fadeOut();
		}
		if($(document).scrollTop() < bmh2){
			$(".gds-menu").show();
		}

	}
}
// 商品详情菜单
var gdsmenu = function(){
	$(function(){
		var bdtal = (($("#bound").length > 0)?($("#bound").get(0).offsetHeight):0);
		var tall = $(".gds-wrap").get(0).offsetHeight+ bdtal +$(".breadCrumb").get(0).offsetHeight+$("#header").get(0).offsetHeight;
		var oldMethod = window.onscroll;
		if($(document).scrollTop() > tall){		        	
			$(".gds-menu").css({position:"fixed",top:"0",left:"0",right:"0",zIndex:"20"});
			$(".gds-menu").addClass("gdsshadow");
			$(".quickmn").show();
		}
		else{
			$(".gds-menu").css({position:"relative",top:"auto",zIndex:"2"})
			$(".gds-menu").removeClass("gdsshadow");
			$(".quickmn").hide();
		}
		if(typeof oldMethod == 'function'){
		    window.onscroll = function(){
		        oldMethod.call(this);
		        if($(document).scrollTop() > tall){		        	
					$(".gds-menu").css({position:"fixed",top:"0",left:"0",right:"0",zIndex:"20"});
					$(".gds-menu").addClass("gdsshadow");
					$(".quickmn").show();					
				}
				else{
					$(".gds-menu").css({position:"relative",top:"auto",zIndex:"2"})
					$(".gds-menu").removeClass("gdsshadow");
					$(".quickmn").hide();
				}				
		    }
		}		
	})

}
// 验证商品数量
var surnum = function(){
	$(function(){     
		
        $(".plus").click(function(){
        	var num = $('.strnum').attr('data-num');
            var stnum = parseInt($(".stornum").val());
            if( stnum > num-1 ){
                alert("购买数量已超过库存！")
            }
            else{
               stnum=stnum+1;
                $(".stornum").val(stnum);
            }
        })
        $(".cut").click(function(){
        	var num = $('.strnum').attr('data-num');
            var stnum = parseInt($(".stornum").val());
            if( stnum < 2 ){
               return false
            }
            else{
                stnum-="1";
                $(".stornum").val(stnum);
            }
        })
        $(".stornum").keyup(function(){
        	var num = $('.strnum').attr('data-num');
            var stnum = parseInt($(".stornum").val());
            if(stnum < 1){
              $(".stornum").val(1);
            }
            if(stnum > num){
              alert("您所填的商品数量已超过库存！")
              $(".stornum").val(num);
            }            
            else if(!stnum == ''){
              $(".stornum").val(stnum);
            }          
        })
        $(".stornum").blur(function(){
        	var num = $('.strnum').attr('data-num');
            var stnum = $(".stornum").val();
            if(stnum == null || stnum == ""){
              $(".stornum").val(1);
            }
        })
    })	
}
