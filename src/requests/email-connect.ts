import { ethers } from 'ethers';

import { Contract } from "./contract";

export class EmailConnect extends Contract {

  private emailWalletAddress: string | undefined;
  private emailSignature: string | undefined;
  private emailProvider: ethers.providers.Web3Provider;
  private emailSigner: ethers.providers.JsonRpcSigner | undefined;
  private magic: any;

  /**
  * @returns: string
  * @dev: Connects (or re-connects) a user via email address. For first-time connection, 
  * a UI will be displayed that walks the user through the process. 
  * Subsequent attempts to this call will re-connect the user without the UI process.
  */
  public async emailConnect(): Promise<string> {
    if (!this.magic) {
      this.magic = await this.startupMagic();
    }

    this.emailProvider = new ethers.providers.Web3Provider(this.magic.rpcProvider as any);
    this.emailSigner = this.emailProvider.getSigner();

    this.emailWalletAddress = await this.emailSigner.getAddress();

    return this.emailWalletAddress;
  }

  /**
  * @returns: boolean
  * @dev: Disconnects an email user.
  */
  public async emailDisconnect(): Promise<boolean> {
    if (!this.magic) {
      this.magic = await this.startupMagic();
    }

    this.emailWalletAddress = undefined;
    this.emailSignature = undefined;

    return await this.magic.connect.disconnect();
  }

  /**
  * @returns: string
  * @dev: Gets a signature hash that can be passed to Soulbind txn methods
  */
  public async getEmailSignature(): Promise<string> {
    if (!this.emailSigner) {
      return;
    }

    if (this.emailSignature && this.emailWalletAddress) {
      // Verify sig
      const signedAddress = ethers.utils.verifyMessage(this.getSignatureMessage(this.emailWalletAddress), this.emailSignature);
      if (signedAddress === this.emailWalletAddress) {
        return this.emailSignature;
      }
    }

    this.emailSignature = await this.emailSigner.signMessage(this.getSignatureMessage(this.emailWalletAddress, true));

    return this.emailSignature;
  }

  /**
  * @returns: string
  * @dev: Returns the currently connected email wallet address.
  */
  public getEmailWalletAddress(): string {
    return this.emailWalletAddress;
  }
}