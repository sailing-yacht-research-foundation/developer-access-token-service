const request = require('supertest');
const faker = require('faker');

const server = require('../servers/http');
const version = '/v1';
const accessToken = process.env.TEST_ACCESS_TOKEN;
const token = process.env.TEST_AUTH_TOKEN;

const jwt = require('jsonwebtoken');

describe('REST : Auth', () => {
  let result = null;
  test('POST /auth/login', (done) => {
    request(server)
      .post(version + '/auth/login')
      .send({
        access_token: accessToken,
      })
      .expect(200)
      .then((response) => {
        result = response.body;
        expect(response.body.id).toBeTruthy();
        expect(response.body.token).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.name).toBeTruthy();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('POST /auth/validate-token wrong token', () => {
    return request(server)
      .post(version + '/auth/login')
      .send({
        token: faker.datatype.string(),
      })
      .expect(401);
  });

  test('POST /auth/validate-token', (done) => {
    request(server)
      .post(version + '/auth/validate-token')
      .send({
        token: result.token,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.name).toBeTruthy();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('POST /auth/validate-token wrong token', () => {
    return request(server)
      .post(version + '/auth/validate-token')
      .send({
        token: accessToken,
      })
      .expect(401);
  });

  test('GET /actions no token', () => {
    return request(server)
      .get(version + '/actions')
      .expect(401);
  });

  test('GET /actions no bearer token', () => {
    return request(server)
      .get(version + '/actions')
      .set('Authorization', token)
      .expect(401);
  });

  test('GET /actions not a token', () => {
    return request(server)
      .get(version + '/actions')
      .set('Authorization', 'Bearer ' + faker.datatype.string())
      .expect(401);
  });

  test('GET /actions empty obj token', async () => {
    const emptytoken = await jwt.sign('{}', process.env.JWT_SECRET);
    await request(server)
      .get(version + '/actions')
      .set('Authorization', 'Bearer ' + emptytoken)
      .expect(401);
  });
});
