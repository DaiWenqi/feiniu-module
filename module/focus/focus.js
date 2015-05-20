
/*
* jQuery图片轮播(焦点图)插件
*/
(function ($) {
    $.fn.slideBox = function (options) {
        var defaults = {
            direction: 'left',
            duration: 0.6,
            easing: 'swing',
            delay: 3,
            startIndex: 0,
            hideClickBar: true,
            clickBarRadius: 5,
            hideBottomBar: false
        };
        var settings = $.extend(defaults, options || {});
        var wrapper = $(this),
        ul = wrapper.children('ul.items'),
        lis = ul.find('li'),
        firstPic = lis.first().find('img');
        var li_num = lis.size(),
        li_height = 0,
        li_width = 0;
        var order_by = 'ASC';
        var init = function () {
            if (!wrapper.size()) return false;
            li_height = lis.first().height();
            li_width = lis.first().width();
            wrapper.css({
                width: li_width + 'px',
                height: li_height + 'px'
            });
            lis.css({
                width: li_width + 'px',
                height: li_height + 'px'
            });
            if (settings.direction == 'left') {
                ul.css('width', li_num * li_width + 'px')
            } else {
                ul.css('height', li_num * li_height + 'px')
            };
            ul.find('li:eq(' + settings.startIndex + ')').addClass('active');
            if (!settings.hideBottomBar) {
                var tips = $('<div class="tips"></div>').css('opacity', 0.6).appendTo(wrapper);
                var title = $('<div class="title"></div>').html(function () {
                    var active = ul.find('li.active').find('a'),
                    text = active.attr('title'),
                    href = active.attr('href');
                    return $('<a>').attr('href', href).text(text)
                }).appendTo(tips);
                var nums = $('<div class="nums"></div>').hide().appendTo(tips);
                lis.each(function (i, n) {
                    var a = $(n).find('a'),
                    text = a.attr('title'),
                    href = a.attr('href'),
                    css = '';
                    i == settings.startIndex && (css = 'active');
                    $('<a>').attr('href', href).text(text).addClass(css).css('borderRadius',
settings.clickBarRadius + 'px').mouseover(function () {
    $(this).addClass('active').siblings().removeClass('active');
    ul.find('li:eq(' + $(this).index() + ')').addClass('active').siblings
().removeClass('active');
    start();
    stop()
}).appendTo(nums)
                });
                if (settings.hideClickBar) {
                    tips.hover(function () {
                        nums.animate({
                            top: '0px'
                        },
                        'fast')
                    },
                    function () {
                        nums.animate({
                            top: tips.height() + 'px'
                        },
                        'fast')
                    });
                    nums.show().delay(2000).animate({
                        top: tips.height() + 'px'
                    },
                    'fast')
                } else {
                    nums.show()
                }
            };
            lis.size() > 1 && start()
        };
        var start = function () {
            var active = ul.find('li.active'),
            active_a = active.find('a');
            var index = active.index();
            if (settings.direction == 'left') {
                offset = index * li_width * -1;
                param = {
                    'left': offset + 'px'
                }
            } else {
                offset = index * li_height * -1;
                param = {
                    'top': offset + 'px'
                }
            };
            wrapper.find('.nums').find('a:eq(' + index + ')').addClass('active').siblings().removeClass
('active');
            wrapper.find('.title').find('a').attr('href', active_a.attr('href')).text(active_a.attr
('title'));
            ul.stop().animate(param, settings.duration * 1000, settings.easing,
            function () {
                active.removeClass('active');
                if (order_by == 'ASC') {
                    if (active.next().size()) {
                        active.next().addClass('active')
                    } else {
                        order_by = 'DESC';
                        active.prev().addClass('active')
                    }
                } else if (order_by == 'DESC') {
                    if (active.prev().size()) {
                        active.prev().addClass('active')
                    } else {
                        order_by = 'ASC';
                        active.next().addClass('active')
                    }
                }
            });
            wrapper.data('timeid', window.setTimeout(start, settings.delay * 1000))
        };
        var stop = function () {
            window.clearTimeout(wrapper.data('timeid'))
        };
        wrapper.hover(function () {
            stop()
        },
        function () {
            start()
        });
        var imgLoader = new Image();
        imgLoader.onload = function () {
            imgLoader.onload = null;
            init()
        };
        imgLoader.src = firstPic.attr('src')
    }
})(jQuery);