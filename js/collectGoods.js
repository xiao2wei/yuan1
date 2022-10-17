define(function(require,exports) {
    require('base.js');
    var dialog = require("dialog");
    exports.init = function () {
        this.collect();
    },

    exports.collect = function(){
        $(document).delegate('.collect_btn','click',function(){
            var collect_type = $(this).attr('collect-type');
            var goods_id = $(this).attr('goods-id');
            var user_id = $(this).attr('user-id');
            var collect_num = $('.collect_num').text();

            //判断是否登录
            if (!checkLogin()) {
                showTip('您还没有登录,请先登录!','error');
                setTimeout(function(){
                    window.location.href = "ajax.php?m=user&c=user&a=login";
                },2000)
                return false;
            }

            $.get('ajax.php?m=Api&c=Goods&a=collectGoods&goodsId='+goods_id+'&userId='+user_id+'&type='+collect_type+'&collectNum='+collect_num,function(res){
                if(res.result === 'collected'){
                    showTip('您已收藏该商品,请勿重复操作!','warning');
                }else if(res.result === '1'){
                    var collect_num = parseInt($('.collect_num').text())+ 1;
                    if(isNaN(collect_num)) {
                        collect_num = 1;
                    }
                    $(".collect_num").text(collect_num);
                    showTip('收藏成功!','success');
                    //setTimeout(function(){
                    //    window.location.reload();
                    //},2000)
                }else{
                    showTip('收藏失败,请重新操作!','error');
                }
            }, 'json')
        })
    }


    function showTip(msg, skin,timeout, callback) {
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
        if(!timeout) {
            timeout = 2000;
        }
        setTimeout(function () {
            d.close().remove();
        }, timeout);
    }
})