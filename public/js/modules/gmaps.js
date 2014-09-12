(function ($, window, document) {

  $(function () {

    if (!GMaps) return;

    if ($.find('#map').length == 1) {
      var map = new GMaps({ div: '#map', lat: 57.629326, lng: 39.885097 });
      map.addMarker({ lat: 57.629066, lng: 39.885269, title: 'ГТС' });
    }

  });


}(jQuery, window, document));