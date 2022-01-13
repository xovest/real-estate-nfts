var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    let proof = {
        "A": ["0x1db16525f6204e5f8e851b218846069418ba4b1db7285e5965b260fcb473088f", "0x2f8daa1929be2e774620b9b83ae9e04b246e972ea1122d0559b4ea61cc1f9976"],
        "A_p": ["0x249d7e3257fcd16f00de3fbb614d87455578447fe9fd345f8cadf4d300dfad37", "0x2bd777c50960163ad8f0c1445cd122126766437f310edf30bb2c1df9887ce45b"],
        "B":
            [["0xac8095c1b5dad92aaf3ab7cb51e71cbd16b3880d6f008c9205139a8a2c75a47", "0x1761e5b338f0ee08b22e54587d5ea764eb17a0c7cf7208a585d1e1257239e831"], ["0x2af8d8b5029a8817485d8bbbb0b52af086c3f0b7dd301788f8c9d91abf9f88ef", "0x2f8f10408a75a0206e24fa7295818a336f3e442de5166459a82dda2eaa27a77e"]],

        "B_p": ["0xb2a73818b3783fb8e5c0927ad13aa3ba10760222dc5c042f64f7f805826c3f3", "0x24a13fec457c62da54873b41390b45c9b059f080ea9d6298370b3e30f3f9e31e"],
        "C": ["0x38d0edb1fa809bc88c79d3d6995d027642d537fbfc00911fd621b0677aa1b61", "0x1248ce74f7ce94086edab126e54cf20277ca28a1d0da0ddde32d71947f5c5e0c"],
        "C_p": ["0x2a7ed53ba71103d95a29a0d4b2f450269b26a4899af5c22e72b93e32c4c28df8", "0xa7e48d9393f5d14e90cbf10c7956781507f19aa6c2ea3ffe3cd2decf4f10960"],
        "H": ["0x232d79b2ed9de53f74cd3d32ee0594129cfcfd151941d9a628d932a449f18c18", "0x12bc9ebeee7c3a1554a7637b592d50d4e95e7ed505776b8602f5611615b0a993"],
        "K": ["0xbe079c7449c6fbe156f127e274770548e5f13c11b31d62e4ab380563e6362b8", "0x1cf1ce5b372cee75d832fc47531f5de10ab51503a87c5fc21af9ac11037b3387"]
    }
    let input = [3, 9]

    describe('', function () {
        beforeEach(async function () { 
            this.contract = await SolnSquareVerifier.new({from: account_one});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint a token if the proof is correct', async function () { 
            let before = (await this.contract.totalSupply()).toNumber();
            await this.contract.mint(
                proof.A,
                proof.A_p,
                proof.B,
                proof.B_p,
                proof.C,
                proof.C_p,
                proof.H,
                proof.K,
                input,
                account_two,
                "101"
            );

            let after = (await this.contract.totalSupply()).toNumber();
            let owner = await this.contract.ownerOf("101")
        
            assert.equal(before + 1, after, "The total supply has not been updated"); 
            assert.equal(account_two, owner, "The owner of the token has not been registered proberly"); 
        })

        it('should not mint a token if the proof is incorrect', async function () { 
            try{
                await this.contract.mint(
                    42,
                    proof.A_p,
                    proof.B,
                    proof.B_p,
                    proof.C,
                    proof.C_p,
                    proof.H,
                    proof.K,
                    input,
                    account_two,
                    "101"
                )
            } catch(e) {
                assert.strictEqual(e.message, 'expected array value (arg="a", coderType="array", value=42)');
                return;
            }
    
            assert.fail("expected to throw an exception")
        })

        it('should not mint a token if the proof has been submited before', async function () { 
            try{
                await this.contract.mint(
                    proof.A,
                    proof.A_p,
                    proof.B,
                    proof.B_p,
                    proof.C,
                    proof.C_p,
                    proof.H,
                    proof.K,
                    input,
                    account_two,
                    "101"
                )
                await this.contract.mint(
                    proof.A,
                    proof.A_p,
                    proof.B,
                    proof.B_p,
                    proof.C,
                    proof.C_p,
                    proof.H,
                    proof.K,
                    input,
                    account_two,
                    "101"
                )
            } catch(e) {
                assert.strictEqual(e.message, 'Returned error: VM Exception while processing transaction: revert This proof has been submitted before -- Reason given: This proof has been submitted before.');
            }
        })

    });

})