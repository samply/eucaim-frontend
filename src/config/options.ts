import type { LensOptions } from '@samply/lens';
import optionsProd from '../config/options.json';
import optionsTest from '../config/options-test.json';

console.log('Environment:', import.meta.env.VITE_TARGET_ENVIRONMENT);
export let options: LensOptions = optionsProd;
if (import.meta.env.VITE_TARGET_ENVIRONMENT === 'staging') {
	options = optionsTest;
}
