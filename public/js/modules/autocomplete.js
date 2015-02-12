(function ($, window, document) {

  $(function () {

    if (!$.fn.autocomplete) return;

    $('#autocomplete-dynamic').autocomplete({
      serviceUrl: '/machinery/list',
      onSelect: function (suggestion) {
        $('#autocomplete-dynamic').val('');
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