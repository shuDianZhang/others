var moveBox = document.getElementById('moveBox');

function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj)[attr];
    }
}

function moveTo(obj, direction, distance, cb) {
    var posX = parseInt(getStyle(obj, 'left'));
    var posY = parseInt(getStyle(obj, 'top'));
    var distance = direction === 'right' || direction === 'bottom' ? distance : -distance;
    var speed = direction === 'right' || direction === 'bottom' ? 5 : -5;
    clearInterval(obj.timer);
    if (direction === 'left' || direction === 'right') {
        var target = posX + distance;
        obj.timer = setInterval(function() {
            posX = posX + speed;
            moveBox.style.left = posX + 'px';
            if (posX === target) {
                clearInterval(obj.timer);
                cb && cb();
            }
        }, 10);
    } else if (direction === 'top' || direction === 'bottom') {
        var target = posY + distance;
        obj.timer = setInterval(function() {
            posY = posY + speed;
            moveBox.style.top = posY + 'px';
            if (posY === target) {
                clearInterval(obj.timer);
                cb && cb();
            }
        }, 10);
    } else {
        alert('请输入正确的参数');
    }
}

// moveBox.addEventListener('click', function() {

//     moveTo(moveBox, 'bottom', 400, function() {

//         moveTo(moveBox, 'right', 500, function() {

//             moveTo(moveBox, 'top', 400, function() {

//                 moveTo(moveBox, 'left', 500, function() {

//                     alert('跑完一圈啦~~~~~~~~');

//                 });

//             });
//         });

//     });


// }, false);



//使用promise对象解决回调地狱
//优点： 异步的嵌套转变成同步的执行
//缺点： 参数太复杂，影响阅读体验



function movePromise() {
    return new Promise(function (resolve) {
        moveTo(moveBox, 'bottom', 500, function () {
            resolve();
        });
    });
}
moveBox.addEventListener('click', function () {
    movePromise()
        .then(function () {
            return new Promise(function (resolve) {
                moveTo(moveBox, 'right', 500, function () {
                    resolve();
                });
            });
        })
        .then(function () {
            return new Promise(function (resolve) {
                moveTo(moveBox, 'top', 500, function () {
                    resolve();
                });
            });
        })
        .then(function () {
            return new Promise(function (resolve) {
                moveTo(moveBox, 'left', 500, function () {
                    resolve();
                });
            });
        })
});


//最优雅的回掉解决方案 async/await
