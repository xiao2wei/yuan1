define(function(require,exports) {
    //var $ = require('jquery');
    require('base.js?1');
    var dialog = require("dialog");
    exports.init = function () {
        this.beforeSubmit();
        //this.checkNickName();
        //this.checkAccount();
        this.checkaccount();
        this.sendMms();
        //this.refreshVCImg();
        //this.checkEmail();
        //this.reSendMms();
        this.submitToDoReg();
        this.checkPwdLevel();
        this.checkRePwd();
    },
/*
        exports.checkEmail = function()
        {
            $("input[name='email']").blur(function(){
                var email = $(this).val();
                var pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

                if(!pattern.test(email)){
                    $(".notice").html('邮箱格式不正确,请重新输入!');
                }else{
                    $.get('/index.php?m=User&c=AccountApi&a=checkEmail&email='+email,function(res){
                        $(".notice").html(res.msg);
                    }, 'json')
                }
            });

            $("input[name='email']").focus(function(){
                $(".notice").html('');
            })
        },
*/

        exports.beforeSubmit = function(){

            $(".send_mms").prop("disabled",true);
            $(".send_mms").css({"cursor":"not-allowed"});

            //不同意珂兰协议，则禁用注册按钮
            var agree = $("input[name='agreement']").prop('checked');
            if(!agree){
                $(".reg").prop('disabled',true);
                $(".reg").css({"cursor":"not-allowed"});
            }

            $("input[name='agreement']").click(function(){
                $("input[name='agreement']").prop('checked',!agree);
                agree = $("input[name='agreement']").prop('checked');
                //alert(agree);
                if(agree){
                    $(".reg").prop('disabled',false);
                    $(".reg").css({"cursor":"pointer"});
                }else{
                    $(".reg").prop('disabled',true);
                    $(".reg").css({"cursor":"not-allowed"});
                }
            })
        },
/*
        exports.checkNickName = function(){
            $(document).delegate("input[name='user_name']","blur",function(){
                var nickName = $.trim($(this).val());
                if(nickName == ''){
                    $('.nick_name').html('昵称不能为空!');
                }else{
                    $.get('/index.php?m=User&c=AccountApi&a=checkNickName&nickName='+nickName,function(res){
                        $('.nick_name').html(res.msg);
                    }, 'json')
                }
            })

            $("input[name='user_name']").focus(function(){
                $('.nick_name').html('');
            })
        },
*/
        /*exports.checkAccount = function(){
            $(document).delegate("input[name='email_phone']","blur",function(){

                var email_pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                //var phone_pattern = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
                //var phone_pattern = '#^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,6,7,8]{1}\d{8}$|^18[\d]{9}$#';
                var phone_pattern = /^1[3|4|5|7|8][0-9]{9}$/;
                var emailPhone = $.trim($(this).val());
                if(emailPhone == ''){
                    $('.email_phone').html('手机号不能为空!');

                }else if(!phone_pattern.test(emailPhone)){
                    $('.email_phone').html('请输入正确的手机号!');

                }else{
                    $.get('/index.php?m=User&c=AccountApi&a=checkEmailPhone&emailPhone='+emailPhone,function(res){
                        $('.email_phone').html(res.msg);

                       if(phone_pattern.test(emailPhone) && res.result === 1){
                           $(".send_mms").prop("disabled",false);
                           $(".send_mms").css({"cursor":"pointer"});
                            //$(".verify_container").hide();
                            //$("input[name='repassword']").after("<div class='mms'>手机验证码(必填):<input type='text' name='mms' /></div>");
                            $(".send_mms").css({"display":""});

                       }else{
                           $(".send_mms").prop("disabled",true);
                           $(".send_mms").css({"cursor":"not-allowed"});

                       }
                    }, 'json')
                }
            })

            $("input[name='email_phone']").focus(function(){
                $('.email_phone').html('');
                $('.resend_mms').css({"display":"none"});
                $(".verify_container").show();
            })
        },*/

        exports.checkaccount = function(){
            $(document).delegate("[name='email_phone']","blur",function(){
                var email_pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                var phone_pattern = /^1[3|4|5|7|8][0-9]{9}$/;
                var emailPhone = $.trim($(this).val());
                if(emailPhone == ''){
                    $('.email_phone').html('账号不能为空!');

                }else if(!phone_pattern.test(emailPhone) && !email_pattern.test(emailPhone)){
                    $('.email_phone').html('请输入正确的手机号或邮箱账号!');

                }else{
                    if(phone_pattern.test(emailPhone)){
                        //手机号注册
                        $(".x_code").show();
                        $(".mal_code").hide();
                        $.get('/index.php?m=User&c=AccountApi&a=checkEmailPhone&emailPhone='+emailPhone,function(res){
                            $('.email_phone').html(res.msg);

                            if(phone_pattern.test(emailPhone) && res.result === 1){
                                $(".send_mms").prop("disabled",false);
                                $(".send_mms").css({"cursor":"pointer"});
                                //$(".verify_container").hide();
                                //$("input[name='repassword']").after("<div class='mms'>手机验证码(必填):<input type='text' name='mms' /></div>");
                                $(".send_mms").css({"display":""});

                            }else{
                                $(".send_mms").prop("disabled",true);
                                $(".send_mms").css({"cursor":"not-allowed"});

                            }
                        }, 'json')
                    }else if(email_pattern.test(emailPhone)){
                        //邮箱注册
                        $(".x_code").hide();
                        $(".mal_code").show();
                        $.get('/index.php?m=User&c=AccountApi&a=checkEmail&email='+emailPhone,function(res){
                            //$(".e_notice").html(res.msg);
                            $('.email_phone').html(res.msg);
                            if(res.result === 0){
                                return false;
                            }
                        }, 'json')
                    }
                }
            })

            $("input[name='email_phone']").focus(function(){
                $(".x_code").show();
                $(".mal_code").hide();
                $('.email_phone').html('');
                $('.resend_mms').css({"display":"none"});
                $(".verify_container").show();
            })
        },

        exports.sendMms = function (){
            $(document).delegate(".send_mms", "click", function() {
                var vd = dialog({
                        okValue: "确定",
                        title: "为了安全，请输入图中字符(点击图片刷新)",
                        //content: "<img title='点击刷新' onclick='this.src = \"/user/accountApi/getVerify?\" + Math.random();' src='/user/accountApi/getVerify?" + Math.random() + "' style='margin-top:50px; float: left;cursor: pointer;' id='verify_code_img'><input type='text' name='verify_code' style='width: 55px; height: 30px; margin-top: 60px;'> ",
                        content: "<img title='点击刷新' onclick='this.src = \"/user/user/verify?\" + Math.random();' src='/user/user/verify?" + Math.random() + "' style='margin-top:50px; float: left;cursor: pointer;' id='verify_code_img'><input type='text' name='verify_code' style='width: 55px; height: 30px; margin-top: 60px;'> ",
                        skin:'general',  /*skin的样式有success 、error 、warning 、general   */
                        ok: function() {
                            var phone = $.trim($("input[name='email_phone']").val());
                            var code = $.trim($("input[name=verify_code]").val());

                            $.post('/index.php?m=User&c=AccountApi&a=sendVerifyCode', {
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
                    }
                    );
                vd.show();
            });
        },

        /*exports.reSendMms = function(){
            $(document).delegate('.resend_mms','click',function(){
                var phone = $.trim($("input[name='email_phone']").val());
                //alert(phone);
                $.get('/index.php?m=User&c=AccountApi&a=sendMms&phone='+phone+'&action=reSend',function(res){
                    if(res.result == 1){
                        showTip('验证码已发送!','success');
                        //$('.send_mms').html('验证码已发送!'+ res.msg);
                        $('.resend_mms').css({"display":""});
                    }else{
                        showTip('验证码发送失败,请重试!','error');
                    }
                }, 'json')

            })
        },*/


        exports.submitToDoReg = function(){
            $(document).delegate(".reg","click",function(){
                var email_pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                var phone_pattern = /^1[3|4|5|7|8][0-9]{9}$/;

                var m_id = $("[name='m_id']").val();
                var phone = $.trim($("[name='email_phone']").val());
                var pwd = $.trim($("[name='password']").val());
                var pwd_level = $("[name='pwd_level']").val();
                var re_pwd = $.trim($("[name='repassword']").val());
                var phone_verify = $.trim($("[name='mms']").val());
                var code = $.trim($("[name='code']").val());
                if(phone_pattern.test(phone)){
                    //手机注册
                    $.get('/index.php?m=User&c=AccountApi&a=doReg&m_id='+m_id+'&phone='+phone+'&pwd='+pwd+'&pwd_level='+pwd_level+'&re_pwd='+re_pwd+'&phone_verify='+phone_verify,function(res){
                        if(res.result === 0){
                            showTip(res.msg,'error')
                        }

                        if(res.result === 1){
                            window.location.href = '/home/index/index';
                        }
                    },'json')
                }else if(email_pattern.test(phone)){
                    //邮箱注册
                    $.get('/index.php?m=User&c=AccountApi&a=doEmailReg&email='+phone+'&pwd='+pwd+'&pwd_level='+pwd_level+'&re_pwd='+re_pwd+'&code='+code,function(res){
                        if(res.result === 0){
                            showTip(res.msg,'error')
                        }
                        if(res.result === 1){
                            //console.log(res.data);
                            //第三方记录表中成功插入邮箱注册数据（还不算真正意义上的注册成功），强制用户绑定手机号，跳转到绑定页面
                            //window.location.href = res.data;

                            document.write('已发送验证邮件，请尽快前往邮箱完成验证!正在跳转到商城首页......');
                            setTimeout(function(){
                                window.location.href = res.data;
                            },3000)
                        }
                    },'json')
                }
            });

            //回车键提交
            $(document).keyup(function(event){
                if(event.keyCode ==13){
                    $(".reg").trigger("click");
                }
            });
        },



        exports.checkPwdLevel = function(){
            $(document).delegate("input[name='password']","blur",function(){
                var pwd = $.trim($(this).val());
                /*var hz_pattern = /[u4e00-u9fa5]/;
                if(hz_pattern.test(pwd)){
                    $(".pwd_tips").html('密码不能为中文,由数字、字母、下划线和其他特殊字符组成!');
                    return;
                }*/
                if(pwd.length < 6 || pwd.length > 16){
                    $(".pwd_tips").html('密码长度应在6-16个字符范围内');
                    return;
                }
                var d_pattern =  /^\d+(\.{1}\d+)?$/;
                var w_pattern = /^[A-Za-z]+$/;
                var d_w_pattern = /^[A-Za-z0-9]+$/;

                if(d_pattern.test(pwd) || w_pattern.test(pwd) || d_w_pattern.test(pwd)){
                    var pwd_level = 'low';
                }else if(!d_pattern.test(pwd) && !w_pattern.test(pwd) && !d_w_pattern.test(pwd) && pwd.length > 9 && pwd.length < 14){
                    var pwd_level = 'middle';
                }else if(!d_pattern.test(pwd) && !w_pattern.test(pwd) && !d_w_pattern.test(pwd) && pwd.length > 13 && pwd.length < 17){
                    var pwd_level = 'high';
                }

                $("input[name='pwd_level']").val(pwd_level);

            })

            $("input[name='password']").focus(function(){
                $(".pwd_tips").html('');
                $("input[name='pwd_level']").val();
            })
        },

        //检查确认密码
        exports.checkRePwd = function(){
            $(document).delegate("#repassword","blur",function(){
                var pwd = $.trim($("#password").val());
                var re_pwd = $.trim($("#repassword").val());

                if(re_pwd == ''){
                    $(".re_pwd_tips").html('确认密码不能为空!');

                }else{
                    if(re_pwd !== pwd){
                        $(".re_pwd_tips").html('确认密码不正确!');

                    }
                }
                return true;
            })

            $("#repassword").focus(function(){
                $(".re_pwd_tips").html('');
            })
        },

        exports.refreshVCImg = function() {
            $(document).delegate("#verify_code_img", "click", function() {
                this.src = '/user/accountApi/getVerify';
            });
        }


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
        if(!timeout) {
            timeout = 2000;
        }
        setTimeout(function () {
            d.close().remove();
        }, timeout);
    }
})