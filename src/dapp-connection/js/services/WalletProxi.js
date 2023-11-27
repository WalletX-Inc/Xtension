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

  async signMessage(message, address, privateKey) {
    return true;
  }
}

export default VaultProxi;
