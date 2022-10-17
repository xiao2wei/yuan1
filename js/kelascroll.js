
var kelascroll = {
// 首页轮播 S
scrollht:function(){
  homescroll = new Swiper('#homescroll',{
      pagination:'#homescroll .pagination',
      loop:true,
      paginationClickable:true,
      keyboardControl : false,
      simulateTouch : false,
      autoResize: true,
      autoplayDisableOnInteraction:false
    });
  setInterval("homescroll.swipeNext()",5000);
},

scrollh:function(){
  slidebox = new Swiper('.slide-box',{
      loop:true,
      slidesPerView: 3,
      spaceBetween: 4,
      keyboardControl : false,
      simulateTouch : false
    });
  setInterval("slidebox.swipeNext()",8000);
   $('.slide-left').on('click', function(e){
    e.preventDefault()
    slidebox.swipePrev()
    })
    $('.slide-right').on('click', function(e){
      e.preventDefault()
      slidebox.swipeNext()
    });
},
// 首页轮播 E
scroll1:function(){
// 商城首页轮播图 S
// 滑动1开始
    netscroll = new Swiper('.netscroll', {
        pagination:'.pagination',
        paginationClickable:true,
        loop:true,
        autoplayDisableOnInteraction:false,
        keyboardControl : false,
        simulateTouch : false
    });
    setInterval("netscroll.swipeNext()", 4000)
    // 滑动1结束
},
    //滑动2开始
  //   scroll2:function(){
  //   swiper = new Swiper('.swiper-container', {
  //       slidesPerView: 4,
  //       spaceBetween: 12,
  //       loop:true,
  //       swipeToNext : false
  //   });
  //   setInterval("swiper.swipeNext()",3000);
  //   $('.arrow-left').on('click', function(e){
  //   e.preventDefault()
  //   swiper.swipePrev()
  //   })
  //   $('.arrow-right').on('click', function(e){
  //     e.preventDefault()
  //     swiper.swipeNext()
  //   });
  // },
  //滑动2结束
  scroll3:function(){
    // 滑动3开始
    twoswiper = new Swiper('.sdrlbo', {
        loop:true,
        slidesPerView: 1,
        autoplayDisableOnInteraction:false
    });
    setInterval("twoswiper.swipeNext()", 3000);
      $('.sdrt-l').click(function(){
      twoswiper.swipePrev();
      })
      $('.sdrt-r').click(function(){
      twoswiper.swipeNext();
      })
      // 滑动3结束
    },
    // 商城首页轮播图 E
    scrollbr:function(){
    brandscroll = new Swiper('.brandscroll',{
        loop:true,
        slidesPerView:1,
        keyboardControl : false,
        simulateTouch : false
      });
    $('.brslide-left').on('click', function(e){
    e.preventDefault()
    brandscroll.swipePrev()
    })
    $('.brslide-right').on('click', function(e){
      e.preventDefault()
      brandscroll.swipeNext()
    });
  }
}
