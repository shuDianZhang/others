




浏览器渲染页面的过程：
  1. 获取DOM后分割为多个图层
  2. 对每个图层的节点计算样式结果（Recalculate style--样式重计算）
  3. 为每个节点生成图形和位置（Layout--回流和重布局）
  4. 将每个节点绘制填充到图层位图中（Paint Setup和Paint--重绘）
  5. 图层作为纹理上传至GPU
  6. 符合多个图层到页面上生成最终屏幕图像（Composite Layers--图层重组）

回流和重布局：代价非常高

重绘：代价稍低

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