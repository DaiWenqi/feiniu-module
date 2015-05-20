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
	 	"navs":$('.navs li'), 点击事件
	  	"evens":"mouseover", 事件
	  	"conts":$('.conts .item'), 内容
	  	"activeClass":'hover' 高亮样式
	  	"num":"0" //默认传值
	})
*/



$.fn.tab=function(options){
	var opts={

		navs:"",
		usevent:"",
		conts:"",
		num:""

	}

	$.extend(opts,options);

	return this.each(function () {
		var that = $(this);
		
		
	})

}


function Tab(opts){
	if (!(this instanceof Tab)) {
		return new Tab(opts);
	}
	this.navs=opts.navs;
	this.evens=opts.evens;
	this.conts = opts.conts;
	this.activeClass = opts.activeClass;
	this.num=ops.num;
	this.init(this.num);
}

Tab.prototype.init=function(){
	var that=this;
	// alert(that.evens)


	that.navs.on(that.evens,function(){
		var i = $(this).index();
		that.fn(i);
	})

}

Tab.prototype.fn=function(i){
	var that=this;
	that.navs.eq(i).addClass(that.activeClass).siblings().removeClass(that.activeClass);
	that.conts.hide();
	that.conts.eq(i).show();

}