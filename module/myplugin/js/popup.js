/**
 @describe 弹窗
 @create By Damon.Dwq
 @contact qq361904805
 @time 2015-02-10 14:30:08
 @last time 2015-02-10 14:30:15
 @========使用API==========
    myPopup({
        "popHtml":popHtml_1,  //传入dom html字符串拼接
        "elem": ".creat_defeat", //dom id
        "close": ".pop_close,.btn_ok,.btn_cancle", //关闭按钮 class
        "okClass":".btn_ok", //确认按钮 class
        okFn:function(){alert("执行确认回调")},//确认回调
        "cancelClass":".btn_ok", //取消按钮 class
        cancelFn:function(){alert("执行确认回调")},//取消回调
        callBack:"", //回调函数
        noMask:true  //遮罩层
    })

    
    修复bug：面板大于可视区的高度情况 2015-02-10 14:34:17

 **/

// css loader: RequireJS & SeaJS
var cssUri = config.cssUri;

if (cssUri) {
//    var fn = require[require.toUrl ? 'toUrl' : 'resolve'];
		var css = '<link rel="stylesheet" href="' + cssUri + '" />';
        if ($('base')[0]) {
            $('base').before(css);
        } else {
            $('head').append(css);
        } 
    
}

//alert(config.cssUri)

(function($){
    

    myPopup = function(opts) {
        if (!(this instanceof myPopup)) {
            return new myPopup(opts);
        }

        if(opts.popHtml){
            this.popHtml=$(opts.popHtml);// +++++
            $('body').find("."+this.popHtml.attr("class")).remove();
            $('body').append(this.popHtml);
            this.elem = this.popHtml;
        } else {
            this.elem=$(opts.elem);
        }

        this.mask=$("<div id='mask'></div>");
        this.argMask=opts.noMask;
        this.close=$(opts.close);
        this.srollFn=function(){};
        this.confirm=$(opts.okClass)||$(defaulOptions.okClass);
        this.cancel=$(opts.cancelClass)||$(defaulOptions.cancelClass);
        this.confirmCallback=opts.okFn||defaulOptions.okFn;
        this.cancelCallback=opts.cancelFn||defaulOptions.cancelFn;
        this.callBack=opts.callBack;
        var _this=this;
        $(window).resize(function () {
            _this.maskFn(_this.argMask);
            _this.setPos();
        });

        this.iframe=$("<iframe id='iframe'></iframe>");

        this.pup();
    }
    //默认参数
    var defaulOptions = {
        "okClass" : null,
        "okFn" : function(){
                alert('默认确认回调')
        },
        "cancelClass" : null,
        "cancelFn" : function(){
            alert('默认')
        }
    };


    myPopup.prototype.showModel=function(){
        //var _this=$(this);
        this.elem.show();
    }
    myPopup.prototype.hideModel=function(){
        //var _this=$(this);
        this.elem.hide();
    }
	myPopup.prototype._$=function(data-id){
		return this.find('[data-id=' + data-id + ']');
	}
    //弹出
    myPopup.prototype.pup= function() {
        var _this=this;
        _this.maskFn(_this.argMask);
        _this.setPos();
        _this.close.bind("click",function(){
            _this.closeFn();
            $(this).unbind("click");
        });
        _this.confirm.bind("click",function(e){
            _this.confirmFn(e);
            $(this).unbind("click");
        });
        _this.cancel.bind("click",function(e){
            _this.cancelFn(e);
            $(this).unbind("click");
        });

        if(_this.callBack){
            _this.callBack();
        }
    }
    myPopup.prototype.setPos=function(){
        var _this=this
        var _width=_this.elem.width(), //获取弹出框宽度
            _height=_this.elem.height(),
            _top;
        if ('undefined' == typeof(document.body.style.maxHeight)) {//jq高版本写法
            var _srcoll_top=$(window).scrollTop();
            $(window).bind("scroll", function() {
                _this.srollFn()
            });
            _this.srollFn=function(){
                _top=$(window).scrollTop()+($(window).height()-_height)/2;
                _this.elem.css("top",_top);
            }
            _this.elem.css("position","absolute");
            _top=_srcoll_top+($(window).height()-_height)/2;

        } else {
            _this.elem.css("position","fixed");
            _top=($(window).height()-_height)/2;
        }
        //面板高度大于可视区的高度
        if(_height >= $(window).height()){
            _top=0;
            _this.elem.css({"position":"absolute"});            
        }
        //垂直居中
        var _left=(($(window).width())-_width)/2;
        //设置水平
        _this.elem.css({
            "top":  _top,
            "left": _left,
            "margin":0,
            "z-index":100
        }).fadeIn(200);
    }
    myPopup.prototype.closeFn= function() {
        var _this=this
        _this.elem.fadeOut(0);
        _this.mask.css("display","none");
        _this.mask.remove();
        _this.popHtml.remove();
        _this.iframe.css("display","none");
        $(window).unbind("scroll",_this.srollFn);
        $(window).unbind("resize");
    }
    //点击确认按钮
    myPopup.prototype.confirmFn= function(e) {
        var _this=this;
        _this.confirmCallback&&_this.confirmCallback.call(_this.elem[0],e);
        _this.elem.fadeOut(0);
        _this.mask.css("display","none");
        _this.mask.remove();
        _this.popHtml.remove();//+++++++
        _this.iframe.css("display","none");
        $(window).unbind("scroll",_this.srollFn);
        $(window).unbind("resize");


        console.log(_this.confirmCallback)

    }
    //点击取消按钮
    myPopup.prototype.cancelFn= function(e) {
        var _this=this;
        _this.cancelCallback&&_this.cancelCallback.call(_this.elem[0],e);
        _this.elem.fadeOut(0);
        _this.mask.css("display","none");
        _this.mask.remove();
        _this.popHtml.remove();//+++++++
        _this.iframe.css("display","none");
        $(window).unbind("scroll",_this.srollFn);
        $(window).unbind("resize");
    }

    myPopup.prototype.maskFn= function(a) {
        if(arguments[0]){
            return false;
        }
        var _this=this;
        var mask_height=Math.max($("body").height(),$(window).height());
        var mask_width=$("body").width();
        if ('undefined' == typeof(document.body.style.maxHeight)) {//jq高版本写法
            if(!$("#iframe")[0]){
                $("body").append(_this.iframe);
            }else{
                //alert(1)
                _this.iframe=$("#iframe");
            }
            _this.iframe.css({
                "width":  mask_width,
                "height": mask_height,
                "margin":0,
                "z-index":98,
                "opacity":0,
                "position": "absolute",
                "left": 0,
                "top":0,
                "display":"block"
            })
        }
        if(!$("#mask")[0]){
            $("body").append(_this.mask);
        }else{
            _this.mask=$("#mask");
        }
        _this.mask.css({
            "height":mask_height,
            "width":mask_width,
            "display":"block",
            "backgroundColor": "#000000",
            "opacity":0.7,
            "position":"absolute",
            "left":0,
            "top":0,
            "z-index":99
        })
    }
    myPopup.prototype.srcoll= function(_srcoll_top) {
        var _this=this
        var srcoll_top=$(window).scrollTop();
        if($.browser.msie && $.browser.version<7) {
            _this.elem.css("top",srcoll_top+_top-_srcoll_top);
        } else {
            _this.elem.css("top",_top)
        }
    }


})(jQuery);