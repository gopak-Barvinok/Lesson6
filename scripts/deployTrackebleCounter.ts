import { toNano } from '@ton/core';
import { TrackebleCounter } from '../wrappers/TrackebleCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const trackebleCounter = provider.open(await TrackebleCounter.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await trackebleCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(trackebleCounter.address);

    console.log('ID', await trackebleCounter.getId());
}
