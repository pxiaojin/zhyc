define([], function() {
    function buildIsolinesSource(data) {

        let feature = [];
        for(let i = 0; i < data.lines.length; i++) {
            let lineData = data.lines[i];
            let lnglats = smoothIsoline(lineData);
            if (!lnglats || lnglats.length <= 0)
                continue;
            let color = "#" + ((1 << 24) + (lineData.lineColor.r << 16)     //颜色转为16进制
                + (lineData.lineColor.g << 8) + lineData.lineColor.b).toString(16).slice(1);
            let textBackgroundColor = color ;
            let line = new ol.Feature({
                geometry: new ol.geom.LineString(lnglats)
            });
            line.setStyle(buildIsolineStyle(lineData.val + '', lineData.lineWidth, color, 'blank', textBackgroundColor));

            feature.push(line);
        }
        return new ol.source.Vector({
            features: feature
        });
    }

    function buildImagesSource(imgUrl, data){
        let slat = data.elat;
        let slng = data.slng;
        let elat = data.slat;
        let elng = data.elng;
        let xD = Math.abs(elng - slng) / data.col;
        let yD = Math.abs(elat - slat) / data.row;
        let sources = [];

        for(let i = 0; i < data.files.length; i++){
            //！！！图片排列方式为从地图左上角至右下角
            let x = data.files[i].split('_')[1].split('.')[0];
            let y = data.files[i].split('_')[0];

            //贴图方式为左下角至右上角
            let start = ol.proj.fromLonLat([slng + x * xD, slat - (parseInt(y) + 1) * yD]);
            let end = ol.proj.fromLonLat([slng + (parseInt(x) + 1) * xD, slat - y * yD]);
            let extent = [start[0], start[1], end[0], end[1]];

            sources.push(new ol.source.ImageStatic({
                url: imgUrl + data.url + data.files[i] + '.mkt',
                imageExtent: extent
            }));
        }
        return sources;
    }

    function buildImageSource(imgUrl, data){
        let slat = data.elat;
        let slng = data.slng;
        let elat = data.slat;
        let elng = data.elng;

        //贴图方式为左上角至右下角
        let start = ol.proj.fromLonLat([slng, elat]);
        let end = ol.proj.fromLonLat([elng , slat]);
        let extent = [start[0], start[1], end[0], end[1]];

        return new ol.source.ImageStatic({
            url: imgUrl + data.url + '.mkt.png',
            imageExtent: extent
        });
    }

    return {
        buildIsolinesSource: buildIsolinesSource,
        buildImageSource:buildImageSource,
        buildImagesSource: buildImagesSource,
    }
});