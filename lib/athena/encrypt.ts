const fsPromises = require('fs').promises;
const { createReadStream, createWriteStream } = require('fs');
const readline = require('readline');
const _crypto = require('crypto');
const path = require('path');

// Function to generate a random IV
function generateRandomIV(): Buffer {
  return _crypto.randomBytes(16); // 16 bytes for AES-256
}

// Function to encrypt a portion of a text file using AES with an IV and store it as base64
async function encryptFile(inputFilePath: string, outputFilePath: string): Promise<void> {
  const inputReadStream = createReadStream(inputFilePath);
  const outputWriteStream = createWriteStream(outputFilePath);
  const rl = readline.createInterface({
    input: inputReadStream,
    crlfDelay: Infinity,
  }) as string[];

  // Read and concatenate lines starting from the first empty line
  let contentToEncrypt = '';
  let startEncrypting = false;
  let key = '';
  let iv: Buffer | null = null;
  let userKeys: { [suffix: string]: string }= {};
  for await (const line of rl) {
    if (!startEncrypting && line.trim() === '') {
      // Set startEncrypting to true when an empty line is encountered
      startEncrypting = true;
      continue; // Skip the empty line
    }

    if (startEncrypting) {
      contentToEncrypt += line + '\n';
    } else {
      const metaKey = line.split(':')[0].trim()
      if (metaKey.trim() === 'key') {
        key = line.split(':')[1].trim()
      } else if (metaKey.trim() === 'iv') {
        iv = Buffer.from(line.split(':')[1].trim(), 'hex')
      } else if (metaKey.trim() === 'user-key') {
        const value = line.split(':')[1].trim().split(' ')[0].trim()
        const suffix = value.substring(value.length-4)
        userKeys[suffix] = value
      } else {
        // Write lines before the first empty line as plain text
        outputWriteStream.write(line + '\n');
      }
    }
  }

  if (!!key && !!iv) {
    const encryptedKeys = Object.keys(userKeys).map((suffix) => {
      let userKey = userKeys[suffix]
      while (userKey.length < 32) userKey += userKeys[suffix]
      userKey = userKey.substring(0, 32)
      const cipher = _crypto.createCipheriv('aes-256-cbc', Buffer.from(userKey, 'utf-8'), iv);
      const encryptedBuffer = Buffer.concat([cipher.update(Buffer.from(key, 'utf-8')), cipher.final()]);
      const encryptedBase64 = encryptedBuffer.toString('base64');
      outputWriteStream.write('l2-key-' + suffix + ': ' + encryptedBase64 + '\n')
    })

    // Encrypt the concatenated content and store it as base64 along with the IV
    outputWriteStream.write('iv: ' + iv.toString('hex') + '\n')
    outputWriteStream.write('\n')
    const cipher = _crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), iv);
    const encryptedBuffer = Buffer.concat([cipher.update(Buffer.from(contentToEncrypt, 'utf-8')), cipher.final()]);
    const encryptedBase64 = encryptedBuffer.toString('base64');
    outputWriteStream.write(encryptedBase64 + '\n');
  } else {
    outputWriteStream.write('\n')
    outputWriteStream.write(contentToEncrypt)
  }

  // Close the streams
  inputReadStream.close();
  outputWriteStream.close();
}

// Function to read all files in a directory and encrypt them
async function encryptFilesInDirectory(inputDirectory: string, outputDirectory: string): Promise<void> {
  try {
    const files = await fsPromises.readdir(inputDirectory);

    for (const file of files) {
      const inputFilePath = path.join(inputDirectory, file);
      const outputFilePath = path.join(outputDirectory, file);

      await encryptFile(inputFilePath, outputFilePath);

      console.log(`File ${file} encrypted and saved to ${outputFilePath}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const inputDirectory = './data/posts_plaintext';
const outputDirectory = './data/posts/';

encryptFilesInDirectory(inputDirectory, outputDirectory)
  .catch((error) => {
    console.error('Error:', error);
  });
