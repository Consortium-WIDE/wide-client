import { Routes } from '@angular/router';
import { KitchenSinkComponent } from './pages/dev/kitchen-sink/kitchen-sink.component';
import { PocComponent } from './pages/dev/poc/poc.component';
import { LandingPageComponent } from './pages/client/landing-page/landing-page.component';
import { NotFoundComponent } from './pages/general/not-found/not-found.component';
import { MainComponent } from './pages/client/main/main.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout/simple-layout.component';
import { GettingStartedComponent } from './pages/client/getting-started/getting-started.component';
import { SupportComponent } from './pages/client/support/support.component';
import { AboutComponent } from './pages/client/about/about.component';
import { AddCredentialsComponent } from './pages/client/add-credentials/add-credentials.component';
import { GoogleSigninComponent } from './pages/client/integrations/google/google-signin/google-signin.component';
import { GoogleSigninRedirectComponent } from './pages/client/integrations/google/google-signin-redirect/google-signin-redirect.component';
import { GoogleStoreCredentialsComponent } from './pages/client/integrations/google/google-store-credentials/google-store-credentials.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dev/kitchen-sink', component: KitchenSinkComponent },
            { path: 'dev/poc', component: PocComponent },
            { path: 'credentials/add', component: AddCredentialsComponent },

            { path: 'credentials/add/google/signin', component: GoogleSigninComponent },
            { path: 'credentials/add/google/redirect', component: GoogleSigninRedirectComponent },
            { path: 'credentials/add/google/store', component: GoogleStoreCredentialsComponent },

            { path: 'about', component: AboutComponent },
            { path: 'support', component: SupportComponent },
            { path: '', component: MainComponent },
        ]
    },
    {
        path: '',
        component: SimpleLayoutComponent,
        children: [
            { path: 'getting-started', component: GettingStartedComponent },
            { path: '**', component: NotFoundComponent }
        ]
    }
];
