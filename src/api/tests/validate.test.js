const request = require('supertest');
const faker = require('faker');

const server = require('../servers/http');
const version = '/v1';
const token = process.env.TEST_AUTH_TOKEN;

describe('REST : Validate Developer Token', () => {
  let result = null;
  let id = null;
  let devtoken = null;
  let developer = null;
  let testData = {};

  let actions = [];
  let scope = null;

  test('Prepare Test Data', async () => {
    developer = await request(server)
      .post(version + '/developers')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
      })
      .expect(200)
      .then((response) => {
        return Promise.resolve(response.body);
      });

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

    await request(server)
      .put(version + '/scopes/' + scope.id + '/actions')
      .set('Authorization', 'Bearer ' + token)
      .send(actions.map((t) => t.id))
      .expect(200);
  });

  test('POST /developer-tokens', (done) => {
    testData = {
      name: faker.name.findName(),
      developerId: developer.id,
      scopeIds: [scope.id],
    };

    request(server)
      .post(version + '/developer-tokens')
      .set('Authorization', 'Bearer ' + token)
      .send(testData)
      .expect(200)
      .then((response) => {
        result = response.body;
        expect(response.body.id).toBeTruthy();
        expect(response.body.token).toBeTruthy();
        devtoken = response.body.token;
        id = response.body.id;
        expect(response.body.scopeIds.length).toBe(testData.scopeIds.length);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('POST /validate', (done) => {
    request(server)
      .post(version + '/validate')
      .send({ token: devtoken })
      .expect(200)
      .then((response) => {
        result = response.body;
        expect(response.body.name).toBeTruthy();
        expect(response.body.developerId).toBe(developer.id);
        expect(Array.isArray(response.body.scopes)).toBeTruthy();
        expect(response.body.scopes.length).toBe(1);
        expect(response.body.scopes[0].id).toBe(scope.id);
        expect(response.body.scopes[0].name).toBe(scope.name);
        expect(response.body.scopes[0].group).toBe(scope.group);

        expect(Array.isArray(response.body.actions)).toBeTruthy();
        expect(response.body.actions.length).toBe(2);

        response.body.actions.forEach((action) => {
          const testAction = actions.find((t) => t.name === action.name);

          expect(action.id).toBe(testAction.id);
          expect(action.name).toBe(testAction.name);
          expect(action.service).toBe(testAction.service);
        });

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('POST /validate wrong token', () => {
    return request(server)
      .post(version + '/validate')
      .set('Authorization', 'Bearer ' + token)
      .send({ token: faker.datatype.string() })
      .expect(400);
  });

  test('POST /validate wrong body', () => {
    return request(server)
      .post(version + '/validate')
      .send({})
      .expect(400);
  });

  test('DELETE /developer-tokens', () => {
    return request(server)
      .delete(version + '/developer-tokens/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  test('POST /validate inactive token', () => {
    return request(server)
      .post(version + '/validate')
      .send({ token: devtoken })
      .expect(404);
  });

  test('Clear Data', async () => {
    await Promise.all([
      request(server)
        .delete(version + '/developers/' + developer.id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200),
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
