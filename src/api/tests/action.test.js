const request = require('supertest');
const faker = require('faker');

const server = require('../servers/http');
const version = '/v1';
const token = process.env.TEST_AUTH_TOKEN;

describe('REST : Actions', () => {
  let result = null;
  let testData = {
    name: faker.name.findName(),
    service: faker.name.title(),
  };

  const compareFields = (data, expectation) => {
    expect(data.name).toBe(expectation.name);
    expect(data.service).toBe(expectation.service);
  };

  test('POST /actions', (done) => {
    request(server)
      .post(version + '/actions')
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

  test('GET /actions', (done) => {
    request(server)
      .get(version + '/actions')
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

  test('PUT /actions', (done) => {
    testData = {
      name: faker.name.findName(),
      service: faker.name.title(),
    };

    request(server)
      .put(version + '/actions/' + result.id)
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

  test('PUT /actions with wrong id', () => {
    const errortestData = {};

    return request(server)
      .put(version + '/actions/' + faker.datatype.uuid())
      .set('Authorization', 'Bearer ' + token)
      .send(errortestData)
      .expect(404);
  });

  test('GET /actions/:id', (done) => {
    request(server)
      .get(version + '/actions/' + result.id)
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

  test('DELETE /actions', (done) => {
    request(server)
      .delete(version + '/actions/' + result.id)
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

  test('DELETE /actions not found', () => {
    return request(server)
      .delete(version + '/actions/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  test('GET /actions/:id', () => {
    return request(server)
      .get(version + '/actions/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });
});
