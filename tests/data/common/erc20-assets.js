import { ERC20_TOKEN_LIST } from "./erc20-token-list.js";
import {addressesMatch} from "@/utils/account/account.js";

export function ERC20_ASSETS({ count, filterBySymbols = [], balances = {} }) {
    let assets = [];

    assets = ERC20_TOKEN_LIST({ end: count });

    if (filterBySymbols.length > 0) {
        const filterBySymbolsLC = filterBySymbols.map((filter) =>
            filter.toLowerCase()
        );
        assets = assets.filter((asset) =>
            filterBySymbolsLC.includes(asset.symbol.toLowerCase())
        );
    }

    Object.keys(balances).forEach(address => {
        const balance = balances[address];

        if (address && balance) {
            const asset = assets.find(asset => addressesMatch(asset.address, address))

            if (asset) {
                asset.balanceOf = balance;
            }
        }
    })

    return {
        erc20Assets: assets,
    };
}
