// 商城
var Mall = {

    initDiamond: function () {

        diamondSlider();

        tabSwitch(".hooter", ".hoot-title", ".hoot-content", ".l_box1");
    }
}
        /*
         * tab切换
         * box 父级
         * title 切换tiele ul>li结构
         * content 切换内容父级
         * label 切换内容索引
         */



var tabSwitch = function (box, title, content, label) {
    var box = $(box);
    var content = $(content);
    var title = $(title);
    box.each(function (i) {
        title.eq(i).find("li").click(function () {
            var key = $(this).index();
            title.eq(i).find("li").removeClass("active").eq(key).addClass("active");
            content.eq(i).find(label).hide().eq(key).show();
        });
    });
}

 var tabSlist = function (box, title, content, label) {
       var box = $(box);
       var content = $(content);
       var title = $(title);
      box.each(function (i) {
        title.eq(i).find("li").hover(function () {

            var key = $(this).index();
            title.eq(i).find("li").removeClass("active").eq(key).addClass("active");
            content.eq(i).find(label).hide().eq(key).show();
        });
    });
}   


