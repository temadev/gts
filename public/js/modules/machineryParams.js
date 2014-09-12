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

}(jQuery, window, document));
