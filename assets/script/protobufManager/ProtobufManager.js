var ProtobufManager;
(function(ProtobufManager) {
	ProtobufManager.heartCount = 1;

	var loadProtobuf = function() {
		function callback(err, root) {
			ProtobufManager.Root = root;
			ProtobufManager.Command = root.lookup("proto.Command").values;
            ProtobufManager.GameType = root.lookup("proto.GameType").values;
            ProtobufManager.Subtype = root.lookup("proto.Game.Subtype").values;
            ProtobufManager.JoinType = root.lookup("proto.UserRequest.JoinType").values;
            GameServerManager.connectServer();
		};
		protobuf.load(cc.url.raw("resources/proto/client.proto"), callback);
	};
	ProtobufManager.loadProtobuf = loadProtobuf;

	ProtobufManager.sendAutoID = function() {
		var autoID = {id : this.heartCount};
		this.serialize("proto.AutoID", autoID, this.Command.client_heart_beat);
	}

	ProtobufManager.getAutoID = function(buffer) {
		return this.decode("proto.AutoID", buffer);
	}

	ProtobufManager.serialize = function(proto, object, command) {
		var protobufObj = this.Root.lookupType(proto);
		this.serializeProtobuf(protobufObj, object, command);
	} 

	ProtobufManager.serializeProtobuf = function(protobufObj, object, command) {
		var message = this.checkMessage(protobufObj, object);
		var buffer = this.serializeMessage(protobufObj, message);
		this.packProtobuf(command, buffer);
	}
	ProtobufManager.checkMessage = function(protobufObj, object) {
		var errMsg = protobufObj.verify(object);
		if(errMsg) {
			throw Error(errMsg);
		}
		var message = protobufObj.fromObject(object);
		return message;
	}
	ProtobufManager.serializeMessage = function(protobufObj, message) {
		var buffer = protobufObj.encode(message).finish();
		var array = new Uint8Array(buffer);
		return array;
	}
	ProtobufManager.decode = function(proto, buffer) {
		var protobufObj = this.Root.lookupType(proto);
		return this.decodeProtobuf(protobufObj, buffer);
	}
	ProtobufManager.decodeProtobuf = function(protobufObj, buffer) {
		return protobufObj.decode(buffer);
	}
	ProtobufManager.packProtobuf = function(command, buffer) {
		var len = buffer.length;
		
		var byteArr = new ArrayBuffer(len + 10);
		var dv = new DataView(byteArr, 0);
		dv.setUint32(0, len + 6, false);
		dv.setUint32(4, this.heartCount, false);
		dv.setUint16(8, command, false);
		for(var i = 0; i < len; i++) {
			dv.setUint8(10 + i, buffer[i], false);
		}
		this.heartCount++;
		GameServerManager.send(byteArr);
		
	}
})(ProtobufManager || (ProtobufManager = {}));
window.ProtobufManager = ProtobufManager;