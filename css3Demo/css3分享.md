浏览器渲染页面的过程：

(1)构建DOM树,构建渲染树
    html解析成domTree; css解析生成cssRuleTree(CSS样式规则);这两者结合生成renderingTree(渲染树) 

(2)布局(layout)渲染树     
    计算每个DOM元素最终在屏幕上显示的大小和位置   

(3)绘制(paint)渲染树
    渲染引擎会遍历渲染树，由用户界面后端层将每个节点绘制出来，按照合理的顺序合并图层然后显示到屏幕上。




重绘(repaint)：
    代价稍低    -> 引起的原因： 比如改变了背景颜色，这就会触发重绘。

回流(reflow)和重布局：
   代价非常高  -> 引起的原因： 元素的尺寸变化，修改盒子模型的相关属性也会触发。    



修改时只触发重绘的属性： 
* color
* border-style
* border-radius
* text-decoration
* background
* background-image
* background-position
* background-repeat
* background-size
* outline-style
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
    ->  -webkit-transform:transition3d(0,0,0)或-webkit-transform:translateZ(0);，这两个属性都会开启GPU硬件加速
    模式，从而让浏览器在渲染动画时从CPU转向GPU，，-webkit-transform:transition3d和-webkit-transform:translateZ其实是
    为了渲染3D样式，但我们设置值为0后，并没有真正使用3D效果，但浏览器却因此开启了GPU硬件加速模式。

gpu硬件加速的优点： 
    -> 解放cpu，通过gpu进行渲染
    -> css3硬件加速后，不会进行重绘（repaint）操作，而只会产生一个渲染图层，GPU就负责操作这个渲染图层。

gpu硬件加速的缺点：
    ->不能让每个元素都启用硬件加速，这样会占用很大的内存，使页面会有很强的卡顿感。
    ->由于GPU和CPU具有不同的渲染机制,GPU渲染会影响字体的抗锯齿效果。即使最终硬件加速停止了，文本还是会在动画期间显示得很模糊。    


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
   (1)用 documentFragment来做修改
      
      例：假如你需要将1000个 <li></li> 插入到文档当中，如果一个元素一个元素的进行插入，那么将会严重影响页面的性能。
             
             -> 不妨将使用 document.createElement('ul') 方法新建一个<ul></ul>节点，使用for循环将所
                有的<li></li>标签插入至新建的ul标签当中，最后一次性的将 ul 添加至目标文档当中。    
                
                ->更优的处理，定义文档碎片  var sliceBlock = document.createDocumentFragment(); 使用for循环将<li></li>添加至sliceBlock,
                  最后将sliceBlock添加至目标文档。

        document.createDocumentFragment() 对比 document.createElement()好在哪里？

            1.DocumentFragment 节点插入文档树时，插入的不是 DocumentFragment 自身，而是它的所有子孙节点。
              这使得 DocumentFragment 成了有用的占位符，暂时存放那些一次插入文档的节点。
            
            2.DocumentFragment不属于文档树，没有父节点，不是真实DOM树的其中一部分，它的变化不会引起DOM树的重新渲染的操作。      

            所以当需要进行大量DOM操作时，尽量使用DocumentFragement，它会让应用变的更快！ 

   
   
   (2)clone 节点，使用cloneNode()方法，在clone之后的节点中做修改，然后直接替换掉以前的节点

   (3)先将元素从document中删除，完成修改后再把元素放回原来的位置

   (4)将元素的display设置为”none”，完成修改后再把display修改为原来的值
   