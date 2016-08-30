(function () {
	function Event() {
		this.json = {};	 // { abc: [fn, fn, fn], data: [], end: [...] }
	}

	Event.prototype.addListener = Event.prototype.on = function ( name, fn ) {
		if ( !this.json[name] ) {
			this.json[name] = [];
		}
		
		this.json[name].push( fn );
	};

	Event.prototype.emit = function ( name, data ) {
		var arr = [];
		
		arr = arr.concat.apply( arr, arguments );
		
		arr.shift();
		
		if ( this.json[name] ) {
			var fns = this.json[name];

			for ( var i = 0; i < fns.length; i++ ) {
				fns[i].apply( null, arr );
			}
		}
	};

	if ( window.EventEmitter === undefined ) window.EventEmitter = Event;
})();