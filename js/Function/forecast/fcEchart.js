define(['lib/echarts', 'Controller/DataFormat'], function(echarts, format) {
    var num=0;
    function showFc(value){
        getData(value.code);  //预报
        realDay(value.code,value.name);  //实况当天数据
    }
    var myChart;
    function getData(code){
        var param = {
            station: code,
            // day: '17'
            day: XHW.time.day
        }

        //逐小时预报
        var dataAr = {};
        XHW.C.http.get(XHW.C.http.baseUrl, '/forcastHour', param, function(json){
            var data = json.data;
            var keyAr = [];
            dataAr= {
                oDay:[],
                tDay:[],
                hDay:[],
                fDay:[],
                vDay:[],
                sDay:[],
                eDay:[]
            };
            if(data == {}){
                return;
            }
            for(var key in data){
                keyAr.push(key);
            }
            //  对时间key值进行排序
            keyAr.sort((a,b) => {
                return a > b ? 1 : -1;
            })

            for(let i = 0; i < keyAr.length; i++){
                let hourParam = keyAr[i].split(' ')[1].substring(0,2);
                if(i <= 23){  // 当天
                    dataAr.oDay.push([data[keyAr[i]],hourParam]);
                }else if(i <= 47){ //第二天
                    dataAr.tDay.push([data[keyAr[i]],hourParam]);
                }else if(i <= 71){ //第三天
                    dataAr.hDay.push([data[keyAr[i]],hourParam]);
                }else if(i <= 79){ //第四天
                    dataAr.fDay.push([data[keyAr[i]],hourParam]);
                }else if(i <= 87){ //第五天
                    dataAr.vDay.push([data[keyAr[i]],hourParam]);
                }else if(i <= 95){ //第六天
                    dataAr.sDay.push([data[keyAr[i]],hourParam]);
                }else if(i <= 103){ //第七天
                    dataAr.eDay.push([data[keyAr[i]],hourParam]);
                }else{                  //七到十五天
                    
                }
            }

            hourFc(dataAr.oDay);  //当天逐小时预报
            $('.mCSB_container').width('1968px');
            $('#seven_day_list').width('1968px');
            $('#seven_day_echart').width('1968px');
            hourFcList(dataAr.oDay);  //7天预报中逐小时预报

            $('#sevTit').html('逐小时预报');
            $('#sunset_sev').html('今日日落:'+ format.sun(dataSeDay[0]['SUNSET']));
            $('#sunup_sev').html('明日日出:'+ format.sun(dataSeDay[0]['SUNUP']));
            $('#sunset_day').html('今日日落:'+ format.sun(dataSeDay[0]['SUNSET']));
            $('#sunup_day').html('明日日出:'+ format.sun(dataSeDay[0]['SUNUP']));
            
            $("body").delegate("#danZhanTianQiYuBaoCon #four_seven_day li", "click", function (e) {
                e.stopPropagation();  //  阻止冒泡
                $(this).addClass('currentBlue').siblings().removeClass('currentBlue');
                var index = $(this).index();
                switch(index){
                    case 0:
                        $('.mCSB_container').width('1968px');
                        $('#seven_day_list').width('1968px');
                        $('#seven_day_echart').width('1968px');
                        $('#sevTit').html('逐小时预报');
                        $('#sunset_sev').html('今日日落:'+ format.sun(dataSeDay[0]['SUNSET']));
                        $('#sunup_sev').html('明日日出:'+ format.sun(dataSeDay[0]['SUNUP']));
                        hourFcList(dataAr.oDay);
                    break;
                    case 1:
                        $('.mCSB_container').width('1968px');
                        $('#seven_day_list').width('1968px');
                        $('#seven_day_echart').width('1968px');
                        $('#sevTit').html('逐小时预报');
                        $('#sunset_sev').html('今日日落:'+ format.sun(dataSeDay[1]['SUNSET']));
                        $('#sunup_sev').html('明日日出:'+ format.sun(dataSeDay[1]['SUNUP']));
                        hourFcList(dataAr.tDay);
                    break;
                    case 2:
                        $('.mCSB_container').width('1968px');
                        $('#seven_day_list').width('1968px');
                        $('#seven_day_echart').width('1968px');
                        $('#sevTit').html('逐小时预报');
                        $('#sunset_sev').html('今日日落:'+ format.sun(dataSeDay[2]['SUNSET']));
                        $('#sunup_sev').html('明日日出:'+ format.sun(dataSeDay[2]['SUNUP']));
                        hourFcList(dataAr.hDay);
                    break;
                    case 3:
                        $('.mCSB_container').width('660px');
                        $('#seven_day_list').width('660px');
                        $('#seven_day_echart').width('660px');
                        $('#sevTit').html('逐3小时预报');
                        $('#sunset_sev').html('今日日落:'+ format.sun(dataSeDay[3]['SUNSET']));
                        $('#sunup_sev').html('明日日出:'+ format.sun(dataSeDay[3]['SUNUP']));
                        hourFcList(dataAr.fDay);
                    break;
                    case 4:
                        $('.mCSB_container').width('660px');
                        $('#seven_day_list').width('660px');
                        $('#seven_day_echart').width('660px');
                        $('#sevTit').html('逐3小时预报');
                        $('#sunset_sev').html('今日日落:'+ format.sun(dataSeDay[4]['SUNSET']));
                        $('#sunup_sev').html('明日日出:'+ format.sun(dataSeDay[4]['SUNUP']));
                        hourFcList(dataAr.vDay);
                    break;
                    case 5:
                        $('.mCSB_container').width('660px');
                        $('#seven_day_list').width('660px');
                        $('#seven_day_echart').width('660px');
                        $('#sevTit').html('逐3小时预报');
                        $('#sunset_sev').html('今日日落:'+ format.sun(dataSeDay[5]['SUNSET']));
                        $('#sunup_sev').html('明日日出:'+ format.sun(dataSeDay[5]['SUNUP']));
                        hourFcList(dataAr.sDay);
                    break;
                    case 6:
                        $('.mCSB_container').width('660px');
                        $('#seven_day_list').width('660px');
                        $('#seven_day_echart').width('660px');
                        $('#sevTit').html('逐3小时预报');
                        $('#sunset_sev').html('今日日落:'+ format.sun(dataSeDay[6]['SUNSET']));
                        $('#sunup_sev').html('明日日出:'+ format.sun(dataSeDay[6]['SUNUP']));
                        hourFcList(dataAr.eDay);
                    break;
                }
            });
        },function(){
            $('#fcEchart').html('暂无数据');
            $('#CarouselUl .b img').attr('src','');
            $('#CarouselUl .c, #CarouselUl .d').empty();

            $('#seven_day_echart').html('暂无数据');
            $('#seven_day_list .b img').attr('src','');
            $('#seven_day_list .c, #seven_day_list .d').empty();
        })

        //日预报
        var dataSeDay = [];
        var dataFifDay = [];
        var timeSeAr = [];
        var timeFiAr = [];
        XHW.C.http.get(XHW.C.http.baseUrl, '/forcastDay', param, function(json){
            var data = json.data;
            var keyAr = [];           
            if(data == {}){
                return;
            }
            for(var key in data){
                keyAr.push(key);
            }
            //  对时间key值进行排序
            keyAr.sort((a,b) => {
                return a > b ? 1 : -1;
            })

            $('#four_seven_day').empty();
            $('#fifUl').empty();
            for(let i = 0; i < keyAr.length; i++){
                let dayParam = keyAr[i].split('-')[2].substring(0,2);

                var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
                var weekDay = keyAr[i].split(' ')[0];
                weekDay = new Date(weekDay).getDay();
                weekDay = weekArray[weekDay];
                var firLi = '';
                var beforeWd = Number(data[keyAr[i]]['WD_BEFORE'])+180;
                var afterWd = Number(data[keyAr[i]]['WD_AFTER'])+180;
                var wdBeforeImg = '<img src="img/windEI.png" class="fengXiang" style="display:inline-block;height:18px;padding-right:5px;-webkit-transform:rotate(' + beforeWd + 
                'deg);-o-transform:rotate(' + beforeWd + 'deg);-ms-transform:rotate(' + beforeWd + 'deg);-moz-transform:rotate(' + beforeWd + 'deg);"/>';
                var wdAfterImg = '<img src="img/windEI.png" class="fengXiang" style="display:inline-block;height:18px;-webkit-transform:rotate(' + afterWd + 
                'deg);-o-transform:rotate(' + afterWd + 'deg);-ms-transform:rotate(' + afterWd + 'deg);-moz-transform:rotate(' + afterWd + 'deg);"/>';
                if(i<7){
                    dataSeDay.push(data[keyAr[i]]);
                    timeSeAr.push(dayParam);  

                    switch(i){
                        case 0: weekDay = '今天';
                        break;
                        case 1: weekDay = '明天';
                        break;
                        case 2: weekDay = '后天';
                        break;
                    }
                    if(i == 0){
                        firLi = '<li class="currentBlue">';
                    }else{
                        firLi = '<li>';
                    }            
                    var carouseLi = firLi+
                                '<span class="a">'+ dayParam +'日</span>'+
                                '<span class="g">'+ weekDay +'</span>'+
                                '<span class="b"><img src="img/lineWeatherS/cww'+data[keyAr[i]]['PHEN_BEFORE']+'.png" width="30" alt="" /></span>'+
                                '<span class="b"><img src="img/lineWeatherS/cww'+data[keyAr[i]]['PHEN_AFTER']+'.png" width="30" alt="" /></span>'+
                                '<span class="c">'+ data[keyAr[i]]['PHEN'] +'</span>'+
                                '<div class="curve"></div>'+
                                '<span class="f">'+wdBeforeImg+wdAfterImg+'</span>'+
                                '<span class="d">'+data[keyAr[i]]['WS']+'</span>'+
                            '</li>';
                    $('#four_seven_day').append(carouseLi);
                }else{
                    dataFifDay.push(data[keyAr[i]]);
                    timeFiAr.push(dayParam);

                    var fifLi = '<li>'+
                                '<span class="a">'+ dayParam +'日</span>'+
                                '<span class="g">'+ weekDay +'</span>'+
                                '<span class="b"><img src="img/lineWeatherS/cww'+data[keyAr[i]]['PHEN_BEFORE']+'.png" width="30" alt="" /></span>'+
                                '<span class="b"><img src="img/lineWeatherS/cww'+data[keyAr[i]]['PHEN_AFTER']+'.png" width="30" alt="" /></span>'+
                                '<span class="c">'+ data[keyAr[i]]['PHEN'] +'</span>'+
                                '<div class="curve"></div>'+
                                '<span class="f">'+wdBeforeImg+wdAfterImg+'</span>'+
                                '<span class="d">'+data[keyAr[i]]['WS']+'</span>'+
                            '</li>';
                    $('#fifUl').append(fifLi);
                }               
            }

            drawDay(dataSeDay,timeSeAr,'se_echart');
            drawDay(dataFifDay,timeFiAr,'fif_echart');
        },function(){
            $('#se_echart').html('暂无数据');
            $('#four_seven_day li .b img').attr('src','');
            $('#four_seven_day li .c, #four_seven_day li .f, #four_seven_day li .d').empty();
            $('#fif_echart').html('暂无数据');
            $('#fifUl li .b img').attr('src','');
            $('#fifUl li .c, #fifUl li .f, #fifUl li .d').empty();
        })
    }

    function drawDay(data,time,elem){
        var maxtt_ar = [];
        var mintt_ar = [];
        for(var i = 0; i < data.length; i++){
            maxtt_ar.push(data[i]['TMAX']);
            mintt_ar.push(data[i]['TMIN']);
        }
        drawFcDayEchart(maxtt_ar,mintt_ar,time,elem);
    }

    function hourFc(data){      //  逐小时预报
        $('#CarouselUl').empty();
        var timeAr = [];
        var ttAr = [];
        for(let i = 0; i < data.length; i++){
            var wea = data[i][0].PHEN;
            var ws = data[i][0].WS;
            var wd = data[i][0].WD;
            var tt = data[i][0].TAVG;
            var time = data[i][1];
            timeAr.push(time);
            ttAr.push(tt);
            var carouseLi = '<li>'+
                                '<span class="a">'+ time +'时</span>'+
                                '<span class="b"><img src="img/hourWea_icon/cww'+wea+'.png" width="30" alt="" /></span>'+
                                '<div class="curve"></div>'+
                                '<span class="c">'+format.setWd(wd)+'</span>'+
                                '<span class="d">'+ws+'</span>'+
                            '</li>';
            $('#CarouselUl').append(carouseLi);
        }
        var firAr = ttAr.slice(num, num+13);
        timeAr = timeAr.slice(num, num+13);
        drawFcEchart(firAr,timeAr,'fcEchart','white');
        // $('#danZhanTianQiYuBaoCon .conRight .arrowRightBtn').unbind('click');       
        $('#danZhanTianQiYuBaoCon .conRight .arrowRightBtn').off('click').on('click', function(event) { //右侧btn
            next(ttAr,timeAr);
        });
        // $('#danZhanTianQiYuBaoCon .conRight .arrowLeftBtn').unbind('click');
        $('#danZhanTianQiYuBaoCon .conRight .arrowLeftBtn').off('click').on('click', function(event) { //左侧btn
            pre(ttAr,timeAr);
        });
    }

    function hourFcList(data){      //  7天预包中逐小时预报
        $('#seven_day_list').empty();
        var timeAr = [];
        var ttAr = [];
        for(let i = 0; i < data.length; i++){
            var wea = data[i][0].PHEN;
            if(wea == '')continue;
            var ws = data[i][0].WS;
            var wd = data[i][0].WD;
            var tt = data[i][0].TAVG;
            var time = data[i][1];
            timeAr.push(time);
            ttAr.push(tt);
            var carouseLi = '<li>'+
                                '<span class="a">'+ time +'时</span>'+
                                '<span class="b"><img src="img/lineWeatherS/cww'+wea+'.png" width="30" alt="" /></span>'+
                                '<div class="curve"></div>'+
                                '<span class="c">'+format.setWd(wd)+'</span>'+
                                '<span class="d">'+ws+'</span>'+
                            '</li>';
            $('#seven_day_list').append(carouseLi);
        }
        drawFcEcharts(ttAr,timeAr,'seven_day_echart',colorArc);
    }

    function next(tt,time){
        if(num == 9){
            num = num+2;
        }else{
            num = num+3;
        }        
        if(num==11){$('#danZhanTianQiYuBaoCon .conRight .arrowRightBtn').stop().fadeOut(100);}
        $('#danZhanTianQiYuBaoCon .conRight .arrowLeftBtn').stop().fadeIn(100);       
        var secAr = tt.slice(num, num+13);
        drawFcEchart(secAr,time,'fcEchart','white');

        var move = -50 * num;
        $('#CarouselUl').animate({'left':''+move+'px'},200);  
    }
    function pre(tt,time){
        if(num == 11){
            num = num-2;
        }else{
            num = num-3;
        }       
        $('#danZhanTianQiYuBaoCon .conRight .arrowRightBtn').stop().fadeIn(100);
        if(num==0){
            $('#danZhanTianQiYuBaoCon .conRight .arrowLeftBtn').stop().fadeOut(100);
            $('#danZhanTianQiYuBaoCon .conRight .arrowRightBtn').stop().fadeIn(100);
        }                      
        var secAr = tt.slice(num, num+13);
        drawFcEchart(secAr,time,'fcEchart','white');

        var move = -50 * num;
        $('#CarouselUl').animate({'left':''+move+'px'},200);   
    }

    function drawFcEchart(tt,time,elem,color){
        var myChart;
        var option = null;
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById(elem));
        option = getOption(tt,time,elem,color);
        myChart.setOption(option);
    //     myChart.dispatchAction({
    //         type: 'showTip',
    //         seriesIndex:1,  // 显示第几个series
    //         dataIndex: new Date().getHours() // 显示第几个数据
    //   })
    }
    function drawFcEcharts(tt,time,elem,color){
        // var myChart;
        var option = null;
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById(elem));
        option = getOption(tt,time,elem,color);
        myChart.setOption(option);
        myChart.resize();
    //     myChart.dispatchAction({
    //         type: 'showTip',
    //         seriesIndex:1,  // 显示第几个series
    //         dataIndex: new Date().getHours() // 显示第几个数据
    //   })
    }
    function getOption(tt,time,elem,color){
        var left = elem == 'seven_day_echart' ? '-1%' :'-3%';
        // var right = elem == 'seven_day_echart' ? '0' :'0';
        var right = '0';
        var option = {
            // tooltip: {
            //     trigger: 'axis',
            // },
            grid: { 
                top:'2%',
                left: left,
                right: right,
                bottom: '3%', 
                containLabel: true 
            }, 
            xAxis: {
                show: false,
                type: 'category',
                data: time
            },
            yAxis: {
                show: false,
                min: function(value) {return value.min;},
                max: function(value) {return value.max+1;},
                type: 'value'
            },
            series: [{
                name:'气温',
                data: tt,
                type: 'line',
                // smooth: true,
                symbol:'circle',
                symbolSize: 8,   //设定实心点的大小
                color: color,
                label: {
                    normal: {
                        show: true,
                        formatter : '{c}'+'℃',
                        // color: 'black',
                        position: 'bottom'
                    }
                },
                lineStyle:{
                    color:color,
                    width:1,
                },
            }]
        };
        return option;
    }

    function drawFcDayEchart(maxtt,mintt,time,elem){
        var myChart;
        var option = null;
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById(elem));
        option = {
            grid: { 
                top:'15%',
                left: '-3%',
                right: '2%',
                bottom: '3%', 
                containLabel: true 
            }, 
            xAxis: {
                show: false,
                type: 'category',
                data: time
            },
            yAxis: {
                show: false,
                min: function(value) {return value.min;},
                max: function(value) {return value.max+1;},
                type: 'value'
            },
            series: [{
                name:'最高气温',
                data: maxtt,
                type: 'line',
                // smooth: true,   
                // areaStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'red'
                //         }, {
                //             offset: 1,
                //             color: 'white'
                //         }])
                //     }
                // },
                symbol:'circle',
                symbolSize: 8,   //设定实心点的大小
                label: {
                    normal: {
                        show: true,
                        formatter : '{c}'+'℃',
                        // color: 'black',
                        position: 'top',
                        textStyle:{
                            color:'black',
                        },
                    }
                },
                itemStyle: {
                    normal: {
                        // color:colorArc,
                        color: "#fe6d3a",
                        lineStyle:{
                            color:'rgba(136, 136, 136, 1)',
                            width:1,
                        },
                    }
                },
            },{
                name:'最低气温',
                data: mintt,
                type: 'line',
                // smooth: true,
                symbol:'circle',
                symbolSize: 8,   //设定实心点的大小
                label: {
                    normal: {
                        show: true,
                        formatter : '{c}'+'℃',
                        // color: 'black',
                        position: 'bottom',
                        textStyle:{
                            color:'rgba(136, 136, 136, 1)',
                        },
                    }
                },
                itemStyle: {
                    normal: {
                        // color:colorArc,
                        // color: "#ffcc4f",
                        color:'#6DA9D3',
                        lineStyle:{
                            color:'rgba(136, 136, 136, 1)',
                            width:1,
                        },
                    }
                },
            }]
        };
        myChart.setOption(option);
    }

    function realDay(code,name){
        XHW.C.http.Http('/real?station=', code, function(json){ 
            var keyAr = [];
            for(var key in json){
                keyAr.push(key);
            }
            //  对时间key值进行排序
            keyAr.sort((a,b) => {
                return a > b ? 1 : -1;
            })

            //  显示实况整点信息
            const minCount = 12;
            for(var i = keyAr.length-1; i >= minCount; i--){
                if(json[keyAr[i]]['TAVG'] || json[keyAr[i]]['WD']){
                    var hourParam = keyAr[i].split(' ')[1].substring(0,2);
                    $('#danZhanTianQiYuBaoCon h3').html(name);
                    $('#danZhanTianQiYuBaoCon .shiKuangTime').html(hourParam+':00 实况');
                    $('#danZhanTianQiYuBaoCon .temperature').html(json[keyAr[i]]['TAVG']+'<i class="unit">℃</i>');
                    $('#danZhanTianQiYuBaoCon .temperatureHige').html(format.tt(json[keyAr[i]]['MAXT']));
                    $('#danZhanTianQiYuBaoCon .temperatureLow').html(format.tt(json[keyAr[i]]['MINT']));
                    // $('#danZhanTianQiYuBaoCon .airQuality').html(hourParam+':00');
                    $('#danZhanTianQiYuBaoCon .wind').html(format.setWd(json[keyAr[i]]['WD'])+'风 '+json[keyAr[i]]['WS']+'级');
                    $('#danZhanTianQiYuBaoCon .humidity').html('相对湿度  '+json[keyAr[i]]['RH']+'%');
                    return;
                }
            }     
        },function(){
            $('#danZhanTianQiYuBaoCon #realInfo span').empty();
        })
    }

    var colorArc = function(params) {   
        let color_tt = ['#0b2795','#0c43c4','#196bd5','#3392f4','#66b8f6','#fbf1a0','#ffe478',
                        '#ffcc4f','#f29b00','#dc7904','#fe6d3a','#ff4800','#f0041a','#c10849',
                        '#a3065b','#9606a3','#63026c','#4a026c','#46000d'];
        if(params.data < -12){
            return color_tt[0];
        }else if(params.data >= -12 && params.data < -9){
            return color_tt[1];
        }else if(params.data >= -9 && params.data < -6){
            return color_tt[2];
        }else if(params.data >= -6 && params.data < -3){
            return color_tt[3];
        }else if(params.data >= -3 && params.data < 0){
            return color_tt[4];
        }else if(params.data >= 0 && params.data < 3){
            return color_tt[5];
        }else if(params.data >= 3 && params.data < 6){
            return color_tt[6];
        }else if(params.data >= 6 && params.data < 9){
            return color_tt[7];
        }else if(params.data >= 9 && params.data < 12){
            return color_tt[8];
        }else if(params.data >= 12 && params.data < 15){
            return color_tt[9];
        }else if(params.data >= 15 && params.data < 18){
            return color_tt[10];
        }else if(params.data >= 18 && params.data < 21){
            return color_tt[11];
        }else if(params.data >= 21 && params.data < 24){
            return color_tt[12];
        }else if(params.data >= 24 && params.data < 27){
            return color_tt[13];
        }else if(params.data >= 27 && params.data < 30){
            return color_tt[14];
        }else if(params.data >= 30 && params.data < 33){
            return color_tt[15];
        }else if(params.data >= 33 && params.data < 36){
            return color_tt[16];
        }else if(params.data >= 36 && params.data < 39){
            return color_tt[17];
        }else{
            return color_tt[18];
        };
    };

    return {
        showFc: showFc
    }
});