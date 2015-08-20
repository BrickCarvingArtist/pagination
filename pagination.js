var Pagination = window.Pagination || (function(setting){
	"use strict";
	Pagination.INFO = {
		AUTHOR : "BrickCarvingArtist/GitHub",
		BEGINTIME : "2015/08/20",
		LATESTRELEASE : "2015/08/20",
		LICENSE : "LGPL",
		NAME : "Pagination",
		VERSION : "0.1"
	};
	if(setting.info){
		console.warn(Pagination.INFO);
	}
	/*封装类继承函数*/
	function extend(subClass, supClass){
		function F(){}
		F.prototype = supClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.constructor = subClass;
		subClass.superclass = supClass.prototype;
		if(supClass.prototype.constructor === Object.prototype.constructor){
			supClass.prototype = supClass;
		}
	}
	/*Ajax类*/
	function Ajax(obj){
		this.receiveData = obj;
		this.transportData();
	}
	Ajax.prototype = {
	    constructor : Ajax,
	    transportData : function(){
	        var xhr = new XMLHttpRequest(), _this = this;
	        xhr.open(this.receiveData.type, this.receiveData.url, true);
	        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	        xhr.onreadystatechange = function(){
	            if(xhr.readyState === 4){
	                var responseText = _this.receiveData.dataType && _this.receiveData.dataType.toLowerCase() === "json" ? eval("(" + xhr.responseText + ")") : xhr.responseText;
	                if(xhr.status === 200){
	                    if(_this.receiveData.success){
	                        _this.receiveData.success(responseText);
	                    }
	                }else{
	                    if(_this.receiveData.failure){
	                        _this.receiveData.failure(responseText, xhr.status);
	                    }
	                }
	            }
	        };
	        if(this.receiveData.data){
	            xhr.send(this.receiveData.data);
	        }else{
	            xhr.send(null);
	        }
	    }
	};
	/*按钮*/
	function Button(userObj, index, className){
		this.userObj = userObj;
		this.index = index;
		this._init();
		this._addEvent();
	}
	Button.prototype = {
		constructor : Button,
		_init : function(){
			this._setDom();
			this._setText();
		},
		_setDom : function(){
			this.dom = document.createElement("span");
			this.dom.className = this.className;
		},
		_getData : function(callback){
			var _this = this;
			new Ajax({
				type : "get",
				url : _this.userObj.dataUrl + (~_this.userObj.dataUrl.indexOf("?") ? "&" : "?") + "pageindex=" + _this.userObj.getCurrentIndex() + "&pagesize=" + _this.userObj.pageSize,
				dataType : "json",
				success : function(data){
					callback(function(){
						_this.userObj.render();
					});
				}
			});
		}
	};
	/*页码*/
	function Page(userObj, index, className){
		this.className = "button normal " + className;
		Prev.superclass.constructor.call(this, userObj, index);
	}
	extend(Page, Button);
	Page.prototype._setText = function(){
		this.dom.innerHTML = this.index + 1;
	};
	Page.prototype._setCurrent = function(){
		this.userObj.setCurrentIndex(this.index);
		this.userObj.oButton[this.userObj.getPrevIndex()].dom.className = this.className;
		this.dom.className = this.className.replace(/normal/, "current");
	};
	Page.prototype._addEvent = function(){
		var _this = this;
		this.dom.onclick = function(){
			if(_this.userObj.firstRequire){
				_this._getData(function(render){
					render();
					_this._setCurrent();
				});
			}
			_this.userObj.firstRequire = 1;
			_this._setCurrent();
		};
	};
	/*上一页*/
	function Prev(userObj, index, className){
		this.className = "button " + className;
		Prev.superclass.constructor.call(this, userObj, index);
	}
	extend(Prev, Button);
	Prev.prototype._setText = function(){
		this.dom.innerHTML = "上一页";
	};
	Prev.prototype._addEvent = function(){
		var _this = this;
		this.dom.onclick = function(){			
			_this.userObj.oButton[_this.userObj.getPrevPage()].dom.click();
		};
	};
	/*下一页*/
	function Next(userObj, index, className){
		this.className = "button " + className;
		Next.superclass.constructor.call(this, userObj, index);
	}
	extend(Next, Button);
	Next.prototype._setText = function(){
		this.dom.innerHTML = "下一页";
	};
	Next.prototype._addEvent = function(){
		var _this = this;
		this.dom.onclick = function(){
			_this.userObj.oButton[_this.userObj.getNextPage()].dom.click();
		};
	};
	/*分页插件*/
	function Pagination(obj){
		this.receiveObj = obj;
		this.pageSize = this.receiveObj.pageSize;
		this.totalPage = this.receiveObj.totalPage;
		this.dataUrl = this.receiveObj.dataUrl;
		this.firstRequire = this.receiveObj.firstRequire;
		this.render = this.receiveObj.render;
		this.currentIndex = 0;
		this.prevIndex = 0;
		this._init();
	}
	Pagination.prototype = {
		constructor : Pagination,
		_init : function(){
			this._setAll();
			this.oButton[0].dom.click();
		},
		_setAll : function(){
			this.dom = document.getElementById(this.receiveObj.position);
			this._setPrev();
			this._setButton();
			this._setNext();
		},
		_setPrev : function(){
			this.prev = new Prev(this, this.prevIndex, "prev");
			this.dom.appendChild(this.prev.dom);
		},
		_setNext : function(){
			this.next = new Next(this, this.nextIndex, "next");
			this.dom.appendChild(this.next.dom);
		},
		_setButton : function(){
			this.oButton = new Array();
			for(var i = 0; i < this.totalPage; i++){
				this.oButton[i] = new Page(this, i, "page");
				this.dom.appendChild(this.oButton[i].dom);
			}
		},
		setCurrentIndex : function(index){
			var prevIndex = this.currentIndex;
			this.prevIndex = prevIndex;
			this.currentIndex = index > 0 ? index < this.pageSize - 1 ? index : this.pageSize - 1 : 0;
		},
		getCurrentIndex : function(){
			return this.currentIndex;
		},
		getPrevIndex : function(){
			return this.prevIndex;
		},
		getPrevPage : function(){
			return this.currentIndex > 0 ? this.currentIndex - 1 : 0;
		},
		getNextPage : function(){
			return this.currentIndex + 1 > this.totalPage - 1 ? this.totalPage - 1 : this.currentIndex + 1;
		}
	};
	return Pagination;
})({
	info : true
});