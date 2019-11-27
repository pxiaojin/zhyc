define(['Function/forecast/fcEchart', 'Controller/DataFormat', 'Controller/closeAll'], function(showEchart, format, closeAll) {

    var layer;
    var type; 
    var real_code;
 
    function init(){
        type = 'fc_point';
        //------------鼠标指向marker的监听      
        // XHW.C.mouse.addCallback(type, function(value){
        //     return getPopupHtml(value);
        // });
        XHW.C.mapclick.addCallback(type, function(value){
            $('#danZhanTianQiYuBaoCon').show();
            showEchart.showFc(value);
            localStorage.setItem("real_code",JSON.stringify(value));
            real_code = value;
        })       
        XHW.C.MapMove.addZoomCallback(function(){
            if(layer)
            getData(type);
        });
        $('#sin_fc, #nav1_fc').click(function(){    
            open();
        })

        //   实况、预报相互切换
        require(['Function/monitor/station'], function (sta) {
            $("body").delegate("#danZhanTianQiYuBaoCon .popopTab", "click", function () {
                sta.open();
                var code = real_code == undefined ? JSON.parse(localStorage.getItem('fc_code')) : real_code;
                
                setTimeout(function(){
                    $('#ceZhanShiKuangCon').show();
                    $('#ceZhanShiKuangCon .popopTab').show();
                    $('#ceZhanShiKuangQuXianCon').show();
                    sta.singleStation(code);
                },300)
                
                //   菜单样式切换
                $('#nav1_grow').addClass('navOneCurrent').siblings().removeClass('navOneCurrent');
                $('.leftMain .mainBtn').parent().removeClass('current');
                $('.leftMain .erJiUl>li').removeClass('currenterJiBtn');
                $('.leftMain .erJiUl,.leftMain .rgbaDiv').stop().slideUp(50);
                $('.leftMain').hide();
                $('.leftMain').eq(0).show();
                $('#soilMapDiv,#climateresourceMapDiv').stop().fadeOut(200);         
                $('#station').addClass('current').siblings().removeClass('current');
            })  
        })          
    }
    
    init();

    function open(){
        closeAll.closeLayer();     
            // 农用天气预报-单站天气预报弹出框
        $('#danZhanTianQiYuBaoDiv').load('danZhanTianQiYuBao.html',function(){
            dragPanelMove("#danZhanTianQiYuBaoCon .top","#danZhanTianQiYuBaoCon");
            danZhanTianQiYuBaoCon();
            $(".content").mCustomScrollbar({
                axis:"x",
            });
        });          
        $('#sin_fc').parent().addClass('current').siblings().removeClass('current');
        getData(type);
    }

    //  遵义站点信息
    function getData(type){
        XHW.C.http.Http('/station?station=', XHW.C.http.zunYi_station, function(json){
            drawMark(json,type);           
        })
    }
    
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
                    //  stroke: new ol.style.Stroke({    //文字边界宽度与颜色
                    //      color: 'black',
                    //      width: 0.5
                    //  }),
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
    }

    return {
        close: remove,
        getData:getData,
        getPopupHtml:getPopupHtml,
        open: open,
    }
});