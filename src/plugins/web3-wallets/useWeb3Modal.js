let web3Modal = null;

export async function createWeb3Modal() {
    if (web3Modal === null) {
        const Web3Modal = (
            await import('/src/plugins/web3-wallets/Web3Modal/Web3Modal.js')
        ).Web3Modal;

        web3Modal = new Web3Modal();
        await web3Modal.create();
    }
}

export async function openWeb3Modal() {
    await createWeb3Modal();
    await web3Modal.open();
}

export async function closeWeb3Modal() {
    await createWeb3Modal();
    await web3Modal.close();
}

export async function switchWeb3ModalChain(chainId) {
    await createWeb3Modal();
    await web3Modal.switchChain(chainId);
}
