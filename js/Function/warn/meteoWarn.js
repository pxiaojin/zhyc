//站点 城市 气象数据
define(['Controller/closeAll'], function(closeAll) {
    var key;
    var button;     //功能开关按钮
    var layer;      //功能图层

    function init(){
        button = $('#weather_warn');
        button.click(function(){
            closeAll.closeLayer();
            getData();
        });
        
        key = 'ww_warn';

        //------------鼠标指向marker的监听
        // XHW.C.mouse.addCallback(key, function(value){
        //     return getPopupHtml(value);
        // });
    }

    init();

    function getData(){
        var baseurl = 'http://typhoon.nmc.cn/weatherservice/fetch_json/warning/json?t=';
        var timestamp=new Date().getTime();
        var cb = '&callback=fetch_json_warning_json';
        $.ajax({
            url: baseurl + timestamp + cb,
            dataType:'text',     //  类型不能写json
            success:function(json){
                var json = json.split('fetch_json_warning_json')[1];
                var data = eval('(' + json + ')');
                if(data){
                    drawStationMarkers(data);
                }               
            },
            error: function(error){
            }
        })    
    }

    /**
     * 显示城镇气象信息
     */
    function drawStationMarkers(data){
        var markers = [];
        for(var i = 0; i < data.length; i++) {
            var singleInfo = data[i];
            if(singleInfo[7] == '' || singleInfo[7] == null){continue};
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(singleInfo[8]), parseFloat(singleInfo[7])]))
            })
            
            marker.type = key;
            marker.value = {
                province: singleInfo[0],
                city: singleInfo[1],
                lng: singleInfo[8],
                lat: singleInfo[7],
                level: singleInfo[4],
                info: singleInfo[9],
                ban: singleInfo[10],
                time: singleInfo[5],
                state: singleInfo[3]
            };
            let imageurl = getImg(marker.value);
            marker.setStyle(new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    crossOrigin: 'anonymous',
                    src: imageurl,
                    scale: 0.11,
                })),                                          
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
            layer.id = key;
        }
        layer.setSource(source);
        
        if ($.inArray(layer, XHW.map.getLayers().getArray()) == -1)
        XHW.map.addLayer(layer);
    }

    /**
     * 获取图片
     * @param {*} wth 实况现象
     * @param {*} cn  云量
     */
    function getImg(value){
        var color = value.level == '黄色' ? 'yellow.png' :
                        value.level == '蓝色' ? 'blue.png' :
                            value.level == '橙色' ? 'org.png' : 'red.png';
        var ban = value.ban == '0' ? 'img/realWarn/' : 'img/ww_warn_disable/';
        var state = value.state.indexOf('寒潮') != -1 ? 'coldwave-' :
                    value.state.indexOf('干旱') != -1 ? 'drought-' :
                    value.state.indexOf('霜冻') != -1 ? 'frost-' :
                    value.state.indexOf('大风') != -1 ? 'gale-' :
                    value.state.indexOf('冰雹') != -1 ? 'hall-' :
                    value.state.indexOf('霾') != -1 ? 'haze-' :
                    value.state.indexOf('高温') != -1 ? 'heatwave-' :
                    value.state.indexOf('大雾') != -1 ? 'heavyfog-' :
                    value.state.indexOf('雷电') != -1 ? 'lightning-' :
                    value.state.indexOf('暴雨') != -1 ? 'rainstorm-' :
                    value.state.indexOf('道路结冰') != -1 ? 'roadicing-' :
                    value.state.indexOf('沙尘暴') != -1 ? 'sandstorm-' :
                    value.state.indexOf('暴雪') != -1 ? 'snowstorm-' :
                    value.state.indexOf('台风') != -1 ? 'typhoon-' :
                    value.state.indexOf('森林火险') != -1 ? 'wildfire-' : 'warn-';

        var imgs = ban + state + color;      
        return imgs;
    };

    /**
     * 根据值返回浮动框
     * @param {*} value 
     */
    function getPopupHtml(value){       
        var html = '<div style="position:absolute;left:-30px;bottom:12px;' 
                            + 'background:rgba(0,0,0,0.5);padding:2px;border-radius:2px;color:#ffffff;width:300px;">'
                        +'<h1 style="font-size:13px;margin:5px 0;">' + value.province + value.city + value.level + value.state + '预警</h1>'
                        +'<h2 style="font-size:12px;margin:5px 0;text-indent:2em;line-height:20px;">' + value.info + '</h2>'
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
        close: remove
    }

});