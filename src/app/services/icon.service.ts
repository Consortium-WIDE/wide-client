import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor() { }

  getIconFor(providerUrl: string): string {
    if (!providerUrl.startsWith('http://') && !providerUrl.startsWith('https://')) {
      providerUrl = 'http://' + providerUrl;
    }

    // Construct and return the favicon URL
    const urlObj = new URL(providerUrl);

    switch (urlObj.hostname.toLocaleLowerCase()) {
      case 'discord.com':
        return 'assets/icons/providers/discord.svg';
        break;
    }
    return `${urlObj.origin}/favicon.ico`;
  }
}
