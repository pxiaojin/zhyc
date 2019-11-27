//风 功能
define(['Controller/closeAll', 'Function/numberFC/FloatSelector'], function(closeAll, floatSelector) {

    var layer; //图层（需要随地图移动重新绘制
    var data;   //方向数据（要根据图层缩放重新绘制，需要记录数据）
    var dataS;  //速度数据
    var button;     //按钮

    function init(){
        button = $('#live_wind_high');
        button.click(function(){
            closeAll.closeLayer();
            $('#floatMapDiv3').show();
            getData();
        });

        floatSelector.on('floatMapDiv3', 'click', function(event){
            closeAll.closeLayer();
            $('#floatMapDiv3').show();
            getData();
        }); 

        XHW.C.MapMove.addZoomCallback(function(){
            if(layer)
            drawSeaWind();
        });
        key = 'live_wind';
    }

    function getData(){    //TODO, 之后更改写法（传递时间，elem固定
        data = null;
        dataS = null;

        // var level = select.val();
        var time = XHW.time.year + XHW.time.month + XHW.time.day + XHW.time.hour + '0000';
        var param = {
            elem: 'WD',
            time: time
        };
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getArea', param, function(json){
            var pubtime = json.time.substring(8,10);
            $('#floatMapDiv3 .floatMapDivTime').html(pubtime+'时');
            data = json.data;
            drawSeaWind();
        });
        param.elem = 'WS';
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getArea', param, function(json){
            dataS = json.data.vals;
            drawSeaWind();
        });
    }

    /**
     * 绘制海浪方向 箭头形式
     * @param {} data 
     */
    function drawSeaWind(){
        //step*---------------查看两组数据是否齐全
        if(!data || !dataS) {
            return;
        }
        windPlume();
    }

    //========================================================================风羽图部分
    function windPlume(){
        //step1---------------箭头所在数组
        var markers = [];
        //step2---------------获取屏幕显示范围(地图本身疑似做过优化)
        //step3---------------根据屏幕显示范围获取循环起始结束位置

        //step4---------------根据地图层级决定箭头疏密程度
        var zoom = XHW.map.getView().getZoom();
        var delta = getDelta(zoom);     //数据间隔为0.2经纬度 乘5转为1经纬度
        //step5---------------循环绘制箭头
        var vals = data.vals;
        for(var i = 0; i < vals.length; i += delta) {  //row循环 lng+
            var lat = data.slat + i * data.delta;
            
            for(var j = 0; j < vals[i].length; j += delta) { //col循环 lat+
                if(!vals[i][j] && vals[i][j] != 0) {    //如果值为空并且值不为0，则不绘制（无数据） 
                    continue;
                }
                var lng = data.slng + j * data.delta;
                var marker = new ol.Feature({
                    geometry:new ol.geom.Point(ol.proj.fromLonLat([lng, lat])), 
                })

                // var imgSrc = getImage(dataS[i][j]);
                marker.setStyle(new ol.style.Style({       
                    image: new ol.style.Icon({
                        rotation: vals[i][j] * Math.PI / 180,    //旋转（弧度？ wd * Math.PI / 180
                        // anchor: 'anonymous',
                        // duration: 2000,
                        // src: imgSrc
                        src: 'img/wind.png',
                        // scale: dataS[i][j],
                    }),
                    text: new ol.style.Text({ 
                        textAlign: "center",
                        textBaseline: "middle",
                        // font: '10px Normal Arial',
                        font: '14px bold Arial',                                
                        text: Math.round(dataS[i][j]) +'级',
                        fill: new ol.style.Fill({    //文字填充色
                            // color: '#32C2FD',
                            color: '#4F19E6'
                        }),                            
                        offsetX: 10,
                        offsetY: 19,
                    })
                }));
                markers.push(marker);
            }
        }
        
        //step6------------------将所有marker加入同一个图层
        let source = new ol.source.Vector({
            features: markers
        });

        if (!layer) {
            layer = new ol.layer.Vector({
                
            });
            layer.setZIndex(15);
            layer.id = key;
        }
        layer.setSource(source);
        
        if ($.inArray(layer, XHW.map.getLayers().getArray()) == -1)
        XHW.map.addLayer(layer);
    }

    /**
     * 根据zoom获取间距
     * @param {} zoom 
     */
    function getDelta(zoom){
        var delta = zoom == 8 ? 14 :
                    zoom == 9 ? 12 :
                    zoom == 10 ? 8 :
                    zoom == 11 ? 6 :
                    zoom == 12 ? 4 : 1;
        return delta;
    }

    /**
     * 获取图片地址
     * @param {*} ws 
     */
    function getImage(ws) {
        ws = (ws / 2) >> 0;
        ws = ws * 2;
       
        ws = ws > 72 ? 72 : ws;
        ws = ws < 1 ? 1 : ws;
        ws = ws < 10 ? '0' + ws : ws;
        return 'img/imgs/icon_ws' + ws + '@2x.png';
    }

    function remove(){
        if(layer) {
            XHW.map.removeLayer(layer);
            layer = null;
        }
    }

    init();

    return {
        close: remove,
    }
});