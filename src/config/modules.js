import { Modules } from '@/utils/Modules/Modules.js';
import '@/modules/account/register.js';
import '@/modules/app/register.js';
import '@/modules/common/register.js';
import '@/modules/main/register.js';
import '@/modules/transaction/register.js';
import '@/modules/wallet/register.js';
import '@/modules/wrap-station/register.js';

// routes (?)

export async function setUpModules(test) {
    await Modules.setUp(test);
}
