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

var specialMachinery = {
  "AD": "Andorra",
  "AE": "United Arab Emirates",
  "AF": "Afghanistan",
  "AG": "Antigua and Barbuda",
  "AI": "Anguilla",
  "AL": "Albania",
  "AM": "Armenia",
  "AN": "Netherlands Antilles",
  "AO": "Angola",
  "AQ": "Antarctica",
  "AR": "Argentina",
  "AS": "American Samoa",
  "AT": "Austria",
  "AU": "Australia",
  "AW": "Aruba",
  "AX": "\u00c5land Islands",
  "AZ": "Azerbaijan",
  "BA": "Bosnia and Herzegovina",
  "BB": "Barbados",
  "BD": "Bangladesh",
  "BE": "Belgium",
  "BF": "Burkina Faso",
  "BG": "Bulgaria",
  "BH": "Bahrain",
  "BI": "Burundi",
  "BJ": "Benin",
  "BL": "Saint Barth\u00e9lemy",
  "BM": "Bermuda",
  "BN": "Brunei",
  "BO": "Bolivia",
  "BQ": "British Antarctic Territory",
  "BR": "Brazil",
  "BS": "Bahamas",
  "BT": "Bhutan",
  "BV": "Bouvet Island",
  "BW": "Botswana",
  "BY": "Belarus",
  "BZ": "Belize",
  "CA": "Canada",
  "CC": "Cocos [Keeling] Islands",
  "CD": "Congo - Kinshasa",
  "CF": "Central African Republic",
  "CG": "Congo - Brazzaville",
  "CH": "Switzerland",
  "CI": "C\u00f4te d\u2019Ivoire",
  "CK": "Cook Islands",
  "CL": "Chile",
  "CM": "Cameroon",
  "CN": "China",
  "CO": "Colombia",
  "CR": "Costa Rica",
  "CS": "Serbia and Montenegro",
  "CT": "Canton and Enderbury Islands",
  "CU": "Cuba",
  "CV": "Cape Verde",
  "CX": "Christmas Island",
  "CY": "Cyprus",
  "CZ": "Czech Republic",
  "DD": "East Germany",
  "DE": "Germany",
  "DJ": "Djibouti",
  "DK": "Denmark",
  "DM": "Dominica",
  "DO": "Dominican Republic",
  "DZ": "Algeria",
  "EC": "Ecuador",
  "EE": "Estonia",
  "EG": "Egypt",
  "EH": "Western Sahara",
  "ER": "Eritrea",
  "ES": "Spain",
  "ET": "Ethiopia",
  "FI": "Finland",
  "FJ": "Fiji",
  "FK": "Falkland Islands",
  "FM": "Micronesia",
  "FO": "Faroe Islands",
  "FQ": "French Southern and Antarctic Territories",
  "FR": "France",
  "FX": "Metropolitan France",
  "GA": "Gabon",
  "GB": "United Kingdom",
  "GD": "Grenada",
  "GE": "Georgia",
  "GF": "French Guiana",
  "GG": "Guernsey",
  "GH": "Ghana",
  "GI": "Gibraltar",
  "GL": "Greenland",
  "GM": "Gambia",
  "GN": "Guinea",
  "GP": "Guadeloupe",
  "GQ": "Equatorial Guinea",
  "GR": "Greece",
  "GS": "South Georgia and the South Sandwich Islands",
  "GT": "Guatemala",
  "GU": "Guam",
  "GW": "Guinea-Bissau",
  "GY": "Guyana",
  "HK": "Hong Kong SAR China",
  "HM": "Heard Island and McDonald Islands",
  "HN": "Honduras",
  "HR": "Croatia",
  "HT": "Haiti",
  "HU": "Hungary",
  "ID": "Indonesia",
  "IE": "Ireland",
  "IL": "Israel",
  "IM": "Isle of Man",
  "IN": "India",
  "IO": "British Indian Ocean Territory",
  "IQ": "Iraq",
  "IR": "Iran",
  "IS": "Iceland",
  "IT": "Italy",
  "JE": "Jersey",
  "JM": "Jamaica",
  "JO": "Jordan",
  "JP": "Japan",
  "JT": "Johnston Island",
  "KE": "Kenya",
  "KG": "Kyrgyzstan",
  "KH": "Cambodia",
  "KI": "Kiribati",
  "KM": "Comoros",
  "KN": "Saint Kitts and Nevis",
  "KP": "North Korea",
  "KR": "South Korea",
  "KW": "Kuwait",
  "KY": "Cayman Islands",
  "KZ": "Kazakhstan",
  "LA": "Laos",
  "LB": "Lebanon",
  "LC": "Saint Lucia",
  "LI": "Liechtenstein",
  "LK": "Sri Lanka",
  "LR": "Liberia",
  "LS": "Lesotho",
  "LT": "Lithuania",
  "LU": "Luxembourg",
  "LV": "Latvia",
  "LY": "Libya",
  "MA": "Morocco",
  "MC": "Monaco",
  "MD": "Moldova",
  "ME": "Montenegro",
  "MF": "Saint Martin",
  "MG": "Madagascar",
  "MH": "Marshall Islands",
  "MI": "Midway Islands",
  "MK": "Macedonia",
  "ML": "Mali",
  "MM": "Myanmar [Burma]",
  "MN": "Mongolia",
  "MO": "Macau SAR China",
  "MP": "Northern Mariana Islands",
  "MQ": "Martinique",
  "MR": "Mauritania",
  "MS": "Montserrat",
  "MT": "Malta",
  "MU": "Mauritius",
  "MV": "Maldives",
  "MW": "Malawi",
  "MX": "Mexico",
  "MY": "Malaysia",
  "MZ": "Mozambique",
  "NA": "Namibia",
  "NC": "New Caledonia",
  "NE": "Niger",
  "NF": "Norfolk Island",
  "NG": "Nigeria",
  "NI": "Nicaragua",
  "NL": "Netherlands",
  "NO": "Norway",
  "NP": "Nepal",
  "NQ": "Dronning Maud Land",
  "NR": "Nauru",
  "NT": "Neutral Zone",
  "NU": "Niue",
  "NZ": "New Zealand",
  "OM": "Oman",
  "PA": "Panama",
  "PC": "Pacific Islands Trust Territory",
  "PE": "Peru",
  "PF": "French Polynesia",
  "PG": "Papua New Guinea",
  "PH": "Philippines",
  "PK": "Pakistan",
  "PL": "Poland",
  "PM": "Saint Pierre and Miquelon",
  "PN": "Pitcairn Islands",
  "PR": "Puerto Rico",
  "PS": "Palestinian Territories",
  "PT": "Portugal",
  "PU": "U.S. Miscellaneous Pacific Islands",
  "PW": "Palau",
  "PY": "Paraguay",
  "PZ": "Panama Canal Zone",
  "QA": "Qatar",
  "RE": "R\u00e9union",
  "RO": "Romania",
  "RS": "Serbia",
  "RU": "Russia",
  "RW": "Rwanda",
  "SA": "Saudi Arabia",
  "SB": "Solomon Islands",
  "SC": "Seychelles",
  "SD": "Sudan",
  "SE": "Sweden",
  "SG": "Singapore",
  "SH": "Saint Helena",
  "SI": "Slovenia",
  "SJ": "Svalbard and Jan Mayen",
  "SK": "Slovakia",
  "SL": "Sierra Leone",
  "SM": "San Marino",
  "SN": "Senegal",
  "SO": "Somalia",
  "SR": "Suriname",
  "ST": "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
  "SU": "Union of Soviet Socialist Republics",
  "SV": "El Salvador",
  "SY": "Syria",
  "SZ": "Swaziland",
  "TC": "Turks and Caicos Islands",
  "TD": "Chad",
  "TF": "French Southern Territories",
  "TG": "Togo",
  "TH": "Thailand",
  "TJ": "Tajikistan",
  "TK": "Tokelau",
  "TL": "Timor-Leste",
  "TM": "Turkmenistan",
  "TN": "Tunisia",
  "TO": "Tonga",
  "TR": "Turkey",
  "TT": "Trinidad and Tobago",
  "TV": "Tuvalu",
  "TW": "Taiwan",
  "TZ": "Tanzania",
  "UA": "Ukraine",
  "UG": "Uganda",
  "UM": "U.S. Minor Outlying Islands",
  "US": "United States",
  "UY": "Uruguay",
  "UZ": "Uzbekistan",
  "VA": "Vatican City",
  "VC": "Saint Vincent and the Grenadines",
  "VD": "North Vietnam",
  "VE": "Venezuela",
  "VG": "British Virgin Islands",
  "VI": "U.S. Virgin Islands",
  "VN": "Vietnam",
  "VU": "Vanuatu",
  "WF": "Wallis and Futuna",
  "WK": "Wake Island",
  "WS": "Samoa",
  "YD": "People's Democratic Republic of Yemen",
  "YE": "Yemen",
  "YT": "Mayotte",
  "ZA": "South Africa",
  "ZM": "Zambia",
  "ZW": "Zimbabwe",
  "ZZ": "Unknown or Invalid Region"
}