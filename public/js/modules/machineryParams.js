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
      if (newNum == 10)
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
