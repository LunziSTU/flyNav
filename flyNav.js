layui.define('jquery', function(exports) {
    "use strict";

    var $ = layui.$,
        MOD_NAME = 'flyNav',
        SHOW = 'layui-show',
        NAV_ELEM = '.fly-nav',
        NAV_BAR = '.fly-nav-bar',
        NAV_ITEM = 'fly-nav-item',
        NAV_CHILD = 'fly-nav-child',
        HAS_CHILD = 'fly-has-child',
        NAV_TREE = 'fly-nav-tree',
        THIS = 'layui-this',
        Hamburger = '.fly-nav-hamburger',
        FlyNav = function(){
            this.config = {};
        };

    //初始化元素操作
    FlyNav.prototype.init = function(){
        var timerMore = {},
            timeEnd = {},
            follow = function(navBar, index){
                var child = $(this).children('.'+NAV_CHILD);

                if(navBar.hasClass(NAV_TREE)){

                } else {
                    clearTimeout(timeEnd[index]);
                    if(child.css('display') === 'block'){
                        clearTimeout(timerMore[index]);
                    }
                    timerMore[index] = setTimeout(function(){
                        child.addClass(SHOW);
                    }, 300);
                }
            },
            //点击菜单 - a标签触发
            clickThis = function(){
                var othis = $(this)
                    ,navBar = $(NAV_BAR)
                    ,parent = othis.parent()
                    ,child = othis.siblings('.'+NAV_CHILD);

                if(!(othis.attr('href') !== 'javascript:;' && othis.attr('target') === '_blank')){
                    if(!child[0]){
                        navBar.find('.'+THIS).removeClass(THIS);
                        parent.addClass(THIS);
                    }
                }

                //如果是垂直菜单
                if(navBar.hasClass(NAV_TREE)){
                    //如果有子菜单，则展开
                    if(child[0]){
                        parent.siblings('.'+NAV_ITEM+'ed').removeClass(NAV_ITEM+'ed');
                        parent[child.css('display') === 'none' ? 'addClass': 'removeClass'](NAV_ITEM+'ed');
                    }
                }
            };

        $(NAV_ELEM).each(function(index){
            var othis = $(this),
                HasChildElem = othis.find('.'+HAS_CHILD),
                navBar = othis.find(NAV_BAR),
                itemElem = navBar.children('.'+NAV_ITEM),
                hamBurger = othis.find(Hamburger),
                itemWidth = 0,
                responsive = function(){
                    var navWidth = othis.width();
                    if(navWidth > itemWidth){
                        navBar.removeClass('fly-nav-tree');
                        navBar.show();
                        hamBurger.hide();
                    } else {
                        navBar.hide();
                        hamBurger.show();
                        navBar.addClass('fly-nav-tree');
                    }
                };

            itemElem.each(function () {
                itemWidth += $(this).width();
            });

            responsive();

            window.onresize = function(){
                responsive();
            };

            HasChildElem.on('mouseenter', function(){
                follow.call(this, navBar, index);
            }).on('mouseleave', function(){
                if(!othis.hasClass(NAV_TREE)){
                    clearTimeout(timerMore[index]);
                    var currentItem = $(this);
                    timerMore[index] = setTimeout(function(){
                        currentItem.find('.'+NAV_CHILD).removeClass(SHOW);
                    }, 300);
                }
            });

            hamBurger.on('click', function () {
                $('.'+NAV_TREE).toggle();
            });

            //展开子菜单
            itemElem.find('a').each(function(){
                var thisA = $(this)
                    ,parent = thisA.parent()
                    ,child = thisA.siblings('.'+NAV_CHILD);

                thisA.off('click', clickThis).on('click', clickThis); //点击菜单
            });
        });

    };

    FlyNav.prototype.render = FlyNav.prototype.init;

    var flyNav = new FlyNav();

    flyNav.render();

    exports(MOD_NAME, flyNav);
});