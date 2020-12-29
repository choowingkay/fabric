// 画布宽高
var widthValue = 9;
var heightValue = 16;
var familyList = [
	{name:'微软雅黑',value:'Microsoft YaHei'},
	{name:'宋体',value:'SimSun'},
	{name:'仿宋',value:'FangSong'},
	{name:'隶书',value:'LiSu'},
	{name:'幼圆',value:'YouYuan'},
	{name:'细明体',value:'MingLiU'},
	{name:'楷体',value:'KaiTi'},
	{name:'华文细黑',value:'STHeiti Light'}
];
var colorList = ['#000000','#6D380C','#B28752','#969696','#FFFFFF','#EB0013','#EC6100','#F69802','#FEF004','#90C31F','#24AA39','#009941','#00A1E4','#0165BA','#1D1E88','#611989','#930784'];
var fmlIdx = 0;
var cWidth = parseInt(widthValue/(widthValue/300));
var cHeight = parseInt(heightValue/(widthValue/300));
var storageCanvasData = [];//缓存步骤数据
var canvasIdx = 0;//步骤下标
var setThat = '';//当前选中对象
var ctrlBool = false;//当前渲染数据
var pabh = 0;
storageCanvasData.push([]);
var timer = null;//计时器
// jQuery
$(function(){
	// 渲染字体列表
	for(var i in familyList){
		$(".family-list").append('<div class="lis">'+familyList[i].name+'</div>')
	}
	// 渲染字体颜色
	for(var i in colorList){
		$(".color-chose").append('<div class="colors"><div class="inner" style="background: '+colorList[i]+';"></div></div>')
	}
	$(".color-chose").on('click','.colors',function(){
		var idx = $(this).index()
		if(idx!=0){
			setThat.set({
				fill:colorList[idx-1]
			})
			canvas.renderAll();
			storageCanvasData.push(canvas.toJSON());
			canvasIdx = storageCanvasData.length-1;
			$(".color-chose .colors").eq(idx).addClass('active').siblings().removeClass('active')
		}else{
			
		}
	})
	//监听字体大小变化
	document.getElementById('textSize').oninput = function(e){
		clearTimeout(timer)
		setThat.set({
			fontSize:document.getElementById('textSize').value
		})
		canvas.renderAll();
		timer = setTimeout(()=>{
			storageCanvasData.push(canvas.toJSON());
			canvasIdx = storageCanvasData.length-1;
		},300)
	}
	//监听透明度
	document.getElementById('textopacity').oninput = function(e){
		clearTimeout(timer)
		setThat.set({
			opacity:document.getElementById('textopacity').value/100
		})
		canvas.renderAll();
		timer = setTimeout(()=>{
			storageCanvasData.push(canvas.toJSON());
			canvasIdx = storageCanvasData.length-1;
		},300)
	}
})
// 设置画布宽高
$("#main").attr({width:cWidth,height:cHeight});
// 实例化对象
var canvas = new fabric.Canvas('main');
// canvas.selection = false;//区域选择 默认true
canvas.preserveObjectStacking=true;//选中对象是否最上层 默认false
// 选中元素监听
canvas.on("selection:created", function (e) { 
	setThat = e.target;
	if(setThat.text){
		hideCtrl()
		$(".text-ctrl").addClass('text-ctrla')
	}else{
		hideCtrl()
		$("img-ctrl").addClass('img-ctrla')
	}
});
canvas.on("selection:updated", function (e) { 
	setThat = e.target;
	if(setThat.text){
		$("img-ctrl").removeClass('img-ctrla')
		$(".text-ctrl").addClass('text-ctrla')
		if($(".input-box").hasClass('input-boxa')){
			document.getElementById('textIpt').value = setThat.text;
		}
		if($(".color-box").hasClass('color-boxa')){
			let idx = 0;
			for (var i = 0; i < colorList.length; i++) {
				if(setThat.fill==colorList[i]){
					idx = i+1
				}
			}
			if(idx!=0){
				$(".color-box .colors").eq(idx).addClass('active').siblings().removeClass('active')
			}else{
				$(".color-box .colors").eq(0).addClass('active').siblings().removeClass('active')
			}
			document.getElementById('textopacity').value = setThat.opacity*100;
		}
		if($(".text-style").hasClass('text-stylea')){
			document.getElementById('textSize').value = setThat.fontSize;
			// 默认字体
			for(var i in familyList){
				if(familyList[i].value==setThat.fontFamily){
					fmlIdx = i
				}
			}
			$(".family-list .lis").eq(fmlIdx).addClass('active').siblings().removeClass('active')
			if(setThat.text.indexOf('\n')!=-1){
				$('.text-attr .attr').eq(0).addClass('active')
			}else{
				$('.text-attr .attr').eq(0).removeClass('active')
			}
			if(setThat.fontWeight=='bold'){
				$('.text-attr .attr').eq(1).addClass('active')
			}else{
				$('.text-attr .attr').eq(1).removeClass('active')
			}
			if(setThat.fontStyle=='italic'){
				$('.text-attr .attr').eq(2).addClass('active')
			}else{
				$('.text-attr .attr').eq(2).removeClass('active')
			}
			if(setThat.underline){
				$('.text-attr .attr').eq(3).addClass('active')
			}else{
				$('.text-attr .attr').eq(3).removeClass('active')
			}
		}
	}else{
		hideCtrl()
		document.getElementsByClassName('img-ctrl')[0].classList.add("img-ctrla");
	}
});
canvas.on("selection:cleared", function (e) { 
	hideCtrl()
});
// 改变元素监听
canvas.on("object:modified", function (e) { 
	storageCanvasData.push(canvas.toJSON());
	// console.log(storageCanvasData)
	canvasIdx = storageCanvasData.length-1;
	$(".btn-box .prve").addClass('active');
});
// 编辑框内边距
fabric.Object.prototype.set({
	padding:5
})
// 配置编辑框功能
fabric.Canvas.prototype.customiseControls({
	tl: {
		action:  function (e, target) {
			setTimeout(function(){
				hideCtrl()
			},300)
			canvas.remove(target);
			canvas.renderAll();
			storageCanvasData.push(canvas.toJSON());
			canvasIdx = storageCanvasData.length-1;
		},
		cursor:'pointer'
	},
	tr: {
		action: function (e, target) {
			target.clone(function (cloneObj) {
				cloneObj.set({
					left: cloneObj.left + 20,
					top: cloneObj.top + 20
				})
				cloneObj.setCoords();
				canvas.add(cloneObj);
				canvas.discardActiveObject().renderAll();
				storageCanvasData.push(canvas.toJSON());
				canvasIdx = storageCanvasData.length-1;
			})
		},
		cursor:'pointer'
	}
},function(){
	canvas.renderAll();
});
// 配置编辑框图标 svg
fabric.Object.prototype.customiseCornerIcons({
	settings: {
		borderColor: '#4D9DFF',
		cornerSize: 20,
		cornerShape: 'rect',
		cornerBackgroundColor: 'transparent',
		cornerPadding: 0,
	},
	tl: {
		icon: 'img/tl.svg'
	},
	tr:{
		icon:'img/tr.svg'
	},
	ml:{
		icon:'img/mlr.svg'
	},
	mr:{
		icon:'img/mlr.svg'
	},
	br:{
		icon:'img/br.svg'
	},
	mb:{
		icon:'img/mb.svg'
	},
	mtr:{
		icon:'img/mtr.svg'
	}
},function(){
	canvas.renderAll();
});
// 替换图片
function replaceImg(){
	var file = document.getElementById('rupimg').files[0];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = function(e) {
		setThat._element.attributes[0].nodeValue = e.target.result;
		setTimeout(function(){
			canvas.renderAll();
			storageCanvasData.push(canvas.toJSON());
			canvasIdx = storageCanvasData.length-1;
		},300)
	};
}
// 选图片
function changeToop(){
	var file = document.getElementById('upimg').files[0];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = function(e) {
		var img = new Image();
		img.src = e.target.result;
		img.onload = function(){
			data = {};
			data.scaleX = (cWidth/img.width)*0.5;
			data.scaleY = (cWidth/img.width)*0.5;
			data.left = (cWidth/2);
			data.top = (cHeight/2);
			data.originX = 'center';
			data.originY = 'center';
			addImg(e.target.result,data);
		}
	};
}
// 加入图片src:图片路径、opstion配置
function addImg(src,opstion){
	var data = opstion||'';
	fabric.Image.fromURL(src, function(res) {
		// 添加元素监听
		res.on('added',function(){
			console.log(canvas.toJSON());
			storageCanvasData.push(canvas.toJSON());
			canvasIdx = storageCanvasData.length-1;
			$(".btn-box .prve").addClass('active');
		})
		canvas.add(res);
		// canvas.moveTo(canvas.item(idx),idx+1);
		// canvas.item(idx).selectable = false;//禁止选中
	},data);
}
// 加入文本:字符串、opstion配置
function addText(string,opstion){
	var data = opstion||'';
	if(!data){
		data = {};
		data.left = (cWidth/2);
		data.top = (cHeight/2);
		data.originX = 'center';
		data.originY = 'center';
		data.fontSize = 30;
		data.fontFamily = 'Microsoft YaHei';
		data.fontStyle = 'normal';
		data.opacity = 1;
		data.fill = '#000000';
		data.underline = false;
		data.editable = false;
	}
	var res = new fabric.Text(string,data);
	// 添加元素监听
	res.on('added',function(){
		// console.log(canvas.toJSON())
		storageCanvasData.push(canvas.toJSON());
		canvasIdx = storageCanvasData.length-1;
		$(".btn-box .prve").addClass('active');
	})
	canvas.add(res);
	// canvas.item(idx).selectable = false;//禁止选中
}
addText('123')
// 编辑文本
function setText(){
	document.getElementById('textIpt').value = setThat.text;
	hideTextCtrl()
	$(".input-box").addClass('input-boxa')
	$(".canvas-box").css({paddingBottom:$(".text-ctrl").height()+'px'});
	$(".canvas-box").scrollTop($(".canvas-box").scrollTop()-pabh);
	pabh = $(".text-ctrl").height();
	$(".canvas-box").scrollTop($(".canvas-box").scrollTop()+pabh);
}
//设置文本颜色
function setColor(){
	hideTextCtrl()
	$(".color-box").addClass('color-boxa')
	let idx = 0;
	for (var i = 0; i < colorList.length; i++) {
		if(setThat.fill==colorList[i]){
			idx = i+1
		}
	}
	if(idx!=0){
		$(".color-box .colors").eq(idx).addClass('active').siblings().removeClass('active')
	}else{
		$(".color-box .colors").eq(0).addClass('active').siblings().removeClass('active')
	}
	document.getElementById('textopacity').value = setThat.opacity*100;
	$(".canvas-box").css({paddingBottom:$(".text-ctrl").height()+'px'});
	$(".canvas-box").scrollTop($(".canvas-box").scrollTop()-pabh);
	pabh = $(".text-ctrl").height();
	$(".canvas-box").scrollTop($(".canvas-box").scrollTop()+pabh);
	
}
//设置文本样式
function setStyle(){
	document.getElementById('textSize').value = setThat.fontSize;
	hideTextCtrl()
	$(".text-style").addClass('text-stylea')
	$(".canvas-box").css({paddingBottom:$(".text-ctrl").height()+'px'});
	$(".canvas-box").scrollTop($(".canvas-box").scrollTop()-pabh);
	pabh = $(".text-ctrl").height();
	$(".canvas-box").scrollTop($(".canvas-box").scrollTop()+pabh);
	canvas.renderAll();
	// 默认字体
	for(var i in familyList){
		if(familyList[i].value==setThat.fontFamily){
			fmlIdx = i
		}
	}
	$(".family-list .lis").eq(fmlIdx).addClass('active').siblings().removeClass('active')
	if(setThat.text.indexOf('\n')!=-1){
		$('.text-attr .attr').eq(0).addClass('active')
	}else{
		$('.text-attr .attr').eq(0).removeClass('active')
	}
	if(setThat.fontWeight=='bold'){
		$('.text-attr .attr').eq(1).addClass('active')
	}else{
		$('.text-attr .attr').eq(1).removeClass('active')
	}
	if(setThat.fontStyle=='italic'){
		$('.text-attr .attr').eq(2).addClass('active')
	}else{
		$('.text-attr .attr').eq(2).removeClass('active')
	}
	if(setThat.underline){
		$('.text-attr .attr').eq(3).addClass('active')
	}else{
		$('.text-attr .attr').eq(3).removeClass('active')
	}
}
//文本底部设置
$(".text-attr .attr").click(function(){
	var i = $(this).index(),active=false;
	if(i==0){
		var text = '';
		if(setThat.text.indexOf('\n')!=-1){
			text = setThat.text.split("\n").join('');
		}else{
			text = setThat.text.split("").join('\n');
			active = true;
		}
		setThat.set({
			text:text
		})
	}
	if(i==1){
		setThat.set({
			fontWeight:setThat.fontWeight=='normal'?'bold':'normal'
		})
		active = setThat.fontWeight == 'bold' ? true : false;
	}
	if(i==2){
		setThat.set({
			fontStyle:setThat.fontStyle=='normal'?'italic':'normal'
		})
		active = setThat.fontStyle == 'italic' ? true : false;
	}
	if(i==3){
		setThat.set({
			underline:setThat.underline?false:true
		})
		active = setThat.underline?true:false;
	}
	if(active){
		$(".text-attr .attr").eq(i).addClass('active');
	}else{
		$(".text-attr .attr").eq(i).removeClass('active');
	}
	canvas.renderAll();
	storageCanvasData.push(canvas.toJSON());
	canvasIdx = storageCanvasData.length-1;
})
//设置字体
$(".family-list").on('click','.lis',function(){
	fmlIdx = $(this).index();
	$(this).addClass('active').siblings().removeClass('active');
	setThat.set({
		fontFamily:familyList[fmlIdx].value
	})
	canvas.renderAll();
	storageCanvasData.push(canvas.toJSON());
	canvasIdx = storageCanvasData.length-1;
})
// 监听文本编辑
$("#textIpt").keyup(function(){
	setThat.set({
		text:$(this).val()
	})
	canvas.renderAll();
	storageCanvasData.push(canvas.toJSON());
	canvasIdx = storageCanvasData.length-1;
})
// 编辑图片完成
function imgsave(){
	canvas.discardActiveObject().renderAll();
	hideCtrl()
}
// 编辑文本完成
function textsave(){
	canvas.discardActiveObject().renderAll();
	hideCtrl()
	$(".canvas-box").scrollTop($(".canvas-box").scrollTop()-pabh);
	pabh = 0;
	$(".canvas-box").css({paddingBottom:'60px'});
}
// 撤销
function prveStep(){
	if(canvasIdx>0){
		hideCtrl()
		canvasIdx--;
		// console.log(canvasIdx)
		if(canvasIdx<=0){
			$(".btn-box .prve").removeClass('active');
		}
		if(canvasIdx<storageCanvasData.length-1){
			$(".btn-box .next").addClass('active');
		}
		$(".canvas-box").scrollTop($(".canvas-box").scrollTop()-pabh);
		pabh = 0;
		$(".canvas-box").css({paddingBottom:'60px'});
		canvas.loadFromJSON(storageCanvasData[canvasIdx]);
		canvas.renderAll();
	}
}
// 重做
function nextStep(){
	if(canvasIdx<storageCanvasData.length-1){
		hideCtrl()
		canvasIdx++;
		// console.log(canvasIdx)
		if(canvasIdx>0){
			$(".btn-box .prve").addClass('active');
		}
		if(canvasIdx>=storageCanvasData.length-1){
			$(".btn-box .next").removeClass('active');
		}
		$(".canvas-box").scrollTop($(".canvas-box").scrollTop()-pabh);
		pabh = 0;
		$(".canvas-box").css({paddingBottom:'60px'});
		canvas.loadFromJSON(storageCanvasData[canvasIdx]);
		canvas.renderAll();
	}
}
// 隐藏操作样式
function hideCtrl(){
	$(".img-ctrl").removeClass('img-ctrla')
	$(".text-ctrl").removeClass('text-ctrla')
	hideTextCtrl()
}
// 隐藏文本操作样式
function hideTextCtrl(){
	$(".input-box").removeClass('input-boxa')
	$(".color-box").removeClass('color-boxa')
	$(".text-style").removeClass('text-stylea')
}
//上一层
function objUp(){
	setThat.bringForward();
	canvas.renderAll();
	storageCanvasData.push(canvas.toJSON());
	canvasIdx = storageCanvasData.length-1;
}
//下一层
function objDown(){
	setThat.sendBackwards();
	canvas.renderAll();
	storageCanvasData.push(canvas.toJSON());
	canvasIdx = storageCanvasData.length-1;
}
// 生成海报预览
function createPoster(){
	var src = canvas.toDataURL({
		format:'png',
		quality:1,
		left:0,
		top:0,
		width:cWidth,
		height:cHeight
	});
	localStorage.setItem("kayimgsrc", src);
	window.location.href = 'img.html';
}