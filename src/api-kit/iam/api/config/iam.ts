const getExpiration = ((minutes: number) => {
  return new Date(new Date().getTime() + minutes * 60 * 1000)
});

export default {
  cookies: {
    path: '/',
    expires: getExpiration(15)
  },

  session:   '/auth/v3/session',
  timeout:   '/auth/v4/session/getTimeLeft',

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
    questions: '/kba/getAnswerIds',
    update:    '/kba/updateAnswers'
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
