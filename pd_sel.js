var pd_sle=(function ($) {
    var dataArr=[]
    var title
    var selectName

    var clientY=0
    var moveY=0
    var index_1=0
    var index_2=0
    var list_1_y=0
    var list_2_y=0
    var callFunc
    var keyName
    var openView=false
    var childName=''
    /**
     *  创建下拉框
     * @param {Array} arr 选项
     * @param {String} tit 提示语
     * @param {Function} callFun 回调函数
     * @param {String} key 选中项渲染的key
     */
    $.fn.createSelect=function createSelect(arr,tit='请选择',key='name',child='children',callFun='') {
        if(openView)return
        openView=true

        document.documentElement.style.overflowY = 'hidden'; 
        dataArr=arr
        title=tit
        selectName='#'+$(this).attr('id')
        index_1=0
        index_2=0
        list_1_y=0
        list_2_y=0
        callFunc=callFun
        keyName=key
        childName=child
        $('body').append('\
            <div id="pd_sel" class="cube-popup" style="z-index: 100;">\
                <div class="cube-popup-mask" onclick="pd_sle.cliCancel()"></div> \
                <div class="cube-popup-container">\
                    <div class="cube-popup-content trans2">\
                        <div class="cube-picker-panel cube-picker-active">\
                            <div class="cube-picker-choose border-bottom-1px">\
                                <span class="cube-picker-cancel" onclick="pd_sle.cliCancel()">取消</span> \
                                <span class="cube-picker-confirm" onclick="pd_sle.cliComfirm()">确定</span> \
                                <div class="cube-picker-title-group">\
                                    <h1 class="cube-picker-title">'+tit+'</h1> \
                                </div>\
                            </div> \
                            <div class="cube-picker-content" >\
                                    <i class="border-bottom-1px"></i> \
                                    <i class="border-top-1px"></i> \
                                    <div class="cube-picker-wheel-wrapper">\
                                        <div ontouchstart="pd_sle.downDiv(event,\'index_1\')" ontouchmove="pd_sle.moveDiv(event,\'index_1\')" ontouchend="pd_sle.moveUp(event,\'index_1\')">\
                                            <ul class="cube-picker-wheel-scroll" id="ul_1"   style=" transform: translate(0px, 0px);">\
                                            </ul>\
                                        </div>\
                                    </div>\
                            </div>\
                        </div> \
                        <div class="cube-picker-footer">\
                        </div>\
                    </div>  \
                </div> \
            </div>\
        ')
        var t=typeof dataArr[0]
        if(t=='string'){
            for(var i=0;i<dataArr.length;i++){
                $('#ul_1').append('\
                    <li class="cube-picker-wheel-item" >'+dataArr[i]+'</li>\
                ')
            }
        }else{
            for(var i=0;i<dataArr.length;i++){
                $('#ul_1').append('\
                    <li class="cube-picker-wheel-item" >'+dataArr[i][key]+'</li>\
                ')
            }
        }
        
        randerChildren()
        setTimeout(function(){
            $('.cube-popup-mask').addClass('opacity')
            $('.cube-picker-panel').removeClass('cube-picker-active')
        }, 100);
    }
    function cliCancel() {
        $('.cube-popup-mask').removeClass('opacity')
        $('.cube-picker-panel').addClass('cube-picker-active')
        setTimeout(function(){
            $('#pd_sel').remove()
            document.documentElement.style.overflowY = 'scroll'; 
            openView=false
        }, 300);
        
    }
    function cliComfirm() {
        $('#pd_sel').remove()
        try{
            var value=dataArr[index_1][childName][index_2][keyName]
        }catch{
            var t=typeof dataArr[index_1]
            if(t=='string'){
                var value=dataArr[index_1]
            }else{
                var value=dataArr[index_1][keyName]
            }
            
        }
        
        $(selectName).text(value)
        $(selectName).val(value)
        if(callFunc!=''){
            var obj={}
            obj=dataArr[index_1]
            try{
                obj=dataArr[index_1][childName][index_2]
            }catch{}
            
            callFunc(obj)
        }
        cliCancel()
    }
    
    //鼠标按下函数
    function downDiv(e,key) {
        moveY=0
        clientY=Number(e.targetTouches[0].clientY)
    }
    
    //鼠标移动函数
    function moveDiv(e,key) {
        var ul=$(e.currentTarget).children('.cube-picker-wheel-scroll')
        var y=Number(e.targetTouches[0].clientY)
        var max=0
        var min=-36*(ul.children().length-1)
        moveY=y-clientY
        if(key=='index_1'){
            if(list_1_y+moveY>max || list_1_y+moveY<min){
                moveY=moveY/3
            }
            list_1_y+=moveY
            runDiv(ul,list_1_y)
        }else{
            if(list_2_y+moveY>max || list_2_y+moveY<min){
                moveY=moveY/3
            }
            list_2_y+=moveY
            runDiv(ul,list_2_y)
        }
        clientY=y
        
    }
    function moveUp(e,key) {
        var ul=$(e.currentTarget).children('.cube-picker-wheel-scroll')
        var max=0
        var min=-36*(ul.children().length-1)
        if(key=='index_1'){
            list_1_y>max?list_1_y=max:false
            list_1_y<min?list_1_y=min:false
            index_1=Math.round(list_1_y/36)
            list_1_y=36*index_1
            index_1=Math.abs(index_1)
            runDiv(ul,list_1_y)
            $('#div_2').remove()
            index_2=0
            randerChildren()
        }else{
            list_2_y>max?list_2_y=max:false
            list_2_y<min?list_2_y=min:false
            index_2=Math.round(list_2_y/36)
            list_2_y=36*index_2
            index_2=Math.abs(index_2)
            runDiv(ul,list_2_y)
        }
        
    }
    function runDiv(ul,v) {
        var deg='translate(0,'+v+'px)'
        ul.css('transform',deg)
    }
    function randerChildren() {
        try{
            if(dataArr[index_1][childName]){
             $('.cube-picker-wheel-wrapper').append('\
                 <div id="div_2" ontouchstart="pd_sle.downDiv(event,\'index_2\')" ontouchmove="pd_sle.moveDiv(event,\'index_2\')" ontouchend="pd_sle.moveUp(event,\'index_2\')" >\
                     <ul class="cube-picker-wheel-scroll" id="ul_2" style=" transform: translate(0px, 0px);">\
                     </ul>\
                 </div>\
             ')
            }
             for(var j=0;j<dataArr[index_1][childName].length;j++){
                 $('#ul_2').append('\
                 <li class="cube-picker-wheel-item" >'+dataArr[index_1][childName][j].name+'</li>\
                 ')
             }
         }catch{
     
         }
    }
    return {
        cliCancel: cliCancel,
        moveUp: moveUp,
        moveDiv:moveDiv,
        cliComfirm:cliComfirm,
        downDiv:downDiv,
　　};
})(jQuery)