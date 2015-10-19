var Pagination = window.Pagination || (function(setting){
	"use strict";
	Pagination.INFO = {
		AUTHOR : "BrickCarvingArtist/GitHub",
		BEGINTIME : "2015/08/20",
		LATESTRELEASE : "2015/08/20",
		LICENSE : "MIT",
		NAME : "Pagination",
		VERSION : "0.2"
	};
	if(setting.info){
		console.warn(Pagination.INFO);
	}
	"use strict";
    /*Ajax类*/
    function Ajax(obj) {
        this.receiveData = obj;
        this.transportData();
    }
    Ajax.prototype = {
        constructor: Ajax,
        transportData: function () {
            var xhr = new XMLHttpRequest(), _this = this;
            xhr.open(this.receiveData.type, this.receiveData.url, true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var responseText = _this.receiveData.dataType && _this.receiveData.dataType.toLowerCase() === "json" ? eval("(" + xhr.responseText + ")") : xhr.responseText;
                    if (xhr.status === 200) {
                        if (_this.receiveData.success) {
                            _this.receiveData.success(responseText);
                        }
                    } else {
                        if (_this.receiveData.failure) {
                            _this.receiveData.failure(responseText, xhr.status);
                        }
                    }
                }
            };
            if (this.receiveData.data) {
                xhr.send(this.receiveData.data);
            } else {
                xhr.send(null);
            }
        }
    };
    /*按钮*/
    var Button = function (userObj, index, className, title) {
        this.userObj = userObj;
        this.index = index;
        this.dom = document.createElement("span");
        this.dom.className = this.userObj.index == index ? className.replace(/normal/, "current") : className;
        this.dom.innerHTML = title;
        if (index && index <= this.userObj.total) {
            this.addEvent();
        }
    };
    Button.prototype = {
        constructor : Button,
        addEvent: function () {
            var userObj = this.userObj;
            this.dom.index = this.index;
            this.dom.onclick = function () {
                var _this = this;
                new Ajax({
                    type: "get",
                    url: userObj.dataUrl + (~userObj.dataUrl.indexOf("?") ? "&" : "?") + "pageindex=" + _this.index + "&pagesize=" + userObj.size,
                    dataType: "json",
                    success: function (data) {
                        userObj.init(data);
                        userObj.render(data);
                    }
                });
            };
        }
    };
    var Pagination = function (obj) {
        this.position = document.getElementById(obj.position);
        this.dataUrl = obj.dataUrl;
        this.callback = obj.render;
        this.init(obj);
        if(obj.firstRequire && this.oButton.length){
        	this.oButton[0].dom.click();
        }
    };
    Pagination.prototype = {
        constructor: Pagination,
        init: function (obj) {
            this.position.innerHTML = "";
            var index = obj.pageIndex,
                size = obj.pageSize,
                total = obj.totalPage;
            this.size = size;
            this.total = total;
            this.setIndex(index);
            this.dom = document.createDocumentFragment();
            this.addButton();
        },
        setIndex: function (index) {
            var total = this.total;
            this.index = index;
            this.prev = index >> 1 ? index - 1 : 0;
            this.next = index >= total ? total + 1 : index + 1;
        },
        addButton: function () {
            this.oButton = new Array();
            if (this.total >> 1) {
                this.oButton.push(new Button(this, this.prev, "normal prev", "上一页"));
                if (this.total <= 5) {
                    for (var i = 1, total = this.total; i < total; i++) {
                        this.oButton.push(new Button(this, i, "normal page", i));
                    }
                } else {
                    this.oButton.push(new Button(this, 1, "normal page", 1));
                    if (this.index < 4) {
                        for (var i = 2; i < 5; i++) {
                            this.oButton.push(new Button(this, i, "normal page", i));
                        }
                        this.oButton.push(new Button(this, null, "", "..."));
                    } else if (this.index < this.total - 2) {
                        this.oButton.push(new Button(this, null, "", "..."));
                        for (var i = this.index - 1; i < this.index + 2; i++) {
                            this.oButton.push(new Button(this, i, "normal page", i));
                        }
                        this.oButton.push(new Button(this, null, "", "..."));
                    } else {
                        this.oButton.push(new Button(this, null, "", "..."));
                        for (var i = this.total - 3; i < this.total; i++) {
                            this.oButton.push(new Button(this, i, "normal page", i));
                        }
                    }
                    this.oButton.push(new Button(this, this.total, "normal page", this.total));
                }
                this.oButton.push(new Button(this, this.next, "normal next", "下一页"));
                for (var i = 0, btnLen = this.oButton.length; i < btnLen; i++) {
                    this.dom.appendChild(this.oButton[i].dom);
                }
                this.position.appendChild(this.dom);
            }
        },
        render: function (data) {
            this.callback(data);
        }
    };
	return Pagination;
})({
	info : true
});