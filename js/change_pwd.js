define(function (require, exports) {
    //var $ = require('jquery');
    require('base.js?1');
    var dialog = require("dialog");
    exports.init = function () {
        this.checkOldPwd();//检查原始密码是否正确
        this.displayPwdLevel();//显示密码强度
        this.submitToDoChange();//提交到修改操作
    },

        exports.checkOldPwd = function () {
            $(document).delegate("[name='password']", "blur", function () {
                var old_pwd = $.trim($(this).val());
                if (old_pwd == '') {
                    $(".old_pwd_tips").html('原始密码不能为空!');
                    return;
                }

                //提交原始密码到api,验证是否正确
                $.get("/index.php?m=User&c=UserApi&a=checkOldPwd&old_pwd=" + old_pwd, function (res) {

                    if (res.result === 0) {
                        $(".old_pwd_tips").html("原始密码错误!");
                    }
                }, 'json');
            })

            $(document).delegate("[name='password']", "focus", function () {
                $(".old_pwd_tips").html('');
            })
        },

        exports.displayPwdLevel = function () {
            $(document).delegate("input[name='new_password']", "keyup", function () {
                var new_pwd = $.trim($(this).val());
                var pwd_level = getPwdLevel(new_pwd);
                $(".default").removeClass('weak-status');
                $(".default").removeClass('middle-tatus');
                $(".default").removeClass('strong-tatus');

                //新密码长度不在有效范围(6-16个字符)，新密码输入框边框变红
                if (new_pwd.length < 6 || new_pwd.length > 16) {
                    $(this).css({"border": "1px solid red"});
                } else {
                    $(this).css({"border": ""});
                }

                //获取到新密码等级后，显示对应的等级效果
                if (pwd_level == 'low') {
                    $(".default").addClass('weak-status');
                } else if (pwd_level == 'middle') {
                    $(".default").addClass('middle-tatus');
                } else if (pwd_level == 'high') {
                    $(".default").addClass('strong-tatus');
                }


            })

            $(document).delegate("input[name='new_password']", "blur", function () {
                var new_pwd = $.trim($(this).val());
                if (new_pwd.length > 16 || new_pwd.length < 6) {
                    $(".new_pwd_tips").html('密码长度在6-16个字符范围内!');
                    return false;
                }
            })

            $(document).delegate("input[name='new_password']", "focus", function () {
                $(".new_pwd_tips").html('');
            })
        },

        exports.submitToDoChange = function () {
            $(document).delegate(".chang_button", "click", function () {
                var old_pwd = $.trim($("[name='password']").val());
                var new_pwd = $.trim($("[name='new_password']").val());
                var re_new_pwd = $.trim($("[name='re_new_password']").val());

                //此处不传user_id到api,user_id在api中以UserService::getUid()方式获取
                $.get("/index.php?m=User&c=UserApi&a=doChangePwd&old_pwd=" + old_pwd + "&new_pwd=" + new_pwd + "&re_new_pwd=" + re_new_pwd, function (res) {
                    if (res.result === 0) {
                        showTip(res.msg, 'error');
                    }
                    if (res.result === 1) {
                        showTip('修改成功!','success')
                        setTimeout(function(){
                            window.location.href = res.data;
                        },1000)
                    }
                }, 'json');
            })
        }


    function getPwdLevel(pwd) {
       /* var zh_pattern = /^[\u4e00-\u9fa5]+$/;
         if(zh_pattern.test(pwd)){
         return false;
         }*/
        if (pwd.length < 6 || pwd.length > 16) {
            //$(".pwd_tips").html('密码长度应在6-16个字符范围内');
            return false;
        }
       /* var d_pattern = /^\d+(\.{1}\d+)?$/;
        var w_pattern = /^[A-Za-z]+$/;
        var d_w_pattern = /^[A-Za-z0-9]+$/;



        if (d_pattern.test(pwd) || w_pattern.test(pwd) || d_w_pattern.test(pwd)) {
            var pwd_level = 'low';
        } else if (!d_pattern.test(pwd) && !w_pattern.test(pwd) && !d_w_pattern.test(pwd) && pwd.length > 9 && pwd.length < 14) {
            var pwd_level = 'middle';
        } else if (!d_pattern.test(pwd) && !w_pattern.test(pwd) && !d_w_pattern.test(pwd) && pwd.length > 13 && pwd.length < 17) {
            var pwd_level = 'high';
        }

        return pwd_level;*/


        var pattern1 = /^[a-z0-9]+$/;
        var pattern2 = /^[A-Za-z0-9]+$/;

        if(pattern1.test(pwd) && pwd.length > 5 && pwd.length < 17){
            //纯数字、纯小写字母、小写字母+数字组合，且长度6-16，均为低级
            var pwd_level = 'low';
        }
        if(!pattern1.test(pwd) && pattern2.test(pwd) && pwd.length > 5 && pwd.length < 10){
            //数字、大小写字母且长度6-9,低级
            var pwd_level = 'low';
        }
        if(!pattern1.test(pwd) && pattern2.test(pwd) && pwd.length > 9 && pwd.length <17){
            //数字、大小写字母且长度为10-16位，中级
            var pwd_level = 'middle';
        }
        if(!pattern1.test(pwd) && !pattern2.test(pwd) && pwd.length > 5 && pwd.length < 10){
            //有特殊字符，且长度6-9，中级
            var pwd_level = 'middle';
        }
        if(!pattern1.test(pwd) && !pattern2.test(pwd) && pwd.length > 9 && pwd.length < 17 ){
            //有特殊字符，且长度10-16，高级
            var pwd_level = 'high';
        }

       /* if(!pattern.test(pwd) && pwd.length >5 && pwd.length <14 ){
            //数字、字母、特殊字符组合且长度6-13位，等级为中级
            var pwd_level = 'middle';
        }
        if(!pattern.test(pwd) && pwd.length >13 && pwd.length <17 ){
            //数字、字母、特殊字符组合且长度14-16位，等级为高级
            var pwd_level = 'high';
        }*/

        return pwd_level;
    }


    function showTip(msg, skin, timeout, callback) {

        //var dialog = require("dialog/dialog");
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
            skin: skin
            /*skin的样式有success 、error 、warning 、general   */

        });
        d.show();
        if (!timeout) {
            timeout = 2000;
        }
        setTimeout(function () {
            d.close().remove();
        }, timeout);
    }
});


