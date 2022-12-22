import { ethers } from 'ethers';

import { Contract } from "./contract";

export class EmailConnect extends Contract {

  private emailWalletAddress: string | undefined;
  private emailSignature: string | undefined;
  private emailProvider: ethers.providers.Web3Provider;
  private emailSigner: ethers.providers.JsonRpcSigner | undefined;
  private magic: any;

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

  public getEmailWalletAddress(): string {
    return this.emailWalletAddress;
  }

  public async emailConnect(): Promise<string> {
    if (!this.magic) {
      this.magic = await this.startupMagic();
    }

    this.emailProvider = new ethers.providers.Web3Provider(this.magic.rpcProvider as any);
    this.emailSigner = this.emailProvider.getSigner();

    this.emailWalletAddress = await this.emailSigner.getAddress();

    return this.emailWalletAddress;
  }

  public async emailDisconnect(): Promise<boolean> {
    if (!this.magic) {
      this.magic = await this.startupMagic();
    }

    this.emailWalletAddress = undefined;
    this.emailSignature = undefined;

    return await this.magic.connect.disconnect();
  }
}