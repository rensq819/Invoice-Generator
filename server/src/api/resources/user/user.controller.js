import userService from './user.service';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import User from './user.model';

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
      return res.json(user);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  }
};
