class VaultProxi {
  accounts = [];

  wallets = [];

  vault = false;

  constructor() {
    this.loadWeb3();
  }

  async loadWeb3() {
    return true;
  }

  loadVault() {
    return true;
  }

  noop() {
    return true;
  }

  isLocked() {
    return true;
  }

  lockExtension() {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signMessage(message, address, privateKey) {
    return true;
  }
}

export default VaultProxi;
