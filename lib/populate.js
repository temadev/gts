'use strict';

var mongoose = require('mongoose')
  , async = require('async')
  , request = require('request');

mongoose.set('debug', true);

function populateDB() {
  async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    createCategory
//    createMachinery,
//    createPage
  ], function (err) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
  });
}

function open(callback) {
  mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
}

function requireModels(callback) {
  require('../models/user');
  require('../models/category');
  require('../models/machinery');
  require('../models/page');

  async.each(Object.keys(mongoose.models), function (modelName, callback) {
    mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

function createUsers(callback) {
  var users = [
    {
      lastname: 'Кашин',
      firstname: 'Артем',
      middlename: 'Андреевич',
      phone: '9108228988',
      email: 'artem.kashin@gmail.com',
      password: '111111',
      role: 'admin',
      post: 'Разработчик',
      photo: '',
      status: true
    },
    {
      lastname: 'Ходырев',
      firstname: 'Олег',
      middlename: 'Витальевич',
      phone: '9058221111',
      email: 'o89058221111@gmail.com',
      password: '111111',
      role: 'admin',
      post: 'Директор',
      photo: '',
      status: true
    }
  ];

  async.each(users, function (userData, callback) {
    var user = new mongoose.models.User(userData);
    user.save(callback);
  }, callback);
}

function createCategory(callback) {

  var topCategories = [
    {
      title: 'Строительная техника',
      url: 'stroitelnaja-tehnika'
    },
    {
      title: 'Грузоподьемная техника',
      url: 'gruzopodemnaja-tehnika'
    },
    {
      title: 'Грузовой транспорт',
      url: 'gruzovoj-transport'
    }
  ];
  var categoriesBuilding = [
    {
      title: 'Автогрейдеры',
      url: 'avtogrejdery',
      canonical: '/rental/motor_graders/',
      image: '1.png'
    },
    {
      title: 'Бетономиксеры',
      url: 'betonomiksery',
      canonical: '/rental/betonomiksery/',
      image: '2.png'
    },
    {
      title: 'Бетононасосы',
      url: 'betononasosy',
      canonical: '/rental/concrete_pumps/',
      image: '3.png'
    },
    {
      title: 'Бульдозеры',
      url: 'buldozery',
      canonical: '/rental/bulldozers/',
      image: '4.png'
    },
    {
      title: 'Буровые машины',
      url: 'burovye-mashiny',
      canonical: '/rental/drilling_machines/',
      image: '5.png'
    },
    {
      title: 'Гидромолоты',
      url: 'gidromoloty',
      canonical: '/rental/gidromoloty/',
      content: 'Обычно арендой бетономиксеров пользуются строительные предприятия в тех случаях, когда покупка такого борудования экономически невыгодна. Как правило, услугами пользуются при постройке небольших помещений, домов, бань, гаражей и т.п. Работа выполняется в кратчайшие сроки и покупка дорогой техники бывает не всегда оправданной. Бетономиксер представляет собой устройство, смешивающее специальные компоненты, из которых получаются строительные растворы и бетонные смеси. Имеет вращающийся барабан и работающие за счет электромотора лопасти. Для небольших работ используют передвижной аппарат, а для более объемных и сложных - стационарный.',
      image: '6.png'
    },
    {
      title: 'Катки дорожные',
      url: 'katki-dorozhnye',
      canonical: '/rental/road_rollers/',
      image: '7.png'
    },
    {
      title: 'Мини экскаваторы',
      url: 'mini-jekskavatory',
      canonical: '/rental/mini_excavators/',
      image: '8.png'
    },
    {
      title: 'Траншеекопатели (бара)',
      url: 'transheekopateli',
      canonical: '/rental/trench_diggers/',
      image: '9.png'
    },
    {
      title: 'Фронтальные погрузчики',
      url: 'frontalnye-pogruzchiki',
      canonical: '/rental/front_loaders/',
      image: '10.png'
    },
    {
      title: 'Экскаваторы гусеничные',
      url: 'jekskavatory-gusenichnye',
      canonical: '/rental/excavators/',
      image: '11.png'
    },
    {
      title: 'Экскаваторы колесные',
      url: 'jekskavatory-kolesnye',
      canonical: '/rental/wheeled_excavators/',
      image: '12.png'
    },
    {
      title: 'Экскаваторы-погрузчики',
      url: 'jekskavatory-pogruzchiki',
      canonical: '/rental/excavators_loaders/',
      image: '13.png'
    }
  ];
  var categoriesFreight = [
    {
      title: 'Автовышки',
      url: 'avtovyshki',
      canonical: '/rental/aerial_platforms/',
      image: '14.png'
    },
    {
      title: 'Автокраны',
      url: 'avtokrany',
      canonical: '/rental/truck_cranes/',
      image: '15.png'
    },
    {
      title: 'Манипуляторы',
      url: 'manipuljatory',
      canonical: '/rental/manipulators/',
      image: '16.png'
    },
    {
      title: 'Телескопические погрузчики',
      url: 'teleskopicheskie-pogruzchiki',
      canonical: '/rental/telescopic_loaders/',
      image: '17.png'
    }
  ];
  var categoriesTransport = [
    {
      title: 'Бортовой автотранспорт',
      url: 'bortovoj-avtotransport',
      canonical: '/rental/on_board_vehicles/',
      image: '18.png'
    },
    {
      title: 'Длинномеры',
      url: 'dlinnomery',
      canonical: '/rental/dlinnomery/',
      image: '19.png'
    },
    {
      title: 'Самосвалы',
      url: 'samosvaly',
      canonical: '/rental/dump_trucks/',
      image: '20.png'
    },
    {
      title: 'Тралы',
      url: 'traly',
      canonical: '/rental/trawls/',
      image: '21.png'
    }
  ];

//  function saveCategory(category, categories, callback) {
//    return async.each(categories, function (buildingData, callback) {
//      buildingData.category = category._id;
//      var newCategory = new mongoose.models.Category(buildingData);
//      newCategory.save(callback);
//    }, callback);
//  }

  async.each(topCategories, function (categoryData, callback) {
    var newCategory = new mongoose.models.Category(categoryData);
    newCategory.save(function (err, category) {
      if (category.title === 'Строительная техника') {
//        saveCategory(category, categoriesBuilding, callback)(callback);
        async.each(categoriesBuilding, function (buildingData, callback) {
          buildingData.category = category._id;
          var newCategoryBuilding = new mongoose.models.Category(buildingData);
          newCategoryBuilding.save(callback);
        }, callback);
      }
      if (category.title === 'Грузоподьемная техника') {
//        saveCategory(category, categoriesFreight, callback)(callback);
        async.each(categoriesFreight, function (buildingData, callback) {
          buildingData.category = category._id;
          var newCategoryFreight = new mongoose.models.Category(buildingData);
          newCategoryFreight.save(callback);
        }, callback);
      }
      if (category.title === 'Грузовой транспорт') {
//        saveCategory(category, categoriesTransport, callback)(callback);
        async.each(categoriesTransport, function (buildingData, callback) {
          buildingData.category = category._id;
          var newCategoryTransport = new mongoose.models.Category(buildingData);
          newCategoryTransport.save(callback);
        }, callback);
      }
    });
  }, callback);
}

function createMachinery(callback) {

  async.parallel({
    category: function (callback) {
      mongoose.models.Category.findOne({}, function (err, item) {
        if (err) {
          throw err;
        }
        callback(null, item);
      });
    },
    group: function (callback) {
      mongoose.models.Group.findOne({ name: 'Покупатели' }, function (err, group) {
        if (err) {
          throw err;
        }
        callback(null, group);
      });
    }
  }, function (err, results) {
    if (err) {
      throw err;
    }
    var contractors = [
      {
        name: 'ИП Кашин Артем Андреевич',
        nameShort: 'Росконкурс',
        address: 'г. Ярославль, ул. Большая Октябрьская, д. 45',
        phone: '9108228988',
        email: 'artem.kashin@gmail.com',
        accounts: [
          results.group
        ],
        group: results.group,
        status: true,
        requisites: {
          fioForSignature: 'Кашин А.А.',
          representativePost: 'генеральный директор',
          representativeName: 'Кашин Артем Андреевич',
          representativeNameGenitive: 'Кашина Артема Андреевича',
          inn: '760403909702',
          ogrn: '311760426900033',
          comment: 'Это компания Артема, которые разрабатывают приложение «ГТС-БИЗНЕС».'
        }
      }
    ];

    async.each(contractors, function (contractorData, callback) {
      var contractor = new mongoose.models.Contractor(contractorData);
      contractor.save(callback);
    }, callback);
  });
}

module.exports = populateDB();