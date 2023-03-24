import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OAuthModuleConfig } from './oauth-module.config';
import { NullValidationHandler } from './token-validation/null-validation-handler';
import {ValidationHandler} from './token-validation/validation-handler';
import { DPoPHandler} from './dpop/dpop-handler';
import { NullDPoPHandler } from './dpop/null-dpop-handler';
import { provideOAuthClient } from './provider';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
})
export class OAuthModule {
  static forRoot(
    config: OAuthModuleConfig = null,
    validationHandlerClass:ValidationHandler = new NullValidationHandler(),
    dPoPHandler:DPoPHandler = new NullDPoPHandler()
  ): ModuleWithProviders<OAuthModule> {
    return {
      ngModule: OAuthModule,
      providers: [provideOAuthClient(config, validationHandlerClass,dPoPHandler)],
    };
  }
}
