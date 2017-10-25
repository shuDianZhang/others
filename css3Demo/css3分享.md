浏览器渲染页面的过程：
  1. 获取DOM后分割为多个图层
  2. 对每个图层的节点计算样式结果（Recalculate style--样式重计算）
  3. 为每个节点生成图形和位置（Layout--回流和重布局）
  4. 将每个节点绘制填充到图层位图中（Paint Setup和Paint--重绘）
  5. 图层作为纹理上传至GPU
  6. 符合多个图层到页面上生成最终屏幕图像（Composite Layers--图层重组）

解析html以构建dom树 -> 构建渲染树 -> 布局渲染树 -> 绘制渲染树

重绘：代价稍低 -> 引起的原因： 改变的是集合形状，比如改变了背景颜色，这就会触发重绘。

回流和重布局：代价非常高  -> 引起的原因： 元素的尺寸变化，

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
   