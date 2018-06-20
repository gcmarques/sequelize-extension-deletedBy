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
          if (!options.transaction) {
            const transaction = await sequelize.transaction();
            options.transaction = transaction;
            await utils.getBulkedInstances(model, options);
            utils.setTriggerParams(options, 'deletedBy', { transaction });
          }
        });

        hooks[name].afterBulkDestroy.push(async (options) => {
          const instances = await utils.getBulkedInstances(model, options);
          const id = _.map(instances, instance => instance.id);
          const { transaction } = utils.getTriggerParams(options, 'deletedBy');
          try {
            await model.update({
              deletedBy: options.user.id,
            }, {
              hooks: false,
              where: { id },
              transaction: options.transaction,
              paranoid: false,
            });
            if (transaction) {
              await transaction.commit();
            }
          } catch (err) {
            if (transaction) {
              await transaction.rollback();
            }
            throw err;
          }
        });
      }
    });
  };
}
module.exports = enhanceDeletedBy;
