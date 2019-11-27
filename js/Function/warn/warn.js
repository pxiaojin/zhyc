define([], function() {
    var warn = {};
    function init(){
    
        //  气象灾害 
        require(['Function/warn/meteoWarn'], function(meteoWarn){
            warn.meteoWarn = meteoWarn;
        })


    }

       /**
     * 关闭某一功能
     * @param {*} type 功能类型（null时指全部）
     */
    function close(type){
        if(type) {
            if(warn[type])
            warn[type].close ? warn[type].close() : null;
        } else {
            for(var key in warn) {
                warn[key].close ? warn[key].close() : null;
            }
        }
    }
    
    return {
        init:init,
        close: close
    }
});
