
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterComponent } from './register/register.component';
import { CapAuthenticationRoutingModule } from './cap-authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticationModule } from 'cap-authentication-forked';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ForgotComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    CapAuthenticationRoutingModule,
    AuthenticationModule.forRoot({
      clientId: '<%=clientID%>',
      clientSecret: '<%=clientSecret%>',
      domain: '<%=domain%>',
      endPoint: '<%=endPoint%>'
    })
  ],
  exports: [
    AuthenticationModule,
    RegisterComponent,
    LoginComponent,
    ForgotComponent,
    ProfileComponent
  ]
})
export class CapAuthenticationModule {}