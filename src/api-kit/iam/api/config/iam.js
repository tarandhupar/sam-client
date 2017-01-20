export default {
  localResource: {
    comp:     'http://comp.276.iamservicepipelinetwo.prod',
    minc:     'http://minc.276.iamservicepipelinetwo.prod',
    prodlike: 'http://prodlike.276.iamservicepipelinetwo.prod'
  },

  remoteResource: {
    comp:     'http://comp.276.iamservicepipelinetwo.prod',
    minc:     'http://minc.276.iamservicepipelinetwo.prod',
    prodlike: 'http://prodlike.276.iamservicepipelinetwo.prod'
  },

  cookies: {
    path: '/'
  },

  session:   'https://csp-api.sam.gov/{environment}/IdentityandAccess/v3/auth/session/?api_key=rkkGBk7AU8UQs9LHT6rM0rFkg3A3rGaiBntKSGEC',
  mergeWith: '/users/v3/mergeWith/{email}',

  registration: {
    init:     '/registration/api/{email}/registerEmailValidation',
    confirm:  '/registration/api/emailValidation',
    register: '/registration/api/register'
  },

  password: {
    authenticated: '/password/api/{email}/changePassword',
    unauthenticated: {
      init:   '/password/api/{email}/passwordReset/',
      verify: '/password/api/passwordResetVerifyEmail',
      kba:    '/password/api/kbaAnswer',
      reset:  '/password/api/passwordReset'
    }
  },

  details: {
    update:     '/my-details/api/update',
    deactivate: '/my-details/api/deactivate'
  },

  kba: {
    questions: 'https://csp-api.sam.gov/{environment}/IdentityandAccess/v1/kba/getAnswerIds?api_key=rkkGBk7AU8UQs9LHT6rM0rFkg3A3rGaiBntKSGEC',
    update:    'https://csp-api.sam.gov/{environment}/IdentityandAccess/v1/kba/updateAnswers?api_key=rkkGBk7AU8UQs9LHT6rM0rFkg3A3rGaiBntKSGEC'
  }
};
