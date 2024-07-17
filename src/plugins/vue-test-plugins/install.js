import { config } from '@vue/test-utils';
import { findRouterLinkByNamePlugin } from './findRouterLinkByName.js';

const { VueWrapper } = config.plugins;

VueWrapper.install(findRouterLinkByNamePlugin);
