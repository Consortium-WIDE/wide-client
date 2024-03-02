export const environment = {
  production: true,
  wideServerApiUrl: 'http://localhost:3000',
  wideDomain: 'http://localhost:4200',
  googleOAuth: {
    clientId: '708493994076-rlpvffondu5hee5vgmkfpn0b50fkl4ti.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200/credentials/oauth/redirect/google'
  },
  githubOAuth: {
    clientId: 'Iv1.5597c8d31050475d',
    redirectUri: 'http://localhost:4200/credentials/oauth/redirect/github'
  },
  microsoftOAuth: {
    msalConfig: {
      auth: {
        clientId: 'c3a12b3c-23fd-4660-b119-cbc9f38bdb1e', // This is your client ID
        authority: 'https://login.microsoftonline.com/common/', // This is your authority
        redirectUri: 'http://localhost:4200/credentials/oauth/redirect/microsoft'
      }
    }
  },
};