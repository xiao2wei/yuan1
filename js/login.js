define(function(require,exports) {
    //var $ = require('jquery');
    require('base.js?1');
    var dialog = require("dialog");
    exports.init = function () {
        this.login();
        this.kefu_login();
    };

    exports.login = function(){
        $(document).delegate("[name='login']","click",function(){
            var user = $("[name='user_name']").val();
            var pwd = $("[name='password']").val();

            $.get('ajax.php?m=User&c=AccountApi&a=doLogin&user='+user+'&pwd='+pwd,function(res){
                if(res.result === 0){
                    showTip(res.msg,'error')
                }
                else if(res.result === 1){
                    //登录成功
                    window.location.href = res.msg;
                }
                else if(res.result === 2){
                    //官网邮箱已注册，但未绑定手机号
                    showTip(res.msg,'general');
                    setTimeout(function(){
                        window.location.href = res.data;
                    },2000)

                }

            },'json');
        })


        //回车键提交
        $(document).keyup(function(event){
            if(event.keyCode ==13){
                $("[name='login']").trigger("click");
            }
        });
    };

    exports.kefu_login = function(){
        $(document).delegate("#kefu_login","click",function(){
            var user = $("[name='user_name']").val();
            var pwd = $("[name='password']").val();

            $.get('ajax.php?m=User&c=AccountApi&a=kefuLogin&user='+user+'&pwd='+pwd,function(res){
                if(res.result === 0){
                    showTip(res.msg,'error')
                }

                if(res.result === 1){
                    //登录成功
                    window.location.href = res.msg;
                }

            },'json');
        })


        //回车键提交
        $(document).keyup(function(event){
            if(event.keyCode ==13){
                $("[name='login']").trigger("click");
            }
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
                },
            ],
            title:' ',
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
