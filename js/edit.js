define(function(require,exports){
    require('base.js');
    var dialog = require("dialog");
    exports.init = function () {
        this.checkData();
    },
    exports.checkData = function(){
        //验证支行信息(可以为空，只能填写汉字)
        $(document).delegate('[name="bank_branch"]','blur',function(){
            var bank_branch = $.trim($(this).val());
            //var zh_pattern = /^[\u4e00-\u9fa5]$/;
            //var zh_pattern = /^[\x7f-\xff]$/;
            var zh_pattern = /^[\u4E00-\u9FA5]+$/;
            /*if(bank_branch == ''){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='bank_branch_tips'>支行不能为空!</font>")
                return
            }*/
            if(bank_branch != '' && !zh_pattern.test(bank_branch)){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='bank_branch_tips'>支行只能为汉字!</font>")
                return
            }
        })

        $(document).delegate('[name="bank_branch"]','focus',function(){
            $(".bank_branch_tips").remove()
        })

        //验证银行卡号(可以为空，只能填写19位数字)
        $(document).delegate('[name="account_no"]','blur',function(){
            var account_no = $.trim($(this).val());
            var num_pattern = /^[0-9]{19}$/;
           /* if(account_no == ''){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='account_no_tips'>卡号不能为空!</font>")
                return
            }*/
            if(account_no != '' && !num_pattern.test(account_no)){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='account_no_tips'>只能为19位数字!</font>")
                return
            }
        })

        $(document).delegate('[name="account_no"]','focus',function(){
            $(".account_no_tips").remove()
        })

        //验证帐户姓名(可以为空，只能填写汉字)
        $(document).delegate('[name="account_name"]','blur',function(){
            var account_name = $.trim($(this).val());
            var zh_pattern = /^[\u4E00-\u9FA5]+$/;
            /*if(account_name == ''){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='account_name_tips'>姓名不能为空!</font>")
                return
            }*/
            if(account_name != '' && !zh_pattern.test(account_name)){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='account_name_tips'>只能为汉字!</font>")
                return
            }
        })

        $(document).delegate('[name="account_name"]','focus',function(){
            $(".account_name_tips").remove()
        })

        //验证座机(可以为空，若填写则必须是：0开头+2-3位数字+[-]+7-8位数字  或7-8位数字且不能以0开始)
        $(document).delegate('[name="user_tel"]','blur',function(){
            var user_tel = $.trim($(this).val());
            var tel_pattern = /^([0][1-9]{2,3}-)?[1-9]{7,8}$/;
            if(user_tel != '' && !tel_pattern.test(user_tel)){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='user_tel_tips'>格式不正确!</font>")
                return
            }
        })

        $(document).delegate('[name="user_tel"]','focus',function(){
            $(".user_tel_tips").remove()
        })

        //验证邮编(可以为空，若填写则必须是6位数字且不能以0开始)
        $(document).delegate('[name="zipcode"]','blur',function(){
            var zipcode = $.trim($(this).val());
            var zipcode_pattern = /^[1-9]\d{5}$/;

            if(zipcode != '' && !zipcode_pattern.test(zipcode)){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='zipcode_tips'>格式不正确!</font>")
                return
            }
        })

        $(document).delegate('[name="zipcode"]','focus',function(){
            $(".zipcode_tips").remove()
        })

        //验证QQ号(可以为空，若填写则必须是5-10位数字)
        $(document).delegate('[name="qq"]','blur',function(){
            var qq = $.trim($(this).val());
            var qq_pattern = /^[0-9]{5,10}$/;
            if(qq != '' && !qq_pattern.test(qq)){
                $(this).after("&nbsp;&nbsp;&nbsp;<font class='qq_tips'>格式不正确!</font>")
                return
            }
        })

        $(document).delegate('[name="qq"]','focus',function(){
            $(".qq_tips").remove()
        })
    }

    function showTip(msg,skin,timeout, callback) {
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
        if(!timeout) {
            timeout = 2000;
        }
        setTimeout(function () {
            d.close().remove();
        }, timeout);
    }
})

