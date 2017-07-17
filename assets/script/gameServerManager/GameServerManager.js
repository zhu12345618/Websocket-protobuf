var GameServerManager;
(function(GameServerManager) {
	var socket;
	var heartTimer;

	GameServerManager.readyState = {
		Connecting : 0,
		Connected : 1,
		disConnected : 2,
	}
	
	GameServerManager.connectServer = function() {
		socket = new WebSocket("ws://192.168.11.111:5188");
		socket.binaryType = 'arraybuffer';
		var self = this;
		socket.onopen = function() {
			console.log("onopen", this);
			if(self.onOpen) {
				self.onOpen();
			}
		}
		socket.onmessage = function(e) {
			if(self.onReceive) {
				self.onReceive(e.data);
			}
		}
		socket.onclose  = function() {
			if(self.onClose) {
				self.onClose();
			}
		}
	}

	function getSocketState() {
		return socket.readyState;
	}
	GameServerManager.getSocketState = getSocketState;

	GameServerManager.send = function(data) {
		if(socket.readyState == this.readyState.Connected) {
			socket.send(data);
		}
	}

	GameServerManager.initHeartTimer = function() {
		var self = this;
		function callback() {
			ProtobufManager.sendAutoID();
		}
		heartTimer = window.setInterval(callback, 1000);
	}

	GameServerManager.onOpen = function() {
		this.initHeartTimer();
	}

	GameServerManager.onReceive = function(data) {
		var dataView = new DataView(data);
		var length = dataView.getInt32(0, false);
		var id = dataView.getInt32(4, false);
		var command = dataView.getInt16(8, false);
		// console.info(length, id, command);
		var buffer =  new Uint8Array(length - 6) 
		for(var i = 0; i < length - 6; i++) {
			buffer[i] = dataView.getInt8(i + 8, false);
		}
	}

	GameServerManager.onClose = function() {
		window.clearInterval(heartTimer);
	}

})(GameServerManager || (GameServerManager = {}));

window.GameServerManager = GameServerManager;