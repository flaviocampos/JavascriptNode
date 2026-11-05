import fs from 'fs'
import path from 'path';
import trataErros from './erros/funcoesErro.js';
import { contaPalavras } from './index.js';
import { montaSaidaArquivo } from './helpers.js';
import { Command } from 'commander';
import chalk from 'chalk';
//https://www.npmjs.com/package/chalk?activeTab=readme

//const fs = require('fs');
//const trataErros = require('./erros/funcoesErro')

const program = new Command();
/* const caminhoArquivo = process.argv;
const link = caminhoArquivo[2];
const endereco = caminhoArquivo[3]
console.log('Endereço:', endereco)
 */

console.info(chalk.blueBright('Bem vindo ao Contador de Palavras!'));
program
    .version('0.0.63')
    .option('-t, --texto <string>', 'Caminho do texto a ser processado')
    .option('-d, --destino <string>', 'Caminho da pasta onde salvar o arquivo de resultados')
    .action(async(options) => {
        const { texto, destino } = options;
        if (!texto || !destino) {
            console.error('Erro: Favor inserir caminho de origem e destino');
            program.help();
            return;
        }
        try {
            const caminhoTexto = path.resolve(texto);
            const caminhoDestino = path.resolve(destino);
            console.info(`Texto processado com sucesso: ${chalk.blueBright(caminhoTexto)} ${chalk.green('e')} ${chalk.cyan(caminhoDestino)}`);
            processaArquivo(caminhoTexto, caminhoDestino)
        } catch (erro) {
            console.log('Ocorreu erro no processamento', erro);
        }
    });


program.parseAsync();


async function criaESalvaArquivo_01(listaPalavras, endereco) {
    const arquivoNovo = `${endereco}/resultado.txt`;
    const textoPalavras = montaSaidaArquivo(listaPalavras);
    try {
        await fs.promises.writeFile(arquivoNovo, textoPalavras);
        console.info('Arquivo criado com Sucesso')
    } catch (error) {
        console.info('erro aqui: ', error)
        throw error;
    }
}

function criaESalvaArquivo(listaPalavras, endereco) {
    const arquivoNovo = `${endereco}/resultado.txt`;
    const textoPalavras = JSON.stringify(listaPalavras);

    return fs.promises.writeFile(arquivoNovo, textoPalavras)
        .then(() => {
            console.log('Arquivo criado')
        })        
        .finally(() => console.info('Finalizou!'))
}


function paraTxt(listaPalavras) {
    return listaPalavras
        .map((paragrafo, i) => {
            const linhas = Object.entries(paragrafo)
                .map(([palavra, qtd]) => `  ${palavra}: ${qtd}`)
                .join('\n');
            return `Parágrafo ${i + 1}\n${linhas}`;
        })
        .join('\n\n');
}

function paraCsv(listaPalavras) {
    const linhas = ['paragrafo;palavra;quantidade'];
    listaPalavras.forEach((paragrafo, i) => {
        Object.entries(paragrafo).forEach(([palavra, qtd]) => {
            linhas.push(`${i + 1};${palavra};${qtd}`);
        });
    });
    return linhas.join('\n');
}

function escapaXml(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function paraXml(listaPalavras) {
    const paragrafos = listaPalavras.map((paragrafo, i) => {
        const palavras = Object.entries(paragrafo)
            .map(([palavra, qtd]) => `    <palavra nome="${escapaXml(palavra)}" quantidade="${qtd}"/>`)
            .join('\n');
        return `  <paragrafo numero="${i + 1}">\n${palavras}\n  </paragrafo>`;
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n<resultado>\n${paragrafos.join('\n')}\n</resultado>`;
}

async function salvarSequencial2(listaPalavras, pasta) {
    try {
        await fs.promises.writeFile(`${pasta}/resultado.txt`, paraTxt(listaPalavras));
        await fs.promises.writeFile(`${pasta}/resultado.csv`, paraCsv(listaPalavras));
        await fs.promises.writeFile(`${pasta}/resultado.xml`, paraXml(listaPalavras));
        console.info('Feito')
    } catch (erro) {
        trataErros(erro)
    }
}


async function salvaSequencial(listaPalavras, pasta) {
    try {
        await fs.promises.writeFile(`${pasta}/resultado.txt`, paraTxt(listaPalavras));
        await fs.promises.writeFile(`${pasta}/resultado.csv`, paraCsv(listaPalavras));
        await fs.promises.writeFile(`${pasta}/resultado.json`, JSON.stringify(listaPalavras, null, 2));
        await fs.promises.writeFile(`${pasta}/resultado.xml`, paraXml(listaPalavras));
        console.info('[Sequencial] Todos os arquivos criados com sucesso');
    } catch (erro) {
        trataErros(erro);
    }
}

async function salvaParalelo(listaPalavras, pasta) {
    try {
        await Promise.all([
            fs.promises.writeFile(`${pasta}/resultado.txt`, paraTxt(listaPalavras)),
            fs.promises.writeFile(`${pasta}/resultado.csv`, paraCsv(listaPalavras)),
            fs.promises.writeFile(`${pasta}/resultado.json`, JSON.stringify(listaPalavras, null, 2)),
            fs.promises.writeFile(`${pasta}/resultado.xml`, paraXml(listaPalavras)),
        ]);
        console.info('[Paralelo] Todos os arquivos criados com sucesso');
    } catch (erro) {
        trataErros(erro);
    }
}

async function salvaParalelo2(listaPalavras, pasta) {
    try {
        await Promise.all([
            fs.promises.writeFile(`${pasta}/resultado.txt`, paraTxt(listaPalavras)),
            fs.promises.writeFile(`${pasta}/resultado.csv`, paraCsv(listaPalavras)),
            fs.promises.writeFile(`${pasta}/resultado.dsv`, paraCsv(listaPalavras)),
        ]);
        console.info('[Paralelo] Todos os arquivos criados com sucesso');
    } catch (erro) {
        trataErros(erro)
    }
}

async function salvaParaleloComStatus(listaPalavras, pasta) {
    const formatos = ['txt', 'csv', 'json', 'xml'];
    const resultados = await Promise.allSettled([
        fs.promises.writeFile(`${pasta}/resultado.txt`, paraTxt(listaPalavras)),
        fs.promises.writeFile(`${pasta}/resultado.csv`, paraCsv(listaPalavras)),
        fs.promises.writeFile(`${pasta}/resultado.json`, JSON.stringify(listaPalavras, null, 2)),
        fs.promises.writeFile(`${pasta}/resultado.xml`, paraXml(listaPalavras)),
    ]);

    resultados.forEach((r, i) => {
        if (r.status === 'fulfilled') console.info(`${formatos[i]}: OK`);
        else console.error(`${formatos[i]}: falhou - ${r.reason.message}`);
    });
    console.info('[AllSettled] Processo finalizado');
}


function processaArquivo(texto, destino) {
    console.log('-'.repeat(80));
    console.log('Escolha: original | sequencial | paralelo | status')
    const modoSalvar = 'original';
    fs.readFile(texto, 'utf-8', async (erro, texto) => {
        try {
            if (erro) throw erro;
            const resultado = contaPalavras(texto);
            if (modoSalvar === 'original') await criaESalvaArquivo(resultado, destino);
            if (modoSalvar === 'sequencial') await salvaSequencial(resultado, destino);
            if (modoSalvar === 'paralelo') await salvaParalelo(resultado, destino);
            if (modoSalvar === 'status') await salvaParaleloComStatus(resultado, destino);
        } catch (erro) {
            trataErros(erro);
        }

    });
}
