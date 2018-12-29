(function(){
    var div = document.createElement('div');
    div.style.background = 'url(../images/cellphone_num.jpg) no-repeat 0 0';
    div.style.width = '144px';
    div.style.height = '72px';
    div.style.backgroundSize = '100%';
    // div.innerText = '电话：183-1083-8918';
    // div.style.background = '#429d8a';
    div.style.position = 'fixed';
    div.style.zIndex = 1000;
    div.style.left = '0px';
    div.style.top = '0px';
    // div.style.border = '1px solid #ccc';
    // div.style.fontSize = '20px';
    // div.style.fontFamily = 'Microsoft YaHei';
    // div.style.borderRadius = '6px';
    // div.style.color = '#cb1d25';
    document.body.appendChild(div);


    var max_X = document.body.clientWidth - div.offsetWidth,// 最大范围
        max_Y = document.body.clientHeight - div.offsetHeight,

        direction_X = 1, // 方向
        direction_Y = 1,

        speed_X = 1,// 速度
        speed_Y = 1;

    var timer = null;

    function moveXY(){
        var left_X = parseInt(div.style.left);
        var top_Y = parseInt(div.style.top);

        direction_X = (left_X>max_X||left_X<0) ? -direction_X : direction_X;// 越界规范
        direction_Y = (top_Y>max_Y||top_Y<0) ? -direction_Y : direction_Y;

        div.style.left = (left_X+direction_X*speed_X)+'px';
        div.style.top = (top_Y+direction_Y*speed_Y)+'px';

        timer = setTimeout(moveXY,16.7);//类似递归调用
    }

    moveXY();
    div.onmouseenter = function(event){
        event = event||window.event;
        clearTimeout(timer);


    };
    div.onmouseout = function(){
        moveXY();
    }
})();
