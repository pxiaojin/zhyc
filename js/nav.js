$(function(){

    // 一级导航样式
    $('.leftMain').eq(0).show();
    $('.navOne .navOneList').click(function(event) {
        $(this).addClass('navOneCurrent').siblings().removeClass('navOneCurrent');
        $('.leftMain .mainBtn').parent().removeClass('current');
        $('.leftMain .erJiUl>li').removeClass('currenterJiBtn');
        $('.leftMain .erJiUl,.leftMain .rgbaDiv').stop().slideUp(50);
        $('.leftMain').hide();
        $('.leftMain').eq($(this).index()).show();
        $('#soilMapDiv,#climateresourceMapDiv').stop().fadeOut(200);
    });

    // 点击二级导航
    // $('.leftMain .mainBtn').click(function(event) {
    //     $(this).parent().addClass('current').siblings().removeClass('current');
    //     var index = $(this).next().children('li.currenterJiBtn').index();
    //     $('.erJiUl li').removeClass('currenterJiBtn');
    //     if(index != -1){
    //         $(this).next().children('li:eq('+index+')').addClass('currenterJiBtn');
    //     }      
    // });   


})