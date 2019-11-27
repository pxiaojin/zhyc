function ceZhanShiKuangCon(){
    //测站天气实况曲线弹出框
    $('#ceZhanShiKuangQuXianDiv').load('ceZhanShiKuangQuXian.html',function(){
        // dragPanelMove("#ceZhanShiKuangQuXianCon .top","#ceZhanShiKuangQuXianCon");
        ceZhanShiKuangQuXianCon();
    });
    // $("body").delegate("#ceZhanShiKuangCon .right li", "click", function () {
    //     $(this).addClass('current').siblings().removeClass('current');
    // });
     //测站天气实况弹出框
     $('#ceZhanShiKuangCon .popopDel').click(function(event) {
        // $(this).parent().stop().fadeOut(200);
        // $('#ceZhanShiKuangQuXianCon').stop().fadeOut(200);

        $(this).parent().hide();
        $('#ceZhanShiKuangQuXianCon').hide();
    });
    $('#stretchingABtn').click(function(event) {
         $(this).toggleClass('currentArrow');
         if($(this).hasClass('currentArrow')){
            $('#ceZhanShiKuangQuXianCon').stop().animate({'width': '0'},300,function(){
                $('#ceZhanShiKuangQuXianCon').children().hide();
            });   
         }else{
            $('#ceZhanShiKuangQuXianCon').children().show();   
            $('#ceZhanShiKuangQuXianCon').stop().animate({'width': '700px'},300);
         }
     });
}
