$(function(){

    //三级展示
    $('#leftMain .erJiUl li').on('mouseover',function(event) {
        $('#leftMain .sanJiUl').hide();
        var sanjiUl = $(this).children().next('.sanJiUl');
        $(sanjiUl).css('display','inline-block');
    });
    //三级展示
    $('#leftMain .erJiUl li').on('mouseout',function(event) {
        $('#leftMain .sanJiUl').hide();
    });

    //三级点击
    $('#leftMain .sanJiUl p').click(function(event) {
        $('.erJiUl>li').removeClass('currenterJiBtn'); 
        $(this).addClass('currentBlue').siblings().removeClass('currentBlue');
        $(this).parent().parent().siblings().removeClass('currenterJiBtn');
        $(this).parent().parent().addClass('currenterJiBtn');
        $(this).parent().hide();

    });
    $('#leftMain .erJiUl .erJiBtnOk').click(function(event) {
        $('.erJiUl>li').removeClass('currenterJiBtn'); 
        $(this).parent().addClass('currenterJiBtn');  
        $('#climateresourceMapDiv').hide();//统计数据查询-烟草气候资源图隐藏
    });

    //一级点击时 三级也收起
    $('#leftMain .mainBtn').click(function(event) {
       $('#leftMain .sanJiUl').hide();
       $('#weather_warning_select').hide();
    });

    // $('#leftMain .erJiBtn').parent().addClass('currenterJiBtn');

    $('#weather_warning_select').parent().on('mouseover',function(event) {
        $('#leftMain .sanJiUl').hide();
        $('#weather_warning_select').css('display','inline-block');
    });
    $('#weather_warning_select').parent().on('mouseout',function(event) {
        $('#weather_warning_select').hide();
    });
    // scroll高度
    function leftMainScrollDivH(){
        var win = $(window).height();
        var headerH = $('#headerDiv').outerHeight()
        var navOneH = $('.navOne').outerHeight()
        var timeAxisH = $('.timeAxis ').outerHeight()
        var scrollH = win - headerH - navOneH - timeAxisH -30;
        $('#leftMain .MainElement').height(scrollH);
    } 
    leftMainScrollDivH();
    $(window).resize(function(event) {
        leftMainScrollDivH();
    });
})