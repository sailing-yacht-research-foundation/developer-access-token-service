const request = require('supertest');
const faker = require('faker');

const server = require('../servers/http');
const version = '/v1';
const token = process.env.TEST_AUTH_TOKEN;

describe('REST : Developer', () => {
  let result = null;
  let testData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
  };

  const compareFields = (data, expectation) => {
    expect(data.name).toBe(expectation.name);
    expect(data.email).toBe(expectation.email);
  };

  test('POST /developers', (done) => {
    request(server)
      .post(version + '/developers')
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

  test('GET /developers', (done) => {
    request(server)
      .get(version + '/developers')
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

  test('PUT /developers', (done) => {
    testData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    request(server)
      .put(version + '/developers/' + result.id)
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

  test('PUT /developers with wrong id', () => {
    return request(server)
      .put(version + '/developers/' + faker.datatype.uuid())
      .set('Authorization', 'Bearer ' + token)
      .send(testData)
      .expect(404);
  });

  test('PUT /developers with validation error', () => {
    const errortestData = {};

    return request(server)
      .put(version + '/developers/' + faker.datatype.uuid())
      .set('Authorization', 'Bearer ' + token)
      .send(errortestData)
      .expect(400);
  });

  test('GET /developers/:id', (done) => {
    request(server)
      .get(version + '/developers/' + result.id)
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

  test('DELETE /developers', (done) => {
    request(server)
      .delete(version + '/developers/' + result.id)
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

  test('DELETE /developers not found', () => {
    return request(server)
      .delete(version + '/developers/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  test('GET /developers/:id', () => {
    return request(server)
      .get(version + '/developers/' + result.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });
});
