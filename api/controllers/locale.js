const cookie require('react-cookie');


exports.setLang = function (req, res, next) {
  //console.log(req.params);	
  const lang = req.params.lang;
  cookie.save('i18n', lang , { path: '/' });
};

