import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/current_item_and_random.tact',
    options: {
        debug: true,
    },
};
