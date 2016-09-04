function Pagination(option){
	var container = document.createDocumentFragment(),
		element = document.querySelector(option.element),
		controller = option.controller,
		render = option.render,
		arrIndicator = [],
		total = Math.ceil(option.total / option.size),
		currentIndex = Math.min(option.index || 0, total - 1),
		previousIndex = getIndex(),
		nextIndex = getIndex(1);
	setIndex(currentIndex);
	//获取下标方法
	function getIndex(type){ //type (false:前一个下标, true:后一个下标)
		if(type){ //判断下标类型
			return Math.min(currentIndex + 1, total - 1); //返回后一个下标
		}
		return Math.max(currentIndex - 1, 0); //返回前一个下标
	}
	function setIndex(index){
		var i;
		previousIndex = currentIndex;
		currentIndex = index;
		nextIndex = getIndex(1);
		if(total >> 1){
			controller && createController();
			if(total <= 5){
				i = 0;
				while(i < total){
					arrIndicator.splice(i, 1, createIndicator(i++));
				}
			}else{
				arrIndicator.splice(0, 1, createIndicator(0));
				if(currentIndex < 3){
					i = 1;
					while(i < 4){
						arrIndicator.splice(i, 1, createIndicator(i++));
					}
					createEllipsis();
				}else if(currentIndex < total - 3){
					i = currentIndex - 1;
					createEllipsis();
					while(i < currentIndex + 2){
						arrIndicator.splice(i, 1, createIndicator(i++));
					}
					createEllipsis();
				}else{
					i = total - 4;
					createEllipsis();
					while(i < total - 1){
						arrIndicator.splice(i, 1, createIndicator(i++));
					}
				}
				arrIndicator.splice(total - 1, 1, createIndicator(total - 1));
			}
			controller && createController(1);
			arrIndicator[currentIndex].classList.add("current");
			element.innerText = "";
			element.appendChild(container);
		}
		render.call(option, currentIndex);
	}
	function createController(type){
		var dom = document.createElement("a"),
			index;
		dom.innerText = (type ? "下" : "上") + "一页";
		dom.onclick = function(){
			index = getIndex(type);
			index === currentIndex || setIndex(index);
		};
		container.appendChild(dom);
		return dom;
	}
	function createIndicator(index){
		var dom = document.createElement("em");
		dom.innerText = index + 1;
		dom.onclick = function(){
			setIndex(index);
		};
		container.appendChild(dom);
		return dom;
	}
	function createEllipsis(){
		var dom = document.createElement("b");
		dom.innerText = "...";
		container.appendChild(dom);
	}
}