import userService from './user.service';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import User from './user.model';
import { devConfig } from '../../../config/env/development';

export default {
  async signup(req, res) {
    try {
      // validate the request
      const { error, value } = userService.validateSchema(req.body);
      if (error && error.details) {
        return res.status(BAD_REQUEST).json(error);
      }
      // encrypt user password

      // create new user
      const user = await User.create(value);
      return res.json({ success: true, message: 'User created successfully' });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  },
  async login(req, res) {
    try {
      // validate the request
      const { error, value } = userService.validateSchema(req.body);
      if (error && error.details) {
        return res.status(BAD_REQUEST).json(error);
      }

      // compare user password
      const user = await User.findOne({ email: value.email });
      if (!user) {
        return res.status(BAD_REQUEST).json({ err: 'cannot find user' });
      }
      // store boolean compare result
      const matched = await bcryptjs.compare(value.password, user.password);
      console.log(matched);
      if (!matched) {
        return res.status(UNAUTHORIZED).json({ err: 'invalid credentails' });
      }

      const token = jwt.sign({ id: user._id }, devConfig.secret, { expiresIn: '1d' });
      return res.json({ success: true, token });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  },
  async test(req, res) {
    try {
      return res.json(req.user);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  }
};
