/**
@describe tab 切换
@create By Damon.Dwq
@contact qq361904805	
@time 2015-02-05 16:28:29
@last time 2015-02-14 11:53:47
**/

//=======API========
/* 
注：引入jq
	Tab({
	 	"navs":$('.navs input'), //点击对象
	  	"evens":"mouseover", //事件名
	  	"conts":$('.conts .item'), //内容对象
	  	"activeClass":'hover', //高亮样式
	  	"num":"0" //默认传值
	})

	方法：
	setSwitchTo  默认切换到

	setContent({
		index:i,
		cont: html
	})

	getActive 返回index值


*/
window.dwq = {};
dwq.com={};

(function($){
	

	var ns = dwq.com;

	ns.Tab = function (options){
		this.opts ={
				navs          :    $('.navs input'),
				type          :    "click",
				conts   	  :    $('.conts .item'),
				activeClass   :    'active',
				num   		  :    "0",
				switchTo   	  :    "0",
				callback      :    null
		}
		this.config = $.extend(this.opts, options || {});
		this.init();
	}



	ns.Tab.prototype={
		init:function(){

			var that = this;

			that.handler();

		},
		handler:function(){
			var cg = this.config;
			
			cg.navs.on(cg.type,function(){
				var that=$(this);
				var i = that.index();
				//debugger;
				cg.navs.removeClass(cg.activeClass);
				that.addClass(cg.activeClass);
				cg.conts.hide();
				cg.conts.eq(i).show();

				 // 切换完 添加回调函数
               cg.callback && $.isFunction(cg.callback) && cg.callback(i);

			})

			if(cg.switchTo){
				var index=cg.switchTo;
				this.setSwitchTo(index);
			}

		},
		setSwitchTo:function(index){
			var cg = this.config;
			var that=this;

			cg.navs.removeClass(cg.activeClass);
			cg.navs.eq(index).addClass(cg.activeClass);

			cg.conts.hide();
			cg.conts.eq(index).show();

			return this;
		},
		getActive:function(){
			var cg = this.config;

			var oActive=cg.navs;

			var index=$("."+cg.activeClass).index();

			return index;

		},
		setContent:function(options){
			var opts=$.extend(options||{});

			var i=opts.index,cont=opts.cont;

			var cg = this.config;
			
			cg.conts.eq(i).html(cont)

		}
	}

})(jQuery)
	

