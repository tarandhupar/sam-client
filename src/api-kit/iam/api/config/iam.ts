const getExpiration = ((minutes: number) => {
  return new Date(new Date().getTime() + minutes * 60 * 1000)
});

export default {
  localResource: {
    comp:     'http://api-umbrella.prod-iae.bsp.gsa.gov//comp/iam',
    minc:     'http://api-umbrella.prod-iae.bsp.gsa.gov//minc/iam',
    prodlike: 'http://api-umbrella.prod-iae.bsp.gsa.gov//prodlike/iam'
  },

  remoteResource: {
    comp:     'http://api-umbrella.prod-iae.bsp.gsa.gov//comp/iam',
    minc:     'http://api-umbrella.prod-iae.bsp.gsa.gov//minc/iam',
    prodlike: 'http://api-umbrella.prod-iae.bsp.gsa.gov//prodlike/iam'
  },

  cookies: {
    path: '/',
    expires: getExpiration(15)
  },

  session:   'http://api-umbrella.prod-iae.bsp.gsa.gov//{environment}/IdentityandAccess/v3/auth/session',
  timeout:   'http://api-umbrella.prod-iae.bsp.gsa.gov//{environment}/IdentityandAccess/v4/auth/session/getTimeLeft',

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
    questions: 'http://api-umbrella.prod-iae.bsp.gsa.gov//{environment}/IdentityandAccess/v1/kba/getAnswerIds',
    update:    'http://api-umbrella.prod-iae.bsp.gsa.gov//{environment}/IdentityandAccess/v1/kba/updateAnswers'
  },

  import: {
    history: '/import/roles',
    roles:   '/import/roles'
  },

  system: {
    account: {
      get:    '/cws/api/system-accounts/{id}',
      create: '/cws/api/system-accounts',
      update: '/cws/api/system-accounts/{id}'
    }
  }
};
