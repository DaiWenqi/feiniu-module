/**
 * 简单的Tab切换
 * 支持可配置项 如下参数 
 */
    function Tab(){
        this.config = {
            type            : 'mouseover',    //类型 默认为鼠标移上去
            autoplay        : true,           // 默认为自动播放
            triggerCls      : '.navs input',        // 菜单项
            panelCls        : '.conts .item',  // 内容项
            index           : 0,              // 当前的索引0
            switchTo        : 0,              // 切换到哪一项
            interval        : 3000,              // 自动播放间隔时间 默认为3 以s为单位
            pauseOnHover    : true,           // 鼠标放上去是否为暂停 默认为true
            current         : 'active',      // 当前项添加到类名
            hidden          : 'hidden',       // 类名 默认为hidden
            callback        : null            // callback函数
        };
        this.cache = {
            timer : undefined,
            flag  : true
        };
    }
    Tab.prototype = {
        init: function(options){
            this.config = $.extend(this.config,options || {});
            var self = this,
                _config = self.config;
            self._handler();
        },
        _handler: function(){
            var self = this,
                _config = self.config,
                _cache = self.cache,
                len = $(_config.triggerCls).length;
            $(_config.triggerCls).unbind(_config.type);
            $(_config.triggerCls).bind(_config.type,function(){
                _cache.timer && clearInterval(_cache.timer);
                var index = $(_config.triggerCls).index(this);
                !$(this).hasClass(_config.current) && 
                $(this).addClass(_config.current).siblings().removeClass(_config.current);
                $(_config.panelCls).eq(index).removeClass(_config.hidden).siblings().addClass(_config.hidden);

                // 切换完 添加回调函数
                _config.callback && $.isFunction(_config.callback) && _config.callback(index);
            });
            // 默认情况下切换到第几项
            if(_config.switchTo) {
                $(_config.triggerCls).eq(_config.switchTo).addClass(_config.current).siblings().removeClass(_config.current);
                $(_config.panelCls).eq(_config.switchTo).removeClass(_config.hidden).siblings().addClass(_config.hidden);
            }
            // 自动播放
            if(_config.autoplay) {
                start();
                $(_config.triggerCls).hover(function(){
                    if(_config.pauseOnHover) {
                        _cache.timer && clearInterval(_cache.timer);
                        _cache.timer = undefined;
                    }else {
                        return;
                    }
                },function(){
                    start();
                });
            }
            function start(){
                _cache.timer = setInterval(autoRun,_config.interval);
            }
            function autoRun() {
                if(_config.switchTo && (_config.switchTo == len-1)){
                    if(_cache.flag) {
                        _config.index = _config.switchTo;
                        _cache.flag = false;
                    }
                }
                _config.index++;
                if(_config.index == len) {
                    _config.index = 0;
                }
                $(_config.triggerCls).eq(_config.index).addClass(_config.current).siblings().removeClass(_config.current);
                $(_config.panelCls).eq(_config.index).removeClass(_config.hidden).siblings().addClass(_config.hidden);
            }
        }
    };