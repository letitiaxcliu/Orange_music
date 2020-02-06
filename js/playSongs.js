$(function () {

    // 获取原生audio获取DOM元素$('#audio')，再转原生[0]
    window.audio = $('#audio')[0];

    var baseAudioUrl = 'http://www.arthurdon.top:3000/song/url';

    // 绑定audio可以播放事件
    audio.oncanplay = function () {

        index = 0;//歌词标记
        percent = 0;  //控制条的进度条百分比

        $('.words').empty(); //移除之前的歌词

        console.log('歌曲播放');
        this.play();

        var singerId = $('.singer').attr('id');
        var ss = $('.detlist-item.active').data('id');
        var c = $('.currentsong-item.active').data('id');
        console.log('1111111-1底部-详细-已播', singerId, ss, c);

        if (isRecent) {
            console.log('已播歌单点击播放！');

            //获取播放歌曲的id
            var curId = $('.currentsong-item.active').data('id');

            //获取图片链接
            var imgSrc = $('.currentsong-item.active').data('img');

            var curTime = $('.currentsong-item.active').data('dt');

            // 关联设置头像
            $('.footer .f-img').find('.singer').attr('id', curId).addClass('active').data('dt', curTime).find('img').attr('src', imgSrc);
            // console.log('已播歌单出播放获取时间', $('.singer').data('dt')); //同下 53405

            //将播放标记修改为1
            $('.footer').attr('name', 1);

            //执行音符动画
            $('.musicnote').addClass('active');

            //修改播放暂停图标
            $('.play').css({
                backgroundImage: 'url("./icons/pause.png")'
            })

            //修改歌手和歌名
            $('.footer .contros-info').find('.song-name').text($('.currentsong-item.active').find('.ctitem-name').text());

            $('.footer .contros-info').find('.singer-name').text($('.currentsong-item.active').find('.ctitem-singer').text());

            //设置歌词页音频总时间
            $('.duration').text(formatTime($('.currentsong-item.active').data('lrctime')));

            // 获取歌词页歌名
            // $('.sname').text($('.currentsong-item.active').data('sonname'));
            $('.sname').text($('.currentsong-item.active').find('.ctitem-name').text());

            // 获取歌词页歌手
            $('.ssinger').text($('.currentsong-item.active').find('.ctitem-singer').text());
            // $('.ssinger').text($('.currentsong-item.active').data('sinname'));

            $('.currentsong-item.active').find($('.img-countbox')).addClass('con');

            $('.lyricsbox').css({
                // backgroundImage: 'url(http://p1.music.126.net/nnerw6-22QKG7Mj9tvda-g==/109951164332709637.jpg)',
                backgroundImage: 'url("./images/bg2.jpg")'
            })


            lrcInit();
            console.log('3333333333底部-详细-已播', singerId, ss, c);

            isRecent = false;

            // 其他播放方式
        } else {

            var detlistItemActive = $('.detlist-item.active');
            detlistItemActive.data('play', 1);

            $('.play').css({
                backgroundImage: 'url("./icons/pause.png")'
            })


            //将footer的name播放标记修改为1
            $('.footer').attr('name', 1);

            // 底部歌曲头像和歌曲信息随激活单曲而改变

            //记录播放歌曲的id,给头像一个id，把detlistItemActive的id给$('.footer .f-img')下的('.singer')
            $('.footer .f-img').find('.singer').attr('id', detlistItemActive.data('id'));
            // var a =  $('.footer .f-img').find('.singer').attr('id');
            // console.log(a); //(我这都没有获取到，.footer>.singer获取不到的)

            //歌名
            $('.footer .contros-info').find('.song-name').text(detlistItemActive.data('songname'));

            //歌手
            $('.footer .contros-info').find('.singer-name').text(detlistItemActive.data('singername'));
            // $('.footer .contros-info').find('.singer-name').text(detlistItemActive.data('singername'));
            // console.log(detlistItemActive.data('singername'));

            // 音符动画效果
            $('.musicnote').addClass('active');

            // 歌手头像转动动画效果
            $('.singer').addClass('active');

            //记录音频时间
            $('.singer').data('dt', detlistItemActive.find('.det-time').data('dt'));
            // console.log('详细歌单列表出播放获取时间',$('.singer').data('dt'));  //例如：268677

            //歌词页音频总时间
            $('.duration').text(formatTime(detlistItemActive.find('.det-time').data('dt')));

            // 歌词页歌名
            $('.sname').text(detlistItemActive.data('songname'));

            // 歌词页歌手
            $('.ssinger').text(detlistItemActive.data('singername'));

            //换头像
            var singerUrl = $('.detlist-item.active').find('img').attr('src');
            $('.singer').addClass('active').find('img').attr('src', singerUrl);


            var im = detlistItemActive.find('img').attr('src');
            // console.log('im', im);

            // var img = im.split([/:/]);
            // // lrc = lrc.split(/[\n\r]/);
            // console.log('img',img[0]);

            $('.lyricsbox').css({
                // backgroundImage: 'url(http://p1.music.126.net/nnerw6-22QKG7Mj9tvda-g==/109951164332709637.jpg)',
                backgroundImage: 'url("./images/bg1.jpg")'
            })

            lrcInit();
            console.log('222222222222底部-详细-已播', singerId, ss, c);

            //获取最近播放歌曲
            var currentSongsList = JSON.parse(localStorage.getItem('currentSongsList'));
            console.log('currentSongsList[]=>', currentSongsList); //currentSongsList[]=> []空数组

            // 获取激活单曲的id
            var songId = detlistItemActive.data('id');

            //验证当前播放歌曲的id是否在本地存储中,存在，则不需要缓存在本地存储中
            for (var i = 0; i < currentSongsList.length; i++) {
                if (songId == currentSongsList[i].songId) {
                    return;
                }
            }

            // 已播歌单列表所需数据（详细歌单列表中数据）,详细歌单单曲数据 是.det-list里的内容
            singleSong.songId = songId; // 歌曲id
            singleSong.imgUrl = detlistItemActive.find('img').attr('src');//图片
            singleSong.songName = detlistItemActive.data('songname');;//歌名
            singleSong.singerName = detlistItemActive.find('.det-sinname').text();//歌手及信息
            singleSong.songTime = detlistItemActive.find('.det-time').data('dt');//歌曲总时间
            // console.log('详细歌单歌曲总时间=》',singleSong.songTime);

            singleSong.sName = detlistItemActive.data('singername');//歌手歌名
            // console.log('singleSong.sName=>',singleSong.sName );

            // 限制已播歌单列表的数量
            if (currentSongsList.length >= 50) {
                currentSongsList.pop();//把对象放进去，并且放到本地存贮（currentSongsList[]在本地存贮中就不是空了）
            }
            currentSongsList.unshift(singleSong);

            localStorage.setItem('currentSongsList', JSON.stringify(currentSongsList));

        }
        console.log('1111111-2底部-详细-已播', singerId, ss, c);

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

    }

    //绑定详细歌曲列表事件
    $('.det-list').on('click', '.detlist-item', function () {

        var detliseself = this;//指向绑定的元素

        //当前是否处于激活状态
        if ($(this).hasClass('active')) {

            var playStatus = $(this).data('play'); //如果当前播放状态, 则需要停止

            if (playStatus == 1) {
                audio.pause(); //停止音频
                console.log('播放暂停！');
                $(this).data('play', 0);

                //将footer的name播放标记修改为0
                $('.footer').attr('name', 0);

                // 尾部播放暂停按钮切花
                $('.play').css({
                    backgroundImage: 'url("./icons/f-play.png")'
                })

                // 停止音符
                $('.musicnote').removeClass('active');

                // 停止转动
                $('.singer').removeClass('active');

            } else {
                audio.play(); //播放音频

                $(this).data('play', 1);

                $('.play').css({
                    backgroundImage: 'url("./icons/f-pause.png")'
                })

                // 启动音符
                $('.musicnote').addClass('active');

                // 启动转动
                $('.singer').addClass('active');

            }
        }

        else {
            // 获取歌单id(data-id="${v.id}")
            var detsongsId = $(this).data('id');
            console.log('click-detsongsId===>', detsongsId);

            // 根据id获取信息
            $.ajax({
                type: 'GET',
                url: baseAudioUrl,
                data: {
                    id: detsongsId
                },
                success: function (result) {
                    console.log('每首歌信息==>', result);

                    // 查找之前激活的detlist-item
                    var detlistActive = $('.detlist-item.active');
                    // console.log('是否激活的歌单==>', detlistActive);

                    //如果存在之前激活的detlist-item
                    if (detlistActive.length == 1) {
                        detlistActive.removeClass('active').data('play', 0);
                    }

                    // 设置audio链接query的方法
                    $(audio).attr('src', result.data[0].url);

                    $(detliseself).addClass('active');

                    // 保存音频链接
                    singleSong.audioUrl = result.data[0].url

                }
            })

        }

    })


    // 生成已播列表 点击已播放歌单列表事件（点击底部的menu才开始加载生成）
    $('.controls-icons').on('click', '.menu', function () {

        $('.currentsonglist').empty();//每次进来之前清除掉之前的歌单

        // 生成列表(获取已播歌单)
        var currentsongItemList = JSON.parse(localStorage.getItem('currentSongsList'));
        console.log('currentsongItemList=>', currentsongItemList);

        // var a = currentsongItemList[0];
        // console.log('11111===>',a);

        // 生成已播列表数据 每次点开都要拿一下
        function createSongedList() {
            $.each(currentsongItemList, function (i, v) {

                var currentsongItem = $(`<div class="currentsong-item" 
                    data-id="${v.songId}" data-dt="${v.songTime}" data-audioUrl="${v.audioUrl}" data-img="${v.imgUrl}" data-sinname="${v.sName}" data-sonname=${v.songName} data-lrctime="${v.songTime}">
                        <div class="fl img-countbox">
                            <span class="imgcount index">${i + 1 >= 10 ? i + 1 : '0' + (i + 1)}</span>
                            <img class="autoimg imgcount ct-avatar" src="${v.imgUrl}" alt="">
                        </div>
                        <div class="fl ctitem-txt clearfix">
                            <div class="fl ctitem-info">
                                <span class="fl ctitem-name one-txt">${v.songName}</span>
                                <span class="fl ctitem-singer one-txt">-${v.singerName}</span>
                            </div>
                            <div class="fr love">
                                <i></i>
                            </div>
                        </div>
                        <div class="fr del">
                            <i></i>
                        </div>
                    </div>
                    `);

                $('.currentsonglist').append(currentsongItem);
            })
        }
        createSongedList()


        //获取当前播放歌曲的id
        var currentsongId = $('.footer .f-img').find('.singer').attr('id');
        console.log('当前播放歌曲的currentsongId=>', currentsongId);

        // 如果歌曲存在
        if (currentsongId != undefined) {
            $('.currentsong-item').each(function (i, v) {

                //匹配歌曲id 当前DOM元素的id 为dataId
                var dataId = $(v).data('id');
                if (currentsongId == dataId) {
                    $(v).addClass('active');
                }
            })
        } else {
            return;
        }
    })

    // 删除本地存贮歌曲
    $('.songedlist').on('click', '.del', function (e) {
        console.log('点击删除单曲按钮');

        // 阻止事件冒泡（父元素有自己的绑定事件）
        e.stopPropagation();

        //获取删除歌曲的id
        var parent = $(this).parents('.currentsong-item');
        var delsongId = parent.data('id');

        console.log('删除歌曲的id', delsongId);
        // 重新声明需要删除的歌单列表的数组对象(从currentSongsList获取的)
        var delSongsList = JSON.parse(localStorage.getItem('currentSongsList'));

        function Del() {
            $.each(delSongsList, function (i, v) {

                //如果找到删除歌曲的id
                if (v.songId == delsongId || v.songId == undefined) {
                    delSongsList.splice(i, 1);

                    parent.remove();//移除
                    // 删除之后将山最新的数组给回到本次存贮
                    localStorage.setItem('currentSongsList', JSON.stringify(delSongsList));

                    // 更正序号
                    var $indexs = $('.index');
                    for (var j = i; j < delSongsList.length; j++) {
                        $indexs.eq(j).text(j + 1 >= 10 ? j + 1 : '0' + (j + 1));
                    }

                    return false;  //跳出循环, 终止遍历
                }
            })
        }
        Del();
    })

    
    window.isRecent = false;
    //绑定点击已经播放列表歌曲实现播放暂停
    $('.songedlist').on('click', '.currentsong-item', function (e) {
        // console.log('单曲点击成功');

        // 阻止事件冒泡（父元素有自己的绑定事件）
        e.stopPropagation();

        //如果当前歌曲是处于激活状态就暂停，否则就给一个标记开关获取音频播放该歌曲
        if ($(this).hasClass('active')) {

            musiciconStatus(); //调用函数暂停
        } else {
            // console.log(this);

            isRecent = true; //判断是否点击已经播放列表播放歌曲

            //去除已经激活的歌曲状态
            $('.currentsong-item.active').removeClass('active');

            // 已播歌单点击播放新歌曲
            var songedaudioUrl = $(this).data('audiourl');//获取已播单曲的data属性的audiourl
            console.log('songedaudioUrl ==> ', songedaudioUrl);

            // 将src赋给songedaudiourl就可以播放了
            audio.src = songedaudioUrl;

            // 添加类激活状态
            $(this).addClass('active');

        }

    })

    // 音乐其他icon等状态变化（函数）
    function musiciconStatus() {
        var controlsName = $('.footer').attr('name');//获取标记的footer的name

        // 如果==0那么说明此时是暂停状态，
        if (controlsName == 0) {

            audio.play(); // 播放
            $('.footer').attr('name', 1);
            console.log('已播列表/控制台点击播放');

            $('.singer').addClass('active'); //尾部头像

            $('.play').css({
                backgroundImage: 'url("./icons/f-pause.png")'  //尾部播放按钮
            })

            $('.musicnote').addClass('active'); //音符

            $('.detlist-item.active').data('play', 1);//详细歌单列表播放状态

            $('.img-countbox.con>.index').css({
                display: 'none'
            })

            $('.img-countbox.con>.ct-avatar').css({
                display: 'block'
            })

        } else {
            audio.pause();//暂停
            $('.footer').attr('name', 0);
            console.log('已播列表点/控制台击暂停');

            $('.play').css({
                backgroundImage: 'url("./icons/f-play.png")'  //尾部暂停按钮
            })

            $('.singer').removeClass('active');  // 停止转动

            $('.musicnote').removeClass('active');  // 停止音符

            $('.detlist-item.active').data('play', 1);//详细歌单列表停止状态

            $('.img-countbox.con>.index').css({
                display: 'block'
            })

            $('.img-countbox.con>.ct-avatar').css({
                display: 'none'
            })

        }

    }


    // footer控制台播放暂停
    $('.play').on('click', function () {

        var isHasurl = audio.getAttribute('src'); //html的audio的src
        // console.log('ishasurl =>', isHasurl); //点击详细歌单先获取到在退出然后再点击进详细歌单才会获取到

        if (!isHasurl) {
            console.log('音频不存在！');
            return;
        }

        musiciconStatus();  //调用函数暂停与播放
    })


    // !!!!
})