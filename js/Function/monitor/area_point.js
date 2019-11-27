define(['Controller/DataFormat'], function(format) {
    function drawMark(json,unit,elem){
        // var wea_data;
        // $.ajax({
        //     url: XHW.C.http.baseUrl + '/currentReal?ele=PHEN&station=' + XHW.C.http.zunYi_station,
        //     dataType: 'json',
        //     async: false,
        //     success: function (res) {
        //         if(res.status_code != 0){
        //             console.log('数据错误');
        //             return;
        //         }              
        //         wea_data = res.data;
        //         return wea_data;
        //     }
        // })
        
        var markers = [];
        var zoom = XHW.map.getView().getZoom(); //  9-11
        for(var key in json){
            if(zoom < 11 && key.length != 9)continue;
            if(!json[key]['LON'] || !json[key]['LAT'] || !json[key][elem])continue;
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(json[key]['LON']), parseFloat(json[key]['LAT'])]))
            })
            var ele_val = Math.round(json[key][elem]);
            var elemVal = elem.indexOf('RAIN') != -1 ? rn(ele_val,unit) : ele_val + unit;
            // var imgSrc = wea_data[key]['PHEN'];
            var imgSrc = key.length == 9 ? 'dian07' : 'dian01';
            var size = key.length == 9 ? '1.5' : '1';
            marker.setStyle(new ol.style.Style({
                // image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                //     crossOrigin: 'anonymous',
                //     src: './img/halfhour_icon/cww'+imgSrc+'.png',
                //     scale: 0.2,
                // })),  
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    crossOrigin: 'anonymous',
                    src: './img/'+imgSrc+'.jpg',
                    scale: size,
                })),    
                text: new ol.style.Text({ 
                    textAlign: "center",
                    textBaseline: "middle",
                    // font: '10px Normal Arial',
                    font: '14px bold Arial',                                
                    text: json[key]['NAME']+ ': ' + elemVal,
                    fill: new ol.style.Fill({    //文字填充色
                        // color: '#32C2FD',
                        color: 'black'
                    }),                            
                    // offsetX: 10,
                    offsetY: 12,
                })                                        
            }));

            markers.push(marker);
        }
        let source = new ol.source.Vector({
            features: markers
        });

        return source;
    }
    //  烟站source
    function drawMark_yanzhan(json,unit,elem){
        //  天气图标数据
        // var wea_data;
        // $.ajax({
        //     url: XHW.C.http.tobaccoUrl + '/actually/getSensorCurrentActually?ele=PHEN',
        //     dataType: 'json',
        //     async: false,
        //     success: function (res) {
        //         if(res.status_code != 0){
        //             console.log('数据错误');
        //             return;
        //         }              
        //         wea_data = res.data;
        //         return wea_data;
        //     }
        // })

        //  烟站对应要素数据
        var markers = [];
        for(var key in json){
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(json[key]['LON']), parseFloat(json[key]['LAT'])]))
            })
            var ele_val = Math.round(json[key][elem]);
            var elemVal = elem.indexOf('RAIN') != -1 ? rn(ele_val,unit) : ele_val + unit;
            // var imgSrc = wea_data[key]['PHEN'];
            marker.setStyle(new ol.style.Style({       
                // image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                //     crossOrigin: 'anonymous',
                //     src: './img/halfhour_icon/cww'+imgSrc+'.png',
                //     scale: 0.2,
                // })),  
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    crossOrigin: 'anonymous',
                    src: './img/dian09.jpg',
                    scale: 1.5,
                })),     
                text: new ol.style.Text({ 
                    textAlign: "center",
                    textBaseline: "middle",
                    font: '14px bold Arial',                            
                    text: json[key]['NAME']+ '(烟站): ' + elemVal,
                    fill: new ol.style.Fill({    //文字填充色
                        color: 'black'
                    }),   
                    // backgroundFill:new ol.style.Fill({
                    //     color:'rgba(255,51,0,1)'
                    // }),
                    offsetY: 12,                      
                })                                        
            }));
            markers.push(marker);
        }
        let source = new ol.source.Vector({
            features: markers
        });

        return source;
    }

    function rn(val,unit) {
        if(val === 0){
            return '无降水';
        }else if(val === '' || val == -9999){
            return '缺测';
        }else{
            return val + unit;   
        } 
    }
    
    return {
        drawMark: drawMark,
        drawMark_yanzhan: drawMark_yanzhan
    }
});