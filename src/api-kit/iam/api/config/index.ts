import iam from './iam';

export default {
  // Setting for debugging on environments. This is on for local environments
  debug: false,

  environments: {
    comp: new RegExp('(iam|clp-unified)\.comp\.micropaas\.io', 'gi'),
    minc: [
      new RegExp('(iam|clp-unified)\.minc\.micropaas\.io', 'gi'),
      new RegExp('minc\.clp-unified\.micropaas\.io', 'gi')
    ],

    prodlike: new RegExp('(iam|clp-unified)\.prodlike\.micropaas\.io', 'gi')
  },

  endpoints: {
    iam: iam
  }
};
