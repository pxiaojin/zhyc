define([], function() {
    
    function closeFunction() {
        for (let key in XHW.F) {
            if (XHW.F[key] && XHW.F[key].close ) {
                    XHW.F[key].close();
            }
        }
        $('.delete_only').hide();
    }
    
    return {
        closeLayer: closeFunction
    }
});