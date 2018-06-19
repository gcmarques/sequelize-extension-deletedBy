# sequelize-extension-deletedBy

[![Build Status](https://travis-ci.org/gcmarques/sequelize-extension-deletedBy.svg?branch=master)](https://travis-ci.org/gcmarques/sequelize-extension-deletedBy)
[![codecov](https://codecov.io/gh/gcmarques/sequelize-extension-deletedBy/branch/master/graph/badge.svg)](https://codecov.io/gh/gcmarques/sequelize-extension-deletedBy)
![GitHub license](https://img.shields.io/github/license/gcmarques/sequelize-extension-deletedBy.svg)

### Installation
```bash
$ npm install --save sequelize-extension-deletedBy
```

### Usage

This library uses [sequelize-extension](https://www.npmjs.com/package/sequelize-extension) to extend sequelize models. If a model has a `deletedBy` field, this extension will automatically set `deletedBy` to `options.user.id` when an instance is destroyed.
```javascript
const Sequelize = require('sequelize');
const extendSequelize = require('sequelize-extension');
const enhanceDeletedBy = require('sequelize-extension-deletedBy');

const sequelize = new Sequelize(...);

const Task = sequelize.define('task', {
  name: Sequelize.STRING(255),
});

extendSequelize([Task], {
  deletedBy: enhanceDeletedBy(),
});

// ...

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
[sequelize-extension-updatedby](https://www.npmjs.com/package/sequelize-extension-updatedby) - Automatically set `updatedBy` with `options.user.id` option.\
[sequelize-extension-createdby](https://www.npmjs.com/package/sequelize-extension-createdby) - Automatically set `createdBy` with `options.user.id` option.\
[sequelize-extension-graphql](https://www.npmjs.com/package/sequelize-extension-graphql) - Create GraphQL schema based on sequelize models. 