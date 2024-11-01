import { toNano } from '@ton/core';
import { CurrentItemAndRandom } from '../wrappers/CurrentItemAndRandom';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const currentItemAndRandom = provider.open(await CurrentItemAndRandom.fromInit());

    await currentItemAndRandom.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(currentItemAndRandom.address);

    // run methods on `currentItemAndRandom`
}
