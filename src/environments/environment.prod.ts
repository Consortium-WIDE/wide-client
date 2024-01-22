export const environment = {
  production: false,
  wideServerApiUrl: 'https://api.test.wid3.app',
  googleOAuth: {
    clientId: '708493994076-rlpvffondu5hee5vgmkfpn0b50fkl4ti.apps.googleusercontent.com',
    redirectUri: 'https://test.wid3.app/credentials/add/google/redirect',
    oAuthUri: 'https://accounts.google.com/o/oauth2/v2/auth'
  },
  microsoftOAuth: {
    msalConfig : {
      auth: {
        clientId: 'c3a12b3c-23fd-4660-b119-cbc9f38bdb1e', // This is your client ID
        authority: 'https://login.microsoftonline.com/common/', // This is your authority
        redirectUri: 'http://localhost:4200/credentials/oauth/redirect?source=microsoft'
      }
    }
  },
};