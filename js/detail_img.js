window.onload = function(){
	// 预加载
	new Image().src="http://192.168.1.154:8888/{{ goods_images.image1 }}";
	new Image().src="http://192.168.1.154:8888/{{ goods_images.image2 }}";
	new Image().src="http://192.168.1.154:8888/{{ goods_images.image3 }}";
	new Image().src="http://192.168.1.154:8888/{{ goods_images.image4 }}";
	new Image().src="http://192.168.1.154:8888/{{ goods_images.image5 }}";

	var bigDiv = document.getElementById('bigDiv'),
		mid_div = document.getElementById('mid_div'),
		mid_img = mid_div.children[0],
		gai = mid_div.children[1],
		min_div = document.getElementById('min_div'),
		min_imgs = min_div.children,
		max_div = document.getElementById('max_div'),
		max_img = max_div.children[0];

	// 鼠标放上小的img上 中盒子和大盒子都需要更换图片的src
	console.log(min_imgs.length,min_imgs)
	for(var i=0,len=min_imgs.length;i<len;i++){
		(function(j){
			min_imgs[j].onmouseenter = function(){
				var img_src = this.src;
				mid_img.src = img_src;
				max_img.src = img_src;
			}
		})(i)
	}

	// 鼠标放上显示gai 移开隐藏
	mid_div.onmouseenter = function(){
		gai.style.display = 'block';
		max_div.style.display = 'block';
	};
	mid_div.onmouseleave = function(){
		gai.style.display = 'none';
		max_div.style.display = 'none';
	};

	//兼容的滑动位置 madeby:张飞龙
	// 滚动条的像素兼容写法
	window.scroll = function(){
		return {
			"top":document.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
			"left":document.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft
		}
	}
	// 在中盒子上滑动的时候 需要获取鼠标在mid_div中的坐标位置
	mid_div.onmousemove = function(event){
		event = event || window.event;
		//获取鼠标在文档中的坐标位置 = 滚动条的px+距离浏览器边的px
		var pageX = event.pageXOffset || window.scroll().left + event.clientX;
		var pageY = event.pageYOffset || window.scroll().top + event.clientY;

		// 设置以下大盒子大位置
		// max_div.style.left= event.clientX + 400+ 'px';
		// max_div.style.top= event.clientY + 'px';
 		//console.log(pageX,pageY)
 		//mid_div盒子相对于有定位的父盒子的位置；没有定位的盒子则为body
 		var mid_divX = mid_div.offsetLeft,
 			mid_divY = this.offsetTop;
		//console.log(mid_divX,mid_divY)
		//让gai盒子的位置和鼠标一起动起来，最好鼠标的在gai中心位置,
		//X为gai盒子的位置，等于鼠标相对body的位置-mid_div的盒子相对body的位置-gai盒子自身宽度的一半
		var X = pageX - mid_divX - gai.offsetWidth/2;
		var Y = pageY - mid_divY - gai.offsetHeight/2;
		//console.log(X,Y)
		// 设置边界
		if(X<=0){X=0};
		if(Y<=0){Y=0};
		var max_left = mid_div.scrollWidth-gai.offsetWidth;
		var max_top = mid_div.scrollHeight - gai.offsetWidth;
		if(X>=max_left){
			X = max_left;
		}
		if(Y>=max_top){
			Y = max_top;
		}
		// 设置位置
		gai.style.left = X + 'px';
		gai.style.top = Y + 'px';
		// 大盒子的大小应该计算出来，和gai盒子等比例就很好了，这样设计比较好
		var biliX = gai.offsetWidth/mid_div.scrollWidth;
		var biliY = gai.offsetHeight/mid_div.scrollHeight;
		// console.log(biliX,biliY);
		max_div.style.width = biliX * max_img.offsetWidth + 'px';
		max_div.style.height = biliY * max_img.offsetHeight + 'px';
		//console.log(biliX * max_img.offsetWidth + 'px',biliY * max_img.offsetHeight + 'px');
		//console.log(max_img.offsetWidth,max_img.offsetHeight);

 		var bili = mid_div.scrollWidth/max_img.offsetWidth;
 		//console.log(bili)

		max_img.style.left = -X/bili + 'px';
		max_img.style.top = -Y/bili + 'px';
	};
}
