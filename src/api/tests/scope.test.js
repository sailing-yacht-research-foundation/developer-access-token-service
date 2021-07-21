const request = require('supertest');
const faker = require('faker');

const server = require('../servers/http');
const version = '/v1';
const token = process.env.TEST_AUTH_TOKEN;

describe('REST : Scopes', () => {
  let result = null;
  let testData = {
    name: faker.name.findName(),
    description: faker.name.findName(),
  };

  const compareFields = (data, expectation) => {
    expect(data.name).toBe(expectation.name);
    expect(data.description).toBe(expectation.description);
  };

  test('POST /scopes', (done) => {
    request(server)
      .post(version + '/scopes')
      .set('Authorization', 'Bearer ' + token)
      .send(testData)
      .expect(200)
      .then((response) => {
        result = response.body;
        expect(response.body.id).toBeTruthy();
        compareFields(response.body, testData);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('GET /scopes', (done) => {
    request(server)
      .get(version + '/scopes')
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

  test('PUT /scopes', (done) => {
    testData = {
      name: faker.name.findName(),
      description: faker.name.findName(),
    };

    request(server)
      .put(version + '/scopes/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .send(testData)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(result.id);

        compareFields(response.body, testData);

        result = response.body;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('PUT /scopes with wrong id', () => {
    return request(server)
      .put(version + '/scopes/' + faker.datatype.uuid())
      .set('Authorization', 'Bearer ' + token)
      .send(testData)
      .expect(404);
  });

  test('PUT /scopes with validation error', () => {
    const errortestData = {};

    return request(server)
      .put(version + '/scopes/' + faker.datatype.uuid())
      .set('Authorization', 'Bearer ' + token)
      .send(errortestData)
      .expect(400);
  });

  test('GET /scopes/:id', (done) => {
    request(server)
      .get(version + '/scopes/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        compareFields(response.body, testData);
        expect(response.body.id).toBe(result.id);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('DELETE /scopes', (done) => {
    request(server)
      .delete(version + '/scopes/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(result.id);
        compareFields(response.body, testData);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('DELETE /scopes not found', () => {
    return request(server)
      .delete(version + '/scopes/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  test('GET /scopes/:id', () => {
    return request(server)
      .get(version + '/scopes/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });
});
