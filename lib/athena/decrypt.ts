import crypto from 'crypto';

export function decryptKey(meta: { [key: string]: string }, userKey: string): string | null {
  const suffix = userKey.substring(userKey.length-4)
  if ('l2-key-'+suffix in meta) {
    try {
      while (userKey.length < 32) userKey += userKey
      userKey = userKey.substring(0, 32)
      const iv = Buffer.from(meta.iv, 'hex')
      const l2Key = meta['l2-key-'+suffix]
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(userKey, 'utf-8'), iv);
      const decryptedBuffer = Buffer.concat([decipher.update(Buffer.from(l2Key, 'base64')), decipher.final()]);
      return decryptedBuffer.toString('utf-8');
    } catch (err) {
      console.error(err)
      return null
    }
  }
  return null
}

export function decryptPost(content: string, meta: { [key: string]: string }, key: string): string {
  try {
    const iv = Buffer.from(meta.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), iv);
    const decryptedBuffer = Buffer.concat([decipher.update(Buffer.from(content, 'base64')), decipher.final()]);
    const decryptedText = decryptedBuffer.toString('utf-8');
    return decryptedText
  } catch (err) {
    return 'ERROR: Failed to decrypt post'
  }
}
