const request = require('supertest');
const faker = require('faker');

const server = require('../servers/http');
const version = '/v1';
const token = process.env.TEST_AUTH_TOKEN;

describe('REST : Developer Token', () => {
  let result = null;
  let testData = {
    name: faker.name.findName(),
    developerId: faker.datatype.uuid(),
    scopeIds: [faker.datatype.uuid(), faker.datatype.uuid()],
  };

  const compareFields = (data, expectation) => {
    expect(data.name).toBe(expectation.name);
    expect(data.developerId).toBe(expectation.developerId);
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
        compareFields(response.body, testData);
        expect(response.body.token).toBeTruthy();
        expect(response.body.scopeIds.length).toBe(testData.scopeIds.length);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('GET /developer-tokens', (done) => {
    request(server)
      .get(version + '/developer-tokens')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.rows)).toBeTruthy();
        expect(response.body.rows.length).toBeGreaterThanOrEqual(1);

        const body = response.body.rows.find((t) => t.id === result.id);
        compareFields(body, testData);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('GET /developer-tokens/:id', (done) => {
    request(server)
      .get(version + '/developer-tokens/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        compareFields(response.body, testData);
        expect(response.body.id).toBe(result.id);
        expect(response.body.token).toBeFalsy();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('DELETE /developer-tokens', (done) => {
    request(server)
      .delete(version + '/developer-tokens/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(result.id);
        compareFields(response.body, testData);
        expect(response.body.token).toBeFalsy();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('DELETE /developer-tokens not found', () => {
    return request(server)
      .delete(version + '/developer-tokens/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  test('GET /developer-tokens/:id', () => {
    return request(server)
      .get(version + '/developer-tokens/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });
});
