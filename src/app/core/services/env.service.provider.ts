import { EnvService } from './env.service';
import { FormioAppConfig } from 'angular-formio';
import { FormioAuthConfig } from 'angular-formio/auth';

/**
 * Enviroment Service Factory - Read Window Env Variables and assign them to EnvService
 */
export const EnvServiceFactory = () => {
    // Create env
    const env = new EnvService();

    // Read environment variables from browser window
    const browserWindow = window || {};
    const browserWindowEnv = browserWindow['__env'] || {};

    // Assign environment variables from browser window to env
    // In the current implementation, properties from env.js overwrite defaults from the EnvService.
    // If needed, a deep merge can be performed here to merge properties instead of overwriting them.
    for (const key in browserWindowEnv) {
        if (browserWindowEnv.hasOwnProperty(key)) {
            env[key] = window['__env'][key];
        }
    }

    return env;
};

/**
 * formioAuthConfigFactory Factory - Read Window Env Variables and assign them to formioAuthConfig
 */
export const formioAuthConfigFactory = () => {
    // Create env
    const authConfig = new FormioAuthConfig();

    // Read environment variables from browser window
    const browserWindow = window || {};
    const browserWindowEnv = browserWindow['__env'] || {};

    // Assign environment variables from browser window to env
    // In the current implementation, properties from env.js overwrite defaults from the EnvService.
    // If needed, a deep merge can be performed here to merge properties instead of overwriting them.
    for (const key in browserWindowEnv) {
        if (authConfig.hasOwnProperty(key)) {
            authConfig[key] = window['__env'][key];
        }
    }

    return authConfig;
};

/**
 * FormioAppConfigFactory Factory - Read Window Env Variables and assign them to FormioAppConfig
 */
export const FormioAppConfigFactory = () => {
    // Create env
    const appConfig = new FormioAppConfig();

    // Read environment variables from browser window
    const browserWindow = window || {};
    const browserWindowEnv = browserWindow['__env'] || {};

    // Assign environment variables from browser window to env
    // In the current implementation, properties from env.js overwrite defaults from the EnvService.
    // If needed, a deep merge can be performed here to merge properties instead of overwriting them.
    for (const key in browserWindowEnv) {
        if (appConfig.hasOwnProperty(key)) {
            appConfig[key] = window['__env'][key];
        }
    }

    return appConfig;
};

export const EnvServiceProvider = {
    provide: EnvService,
    useFactory: EnvServiceFactory,
    deps: [],
};
export const formioAuthConfigProvider = {
    provide: FormioAuthConfig,
    useFactory: formioAuthConfigFactory,
    deps: [],
};
export const FormioAppConfigProvider = {
    provide: FormioAppConfig,
    useFactory: FormioAppConfigFactory,
    deps: [],
};
