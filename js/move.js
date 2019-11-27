// 移动
function dragPanelMove(downDiv,moveDiv){
$(downDiv).css("cursor","move");
$(downDiv).mousedown(function (e) {
        var isMove = true;
        var div_x = e.pageX - $(moveDiv).offset().left;
        var div_y = e.pageY - $(moveDiv).offset().top;
        
        $(document).mousemove(function (e) {
            var oEvent = e||event;
            var l = oEvent.clientX - div_x;
            var t = oEvent.clientY - div_y;
            if(l < 0){
                l = 0;
            }else if(l >document.documentElement.clientWidth - $(moveDiv).offsetWidth){
                l = document.documentElement.clientWidth - $(moveDiv).offsetWidth;
            };
            if(t < 0){
                t = 0;
            }else if(t >document.documentElement.clientHeight - $(moveDiv).clientHeight){
                t = document.documentElement.clientHeight - $(moveDiv).clientHeight;
            };
            if (isMove) {
                var obj = $(moveDiv);
                obj.css({"left":l, "top":t});
            }
        }).mouseup(
            function () {
            isMove = false;
        });
    });
}