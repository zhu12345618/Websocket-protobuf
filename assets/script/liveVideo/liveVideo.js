var test;

(function (test) {
    //现在的LiveVideo和之前的video.js不一样
    //之前的video.js不管新建多少次，都只会有一个视频，现在只要新建一个LiveVideo,就会新建一个视频，所以如果只有一个视频，只能新建一个
    //如果更新视频或换视频，必须用LiveVideo的方法，这样可以在不关闭标签的情况下换视频，否则必须先关闭视频，才能新建另一个
    var LiveVideo = (function () {

        //LiveVideo的构造函数
        function LiveVideo(url, x, y, width, height) {
            this.url = url;
            this.divId = "liveVideoDiv";
            this.iframeId = "liveVideoIframe";
            this.iframe = null;
            this.liveVideoDiv = null;
            this.canvas = null;

            this.base = document.querySelector("canvas");
            this.gameDiv = document.getElementById("Cocos2dGameContainer");

            this.addDiv();
            this.addIframe();

            this.designX = x;
            this.designY = y;
            this.designW = width;
            this.designH = height;
            
            this.setX(x || 0);
            this.setY(y || 0);
            this.setWidth(width || 0);
            this.setHeight(height || 0);

            this.isNormal = false;

            var self = this;
            this.onresize = function (e) {
                // self.resize();
                
            };
            // onWindowResize.add(this.onresize);
            // this.resizeLievVideo();
            return this;
        }

        //添加存放视频的Div
        LiveVideo.prototype.addDiv = function() {
            var liveVideoDiv = document.getElementById(this.divId);
            while(liveVideoDiv) {
                liveVideoDiv = document.getElementById(this.divId + 1);
                this.divId = this.divId + 1;
            }
            liveVideoDiv = document.createElement("div");
            liveVideoDiv.style.display = "block";
            liveVideoDiv.attributes['style'].value += 'position:absolute;-webkit-overflow-scrolling: touch;overflow-y: scroll;';//解决iframe在ios下的显示问题
            liveVideoDiv.id = this.divId;
            liveVideoDiv.style.overflow = "hidden";
            liveVideoDiv.style.opacity="1";
            liveVideoDiv.style.zIndex = "-1";

            this.gameDiv.appendChild(liveVideoDiv);
            
            this.liveVideoDiv = liveVideoDiv;
        };

        //获取存放视频的Div
        LiveVideo.prototype.getDiv = function() {
            return this.liveVideoDiv;
        };

        //增加存放视频的iframe
        LiveVideo.prototype.addIframe = function() {
            var iframe = document.getElementById(this.iframeId);
            while(iframe) {
                iframe = document.getElementById(this.iframeId + 1);
                this.iframeId = this.iframeId + 1;
            }

            iframe = document.createElement("iframe");
            //var iframe = document.createElement("div");

            //var t = new Date().getTime();
            iframe.id = this.iframeId;
            iframe.name = iframe.id;

            iframe.style.position = "absolute";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.opacity = "1";
            iframe.style.display = 'block';
            iframe.frameBorder = '0';
            iframe.border = "0";
            iframe.scrolling = "no";
            
            this.iframe = iframe;

            this.liveVideoDiv.appendChild(this.iframe);

            
            this.addCanvas();
        };

        //获取存放视频的iframe
        LiveVideo.prototype.getIframe = function() {
            return this.iframe;
        };

        //获取存放视频的iframe
        LiveVideo.prototype.getIframeId = function() {
            return this.iframeId;
        };

        //创建canvas
        LiveVideo.prototype.addCanvas = function () {
            var self =this;
            this.iframe.onload = function() {
                self.canvas = self.iframe.contentWindow.document.getElementById("canvas");
                self.canvas.style.width = self.width + "px";
                self.canvas.style.height = self.height + "px";
                self.iframe.contentWindow.id = self.iframeId;
                self.iframe.contentWindow.play(self.url);
            }
            this.createLiveVideo();
        };

        LiveVideo.prototype.setX = function (x) {
            this.x = x || 0;
            this.liveVideoDiv.style.left = this.x+"px";
        };

        LiveVideo.prototype.setY = function (y) {
            this.y = y || 0;
            this.liveVideoDiv.style.top = this.y+"px";
        };

        LiveVideo.prototype.setWidth = function (width) {
            this.width = width || 0;
            this.liveVideoDiv.style.width = this.width + "px";
            this.iframe.width = this.width;
            if(this.canvas) {
                this.canvas.style.width = this.width + "px";
            }
        };

        LiveVideo.prototype.setHeight = function (height) {
            this.height = height || 0;
            this.liveVideoDiv.style.height = this.height + "px";
            this.iframe.height = this.height;
            if(this.canvas) {
                this.canvas.style.height = this.height + "px";
            }
        };

        //更新视频尺寸
        LiveVideo.prototype.resize = function () {
            this.resizeLievVideo();
            var self = this;
            var interval = window.setInterval(function() {
                
                self.resizeLievVideo();
                
            }, 60);
            window.setTimeout(function(){
                window.clearInterval(interval);
            }, 1000);
        };

        LiveVideo.prototype.resizeLievVideo = function () {
            var transformKey = egret.web.getPrefixStyleName("transform");
            this.liveVideoDiv.style[transformKey] = this.base.style[transformKey];
            this.liveVideoDiv.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";

            var baseX = 0, baseY = 0, baseWidth = 0, baseHeight = 0;

            baseX = Number(this.base.style.left.replace("px", ""));
            baseY = Number(this.base.style.top.replace("px", ""));
            baseWidth = Number(this.base.style.width.replace("px", ""));
            baseHeight = Number(this.base.style.height.replace("px", ""));

            if(this.base.style[transformKey] == "rotate(0deg)") {
                this.setX(baseX + baseWidth/this.base.width*this.designX);
                this.setY(baseY + baseHeight/this.base.height*this.designY);
            } else {
                this.setX(baseX - baseHeight/this.base.height*this.designY);
                this.setY(baseY + baseWidth/this.base.width*this.designX);
            }
            this.setWidth(this.designW/this.base.width*baseWidth);
            this.setHeight(this.designH/this.base.height*baseHeight);
        };

        //创建直播流并播放
        LiveVideo.prototype.createLiveVideo = function () {
            var url = cc.url.raw("resources/liveVideo/video.html");
            console.log(url,"vvvv");
            this.iframe.src = url + "?url=" + this.url;
        };

        //更新视频
        LiveVideo.prototype.updateLiveVideo = function () {
            this.closeLiveVideoStream();
            this.createLiveVideo();
        };
        

        //关闭直播视频流
        LiveVideo.prototype.closeLiveVideoStream = function () {
            if(this.iframe.contentWindow.closeLiveVideoStream) {
                this.iframe.contentWindow.closeLiveVideoStream();
            }
            
        };

        //关闭直播组件
        LiveVideo.prototype.closeLiveVideoWidget = function () {
            if(this.liveVideoDiv) {
                this.gameDiv.removeChild(this.liveVideoDiv);
                this.liveVideoDiv = null;
                this.iframe = null;
            }
        };

        //关闭直播视频
        LiveVideo.prototype.closeLiveVideo = function () {
            onWindowResize.remove(this.onresize);
            this.closeLiveVideoStream();
            this.closeLiveVideoWidget();
        };

        //
        LiveVideo.prototype.clearCanvas = function (){
            try {
                //var ctx=canvas.getContext("2d");
                var gl = getWebGLContext(this.canvas);
            
                if(gl){
                    gl.clearColor(1,0,0,1); 
                    gl.clear(gl.COLOR_BUFFER_BIT);
                }
                
                //ctx.fillStyle="black";
                //ctx.clearRect(0,0,canvas.width,canvas.height);
            } catch (error) {
                
            }
        };

        return LiveVideo;
    }());
    test.LiveVideo = LiveVideo;
})(test || (test = {}));
module.exports = test.LiveVideo;