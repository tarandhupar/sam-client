import iam from './iam';

export default {
  // Setting for debugging on environments. This is on for local environments
  debug: false,

  environments: {
    comp: new RegExp('comp\.280\.samfrontendpipelinetwo\.prod', 'gi'),
    minc: new RegExp('(minc\.280\.samfrontendpipelinetwo\.prod)|(minc\.sam\.micropaas\.io)', 'gi'),
    prodlike: new RegExp('(prodlike\.280\.samfrontendpipelinetwo\.prod)|(prodlike\.sam\.micropaas\.io)', 'gi')
  },

  endpoints: {
    iam: iam
  }
};
