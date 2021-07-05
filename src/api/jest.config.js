process.env.NODE_ENV = 'test';

module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['node_modules', '<rootDir>/test'],
  typeAcquisition: {
    include: ['jest'],
  },
};
