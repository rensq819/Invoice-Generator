import Joi from 'joi';
import HttpStatus from 'http-status-codes';
import Invoice from './invoice.model';

export default {
  findAll(req, res, next) {
    // default page = 1, perPage = 10, if user does no specify the numbers
    const { page = 1, perPage = 10, filter, sortField, sortDir } = req.query;
    const options = {
      // if want to select only two columns
      // select: "_id item",
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10)
    };
    const query = {};
    if (filter) {
      query.item = {
        $regex: filter
      };
    }
    if (sortField && sortDir) {
      options.sort = {
        [sortField]: sortDir
      };
    }
    Invoice.paginate(query, options)
      .then(invoices => res.json(invoices))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  findOne(req, res) {
    let { id } = req.params;
    Invoice.findById(id).then(invoice => {
      if (!invoice) {
        return res.status(HttpStatus.NOT_FOUND).json({ err: 'Inovice could not be found' });
      }
      return res.json(invoice);
    });
  },
  create(req, res) {
    const schema = Joi.object().keys({
      item: Joi.string().required(),
      date: Joi.date().required(),
      due: Joi.date().required(),
      qty: Joi.number()
        .integer()
        .required(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional()
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    Invoice.create(value)
      .then(invoice => res.json(invoice))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  update(req, res) {
    let { id } = req.params;
    const schema = Joi.object().keys({
      item: Joi.string().optional(),
      date: Joi.date().optional(),
      due: Joi.date().optional(),
      qty: Joi.number()
        .integer()
        .optional(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional()
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    Invoice.findByIdAndUpdate({ _id: id }, value, { new: true })
      .then(invoice => res.json(invoice))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  delete(req, res) {
    let { id } = req.params;
    Invoice.findByIdAndRemove(id)
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpStatus.NOT_FOUND).json({ err: 'Inovice could not be deleted' });
        }
        return res.json(invoice);
      })
      .catch(erro => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error));
  }
};
