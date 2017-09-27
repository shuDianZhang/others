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
    if (direction === 'left' || direction === 'right') {
        var distance = direction === 'right' ? distance : -distance,
            speed = direction === 'right' ? 5 : -5;
        var target = posX + distance;              //目标位置
        var timer = '';
        timer = setInterval(function () {
            posX = posX + speed;
            moveBox.style.left = posX + 'px';
            if (posX === target) {
                clearInterval(timer);
                cb && cb();
            }
        }, 10);
    } else if (direction === 'top' || direction === 'bottom') {
        var distance = direction === 'bottom' ? distance : -distance,
            speed = direction === 'bottom' ? 5 : -5;
        var target = posY + distance;
        var timer = '';
        timer = setInterval(function () {
            posY = posY + speed;
            moveBox.style.top = posY + 'px';
            if (posY === target) {
                clearInterval(timer);
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
