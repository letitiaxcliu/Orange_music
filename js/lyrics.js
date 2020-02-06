$(function () {

    //手指按下和离开 防止按下拖拽时出现卡音
    var isPress = false;

    window.percent = 0; //进度条百分比

    var percent2 = 0;
    // 歌词内容的top
    var wordsTop = parseFloat($('.words').css('top'));
    // console.log('wordsTop ==> ', wordsTop);

    window.index = 0;

    // 监听音频实时变化
    audio.ontimeupdate = function () {

        if (isPress) {
            return;
        }

        // console.log('!!this.currentTime  1`!!!',this.currentTime); //当前时间 currentTime 
        var dt = $('.singer').data('dt') / 1000; //拿到footer singer的时间
        // console.log('dt ==> ', dt);

        percent = this.currentTime / dt; //总时间与当前时间比
        // console.log('percent1=>',percent);


        $('.currenttime').text(formatTime(this.currentTime * 1000));

        //移动滑块
        $('.mask').css({
            left: maxLeft * percent + 'px'
        })

        //激活进度条
        $('.active-progress').css({
            width: (maxLeft * percent) + maskW / 2 + 'px'
        })

        //移动歌词
        var $pLrcs = $('.words>p');

        var pHeight = $($pLrcs[0]).height(); //

        for (var i = index; i < $pLrcs.length; i++) {

            //获取当前p的时间
            var t1 = Number($($pLrcs[i]).attr('name'));

            //防止越界
            var t2 = 0;
            if ($pLrcs[i + 1]) {
                //获取下一个p时间
                t2 = Number($($pLrcs[i + 1]).attr('name'));
            } else {
                t2 = Number.MAX_VALUE;
            }

            //如果满足条件，歌词处于$pLrcs标记处
            if (this.currentTime >= t1 && this.currentTime < t2) {

                index = i;
                var top = wordsTop - pHeight * i;
                // console.log('top=>',top);

                $($pLrcs[i]).addClass('active').prev().removeClass('active');

                // 播放自动滑动歌词
                $('.words').animate({
                    top: top + 'px'
                }, 60)
                break;
            }
        }
    }

    
    var isMove = false;  //触摸事件
    var progressW = $('.progress').width();//获取progress进度栏宽度
    // console.log('progressW ==> ', progressW);

    var maskW = $('.mask').width();  //获取mask宽度
    // console.log('maskW==> ', maskW);

    // 滑块移动最大范围
    var maxLeft = progressW - maskW / 2;
    // console.log('maxLeft=>', maxLeft);

    var spanW = $('.currenttime').width() + 10;
    // console.log('padding + spanW',spanW);

    // 进度条的拖动
    $('.layer').on('touchstart', function (e) {
        console.log('触摸开始');

        isPress = true;
        moveFun(e);
    })

    //手指在屏幕移动时
    $('.layer').on('touchmove', function (e) {
        isMove = true;

        // console.log('移动开始');
        moveFun(e);
    })

    // 手指离开屏幕
    $('.layer').on('touchend', function () {
        isMove =false;
        console.log('触摸结束');

        this.ontouchmove = null;
        
        // moveFun(e);
        var secondsT = audio.duration * percent2;
        audio.currentTime = secondsT;

        $('.currenttime').text(formatTime(secondsT * 1000));

        isPress = false;

    })

    // 进度栏拖动函数
    function moveFun(e) {
        // console.log('e.changedTouches[0]=>',e.changedTouches[0]);

        // 获取页面x轴坐标
        var pageX = e.changedTouches[0].pageX - spanW;
        // console.log(e.changedTouches[0].pageX);
        // console.log('pageX=>', pageX);

        //mask移动范围限制
        var left = pageX - maskW;
        left = left < 0 ? 0 : left >= maxLeft ? maxLeft : left;

        // 拖动mask 
        $('.mask').css({
            left: left + 'px'
        })

        //激活进度条
        $('.active-progress').css({
            width: left + 'px'
        })

        //设置音频进度
        percent2 = left / maxLeft;
        console.log('percent2=>', percent2);
    }

    // 播放暂停
    $('.lyr-play').on('click', function () {
        lyricsStatus();  //调用函数暂停与播放
    })

    function lyricsStatus() {
        var controlsName = $('.footer').attr('name');//获取标记的footer的name

        // 如果==0那么说明此时是暂停状态，
        if (controlsName == 0) {
            audio.play(); // 播放
            $('.footer').attr('name', 1);

            $('.lyr-play>i').css({
                backgroundImage: 'url("./icons/lyr-pause.png")'  //尾部播放按钮
            })

        } else {
            audio.pause();//暂停
            $('.footer').attr('name', 0);

            $('.lyr-play>i').css({
                backgroundImage: 'url("./icons/lyr-play.png")'  //尾部播放按钮
            })
        }
    }


    var songsindex = 0; //播放的音乐下标

    var currentsongItemList = JSON.parse(localStorage.getItem('currentSongsList'));
    console.log('currentsongItemList=>', currentsongItemList);

   
    // 上一曲
    $('.lyr-back').on('click', function () {

        console.log('上一首还有很多没有做');
        $('.words').empty();

        songsindex = (currentsongItemList.length + songsindex - 1) % currentsongItemList.length;

        var singerUrl = currentsongItemList[songsindex - 1].audioUrl;
        audio.src = singerUrl;

        var p = $(`<p name="">上一首</p>`);
        $('.words').append(p);
        

    })

    // 下一曲
    $('.lyr-next').on('click', function () {

        console.log('下一首还有很多没有做');
        songsindex = (songsindex + 1 )% currentsongItemList.length;
    
        var singerUrl = currentsongItemList[songsindex + 1].audioUrl;
        audio.src = singerUrl;

        $('.words').empty(); //移除之前的歌词

        var p = $(`<p name="">下一首</p>`);
        $('.words').append(p);


    })

    
    function lrcInit() {
        //初始化歌词面板
        var singerId = $('.singer').attr('id');
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:3000/lyric',
            data: {
                id: singerId // 获取singer的ID，成功加载歌词之后获取歌词并且对歌词进行切割，获取所需小段
                // 歌词间切割lyrics = lyrics.split(/[\n\r]/); 时间与内容切割 lyrics.splice(-1, 1);
            },
            success: function (data) {
                console.log('歌词加载完成！');

                var lrc = data.lrc.lyric;   //获取歌词
                // console.log('歌词=》', lyrics);

                lrc = lrc.split(/[\n\r]/);

                //去除最后一个空值
                lrc.splice(-1, 1);
                // console.log('切割的歌词=》', lrc);

                //保存歌词和歌词时间
                // var lrcData = [];
                for (var i = 0; i < lrc.length; i++) {
                    // var 一个对象o
                    // var o = {};

                    var lrcItem = lrc[i].split(/\]/);
                    // console.log('lrcItem =>',lrcItem);

                    //当前歌词的时间
                    var lycCT = lrcItem[0].slice(1);

                    //歌词时间
                    var time = lycCT.split(/:/);

                    var minute = Number(time[0]) * 60; //获取分钟
                    // console.log('minute=>',minute);
                    var second = Number(time[1]); //获取秒钟
                    var t0 = minute + second; // 目前时间
                    // console.log('分-秒-目前时间',minute + '_' + second + '_' + t0);

                    //  o.time = t0;
                    //  o.text = lrcItem[1];
                    //  lrcData.push(o);

                    //创建歌词列表  将lrcData关于o的对象操作替换为创建歌词列表,用name="${t0}"关联时间，放到歌词内容页面上
                    var p = $(`<p name="${t0}">${lrcItem[1]}</p>`);
                    $('.words').append(p);

                }
                // console.log('lrcData=>',lrcData);
            }

        })
    }
    
    //    !!!!! 
})