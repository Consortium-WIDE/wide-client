export const environment = {
    production: false,
    wideServerApiUrl: 'http://localhost:3000',
    googleOAuth: {
      clientId: '708493994076-rlpvffondu5hee5vgmkfpn0b50fkl4ti.apps.googleusercontent.com',
      redirectUri: 'http://localhost:4200/credentials/oauth/redirect?source=google'
    },
    githubOAuth: {
      clientId: '53e143bae3e6556e99c4',
      redirectUri: 'http://localhost:4200/credentials/oauth/redirect?source=github'
    },
    microsoftOAuth: {
      clientId: '',
      redirectUri: 'http://localhost:4200/credentials/oauth/redirect?source=microsoft'
    },
  };