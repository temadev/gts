(function ($, window, document) {

  $(function () {

    if (!$.fn.autocomplete) return;

    $('#autocomplete-dynamic').autocomplete({
      serviceUrl: '/machinery/list',
      onSelect: function (suggestion) {
        window.location.href = suggestion.url;
      },
      transformResult: function(response) {
        response = JSON.parse(response);
        var resultSuggestions = [];
        $.map(response, function (jsonItem) {
          if (typeof jsonItem != "string") {
            $.map(jsonItem, function (suggestionItem) {
              resultSuggestions.push({ value: suggestionItem.img + suggestionItem.value, data: suggestionItem.data, url: suggestionItem.url, img: suggestionItem.img });
            });
          }
        });
        response.suggestions = resultSuggestions;
        return response;
      }
    });

  });


}(jQuery, window, document));
(function ($, window, document) {

  $(function () {

    if (!GMaps) return;

    if ($.find('#map').length == 1) {
      var map = new GMaps({ div: '#map', lat: 57.629326, lng: 39.885097 });
      map.addMarker({ lat: 57.629066, lng: 39.885269, title: 'ГТС' });
    }

  });


}(jQuery, window, document));
(function ($, window, document) {

  $(function () {

    var paramAdd = $('#paramAdd')
      , paramDel = $('#paramDel');

    paramAdd.on('click', function (e) {
      e.preventDefault();
      var num = $('.clonedInput').length
        , newNum = (num + 1)
        , param = $('#param' + num)
        , newElem = param.clone().attr('id', 'param' + newNum);
      newElem.children('div').children(':first').attr('id', 'paramName' + newNum).attr('name', 'params['+num+'][name]');
      newElem.children('div').children(':last').attr('id', 'paramValue' + newNum).attr('name', 'params['+num+'][value]');
      param.after(newElem);
      paramDel.attr('disabled', false);
      if (newNum == 5)
        paramAdd.attr('disabled', 'disabled');
    });

    paramDel.on('click', function (e) {
      e.preventDefault();
      var num = $('.clonedInput').length;
      $('#param' + num).remove();
      paramAdd.attr('disabled', false);
      if (num - 1 == 1)
        $('#paramDel').attr('disabled', 'disabled');
    });

    paramDel.attr('disabled', 'disabled');

  });

  $(function () {

    var paramAdd = $('#regionAdd')
      , paramDel = $('#regionDel');

    paramAdd.on('click', function (e) {
      e.preventDefault();
      var num = $('.clonedRegion').length
        , newNum = (num + 1)
        , param = $('#region' + num)
        , newElem = param.clone().attr('id', 'region' + newNum);
      newElem.children('div').children(':first').attr('id', 'regionName' + newNum).attr('name', 'region['+num+'][name]');
      newElem.children('div').children(':last').attr('id', 'regionSmena' + newNum).attr('name', 'region['+num+'][smena]');
      param.after(newElem);
      paramDel.attr('disabled', false);
      if (newNum == 5)
        paramAdd.attr('disabled', 'disabled');
    });

    paramDel.on('click', function (e) {
      e.preventDefault();
      var num = $('.clonedRegion').length;
      $('#region' + num).remove();
      paramAdd.attr('disabled', false);
      if (num - 1 == 1)
        $('#regionDel').attr('disabled', 'disabled');
    });

    paramDel.attr('disabled', 'disabled');

  });

}(jQuery, window, document));

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
