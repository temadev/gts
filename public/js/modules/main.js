/**=========================================================
 * Module: main.js
 =========================================================*/

(function ($, window, document) {

  $(function () {

    var bsCarousel = $('#bsCarousel')
      , scrollTo = $('.scrollTo');

    if (bsCarousel.length > 0) {
      bsCarousel.carousel({
        interval: 3000
      });
    }

    $('ul#filter a').click(function () {
      $(this).css('outline', 'none');
      $('ul#filter .current').removeClass('current');
      $(this).parent().addClass('current');

      var filterVal = $(this).attr('rel');

      if (filterVal == 'all') {
        $('ul#portfolio li.hidden').fadeIn('slow').removeClass('hidden');
      } else {
        $('ul#portfolio li').each(function () {
          if (!$(this).hasClass(filterVal)) {
            $(this).fadeOut('normal').addClass('hidden');
          } else {
            $(this).fadeIn('slow').removeClass('hidden');
          }
        });
      }

      return false;
    });

    if (scrollTo.length > 0) {
      scrollTo.click(function (e) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
      });
    }

    $('.myForm .btn-group a').on('click', function (e) {
      e.preventDefault();
      $('.myForm .btn-group button:first-child').text($(this).text());
    });

  });

}(jQuery, window, document));
