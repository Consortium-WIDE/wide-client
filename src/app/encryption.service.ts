import { Injectable } from '@angular/core';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  public encryptData(receiverPublicKey: string, messageToEncrypt: string) {
    // Convert public key from hex to Uint8Array
    const publicKeyUint8 = naclUtil.decodeBase64(receiverPublicKey);

    // Convert data to Uint8Array
    const messageUint8 = naclUtil.decodeUTF8(messageToEncrypt);

    // Generate a random nonce
    const nonce = nacl.randomBytes(nacl.box.nonceLength);

    // Generate a temporary keypair for this encryption
    const ephemeralKeyPair = nacl.box.keyPair();

    // Encrypt the message
    const encryptedData = nacl.box(messageUint8, nonce, publicKeyUint8, ephemeralKeyPair.secretKey);

    // Create an object to hold the encrypted data, nonce, and ephemeral public key
    const encryptedPayload = {
      version:"x25519-xsalsa20-poly1305",
      nonce: naclUtil.encodeBase64(nonce),
      ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
      ciphertext: naclUtil.encodeBase64(encryptedData)
    };

    return encryptedPayload;
  }
}
