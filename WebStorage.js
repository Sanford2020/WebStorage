/**
 * @author wsf 本地缓存对象
 */
(function(win){
	var doc = window.document,//文档对象
	lstore = "localStorage",//本地存储对象
	sstore = "sessionStorage",//会话级别的存储对象
	gstore = "globalStorage",//firefox专用(估计将来会被废弃);
	storage = function (){
		this.store = {};//存储对象
		this.inited = false;//是否初始化过
		this.storeName = location.hostname||"defaultStore";
	};
	//原型对象
	storage.prototype = {
		_init:function (){
			try {
				this.store = win[sstore]||win[lstore]||win[gstore][this.storeName]||(function (){
					var _storeEle= doc.createElement('div'),_body=doc.body;//创建隐含div
					_storeEle.style.display = 'none';
					_storeEle.addBehavior('#default#userData');//添加储存数据行为
					_body.appendChild(_storeEle);//添加到body（所以必须等待body加载完成后）
					return _storeEle;
				})();//优先考虑sessionStore是因为项目中最好不要把用户数据一直留在磁盘上（当然localStore也可以手动清除）
				this.inited = true;
			} catch (e) {
				this.inited = false;
				throw new Error("初始化失败！");
			}
		},
		//set数据
		_set:function(key, val) {
			if(this.inited){
				var _st = this.store;
				if(!!_st.setItem)
					_st.setItem(key,val);
				else{
					_st.load(this.storeName);
					_st.setAttribute(key,val);
					_st.save(this.storeName);
				}
			}else{
				this._init();
				arguments.callee.call(this,key,val);
			}
		},
		//get数据
		_get:function(key) {
			if(this.inited){
				var _st = this.store;
				if(!!_st.getItem)
					return _st.getItem(key);
				else{
					_st.load(this.storeName);
					return _st.getAttribute(key);
				}
			}else{
				this._init();
				return arguments.callee.call(this,key);
			}
		},
		//移除数据
		_remove:function(key) {
			if(this.inited){
				var _st = this.store;
				if(!!_st.removeItem)
					_st.removeItem(key);
				else{
					_st.load(this.storeName);
					_st.removeAttribute(key);
					_st.save(this.storeName);
				}
			}else{
				this._init();
				argumens.callee.call(this,key);
			}
				
		},
		//清空数据
		_clear:function() {
			var _st = this.store;
			if(!!_st.clear)
				_st.clear();
			else{
				//TODO
			}
		},
		//是否已经存在数据
		existData:function (key){
			return !!this._get(key);
		},
	    //添加数据
		addData:function (key,val,expire){
			this._set(key,val,expire);
		},
		//获得数据
		getData:function (key){
			return this._get(key);
		},
		//清除数据
		removeData:function (key){
			this._remove(key);
		},
		//清除所有数据
		clearAll:function (){
			this._clear();
		}
	}
	
	win.store = new storage();
	alert(store.getData("test"));
	store.addData("test",JSON.stringify({"a":"b"}));
})(window);
