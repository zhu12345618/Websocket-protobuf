var LiveVideo = require("liveVideo");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        var url = "113.10.194.250:81/tpy/mtable3";
        var liveVideo = new LiveVideo(url, 0, 0, 1136, 640)
    },

    onClickLoginBtn : function() {
        console.log("onClickLoginBtn");
    },

    onClickResetBtn : function() {
        console.log("onClickResetBtn");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
