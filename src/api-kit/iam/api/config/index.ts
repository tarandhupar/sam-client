import iam from './iam';

let config = {
  pattern: '(55samfrontend{env}\\.apps\\.prod-iae\\.bsp\\.gsa\\.gov)',
  needle: /\{env\}/g
};

function getEnvConfig(env) {
  let patterns = [
        config.pattern.replace(config.needle, env)
      ],

      pattern;

  switch(env) {
    case 'prodlike':
      patterns.push('(alpha\\.sam\\.gov)');

      //TODO
      break;
  }

  pattern = patterns.join('|');

  return new RegExp(pattern, 'gi');
};

export default {
  // Setting for debugging on environments. This is on for local environments
  debug: false,

  environments: {
    comp: getEnvConfig('comp'),
    minc: getEnvConfig('minc'),
    prodlike: getEnvConfig('prodlike')
  },

  endpoints: {
    iam: iam
  }
};
