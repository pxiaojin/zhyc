function ceZhanShiKuangQuXianCon(){
    // $('#ceZhanShiKuangQuXianCon .rightTab span').click(function(event) {
    //     $(this).addClass('orange').siblings().removeClass('orange');
    // });
    $("body").delegate("#ceZhanShiKuangQuXianCon .rightTab span", "click", function () {
        $(this).addClass('orange').siblings().removeClass('orange');
    });
    //测站天气实况曲线弹出框
    $('#ceZhanShiKuangQuXianCon .popopDel').click(function(event) {
        // $(this).parent().stop().fadeOut(200);
        $(this).parent().hide();
    });
}
