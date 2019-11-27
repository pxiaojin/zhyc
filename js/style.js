$(function(){
    
     
    //统计数据查询-烟草气候资源图
     $('#climateresourceMapOneLi').click(function(event) {
         $(this).addClass('currenterJiBtn');
     });
     $('#climateresourceMapA').click(function(event) {       
        $('#climateresourceMapConScrollUl').empty();
        for(var i = 0; i < 16; i++){
            var imgSrc;
            if(i == 0){
                imgSrc = 'img/resource_map/zyyc.jpg';
            }else{
                imgSrc = 'img/resource_map/zyyc'+i+'.jpg';
            }
            var liHtml = '<li class="climateresourceMapLi ">'+
                            '<img src="'+imgSrc+'"  width="100%" alt="" />'+
                         '</li>';
            $('#climateresourceMapConScrollUl').append(liHtml);
        }
    });
    $('#climateresourceMap li').click(function(event) {
        $('#soilMapDiv').stop().fadeOut(200);
        $('#climateresourceMapDiv').stop().fadeIn(200);
        var indexLi = $(this).index();
        // console.log(indexLi);
        var top = $('#climateresourceMapConScrollUl li').eq(indexLi).offset().top- 150;
        // console.log(top);
        var nowScrollTop = $('#climateresourceMapScrollCon').scrollTop();
        $('#climateresourceMapScrollCon').stop().animate({"scrollTop":top+nowScrollTop},50);
    });
    //统计数据查询-烟草气候资源图 
    $('#climateresourceMapScrollCon').scroll(function(event) {

         var thisTop = $('#climateresourceMapScrollCon').scrollTop();
         var num = 713;
         var num2 = 150;

         if(thisTop >= num*15 -num2){
             myFn(15);
         }else if(thisTop >= num*14-num2){
             myFn(14);
         }else if(thisTop >= num*13-num2){
             myFn(13);
         }else if(thisTop >= num*12-num2){
             myFn(12);
         }else if(thisTop >= num*11-num2){
             myFn(11);
         }else if(thisTop >= num*10-num2){
             myFn(10);
         }else if(thisTop >= num*9-num2){
             myFn(9);
         }else if(thisTop >= num*8-num2){
             myFn(8);
         }else if(thisTop >= num*7-num2){
             myFn(7);
         }else if(thisTop >= num*6-num2){
             myFn(6);
         }else if(thisTop >= num*5-num2){
             myFn(5);
         }else if(thisTop >= num*4-num2){
             myFn(4);
         }else if(thisTop >= num*3-num2){
             myFn(3);
         }else if(thisTop >= num*2-num2){
             myFn(2);
         }else if(thisTop >= num-num2){
            myFn(1);
         }else if(thisTop < num){
            myFn(0);
         }

     });

     function myFn(par1){
        $('#climateresourceMap li').eq(par1).addClass('currenterJiBtn').siblings().removeClass('currenterJiBtn');
     }

     //统计数据查询-烟草气候资源图
    $('#climateresourceMapCon .popopDel').click(function(event) {
        $('#climateresourceMapDiv').stop().fadeOut(200);
         $('.leftMain .erJiUl li').removeClass('currenterJiBtn');
    });




     $('#soilMapOneLi').click(function(event) {
         $(this).addClass('currenterJiBtn');
     });
     $('#soilMapA').click(function(event) {       
        $('#soilMapConScrollUl').empty();
        for(var i = 0; i < 16; i++){
            var imgSrc = 'img/soil/soil'+(i+1)+'.jpg';
            var liHtml = '<li class="soilMapLi ">'+
                            '<img src="'+imgSrc+'"  width="100%" alt="" />'+
                         '</li>';
            $('#soilMapConScrollUl').append(liHtml);
        }
    });
    //遵义市植烟土壤精细化分区
    $('#soilMap li').click(function(event) {
        $('#climateresourceMapDiv').stop().fadeOut(200);
        $('#soilMapDiv').stop().fadeIn(200);
        var indexLi = $(this).index();
        // console.log(indexLi);
        var top = $('#soilMapConScrollUl li').eq(indexLi).offset().top- 150;
        // console.log(top);
        var nowScrollTop = $('#soilMapScrollCon').scrollTop();
        $('#soilMapScrollCon').stop().animate({"scrollTop":top+nowScrollTop},50);
    });
    //遵义市植烟土壤精细化分区 
     $('#soilMapScrollCon').scroll(function(event) {

         var thisTop = $('#soilMapScrollCon').scrollTop();
         var num = 713;
         var num2 = 150;

         if(thisTop >= num*18 -num2){
             myFn2(18);
         }else if(thisTop >= num*17-num2){
             myFn2(17);
         }else if(thisTop >= num*16-num2){
             myFn2(16);
         }else if(thisTop >= num*15-num2){
             myFn2(15);
         }else if(thisTop >= num*14-num2){
             myFn2(14);
         }else if(thisTop >= num*13-num2){
             myFn2(13);
         }else if(thisTop >= num*12-num2){
             myFn2(12);
         }else if(thisTop >= num*11-num2){
             myFn2(11);
         }else if(thisTop >= num*10-num2){
             myFn2(10);
         }else if(thisTop >= num*9-num2){
             myFn2(9);
         }else if(thisTop >= num*8-num2){
             myFn2(8);
         }else if(thisTop >= num*7-num2){
             myFn2(7);
         }else if(thisTop >= num*6-num2){
             myFn2(6);
         }else if(thisTop >= num*5-num2){
             myFn2(5);
         }else if(thisTop >= num*4-num2){
             myFn2(4);
         }else if(thisTop >= num*3-num2){
             myFn2(3);
         }else if(thisTop >= num*2-num2){
             myFn2(2);
         }else if(thisTop >= num-num2){
            myFn2(1);
         }else if(thisTop < num){
            myFn2(0);
         }

     });

     function myFn2(par1){
        $('#soilMap li').eq(par1).addClass('currenterJiBtn').siblings().removeClass('currenterJiBtn');
     }

     //遵义市植烟土壤精细化分区
    $('#soilMapCon .popopDel').click(function(event) {
        $('#soilMapDiv').stop().fadeOut(200);
         $('.leftMain .erJiUl li').removeClass('currenterJiBtn');
    });

    // 地图要素浮动框 要素切换
    $('#floatMapDiv1 .floatMapDivTab,#floatMapDiv2 .floatMapDivTab,#floatMapDiv3 .floatMapDivTab,#floatMapDiv4 .floatMapDivTab,#floatMapDiv5 .floatMapDivTab,#floatMapDiv6 .floatMapDivTab,#floatMapDiv7 .floatMapDivTab').click(function(event) {
        $(this).addClass('currentOrange').siblings().removeClass('currentOrange');
    });



})
