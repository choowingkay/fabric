
// 画布宽高
var cWidth = 345
var cHeight = 1000
var storageCanvasData = [];//缓存步骤数据
var canvasIdx = 0;//步骤下标
var setIdx = 0;//对象下标
var kayCanvasData = [];//当前渲染数据
var timer = null;//计时器
// 设置画布宽高
$("#main").attr({width:cWidth,height:cHeight})
// 实例化对象
var canvas = new fabric.Canvas('main');
$("canvas").css("touch-action","auto");
$(document).on('touchstart',function(e){
	var otouch = e.originalEvent.targetTouches[0];
	var oy = otouch.pageY+$(".canvas-box").scrollTop();
	$(document).on('touchmove',function(e){
		var touch = e.originalEvent.targetTouches[0];
		var y = touch.pageY+$(".canvas-box").scrollTop();
		var cha = 0;
		var maxtop =  cHeight-$('.canvas-box').height()
		cha = $(".canvas-box").scrollTop()+(oy-y)
		if(cha>=maxtop){
			cha = maxtop
		}
		if(cha<=0){
			cha = 0
		}
		$(".canvas-box").scrollTop(cha)
	})
})
canvas.selection = false;
canvas.cancelable=true
// 编辑框内边距
fabric.Object.prototype.set({
	padding:5
})
// 配置编辑框功能
fabric.Canvas.prototype.customiseControls({
	tl: {
		action: 'remove',
		cursor:'pointer'
	},
	tr: {
		action: function (e, target) {
			target.clone(function (cloneObj) {
				cloneObj.set({
					left: cloneObj.left + 20,
					top: cloneObj.top + 20
				})
				cloneObj.setCoords()
				canvas.add(cloneObj)
				canvas.renderAll()
				let arr = JSON.parse(JSON.stringify(kayCanvasData))
				arr.push({
					type:cloneObj.type,
					cont:cloneObj.type=='text'?cloneObj.text:cloneObj.src,
					opstion:{
						left:cloneObj.left,
						top:cloneObj.top,
						originX:cloneObj.originX||'center',
						originY:cloneObj.originY||'center',
						scaleX:cloneObj.scaleX||1,
						scaleY:cloneObj.scaleY||1,
						angle:cloneObj.angle||0
					}
				 })
				kayCanvasData = arr
				storageCanvasData.push(arr)
				canvasIdx = storageCanvasData.length-1
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
		borderColor: '#DB639B',
		cornerSize: 20,
		cornerShape: 'rect',
		cornerBackgroundColor: 'transparent',
		cornerPadding: 0,
	},
	tl: {
		icon: 'img/colse.svg'
	},
	tr:{
		icon:'img/plus1.svg'
	},
	br:{
		icon:'img/fangda.svg'
	},
	mtr:{
		icon:'img/zhuan.svg'
	}
},function(){
	canvas.renderAll();
});

function changeToop(){
	var file = document.getElementById('upimg').files[0];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = function(e) {
		var img = new Image();
		img.src = e.target.result
		img.onload = function(){
			console.log(img.width,img.height)
			data = {}
			data.width = parseInt((img.width/(img.width/cWidth))*0.5)
			data.height = parseInt((img.height/(img.width/cWidth))*0.5)
			data.left = (cWidth/2)
			data.top = (cHeight/2)
			data.originX = 'center'
			data.originY = 'center'
			addImg(e.target.result,kayCanvasData.length,data)
		}
	};
	
}
// 加入图片src:图片路径、opstion配置
function addImg(src,idx,opstion,type){
	var data = opstion?opstion:'';
	console.log(data)
	fabric.Image.fromURL(src, function(res) {
		if(!type){
			res.on('added',function(){
				let arr = JSON.parse(JSON.stringify(kayCanvasData))
				arr.push({
					type:'image',
					cont:src,
					opstion:{
						left:this.left,
						top:this.top,
						width:this.width,
						height:this.height,
						originX:this.originX||'center',
						originY:this.originY||'center',
						scaleX:this.scaleX||1,
						scaleY:this.scaleY||1,
						angle:this.angle||0
					}
				})
				kayCanvasData = arr
				console.log(kayCanvasData)
				storageCanvasData.push(arr)
				canvasIdx = storageCanvasData.length-1
			})
		}
		res.on('modified',function(e){
			console.log(this.width,this.height)
			let arr = JSON.parse(JSON.stringify(kayCanvasData))
			arr[idx].opstion = {
				left:this.left,
				top:this.top,
				originX:this.originX||'center',
				originY:this.originY||'center',
				width:this.width,
				height:this.height,
				scaleX:this.scaleX||1,
				scaleY:this.scaleY||1,
				angle:this.angle||0
			}
			kayCanvasData = arr
			storageCanvasData.push(arr)
			canvasIdx = storageCanvasData.length-1
		})
		canvas.add(res);
	},data);
}
// 加入文本:字符串、opstion配置
function addText(string,idx,opstion,type){
	var data = opstion?opstion:'',index = kayCanvasData.length;
	if(idx&&idx!=0){
		index = idx
	}
	if(!data){
		data = {}
		data.left = (cWidth/2)
		data.top = (cHeight/2)
		data.originX = 'center'
		data.originY = 'center'
		data.fontSize = 30
		data.fontFamily = 'Microsoft YaHei'
	}
	var res = new fabric.Text(string,data);
	if(!type){
		res.on('added',function(){
			let arr = JSON.parse(JSON.stringify(kayCanvasData))
			arr.push({
				type:'text',
				cont:this.text,
				opstion:{
					left:this.left,
					top:this.top,
					originX:this.originX||'center',
					originY:this.originY||'center',
					scaleX:this.scaleX||1,
					scaleY:this.scaleY||1,
					angle:this.angle||0,
					fontSize:this.fontSize||30,
					fontFamily:this.fontFamily||'Microsoft YaHei'
				}
			})
			kayCanvasData = arr
			storageCanvasData.push(arr)
			canvasIdx = storageCanvasData.length-1
		})
	}
	res.on('modified',function(){
		let arr = JSON.parse(JSON.stringify(kayCanvasData))
		arr[index].cont = this.text
		arr[index].opstion = {
			left:this.left,
			top:this.top,
			originX:this.originX||'center',
			originY:this.originY||'center',
			scaleX:this.scaleX||1,
			scaleY:this.scaleY||1,
			angle:this.angle||0,
			fontSize:this.fontSize||30,
			fontFamily:this.fontFamily||'Microsoft YaHei'
		}
		kayCanvasData = arr
		storageCanvasData.push(arr)
		canvasIdx = storageCanvasData.length-1
	})
	res.on('selected',function(){
		setIdx = index
		document.getElementsByClassName('text-ctrl')[0].classList.add("text-ctrla")
	})
	canvas.add(res);
}
addText('你好')
// 设置文本
function setText(){
	let arr = JSON.parse(JSON.stringify(kayCanvasData))
	document.getElementById('textIpt').value = arr[setIdx].cont
	document.getElementsByClassName('input-box')[0].classList.add("input-boxa")
	document.getElementsByClassName('text-style')[0].classList.remove("text-stylea")
}
//设置字体大小
function setStyle(){
	
	let arr = JSON.parse(JSON.stringify(kayCanvasData))
	let textSIze = document.getElementById('textSize')
	textSIze.value = arr[setIdx].opstion.fontSize
	document.getElementsByClassName('text-style')[0].classList.add("text-stylea")
	document.getElementsByClassName('input-box')[0].classList.remove("input-boxa")
	canvasRestrt(arr)
	textSIze.oninput = function(e){
		clearTimeout(timer)
		let arr2 = JSON.parse(JSON.stringify(kayCanvasData))
		arr2[setIdx].opstion.fontSize = textSIze.value
		timer = setTimeout(()=>{
			storageCanvasData.push(arr2)
			canvasIdx = storageCanvasData.length-1
		},400)
		canvasRestrt(arr2)
	}
}
//设置字体
function changeFontFamily(that){
	let arr = JSON.parse(JSON.stringify(kayCanvasData))
	arr[setIdx].opstion.fontFamily = that.value
	kayCanvasData = arr
	storageCanvasData.push(arr)
	canvasIdx = storageCanvasData.length-1
	canvasRestrt(arr)
}
// 编辑完本完成
function save(){
	document.getElementsByClassName('text-ctrl')[0].classList.remove("text-ctrla")
	document.getElementsByClassName('input-box')[0].classList.remove("input-boxa")
	if(!document.getElementById('textIpt').value){return false}
	let arr = JSON.parse(JSON.stringify(kayCanvasData))
	if(document.getElementById('textIpt').value!=arr[setIdx].cont){
		arr[setIdx].cont = document.getElementById('textIpt').value
		kayCanvasData = arr
		storageCanvasData.push(arr)
		canvasIdx = storageCanvasData.length-1
		canvasRestrt(kayCanvasData)
	}
}
// 上一步
function prveStep(){
	if(canvasIdx>0){
		canvasIdx--
		console.log(canvasIdx)
		canvasRestrt(storageCanvasData[canvasIdx])
	}
}
// 下一步
function nextStep(){
	if(canvasIdx<storageCanvasData.length-1){
		canvasIdx++
		console.log(canvasIdx)
		canvasRestrt(storageCanvasData[canvasIdx])
	}
}
// 重新渲染
function canvasRestrt(data){
	canvas.clear()
	for (var i = 0; i < data.length; i++) {
		if(data[i].type=='image'){
			addImg(data[i].cont,i,data[i].opstion,'xr')
		}else{
			addText(data[i].cont,i,data[i].opstion,'xr')
		}
	}
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
	window.location.href = 'img.html'
}