define([], function() {
    function buildFeatures(type, resultgeojson) {
        // var canvasData = [];
        var resfeatures = [];
        var features = resultgeojson.features;
        var colorBar = resultgeojson.colorbar;
        if (!features) {
            return;
        };
        for (var i = 0; i < features.length; i++){
            var feature = features[i];
            var properties = feature.properties;
            var coordinates = feature.geometry.coordinates;
            var pointType = feature.geometry.type;
            let polygonArr = [];
            var lnglats = [];
            if(pointType == 'Polygon'){
                for(var j = 0; j < coordinates.length; j++) {
                    if(coordinates[j].length == 0)continue;
                    if (coordinates[j].length > 2){
                        for(var k = 0; k < coordinates[j].length; k++) {
                            lnglats.push(ol.proj.fromLonLat([coordinates[j][k][0], coordinates[j][k][1]]));                        
                        }
                          polygonArr.push(lnglats);
                            lnglats = [];
                    } else {
                        lnglats.push(ol.proj.fromLonLat([coordinates[j][0], coordinates[j][1]]));
                    }
                }
            }else{
                for(var j = 0; j < coordinates.length; j++) {
                    if(coordinates[j].length == 0)continue;                  
                    for(var k = 0; k < coordinates[j].length; k++) {
                        if (coordinates[j][k].length > 2){
                            for(let l = 0; l < coordinates[j][k].length; l++){
                                lnglats.push(ol.proj.fromLonLat([coordinates[j][k][l][0], coordinates[j][k][l][1]])); 
                            }
                            polygonArr.push(lnglats);
                            lnglats = [];         
                        } else {
                            lnglats.push(ol.proj.fromLonLat([coordinates[j][k][0], coordinates[j][k][1]]));
                        }
                    }                                             
                }
            }
            
            if (lnglats && lnglats.length > 0){
                polygonArr.push(lnglats);
            }
            var resfeature = new ol.Feature({
                geometry: new ol.geom.Polygon(polygonArr),
                //geometry: new ol.geom.LineString(lnglats),'rgba(255, 130, 130, 0.35)'
            });
            // var linecolor = 'rgba(' + properties.lineColor + ')';
            var fillcolor = 'rgba(' + properties.fillColor + ')';
            let style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 1,
                    color: properties.fill
                }),
                fill:new ol.style.Fill({
                    color: fillcolor
                    // color: 'rgba(240,185,0,1)'
                }),
                text: buildWarningText(properties.sLevel+'',properties.fill)
                // text: buildWarningText(getTypeValueDesc(type, properties.sLevel, properties.eLevel))
            });
            resfeature.setStyle(style);
            resfeatures.push(resfeature);
            // if(properties.sLevel && properties.sLevel!=undefined && properties.sLevel!=null && properties.sLevel!=''){           
            //     canvasData.push([fillcolor, properties.sLevel]); 
            // }
                      
        }

        //  图例的生成画法
        // let res={};
        // //  二维数组去重
        // canvasData.forEach(item=>{
        //     item.sort((a,b)=>a-b);
        //     res[item]=item;
        // });
        // var cavdata = Object.values(res);

        
        var canvas = document.getElementById("cav");
            // canvas.width = 340;
            canvas.width = 640;
            canvas.height = 45;
            var context = canvas.getContext("2d");
        for(let i = 0; i < colorBar.color.length; i++){
            // let legendWidth = 280 / colorBar.color.length;
            let legendWidth = 580 / colorBar.color.length;
            let left = 10 + i * legendWidth;
            createRect(context,left,10,legendWidth,15,colorBar.color[i],"black",1,colorBar.levels[i]);
        }
        context.font = "16px bold 黑体";
        context.fillText(unit(type) , 612, 20);
        $('#LegendMapDiv').show();
        return resfeatures;
    }

    function getTypeValueDesc(type, svalue, evalue) {
        if (type && svalue && evalue) {
            
            switch(type){
                case 'soil_tt': return '土壤温度：' + '≥' + svalue + '℃';
                case 'soil_rh': return '土壤湿度：' + '≥' + svalue + '%';
                // case 'WSR5YJ': return '≥' + svalue  + 'm/s';
                case 'fc_rn':
                case 'live_rn': return '降水量：' + '≥' + svalue + 'mm';
                case 'live_rh': return '湿度：' + '≥' + svalue + '%';
                case 'fc_t':
                case 'fc_maxt':
                case 'fc_mint':
                case 'live_t': return '温度：' + svalue + '℃';
            }
        }else{
            return '';
        }
    }

    function unit(type) {
        if (type) {           
            switch(type){
                case 'fc_rn':
                case 'live_rn': return  '(mm)';
                case 'soil_rh':
                case 'live_rh': return  '(%)';
                case 'fc_t':
                case 'fc_maxt':
                case 'fc_mint':
                case 'live_t':
                case 'soil_tt': return  '(℃)';
            }
        }else{
            return '';
        }
    }

    function buildWarningText(text, background) {
        let textColor = 'black';
        return new ol.style.Text({
            font: 'normal 18px 微软雅黑',
            text: text,
            // fill: new ol.style.Fill({    //文字填充色
            //     color: 'rgba(255,251,240,0.4)',
            // }),
            placement:'point',
            // stroke: new ol.style.Stroke({
            //     color: 'red',
            //     lineCap: 'round',
            //     lineJoin: 'round',
            //     width: 3,
            // }),
            rotation:0,
            scale: 1,
            overflow: true,
            // maxAngle: Math.PI / 12,
            textBaseline: 'middle',
        });
    }
   
    

    function createRect(context,sx,sy,width,height,fillColor,strokeColor,lineW,text){
        context.lineWidth = lineW;

        context.beginPath();
        context.rect(sx, sy, width, height);
        context.closePath();
        
        context.fillStyle = 'rgba(' + fillColor + ')';
        context.strokeStyle = strokeColor;

        context.fill();
        context.stroke();

        context.font = "14px bold 黑体";
        // 设置颜色
        context.fillStyle = "white";
        // 设置水平对齐方式
        context.textAlign = "center";
        // 设置垂直对齐方式
        context.textBaseline = "middle";
        // 绘制文字（参数：要写的字，x坐标，y坐标）
        // context.fillText(text, sx+21, sy+25);
        text = text == undefined ? '' : text;
        context.fillText(text, sx+2, sy+25);

    }
    return {
        buildFeatures:buildFeatures,
    }
});