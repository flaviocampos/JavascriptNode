/* process.stdout.write('\x1Bc');
console.clear();
console.log('-'.repeat(80)); */

// npm ini -y -> cria arquivo package.json -> ficha de identidade do proejto


export function contaPalavras(texto) {
    const paragrafos = extraiParagrafos(texto)
    const contagem = paragrafos
        .filter((paragrafo) => paragrafo)
        .map((paragrafo) => {
            return verificarPalavrasDuplicadas(paragrafo);
        })
    //console.log(contagem)
    return contagem;
}
function extraiParagrafos(texto) {
    return texto.toLowerCase().split('\n');
}


function quebraEmParagrafosV2(texto) {
    const paragrafos = texto.toLowerCase().split('\n')
    const contagem = paragrafos.flatMap((paragrafo) => {
        if (!paragrafo) return [];
        return verificarPalavrasDuplicadas(paragrafo);
    })

    console.log(contagem)
}
function limpaPalavras(palavra) {
    return palavra.replace(/[.,\/#!$%^&\*;:{}=\-_`~()]/g, '')
}

function verificarPalavrasDuplicadas(texto) {
    const listaPalavras = texto.split(' ');
    const resultado = {};
    listaPalavras.forEach(palavra => {
        if (palavra.length >= 3) {
            const palavraLimpa = limpaPalavras(palavra)
            resultado[palavraLimpa] = (resultado[palavraLimpa] || 0) + 1
        }
    })
    return resultado;
}
function reduzir() {
    const numeros = [1, 2, 3, 4, 5];
    const resultado = numeros.reduce((acum, atual) => acum + atual, 0)
    console.log(`Resultador reduce? ${resultado}`)
}

function reduzirPalavras() {
    const paragrafos = ["código", "js", "", "web", "", "array"];

    const result = paragrafos.reduce((acum, paragrafo) => {
        console.info(`- Acumuldado:  ${acum} -> ${paragrafo}`); // somente para ver funcionamento
        if (paragrafo) {
            return [...acum, paragrafo];
        }
        return acum;
    }, []);


    console.log(`Resultado reduzir palavras: ${result}`)
}

// ------------------------------------------------------------------

if (false) {
    process.argv.forEach((val, index) => {
        console.log(`${index}: ${val}`);
    });
}

if (false) {
    console.log('-'.repeat(80));
    fs.readFile(link, 'utf-8', (erro, texto) => {
        if (erro) {
            console.log('qual é erro:', erro)
            return
        }
        contaPalavras(texto)
    });
}


if (false) {
    try {
        console.log(nome)
    } catch (erro) {
        console.log(`O nome do erro é: ${erro.name}`)
        console.log(`O nome do erro é: ${erro.code}`)
        console.log(`A mensagem de erro é: ${erro.message}`)
        console.log(`A stack do erro é: ${erro.stack}`)
    }
}

if (false) {
    try {
        fs.readFileSync('arquivos/texto-web', 'utf-8');   // sem .txt → não existe
    } catch (erro) {
        console.log(`Código: ${erro.code}`)        // ENOENT
        console.log(`dest: ${erro.dest}`)    // open
        console.log(`É SystemError? ${erro.syscall !== undefined}`) // 
        console.log(`Errno: ${erro.errno}`)        // -4058 no Windows
        console.log(`Nome: ${erro.name}`)          // Error
        console.log(`Path: ${erro.path}`)          // arquivos/texto-web
        console.log(`Syscall: ${erro.syscall}`)    // open
    }
}






/* console.log('-'.repeat(80));
reduzir();
reduzirPalavras();
console.log('-'.repeat(80)); */

