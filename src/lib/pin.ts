function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return bufferToHex(bytes.buffer);
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + salt);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(digest);
}

export async function createPinHash(pin: string) {
  const salt = generateSalt();
  const hash = await hashPin(pin, salt);
  return { hash, salt };
}

export async function verifyPin(pin: string, hash: string, salt: string) {
  const attempt = await hashPin(pin, salt);
  return attempt === hash;
}
