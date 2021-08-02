const uuid = require('uuid');
const db = require('../models');
const liveDataActions = require('./live-data-actions.json');

(async () => {
  console.log('start seeding process');
  let bulkActions = [];
  let bulkScope = [];
  let bulkScopeActions = [];
  const superAdminScope = {
    id: uuid.v4(),
    name: 'super admin',
    description: 'access to all resources',
    group: '',
  };

  bulkScope.push(superAdminScope);

  console.log('populating bulk data');
  for (const scopeName in liveDataActions) {
    if (Object.hasOwnProperty.call(liveDataActions, scopeName)) {
      const scopeActions = liveDataActions[scopeName];
      const scopeCleanName = scopeName.replace(/_/g, ' ');
      console.log(scopeCleanName);
      const scopeDef = {
        manage: {
          id: uuid.v4(),
          name: 'manage ' + scopeCleanName,
          description: 'access to manage ' + scopeCleanName,
          group: scopeCleanName,
        },
        read: {
          id: uuid.v4(),
          name: 'read ' + scopeCleanName,
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

  console.log('writing to DB');
  await Promise.all([
    db.Action.bulkCreate(bulkActions),
    db.Scope.bulkCreate(bulkScope),
    db.ScopeAction.bulkCreate(bulkScopeActions),
  ]);

  console.log('finish seeding');
})();
