const request = require('supertest');
const faker = require('faker');

const server = require('../servers/http');
const version = '/v1';
const token = process.env.TEST_AUTH_TOKEN;

describe('REST : Validate Developer Token', () => {
  let result = null;
  let id = null;
  let devtoken = null;
  let testData = {
    name: faker.name.findName(),
    developerId: faker.datatype.uuid(),
    scopeIds: [faker.datatype.uuid(), faker.datatype.uuid()],
  };

  test('POST /developer-tokens', (done) => {
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
        expect(response.body.developerId).toBe(testData.developerId);
        expect(Array.isArray(response.body.scopes)).toBeTruthy();
        expect(Array.isArray(response.body.actions)).toBeTruthy();
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
});
