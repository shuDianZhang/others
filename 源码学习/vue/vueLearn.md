
 2017/10/25  0 ~ 300


      function toString(val) {
           return val == null
               ? ''
               : typeof val === 'object'
                 ? JSON.stringify(val, null, 8)     
                   : String(val)
       }
       alert(toString({name:'stream',age:'20'}));
       alert(toString([10,20,30]));


        // function makeMap(str, expectsLowerCase) {
        //     var map = Object.create(null);        //Object.create(); 函数  创建一个对象，该对象的原型对象为函数所传入的参数 即: map._proto_ = null;
        //     var list = str.split(',');
        //     for (var i = 0; i < list.length; i++) {
        //         map[list[i]] = true;
        //     }
        //     return expectsLowerCase
        //         ? function(val) { return map[val.toLowerCase()]; }
        //         : function(val) { return map[val]; }
        // }
        // var isBuiltInTag = makeMap('slot,component', true);
        // console.log(isBuiltInTag('slot'));

        // var arr = [1, 2, 3, 4, 5];
        // arr.reduce(function(a, b, index, arr) {
        //     console.log(a + " and " + b + " index:" + index);
        //     return a + b;
        // });

        // object.keys();             //返回一个数组，数组的值成为 传入对象的属性  或者 传入数组的索引值
        // Array.isArray(obj);        //判断object是否是一个数组      
        // arr.concat();
        // arr.reduce();
        // arr.very();

        /**  
        * 2017/10/26  300 ~ 500
        */
        // 扩展对象
        //    Object.preventExtensions()    不能对象添加新的属性
        //    Object.isExtensible()
        // 密封对象
        //    Object.seal()                 不能添加新的属性，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性，但可以修改已有属性的值
        //    Object.isSealed()
        // 冻结对象
        //   Object.freeze()                意味着对象永远不会改变
        //   Object.isFrozen()

        // var hasProto = '__proto__' in {};    // ie浏览器不支持 隐藏属性 __proto__ !!
        //         判断对象是否为数组/对象的元素/属性：
        //         格式：（变量 in 对象）......注意，，，
        // 　　    当“对象”为数组时，“变量”指的是数组的“索引”；

        // 　　    当“对象”为对象是，“变量”指的是对象的“属性”。
        // console.log(hasProto);


        /**
         * 2017/10/30  700 ~ 1080
         * /

        // 实例对象 instanceof 构造函数  （会爬原型链) object.hasOwnProperty(''); 不会爬原型链
        //  mdn上边的解释
        //  obj instanceof coustructor
        //  instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上。

        
        // Object.getOwnPropertyDescriptor();  返回一个json对象，例 ：{configurable: true, enumerable: true, value: "abc", writable: true}
        // var obj = {};
        // obj.newDataProperty = "abc";
        // var descriptor = Object.getOwnPropertyDescriptor(obj, "newDataProperty");
        // console.log(descriptor);

        // isFinite(num);    // 如果 number 是有限数字（或可转换为有限数字），那么返回 true。否则，如果 number 是 NaN（非数字），或者是正、负无穷大的数，则返回 false。


2017/10/31    1080 ~ 1700     ------------------------------------------------------------------------------------------------------------------------------------
     
        // 正则表达式的学习： 取值范围+量词                 取值范围 -> []    元字符匹配
        // function getType(fn) {
        //     var match = fn && fn.toString().match(/^\s*function (\w+)/);
        //     return match ? match[1] : ''
        // }
        // function testRex(){
        //     alert('hello');
        // }
        // console.log(getType(testRex));
        // console.log(testRex.toString());

microtask 和 macrotask

       macrotasks: setTimeout, setInterval, setImmediate, I/O, UI rendering
       microtasks: process.nextTick, Promises, Object.observe(废弃), MutationObserver

       在Nodejs事件循环机制中，有任务两个队列：Macrotask队列和Microtask队列。在一个事件循环里，这两个队列会
       分两步执行，第一步会固定地执行一个（且仅一个）Macrotask任务，第二步会执行整个Microtask队列中的所有任务。
       并且，在执行Microtask队列任务的时候，也允许加入新的Microtask任务，直到所有Microtask任务全部执行完毕，才会结束循环。

        
       每个 macrotask执行完成之后，浏览器都会进行渲染，但是每个 microtask执行结束都不会渲染
       所以它俩的区别就在于Microtask会影响IO回调，要是不断增加Microtask的话，就一直无法渲染视图了，看上去就会卡顿。但是Macrotask就没有这种危险。
 
       所以建议优先使用macrotask, 使用microtask的优点是可以立即执行! （个人的感觉是，每次函数调用栈被清空了，都会先执行microtask，有种见缝插针的感觉）

       补充： setImmediate:  微软提出的一个方法，可能不被纳入w3c标准，目前只能使用在ie10

MessageChannel（消息通道）:

              
