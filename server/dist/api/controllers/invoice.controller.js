'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invoice = require('../models/invoice.model');

var _invoice2 = _interopRequireDefault(_invoice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  findAll: function findAll(req, res, next) {
    _invoice2.default.find().then(function (invoices) {
      return res.json(invoices);
    });
  },
  create: function create(req, res) {
    var _req$body = req.body,
        item = _req$body.item,
        qty = _req$body.qty,
        date = _req$body.date,
        due = _req$body.due,
        tax = _req$body.tax,
        rate = _req$body.rate;

    if (!item) {
      return res.status(400).json({ err: 'item is required field' });
    }
    if (!qty) {
      return res.status(400).json({ err: 'qty is required field' });
    }
    if (!date) {
      return res.status(400).json({ err: 'date is required field' });
    }
    if (!due) {
      return res.status(400).json({ err: 'due is required field' });
    }
    _invoice2.default.create({ item: item, qty: qty, date: date, due: due, tax: tax, rate: rate }).then(function (invoice) {
      res.json(invoice);
    }).catch(function (err) {
      return res.status(500).json(err);
    });
  }
};
//# sourceMappingURL=invoice.controller.js.map