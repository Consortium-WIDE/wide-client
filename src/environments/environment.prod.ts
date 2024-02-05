export const environment = {
  production: true,
  wideServerApiUrl: 'https://api.test.wid3.app',
  googleOAuth: {
    clientId: '708493994076-rlpvffondu5hee5vgmkfpn0b50fkl4ti.apps.googleusercontent.com',
    redirectUri: 'https://test.wid3.app/credentials/oauth/redirect?source=google'
  },
  microsoftOAuth: {
    msalConfig : {
      auth: {
        clientId: 'c3a12b3c-23fd-4660-b119-cbc9f38bdb1e', // This is your client ID
        authority: 'https://login.microsoftonline.com/common/', // This is your authority
        redirectUri: 'https://test.wid3.app/credentials/oauth/redirect?source=microsoft'
      }
    }
  },
};