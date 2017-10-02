const getExpiration = ((minutes: number) => {
  return new Date(new Date().getTime() + minutes * 60 * 1000);
});

export default {
  cookies(minutes) {
    return {
      path: '/',
      expires: getExpiration(minutes)
    };
  },

  session:   '/auth/v3/session',
  timeout:   '/auth/v4/session/getTimeLeft',

  user:      '/auth/v4/session/user',
  mergeWith: '/users/v3/mergeWith/{email}',

  registration: {
    init:     '/registration/api/{email}/registerEmailValidation',
    confirm:  '/registration/api/emailValidation',
    register: '/registration/api/v2/register'
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
    deactivate: '/my-details/api/deactivate',
  },

  kba: {
    questions: '/kba/getAnswerIds',
    update:    '/kba/updateAnswers'
  },

  import: {
    history: '/import/roles',
    roles:   '/import/roles'
  },

  fsd: {
    user:       '/auth/v4/fsd/users/{id}',
    users:      '/auth/v4/fsd/users',
    kba:        '/kba/fsd/qa/{id}',
    deactivate: '/my-details/api/fsd/{id}/deactivate',
    reset: {
      init:   '/password/api/fsd/{id}/passwordReset',
      verify: '/password/api/reset/passwordResetVerifyEmail',
    },
  },

  system: {
    account: {
      get:    '/cws/api/system-accounts/{id}',
      create: '/cws/api/system-accounts',
      update: '/cws/api/system-accounts/{id}',
      reset:  '/cws/api/system-account-passwords/{id}',
      deactivate: '/cws/api/system-accounts/{id}/deactivate',
      import: {
        history: '/import/system-accounts/roles/{id}',
        create: '/import/system-accounts/roles'
      }
    }
  }
};
