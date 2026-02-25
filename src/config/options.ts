import { env } from '$env/dynamic/public';
import type { LensOptions } from '@samply/lens';
import optionsProd from '../config/options.json';
import optionsTest from '../config/options-test.json';

console.log('Environment:', env.PUBLIC_ENVIRONMENT);
env.PUBLIC_ENVIRONMENT = 'test';
//env.PUBLIC_ENVIRONMENT = 'production';

export let options: LensOptions = optionsProd;
if (env.PUBLIC_ENVIRONMENT === 'test') {
	options = optionsTest;
}
/* if (env.PUBLIC_SPOT_URL) {
            options.spotUrl = env.PUBLIC_SPOT_URL;
        }*/
