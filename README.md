# sequelize-extension-deletedBy

[![Build Status](https://travis-ci.org/gcmarques/sequelize-extension-deletedBy.svg?branch=master)](https://travis-ci.org/gcmarques/sequelize-extension-deletedBy)
[![codecov](https://codecov.io/gh/gcmarques/sequelize-extension-deletedBy/branch/master/graph/badge.svg)](https://codecov.io/gh/gcmarques/sequelize-extension-deletedBy)
![GitHub license](https://img.shields.io/github/license/gcmarques/sequelize-extension-deletedBy.svg)

### Installation
```bash
$ npm install --save sequelize-extension
```

### Usage

This library uses [sequelize-extension](https://www.npmjs.com/package/sequelize-extension) to extend sequelize models. If a model has a `deletedBy` field, this extension will automatically add `options.user.id` to `deletedBy`.
```javascript
await task.destroy({ user: { id: 2 } });
console.log(task1.deletedBy);
// 2

await task.destroy();
console.log(task1.deletedBy);
// 1 <- default userId

await db.Task.destroy({
  where: {...},
  user: { id: 3 },
});
// All destroyed instances will have deletedBy === 3
```

### Other Extensions
[sequelize-extension-tracking](https://www.npmjs.com/package/sequelize-extension-tracking) - Automatically track sequelize instance updates.\
[sequelize-extension-updatedBy](https://www.npmjs.com/package/sequelize-extension-updatedBy) - Automatically set updatedBy with `options.user.id` option.\
[sequelize-extension-createdBy](https://www.npmjs.com/package/sequelize-extension-createdBy) - Automatically set createdBy with `options.user.id` option.\
[sequelize-extension-graphql](https://www.npmjs.com/package/sequelize-extension-graphql) - Create GraphQL schema based on sequelize models.