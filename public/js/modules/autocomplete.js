(function ($, window, document) {

  $(function () {

    if (!$.fn.autocomplete) return;

    $('#autocomplete-dynamic').autocomplete({
      serviceUrl: '/machinery/list',
      onSelect: function (suggestion) {
        window.location.href = suggestion.url;
      }
    });

  });


}(jQuery, window, document));