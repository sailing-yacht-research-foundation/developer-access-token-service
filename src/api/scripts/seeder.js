const uuid = require('uuid');
const db = require('../models');
const liveDataActions = require('./live-data-actions.json');
const streamingActions = require('./streaming-actions.json');

exports.seed = async () => {
  console.log('start seeding process');
  let bulkActions = [];
  let bulkScope = [];
  let bulkScopeActions = [];
  let superAdminScope = {
    id: uuid.v4(),
    name: 'live data super admin',
    description: 'access to all resources in live data server',
    group: '',
  };

  const allActions = await db.Action.findAll();
  const allScopes = await db.Scope.findAll();
  const allScopeActions = await db.ScopeAction.findAll();

  let anyIndex = allScopes.findIndex((t) => t.name === superAdminScope.name);

  if (anyIndex < 0) {
    bulkScope.push(superAdminScope);
  } else {
    superAdminScope = allScopes[anyIndex];
  }

  console.log('populating live server bulk data');
  for (const scopeName in liveDataActions) {
    if (Object.hasOwnProperty.call(liveDataActions, scopeName)) {
      const scopeActions = liveDataActions[scopeName];
      const scopeCleanName = scopeName.replace(/_/g, ' ');

      console.log(scopeCleanName);
      let scopeDef = {
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

      anyIndex = allScopes.findIndex((t) => t.name === scopeDef.manage.name);
      if (anyIndex < 0) bulkScope.push(scopeDef.manage);
      else scopeDef.manage = allScopes[anyIndex];

      anyIndex = allScopes.findIndex((t) => t.name === scopeDef.read.name);
      if (anyIndex < 0) bulkScope.push(scopeDef.read);
      else scopeDef.read = allScopes[anyIndex];

      scopeActions.forEach((action) => {
        let actionModel = {
          id: uuid.v4(),
          name: action,
          service: 'live-data-server',
        };

        anyIndex = allActions.findIndex(
          (t) =>
            t.name === actionModel.name && t.service === actionModel.service,
        );
        if (anyIndex < 0) {
          console.log(
            'adding action : ',
            actionModel.name,
            scopeDef.manage.name,
          );
          bulkActions.push(actionModel);
        } else {
          actionModel = allActions[anyIndex];
        }

        if (
          allScopeActions.findIndex(
            (t) =>
              t.scopeId === scopeDef.manage.id && t.actionId === actionModel.id,
          ) < 0
        )
          bulkScopeActions.push({
            id: uuid.v4(),
            scopeId: scopeDef.manage.id,
            actionId: actionModel.id,
          });

        if (
          allScopeActions.findIndex(
            (t) =>
              t.scopeId === superAdminScope.id && t.actionId === actionModel.id,
          ) < 0
        )
          bulkScopeActions.push({
            id: uuid.v4(),
            scopeId: superAdminScope.id,
            actionId: actionModel.id,
          });

        if (
          action.startsWith('read') &&
          allScopeActions.findIndex(
            (t) =>
              t.scopeId === scopeDef.read.id && t.actionId === actionModel.id,
          ) < 0
        )
          bulkScopeActions.push({
            id: uuid.v4(),
            scopeId: scopeDef.read.id,
            actionId: actionModel.id,
          });
      });
    }
  }

  let superAdminStreamingScope = {
    id: uuid.v4(),
    name: 'streaming super admin',
    description: 'access to all resources in streaming server',
    group: '',
  };

  anyIndex = allScopes.findIndex(
    (t) => t.name === superAdminStreamingScope.name,
  );
  if (anyIndex < 0) {
    bulkScope.push(superAdminStreamingScope);
  } else {
    superAdminStreamingScope = allScopes[anyIndex];
  }

  console.log('populating streaming bulk data');
  for (const scopeName in streamingActions) {
    if (Object.hasOwnProperty.call(streamingActions, scopeName)) {
      const scopeActions = streamingActions[scopeName];
      const scopeCleanName = scopeName.replace(/_/g, ' ');
      console.log(scopeCleanName);
      let scopeDef = {
        read: {
          id: uuid.v4(),
          name: 'read streaming server ' + scopeCleanName,
          description: 'access to read ' + scopeCleanName,
          group: scopeCleanName,
        },
      };

      anyIndex = allScopes.findIndex((t) => t.name === scopeDef.read.name);
      if (anyIndex < 0) bulkScope.push(scopeDef.read);
      else scopeDef.read = allScopes[anyIndex];

      scopeActions.forEach((action) => {
        let actionModel = {
          id: uuid.v4(),
          name: action,
          service: 'streaming-server',
        };

        anyIndex = allActions.findIndex(
          (t) =>
            t.name === actionModel.name && t.service === actionModel.service,
        );
        if (anyIndex < 0) {
          bulkActions.push(actionModel);
        } else {
          actionModel = allActions[anyIndex];
        }

        if (
          allScopeActions.findIndex(
            (t) =>
              t.scopeId === superAdminStreamingScope.id &&
              t.actionId === actionModel.id,
          ) < 0
        )
          bulkScopeActions.push({
            id: uuid.v4(),
            scopeId: superAdminStreamingScope.id,
            actionId: actionModel.id,
          });

        if (
          action.startsWith('read') &&
          allScopeActions.findIndex(
            (t) =>
              t.scopeId === scopeDef.read.id && t.actionId === actionModel.id,
          ) < 0
        )
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
