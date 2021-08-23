const uuid = require('uuid');
const db = require('../models');
const liveDataActions = require('./live-data-actions.json');
const streamingActions = require('./streaming-actions.json');

exports.seed = async () => {
  console.log('start seeding process');
  let bulkActions = [];
  let bulkScope = [];
  let bulkScopeActions = [];
  const superAdminScope = {
    id: uuid.v4(),
    name: 'live data super admin',
    description: 'access to all resources in live data server',
    group: '',
  };

  bulkScope.push(superAdminScope);

  console.log('populating live server bulk data');
  for (const scopeName in liveDataActions) {
    if (Object.hasOwnProperty.call(liveDataActions, scopeName)) {
      const scopeActions = liveDataActions[scopeName];
      const scopeCleanName = scopeName.replace(/_/g, ' ');
      console.log(scopeCleanName);
      const scopeDef = {
        manage: {
          id: uuid.v4(),
          name: 'manage live server ' + scopeCleanName,
          description: 'access to manage ' + scopeCleanName,
          group: scopeCleanName,
        },
        read: {
          id: uuid.v4(),
          name: 'read live server ' + scopeCleanName,
          description: 'access to read ' + scopeCleanName,
          group: scopeCleanName,
        },
      };

      bulkScope.push(scopeDef.manage);
      bulkScope.push(scopeDef.read);

      scopeActions.forEach((action) => {
        let actionModel = {
          id: uuid.v4(),
          name: action,
          service: 'live-data-server',
        };

        bulkActions.push(actionModel);
        bulkScopeActions.push({
          id: uuid.v4(),
          scopeId: scopeDef.manage.id,
          actionId: actionModel.id,
        });
        bulkScopeActions.push({
          id: uuid.v4(),
          scopeId: superAdminScope.id,
          actionId: actionModel.id,
        });

        if (action.startsWith('read'))
          bulkScopeActions.push({
            id: uuid.v4(),
            scopeId: scopeDef.read.id,
            actionId: actionModel.id,
          });
      });
    }
  }

  const superAdminStreamingScope = {
    id: uuid.v4(),
    name: 'streaming super admin',
    description: 'access to all resources in streaming server',
    group: '',
  };

  bulkScope.push(superAdminStreamingScope);

  console.log('populating streaming bulk data');
  for (const scopeName in streamingActions) {
    if (Object.hasOwnProperty.call(streamingActions, scopeName)) {
      const scopeActions = streamingActions[scopeName];
      const scopeCleanName = scopeName.replace(/_/g, ' ');
      console.log(scopeCleanName);
      const scopeDef = {
        read: {
          id: uuid.v4(),
          name: 'read streaming server ' + scopeCleanName,
          description: 'access to read ' + scopeCleanName,
          group: scopeCleanName,
        },
      };

      bulkScope.push(scopeDef.manage);
      bulkScope.push(scopeDef.read);

      scopeActions.forEach((action) => {
        let actionModel = {
          id: uuid.v4(),
          name: action,
          service: 'streaming-server',
        };

        bulkActions.push(actionModel);

        bulkScopeActions.push({
          id: uuid.v4(),
          scopeId: superAdminScope.id,
          actionId: actionModel.id,
        });

        if (action.startsWith('read'))
          bulkScopeActions.push({
            id: uuid.v4(),
            scopeId: scopeDef.read.id,
            actionId: actionModel.id,
          });
      });
    }
  }

  console.log('writing to DB');
  await Promise.all([
    db.Action.bulkCreate(bulkActions),
    db.Scope.bulkCreate(bulkScope),
    db.ScopeAction.bulkCreate(bulkScopeActions),
  ]);

  console.log('finish seeding');
};
