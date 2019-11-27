define(['lib/echarts', 'Controller/DataFormat', 'Controller/closeAll','Function/forecast/single_fc',
 'Function/forecast/fcEchart'],function(echarts, format, closeAll, fc_point, fc_show) {
    //------------------地图
    $('#config_map span').click(function(){
        XHW.C.tile.switchMap($(this).html());
    })

    var layer;
    var layerT;
    var type; 
    var type_seo;
    var data_24h;
    var hourAr;
    var ttHtml,rhHtml,rnHtml,windHtml;
    var fc_code;

    var myChart;

    function init(){

        type_seo = 'tobacco';
        type = 'station';
        //------------鼠标指向marker的监听      
        // XHW.C.mouse.addCallback(type, function(value){
        //     return getPopupHtml(value);
        // });
        XHW.C.mapclick.addCallback(type, function(value){
            $('#ceZhanShiKuangCon').show();
            $('#ceZhanShiKuangCon .popopTab').show();
            $('#ceZhanShiKuangQuXianCon').show();
            singleStation(value);
            localStorage.setItem("fc_code",JSON.stringify(value));
            fc_code = value;
        })
        
        // XHW.C.mouse.addCallback(type_seo, function(value){
        //     return getPopupHtml(value);
        // });
        XHW.C.mapclick.addCallback(type_seo, function(value){     
            $('#ceZhanShiKuangCon').show();
            $('#ceZhanShiKuangCon .popopTab').hide();
            $('#ceZhanShiKuangQuXianCon').show(); 
            tobacco_Station(value);          
        })
       
        XHW.C.MapMove.addZoomCallback(function(){
            if(layer)
            getData(type,type_seo);
        });

       // 初始页面添加烟站和气象站点天气实况功能
        // open_tobacco_wea();

        $('#station,#nav1_grow').click(function(){   
            open_tobacco_wea();
        })

        //   实况、预报相互切换
        $("body").delegate("#ceZhanShiKuangCon .popopTab", "click", function () {
        // $('#ceZhanShiKuangCon .popopTab').click(function(){
            fc_point.open();
            var code = fc_code == undefined ? JSON.parse(localStorage.getItem('real_code')) : fc_code;
            fc_show.showFc(code);
            setTimeout(function(){
                $('#danZhanTianQiYuBaoCon').show();
            },300)
            
            //   菜单样式切换
            $('#nav1_fc').addClass('navOneCurrent').siblings().removeClass('navOneCurrent');
            $('.leftMain .mainBtn').parent().removeClass('current');
            $('.leftMain .erJiUl>li').removeClass('currenterJiBtn');
            $('.leftMain .erJiUl,.leftMain .rgbaDiv').stop().slideUp(50);
            $('.leftMain').hide();
            $('.leftMain').eq(1).show();
            $('#soilMapDiv,#climateresourceMapDiv').stop().fadeOut(200);         
            $('#sin_fc').parent().addClass('current').siblings().removeClass('current');
        })       
    }
    
    init();

    function open_tobacco_wea(){
        closeAll.closeLayer();   
        //测站天气实况弹出框
        $('#ceZhanShiKuangDiv').load('ceZhanShiKuang.html',function(){
            dragPanelMove("#ceZhanShiKuangCon .top","#ceZhanShiKuangCon");
            ceZhanShiKuangCon();
        });          
        //测站天气实况曲线弹出框
        $('#ceZhanShiKuangQuXianDiv').load('ceZhanShiKuangQuXian.html',function(){
            dragPanelMove("#ceZhanShiKuangQuXianCon .top","#ceZhanShiKuangQuXianCon");
            ceZhanShiKuangQuXianCon();
        });               

        $('#station').addClass('current').siblings().removeClass('current');
        getData(type,type_seo);
    }

    //  遵义站点信息
    function getData(type,type_seo){
        XHW.C.http.Http('/station?station=', XHW.C.http.zunYi_station, function(json){
            drawMark(json, type);           
        })
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getSensorList', '', function(json){
            drawTobaccoMark(json.data,type_seo);           
        })
    }

    //  单站 24h实况
    function singleStation(value){
        $('#ceZhanShiKuangCon .top .title').html(value['name']);
        var elemHtml = '<span class="tem_list orange">气温</span>'+
            '<i></i><span class="rn_list">降水量</span><i></i>'+
            '<span class="rh_list">相对湿度</span><i></i>'+
            '<span class="wind_list">风力风向</span>';
        $('#ceZhanShiKuangCon .rightTab').html(elemHtml);
        XHW.C.http.Http('/real?station=', value['code'], function(json){             
            var keyAr = [];
            hourAr = [];
            data_24h= {
                tavg:[],
                rain1:[],
                rh:[],
                ws:[],
                wd:[],
                wind:[]
            };

            for(var key in json){
                keyAr.push(key);
            }
            //  对时间key值进行排序
            keyAr.sort((a,b) => {
                return a > b ? 1 : -1;
            })

            for(var i = 0; i < keyAr.length; i++){
                data_24h.tavg.push(json[keyAr[i]]['TAVG']);
                data_24h.rain1.push(json[keyAr[i]]['RAIN1']);
                data_24h.rh.push(json[keyAr[i]]['RH']);
                data_24h.ws.push(json[keyAr[i]]['WS']);
                data_24h.wd.push(json[keyAr[i]]['WD']);
                var hourParam = keyAr[i].split(' ')[1].substring(0,2);
                hourAr.push(hourParam);

                data_24h.wind.push([i,json[keyAr[i]]['WS'],json[keyAr[i]]['WD']]);
            }
            setTimeout(function(){
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(ttHtml);
            },2)
            $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时气温');
            $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('气温(℃)');     
            $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/qiwen.png');     
            $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('556');      
            $('#real_chart').show();
            $('#real_rn_chart').hide();
            $('#real_wind_chart').hide();
            drawEchart(data_24h.tavg,'气温','气温(℃)',hourAr);


            //  气温
            $("body").delegate("#ceZhanShiKuangCon .rightTab .tem_list", "click", function () {
                $('#ceZhanShiKuangQuXianCon').show();
                $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('气温(℃)');
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/qiwen.png'); 
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('556');
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(ttHtml);
                $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时气温');
                $('#real_chart').show();
                $('#real_rn_chart').hide();
                $('#real_wind_chart').hide();
                drawEchart(data_24h.tavg,'气温','气温(℃)',hourAr);
            })

            //相对湿度
            $("body").delegate("#ceZhanShiKuangCon .rightTab .rh_list", "click", function () {
                $('#ceZhanShiKuangQuXianCon').show();
                $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('相对湿度(%)');
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/shidu.png'); 
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('518');
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(rhHtml);
                $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时湿度');
                $('#real_chart').show();
                $('#real_rn_chart').hide();
                $('#real_wind_chart').hide();
                drawEchart(data_24h.rh,'相对湿度','相对湿度(%)',hourAr);
            })
            
             // 显示风速风向
            $("body").delegate("#ceZhanShiKuangCon .rightTab .wind_list", "click", function () {
                $('#ceZhanShiKuangQuXianCon').show();
                $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('风力(级)');
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/fengli.png'); 
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('378');
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(windHtml);
                $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时风力风向');
                $('#real_rn_chart').hide();
                $('#real_wind_chart').show();
                $('#real_chart').hide();
                drawEchart(data_24h.wind, '', '风力(级)', hourAr, data_24h.ws);      
            })

            // 降水
            $("body").delegate("#ceZhanShiKuangCon .rightTab .rn_list", "click", function () {
                $('#ceZhanShiKuangQuXianCon').show();
                 $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('降水(mm)');
                 $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/jiangshui.png'); 
                 $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('423');
                 if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(rnHtml);
                 $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时降水');
                 $('#real_rn_chart').show();
                 $('#real_wind_chart').hide();
                 $('#real_chart').hide();
                 drawEchart(data_24h.rain1, '降水', '降水(mm)',hourAr);
             })

            //  显示实况整点信息
            const minCount = 12;
            for(var i = keyAr.length-1; i >= minCount; i--){
                if(json[keyAr[i]]['TAVG'] && json[keyAr[i]]['TAVG'] !== ''){
                    $('#ceZhanShiKuangCon .top .time').html(hourAr[i]+':00');
                    var wd = json[keyAr[i]]['WD'];
                    var rn = format.rn(json[keyAr[i]]['RAIN1']);
                    var rn1 = rn == '0.0 mm' ? '无降水' : rn;

                    var live_list = '<li><span class="el_name">气&nbsp;&nbsp;&nbsp;温 :&nbsp;&nbsp;</span><span class="ele">'+format.tt(json[keyAr[i]]['TAVG'])+'</span></li>'+
                    '<li><span class="el_name">降水量 :&nbsp;&nbsp;</span><span class="ele">'+rn1+'</span></li>'+
                    '<li><span class="el_name">相对湿度 :&nbsp;&nbsp;</span><span class="ele">'+format.rh(json[keyAr[i]]['RH'])+'</span></li>'+   
                    '<li><span class="el_name">风向 :&nbsp;&nbsp;</span><span class="ele">'+format.setWd(wd)+'风</span></li>'+
                    '<li><span class="el_name">风力 :&nbsp;&nbsp;</span><span class="ele">'+json[keyAr[i]]['WS']+' 级'+'</span></li>';
                    
                    $('#ceZhanShiKuangCon .con .right').html(live_list);
                    $('#ceZhanShiKuangCon .con .right li').css('margin-top','5px');

                    var imgSrc = 'img/lineWeatherS/cww'+json[keyAr[i]]['PHEN']+'.png'
                    $('#ceZhanShiKuangCon .con .left img').attr('src',imgSrc);
                    $('#ceZhanShiKuangCon .con .left .describe').html(format.weatherId(Number(json[keyAr[i]]['PHEN'])));

                    ttHtml = '<span>平均: ' + format.tt(json[keyAr[i]]['ATAVG']) + ',</span>'+
                        '<span>最高: ' + format.tt(json[keyAr[i]]['MAXT']) + ',</span>'+
                        '<span>最低: ' + format.tt(json[keyAr[i]]['MINT']) + '</span>';

                    rhHtml = '<span>平均: ' + format.rh(json[keyAr[i]]['RHAVG']) + ',</span>'+
                        '<span>最大: ' + format.rh(json[keyAr[i]]['MAXRH']) + '</span>';              

                    windHtml = '<span>最大风力: ' + json[keyAr[i]]['MAXWIND'] + '级</span>';                   

                    rnHtml = '<span>3h: ' + format.rn(json[keyAr[i]]['RAIN3']) + ',</span>' +
                    '<span>6h: ' + format.rn(json[keyAr[i]]['RAIN6']) + ',</span>' +
                    '<span>12h: ' + format.rn(json[keyAr[i]]['RAIN12']) + ',</span>' +
                    '<span>24h: ' + format.rn(json[keyAr[i]]['RAIN24']) + '</span>' ;                 

                    return;
                }
            }     
        },function(){
            data_24h = null;
            $('#ceZhanShiKuangCon .con .right').html('该站点暂无数据');
            $('#ceZhanShiKuangCon .con .left img').attr('src','');
            $('#ceZhanShiKuangCon .con .left .describe').html('');
            $('#ceZhanShiKuangQuXianCon #real_chart,#ceZhanShiKuangQuXianCon #real_wind_chart,#ceZhanShiKuangQuXianCon #real_rn_chart').html('<span style="padding-top:55px;text-align: center;display:block;font-size:24px;">无观测数据</span>');
            $('#ceZhanShiKuangQuXianCon #real_chart,#ceZhanShiKuangQuXianCon #real_wind_chart,#ceZhanShiKuangQuXianCon #real_rn_chart').removeAttr('_echarts_instance_');
        })
    }

    //  烟站 24h实况
    function tobacco_Station(value){
        $('#ceZhanShiKuangCon .top .title').html(value['name']);
        var elemHtml = '<span class="tem_list orange">气温</span>'+
            '<i></i><span class="rn_list">降水量</span><i></i>'+
            '<span class="rh_list">相对湿度</span><i></i>'+
            '<span class="wind_list">风速风向</span><i></i>'+
            '<span class="srh_list">土壤湿度</span>';
        $('#ceZhanShiKuangCon .rightTab').html(elemHtml);
        $('#ceZhanShiKuangCon .leftTab').empty();
        var param = {
            netcode: value['code']
            // netcode: '256'
        }
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getSensorActuallyByCode', param, function(json){       
            var keyAr = [];
            data_24h= {
                tavg:[],
                rain1:[],
                rh:[], //环湿
                ws:[],
                wd:[],
                wind:[],
                srh:[],  //土湿
                time:[]
            };
            json = json.data;

            for(var key in json){
                keyAr.push(key);
            }
            //  对时间key值进行排序
            keyAr.sort((a,b) => {
                return a > b ? 1 : -1;
            })
            for(var i = 0; i < keyAr.length; i++){
                data_24h.tavg.push(json[keyAr[i]]['tt']);
                data_24h.rain1.push(json[keyAr[i]]['rn']);
                data_24h.rh.push(json[keyAr[i]]['crh']);
                data_24h.ws.push(json[keyAr[i]]['ws2m']);
                data_24h.wd.push(json[keyAr[i]]['wd']);
                data_24h.srh.push(json[keyAr[i]]['srh']);
                // var hourParam = json[i]['datetime'].split(' ')[1].substring(0,2);  
                var hourParam = keyAr[i].split(' ')[1].substring(0,2);    
                data_24h.time.push(hourParam);       
                data_24h.wind.push([i,json[keyAr[i]]['ws2m'],json[keyAr[i]]['wd']]);
            }
            setTimeout(function(){
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(ttHtml);
            },2)
            $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时气温');
            $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('气温(℃)');          
            $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/qiwen.png');   
            $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('556');    
            $('#real_chart').show();
            $('#real_rn_chart').hide();
            $('#real_wind_chart').hide();
            drawEchart(data_24h.tavg,'气温','气温(℃)', data_24h.time);


            //  气温
            $("body").delegate("#ceZhanShiKuangCon .rightTab .tem_list", "click", function () {
                $('#ceZhanShiKuangQuXianCon').show();
                $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('气温(℃)');
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/qiwen.png'); 
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('556');
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(ttHtml);
                $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时气温');
                $('#real_chart').show();
                $('#real_rn_chart').hide();
                $('#real_wind_chart').hide();
                drawEchart(data_24h.tavg,'气温','气温(℃)', data_24h.time);
            })

            //相对湿度
            $("body").delegate("#ceZhanShiKuangCon .rightTab .rh_list", "click", function () {
                $('#ceZhanShiKuangQuXianCon').show();
                $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('相对湿度(%)');
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/shidu.png'); 
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('518');
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(rhHtml);
                $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时相对湿度');
                $('#real_chart').show();
                $('#real_rn_chart').hide();
                $('#real_wind_chart').hide();
                drawEchart(data_24h.rh,'相对湿度','相对湿度(%)', data_24h.time);
            })

            //土壤湿度
            $("body").delegate("#ceZhanShiKuangCon .rightTab .srh_list", "click", function () {
                $('#ceZhanShiKuangQuXianCon').show();
                $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('相对湿度(%)');
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/shidu.png'); 
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('518');
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(srhHtml);
                $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时相对湿度');
                $('#real_chart').show();
                $('#real_rn_chart').hide();
                $('#real_wind_chart').hide();
                drawEchart(data_24h.srh,'相对湿度','相对湿度(%)', data_24h.time);
            })
            
             // 显示风速风向
            $("body").delegate("#ceZhanShiKuangCon .rightTab .wind_list", "click", function () {
                $('#ceZhanShiKuangQuXianCon').show();
                $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('风速(m/s)');
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/fengsu.png'); 
                $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('378');
                if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(windHtml);
                $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时地面风');
                $('#real_rn_chart').hide();
                $('#real_wind_chart').show();
                $('#real_chart').hide();
                drawEchart(data_24h.wind, '', '风速(m/s)', data_24h.time, data_24h.ws);      
            })

            // 降水
            $("body").delegate("#ceZhanShiKuangCon .rightTab .rn_list", "click", function () {
                 $('#ceZhanShiKuangQuXianCon').show();
                 $('#ceZhanShiKuangQuXianCon .con .conTuLiSpan').html('降水(mm)');
                 $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').attr('src','img/legend_new/jiangshui.png'); 
                 $('#ceZhanShiKuangQuXianCon .con .conTuLiImg').width('423');
                 if(data_24h)$('#ceZhanShiKuangQuXianCon .leftTab').html(rnHtml);
                 $('#ceZhanShiKuangQuXianCon .top .title').html('过去24小时降水');
                 $('#real_rn_chart').show();
                 $('#real_wind_chart').hide();
                 $('#real_chart').hide();
                 drawEchart(data_24h.rain1, '降水', '降水(mm)', data_24h.time);
             })

            //  显示实况整点信息
            const minCount = 12;
            for(var i = data_24h.time.length-1; i >= minCount; i--){
                if(data_24h.tavg[i] && data_24h.tavg[i] !== ''){
                    $('#ceZhanShiKuangCon .top .time').html(data_24h.time[i]+':00');
                    var wd = data_24h.wd[i];
                    var rn = format.rn(data_24h.rain1[i]);
                    var rn1 = rn == '0.0 mm' ? '无降水' : rn;

                    var live_list = '<li><span class="el_name">气&nbsp;&nbsp;&nbsp;温 :&nbsp;&nbsp;</span><span class="ele">'+data_24h.tavg[i]+'℃</span></li>'+
                    '<li><span class="el_name">降水量 :&nbsp;&nbsp;</span><span class="ele">'+rn1+'</span></li>'+
                    '<li><span class="el_name">相对湿度 :&nbsp;&nbsp;</span><span class="ele">'+format.rh(data_24h.rh[i])+'</span></li>'+
                    '<li><span class="el_name">风向 :&nbsp;&nbsp;</span><span class="ele">'+ format.setWd(wd)+'风</span></li>'+
                    '<li><span class="el_name">风速 :&nbsp;&nbsp;</span><span class="ele">'+data_24h.ws[i]+' m/s</span></li>'+                   
                    '<li><span class="el_name">土壤相对湿度 :&nbsp;&nbsp;</span><span class="ele">'+format.rh(data_24h.srh[i])+'</span></li>';
                    $('#ceZhanShiKuangCon .con .right').html(live_list);
                    $('#ceZhanShiKuangCon .con .right li').css('margin-top','5px');

                    var imgSrc = 'img/lineWeatherS/cww'+json[keyAr[i]]['phen']+'.png'
                    $('#ceZhanShiKuangCon .con .left img').attr('src',imgSrc); 
                    $('#ceZhanShiKuangCon .con .left .describe').html(format.weatherId(Number(json[keyAr[i]]['phen'])));

                    ttHtml = '<span>平均: ' + format.tt(json[keyAr[i]]['atAvg']) + ',</span>'+
                        '<span>最高: ' + format.tt(json[keyAr[i]]['maxt']) + ',</span>'+
                        '<span>最低: ' + format.tt(json[keyAr[i]]['mint']) + '</span>';

                    rhHtml = '<span>平均: ' + format.rh(json[keyAr[i]]['crhAvg']) + ',</span>'+
                        '<span>最大: ' + format.rh(json[keyAr[i]]['maxCrh']) + '</span>';   
                        
                    srhHtml = '<span>平均: ' + format.rh(json[keyAr[i]]['srhAvg']) + ',</span>'+
                        '<span>最大: ' + format.rh(json[keyAr[i]]['maxSrh']) + '</span>'; 

                    windHtml = '<span>最大风速: ' + json[keyAr[i]]['maxWs10m'] + 'm/s</span>';                   

                    rnHtml = '<span>3h: ' + format.rn(json[keyAr[i]]['rain3']) + ',</span>' +
                    '<span>6h: ' + format.rn(json[keyAr[i]]['rain6']) + ',</span>' +
                    '<span>12h: ' + format.rn(json[keyAr[i]]['rain12']) + ',</span>' +
                    '<span>24h: ' + format.rn(json[keyAr[i]]['rain24']) + '</span>' ;  

                    return;
                }
            }     
        },function(){
            data_24h = null;
            $('#ceZhanShiKuangCon .con .right').html('该站点暂无数据');
            $('#ceZhanShiKuangCon .con .left img').attr('src','');
            $('#ceZhanShiKuangCon .con .left .describe').html('');
            $('#ceZhanShiKuangQuXianCon #real_chart,#ceZhanShiKuangQuXianCon #real_wind_chart,#ceZhanShiKuangQuXianCon #real_rn_chart').html('<span style="padding-top:55px;text-align: center;display:block;font-size:24px;">无观测数据</span>');
            $('#ceZhanShiKuangQuXianCon #real_chart,#ceZhanShiKuangQuXianCon #real_wind_chart,#ceZhanShiKuangQuXianCon #real_rn_chart').removeAttr('_echarts_instance_');
        })
    }
    
    // echart

    function drawEchart(dataElem,strName,strUnit,hour,ws){   
        var option = null;
        if(strUnit == '降水(mm)'){
            if (myChart != null && myChart != "" && myChart != undefined) {
                myChart.dispose();
            }
            myChart = echarts.init(document.getElementById('real_rn_chart'));
            option = {
                title: {
                    text: ''
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter:function(params) {  
                        if (params) {
                            // let relVal = params[0].name +':00'; 
                            // console.log(JSON.stringify(params))
                            let relVal;
                            for (var i = 0, l = params.length; i < l; i++) {
                                // let unit = '';
                                // switch (i) {
                                    // case 0: unit = 'mm';break;
                                    // case 1: unit = '%';break;
                                    // case 2: unit = 'hPa';break;
                                // }
                                // relVal += '<br/>' + params[i].seriesName  + ': '+ params[i].value+unit;   
                                
                                if(params[i].value == 0){
                                    relVal = '无降水';
                                }else if(params[i].value === '' || params[i].value == -9999){
                                    relVal = '缺测';
                                }else{
                                    relVal = params[i].value + 'mm';   
                                }                                                           
                            }
                            return relVal;
                        }
                        return params;
                    } 
                },
                // color: "#2ec7c9",  if(dataElem>10)'#ccc'
                color: "#2ec7c9",
                grid: {
                    left: 30,
                    top:30,
                    right:40,
                    bottom:45
                },
                xAxis: {
                    name: '(h)',
                    nameGap: 5,
                    data: hour,
                    boundaryGap : true,
                    axisTick:{alignWithLabel: true},
                    axisLine: {onZero: false, lineStyle:{color: '#13507f'}},
                },
                yAxis: [
                    {
                        name: strUnit,
                        nameGap: 10,
                        type: 'value',
                        min: function(value) {return value.min <= 1 ? 0 : Math.floor(value.min)-1;},
                        max: function(value) {return Math.ceil(value.max)+1;},
                        splitLine:{show:false},
                        axisLine: {lineStyle:{color: '#13507f'}},
                        minInterval: 1,
                        axisLabel: {
                            formatter: function(v){
                                return  v;
                            }
                       }           
                    }
                ],
                series: [
                    {
                        name: strName,
                        type: 'bar',
                        // smooth:true,
                        data: dataElem,
                        itemStyle:{
                            emphasis:{
                                barBorderRadius:5
                            },
                            normal:{
                                barBorderRadius:5,
                                color:function(params){
                                    let color_rn = ['#cefffe','#22fffc','#23b7ff','#2376ff','#092fd1','#7b4df2','#8716ef','#6a059f','#4c0669'];
                                    if(params.data < 1){
                                        return color_rn[0];
                                    }else if(params.data >= 1 && params.data < 2){
                                        return color_rn[1];
                                    }else if(params.data >= 2 && params.data < 4){
                                        return color_rn[2];
                                    }else if(params.data >= 4 && params.data < 6){
                                        return color_rn[3];
                                    }else if(params.data >= 6 && params.data < 8){
                                        return color_rn[4];
                                    }else if(params.data >= 8 && params.data < 10){
                                        return color_rn[5];
                                    }else if(params.data >= 10 && params.data < 20){
                                        return color_rn[6];
                                    }else if(params.data >= 20 && params.data < 50){
                                        return color_rn[7];
                                    }else{
                                        return color_rn[8];
                                    }
                                },
                            }
                        }
                    }      
                ]
            };
        }else if(strUnit == '风力(级)' || strUnit == '风速(m/s)'){
            if (myChart != null && myChart != "" && myChart != undefined) {
                myChart.dispose();
            }
            myChart = echarts.init(document.getElementById('real_wind_chart'));
            option = {
                title: {
                    text: ''
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter:function(params) {
                        if (params) {
                            // let relVal = params[0].name +':00'; 
                            // console.log(JSON.stringify(params))
                            let unit = strUnit == '风力(级)' ? '级' : 'm/s';
                            for (var i = 0, l = params.length; i < l; i++) {  
                                // relVal = params[1]['value'][1]+unit+ '<br/>' + format.setWd(params[1]['value'][2]) + '风';     
                                relVal = format.setWd(params[1]['value'][2]) + '风' + params[1]['value'][1]+unit;                                                              
                            }
                            return relVal;
                        }
                        return params;
                    } 
                },
                color: "#e49b55",
                grid: {
                    left: 30,
                    top:30,
                    right:40,
                    bottom:45
                },
                xAxis: {
                    name: '(h)',
                    nameGap: 5,
                    data: hour,
                    boundaryGap : true,
                    axisTick:{alignWithLabel: true},
                    axisLine: {onZero: false, lineStyle:{color: '#13507f'}},
                },
                yAxis: [
                    {
                        name: strUnit,
                        nameGap: 10,
                        type: 'value',
                        min: function(value) {return value.min <= 1 ? 0 : Math.floor(value.min)-1;},
                        max: function(value) {return Math.ceil(value.max)+1;},
                        minInterval:1,
                        splitLine:{show:false},
                        axisLine: {lineStyle:{color: '#13507f'}},
                        axisLabel: {
                            formatter: function(v){ // y轴值不要小数
                                return  v;
                            }
                       }  
                    }
                ],
                series: [
                    {
                        name: '风速',
                        type: 'line',
                        // smooth:true,
                        data: ws,
                        symbol:'none'
                    },
                    {
                        name: '风向',
                        type: 'custom',
                        renderItem: function (param, api) {
                            var point = api.coord([
                                api.value(0),
                                api.value(1)
                            ]);
                            let color_wind = ['#e49b55','#f57f0d','#ffda00','#a7d114','#75da39','#21b5d5','#1d7aed','#4f1ae6'];
                            var color;
                            if(strUnit == '风力(级)'){
                                if(api.value(1) <= 1){
                                    color = color_wind[0];
                                }else if(api.value(1) > 1 && api.value(1) <= 2){
                                    color = color_wind[1];
                                }else if(api.value(1) > 2 && api.value(1) <= 3){
                                    color = color_wind[2];
                                }else if(api.value(1) > 3 && api.value(1) <= 4){
                                    color = color_wind[3];
                                }else if(api.value(1) > 4 && api.value(1) <= 5){
                                    color = color_wind[4];
                                }else if(api.value(1) > 5 && api.value(1) <= 7){
                                    color = color_wind[5];
                                }else if(api.value(1) > 7 && api.value(1) <= 9){
                                    color = color_wind[6];
                                }else{
                                    color = color_wind[7];
                                }
                            }else{
                                if(api.value(1) <= 1.5){
                                    color = color_wind[0];
                                }else if(api.value(1) > 1.5 && api.value(1) <= 3.3){
                                    color = color_wind[1];
                                }else if(api.value(1) > 3.3 && api.value(1) <= 5.4){
                                    color = color_wind[2];
                                }else if(api.value(1) > 5.4 && api.value(1) <= 7.9){
                                    color = color_wind[3];
                                }else if(api.value(1) > 7.9 && api.value(1) <= 10.7){
                                    color = color_wind[4];
                                }else if(api.value(1) > 10.7 && api.value(1) <= 17.1){
                                    color = color_wind[5];
                                }else if(api.value(1) > 17.1 && api.value(1) <= 24.4){
                                    color = color_wind[6];
                                }else{
                                    color = color_wind[7];
                                }
                            }
                            
                            return {
                                type: 'path',
                                shape: {
                                    // pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                                    pathData: 'M 123.5 230 L 113.298 239.011 L 123.5 210.595 L 133.702 239.011 Z',  //初始方向箭头朝下
                                    x: -arrowSize / 4,
                                    y: -arrowSize / 4,
                                    width: arrowSize / 1.5,
                                    height: arrowSize / 1.5
                                },
                                // rotation: (90-api.value(2))*Math.PI/180,
                                rotation: api.value(2)-180,
                                position: point,
                                style: api.style({
                                    stroke: color,
                                    fill: color,
                                    lineWidth: 1,
                                })
                            };
                        },
                        data: dataElem,
                        z: 10
                    }      
                ]
            };
        }else{
            if (myChart != null && myChart != "" && myChart != undefined) {
                myChart.dispose();
            }
            myChart = echarts.init(document.getElementById('real_chart'));
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
                                let unit = strUnit == '气温(℃)' ? '℃' : '%';
                                // relVal = params[i].seriesName  + ': '+ params[i].value+unit;               
                                relVal = params[i].value+unit;                      
                            }
                            return relVal;
                        }
                        return params;
                    } 
                },
                color: "#2ec7c9",
                grid: {
                    left: 35,
                    top:30,
                    right:40,
                    bottom:25,
                    // containLabel: true
                },
                xAxis: {
                    name: '(h)',
                    nameGap: 5,
                    type: 'category',
                    data: hour,
                    boundaryGap : false,
                    axisTick:{alignWithLabel: true},
                    axisLine: {onZero: false, lineStyle:{color: '#13507f'}},
                },
                yAxis: [
                    {
                        name: strUnit,
                        nameGap: 10,
                        type: 'value',
                        min: function(value) {return value.min <= 1 && strUnit != '气温(℃)' ? 0 : Math.floor(value.min)-1;},
                        max: function(value) {return value.max >= 99? 100 : Math.ceil(value.max)+1;},                     
                        splitLine:{show:false},
                        axisTick:{alignWithLabel: true},
                        axisLine: {lineStyle:{color: '#13507f'}},
                        minInterval: 1,
                        axisLabel: {
                            formatter: function(v){
                                return  v; 
                            },
                       }  
                    }
                ],
                series: [
                    {
                        name: strName,
                        type: 'line',
                        // smooth:true,
                        data: dataElem,
                        symbol:'circle',
                        symbolSize: 8,   //设定实心点的大小
                        color:function(params) {   
                            let color_tt = ['#0b2795','#0c43c4','#196bd5','#3392f4','#66b8f6','#fbf1a0','#ffe478',
                                            '#ffcc4f','#f29b00','#dc7904','#fe6d3a','#ff4800','#f0041a','#c10849',
                                            '#a3065b','#9606a3','#63026c','#4a026c','#46000d'];
                            let color_rh = ['#983200','#ea7116','#ff9a2b','#fec350','#bddef0','#4394c3','#053160'];
                            // alert(params.data)    
                            if(strUnit == '气温(℃)'){
                                // if(params.data < -12){
                                //     return color_tt[0];
                                // }else 
                                if(params.data < -9){
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
                                }else{
                                    return color_tt[17];
                                };
                            }else{
                                if(params.data < 20){
                                    return color_rh[0];
                                }else if(params.data >= 20 && params.data < 30){
                                    return color_rh[1];
                                }else if(params.data >= 30 && params.data < 40){
                                    return color_rh[2];
                                }else if(params.data >= 40 && params.data < 50){
                                    return color_rh[3];
                                }else if(params.data >= 50 && params.data < 55){
                                    return color_rh[4];
                                }else if(params.data >= 55 && params.data < 60){
                                    return color_rh[5];
                                }else{
                                    return color_rh[6];
                                }
                            }
                          },
                        // areaStyle: {
                        //     normal: {
                        //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        //             offset: 0,
                        //             color: "#2ec7c9"
                        //         }, {
                        //             offset: 1,
                        //             color: 'white'
                        //         }])
                        //     }
                        // },
                        lineStyle:{
                            color:'rgba(136, 136, 136, 1)',
                            width:1,
                        },
                    }      
                ]
            };
        };
        myChart.setOption(option);
    }
    
    var arrowSize = 18;
    // function renderArrow(param, api, unit) {
    //     var point = api.coord([
    //         api.value(0),
    //         api.value(1)
    //     ]);
    //     let color_wind = ['#e49b55','#f57f0d','#ffda00','#a7d114','#75da39','#21b5d5','#1d7aed','#4f1ae6'];
    //     var color;
       
    //     if(api.value(1) <= 1){
    //         color = color_wind[0];
    //     }else if(api.value(1) > 1 && api.value(1) <= 2){
    //         color = color_wind[1];
    //     }else if(api.value(1) > 2 && api.value(1) <= 3){
    //         color = color_wind[2];
    //     }else if(api.value(1) > 3 && api.value(1) <= 4){
    //         color = color_wind[3];
    //     }else if(api.value(1) > 4 && api.value(1) <= 5){
    //         color = color_wind[4];
    //     }else if(api.value(1) > 5 && api.value(1) <= 7){
    //         color = color_wind[5];
    //     }else if(api.value(1) > 7 && api.value(1) <= 9){
    //         color = color_wind[6];
    //     }else{
    //         color = color_wind[7];
    //     }
        
    //     return {
    //         type: 'path',
    //         shape: {
    //             // pathData: 'M31 16l-15-15v9h-26v12h26v9z',
    //             pathData: 'M 123.5 230 L 113.298 239.011 L 123.5 210.595 L 133.702 239.011 Z',  //初始方向箭头朝下
    //             x: -arrowSize / 4,
    //             y: -arrowSize / 4,
    //             width: arrowSize / 1.5,
    //             height: arrowSize / 1.5
    //         },
    //         // rotation: (90-api.value(2))*Math.PI/180,
    //         rotation: api.value(2)+180,
    //         position: point,
    //         style: api.style({
    //             stroke: color,
    //             fill: color,
    //             lineWidth: 1,
    //         })
    //     };
    // }

    //  站点
    function drawMark(json,type){
        var markers = [];
        var zoom = XHW.map.getView().getZoom(); //  9-11
        for(var key in json){
            if(zoom < 11 && key.length != 9)continue;
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(json[key]['LON']), parseFloat(json[key]['LAT'])]))
            })
            marker.type = type;
            marker.value = {
                code: key,
                name: json[key]['NAME'],
                lng: json[key]['LON'],
                lat: json[key]['LAT'],
                station_code: json[key]['STATION_METEO']
            };
            // var imgSrc = key.length == 9 ? 'dian07' : 'dian01';
            var size = key.length == 9 ? '0.3' : '0.2';
            var offset_y =  key.length == 9 ? -15 : -15;
            marker.setStyle(new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    crossOrigin: 'anonymous',
                    src: './img/dotBlack.png',
                    scale: size,
                })),    
                text: new ol.style.Text({ 
                    textAlign: "center",
                    textBaseline: "middle",
                    font: '16px bold Arial',                                 
                    text: json[key]['NAME'], 
                    fill: new ol.style.Fill({    //文字填充色
                        color: 'black'
                    }), 
                    // stroke: new ol.style.Stroke({    //文字边界宽度与颜色
                    //     color: 'black',
                    //     width: 0.5
                    // }),
                    offsetY: offset_y,                      
                })                                         
            }));

            markers.push(marker);
        }
        let source = new ol.source.Vector({
            features: markers
        });

        if (!layer) {
            layer = new ol.layer.Vector({

            });
            layer.setZIndex(15);
            layer.id = type;
        }
        layer.setSource(source);
        
        if ($.inArray(layer, XHW.map.getLayers().getArray()) == -1)
        XHW.map.addLayer(layer);
    }

    //烟站
    //  站点
    function drawTobaccoMark(data,type_seo){
        var markers = [];
        for(var i = 0; i < data.length; i++){
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(data[i]['lon']), parseFloat(data[i]['lat'])]))
            })
            marker.type = type_seo;
            marker.value = {
                code: data[i].netcode,
                name: data[i]['name'],
                lng: data[i]['lon'],
                lat: data[i]['lat']
            };
            marker.setStyle(new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    crossOrigin: 'anonymous',
                    src: './img/dotBlue.png',
                    scale: 0.2,
                })),    
                text: new ol.style.Text({ 
                    textAlign: "center",
                    textBaseline: "middle",
                    font: '16px bold Arial',                            
                    text: data[i]['name'], 
                    fill: new ol.style.Fill({    //文字填充色
                        color: 'black'
                    }), 
                    // stroke: new ol.style.Stroke({    //文字边界宽度与颜色
                    //     color: 'black',
                    //     width: 0.5
                    // }),
                    offsetY: -5,                      
                })                                       
            }));

            markers.push(marker);
        }
        let source = new ol.source.Vector({
            features: markers
        });

        if (!layerT) {
            layerT = new ol.layer.Vector({

            });
            layerT.setZIndex(15);
            layerT.id = type_seo;
        }
        layerT.setSource(source);
        
        if ($.inArray(layerT, XHW.map.getLayers().getArray()) == -1)
        XHW.map.addLayer(layerT);
    }

    /**
     * 根据值返回浮动框
     * @param {*} value 
     */
    function getPopupHtml(value){
        var lng = value['lng'];
        var lat = value['lat'];
        var name = value['name'];
        var station = value['code'];
        var html = '<div style="position:absolute;left:-30px;bottom:12px;' 
                            + 'background:rgba(0,0,0,0.5);padding:2px;border-radius:2px;color:#ffffff;width: max-content">'
                        +'<h1 style="font-size:12px;margin:5px 0;">' + name + "(" + station + ")" + '</h1>'
                        +'<h2 style="font-size:12px;margin:5px 0;">' + format.lnglat(lng, lat) + '</h2>'
                    +'</div>';
        return html;
    }
    
    /**
     * 删除图层
     */
    function remove(){  
        if(layer){
            XHW.map.removeLayer(layer);
            layer = null;  
        }  
        if(layerT){
            XHW.map.removeLayer(layerT);
            layerT = null;  
        }   
    }

    return {
        close: remove,
        getData: getData,
        getPopupHtml: getPopupHtml,
        open: open_tobacco_wea,
        singleStation: singleStation,
    }
});