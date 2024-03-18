export const environment = {
  production: true,
  wideServerApiUrl: 'https://api.wid3.app',
  wideDomain: 'https://wid3.app',
  googleOAuth: {
    clientId: '708493994076-rlpvffondu5hee5vgmkfpn0b50fkl4ti.apps.googleusercontent.com',
    redirectUri: 'https://wid3.app/credentials/oauth/redirect/google'
  },
  discordOAuth: {
    clientId: '1218533983453712537',
    redirectUri: 'http://wid3.app/credentials/oauth/redirect/discord',
  },
  microsoftOAuth: {
    msalConfig : {
      auth: {
        clientId: 'c3a12b3c-23fd-4660-b119-cbc9f38bdb1e', // This is your client ID
        authority: 'https://login.microsoftonline.com/common/', // This is your authority
        redirectUri: 'https://wid3.app/credentials/oauth/redirect/microsoft'
      }
    }
  },
};