浏览器渲染页面的过程：

(1)构建DOM树,构建渲染树
    html解析成domTree; css解析生成cssRuleTree(CSS样式规则);这两者结合生成renderingTree(渲染树) 

(2)布局(layout)渲染树     
    计算每个DOM元素最终在屏幕上显示的大小和位置   

(3)绘制(paint)渲染树
    渲染引擎会遍历渲染树，由用户界面后端层将每个节点绘制出来，按照合理的顺序合并图层然后显示到屏幕上。

重绘(repaint)：
    代价稍低    -> 引起的原因： 改变的是集合形状，比如改变了背景颜色，这就会触发重绘。

修改时只触发重绘的属性： 
* color
* border-style
* border-radius
* visibility
* text-decoration
* background
* background-image
* background-position
* background-repeat
* background-size
* outline-color
* outline
* outline-style
* outline-width
* box-shadow


回流(reflow)和重布局：
   代价非常高  -> 引起的原因： 元素的尺寸变化，修改盒子模型的相关属性也会触发。

盒子模型相关属性会触发重布局：        定位属性及浮动也会触发重布局：        改变节点内部文字结构也会触发重布局：
* width                            * top                               * text-align
* height                           * bottom                            * overflow-y
* padding                          * left                              * font-family
* margin                           * right                             * line-height
* display                          * position                          * font-size
* border-width                     ...                                 * vertival-align
* border                                                               ...
* min-height
...


css3中的GPU硬件加速模式：

浏览器接收到页面文档后，会将文档中的标记语言解析为DOM树。DOM树和CSS结合后形成浏览器构建页面的渲染树。
渲染树中包含了大量的渲染元素，每一个渲染元素会被分到一个图层中，每个图层又会被加载到GPU形成渲染纹理，
而图层在GPU中 transform 是不会触发 repaint 的，这一点非常类似3D绘图功能，最终这些使用 transform 的
图层都会由独立的合成器进程进行处理。


如何开启GPU硬件加速模式：
CSS中以下属性 transitions、transforms、Opacity、等以下属性来触发GPU硬件加速
如： -webkit-transform:transition3d(0,0,0) 
    -webkit-transform:translateZ(0);



transform执行顺序： 从右往左执行
@keyframes foo {
 to {    
   transform: rotate(90deg) translateX(30px) scale(1.5);
 }
}



关于一些css样式性能优化的最佳实践

1. 不要一个一个地单独修改属性，最好通过一个classname来定义这些修改

// badWay
var left = 10,
    top = 10;
el.style.left = left + "px";
el.style.top  = top  + "px";
 
// better 
el.className += " theclassname";

2. 把对节点的大量修改操作放在页面之外
   //badWay
   通过 display: none 来隐藏节点（直接导致一次重排和重绘），做大量的修改，然后显示节点（又一次重排和重绘），总共只会有两次重排。
   //better
   (1)用 documentFragment来做修改
   (2)clone 节点，在clone之后的节点中做修改，然后直接替换掉以前的节点

3. 不要频繁获取计算后的样式。如果你需要使用计算后的样式，最好暂存起来而不是直接从DOM上读取。   
   