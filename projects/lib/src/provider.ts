import { makeEnvironmentProviders, EnvironmentProviders } from '@angular/core';
import { OAuthModuleConfig } from './oauth-module.config';
import { NullValidationHandler } from './token-validation/null-validation-handler';
import { DateTimeProvider, SystemDateTimeProvider } from './date-time-provider';
import { OAuthStorage, OAuthLogger } from './types';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { OAuthService } from './oauth-service';
import { UrlHelperService } from './url-helper.service';

import {
  OAuthResourceServerErrorHandler,
  OAuthNoopResourceServerErrorHandler,
} from './interceptors/resource-server-error-handler';
import { DefaultOAuthInterceptor } from './interceptors/default-oauth.interceptor';
import { ValidationHandler } from './token-validation/validation-handler';
import { DPoPHandler} from './dpop/dpop-handler';
import { NullDPoPHandler } from './dpop/null-dpop-handler';
import { createDefaultLogger, createDefaultStorage } from './factories';
import {
  HashHandler,
  DefaultHashHandler,
} from './token-validation/hash-handler';

export function provideOAuthClient(
  config: OAuthModuleConfig = null,
  validationHandlerClass:ValidationHandler = new NullValidationHandler(),
  dPoPHandler:DPoPHandler = new NullDPoPHandler()
): EnvironmentProviders {
  return makeEnvironmentProviders([
    OAuthService,
    UrlHelperService,
    { provide: OAuthLogger, useFactory: createDefaultLogger },
    { provide: OAuthStorage, useFactory: createDefaultStorage },
    { provide: ValidationHandler, useValue: validationHandlerClass },
    { provide: HashHandler, useClass: DefaultHashHandler },
    {
      provide: OAuthResourceServerErrorHandler,
      useClass: OAuthNoopResourceServerErrorHandler,
    },
    { provide: OAuthModuleConfig, useValue: config },
    { provide: DPoPHandler, useValue: dPoPHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultOAuthInterceptor,
      multi: true,
    },
    { provide: DateTimeProvider, useClass: SystemDateTimeProvider },
  ]);
}
