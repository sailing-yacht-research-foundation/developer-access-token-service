const request = require('supertest');
const faker = require('faker');

const server = require('../servers/http');
const { response } = require('express');
const version = '/v1';
const token = process.env.TEST_AUTH_TOKEN;

describe('REST : Scopes', () => {
  let actions = [];
  let scope = null;

  test('Prepare Actions', async () => {
    actions = await Promise.all([
      request(server)
        .post(version + '/actions')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: faker.name.findName(),
          service: faker.name.title(),
        })
        .expect(200)
        .then((response) => {
          return Promise.resolve(response.body);
        }),
      request(server)
        .post(version + '/actions')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: faker.name.findName(),
          service: faker.name.title(),
        })
        .expect(200)
        .then((response) => {
          return Promise.resolve(response.body);
        }),
    ]);
  });

  test('POST /scopes', async () => {
    scope = await request(server)
      .post(version + '/scopes')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: faker.name.findName(),
        description: faker.name.findName(),
      })
      .expect(200)
      .then((response) => {
        return Promise.resolve(response.body);
      });
    expect(scope.id).toBeTruthy();
  });

  test('PUT /scopes/:id/actions', async () => {
    const result = await request(server)
      .put(version + '/scopes/' + scope.id + '/actions')
      .set('Authorization', 'Bearer ' + token)
      .send([actions[0].id])
      .expect(200)
      .then((response) => Promise.resolve(response.body));
    expect(result.length).toBe(1);
    expect(result[0].actionId).toBe(actions[0].id);
    expect(result[0].scopeId).toBe(scope.id);
  });

  test('GET /scopes/:id/actions', async () => {
    const result = await request(server)
      .get(version + '/scopes/' + scope.id + '/actions')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => Promise.resolve(response.body));
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(actions[0].id);
    expect(result[0].name).toBe(actions[0].name);
    expect(result[0].service).toBe(actions[0].service);
  });

  test('GET /scopes/:id/unassigned-actions', async () => {
    const result = await request(server)
      .get(version + '/scopes/' + scope.id + '/unassigned-actions')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => Promise.resolve(response.body));
    expect(result.rows.length).toBeGreaterThanOrEqual(1);
    expect(result.rows[0].id).toBe(actions[1].id);
    expect(result.rows[0].name).toBe(actions[1].name);
    expect(result.rows[0].service).toBe(actions[1].service);
  });

  test('DELETE data', async () => {
    await Promise.all([
      request(server)
        .delete(version + '/actions/' + actions[0].id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200),
      request(server)
        .delete(version + '/actions/' + actions[1].id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200),
      request(server)
        .delete(version + '/scopes/' + scope.id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200),
    ]);
  });
});
