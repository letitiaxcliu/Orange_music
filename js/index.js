$(function () {

    window.singleSong = {};

    // 初始化已播放列表
    var currentSongsList = localStorage.getItem('currentSongsList');
    // console.log('currentSongsList=>',currentSongsList);//第一次为空就执行下面的if
    // currentSongsList = currentSongsList ? JSON.parse(currentSongsList):[];

    if (!currentSongsList) {
        localStorage.setItem('currentSongsList', JSON.stringify([]));
    }

    // nav点击显示和隐藏
    $('.detailedSongsnav').on('click', 'i', function () {

        // 获取data-moudle
        var moudle = $(this).data('moudle');
        var nav = $(this).data('nav');

        // 隐藏其他的name='song1'元素
        $('[name = "rsong1"]').hide();
        $('[name = "navsong1"]').hide();

        // 点击哪一个就显示相对应的哪一个
        $('.' + moudle).show().attr('name', 'rsong1');
        $('.' + nav).show().attr('name', 'navsong1');


        // 每次退出之前要记得给页面获取的数据清空，否则再次尽量就会叠加
        // $('.detailedSongsbox').empty();
        $('.det-title').empty();
        $('.det-list').empty();

    })

    //显示/隐藏播放最近播放列表songedlistbox
    $('.controls-icons').on('click', '.menu', function (e) {

        //  console.log('点击显示已经播放歌单列表');
        $('.songedlistbox').show().animate({
            top: 0
        }, 500);

    })

    //隐藏
    $('.songedlistbox').on('click', function (e) {

        var target = e.target; // 给一个目标事件,点击谁就是谁的事件
        // console.log('target ==> ', target);

        if (target == this) {
            $(this).animate({
                top: '100%'
            }, 500, function () {
                $(this).hide();
            })
        }

    })


    // 歌词页面显示与隐藏
    $('.footer').on('click', '.singer', function () {
        $('.lyricsbox').show().animate({
            top: 0
        }, 400)
    })

    $('.footer').on('click', '.contros-info', function () {
        $('.lyricsbox').show().animate({
            top: 0
        }, 400)
    })

    $('.lyricsbox').on('click', '.header-back', function () {
        $('.lyricsbox').animate({
            top: '100%'
        }, 400, function () {
            $(this).hide();
        })
    })

    //歌词页面显示/隐藏播放最近播放列表songedlistbox
    $('.lyr-menu').on('click', function (e) {

        console.log('点击显示已经播放歌单列表');
        $('.songedlistbox').show().animate({
            top: 0
        }, 500);

    })

})


