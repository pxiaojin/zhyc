define(['Function/forecast/single_fc', 'Controller/closeAll', 'Controller/publicClass',
 'Function/numberFC/FloatSelector', 'lib/echarts'], function(station, closeAll, pub, floatSelector, echarts) {
    var type;
    var data = {
        month:{
            avg_at:[],
            daewoo10_jiwen:[],
            daewoo35_day:[],
            rn:[],
            rn_day:[],
            daewoo5_wind:[],
            ssd:[]
        },
        xun:{
            avg_at:[],
            daewoo10_jiwen:[],
            daewoo35_day:[],
            rn:[],
            rn_day:[],
            daewoo5_wind:[],
            ssd:[]
        },
        hou:{
            avg_at:[],
            daewoo10_jiwen:[],
            daewoo35_day:[],
            rn:[],
            rn_day:[],
            daewoo5_wind:[],
            ssd:[]
        },
        xVal1:[],
        xVal2:[],
        xVal3:[]
    };
    var myChart;
        myChart = myChart ? myChart.dispose() : '';
    function init(){
        type = 'meadow_point';
 
        //------------鼠标指向marker的监听      
        // XHW.C.mouse.addCallback(type, function(value){
        //     return station.getPopupHtml(value);
        // });
        XHW.C.mapclick.addCallback(type, function(value){
            $('#monthDataCurveCon').show();
            $('#monthDataCurveCon .top .title').html(value.name);
            $('#monthDataCurveCon .top .hou_season').show();
            getData(value.station_code);
            setTimeout(function(){
                echart_select();
            },200);      

            $('#monthDataCurveCon .rightTab span').click(function(event){
                echart_select();
            });
        })       
        $('#meadow').click(function(){    
            closeAll.closeLayer();    
            
            //  加载 月侯旬页面
            $('#monthDataCurveDiv').load('monthDataCurve.html',function(){
                dragPanelMove("#monthDataCurveCon .top","#monthDataCurveCon");
                monthDataCurveCon();
            }); 
            station.getData(type);   // 画站点
        })

        floatSelector.on('meadow_select', 'click', function(){
            echart_select();
        });


        // 本季生长气候  月旬数据
        // XHW.C.mouse.addCallback('meadow_season_point', function(value){
        //     return station.getPopupHtml(value);
        // });
        XHW.C.mapclick.addCallback('meadow_season_point', function(value){
            $('#monthDataCurveCon').show();
            $('#monthDataCurveCon .top .title').html(value.name);
            $('#monthDataCurveCon .top .hou_season').hide();
            getData_season(value.station_code);
            setTimeout(function(){
                echart_select('season');
            },200);      

            $('#monthDataCurveCon .rightTab span').click(function(event){
                echart_select('season');
            });
        })       
        $('#meadow_season').click(function(){    
            closeAll.closeLayer();               
            //  加载 月侯旬页面
            $('#monthDataCurveDiv').load('monthDataCurve.html',function(){
                dragPanelMove("#monthDataCurveCon .top","#monthDataCurveCon");
                monthDataCurveCon();
            }); 
            
            station.getData('meadow_season_point');   // 画站点
        })

        floatSelector.on('meadow_season_select', 'click', function(){
            echart_select('season');
        });
    }
    
    init();

    function getData(value){
        var param = {
            station: '54511'
            // station: value
        }
        //月数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/climate/selectHistoryMonthData', param, function(json){ 
            json = json.data;
            data.month.avg_at = [];data.month.daewoo10_jiwen = [];data.month.daewoo35_day = [];data.month.rn = [];
            data.month.rn_day = [];data.month.daewoo5_wind = [];data.month.ssd = [];data.xVal1 = [];
            for(let i = 1; i < 13; i++){
                data.xVal1.push(i);
                data.month.avg_at.push(json[pub.toTwo(i)]['AVG_AT']);
                data.month.daewoo10_jiwen.push(json[pub.toTwo(i)]['EFFACC_AT_GT10']);
                data.month.daewoo35_day.push(json[pub.toTwo(i)]['GE35_DAYS']);
                data.month.rn.push(json[pub.toTwo(i)]['AVG_PRE20_20']);
                data.month.rn_day.push(json[pub.toTwo(i)]['PRE20_20_DAYS']);
                data.month.daewoo5_wind.push(json[pub.toTwo(i)]['GE10_DAYS']);
                data.month.ssd.push(json[pub.toTwo(i)]['AVG_SSD']);
            }
        },function(){
            $('#mon_echart').empty();
        })
        //旬数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/climate/selectHistoryDekadData', param, function(json){ 
            json = json.data;
            data.xun.avg_at = [];data.xun.daewoo10_jiwen = [];data.xun.daewoo35_day = [];data.xun.rn = [];
            data.xun.rn_day = [];data.xun.daewoo5_wind = [];data.xun.ssd = [];data.xVal2 = [];
            for(let i = 1; i < 37; i++){
                data.xVal2.push(i);
                data.xun.avg_at.push(json[pub.toTwo(i)]['AVG_AT']);
                data.xun.daewoo10_jiwen.push(json[pub.toTwo(i)]['EFFACC_AT_GT10']);
                data.xun.daewoo35_day.push(json[pub.toTwo(i)]['GE35_DAYS']);
                data.xun.rn.push(json[pub.toTwo(i)]['AVG_PRE20_20']);
                data.xun.rn_day.push(json[pub.toTwo(i)]['PRE20_20_DAYS']);
                data.xun.daewoo5_wind.push(json[pub.toTwo(i)]['GE10_DAYS']);
                data.xun.ssd.push(json[pub.toTwo(i)]['AVG_SSD']);
            }
        },function(){
            $('#mon_echart').empty();
        })
        //侯数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/climate/selectHistoryPentadData', param, function(json){ 
            json = json.data;
            data.hou.avg_at = [];data.hou.daewoo10_jiwen = [];data.hou.daewoo35_day = [];data.hou.rn = [];
            data.hou.rn_day = [];data.hou.daewoo5_wind = [];data.hou.ssd = [];data.xVal3 = [];
            for(let i = 1; i < 73; i++){
                data.xVal3.push(i);
                data.hou.avg_at.push(json[pub.toTwo(i)]['AVG_AT']);
                data.hou.daewoo10_jiwen.push(json[pub.toTwo(i)]['EFFACC_AT_GT10']);
                data.hou.daewoo35_day.push(json[pub.toTwo(i)]['GE35_DAYS']);
                data.hou.rn.push(json[pub.toTwo(i)]['AVG_PRE20_20']);
                data.hou.rn_day.push(json[pub.toTwo(i)]['PRE20_20_DAYS']);
                data.hou.daewoo5_wind.push(json[pub.toTwo(i)]['GE10_DAYS']);
                data.hou.ssd.push(json[pub.toTwo(i)]['AVG_SSD']);
            }
        },function(){
            $('#mon_echart').empty();
        })
    }

    // 本生长季气候数据
    function getData_season(value){
        var param = {
            // station: '54511',
            station: value,
            year: '2018',     // 测试年，当前年无数据（有数据后把年参数去掉，默认最新）
        }
        //月数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/climate/selectCurrentMonthData', param, function(json){ 
            json = json.data;
            data.month.avg_at = [];data.month.daewoo10_jiwen = [];data.month.daewoo35_day = [];data.month.rn = [];
            data.month.ssd = [];data.xVal1 = [];
            for(let i = 1; i < 13; i++){
                data.xVal1.push(i);
                data.month.avg_at.push(json[pub.toTwo(i)]['AVG_AT']);
                data.month.daewoo10_jiwen.push(json[pub.toTwo(i)]['AVGMAX_AT']);
                data.month.daewoo35_day.push(json[pub.toTwo(i)]['AVGMIN_AT']);
                data.month.rn.push(json[pub.toTwo(i)]['SUM_PRE20_20']);
                data.month.ssd.push(json[pub.toTwo(i)]['SUM_SSD']);
            }
        },function(){
            $('#mon_echart').empty();
        })
        //旬数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/climate/selectCurrentDekadData', param, function(json){ 
            json = json.data;
            data.xun.avg_at = [];data.xun.daewoo10_jiwen = [];data.xun.daewoo35_day = [];data.xun.rn = [];
            data.xun.ssd = [];data.xVal2 = [];
            for(let i = 1; i < 37; i++){
                data.xVal2.push(i);
                data.xun.avg_at.push(json[pub.toTwo(i)]['AVG_AT']);
                data.xun.daewoo10_jiwen.push(json[pub.toTwo(i)]['AVGMAX_AT']);
                data.xun.daewoo35_day.push(json[pub.toTwo(i)]['AVGMIN_AT']);
                data.xun.rn.push(json[pub.toTwo(i)]['SUM_PRE20_20']);
                data.xun.ssd.push(json[pub.toTwo(i)]['SUM_SSD']);
            }
        },function(){
            $('#mon_echart').empty();
        })
    }

    function echart_select(fun_key){
        var elemValue = $('#monthDataCurveCon .rightTab span.orange').html();
        var elem = elemValue == '月' ? 'month' : (elemValue == '旬' ? 'xun' : 'hou');
        var elem2 = fun_key == 'season' ? floatSelector.getValue('meadow_season_select','true') : floatSelector.getValue('meadow_select','true');
        var xVal = elemValue == '月' ? data.xVal1 : (elemValue == '旬' ? data.xVal2 : data.xVal3);
        if(elem2 == 'avg_at'){
            $('#monthDataCurveCon .top .text').html('平均气温');
            drawEchart(data[elem][elem2],'平均气温',elemValue,'(℃)',xVal,'2ec7c9')
        }  
        if(elem2 == 'daewoo10_jiwen'){
            if(fun_key == 'season'){
                $('#monthDataCurveCon .top .text').html('平均最高气温');
                drawEchart(data[elem][elem2],'平均最高气温',elemValue,'(℃)',xVal,'2ec7c9')
            }else{
                $('#monthDataCurveCon .top .text').html('＞10℃有效积温');
                drawEchart(data[elem][elem2],'＞10℃有效积温',elemValue,'(℃)',xVal,'2ec7c9')
            }          
        } 
        if(elem2 == 'daewoo35_day'){
            if(fun_key == 'season'){
                $('#monthDataCurveCon .top .text').html('平均最低气温');
                drawEchart(data[elem][elem2],'平均最低气温',elemValue,'(℃)',xVal,'2ec7c9')
            }else{
                $('#monthDataCurveCon .top .text').html('≥35℃日数');
                drawEchart(data[elem][elem2],'≥35℃日数',elemValue,'(天)',xVal,'2ec7c9')
            }        
        } 
        if(elem2 == 'rn'){
            $('#monthDataCurveCon .top .text').html('平均降水量');
            drawEchart(data[elem][elem2],'平均降水量',elemValue,'(mm)',xVal,'2ec7c9')
        } 
        if(elem2 == 'rn_day'){
            $('#monthDataCurveCon .top .text').html('降水日数');
            drawEchart(data[elem][elem2],'降水日数',elemValue,'(天)',xVal,'2ec7c9')
        } 
        if(elem2 == 'daewoo5_wind'){
            $('#monthDataCurveCon .top .text').html('5级以上大风');
            drawEchart(data[elem][elem2],'5级以上大风',elemValue,'(天)',xVal,'2ec7c9')
        } 
        if(elem2 == 'ssd'){
            if(fun_key == 'season'){
                $('#monthDataCurveCon .top .text').html('累计日照时数');
                drawEchart(data[elem][elem2],'累计日照时数',elemValue,'(h)',xVal,'2ec7c9')
            }else{
                $('#monthDataCurveCon .top .text').html('平均日照时数');
                drawEchart(data[elem][elem2],'平均日照时数',elemValue,'(h)',xVal,'2ec7c9')
            }           
        }             
    }

    function drawEchart(dataElem,strName,xUnit,yUnit,xValue,color){   
        var option = null;
        myChart = echarts.init(document.getElementById('mon_echart'));
        option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params) {  
                    if (params) {
                        // let relVal = params[0].name +':00'; 
                        // console.log(JSON.stringify(params))
                        for (var i = 0, l = params.length; i < l; i++) {
                            let unit = yUnit;
                            relVal = params[i].seriesName  + ': '+ params[i].value+unit;                                  
                        }
                        return relVal;
                    }
                    return params;
                } 
            },
            color: color,
            grid: {
                left: 40,
                top:30,
                right:30,
                bottom:40,
                // containLabel: true
            },
            xAxis: {
                name: xUnit,
                type: 'category',
                data: xValue,
                boundaryGap : false,
                axisTick:{alignWithLabel: true},
                axisLine: {onZero: false, lineStyle:{color: '#13507f'}},
            },
            yAxis: [
                {
                    name: yUnit,
                    type: 'value',
                    min: function(value) {return value.min-1;},
                    max: function(value) {return value.max+1;},
                    splitLine:{show:false},
                    axisTick:{alignWithLabel: true},
                    axisLine: {lineStyle:{color: '#13507f'}},
                }
            ],
            series: [
                {
                    name: strName,
                    type: 'line',
                    smooth:true,
                    data: dataElem,
                    symbol:'circle',
                    symbolSize: 8,   //设定实心点的大小
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#13507f'
                            }, {
                                offset: 1,
                                color: "#2ec7c9"
                            }])
                        }
                    },
                    // color: function(params) {
                    //     // build a color map as your need.
                    //     var colorList = [
                    //       '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                    //        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                    //        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                    //     ];
                    //     return colorList[params.dataIndex]
                    // },
                    lineStyle:{
                        color:'rgba(136, 136, 136, 1)',
                        width:1,
                    },
                }      
            ]
        };
        myChart.setOption(option);
    }

    /**
     * 删除图层
     */
    function remove(){  
        station.close();
    }
    
    return {
        close: remove,
    }
});