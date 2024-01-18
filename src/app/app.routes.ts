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
import { BeginPresentationComponent } from './pages/presentations/begin-presentation/begin-presentation.component';
import { PresentationRequestComponent } from './pages/presentations/presentation-request/presentation-request.component';
import { PresentationConfirmationComponent } from './pages/presentations/presentation-confirmation/presentation-confirmation.component';
import { OauthSigninComponent } from './pages/client/integrations/oauth/add/oauth-signin/oauth-signin.component';
import { OauthRedirectComponent } from './pages/client/integrations/oauth/add/oauth-redirect/oauth-redirect.component';
import { OauthStoreComponent } from './pages/client/integrations/oauth/add/oauth-store/oauth-store.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dev/kitchen-sink', component: KitchenSinkComponent },
            { path: 'dev/poc', component: PocComponent },
            { path: 'credentials/add', component: AddCredentialsComponent },

            { path: 'credentials/oauth/signin', component: OauthSigninComponent },
            { path: 'credentials/oauth/redirect', component: OauthRedirectComponent },
            { path: 'credentials/oauth/store', component: OauthStoreComponent },

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

            { path: 'presentation/begin', component: BeginPresentationComponent },
            { path: 'presentation/request', component: PresentationRequestComponent },
            { path: 'presentation/confirm', component: PresentationConfirmationComponent },

            
            { path: '**', component: NotFoundComponent }
        ]
    }
];
