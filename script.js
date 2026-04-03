/* 
    Calculadora de Imposto de Renda para 2025, declaração em 2026.
    01/04/2026 - Arthur M.
*/

const main = document.getElementById("main");
let returnBox = document.getElementById("return");

function inssDiscount(salary){
    let totalINSS = 0

    // tabela progressiva do INSS 
    // fonte: https://www.gov.br/inss/pt-br/noticias/confira-como-ficaram-as-aliquotas-de-contribuicao-ao-inss
    const inssBracket = [
        {start: 0, end: 1518, tax: 0.075},
        {start: 1518.01, end: 2666.68, tax: 0.09},
        {start: 2666.69, end: 4000.03, tax: 0.12},
        {start: 4000.04, end: 7786.02, tax: 0.14}
    ];

    // console.log(inssBracket.length)
    
    console.log(salary);

    // faz umas magias de computador
    for(i = 0; i < inssBracket.length; i++){
        // diz em que parte da tabela está
        let odio = inssBracket[i];
        // se o salario for menor que o salario minimo pedido na tabela continua o codigo
        if(salary <= odio.start) continue;
        /*
        calcula o quanto sera taxado da seguinte forma:
        vê qual menor, o salario ou maximo da tabela
        pega o menor e subtrai pelo valor inicial daquela parte da tabela
        */
        let taxable = Math.min(salary, odio.end) - odio.start;
        // aplica a taxa no que será taxado; sobra nada nunca
        totalINSS += taxable * odio.tax;
        // se o salario for menor que o maximo da tabela, acaba aqui
        if (salary <= odio.end) break;
    }
    console.log(totalINSS);
    return totalINSS;
}

document.getElementById("submit").onclick = function(){
    if(returnBox.firstChild != null){
        returnBox.firstChild.remove();
    }
    // checa se o salario colocado é "aceitável"
    let salary = parseFloat(document.getElementById("salary").value);

    // dep são os dependentes
    let dep = parseInt(document.getElementById("dep").value);
    
    // chama a função para calcular o desconto do INSS
    let inss_discount = inssDiscount(salary);

    // calcula a base do imposto, com todas reduções mais comuns
    let baseCalc = (salary - inss_discount - (dep * 189.59));
    
    if(isNaN(salary) || isNaN(dep)){
        returnBox.append("digite apenas numeros!");
        return;
    }

    // tabela progressiva do imposto de renda de 2025, para declaracão em 2026, a partir de maio de 2025
    // fonte: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2025
    const irBracket = [
        {start: 0, end: 2428.80, tax: 0, redux: 0},
        {start: 2428.81, end: 2826.65, tax: 0.075, reduce: 182.16},
        {start: 2826.66, end: 3751.05, tax: 0.15, reduce: 394.16},
        {start: 3751.06, end: 4664.68, tax: 0.225, reduce: 675.49},
        {start: 4664.69, end: Infinity, tax: 0.275, reduce: 908.73}
    ];

    // procura no array "irBracket" a parte que tem os seguintes requisitos:
    // a base do calculo ser maior que o valor na tabela minimo, a base do calculo ser menor que o valor maximo na tabela
    let finalBracket = irBracket.find((base) => baseCalc >= base.start && baseCalc <= base.end);
    console.log(finalBracket);
    // checa se o imposto é isento ou não
    if(finalBracket.start === 0){
        returnBox.append(`INSS: ${inss_discount.toFixed(2)}, IR: isento :D`);
    } else{
        console.log(finalBracket);
        /*
        calculo final do imposto.
        baseCalc = salario menos deduções do inss menos deduções por dependente.
        finalBracket.tax recebe a parte correta da tabela e encontra a taxa.
        multiplicam-se a base de calculo e a taxa.
        finalBracket.reduce recebe o tanto a reduzir no imposto final, conforme a tabela.
        após multiplicar, subtraímos o valor a ser reduzido na tabela
        */
        let totalIR = (baseCalc * finalBracket.tax) - finalBracket.reduce;

        // coloca essa bosta na tela 
        returnBox.append(`INSS: ${inss_discount.toFixed(2)}, IR: ${totalIR.toFixed(2)}`);
    }   
}