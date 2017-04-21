import iam from './iam';

let pattern = '(55samfrontend{env}\\.apps\\.prod-iae\\.bsp\\.gsa\\.gov)',
    needle = /\{env\}/g;

export default {
  // Setting for debugging on environments. This is on for local environments
  debug: false,

  environments: {
    comp: new RegExp(pattern.replace(needle, 'comp'), 'gi'),
    minc: new RegExp(pattern.replace(needle, 'minc'), 'gi'),
    prodlike: new RegExp(pattern.replace(needle, 'prodlike'), 'gi')
  },

  endpoints: {
    iam: iam
  }
};
