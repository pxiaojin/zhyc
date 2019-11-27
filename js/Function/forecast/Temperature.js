//live 气温
define(['Controller/closeAll', 'Function/drawgeojson', 'Function/numberFC/FloatSelector', 'Function/monitor/area_point'],
 function(closeAll, draw, floatSelector, draw_pointInfo) { 
    
    var key;
    var geoJsonLayer;     //图层
    var button;     //按钮
    var layer;     //  站点图层

    function init(){
        button = $('#fc_tt');
        button.click(function(){
            closeAll.closeLayer();
            // $('#floatMapDiv .floatMapDivEle').html('平均气温');
            $('#floatMapDiv5').show();
            $('#floatMapDiv6 .one_date').addClass('currentOrange').siblings().removeClass('currentOrange');
            $('#floatMapDiv6').show();
            // $('.slibarDiv').show();
            getData();
        });

        // sliderBar.addCallback(function(){
        //     if(button.parent().hasClass('current')) getData();
        // });
        floatSelector.on('floatMapDiv5', 'click', function(event){
            closeAll.closeLayer();
            $('#floatMapDiv5').show();
            $('#floatMapDiv6').show();
            getData();
        }); 

        floatSelector.on('floatMapDiv6', 'click', function(event){
            closeAll.closeLayer();
            $('#floatMapDiv5').show();
            $('#floatMapDiv6').show();
            getData();
        }); 
        XHW.C.MapMove.addZoomCallback(function(){
            if(layer)getData();   //  改变底图层级，刷新图层          
        });
        key = 'fc_t';
    }

    function getData(){    //TODO, 之后更改写法（传递时间，elem固定
        var elem = floatSelector.getValue('floatMapDiv5');
        var year = $('#floatMapDiv6 span.currentOrange').attr('data-Year');
        var month = $('#floatMapDiv6 span.currentOrange').attr('data-month');
        var day = $('#floatMapDiv6 span.currentOrange').attr('data-value');
        var time = year + month + day + XHW.time.hour + '0000';
        // var time = XHW.silderTime.year + '' + XHW.silderTime.month + '' + XHW.silderTime.day + '' + XHW.silderTime.hour +'0000';
        var param = {
            // elem: 'TAVG',
            elem: elem,
            time: time
        }
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/forecast/getArea', param, function(json){       
            if(json.status_code != 0){
                console.log('数据错误');
                return;
            }              
            let data = json.data;
            if (data) {
                drawGeoJsonInfo(key, data);
            }
        },function(){
            remove();
        });

        //  显示 站点实况信息 
        var ele = elem == 'TAVG' ? 'ATAVG' :
                    elem == 'TMAX' ? 'TMAX' :
                       elem == 'TMIN' ? 'TMIN' : '';
        var vtiAr = [0,24,48,72,96,120,144];
        var vti_indxe = $('#floatMapDiv6 span.currentOrange').index();
        var area_param = {
            station: XHW.C.http.zunYi_station,
            ele: ele,
            vti: vtiAr[vti_indxe]
        };
        XHW.C.http.get(XHW.C.http.baseUrl, '/currentForcast', area_param, function(json){
            if(json.status_code != 0){
                console.log('数据错误');
                return;
            }              
            let data = json.data;
            if (data) {
                draw_area_station(data,ele);
            }
        });
    }

    function drawGeoJsonInfo(key, resultgeojson) {
        if (!resultgeojson)
            return;
        var resfeatures = draw.buildFeatures(key, resultgeojson);
        if (!resfeatures){
            return;
        }
        let source = new ol.source.Vector({
            features: resfeatures,
        });
        if (!geoJsonLayer) {
            geoJsonLayer = new ol.layer.Vector({
                title: '预报区域预警',
                source: source,
            });            
            XHW.map.addLayer(geoJsonLayer);
            geoJsonLayer.id = key;
        } else {
            geoJsonLayer.setSource(source);
        }
    }

    //  气象站图层
    function draw_area_station(data,ele) {
        if(!data)return;
        var source = draw_pointInfo.drawMark(data,'℃',ele);
        if(!source)return;
        if(!layer){
            layer = new ol.layer.Vector({
                source: source,
            });
            layer.setZIndex(15);
            XHW.map.addLayer(layer);
        }else{
            layer.setSource(source);
        }
    }
    //========================================================================绘制线条部分
    // function drawGfsT(data){
    //     //step1---------------等值线所在数组
    //     var feature = [];
    //     //step1.5-------------设置等值线默认颜色
    //     var DefaultColor = null;
    //     if($('#isolineConfigColorMode p .current').next().html() != '多色') {
    //         if($('#config_map p .current').next().html() == '影像图') {
    //             DefaultColor = "#FF0000";
    //         } else {
    //             DefaultColor = "#FF0000";
    //         }
    //     }
    //     let textColor = '#fff';
    //     //step2---------------循环遍历每一条线的数据
    //     for(var i = 0; i < data.lines.length; i++) {
    //         var lineData = data.lines[i];
    //         //step3----------------创建数组记录单条等值线的点
    //         var lnglats = smoothIsoline(lineData);
    //         if (!lnglats || lnglats.length <= 0)
    //             continue;
    //         // var lnglats = [];
    //         // for(var j = 0; j < lineData.pointNum; j++) {
    //         //     lnglats.push(ol.proj.fromLonLat([parseFloat(lineData.lng[j]), parseFloat(lineData.lat[j])]));
    //         // }
    //         var color = DefaultColor ? DefaultColor : "#" + ((1 << 24) + (lineData.lineColor.r << 16)     //颜色转为16进制
    //         + (lineData.lineColor.g << 8) + lineData.lineColor.b).toString(16).slice(1);
    //         let textBackgroundColor = color ;
    //         //step4-----------------创建地图线对象
    //         var line = new ol.Feature({
    //             geometry: new ol.geom.LineString(lnglats)
    //         });
    //         line.setStyle(buildIsolineStyle(lineData.val + '', lineData.lineWidth, color, textColor, textBackgroundColor));
    //         //step5------------------地图对象加入数组
    //         feature.push(line);
    //     }
    //     //step7------------------将所有等值线加入同一个图层
    //      //step7------------------将所有等值线加入同一个图层
    //      let source = new ol.source.Vector({
    //         features: feature
    //     });

    //     if (!layer) {
    //         layer = new ol.layer.Vector({
            
    //         });
    //         layer.setZIndex(5);
    //         layer.id = key;
    //     }
    //     layer.setSource(source);
        
    //     if ($.inArray(layer, XHW.map.getLayers().getArray()) == -1)
    //     XHW.map.addLayer(layer);
    // }
    // //===========================================================绘制结束

    // function remove(){
    //     if(layer) {
    //         XHW.map.removeLayer(layer);
    //         layer = null;
    //     }
    // }

    function remove(){
        if (geoJsonLayer) {
            XHW.map.removeLayer(geoJsonLayer);
            geoJsonLayer = null;
        }
        if(layer){
            XHW.map.removeLayer(layer);
            layer = null;  
        }
    }

    init();

    return {
        close: remove,
    }
});