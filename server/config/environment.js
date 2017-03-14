var _ = require('lodash');

var localEnvVars = {
  topSecret: 'sushi'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);

