define([], function() {
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

    // 小于10前面加'0'
    function toTwo(time){
        time = time+'';
       return time.length < 2 ? "0"+time : time;
    }
    
    
    // 以当前时间为准，获取前后时间的对象
    function getDay(day){        
        var today = new Date();       
        var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;    
        today.setTime(targetday_milliseconds);            
        var tYear = today.getFullYear();     
        var tMonth = today.getMonth();      
        var tDate = today.getDate();   
        tYear = toTwo(tYear);     
        tMonth = toTwo(tMonth + 1);   
        tDate = toTwo(tDate);  
        // return tYear+"-"+tMonth+"-"+tDate; 
        return {
            tYear: tYear,
            tMonth: tMonth,
            tDate: tDate
        }
    }    

    //时间对象
    function init(){
        var time = new Date();
        XHW.time.year = time.getFullYear();
        XHW.time.month = toTwo(time.getMonth() + 1);
        XHW.time.day = toTwo(time.getDate());
        XHW.time.hour = toTwo(time.getHours());
    }
    init();

    return{
        toTwo:toTwo,
        getDay:getDay,
        dragPanelMove:dragPanelMove
    }

});

