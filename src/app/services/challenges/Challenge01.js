import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';

const pathJson = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'tmp',
  'answer.json'
);

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const cryptoText = (text) => {
  return crypto.createHash('sha1').update(text).digest('hex');
};

const decodeWord = (word, number) => {
  const num = number < 0 ? 26 : number;
  let output = '';

  for (let i = 0; i < word.length; i += 1) {
    const code = word.charCodeAt(i);
    let c = '';

    if (code >= 65 && code <= 90) {
      c = String.fromCharCode((code - num) % 26);
    } else if (code >= 97 && code <= 122) {
      if (code - num < 97) {
        c = String.fromCharCode(code - num + 122 - 97 + 1);
      } else {
        c = String.fromCharCode(code - num);
      }
    } else if (code === 32) {
      c = ' ';
    } else if (code === 58) {
      c = String.fromCharCode(code);
    } else if (code === 46) {
      c = String.fromCharCode(code);
    }
    output += c;
  }
  return output;
};

const createJson = async (data) => {
  try {
    fs.exists(pathJson, async (exists) => {
      if (!exists) {
        throw new Error('Arquivo Json "answer.json" não existe.');
      }
    });

    await writeFileAsync(pathJson, JSON.stringify(data));

    return { sucess: true, message: 'Json criado com sucesso.' };
  } catch (err) {
    return {
      erro: true,
      message: 'Não foi possível criar o arquivo Json.',
    };
  }
};

const saveChangesToJson = async () => {
  try {
    const result = await readFileAsync(pathJson);

    const data = JSON.parse(result);

    const decifrado = decodeWord(data.cifrado, data.numero_casas);
    data.decifrado = decifrado;

    const resumo_criptografico = cryptoText(data.decifrado);
    data.resumo_criptografico = resumo_criptografico;

    await writeFileAsync(pathJson, JSON.stringify(data));

    return data;
  } catch (err) {
    return {
      erro: true,
      message: 'Não possível salvar o Json decodificado.',
    };
  }
};

const createdReadStream = async () => {
  const readStream = await fs.createReadStream(pathJson);
  return readStream;
};

export default {
  key: 'challenge01',
  createJson,
  saveChangesToJson,
  createdReadStream,
  pathJson,
};
