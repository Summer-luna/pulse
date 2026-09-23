import { randomInt } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

export function generateTemporaryPassword(length = 12): string {
  let password = '';
  for (let i = 0; i < length; i++) {
    password += ALPHABET[randomInt(ALPHABET.length)];
  }
  return password;
}
