define(['Function/forecast/single_fc', 'Controller/closeAll',
    'Function/numberFC/FloatSelector'], function(station, closeAll, floatSelector) {
    var type;
    var station_code;

    function init(){
        type = 'growth_point';

        //------------鼠标指向marker的监听      
        XHW.C.mouse.addCallback(type, function(value){
            return station.getPopupHtml(value);
        });
        XHW.C.mapclick.addCallback(type, function(value){
            $('#birthDataCon').show();
            $('#birthDataCon .top .title').html(value.name);
            station_code = value.station_code;
            getData(station_code);
             
        })       
        $('#growth').click(function(){    
            closeAll.closeLayer();         
            
            //  加载 生育期页面
            $('#birthDataDiv').load('birthData.html',function(){
                dragPanelMove("#birthDataCon .top","#birthDataCon");
                birthDataCon();
            });

            station.getData(type);  // 画站点         
        })

        floatSelector.on('growth_select', 'click', function(){
            getData(station_code);
        });


        //------------本生长季 生育期     
        XHW.C.mouse.addCallback('grow_season_point', function(value){
            return station.getPopupHtml(value);
        });
        XHW.C.mapclick.addCallback('grow_season_point', function(value){
            $('#birthDataCon').show();
            $('#birthDataCon .top .title').html(value.name);
            station_code = value.station_code;
            getData_season(station_code);
             
        })       
        $('#grow_season').click(function(){    
            closeAll.closeLayer();         
            
            //  加载 生育期页面
            $('#birthDataDiv').load('birthData.html',function(){
                dragPanelMove("#birthDataCon .top","#birthDataCon");
                birthDataCon();
            });

            station.getData('grow_season_point');  // 画站点         
        })

        floatSelector.on('grow_season_select', 'click', function(){
            getData_season(station_code);
        });
    }
    
    init();

    function getData(value){
        var stage = floatSelector.getValue('growth_select','true');
        var param = {
            // station: '54511',
            station: value,
            stage: stage
        }
        //月数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/climate/selectHistoryGrowData', param, function(json){ 
            json = json.data[stage];
            switch(stage){
                case '0': $('#birthDataCon .top .text').html('育苗期');
                    break;
                case '1': $('#birthDataCon .top .text').html('移栽生根期');
                    break;
                case '2': $('#birthDataCon .top .text').html('旺盛期');
                    break;
                case '3': $('#birthDataCon .top .text').html('成熟采烤期');
                    break;
            };
            $('#birthDataCon .con li .val1').html(json['AVG_AT']+'℃');
            $('#birthDataCon .con li .val2').html(json['MAX_AVG_AT']+'℃');
            $('#birthDataCon .con li .val3').html(json['MIN_AVG_AT']+'℃');
            $('#birthDataCon .con li .val4').html(json['AVG_ACTACC_GE10']+'℃');
            $('#birthDataCon .con li .val5').html(json['AVG_GE20_DAYS']+'天');
            $('#birthDataCon .con li .val6').html(json['AVG_GE35_DAYS']+'天');
            $('#birthDataCon .con li .val7').html(json['AVG_PRE']+'mm');
            $('#birthDataCon .con li .val8').html(json['AVG_PRE_DAYS']+'天');
            $('#birthDataCon .con li .val9').html(json['AVG_RH']+'%');
            $('#birthDataCon .con li .val10').html(json['AVG_SSD']+'h');
            $('#birthDataCon .con li .val11').html(json['AVG_FIELD_DAYS']+'天');
        },function(){
            $('#birthDataCon .con li .val').html('--');
        })
    }

    // 本生长季 生育期数据
    function getData_season(value){
        var stage = floatSelector.getValue('grow_season_select','true');
        var param = {
            // station: '54511',
            station: value,
            year: '2018',   // 测试年，当前年无数据（有数据后把年参数去掉，默认最新）
            stage: stage
        }
        //月数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/climate/selectCurrentGrowData', param, function(json){ 
            json = json.data[stage];
            switch(stage){
                case '0': $('#birthDataCon .top .text').html('育苗期');
                    break;
                case '1': $('#birthDataCon .top .text').html('移栽生根期');
                    break;
                case '2': $('#birthDataCon .top .text').html('旺盛期');
                    break;
                case '3': $('#birthDataCon .top .text').html('成熟采烤期');
                    break;
            };
            $('#birthDataCon .con li .val1').html(json['AVG_AT']+'℃');
            $('#birthDataCon .con li .val2').html(json['AVGMAX_AT']+'℃');
            $('#birthDataCon .con li .val3').html(json['AVGMIN_AT']+'℃');
            $('#birthDataCon .con li .val4').html(json['ACTACC_GE10']+'℃');
            $('#birthDataCon .con li .val5').html(json['GE20_DAYS']+'天');
            $('#birthDataCon .con li .val6').html(json['GE35_DAYS']+'天');
            $('#birthDataCon .con li .val7').html(json['SUM_PRE']+'mm');
            $('#birthDataCon .con li .val8').html(json['PRE_DAYS']+'天');
            $('#birthDataCon .con li .val9').html(json['AVG_RH']+'%');
            $('#birthDataCon .con li .val10').html(json['SUM_SSD']+'h');
            $('#birthDataCon .con li .val11').html(json['FIELD_DAYS']+'天');
        })
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