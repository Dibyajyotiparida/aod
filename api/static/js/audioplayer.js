var HTTP_ROOT = 'http://127.0.0.1:8000';
var audioToBePlayed;
var browserName = navigator.appName;
var varQualityMusicIndex = 0;
var audio_view_log_url = HTTP_ROOT + "/videoLogs.php";
var started = 0;
var ended = 0;
var log_id = 0;
var percen = 0;
var movie_id = 0;
var stream_id = 0;
var resume_time = 0;
var log_id_temp = 0;
var previousTime = 0;
var tTime = 0;
var currentTime = 0;
var length = 0;
var audioLogInterVal = 60;
var globalAudio;
var audio_played_from = 1;
var isFabListAdded = 1;
var remove ="";
var type = $('#playlist_type').val();
var sdk_user_id = 0;
var add_to_play = 0;
var save_playlist = 0;
if (typeof audio_embed_played_from !== typeof undefined){
    audio_played_from = audio_embed_played_from;
}
function isMobileDevice() {
    var isMobile = false;
    var iphone = 0;
    var result = 0;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("android") > -1) {
        isMobile = true;
    }
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        iphone = 1;
        isMobile = true;
    }
    if (isMobile) {
        result = (iphone == 0) ? 1 : 2;
    }
    return result;
}
function speed_change() {
    var val = parseInt($('#speed-ctrl-slider').val()) / 100;
    if (val != 0){
        globalAudio.playbackRate = val;
        $('.ap__controls--speed-ctrl').html(val+"x");
    }
}
(function (window, undefined) {
    'use strict';
    var AudioPlayer = (function () {
        // Player vars!
        var queSave;
        var addPlay;
        if (typeof hybrid !== typeof undefined && hybrid == 1) {
            queSave = 'queSave';
            addPlay = 'addPlay';
        } else {
            queSave = '';
            addPlay = '';
        }

        if (typeof playlist_enable !== typeof undefined && playlist_enable == 1) {
            var plLiPlay = '<li><a href="javascript:void(0);" data-content_id="{content_id}" data-user_id="' + sdk_user_id + '" data-is_episode="{is_episode}" data-is_new="1" class="addPlayList ' + addPlay + '">' + add_to_play + '</a></li>';
            var plLiSave = '<a href="javascript:void(0);" class="butn saveQue ' + queSave + '" data-user_id="' + sdk_user_id + '">' + save_playlist + '</a>';
        } else {
            var plLiPlay = '';
            var plLiSave = '';
        }
        var
                docTitle = document.title,
                player = document.getElementById('ap'),
                playBtn,
                playSvg,
                playSvgPath,
                prevBtn,
                nextBtn,
                plBtn,
                repeatBtn,
                volumeBtn,
                progressBar,
                preloadBar,
                curTime,
                durTime,
                trackTitle,
                trackIcon,
                trackPermalink,
                addToFavButn,
                trackCast,
                audio,
                index = 0,
                playList,
                shuffle,
                volumeBar,
                wheelVolumeValue = 0,
                volumeLength,
                repeating = false,
                seeking = false,
                rightClick = false,
                apActive = false,
                isAndroid = false,
                // playlist vars
                pl,
                plUl,
                plLi,
                tplList =
                '<li class="media" data-track="{count}"> <div class="item-cover"> <img class="_cover" src="{icon}" alt="{title}" title="{title}"/> <a class="_play-butn media-heading"> <img class="_play" src="'+playbtnImage+'"/> <img class="_pause" src="'+pausebtnImage+'"/> </a> </div><div class="item-caption"> <h4>{title}</h4> <p><span class="_current">00:00</span>/<span class="_duration">00:00</span></p></div><div class="item-options"> <div class="music"> <div class="bar1"></div><div class="bar2"></div><div class="bar3"></div></div> <div class="more-options"> <a class="dropdown-toggle dropdown-toggle1" data-toggle="dropdown"> <img src="'+moreImage+'" alt="More" width="11"/> </a> <ul> ' + plLiPlay + ' <li> <a class="pl-list__remove deleteQue" data-content_id={content_id}> ' + remove + ' </a> </li></ul> </div></div></li>',
                // settings
                settings = {
                    volume: 0.5,
                    changeDocTitle: true,
                    confirmClose: true,
                    autoPlay: true,
                    buffered: true,
                    notification: true,
                    queueList: []
                };
		function init(options, index)
        {
			if (!('classList' in document.documentElement))
            {
                return false;
            }

            if (apActive || player === null)
            {
                return 'Player already init';
            }
			settings = extend(settings, options);
            playBtn = player.querySelector('.ap__controls--toggle');
            playSvg = playBtn.querySelector('.icon-play');
            playSvgPath = playSvg.querySelector('path');
            prevBtn = player.querySelector('.ap__controls--prev');
            nextBtn = player.querySelector('.ap__controls--next');
            repeatBtn = player.querySelector('.ap__controls--repeat');
            volumeBtn = player.querySelector('.volume-btn');
            plBtn = player.querySelector('.ap__controls--playlist');
            curTime = player.querySelector('.track__time--current');
            durTime = player.querySelector('.track__time--duration');
            trackTitle = player.querySelector('.art-desc h6');
            trackIcon = player.querySelector('.card .imag_album');
            trackCast = player.querySelector('.art-desc .meta-info');
            progressBar = player.querySelector('.progress__bar');
            preloadBar = player.querySelector('.progress__preload');
            volumeBar = player.querySelector('.volume__bar');
            trackPermalink = player.querySelector('.ap__item .art .card a');
            if (typeof favourite_enable !== typeof undefined && favourite_enable == 1) {
				addToFavButn = player.querySelector('.ap__controls--add-fav');
            }

            playList = settings.queueList;
            
            playBtn.addEventListener('click', playToggle, false);
            volumeBtn.addEventListener('click', volumeToggle, false);
            repeatBtn.addEventListener('click', repeatToggle, false);

            progressBar.closest('.progress-container').addEventListener('mousedown', handlerBar, false);
            progressBar.closest('.progress-container').addEventListener('mousemove', seek, false);

            document.documentElement.addEventListener('mouseup', seekingFalse, false);

            volumeBar.closest('.volume').addEventListener('mousedown', handlerVol, false);
            volumeBar.closest('.volume').addEventListener('mousemove', setVolume);
            volumeBar.closest('.volume').addEventListener(wheel(), setVolume, false);

            document.documentElement.addEventListener('mouseup', seekingFalse, false);

            prevBtn.addEventListener('click', prev, false);
            nextBtn.addEventListener('click', next, false);

            apActive = true;

            renderPL();

            plBtn.addEventListener('click', plToggle, false);

            audio = new Audio();
            globalAudio = audio;
            audio.volume = settings.volume;
            audio.preload = 'auto';

            audio.addEventListener('error', errorHandler, false);
            audio.addEventListener('timeupdate', timeUpdate, false);
            audio.addEventListener('ended', doEnd, false);

            volumeBar.style.height = audio.volume * 100 + '%';
            volumeLength = volumeBar.css('height');

            if (settings.confirmClose) {
                window.addEventListener("beforeunload", beforeUnload, false);
            }
            if (isEmptyList()) {
                return false;
            }
            audio.src = playList[index].file;
            trackTitle.innerHTML = playList[index].title;
            if ($('.card').find('.imag_album')) {
                trackIcon.src = playList[index].icon;
            }

            trackCast.innerHTML = playList[index].cast_name;
            trackPermalink.href = playList[index].permalink;
                if (typeof favourite_enable !== typeof undefined && favourite_enable == 1) {
            // addToFavButn.setAttribute("data-content_id", playList[index].uniq_id);
            // addToFavButn.setAttribute("data-fav_status", playList[index].is_favourite);
            // addToFavButn.setAttribute("data-content_type", playList[index].is_episode);
            // addToFavButn.setAttribute("data-user_id", sdk_user_id);
                }
            if (settings.autoPlay) {
                var isMobile = false;

                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("android") > -1) {
                    isMobile = true;
                }
                if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                    isMobile = true;
                }
                if (isMobile) {
                    playBtn.classList.remove('is-playing');
                    playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
                } else {
                    audio.play();
                    playBtn.classList.add('is-playing');
                    playSvgPath.setAttribute('d', playSvg.getAttribute('data-pause'));
                    plLi[index].classList.add('pl_play');
                    notify(playList[index].title, {
                        icon: playList[index].icon,
                        body: 'Now playing'
                    });
                }

            }
        }

        function changeDocumentTitle(title) {
            if (settings.changeDocTitle) {
                if (title) {
                    document.title = title;
                } else {
                    document.title = docTitle;
                }
            }
        }

        function beforeUnload(evt) {
            if (!audio.paused) {
                var message = 'Music still playing';
                evt.returnValue = message;
                return message;
            }
        }

        function errorHandler(evt) {
            if (isEmptyList()) {
                return;
            }
            var mediaError = {
                '1': 'MEDIA_ERR_ABORTED',
                '2': 'MEDIA_ERR_NETWORK',
                '3': 'MEDIA_ERR_DECODE',
                '4': 'MEDIA_ERR_SRC_NOT_SUPPORTED'
            };
            audio.pause();
            curTime.innerHTML = '--';
            durTime.innerHTML = '--';
            progressBar.style.width = 0;
            preloadBar.style.width = 0;
            playBtn.classList.remove('is-playing');
            playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
            plLi[index] && plLi[index].classList.remove('pl_play');
            changeDocumentTitle();
            throw new Error('Houston we have a problem: ' + mediaError[evt.target.error.code]);
        }

        /**
         * UPDATE PL
         */
        function updatePL(addList, index) {
            if (!apActive) {
                return 'Player is not yet initialized';
            }
            if (!Array.isArray(addList)) {
                return;
            }
            if (addList.length === 0) {
                return;
            }
            var count = playList.length;
            var html = [];
            playList.push.apply(playList, addList);
            addList.forEach(function (item) {
                html.push(
                        tplList.replace("{count}", count++).replace("{title}", item.title).replace("{icon}", item.icon).replace("{title}", item.title).replace("{title}", item.title).replace("{content_id}", item.content_id).replace("{content_id}", item.content_id).replace("{uniq_id}", item.uniq_id).replace("{is_episode}", item.is_episode).replace("{is_episode}", item.is_episode).replace("{is_favourite}", item.is_favourite).replace("{permalink}", item.permalink)
                        );
            });
            if (plUl.querySelector('.pl-list--empty')) {
                plUl.removeChild(pl.querySelector('.pl-list--empty'));
                audio.src = playList[index].file;
                trackCast.innerHTML = playList[index].cast_name;
                trackTitle.innerHTML = playList[index].title;
                trackIcon.src = playList[index].icon;
                trackPermalink.href = playList[index].permalink;
                if (typeof favourite_enable !== typeof undefined && favourite_enable == 1) {
                // addToFavButn.setAttribute("data-content_id", playList[index].uniq_id);
                // addToFavButn.setAttribute("data-fav_status", playList[index].is_favourite);
                // addToFavButn.setAttribute("data-content_type", playList[index].is_episode);
                // addToFavButn.setAttribute("data-user_id", sdk_user_id);
            }
            }
            plUl.insertAdjacentHTML('beforeEnd', html.join(''));
            plLi = pl.querySelectorAll('li');

        }

        /**
         *  PlayList methods
         */
        function renderPL()
        {
            var html = [];
            playList.forEach(function (item, i)
            {
                html.push(
                        tplList.replace('{count}', i).replace("{title}", item.title).replace("{icon}", item.icon).replace("{title}", item.title).replace("{title}", item.title).replace("{uniq_id}", item.uniq_id).replace("{content_id}", item.content_id).replace("{content_id}", item.content_id).replace("{is_episode}", item.is_episode).replace("{is_episode}", item.is_episode).replace("{is_favourite}", item.is_favourite)
                        );
            });
            pl = create('div', {
                'className': 'playlist',
                'innerHTML': '<h2>QUEUE'+ plLiSave + '<a href="javascript:void(0);" class="butn clearQue">Clear</a></h2><div class="modal-body queueListing"> <ul class="media-list">' + (!isEmptyList() ? html.join('') : '<li class="pl-list--empty" style="width:100%;border:1px solid green;"> Empty </li>') + '</ul>'
            });
            $(pl).insertAfter('#ap .ap__inner .queList');
            plUl = pl.querySelector('.modal-body .media-list');
            plLi = plUl.querySelectorAll('li');
            pl.addEventListener('click', listHandler, false);
        }
        function listHandler(evt)
        {
            if (evt.target.matches('.media-heading'))
            {
                var current = parseInt(evt.target.closest('.media').getAttribute('data-track'), 10);
                if (index !== current) {
                    index = current;
                    play(current);
                } else {
                    playToggle();
                }
            } else {
                if (!!evt.target.closest('.pl-list__remove')) {
                    var parentEl = evt.target.closest('.media');
                    var isDel = parseInt(parentEl.getAttribute('data-track'), 10);
                    var played_content_id = playList[index].content_id;
                    var parentRem = evt.target.closest('.deleteQue');
                    var content_id = parseInt(parentRem.getAttribute('data-content_id'), 10);
                    var nwIndex;
                    var plindex;
                    var curTime;
                    var length = playList.length;
                    if (content_id != played_content_id) {
                        curTime = audio.currentTime;
                        if (index < isDel) {
                            nwIndex = parseInt(index);
                            plindex = nwIndex;
                        } else {
                            if (length > 0) {
                                if (parseInt(length) === (parseInt(isDel) + 1)) {
                                    nwIndex = 0;
                                    plindex = 0;
                                } else {
                                    var gap = parseInt(index) - 1;
                                    nwIndex = parseInt(gap);
                                    plindex = nwIndex;
                                }
                            }


                        }
                    } else {
                        if (parseInt(length) === (parseInt(isDel) + 1)) {
                            nwIndex = 0;
                            plindex = 0;
                        } else {
                            nwIndex = parseInt(index) + 1;
                            plindex = parseInt(isDel);
                        }
                    }

                    playList.splice(isDel, 1);
                    parentEl.closest('.media-list').removeChild(parentEl);
                    deleteQueueList(content_id, plindex, isDel, curTime);
                    plLi = pl.querySelectorAll('li');
                    [].forEach.call(plLi, function (el, i) {
                        el.setAttribute('data-track', i);
                    });

                    if (!audio.paused) {
                        if (isDel === index) {
                            index = plindex;
                            play(index, curTime);
                        }

                    } else {
                        if (isEmptyList()) {
                            clearAll();
                        } else {
                            if (isDel === index) {
                                if (isDel > playList.length - 1) {
                                    index -= 1;
                                }
                                audio.src = playList[index].file;
                                trackTitle.innerHTML = playList[index].title;
                                progressBar.style.width = 0;
                            }
                        }
                    }
                    if (isDel < index) {
                        index = plindex;
                        play(index, curTime);
                    }
                }

            }
        }

        function plActive() {
            if (audio.paused) {
                plLi[index].classList.remove('pl_play');
                return;
            }
            var current = index;
            varQualityMusicIndex = index;
            var cur = index - 1;
			var content_id = playList[current].content_id;
            plLi[current].classList.add('pl_play');
            $('.media-list .media[data-track=' + current + ']').addClass('pl_play');
            $('.media-list .media').not('[data-track=' + current + ']').removeClass('pl_play');
            $('.track-item[data-id=' + content_id + ']').addClass('current-track');
            $('.track-item[data-id=' + content_id + '] .left-grid a').attr('onClick', 'resumeAudio();');
            $('.track-item[data-id=' + content_id + '] .middle-grid a').attr('onClick', 'resumeAudio();');
            $('.track-item[data-id=' + content_id + '] .left-grid a').addClass('audioPause');
            $('.track-item[data-id=' + content_id + '] .middle-grid a').addClass('audioPause');
            $('.track-item[data-id=' + content_id + '] .left-grid a').removeClass('audioPlay');
            $('.track-item[data-id=' + content_id + '] .middle-grid a').removeClass('audioPlay');
            $('.track-item').not('[data-id=' + content_id + ']').find('.left-grid a').toggleClass('audioPlay');
            $('.track-item').not('[data-id=' + content_id + ']').find('.middle-grid a')
            $('.track-item').not('[data-id=' + content_id + ']').removeClass('current-track');
            $('.track-item').not('[data-id=' + content_id + ']').removeClass('audio-pause');
            $('.track-item').not('[data-id=' + content_id + ']').find('.left-grid a').attr('onClick', 'playAllAudio(this)');
            $('.track-item').not('[data-id=' + content_id + ']').find('.middle-grid a').attr('onClick', 'playAllAudio(this)');
            $('.track-item').not('[data-id=' + content_id + ']').find('.left-grid a').removeClass('audioPause');
            $('.track-item').not('[data-id=' + content_id + ']').find('.middle-grid a').removeClass('audioPause');
        }


        /**
         * Player methods
         */
        function play(currentIndex, curTime) {
			if (isFabListAdded == 0) {
                $('.addTofav').addClass('_isfav');
            } else {
                $('.addTofav').removeClass('_isfav');
            }
			if (playList.length > 0) {
                index = (parseInt(currentIndex) + parseInt(playList.length)) % parseInt(playList.length);
            } else {
                index = currentIndex;
            }
			audio.src = playList[index].file;
            trackTitle.innerHTML = playList[index].title;
            trackIcon.src = playList[index].icon;
            trackCast.innerHTML = playList[index].cast_name;
            trackPermalink.href = playList[index].permalink;
			if (typeof favourite_enable !== typeof undefined && favourite_enable == 1) {
				// addToFavButn.setAttribute("data-content_id", playList[index].uniq_id);
				// addToFavButn.setAttribute("data-fav_status", playList[index].is_favourite);
				// addToFavButn.setAttribute("data-content_type", playList[index].is_episode);
				// addToFavButn.setAttribute("data-user_id", sdk_user_id);
			}
            var content_id = playList[index].content_id;
            movie_id = playList[index].movie_id;
            stream_id = playList[index].content_id;
            if (curTime) {
                audio.currentTime = curTime;
            }
            changeDocumentTitle(playList[index].title);

            console.log("=========", playList[index]);
            if ((playList[index].content_types_id == 5 || playList[index].content_types_id == 6) && playList[index].video_resolution.length > 0) {
                //AMC
                $('#musicQualityID').show();
            } else if (playList[index].content_types_id == 8) {
                //ALS
                $('#musicQualityID').hide();
            } else {
                //IF Quality is not there.
                $('#musicQualityID').hide();
            }
            var isMobile = false;

            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("android") > -1) {
                isMobile = true;
            }
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                isMobile = true;
            }
            if (isMobile) {
                if (index == 0) {
                    playBtn.classList.remove('is-playing');
                    playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
                } else {
                    $(".ap__controls--toggle").trigger("click");
                    $('.play-section .ap__controls').addClass('is-playing');
                }
            } else {
                audio.autoplay = 'true';
                console.log(ua);

                if (ua.indexOf('safari') != -1) {
                    if (ua.indexOf('chrome') > -1) {
                        audio.play();
                    } else {
                        playBtn.addEventListener('click', playToggle, false);
                    }
                } else {
                    audio.play();
                    playBtn.classList.add('is-playing');
                    playSvgPath.setAttribute('d', playSvg.getAttribute('data-pause'));
                }


                tTime = audio.currentTime;
                length = audio.currentTime;
                audioViewLog(audio, 'start');
                // Show notification
                notify(playList[index].title, {
                    icon: playList[index].icon,
                    body: 'Now playing',
                    tag: 'music-player'
                });

                playBtn.classList.add('is-playing');
                playSvgPath.setAttribute('d', playSvg.getAttribute('data-pause'));
                $('.track-item[data-id=' + content_id + ']').addClass('current-track');
                $('.track-item[data-id=' + content_id + '] .left-grid a').attr('onClick', 'resumeAudio();');
                $('.track-item[data-id=' + content_id + '] .middle-grid a').attr('onClick', 'resumeAudio();');
                $('.track-item[data-id=' + content_id + '] .middle-grid a').addClass('audioPause');
                $('.track-item[data-id=' + content_id + '] .left-grid a').addClass('audioPause');
                $('.track-item[data-id=' + content_id + '] .left-grid a').removeClass('audioPlay');
                $('.track-item[data-id=' + content_id + '] .middle-grid a').removeClass('audioPlay');
                $('.track-item').not('[data-id=' + content_id + ']').removeClass('current-track');
                $('.track-item').not('[data-id=' + content_id + ']').removeClass('audio-pause');
                plActive();
            }
            speed_change();
        }


        function prev() {
            play(index - 1);
            var isMobile = isMobileDevice();
            if (isMobile != 0) {
                $(".ap__controls--toggle").trigger("click");
                $('.play-section .ap__controls').addClass('is-playing');
            }
        }

        function next() {
            play(index + 1);
            var isMobile = isMobileDevice();
            if (isMobile != 0) {
                $(".ap__controls--toggle").trigger("click");
                $('.play-section .ap__controls').addClass('is-playing');
            }
        }

        function isEmptyList() {
            return playList.length === 0;
        }

        /*
         * All plugin
         */
        function clearAll(curObj)
        {
            index = parseInt(curObj[0].curIndex);
            var curTime = audio.currentTime;
            audio.src = playList[index].file;
            trackTitle.innerHTML = playList[index].title;
            trackIcon.src = playList[index].icon;
            trackCast.innerHTML = playList[index].cast_name;
            trackPermalink.href = playList[index].permalink;
                if (typeof favourite_enable !== typeof undefined && favourite_enable == 1) {
            // addToFavButn.setAttribute("data-content_id", playList[index].uniq_id);
            // addToFavButn.setAttribute("data-fav_status", playList[index].is_favourite);
            // addToFavButn.setAttribute("data-content_type", playList[index].is_episode);
            // addToFavButn.setAttribute("data-user_id", sdk_user_id);
                }
            audio.currentTime = curTime;
            audio.play();
            settings.queueList = [];
            playList = settings.queueList;
            if (!plUl.querySelector('.pl-list--empty')) {
                plUl.innerHTML = '<li class="pl-list--empty"><h6>' + queue_empty + '</h6> </li>';
            }
            $('.mb').addClass('hide');
            $('.play-section .ap__controls--toggle').addClass('isCurPlay');
            $('.current-track a').attr("onclick", "playAllAudio(this);");
            $('.track-list .track-item').removeClass('current-track');
        }
        function audioMusicQualityChange(index, audio_src) {
            try {
                audio.pause();
                var curTime = audio.currentTime;
                var addList = playList[index];
                addList.file = audio_src.toString();
                playList[index] = addList;
                AP.init(playList);
                AP.play(index, curTime);
                audio.play(index, curTime);
            } catch (exception) {
                console.log("clled function :: audioMusicQualityChange", exception.message);
            }
        }

        function clearList() {
            settings.queueList = [];
            playList = settings.queueList;
            if (!plUl.querySelector('.pl-list--empty')) {
                plUl.innerHTML = '<li class="pl-list--empty"><h6>' + queue_empty + '</h6> </li>';
            }
            $('.mb').addClass('hide');
            $('.play-section .ap__controls--toggle').addClass('isCurPlay');

        }
        function playToggle()
        {
            if (isEmptyList())
            {
                return;
            }
            if (audio.paused)
            {
                if (audio.currentTime === 0)
                {
                    notify(playList[index].title,
                            {
                                icon: playList[index].icon,
                                body: 'Now playing'
                            });
                }
                changeDocumentTitle(playList[index].title);
                $('.media-list .media[data-track=' + index + ']').addClass('pl_play');
                $('.track-item[data-id=' + playList[index].content_id + ']').removeClass('audio-pause');
                audio.play();
                playBtn.classList.add('is-playing');
                playSvgPath.setAttribute('d', playSvg.getAttribute('data-pause'));
            } else {
                changeDocumentTitle();
                audio.pause();
                $('.media-list .media[data-track=' + index + ']').removeClass('pl_play');
                $('.track-item[data-id=' + playList[index].content_id + ']').addClass('audio-pause');
                $('.current-track .left-grid a').addClass('audioPause');
                $('.current-track .middle-grid a').addClass('audioPause');
                $('.current-track .left-grid a').removeClass('audioPlay');
                $('.current-track .middle-grid a').removeClass('audioPlay');
                $('.current-track .left-grid a').attr("onclick", "resumeAudio();");
                $('.current-track .middle-grid a').attr("onclick", "resumeAudio();");
                playBtn.classList.remove('is-playing');
                playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
            }
            plActive();
        }
        function playSong(title) {
            if (audio.paused) {
                changeDocumentTitle(title);
                audio.play();
                playBtn.classList.add('is-playing');
                playSvgPath.setAttribute('d', playSvg.getAttribute('data-pause'));
            } else {
                changeDocumentTitle();
                audio.pause();
                playBtn.classList.remove('is-playing');
                playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
            }
        }

        function volumeToggle() {
            if (audio.muted) {
                if (parseInt(volumeLength, 10) === 0) {
                    volumeBar.style.height = settings.volume * 100 + '%';
                    audio.volume = settings.volume;
                } else {
                    volumeBar.style.height = volumeLength;
                }
                audio.muted = false;
                volumeBtn.classList.remove('has-muted');
            } else {
                audio.muted = true;
                volumeBar.style.height = 0;
                volumeBtn.classList.add('has-muted');
            }
        }

        function repeatToggle() {
            if (repeatBtn.classList.contains('is-active')) {
                repeating = false;
                repeatBtn.classList.remove('is-active');
            } else {
                repeating = true;
                repeatBtn.classList.add('is-active');
            }
        }

        function plToggle() {
            plBtn.classList.toggle('is-active');
            pl.classList.toggle('h-show');
        }

        function timeUpdate() {
            previousTime = currentTime;
            currentTime = audio.currentTime;
            if (audioLogInterVal < audio.currentTime) {
                audioLogInterVal = audioLogInterVal + 60;
                audioViewLog(audio, 'interval');
            }

            if (playList.length > 0) {
                var played_stream_id = getCookie('played_stream_id');
                if (played_stream_id == '' || played_stream_id.length == 0) {
                    var now = new Date();
                    var currDate = now.getDate();
                    var Day = 2;
                    now.setDate(currDate + Day);
                    var expires = "expires=" + now.toUTCString();
                    document.cookie = "played_stream_id" + "=" + playList[index].content_id + "; " + expires;
                } else {
                    $.cookie("played_stream_id", '' + playList[index].content_id);
                }
            }
            if (audio.readyState === 0)
                return;
            var barlength = Math.round(audio.currentTime * (100 / audio.duration));
            progressBar.style.width = barlength + '%';

            var
                    curMins = Math.floor(audio.currentTime / 60),
                    curSecs = Math.floor(audio.currentTime - curMins * 60),
                    mins = Math.floor(audio.duration / 60),
                    secs = Math.floor(audio.duration - mins * 60);
            (curSecs < 10) && (curSecs = '0' + curSecs);
            (secs < 10) && (secs = '0' + secs);

            curTime.innerHTML = curMins + ':' + curSecs;
            $('.media-list .media .item-caption span._current').html('00:00');
            $('.media-list .media .item-caption span._duration').html('00:00');

            $('.media-list .media[data-track=' + index + '] .item-caption span._current').html(curMins + ':' + curSecs);
            if (secs == "NaN" || mins == "Infinity"){
                durTime.innerHTML = '0' + ':' + '00';
                $('.media-list .media[data-track=' + index + '] .item-caption span._duration').html('00:00');
            }
            else{
                durTime.innerHTML = mins + ':' + secs;
                $('.media-list .media[data-track=' + index + '] .item-caption span._duration').html(mins + ':' + secs);
            }

            if (settings.buffered) {
                var buffered = audio.buffered;
                if (buffered.length) {
                    var loaded = Math.round(100 * buffered.end(0) / audio.duration);
                    preloadBar.style.width = loaded + '%';
                }
            }
        }

        /**
         * TODO shuffle
         */
        function shuffle()
        {
            if (shuffle)
            {
                index = Math.round(Math.random() * playList.length);
                
            }
        }
        function doEnd() {
            audioViewLog(audio, 'end');
            if (index === playList.length - 1) {
                if (!repeating) {
                    audio.pause();
                    plActive();
                    playBtn.classList.remove('is-playing');
                    playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
                    $('.media-list .media[data-track=' + index + ']').removeClass('pl_play');
                    return;
                } else {
                    play(0);
                }
            } else {
                if (autoplay_episode == 0) {
                    audio.pause();
                    playBtn.classList.remove('is-playing');
                    playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
                } else {
                    play(index + 1);
                }

            }
        }

        /*
         * :: Process bar ::
         */
        function moveBar(evt, el, dir)
        {
            var value;
            if (dir === 'horizontal') {
                value = Math.round(((evt.clientX - el.offset().left) + window.pageXOffset) * 100 / el.parentNode.offsetWidth);
                el.style.width = value + '%';
                return value;
            } else {
                if (evt.type === wheel()) {
                    value = parseInt(volumeLength, 10);
                    var delta = evt.deltaY || evt.detail || -evt.wheelDelta;
                    value = (delta > 0) ? value - 10 : value + 10;
                } else {
                    var offset = (el.offset().top + el.offsetHeight) - window.pageYOffset;
                    value = Math.round((offset - evt.clientY));
                }
                if (value > 100)
                    value = wheelVolumeValue = 100;
                if (value < 0)
                    value = wheelVolumeValue = 0;
                volumeBar.style.height = value + '%';
                return value;
            }
        }
        function handlerBar(evt) {
            rightClick = (evt.which === 3) ? true : false;
            seeking = true;
            seek(evt);
        }
        function handlerVol(evt) {
            rightClick = (evt.which === 3) ? true : false;
            seeking = true;
            setVolume(evt);
        }
        function seek(evt) {
            if (seeking && rightClick === false && audio.readyState !== 0) {
                length = previousTime - tTime;
                var value = moveBar(evt, progressBar, 'horizontal');
                audio.currentTime = audio.duration * (value / 100);
                tTime = audio.currentTime;
                log_id_temp = 0;
                $.post(audio_view_log_url, {log_id_temp: log_id_temp, movie_id: movie_id, episode_id: stream_id, status: 'halfplay', log_id: log_id, percent: percen, played_length: length, video_length: audio.duration, played_from: audio_played_from}, function (res) {
                    if (res['log_id'] > 0) {
                        log_id = res['log_id'];
                        log_id_temp = res['log_id_temp'];
                    }
                }, 'json');

            }
        }
        function seekingFalse() {
            seeking = false;
        }
        function setVolume(evt)
        {
            evt.preventDefault();
            volumeLength = volumeBar.css('height');
            if (seeking && rightClick === false || evt.type === wheel()) {
                var value = moveBar(evt, volumeBar.parentNode, 'vertical') / 100;
                if (value <= 0) {
                    audio.volume = 0;
                    audio.muted = true;
                    volumeBtn.classList.add('has-muted');
                } else {
                    if (audio.muted)
                        audio.muted = false;
                    audio.volume = value;
                    volumeBtn.classList.remove('has-muted');
                }
            }
        }
        function notify(title, attr)
        {
            if (!settings.notification) {
                return;
            }
            if (window.Notification === undefined) {
                return;
            }
            attr.tag = 'AP music player';
            window.Notification.requestPermission(function (access) {
                if (access === 'granted') {
                    var notice = new Notification(title.substr(0, 110), attr);
                    setTimeout(notice.close.bind(notice), 5000);
                }
            });
        }

        /* 
         * Destroy method. 
         * Clear All 
         * Delete All
         */
        function destroy() {
            if (!apActive)
                return;

            if (settings.confirmClose) {
                window.removeEventListener('beforeunload', beforeUnload, false);
            }

            playBtn.removeEventListener('click', playToggle, false);
            volumeBtn.removeEventListener('click', volumeToggle, false);
            repeatBtn.removeEventListener('click', repeatToggle, false);
            plBtn.removeEventListener('click', plToggle, false);

            progressBar.closest('.progress-container').removeEventListener('mousedown', handlerBar, false);
            progressBar.closest('.progress-container').removeEventListener('mousemove', seek, false);
            document.documentElement.removeEventListener('mouseup', seekingFalse, false);

            volumeBar.closest('.volume').removeEventListener('mousedown', handlerVol, false);
            volumeBar.closest('.volume').removeEventListener('mousemove', setVolume);
            volumeBar.closest('.volume').removeEventListener(wheel(), setVolume);
            document.documentElement.removeEventListener('mouseup', seekingFalse, false);

            prevBtn.removeEventListener('click', prev, false);
            nextBtn.removeEventListener('click', next, false);

            audio.removeEventListener('error', errorHandler, false);
            audio.removeEventListener('timeupdate', timeUpdate, false);
            audio.removeEventListener('ended', doEnd, false);

            // Playlist
            pl.removeEventListener('click', listHandler, false);
            pl.parentNode.removeChild(pl);

            audio.pause();
            apActive = false;
            index = 0;

            playBtn.classList.remove('is-playing');
            playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
            volumeBtn.classList.remove('has-muted');
            plBtn.classList.remove('is-active');
            repeatBtn.classList.remove('is-active');

        }
        /*
         *  Helpers
         */
        function wheel() {
            var wheel;
            if ('onwheel' in document) {
                wheel = 'wheel';
            } else if ('onmousewheel' in document) {
                wheel = 'mousewheel';
            } else {
                wheel = 'MozMousePixelScroll';
            }
            return wheel;
        }
        /*
         *  extend
         */
        function extend(defaults, options) {
            for (var name in options) {
                if (defaults.hasOwnProperty(name)) {
                    defaults[name] = options[name];
                }
            }
            return defaults;
        }
        /*
         *  create
         */
        function create(el, attr) {
            var element = document.createElement(el);
            if (attr) {
                for (var name in attr) {
                    if (element[name] !== undefined) {
                        element[name] = attr[name];
                    }
                }
            }
            return element;
        }

        Element.prototype.offset = function () {
            var el = this.getBoundingClientRect(),
                    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            return {
                top: el.top + scrollTop,
                left: el.left + scrollLeft
            };
        };

        Element.prototype.css = function (attr) {
            if (typeof attr === 'string') {
                return getComputedStyle(this, '')[attr];
            } else if (typeof attr === 'object') {
                for (var name in attr) {
                    if (this.style[name] !== undefined) {
                        this.style[name] = attr[name];
                    }
                }
            }
        };

        // matches polyfill
        window.Element && function (ElementPrototype) {
            ElementPrototype.matches = ElementPrototype.matches ||
                    ElementPrototype.matchesSelector ||
                    ElementPrototype.webkitMatchesSelector ||
                    ElementPrototype.msMatchesSelector ||
                    function (selector) {
                        var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
                        while (nodes[++i] && nodes[i] != node)
                            ;
                        return !!nodes[i];
                    };
        }(Element.prototype);

        // closest polyfill
        window.Element && function (ElementPrototype) {
            ElementPrototype.closest = ElementPrototype.closest ||
                    function (selector) {
                        var el = this;
                        while (el.matches && !el.matches(selector))
                            el = el.parentNode;
                        return el.matches ? el : null;
                    };
        }(Element.prototype);

        /**
         *  Public methods
         */
        return {
            init: init,
            update: updatePL,
            destroy: destroy,
            play: play,
            listPlay: listHandler,
            clearQue: clearAll,
            playSong: playSong,
            clearList: clearList,
            audioMusicQualityChange: audioMusicQualityChange,
            playToggle: playToggle
        };
    })();
    window.AP = AudioPlayer;
})(window);

//val
function playAudio(obj) {
    res = "";
    AP.destroy();
    var file_name = $(obj).attr('data-file');
    var poster = $(obj).attr('data-poster');
    var duration = $(obj).attr('data-duration');
    var title = $(obj).attr('data-title');
    var permalink = $(obj).attr('data-permalink');
    var album_type = $(obj).attr('data-album_type');
    res = {"data" : [{"url" : file_name, "title" : title, "is_episode":"0", "is_favourite":0,"audio_poster":poster,"content_id":"0","uniq_id":"0","movie_id":"0","permalink": permalink ,"video_resolution":"","content_types_id":"5","cast":""}]}
    var resdata = new Array();
	var action = 'add'
	resdata = res.data;
	var index = 0;
	var title = resdata[index].title;
	muviAudioMusicPlayerObj = [];
	updateQueueList(resdata, action, index);
	$('.art-desc h6').html(title);
	/*var action = 'add';
	var index = 0;
	var title = resdata[index].title;
	muviAudioMusicPlayerObj = [];
	updateQueueList(resdata, action, index);
	$('.art-desc h6').html(title); */
	/* var id = $(val).attr('id');
    var content_type = $(val).attr('data-content_type');
    var action_url = HTTP_ROOT + "/getaudiofile/";
    var index = $(this).attr('data-index');
    $.ajax({
        url: action_url,
        data: {"audio_id": id},
        method: "post",
        async: false,
        dataType: "json",
        success: function (res) {
            AP.destroy();
            res = res;
            var resdata = new Array();
            resdata = res.data;
            var action = 'add';
            var index = 0;
            var title = resdata[index].title;
            muviAudioMusicPlayerObj = [];
            updateQueueList(resdata, action, index);
            $('.art-desc h6').html(title);
            $('.load-container').hide();
        }
     }); */
}
function playEmbedAudio(val, content_type_id, f_id, themeUrl) {
    $('.load-container').show();
    var id = '';
    stream_id = $(val).attr('id');
    movie_id = $(val).attr('movie_id');
    var content_types = $(val).attr('content_types');
    if (content_types == '5') {
        id = movie_id;
    } else {
        id = stream_id;
    }
    var action_url = HTTP_ROOT + "getaudiofile/";
    var index = $(this).attr('data-index');
    var studio_id = 0;
    if (typeof embed_studio_id != 'undefined' && embed_studio_id != '') {
        studio_id = embed_studio_id;
    }
    $.ajax({
        url: action_url,
        data: {"audio_id": id, "studio_id": studio_id, "is_embed": 1, "content_type_id": content_type_id, "film_audio_id": f_id},
        method: "post",
        async: false,
        success: function (res) {
            AP.destroy();
            AP.init({queueList: []}, 0);
            var strJSON = "";
            muviAudioMusicPlayerObj = [];
            res = JSON.parse(res);
            var resdata = new Array();
            resdata = res.data;
            var iconImage = resdata[0].audio_poster;
            var title = resdata[0].title;
            var data_mp3 = resdata[0].url;
            var cast_name = resdata[0].cast;
            content_id = resdata[0].content_id;
            var is_episode = resdata[0].is_episode;
            var is_favourite = resdata[0].is_favourite;
            var uniq_id = resdata[0].uniq_id;
            movie_id = resdata[0].movie_id;
            var content_types_id = resdata[0].content_types_id;
            var video_resolution = resdata[0].video_resolution;
            var permalink = themeUrl + '/' + resdata[0].permalink;
            var hasData = false;
            if (hasData == false) {
                strJSON = {'icon': iconImage, 'title': title, 'file': data_mp3, 'cast_name': cast_name, 'permalink': permalink, 'content_id': content_id, 'is_episode': is_episode, 'is_favourite': is_favourite, 'uniq_id': uniq_id, 'movie_id': movie_id, 'content_types_id': content_types_id, 'video_resolution': video_resolution};
            }
            muviAudioMusicPlayerObj.push(strJSON);
            $('#ap').show();
            $('body').addClass('has-player');
            $('.mb').removeClass('hide');
            $('.play-section .ap__controls').removeClass('isCurPlay');
            AP.update(muviAudioMusicPlayerObj, 0);
            AP.init(muviAudioMusicPlayerObj, 0);
            stream_id = content_id;
            audioViewLog(muviAudioMusicPlayerObj, 'start');
        }
    });
}

function playAllAudio(val) {
	$('.load-container').show();
    var index = $(val).attr('data-index');
    var album_id = $(val).attr('data-album_id');
    $.ajax({
        url: HTTP_ROOT+"/get-all-song-list/",
        data: {"album_id": album_id, "csrfmiddlewaretoken" : csrfmiddlewaretoken},
        method: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            var is_content = 1;
            audioPlay(result, index, is_content);
        }
    }); 
}
function pauseAudio(val) {
    AP.audio.pause();
}
function audioPlay(res, index, is_content) {
    var res = IsJsonString(res);
    AP.destroy();
    var resdata = new Array();
    resdata = res.data;
    var title = resdata[index].title;
    $('.art-desc h6').html(title);
    var action = 'add';
    updateQueueList(resdata, action, index);
    $('.load-container').hide();
}
function IsJsonString(str) {
    try {
        res = JSON.parse(str);
    } catch (e) {
        res = str;
    }
    return res;
}
$(document).ready(function(){
   $('body').on('click', '.addTofav', function () {
        var fav_status = $(this).attr('data-fav_status');
        var user_id = $(this).attr('data-user_id');
        var uniq_id = $(this).attr('data-content_id');
        var content_type = $(this).attr('data-content_type');
        var action = 1;
        if (user_id == '') {
            $("#loginModal").modal('show');
        } else {
            if (content_type == 1) {
                var apiurl = HTTP_ROOT + "GetAudioParentUniqueID";
                $.ajax({
                    url: apiurl,
                    data: {'user_id': user_id, authToken: STORE_AUTH_TOKEN, 'movie_stream_uniq_id': uniq_id, 'action': action, 'content_type': content_type, 'lang_code': currentLanguageCode},
                    method: "post",
                    async: false,
                    success: function (res) {
                        try {
                            if (res) {
                                uniq_id = res.uniq_id;
                                content_type = 0;
                            }
                        } catch (exception) {
                            console.log("AudioMusicQuality :: Exception", exception.message);
                        }
                    }
                });
            }
            $('.loader_episode').show();
            if ($('.addTofav').hasClass("_isfav"))
                addFavList(uniq_id, content_type, action, user_id, this);
            else
                removeFavList(uniq_id, content_type, action, user_id, this);
        }
    }); 
});
function addFavList(uniq_id, content_type, action, user_id, cObj) {
    isFabListAdded = 1;
    var url = HTTP_ROOT + "AddtoFavlist";
    $.post(url, {'user_id': user_id, authToken: STORE_AUTH_TOKEN, 'movie_uniq_id': uniq_id, 'action': action, 'content_type': content_type, 'lang_code': currentLanguageCode}, function (res) {
        $('#SuccessPopup').modal('show');
        $('.loader_episode').hide();
        $('.success_message').html(res.msg);
        $(cObj).removeClass('_isfav');
        setTimeout(function () {
            $('#SuccessPopup').modal('hide');
        }, 4000);
    });
}
function removeFavList(uniq_id, content_type, action, user_id, cObj) {
    isFabListAdded = 0;
    var url = HTTP_ROOT + "DeleteFavList";
    $.post(url, {'user_id': user_id, authToken: STORE_AUTH_TOKEN, 'movie_uniq_id': uniq_id, 'action': action, 'content_type': content_type, 'lang_code': currentLanguageCode}, function (res) {
        $('#SuccessPopup').modal('show');
        $('.loader_episode').hide();
        $('.success_message').html(res.msg);
        $(cObj).addClass('_isfav');
        setTimeout(function () {
            $('#SuccessPopup').modal('hide');
        }, 4000);
    });
}
function clearQueue(que_id, user_id, action) {
    var url = HTTP_ROOT + "updateQueueList";
    var currentIndex = $('.media-list .media.pl_play').attr('data-track');
    var currentTime = $('.track__time .track__time--current').html()
    var currentObject = [];
    strJSON = {'curIndex': currentIndex, 'currentTime': currentTime};
    currentObject.push(strJSON);
    $.post(url, {'user_id': user_id, authToken: STORE_AUTH_TOKEN, 'queue_id': que_id, 'action': action, 'lang_code': currentLanguageCode}, function (res) {
        var msg = res.msg;
        if (msg == 'delete') {
            $.removeCookie('QUEID');
            AP.clearQue(currentObject);
            muviAudioMusicPlayerObj = [];
        }
    });
}
function updateQueueList(resdata, action, index, user_id) {
	var que_id = decodeURI(getCookie("QUEID"));
    if (que_id == '' || que_id.length == 0) {
        que_id = Date.now();
    }
	var res ={"code":200,"queue_id": que_id.toString(),"data":resdata,"index":"","msg":"","is_del":0,"is_init":1,"is_exist":0};
    var now = new Date();
	var currDate = now.getDate();
	var Day = 2;
	now.setDate(currDate + Day);
	var expires = "expires=" + now.toUTCString();
	document.cookie = "QUEID" + "=" + res.queue_id + "; " + expires;
	$('#play_list #que_id').val(res.queue_id);
	$('.mb .saveQue').attr('data-que_id', '' + res.queue_id);
	$('.mb .queSave').attr('data-que_id', '' + res.queue_id);
	$('.mb .clearQue').attr('data-que_id', '' + res.queue_id);
	resdata = res.data;
	getQueueList(resdata, index);
	/* $.post(url, {'user_id': 0, 'queue_data': resdata, 'queue_id': que_id, 'action': action, 'lang_code': currentLanguageCode}, function (res) {
        var now = new Date();
        var currDate = now.getDate();
        var Day = 2;
        now.setDate(currDate + Day);
        var expires = "expires=" + now.toUTCString();
        document.cookie = "QUEID" + "=" + res.queue_id + "; " + expires;
        $('#play_list #que_id').val(res.queue_id);
        $('.mb .saveQue').attr('data-que_id', '' + res.queue_id);
        $('.mb .queSave').attr('data-que_id', '' + res.queue_id);
        $('.mb .clearQue').attr('data-que_id', '' + res.queue_id);
        resdata = res.data;
        getQueueList(resdata, index);
    }, 'json'); */
}
function deleteQueueList(content_id, index, isDel, curTime) {
    var que_id = decodeURI(getCookie("QUEID"));
    if (que_id == '' || que_id.length == 0) {
        que_id = 0;
    }
    var user_id = 0;
    var action = 'delete';
    var resdata = new Array();
    var is_del = 0;
    var url = HTTP_ROOT + "updateQueueList";
    $.post(url, {'user_id': user_id, authToken: STORE_AUTH_TOKEN, 'content_id': content_id, 'queue_id': que_id, 'action': action, 'lang_code': currentLanguageCode}, function (res) {
        resdata = res.data;
        is_del = res.is_del;
        if (resdata.length > 0) {
            getQueueList(resdata, index, isDel, is_del, curTime);
        } else {
            $.removeCookie('QUEID');
            AP.clearList();
            muviAudioMusicPlayerObj = [];
        }
    });
}
function getQueueList(resdata, index, isDel, is_del, curTime) {
	AP.destroy();
    AP.init({queueList: []}, index);
	muviAudioMusicPlayerObj = [];
    if (is_del == 1) {
        muviAudioMusicPlayerObj.splice(isDel, 1);
    }
    if (resdata.length > 0) {
        for (var i = 0; i < resdata.length; i++) {
            var iconImage = resdata[i].audio_poster;
            var title = resdata[i].title;
            var data_mp3 = resdata[i].url;
            var cast_name = resdata[i].cast;
            var content_id = resdata[i].content_id;
            var is_episode = resdata[i].is_episode;
            var is_favourite = resdata[i].is_favourite;
            var uniq_id = resdata[i].uniq_id;
            var movie_id = resdata[i].movie_id;
            var content_types_id = resdata[i].content_types_id;
            var video_resolution = resdata[i].video_resolution;
            var permalink = HTTP_ROOT + resdata[i].permalink;
            var hasData = false;
			for (var j = 0; j < muviAudioMusicPlayerObj.length; j++) {
                if (muviAudioMusicPlayerObj[j].content_id == content_id) {
                    hasData = true;
                }
            }
			if (hasData == false) {
                strJSON = {'icon': iconImage, 'title': title, 'file': data_mp3, 'cast_name': cast_name, 'permalink': permalink, 'content_id': content_id, 'is_episode': is_episode, 'is_favourite': is_favourite, 'uniq_id': uniq_id, 'movie_id': movie_id, 'content_types_id': content_types_id, 'video_resolution': video_resolution};
                muviAudioMusicPlayerObj.push(strJSON);
            } 
        }
        $('#ap').show();
        $('body').addClass('has-player');
        $('.mb').removeClass('hide');
        $('.play-section .ap__controls').removeClass('isCurPlay');
        AP.update(muviAudioMusicPlayerObj, index);
		AP.init(muviAudioMusicPlayerObj);
		AP.play(index, curTime);
    }
    var isMobile = isMobileDevice();
    $(".queueListing").mCustomScrollbar({advanced: {updateOnContentResize: true}});
    //soundOn();
}
function addToQueue(content_id, is_episode) {
    var url = HTTP_ROOT + "AddToQue";
    $.post(url, {authToken: STORE_AUTH_TOKEN, 'content_id': content_id, 'is_episode': is_episode, 'lang_code': currentLanguageCode}, function (res) {
        var resdata = res.data;
        var index = res.index;
        addNewQueue(resdata, index);
    });
    
}
function addNewQueue(resdata, user_id) {
    var url = HTTP_ROOT + "updateQueueList";
    var que_id = decodeURI(getCookie("QUEID"));
    if (que_id == '' || que_id.length == 0) {
        que_id = 0;
    }
    var action = 'add_new'
    var quelist = '';
    var newQueue = [];
    $('.loader_episode').hide();
    $.post(url, {'user_id': user_id, authToken: STORE_AUTH_TOKEN, 'queue_data': resdata, 'queue_id': que_id, 'action': action, 'lang_code': currentLanguageCode}, function (res) {
        resdata = res.data;
        var msg = res.msg;
        var is_init = res.is_init;
        var index_new = res.index;
        var is_exist = res.is_exist;
        var index = 0;
        var i = 0;
        if (resdata != '') {
            if (index_new != '') {
                i = parseInt(index_new) - 1;
            }
            var iconImage = resdata[i].audio_poster;
            var title = resdata[i].title;
            var data_mp3 = resdata[i].url;
            var cast_name = resdata[i].cast;
            var content_id = resdata[i].content_id;
            var is_episode = resdata[i].is_episode;
            var is_favourite = resdata[i].is_favourite;
            var uniq_id = resdata[i].uniq_id;
            var movie_id = resdata[i].movie_id;
            var content_types_id = resdata[i].content_types_id;
            var video_resolution = resdata[i].video_resolution;
            var new_queu_id = res.queue_id;
            var permalink = HTTP_ROOT + '/' + resdata[i].permalink;
            var hasData = false;
            for (var j = 0; j < muviAudioMusicPlayerObj.length; j++) {
                if (muviAudioMusicPlayerObj[j].content_id == content_id) {
                    hasData = true;
                }
            }
            if (is_exist == 1) {
                hasData = true;
            }
            if (hasData == false && is_init == 1) {
                strJSON = {'icon': iconImage, 'title': title, 'file': data_mp3, 'cast_name': cast_name, 'permalink': permalink, 'content_id': content_id, 'is_episode': is_episode, 'is_favourite': is_favourite, 'uniq_id': uniq_id, 'movie_id': movie_id, 'content_types_id': content_types_id, 'video_resolution': video_resolution};
                newQueue.push(strJSON);
                AP.update(newQueue, index);
            }

            if (is_init == 0) {
                AP.init({queueList: []}, index);
                muviAudioMusicPlayerObj = [];
                strJSON = {'icon': iconImage, 'title': title, 'file': data_mp3, 'cast_name': cast_name, 'permalink': permalink, 'content_id': content_id, 'is_episode': is_episode, 'is_favourite': is_favourite, 'uniq_id': uniq_id, 'movie_id': movie_id, 'content_types_id': content_types_id, 'video_resolution': video_resolution};
                muviAudioMusicPlayerObj.push(strJSON);
                AP.update(muviAudioMusicPlayerObj, index);
                AP.play(index);
                $('#ap').show();
                $('body').addClass('has-player');
                $('.c-postfooter').addClass('has-player-footer');
                $('.mb').removeClass('hide');
                $('.play-section .ap__controls').removeClass('isCurPlay');
                //soundOn();
            }
            if (que_id == '' || que_id.length == 0) {
                var now = new Date();
                var currDate = now.getDate();
                var Day = 2;
                now.setDate(currDate + Day);
                var expires = "expires=" + now.toUTCString();
                document.cookie = "QUEID" + "=" + new_queu_id + "; " + expires;
                $('.mb .saveQue').attr('data-que_id', '' + new_queu_id);
                $('.mb .clearQue').attr('data-que_id', '' + new_queu_id);
            }
        }
        $('#SuccessPopup').modal('show');
        $('.success_message').html(msg);
        setTimeout(function () {
            $('#SuccessPopup').modal('hide');
        }, 4000);
    });
}
function toObject(queDataAry, queDataEpis) {
    var result = [];
    for (i = 0; i < queDataAry.length; i++) {
        result.push(queDataAry[i] + ":" + queDataEpis[i]);
    }
    if (queDataAry.length != '' || queDataEpis.length != '') {
        QueuePlaylist(result);
    }
}
function getAudioPlaylist(url, playlist_id, user_id, index) {
    $.post(url, {'user_id': user_id, 'playlist_id': playlist_id, authToken: STORE_AUTH_TOKEN}, function (res) {
        $('#playlist_loading').hide();
        audioPlay(res, index);
    });
}
function audioViewLog(audio, audioStatus) {
    /* percen = Math.round((audio.currentTime * 100) / audio.duration);
    var status = '';
    if (audioStatus == 'start') {
        status = 'start';
    } else if (audioStatus == 'end') {
        status = 'complete';
        length = audio.currentTime - tTime;
    } else if (audioStatus == 'interval') {
        length = audio.currentTime - tTime;
        status = 'halfplay';
    }
    $.post(audio_view_log_url, {log_id_temp: log_id_temp, movie_id: movie_id, episode_id: stream_id, status: status, log_id: log_id, percent: percen, played_length: length, video_length: audio.duration, played_from: audio_played_from}, function (res) {
        if (res['log_id'] > 0)
        {
            log_id = res['log_id'];
            log_id_temp = res['log_id_temp'];
        } else {
            history.go(-1);
        }
    }, 'json');
    if (audioStatus == 'end') {
        log_id = 0;
        log_id_temp = 0;
    } */
}
function getAudioMusicQuality(obj, resData, qualityval, cmstype) {
    try {
        if (cmstype.toLowerCase().match('audio_embed')) {
            var audio_id = resData.attr('id');
            var action_url = HTTP_ROOT + "GetAudioQualityCloudFrontAudioUrl/";
            $.ajax({
                url: action_url,
                data: {"audio_id": audio_id, "bit_rate": qualityval},
                method: "post",
                async: false,
                success: function (res) {
                    try {
                        if (res) {
                            var resdata = new Array();
                            res = JSON.parse(res);
                            resdata = res.data;
                            if (resdata.length > 0) {
                                AP.audioMusicQualityChange(varQualityMusicIndex, resdata);
                            }
                        }
                    } catch (exception) {
                        console.log("AudioMusicQuality :: Exception", exception.message);
                    }
                }
            });
        } else {
            if (resData.length > 0) {
                if (resData[varQualityMusicIndex]['content_id'] != "") {
                    var action_url = HTTP_ROOT + "GetAudioQuality/";
                    var audio_id = resData[varQualityMusicIndex]['content_id'];
                    var audio_path = resData[varQualityMusicIndex]['file'];
                    audio_path = audio_path.split("&Expires=");
                    audio_path = audio_path[0].split("?buffer_log_id=");
                    var audio_path_val = audio_path[0];
                    var pre_buffer_log_id = audio_path[1];
                    $.ajax({
                        url: action_url,
                        data: {"audio_id": audio_id, "audio_path": audio_path_val, "bit_rate": qualityval, "pre_buffer_log_id": pre_buffer_log_id},
                        method: "post",
                        async: false,
                        success: function (res) {
                            try {
                                if (res) {
                                    var resdata = new Array();
                                    res = JSON.parse(res);
                                    resdata = res.data;
                                    if (resdata.length > 0) {
                                        AP.audioMusicQualityChange(varQualityMusicIndex, resdata);
                                    }
                                }
                            } catch (exception) {
                                console.log("AudioMusicQuality :: Exception", exception.message);
                            }
                        }
                    });
                }
            }
        }
    } catch (exception) {
        console.log("AudioMusicQuality :: Exception", exception.message);
    }
    console.log("MAQ-end");
}
function resumeAudio() {
    AP.playToggle();
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

