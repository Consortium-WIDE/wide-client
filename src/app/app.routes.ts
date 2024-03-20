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
import { HistoryComponent } from './pages/client/history/history.component';
import { PoapStartComponent } from './pages/client/integrations/poap/poap-start/poap-start.component';
import { PoapStoreComponent } from './pages/client/integrations/poap/poap-store/poap-store.component';
import { PopupStartComponent } from './pages/client/integrations/popupCredentialLoader/popup-start/popup-start.component';
import { PopupReviewComponent } from './pages/client/integrations/popupCredentialLoader/popup-review/popup-review.component';
import { PopupStoreComponent } from './pages/client/integrations/popupCredentialLoader/popup-store/popup-store.component';
import { PresentationMultiSelectComponent } from './pages/presentations/presentation-multi-select/presentation-multi-select.component';
import { PopupUpdateReviewComponent } from './pages/client/integrations/update/popup-update-review/popup-update-review.component';
import { PopupUpdateStartComponent } from './pages/client/integrations/update/popup-update-start/popup-update-start.component';
import { PopupUpdateStoreComponent } from './pages/client/integrations/update/popup-update-store/popup-update-store.component';
import { RgStartComponent } from './pages/client/integrations/dao-haus/rg-start/rg-start.component';
import { RgStoreComponent } from './pages/client/integrations/dao-haus/rg-store/rg-store.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dev/kitchen-sink', component: KitchenSinkComponent },
            { path: 'dev/poc', component: PocComponent },
            { path: 'credentials/add', component: AddCredentialsComponent },

            { path: 'credentials/oauth/signin', component: OauthSigninComponent },
            { path: 'credentials/oauth/redirect/:source', component: OauthRedirectComponent },
            { path: 'credentials/oauth/store', component: OauthStoreComponent },

            { path: 'credentials/poap', component: PoapStartComponent },
            { path: 'credentials/poap/store', component: PoapStoreComponent },

            { path: 'credentials/dao-haus', component: RgStartComponent },
            { path: 'credentials/dao-haus/store', component: RgStoreComponent },

            { path: 'history', component: HistoryComponent },

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

            { path: 'present', component: BeginPresentationComponent },
            { path: 'present/request', component: PresentationRequestComponent },
            { path: 'present/multi-select', component: PresentationMultiSelectComponent },
            { path: 'present/confirm', component: PresentationConfirmationComponent },

            { path: 'popup/start', component: PopupStartComponent },
            { path: 'popup/review', component: PopupReviewComponent },
            { path: 'popup/store', component: PopupStoreComponent },

            { path: 'update/start', component: PopupUpdateStartComponent },
            { path: 'update/review', component: PopupUpdateReviewComponent },
            { path: 'update/store', component: PopupUpdateStoreComponent },

            { path: '**', component: NotFoundComponent }
        ]
    }
];
