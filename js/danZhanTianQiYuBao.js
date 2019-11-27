function danZhanTianQiYuBaoCon(){
    //tab
    $('#danZhanTianQiYuBaoCon .leftTab span').click(function(event) {
        $(this).addClass('orange').siblings().removeClass('orange');
        $('#danZhanTianQiYuBaoCon .main').hide();
        $('#danZhanTianQiYuBaoCon .main').eq($(this).index()).show();
    });

    //逐小时预报 今天
    // var num = 0; 
    // $('#danZhanTianQiYuBaoCon .conRight .arrowRightBtn').click(function(event) { //右侧btn
    //     $('#danZhanTianQiYuBaoCon .conRight .arrowLeftBtn').stop().fadeIn(100);
    //     if(num < 4){
    //        num++;
    //        var move = -150 * num;
    //        $('#CarouselUl').animate({'left':''+move+'px'},200);   
    //         if(num == 4){
    //             $(this).stop().fadeOut(100);
    //         }
           
    //     }
    // });

    // $('#danZhanTianQiYuBaoCon .conRight .arrowLeftBtn').click(function(event) { //左侧btn
    //     if(num > 0){
    //        num--;
    //        var move = -150 * num;
    //        $('#CarouselUl').animate({'left':''+move+'px'},200);   
    //        if(num == 0){
    //             $(this).stop().fadeOut(100);
    //         }else if(num == 3){
    //             $('#danZhanTianQiYuBaoCon .conRight .arrowRightBtn').stop().fadeIn(100);
    //         }
    //     }
    // });

    //4~7天
    // $('#danZhanTianQiYuBaoCon .confourDay .conRightfourDay .fourDayUl li').click(function(event) {
    //     $(this).addClass('currentBlue').siblings().removeClass('currentBlue');
    // });

   //del
   $('#danZhanTianQiYuBaoCon .popopDel').click(function(event) {
        $(this).parent().stop().fadeOut(200);
    });

};
