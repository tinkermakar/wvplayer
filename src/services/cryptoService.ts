import crypto from 'node:crypto';

class CryptoService {
  #algorithm = 'AES-256-CBC';
  #key: Buffer;
  #iv: Buffer;

  constructor(key?: Buffer, iv?: Buffer) {
    this.#key = key || crypto.randomBytes(32);
    this.#iv = iv || crypto.randomBytes(16);
  }

  #encrypt(data: string) {
    const cipher = crypto.createCipheriv(this.#algorithm, this.#key, this.#iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  generateToken(username: string) {
    if (username.includes('&')) throw new Error('Invalid username');
    const date = `${new Date().toISOString().slice(0, 16)}Z`;
    return this.#encrypt(`${username}&${date}&${Math.random()}`);
  }

  decrypt(data: string) {
    const decipher = crypto.createDecipheriv(this.#algorithm, this.#key, this.#iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    if (!decrypted?.includes('&')) return null;

    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

export const cryptoService = new CryptoService();
