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

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dev/kitchen-sink', component: KitchenSinkComponent },
            { path: 'dev/poc', component: PocComponent },
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
