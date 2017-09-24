/**
 * Created by 白色风车 on 2017/6/20.
 */
(function ($) {
    function preLoad(imgs,options) {
       this.imgs = (typeof imgs === 'string')?[imgs]:imgs;     //处理imgs传进来的是字符串的情况
       this.opts = $.extend({},preLoad.DEFAULT,options);
       this._unordered();
    }
    preLoad.DEFAULT = {
        each:null,
        all:null
    }
    preLoad.prototype._unordered = function () {
        var opts = this.opts;
        var count = 0;
        var imgs = this.imgs;
        $.each(imgs,function (index,item) {
            var imgObj = new Image();
            $(imgObj).on('load',function () {
                opts.each&&opts.each(count);                             //加载完每一张图片后执行
                if(count >= imgs.length-1){
                    opts.all&&opts.all();                          //加载完成所有图片后执行
                }
                count++;
            });
            imgObj.src = item;
        });
    }
    $.extend({
        preLoad:function (imgs,options) {
            new preLoad(imgs,options);
        }
    });
})(jQuery);