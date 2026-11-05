import {ok} from "assert";

function verificaParidade(numero){
    if (numero% 2 == 0){
        return true;
    } else {
        return false;
    }
}

ok(verificaParidade(2), 'O número deveria ser par');
ok(verificaParidade(4), 'O número deveria ser par');
ok(verificaParidade(5), 'O número deveria ser par');
ok(verificaParidade(6), 'O número deveria ser par');