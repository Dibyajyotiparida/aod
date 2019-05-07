/*
 **** File   : main.js for Audio Streaming
 **** Desc   : It lists all custom JS Codes
 **** Author : Designer Desk
 */
var $win = $(window),
    $doc = $(document),
    $dropdown = $('.nav .pull-right'),
    $sidebar = $('.sidebar-menu');
// Toggles
    $('.more-menu , .hamburger-trigger').on('click', function (e) {
        e.preventDefault();
        $('.search').removeClass('visible');
        var $toggle = $(this),
            $target = $toggle.data('target') ? $($toggle.data('target')) : $($toggle.attr('href')),
            className = $toggle.data('class') ? $toggle.data('class') : 'active';
        $toggle
                .add($target)
                .toggleClass(className);
});
//Owl Carousel
$doc.ready(function(){
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        nav:true,
        margin:30,
        lazyLoad:true,
        navText: ["<img src='/static/assets/Icons/Arrow-Drpdown-Grey.png'>","<img src='/static/assets/Icons/Arrow-Drpdown-Grey.png'>"],
        responsive:{
            0:{
                items:2
            },
            475:{
                items:3
            },
            700:{
                items:4
            },
            850:{
                items:5
            },
            1280:{
                items:6
            },
            1440:{
                items:8
            }
        }
    });

    //Search toggle in Small Screen
    $(".search .toggle").click(function () {
        $(this).parent().toggleClass('visible');
        $(this).parent().find('.search-field').focus();
        if($dropdown.hasClass('menu-visible')){
            $dropdown.removeClass('menu-visible');
        }
        if($sidebar.hasClass('menu-visible')){
            $sidebar.removeClass('menu-visible');
        }
    });

    //Close others when search opens
    $( ".search-field" ).focus(function() {
       $dropdown.removeClass('menu-visible');
    });

    // Close all when click on wrapper inner
    $('.wrapper-inner').click(function () {
        $sidebar.removeClass('menu-visible');
        $dropdown.removeClass('menu-visible');
        $('.search').removeClass('visible');
    });

    // Remove sidebar to specific pages
    if ($('.wrapper').hasClass('has-not-sidebar')) {
        $('.hamburger').hide();
    }

    //Tooltip
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    $('.ap__controls--toggle').click(function(){
        $('.track').toggleClass('is-active');
    });
    //Custom Scroller to Search
    $(function () {
      $('.ui-widget-content').addClass('mCustomScrollbar');
    })

});
