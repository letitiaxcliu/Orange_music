$(function () {

    var startIndex = 0; //开始截取下标
    var count = 12;  //截取数据数量
    var ishas = true; //标记是否存在数据

    //1.2 获取缓存数据
    var recommendSongsItem = localStorage.getItem('recommendSongsItem');
    // console.log('!专辑recommendSongsItem==>', recommendSongsItem)

    //如果不存在缓存数据，则需要请求数据
    if (!recommendSongsItem) {

        console.log('不存在缓存数据');

        //显示加载提示框
        $('.waittingbox').show();

        // 1获取推荐歌单
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:3000/personalized',

            // 推荐歌单请求成功
            success: function (recommendSongsData) {
                console.log('!recommendSongsData==>', recommendSongsData);

                // 1.2将数据缓存到本地
                localStorage.setItem('recommendSongsItem', JSON.stringify(recommendSongsData));

                recommendSongsItem = recommendSongsData;

                //调用生成歌单函数 首次展示12条数据 
                createRecommendsongs(recommendSongsItem.result.slice(startIndex, startIndex + count));
                startIndex += count; //重置下次开始截取数据的下标

                //隐藏加载提示框
                $('.waittingbox').hide();

            },

            // 推荐歌单请求失败
            error: function (err) {
                console.log('！err==>', err);

            }
        })
        
    } else {
        // console.log('存在缓存数据')

        //将recommendSongsItem转换为普通对象
        recommendSongsItem = JSON.parse(recommendSongsItem);
        console.log('!专辑recommendSongsItem==>', recommendSongsItem);

        //调用生成歌单函数 首次展示12条数据 
        createRecommendsongs(recommendSongsItem.result.slice(startIndex, startIndex + count));
        startIndex += count; //重置下次开始截取数据的下标
    }

    // 生成推荐歌单
    function createRecommendsongs(data) {
        // 1.1.遍历获取里面对应的下标i的数据v，具体的v.XX
        $.each(data, function (i, v) {

            //生成页面数据
            var data = $(`<div class="recommendSongs-item" id="${v.id}">
                        <div class="item">
                            <div class="fr">
                                <span class="fl listen-icon"></span>
                                <span class="fl listen-count">
                                    ${(v.playCount / 10000).toFixed(1)}万
                                </span>
                            </div>
                        </div>
                        <div class="recommendSongs-img">
                            <img class="autoimg" src="${v.picUrl}" alt="">
                        </div>
                        <p class="recommendSongs-txt two-txt">
                          ${v.name}
                        </p>
                    </div>
                    `);
            $('.recommendSongs-list').append(data);
        })
    }

    //专辑（推荐总歌单）懒加载获取歌单数据
    //当前盒子歌单recommendbox的滚动距离 + 最后一个盒子本身的高度>= (最后一个盒子的滚动距离-header高度)此时进行懒加载
    var headerH = parseFloat($('header').css('height'));  //获取header高度
    // console.log('headerH ==> ', headerH);

    var timers = []; // 保存当前滚动的所有定时器序号

    $('.c-recommendSongs').on('scroll', function () {

        // 当ishas= false时要放在绑定事件的开头，主要用于说明每一次的懒加载是否结束，当没有数据时可以停止
        if (!ishas) {
            console.log('我是有底线的~ ~ ~');
            return;
        }

        var recommendTop = this; //保留当前this的指向

        // 只一次的定时器setTimeout延时加载
        var timer = setTimeout(function () {

            // 清除定时器  只一次的定时器setTimeout延时加载
            for (var i = 1; i < TimeRanges.length; i++) {
                clearTimeout(timers[i]);
            }
            // console.log('歌单列表滚动距离:',$(this).scrollTop());
            // console.log('最后一个歌单项目滚动距离：',($('.recommendSongs-item').last()).offset().top)
            var recommendScrollTop = $(recommendTop).scrollTop();
            // console.log('歌单列表滚动距离:',recommendScrollTop);

            //获取最后一个节点
            var lastSongsitem = $('.recommendSongs-item').last();
            var lastTop = lastSongsitem.offset().top;
            // console.log('最后一个歌单项目滚动距离：',lastTop)

            var lastH = parseFloat(lastSongsitem.css('height'));//最后一个节点的高度

            if (recommendScrollTop + lastH >= lastTop - headerH) {
                console.log('懒加载触发');

                //每次加载12条数据
                var recommendLoadData = recommendSongsItem.result.slice(startIndex, startIndex + count);
                createRecommendsongs(recommendLoadData);

                //重置下次开始截取数据的下标
                startIndex += count;
                if (recommendLoadData.length < count) {
                    //本次不足12条数据，下次没有数据可加载
                    ishas = false;
                }
            }
            timers = []; //清空
        }, 400)

        timers.push(timer); //当前滚动的所有定时器序号
    })

    //绑定推荐歌单点击事件,  未来创建的节点也会绑定 
    $('.recommendSongs-list').on('click', '.recommendSongs-item', function () {

        // 获取歌单ID相当于js的getAttribute()，但是attr的功能比它强大，attr除了获取还可以设置
        var songsId = $(this).attr('id');
        console.log('点击专辑songsId == >', songsId);

        //显示加载提示框
        $('.waittingbox').show();

        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:3000/playlist/detail?id=' + songsId,
            success: function (eachsongsResult) {

                // console.log('推荐详细歌单数据==', eachsongsResult);

                // 缓存当前数据
                localStorage.setItem('detailedCurrentSongs', JSON.stringify(eachsongsResult))

                // 显示与隐藏
                // 等待加载层--隐藏加载提示框,点击显示详细歌单列表页
                $('.waittingbox').hide();
                // $('.c-recommendSongs').hide();
                // $('.c-detailedSongs').show();

                $('.c-recommendSongs').hide().attr('name', 'rsong0');
                $('.c-detailedSongs').show().attr('name', 'rsong1');

                $('.nav').hide().attr('name', 'navsong0');
                $('.detailedSongsnav').show().attr('name', 'navsong1');

                //绑定当前歌单数据
                var dettitleData = eachsongsResult.playlist;
                console.log('!eachsongsResult.playlist - dettitleData==>', dettitleData);
                // console.log('dettitleData 查询===》',dettitleData.coverImgUrl);

                createDetailedsongsTitle(dettitleData);

                createDetailedsongsListTitle(eachsongsResult.playlist.tracks.length);
                
                //绑定当前歌单数据
                // 一样截取12条参数之后都data好了
                var detListData = eachsongsResult.playlist.tracks.slice(0, 12);
                console.log('!detListData==>',detListData);
                // console.log('detListData 查询===》',detListData[0].al.name);
                // console.log('detListData 查询===》',detListData[0].ar[0].name);
                
                createDetailedsongsList(detListData);

                //保存专辑id
                singleSong.id = eachsongsResult.playlist.id;
                // console.log('专辑singleSong =>',singleSong); //例如singleSong=> {id: 2958547427}


                // 实现播放歌曲与详细歌单列表中单曲的关联
                var isHasAudioUrl = $(audio).attr('src'); // 获取音频
                console.log('isHasAudioUrl =>', isHasAudioUrl);//点击详细歌单先获取到在退出然后再点击进详细歌单才会获取到（同理之前）

                if (!isHasAudioUrl) {
                    console.log('没有获取到音频');
                    return;
                }
                var controlsName = $('.footer').attr('name');//获取标记的footer的name

                var cursinger_Id = $('.singer').attr('id');//当前播放歌曲id（footer的singer）
                // console.log('cursinger_Id =>',cursinger_Id);

                var $detlistItem = $('.det-list>.detlist-item');  // 详细歌单列表所有的单曲

                // 遍历查找详细单曲id
                for (var i = 0; i < $detlistItem.length; i++) {
                    var $detItem_Id = $($detlistItem[i]).data('id');  // detList的 data-id="${v.id}"

                    //匹配成功
                    if (cursinger_Id == $detItem_Id) {
                        $($detlistItem[i]).data('play', controlsName).addClass('active');//激活当前$detlistItem[i]
                        return;
                    }
                }

            }
        })

    })


    // 2222、生成详情歌单页 懒加载

    // 生成详细歌单标题介绍
    function createDetailedsongsTitle(v) {
        var detTitle = $(` 
        <div class="det-titleinfo">
        <div class="clearfix">
            <div class="detimg fl">
                <img class="autoimg" src="${v.coverImgUrl}" alt="">
            </div>
            <div class="dettxt fl">
                <h3 id="dettitle">${v.name}</h3>
                <div class="det-user">
                    <div class="userimg fl">
                        <img id="detimg" class="autoimg" src="${v.creator.avatarUrl}" alt="">
                    </div>
                    <span class="username one-txt fl">${v.creator.nickname}</span>
                    <i class="fl"></i>
                </div>
                <div class="det-txt">
                    <p class="fl two-txt" id="detintroduce">
                    ${v.description}
                    </p>
                    <i class="fr"></i>
                </div>
            </div>
        </div>
    </div>
    `);

        $('.det-title').append(detTitle);
    }

    // 生成详歌单列表标题歌曲总数量
    function createDetailedsongsListTitle(v) {
        var detlistTitle = $(`
    <div class="detlist-title clearfix">
        <i class="fl"></i>
        <h3 class="fl">播放全部</h3>
        <span>(${v}首）</span>
    </div>`);
        $('.det-list').append(detlistTitle);
    }

    // 生成详细歌单列表介绍
    function createDetailedsongsList(data) {
        $.each(data, function (i, v) {

            var detList = $(`
            <div class="detlist-item" data-id="${v.id}" data-play="0" data-songname="${v.al.name}" data-singername="${v.ar[0].name}">
                        <div class="detitem-icon">
                            <i></i>
                        </div>
                        <div class="det-song clearfix">
                            <div class="detsinger fl">
                                <img class="autoimg" src="${v.al.picUrl}" alt="">
                            </div>
                            <div class="detsong-info fl">
                                <span class="det-sonname one-txt">${v.al.name}</span>
                                <span class="det-sinname one-txt">${v.ar[0].name}-${v.name}</span>
                            </div>
                        </div>
                        <div class="det-time" data-dt="${v.dt}">${formatTime(v.dt)}</div>
                        <div class="fr det-moreinfo">
                            <i></i>
                        </div>
                    </div>
                        `);
            $('.det-list').append(detList);
        })
    }


    // 详细歌单懒加载
    var detTimers = []; //保存当前滚动的所有定时器序号

    // 获取除滚动栏外的头部高度
    var detnavH = parseFloat($('.detailedSongsnav').css('height'));
    // var dettitleH = parseFloat($('.det-title').css('height'));
    // var dettopH = detnavH + dettitleH;
    // console.log('详细页头部距离==》', detnavH);

    // var detailedCurrentSongs = JSON.parse(localStorage.getItem('detailedCurrentSongs'));
    // console.log('!detailedCurrentSongs===>',detailedCurrentSongs);

    $('.c-detailedSongs').on('scroll', function () {
        // console.log('滚动详细页歌单');
        if (!ishas) {
            // console.log('就只有上面的数量！');
            return;
        }

        var detlistTop = this; //保留当前this的指向

        var detailedCurrentSongs = JSON.parse(localStorage.getItem('detailedCurrentSongs'));
        // console.log('!detailedCurrentSongs===>',detailedCurrentSongs);

        var detSongsData = detailedCurrentSongs.playlist.tracks;
        // console.log('detSongsData.length ===>', detSongsData.length);

        var detTimer = setTimeout(function () {
            for (var i = 1; i < detTimers.length; i++) {
                clearTimeout(detTimers[i]);
            }

            var detScrollTop = $(detlistTop).scrollTop();
            // console.log('detScrollTop ==> ', detScrollTop);

            //获取最后一个节点
            var lastdetitem = $('.detlist-item').last();
            var lastdetTop = lastdetitem.offset().top;
            // console.log('最后一个歌单项目滚动距离：', lastdetTop)

            var lastdetH = parseFloat(lastdetitem.css('height'));//最后一个节点的高度

            // console.log('detScrollTop + detnavH  + lastdetH ==> ', detScrollTop + detnavH + lastdetH);

            if (detScrollTop + detnavH + lastdetH >= lastdetTop) {
                console.log('det的懒加载触发');

                //每次加载12条数据

                // console.log('详细歌单列startIndex', startIndex)

                var detData = detSongsData.slice(startIndex, startIndex + count);
                createDetailedsongsList(detData)

                //重置下次开始截取数据的下标
                startIndex += count;
                if (detData.length < count) {
                    //本次不足12条数据，下次没有数据可加载
                    ishas = false;
                }

                // // 最近播放歌曲id匹配歌单详情的歌曲id（原理同上）
                // var cursinger_Id = $('.singer').attr('id');//当前播放歌曲id（footer的singer）
                // var $detlistItem = $('.det-list>.detlist-item');
                // var controlsName = $('.footer').attr('name');//获取标记的footer的name

                // for (var i = 0; i < $detlistItem.length; i++) {

                //     var detItem_Id = $($detlistItem[i]).data('id');  // detList的 data-id="${v.id}"

                //     if (cursinger_Id ==  detItem_Id) {
                //         $($detlistItem[i]).addClass('active').data('play', controlsName);
                //     }
                // }

            }

            detTimers = [];

        }, 400)

        detTimers.push(detTimer);
    })


    // ！！！！！
})