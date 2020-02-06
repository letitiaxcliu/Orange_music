
//格式化时间，接收一个单位毫秒的参数
function formatTime(m) {
    //将毫秒转换为秒
    var second = Math.floor(m / 1000 % 60);
    second = second >= 10 ? second : '0' + second;
    //将毫秒转换为分钟
    var minute = Math.floor(m / 1000 / 60);
    minute = minute >= 10 ? minute : '0' + minute;

    return minute + ':' + second;
}

(function () {

    var data = {
        len: null, //li内容的长度
       
        index: 0,  //当前运动到到位置   下标
        
        slide: $('.slide'), //最外面到盒子
        
        ul: $('.slide>ul'), //盒子里面到ul
       
        slideW: null,  //获取一下每一次移动的距离
        
        isint: true, //是否执行动画

        init: function () { //执行函数
        
            this.start();  //初始化加载
           
            this.mouseTog();  //鼠标移入暂停动画
        },
        //初始化执行
        start: function () {

            this.len = this.ul.children('li').length;
            var li = this.ul.children('li:nth-child(1)').get(0).outerHTML;
           
            this.ul.append(li)

            var slideW = this.slide.width();
            //获取ul的宽度   根据li的总长度来获取
            var ulwidth = slideW * (this.len + 1);
            //给ul和li添加上宽度
            this.ul.css({
                width: ulwidth + 'px'
            })
            this.ul.children('li').css({
                width: slideW + 'px'
            })

            //每一次移动的距离
            this.slideW = slideW;
            var that = this;
            //定时器执行轮播
            setInterval(function () {
                that.indexPosition()
            }, 1000)
        },
        //移入的时候暂停动画   移出继续执行动画
        mouseTog: function () {

            var that = this;
            this.slide.mousemove(function () {
            that.isint = false;

            }).mouseout(function () {
                that.isint = true;
            })
        },

        indexPosition: function () {
            //判断是否启用轮播动画
            if (!this.isint) {
                return true;
            }
            var that = this;  //指针指向全局data对象
            //每执行一次轮播一个图片   下标+1
            that.index++;
            that.ul.animate({

                left: -that.index * that.slideW

            }, 800, function () {

                //根据len的长度判断是否已经轮播到最后一张  如果到最后一张  那么复原从新开始轮播

                if (that.index == that.len) {
                    that.ul.css({
                        left: 0
                    }, 400)
                    that.index = 0;
                }
            })
        }
    }
    data.init();
    
})(jQuery)