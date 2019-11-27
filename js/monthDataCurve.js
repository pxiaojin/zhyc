function monthDataCurveCon(){
    $('#monthDataCurveCon .rightTab span').click(function(event) {
        $(this).addClass('orange').siblings().removeClass('orange');
    });
    //统计数据查询-候旬月数据曲线框
    $('#monthDataCurveCon .popopDel').click(function(event) {
        $(this).parent().stop().fadeOut(200);
    });
}
