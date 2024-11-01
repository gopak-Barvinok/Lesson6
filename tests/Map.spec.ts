import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Dictionary, fromNano } from '@ton/core';
import { Map } from '../wrappers/Map';
import '@ton/test-utils';

describe('Map', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let map: SandboxContract<Map>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const dict = Dictionary.empty(Dictionary.Keys.BigInt(32), Dictionary.Values.Bool());
        dict.set(1n, true);

        map = blockchain.openContract(await Map.fromInit(dict));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await map.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: map.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and map are ready to use
    });

    it("should add map", async () => {
        const gasUsed = [];

        for(let i=0n; i<100; i++) {
            const res = await getGasUsed(deployer, async () => {
                await map.send(deployer.getSender(), {
                    value: toNano("0.5")
                }, {
                    $$type: 'Add',
                    key: i,
                    value: i
                })
            });
            gasUsed.push(res);
        }

        console.log("first gasUsed - ", fromNano(gasUsed[0] as bigint));
        console.log("last gasUsed - ", fromNano(gasUsed[gasUsed.length-1] as bigint));

        const items = await map.getAllItem();
        console.log(items.values());
    }); 
});

const getGasUsed = async (sender: SandboxContract<TreasuryContract>, message: any): Promise<BigInt> => {
    const balance = await sender.getBalance();
    await message();
    return balance - await sender.getBalance();
}
