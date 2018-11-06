'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _routes = require('./config/routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect('mongodb://localhost/invoice-builder');

var app = (0, _express2.default)();
var PORT = 3000;

app.use('/api', _routes.router);

app.get('/', function (req, res) {
  res.json({
    msg: 'Welcome to Invoice Backend'
  });
});

var invoices = [{
  _id: '1234',
  item: 'Amazon Product',
  qty: '12',
  date: new Date()
}, {
  _id: '2345',
  item: 'Google Product',
  qty: '12',
  date: new Date()
}, {
  _id: '3456',
  item: 'Linked Product',
  qty: '12',
  date: new Date()
}];

app.get('/invoices', function (req, res) {
  res.json(invoices);
});

app.listen(PORT, function () {
  console.log('Server is running at port: ' + PORT);
});
//# sourceMappingURL=app.js.map