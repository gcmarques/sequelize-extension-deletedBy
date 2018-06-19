const extendSequelize = require('sequelize-extension');
const connection = require('../helpers/connection');
const dropAll = require('../helpers/dropAll');
const enhanceDeletedBy = require('../..');

describe('enhancers', () => {
  let sequelize;
  let db;

  const reset = async () => {
    await dropAll(sequelize);
    db = {};
    db.user = sequelize.define('user', {
      username: sequelize.Sequelize.STRING(255),
      deletedBy: sequelize.Sequelize.INTEGER,
    }, {
      paranoid: true,
    });
    await sequelize.sync();
  };

  before(async () => {
    sequelize = connection();
    await reset();
    extendSequelize(db, {
      deletedBy: enhanceDeletedBy(),
    });
  });

  after(async () => {
    sequelize.close();
  });

  describe('-> deletedBy:', () => {
    it('should add deletedBy when destroying instances', async () => {
      const user = await db.user.create({
        username: 'test1',
      });
      await user.destroy({
        user: { id: 2 },
      });
      expect(user.deletedBy).to.be.equal(2);
    });

    it('should add default deletedBy when destroying instances without user', async () => {
      const user = await db.user.create({
        username: 'test2',
      });
      await user.destroy();
      expect(user.deletedBy).to.be.equal(1);
    });

    it('should add deletedBy when bulk destroying instances', async () => {
      await db.user.bulkCreate([
        { username: 'test3' },
        { username: 'test3' },
      ]);
      await db.user.destroy({
        where: { username: 'test3' },
        user: { id: 2 },
      });
      const users = await db.user.findAll({
        where: { username: 'test3' },
        paranoid: false,
      });
      users.forEach((user) => {
        expect(user.deletedBy).to.be.equal(2);
      });
    });

    it('should add default deletedBy when bulk destroying instances without user', async () => {
      await db.user.bulkCreate([
        { username: 'test4' },
        { username: 'test4' },
      ]);
      await db.user.destroy({
        where: { username: 'test4' },
      });
      const users = await db.user.findAll({
        where: { username: 'test4' },
        paranoid: false,
      });
      users.forEach((user) => {
        expect(user.deletedBy).to.be.equal(1);
      });
    });
  });
});
