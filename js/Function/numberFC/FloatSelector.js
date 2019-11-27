define([], function(){
    function on(selectorId, type, callBack, params) {
        let selector = $('#' + selectorId);
        if (selector) {
            if (callBack) {
                $('#' + selectorId + ' .floatMapDivTab').on(type, function(event) {
                    callBack(params);
                });
            }
        }
    }

    function open(selectorId) {
        let selector = $('#' + selectorId);
        if (selector) {
            selector.show();
        }
    }
    function getValue(selectorId,isStatistical){
        let selector = $('#' + selectorId);
        if (selector) {
            let currentBlue = isStatistical == 'true' ? selector.children('.currentBlue') : selector.children('.currentOrange');
            currentBlue = currentBlue ? currentBlue[0] : undefined;
            if (!currentBlue) {
                currentBlue = selector.children();
                currentBlue = currentBlue ? currentBlue[0] : undefined;
            }
            return currentBlue ? currentBlue.getAttribute('data-value') : undefined;
        }
    }

    function getYear(selectorId){
        let selector = $('#' + selectorId);
        if (selector) {
            let currentBlue = selector.children('.currentBlue');
            currentBlue = currentBlue ? currentBlue[0] : undefined;
            if (!currentBlue) {
                currentBlue = selector.children();
                currentBlue = currentBlue ? currentBlue[0] : undefined;
            }
            return currentBlue ? currentBlue.getAttribute('data-Year') : undefined;
        }
    }
    function getMonth(selectorId){
        let selector = $('#' + selectorId);
        if (selector) {
            let currentBlue = selector.children('.currentBlue');
            currentBlue = currentBlue ? currentBlue[0] : undefined;
            if (!currentBlue) {
                currentBlue = selector.children();
                currentBlue = currentBlue ? currentBlue[0] : undefined;
            }
            return currentBlue ? currentBlue.getAttribute('data-month') : undefined;
        }
    }

    function getValueDesc(selectorId) {
        let selector = $('#' + selectorId);
        if (selector) {
            let currentBlue = selector.children('.currentBlue');
            currentBlue = currentBlue ? currentBlue[0] : undefined;
            if (!currentBlue) {
                currentBlue = selector.children();
                currentBlue = currentBlue ? currentBlue[0] : undefined;
            }
            return currentBlue ? currentBlue.innerText : undefined;
        }
    }

    function getWea_warnValueDesc(selectorId) {
        let selector = $('#' + selectorId);
        if (selector) {
            let currentBlue = selector.children('.currentBlue');
            //当前时间若为5~9月份，默认显示“高温区”；当前时间若为10~4月份，默认显示“大风降温区”
            var month = Number(XHW.silderTime.month);
            var wea_warn_val = 5 <= month <= 9 ? currentBlue[0] : currentBlue[1];
            currentBlue = currentBlue ? wea_warn_val : undefined;
            if (!currentBlue) {
                currentBlue = selector.children();
                currentBlue = currentBlue ? wea_warn_val : undefined;
            }
            return currentBlue ? currentBlue.innerText : undefined;
        }
    }

    function close(selectorId) {
        let selector = $('#' + selectorId);
        if (selector) {
            selector.hide();
        }
    }
    return {
        on: on,
        open: open,
        getValue: getValue,
        getYear:getYear,
        getMonth:getMonth,
        getValueDesc: getValueDesc,
        getWea_warnValueDesc: getWea_warnValueDesc,
        close:close
    }
});