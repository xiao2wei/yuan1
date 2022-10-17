define(function (require, exports) {
    require('base.js?1');
    var dialog = require("dialog");
    exports.init = function () {
        this.checkAccount();
        this.sendMms();
        this.reSendMms();
    };


    exports.checkAccount = function () {
        $(document).delegate("[name='email_phone']", "blur", function () {
            var cls = $(this).attr('class');

            var email_pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            var phone_pattern = /^1[3|4|5|7|8][0-9]{9}$/;
            var emailPhone = $.trim($(this).val());
            if (emailPhone == '') {
                //$('.email_phone').html('邮箱或手机号不能为空!');
                if(cls == 'phone_ipt bind_phone'){
                    $('.email_phone').html('手机号不能为空!');
                }else if(cls == 'phone_ipt find_pwd'){
                    $('.email_phone').html('邮箱或手机号不能为空!');
                }
                return false;
            }else if(!email_pattern.test(emailPhone) && !phone_pattern.test(emailPhone)){
                //$('.email_phone').html('请输入正确的邮箱或手机号!');
                if(cls == 'phone_ipt bind_phone'){
                    $('.email_phone').html('请输入正确的手机号!');
                }else if(cls == 'phone_ipt find_pwd'){
                    $('.email_phone').html('请输入正确的邮箱或手机号!');
                }
            //} else if (!phone_pattern.test(emailPhone)) {
                //$('.email_phone').html('手机号格式不正确!');*/
                return false;
            } else {

                /*如果是手机号并且可用,删除常规图片验证码框，在下方动态添加一个手机验证码输入框;显示“发送手机验证码”*/
                /*
                 if(phone_pattern.test(emailPhone)){
                 $("form .verify_container").hide();
                 //$(".verify_container").before("<div class='mms'>手机验证码(必填):<input type='text' name='mms' /></div>");
                 $(".send_mms").css({"display":""});
                 }
                 */

                //手机号码格式正确，验证该号码是否存在，若存在，用户点击下一步发送手机验证码，并进入验证码输入页面;若不存在，则提示用户该号码不存在
                /*$.get('ajax.php?m=User&c=AccountApi&a=checkUserPhone&phone='+emailPhone,function(res){
                 if(res.result == 1){
                 //用户存在，点击下一步发送手机验证码

                 }else{
                 $('.email_phone').html('该用户不存在!');
                 return false;
                 }
                 }, 'json')*/
            }
        })

        $("form input[name='email_phone']").focus(function () {
            $('.email_phone').html('');
            $(".send_mms").css({"display": "none"});
            $('.resend_mms').css({"display": "none"});
            $(".mms").remove();
            $("form .verify_container").show();
        })
    };

    exports.sendMms = function () {
        /*$(document).delegate('.send_mms', 'click', function () {
            var phone = $.trim($("form input[name='email_phone']").val());
            $.get('ajax.php?m=User&c=AccountApi&a=sendMms&phone=' + phone, function (res) {
                if (res.result == 1) {
                    showTip('验证码已发送!', 'success');
                    //$('.send_mms').html('验证码已发送!'+ res.msg);
                    //$('.resend_mms').css({"display":""});
                    $('.send_mms').hide();
                    $(".verify_container").before("<div class='tip'>珂兰钻石已向成功您发送验证码短信,请点击'下一步'进行验证</div>")
                } else {
                    showTip('验证码发送失败,请重试!', 'error');
                }
            }, 'json')
        });*/

        $(document).delegate(".resend_mms", "click", function() {

            var vd = dialog({
                okValue: "确定",
                title: "为了安全，请输入图片中字符(点击图片刷新)",
                /*content: "<img title='点击刷新' onclick='this.src = \"/user/accountApi/getVerify?\" + Math.random();' src='/user/accountApi/getVerify?" + Math.random() + "' style='margin-top:50px; float: left;cursor: pointer;' id='verify_code_img'><input type='text' name='verify_code' style='width: 55px; height: 30px; margin-top: 60px;'> ",*/
                content: "<img title='点击刷新' onclick='this.src = \"/user/user/verify?\" + Math.random();' src='/user/user/verify' style='margin-top:50px; float: left;cursor: pointer;' id='verify_code_img'><input type='text' name='verify_code' style='width: 55px; height: 30px; margin-top: 60px;'> ",
                skin:'general',  /*skin的样式有success 、error 、warning 、general   */
                ok: function() {
                    //var phone = $.trim($("input[name='email_phone']").val());
                    var phone = $.trim($("[name='user']").val());
                    var code = $.trim($("input[name=verify_code]").val());

                    $.post('ajax.php?m=User&c=AccountApi&a=sendVerifyCode', {
                        phone: phone,
                        v_code: code
                    }, function(res){
                        if(res.result == 1){
                            showTip('验证码已发送!','success');

                            var count = 120;
                            var t = setInterval(function(){
                                $(".send_mms").prop('disabled',true);
                                $('.send_mms').val(count + '秒后可重新发送');
                                count--;
                                if(count < 0){
                                    clearInterval(t);
                                    $('.send_mms').val('免费获取手机验证码');
                                    $(".send_mms").prop('disabled',false);
                                }
                            },1000);
                            vd.close();
                            /*$('.resend_mms').css({"display":""});*/
                        }else{
                            showTip(res.msg,'error');
                            if(res.result == -1) {
                                $('#verify_code_img').attr("src", "/user/accountApi/getVerify?" + Math.random());
                            }
                        }
                    }, 'json');
                }
            });
            vd.show();
        });

    };


    exports.reSendMms = function () {
        /*$(document).delegate('.resend_mms', 'click', function () {
            var phone = $.trim($("form input[name='user']").val());
            //alert(phone);
            $.get('ajax.php?m=User&c=AccountApi&a=sendMms&phone=' + phone, function (res) {
                if (res.result == 1) {
                    showTip('验证码已发送!', 'success');
                    $(".time_tips").show();
                    //$('.send_mms').html('验证码已发送!'+ res.msg);
                    var count = 120;
                    $(".resend_mms").prop('disabled', true);
                    var i = setInterval(function () {
                        $(".x_rp_n").html(count);
                        count--;
                        if (count < 0) {
                            $(".time_tips").hide();
                            $(".resend_mms").prop('disabled', false);
                            $(".resend_mms").mouseover(function () {
                                $(this).css({"cursor": "pointer"})
                            })
                            clearInterval(i);
                        }
                    }, 1000)
                } else {
                    showTip('验证码发送失败,请重试!', 'error');
                }
            }, 'json')

        })*/
    };

    function showTip(msg, skin, timeout, callback) {
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
            skin: skin  /*skin的样式有success 、error 、warning 、general   */
        });
        d.show();
        if (!timeout) {
            timeout = 2000;
        }
        setTimeout(function () {
            d.close().remove();
        }, timeout);
    }
})
