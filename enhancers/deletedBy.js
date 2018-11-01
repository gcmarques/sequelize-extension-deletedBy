const _ = require('lodash');

function enhanceDeletedBy() {
  return function enhance(db, hooks, settings) {
    const { utils } = settings;
    _.each(db, (model) => {
      if (utils.isModel(model) && _.has(utils.getRawAttributes(model), 'deletedBy')) {
        const name = utils.getName(model);
        const sequelize = utils.getSequelize(model);

        hooks[name].beforeDestroy.push((instance, options) => {
          instance.deletedBy = options.user.id;
        });

        hooks[name].beforeBulkDestroy.push(async (options) => {
          await utils.getBulkedInstances(model, options);
        });

        hooks[name].afterBulkDestroy.push(async (options) => {
          const instances = await utils.getBulkedInstances(model, options);
          const where = {};
          _.each(model.rawAttributes, (attribute, key) => {
            if (attribute.primaryKey) {
              where[key] = [];
            }
          });
          const primaryKeys = _.keys(where);
          _.each(instances, (instance) => {
            _.each(primaryKeys, key => where[key].push(instance[key]));
          });
          await model.update({
            deletedBy: options.user.id,
          }, {
            where,
            hooks: false,
            transaction: options.transaction,
            paranoid: false,
          });
        });
      }
    });
  };
}
module.exports = enhanceDeletedBy;
