import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/trackeble_counter.tact',
    options: {
        debug: true,
    },
};
