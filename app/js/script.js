var $document = jQuery(document);

$document.ready(function($) {
    /*~~~~  Скрипт выбора продукта  ~~~~*/
    $('.elem1>.mainPage__element_white').click(function () {
        $('.mainPage__element.elem1').toggleClass('mainPage__element_active');
    });
    $('.elem2>.mainPage__element_white').click(function () {
        $('.elem2>.mainPage__element_white').hover(function() {
                $('.mainPage__element.elem2').removeClass('mainPage__element_active');
            },
            function() {
                $('.mainPage__element.elem2').toggleClass('mainPage__element_active');
            }
        );
    });
    $('#clickLink').click(function () {
        $('.mainPage__element.elem1').toggleClass('mainPage__element_active');
    });
    /*~~~~  Скрипт выбора продукта^  ~~~~*/
});


jQuery(function($){
    /*~~~~  Скрипт 'Кнопки вверх'  ~~~~*/
    $(window).scroll(function() {
        if($(this).scrollTop() > 170) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    });
    $('#toTop').click(function() {
        $('body,html').animate({scrollTop:0},2600);
        return false;
    });
    /*~~~~  Скрипт 'Кнопки вверх'^  ~~~~*/
});

