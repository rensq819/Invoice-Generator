import { create } from 'domain';

export default {
  async create(req, res) {
    return res.json({ msg: 'Create Client' });
  }
};
