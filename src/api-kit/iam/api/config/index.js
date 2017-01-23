import iam from './iam';

export default {
  // Setting for debugging on environments. This is on for local environments
  debug: false,

  environments: {
    comp: new RegExp('comp\.276\.iamservicepipelinetwo\.prod', 'gi'),
    minc: new RegExp('(minc\.276\.iamservicepipelinetwo\.prod)|((minc\.)?(^prodlike\.)sam\.micropaas\.io)', 'gi'),
    prodlike: new RegExp('(prodlike\.276\.iamservicepipelinetwo\.prod)|(prodlike\.sam\.micropaas\.io)', 'gi')
  },

  endpoints: {
    iam: iam
  }
};
