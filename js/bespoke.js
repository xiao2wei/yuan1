(function(window) {
    // KelaBespokeFunc.bespokeDatatime(selector, datetime)
    function setDatatime(obj, datetime) {
        datetime = typeof datetime== 'undefined' ? '2015-12-31' : datetime;
        $.post("ajax.php",{},function(data){
            // 返回一个当前时间 ' 2015-05-25 ' 目的:只能选择当前时间之后的日期
            var params = {lang:'ch',timepicker:false,format:'Y-m-d',formatDate:'Y-m-d',minDate:data,maxDate:datetime,validateOnBlur:false};
            $(obj).find('input[name="bes_time"]').datetimepicker(params);
        },"json");      
    }

    // 设置体验店 下拉选择列表, KelaBespokeFunc.setShopOptions('#footshoplist')
    function setShopOptions(obj) {
        var besurl = 'ajax.php';
        $.getJSON(besurl, function(data) {
            var shopId = data.shopId;
            var list = data.list;
            $.each(list, function(idx, shop){
                if (shop.id==shopId) {
                    $(obj).append('<option value=' + shop.id + ' selected="selected" >' + shop.name + '</option>');
                } else {
                    $(obj).append('<option value=' + shop.id + ' >' + shop.name + '</option>');
                }
            });
        });

    }
    // 手机验证
    function isMobile(strMobile){ var patternMobile = /^1\d{10}$/; if(patternMobile.test(strMobile)){ return true;} else{return false;}}
    function sureph(){
        $(".bes_phone").blur(function(){ 
        if(this.value == '' || this.value == '您的手机号码(必填)' || this.value == '手机号码' ){ return false; }
        if(!isMobile(this.value)){alert("手机号码格式不正确！"); return false;}
        })   
    }           
    // 预约提交，回调：除了消息提示外的其他操作
    function saveBespoke(obj, callback){
        var bes_name = $(obj).find('.bes_name').val();
        var bes_phone = $(obj).find('.bes_phone').val();
        var bes_time = $(obj).find('.bes_time').val();
        var bes_shop = $(obj).find('.bes_shop').val();
        if(bes_name == '' || bes_name == '您的姓名'){alert('请输入您的姓名！');return false;}
        if(bes_phone == '' || bes_phone == '手机号码'){alert('请填写您的手机号！');return false;}
        else if(!isMobile(bes_phone)){alert("手机号码格式不正确！");return false;}
        if(bes_time == '' || bes_time == '选择到店时间'){alert('预约时间不能为空！');return false;}
        if($(obj).find('.bes_shop').length>0 && (bes_shop == '' || bes_shop == '选择预约体验店')){
            alert('请选择您要预约的店面！');
            return false;
        }

        if (bes_shop==83 || bes_shop==38) {
            // 默认异业
            $(obj).find("[name='bes_remark']").val('[珂兰主钻]');
            $('.wedding_veil :radio').eq(0).attr('checked', true);
            // 选择异业
            $('.wedding_veil li').on('click', function(){
                var bes_veil=$(this).find("input[name=flag]:checked").val();
                $(obj).find("input:hidden[name='bes_remark']").val(bes_veil);
            });
            // 异业提交
            $(".wedding_veil button").on('click', function() {
                KelaBespokeFunc.addBespoke(obj);
            });
			// 显示选择异业框
            $(".wedding_veil").show();

        } else {
            $(obj).find("input:hidden[name='bes_remark']").val('');
            this.addBespoke(obj, callback);
        }
    }    
    // 直接保存，回调：除了消息提示外的其他操作 KelaBespokeFunc.addBespoke();
    function addBespoke(obj, callback) {
        var bes_name = $(obj).find('.bes_name').val();
        var bes_phone = $(obj).find('.bes_phone').val();
        var bes_time = $(obj).find('.bes_time').val();
        var bes_shop = $(obj).find('.bes_shop').val();
        var bes_remark = $(obj).find('.bes_remark').val();

        var besurl = '/api/bespoke/save_bespoke';
        var data = {
            bespoke_man: bes_name,
            mobile: bes_phone,
            department: bes_shop,
            shop_time: bes_time,
            bespoke_remark: bes_remark,
            referer_url: encodeURIComponent(window.location.href),
            from_ad: '000000260000'
        };
        $.getJSON(besurl, data, function(rsps) {
            if (rsps.result == 1) {
                alert(rsps.msg);
                $('.tabox').fadeOut();
                $('.wedding_veil').fadeOut();
            } else {
                var msg = rsps.msg ? rsps.msg : '抱歉：(预约失败)';
                alert(msg);
            }
            if(typeof(rsps) === 'function') {
            callback(rsps)
            }
        });
    }
    window.KelaBespokeFunc = {
        setShopOptions: setShopOptions,
        setDatatime: setDatatime ,
        saveBespoke: saveBespoke,
        addBespoke: addBespoke,
        sureph: sureph
    };

})(typeof window !== 'undefined' ? window : this);
