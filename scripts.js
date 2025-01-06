const hostname = location.hostname;
const port = location.port;
const user = getUserLogado();
var jnid = getJNID();

let x = "";

function getJNID() {

    let JSESSIONID = document.cookie.split('; ').find(row => row.startsWith('JSESSIONID=')).split('=')[1];
    JSESSIONID = JSESSIONID.split('.');
    JSESSIONID = JSESSIONID[0];
    return JSESSIONID;

}

function getUserLogado() {

    let userLogado = document.cookie.split('; ').find(row => row.startsWith('userIDLogado=')).split('=')[1];
    return userLogado;

}

function IniciarApp(){
    initHtml();
}

function gerarSeletorMeses(id = "mes", label = "Mês:", classe = "form-select") {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    let html = `<div class="col-md-4 mb-4">`;
    html += `<label for="${id}" class="form-label">${label}</label>`;
    html += `<select id="${id}" class="${classe}">`;

    meses.forEach((mes, index) => {
        html += `<option value="${index + 1}">${mes}</option>`;
    });

    html += `</select>`;
    html += `</div>`;
    return html;
}

function gerarSeletorAnos(id = "ano", label = "Ano:", classe = "form-select", inicio = new Date().getFullYear() - 1, fim = new Date().getFullYear() + 1) {
    let html = `<div class="col-md-4 mb-4">`;
    html += `<label for="${id}" class="form-label">${label}</label>`;
    html += `<select id="${id}" class="${classe}">`;

    for (let ano = inicio; ano <= fim; ano++) {
        html += `<option value="${ano}">${ano}</option>`;
    }

    html += `</select>`;
    html += `</div>`;
    return html;
}

function gerarRegionais(){
    let html = `<div class="col-md-4">`;
    html += `<label class="form-label d-block">Regionais:</label>`;

    const regionais = [
        { id: 1, nome: "Regional 1" },
        { id: 2, nome: "Regional 2" },
        { id: 3, nome: "Regional 3" }
    ];
    
    regionais.forEach(regional => {
        html += `<div class="form-check">`;
        html += `<input type="checkbox" class="form-check-input" id="${regional.id}" name="${regional.id}" value="${regional.valor}">`;
        html += `<label class="form-check-label" for="${regional.id}">${regional.nome}</label>`;
        html += `</div>`;
    });

    html += `</div>`;
    return html;
}

function gerarBotaoFiltrar(){
    return `
        <div class="row">
            <div class="col text-center">
                <button id="filterButton" class="btn btn-primary">Filtrar</button>
            </div>
        </div>`;
}

function gerarAbas(){
    const abas = [
        {id: "geral", nome: "Geral"},
        {id: "departamento", nome: "Departamento"},
        {id: "contas", nome: "Contas a Pagar"},
        {id: "saldos", nome: "Saldos de Pedido" },
        {id: "compras", nome: "Compras Devolução" }
    ];

    let html = `<ul class="nav nav-tabs" id="resultTabs" role="tablist">`;
    abas.forEach((aba, index) => {
        html += `
           <li class="nav-item" role="presentation">
                <button class="nav-link ${index === 0 ? "active" : ""}" id="${aba.id}-tab" data-bs-toggle="tab" data-bs-target="#${aba.id}-table" type="button" role="tab">
                    ${aba.nome}
                </button>
            </li>`;
    });
    html += `</ul>`;
    return html;
}

function gerarTabela(id, colunas) {
    let html = `<div class="tab-pane fade ${id === "geral" ? "show active" : ""}" id="${id}-table" role="tabpanel">`;
    html += `<div style="max-height: 400px; overflow-y: auto;">`;
    html += `<table class="table table-striped">`;
    html += `<thead><tr>`;
    colunas.forEach(coluna => {
        html += `<th>${coluna}</th>`;
    });
    html += `</tr></thead>`;
    html += `<tbody id="body-${id}-table"></tbody>`;
    html += `</table>`;
    html += `</div>`; // Fechando o div de rolagem
    html += `</div>`;
    return html;
}



function gerarTabelas(mesSelecionado) {
    const colunasGeral = ["TIPO"];
    for (let i = 0; i < 12; i++) {
        const mesAtual = ((mesSelecionado + i) % 12) + 1;
        colunasGeral.push(mesExtension2(mesAtual));
    }
    const tabelas = [
        { id: "geral", colunas: colunasGeral},
        { id: "departamento", colunas: ["Departamento"] }
        // { id: "contas", colunas: ["Contas a Pagar"] },
        // { id: "saldos", colunas: ["Saldos de Pedido"] },
        // { id: "compras", colunas: ["Compras Devolução"] }
    ];

    let html = `<div class="tab-content mt-3">`;
    tabelas.forEach(tabela => {
        html += gerarTabela(tabela.id, tabela.colunas);
    });
    html += `</div>`;
    return html;
}


function initHtml() {
    let filtro = $('#inicio');
    filtro.empty();  

    let html = `<div class="container mt-5">`;
        html += `<div class="row justify-content-center">`;
        html += `<div class="col-lg-8 col-md-10 p-4 bg-light rounded shadow-sm">`;
        // Filtros

        html += `<div class="row mb-3">`;

        // Seleção de mês
        html += gerarSeletorMeses();
     
         // Seleção de ano
        html += gerarSeletorAnos();

        // Regionais
        html += gerarRegionais();
        html += `</div>`; // Fecha filtros

        // Botão de filtrar
        html += gerarBotaoFiltrar();

        html += `</div>`; // Fecha coluna central
        html += `</div>`; // Fecha linha
        html += `</div>`; // Fecha container

       

        //Componente de resultado
        html += `<div class="container mt-3" id="resultContainer" style="display: none;">`;

        // Abas
        html += gerarAbas();

        // Tabela Geral
        html += gerarTabelas(x);
        html += `</div>`;
     


    filtro.append(html);


    //Adiociona botão de ação
    document.getElementById('filterButton').addEventListener('click', BotaoAcao);
    

}


function BotaoAcao() {
    // Obter os valores do seletor de mês e ano pelos IDs padrão definidos nas funções de geração
    const mesSelecionado = parseInt($("#mes").val()); // ID padrão do seletor de meses
    const anoSelecionado = parseInt($("#ano").val()); // ID padrão do seletor de anos
    x = mesSelecionado


    if (isNaN(mesSelecionado) || isNaN(anoSelecionado)) {
        alert("Por favor, selecione um mês e um ano válidos.");
        return;
    }

    // Chamar a função buscaDeTabelaGeral com os valores de ano e mês
    const resultados = buscaDeTabelaGeral(anoSelecionado, mesSelecionado);

    // Verificar se a tabela existe
    const tabelaGeral = document.getElementById("body-geral-table");


    if (!tabelaGeral) {
        console.error("Tabela geral não encontrada!");
        return;
    }

    // Limpar o corpo da tabela antes de inserir novos dados
    tabelaGeral.innerHTML = "";

    // Preencher a tabela com os dados retornados
    resultados.forEach(resultado => {
        const linha = document.createElement("tr");

        // Adicionar cada elemento da lista como uma célula na linha
        resultado.forEach(celula => {
            const td = document.createElement("td");

            if(typeof celula === 'number') {
                td.textContent = formatarMoeda(celula);

                if (celula < 0) {
                    td.style.backgroundColor = "red";
                    td.style.color = "white";
                }
            }else{
                td.textContent = celula;
            }        
            linha.appendChild(td);
        });

        tabelaGeral.appendChild(linha);
    });

    // Exibir o container de resultados, caso esteja oculto
    const resultContainer = document.getElementById("resultContainer");
    if (resultContainer) {
        resultContainer.style.display = "block";
    }
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}




function buscaDeTabelaGeral(ano, mes){
    let anoPassado = Number(ano) - 1;
    let anoFuturo = Number(ano) + 1;

    let sql = ` WITH INTERNO AS (
                SELECT  'CONTAS A PAGAR' AS TIPO,` ;	
        sql +=  generateSumCases(mes, ano);
        sql += `, 'ANO' AS ANO
                FROM TGFFIN fin
                LEFT JOIN TGFCAB cab ON (fin.NUNOTA = cab.NUNOTA) 
                WHERE 	fin.CODNAT in (120103,120101) AND  	fin.RECDESP 	= -1 
        AND  	fin.PROVISAO 	= 'N' `;

        sql += `UNION ALL  `;

        sql += `SELECT 	'SALDO EM TRANSITO' as TIPO, `;
        sql +=  generateSumCases(mes, ano);
        sql += `, 'ANO' 	as ANO `;
        sql += ` FROM TGFFIN fin `;
        sql += ` INNER JOIN TGFCAB cab ON (fin.NUNOTA = cab.NUNOTA) `;
        sql += ` WHERE fin.CODTIPOPER in ( 1000, 1500, 1502, 1528)`;
        sql += ` AND cab.STATUSNOTA = 'L' `;
        sql += ` AND fin.NUNOTA NOT IN `;
        sql += ` ( `;
        sql += ` SELECT 	f.NUNOTA `;
        sql += ` FROM TGFFIN f  `;
        sql += ` INNER JOIN TGFCAB c ON (f.NUNOTA = c.NUNOTA) `;
        sql += ` INNER JOIN TGFPAR p ON (p.CODPARC = c.CODPARC) `;
        sql += ` INNER JOIN ( `;
        sql += ` SELECT f2.NUNOTA, COUNT(*) AS QTDBX `;
        sql += ` FROM TGFFIN f2 `;
        sql += ` WHERE f2.VLRBAIXA > 0 `;
        sql += ` AND MONTH(f2.DTVENC) in (1,2,3,4,5,6,7,8,9,10,11,12)`;
        sql += ` AND YEAR(f2.DTVENC) 	in (${ano}, ${anoPassado}, ${anoFuturo} )`;
        sql += ` AND f2.RECDESP 		= -1`;
        sql += ` AND f2.PROVISAO 		= 'S'`;
        sql += ` GROUP BY f2.NUNOTA) bx on (bx.NUNOTA = c.NUNOTA)`;
        sql += ` WHERE f.CODTIPOPER IN (1500, 1502, 1528)`;
        sql += ` AND f.PROVISAO = 'S'`;
        sql += ` AND c.PENDENTE = 'S'`;
        sql += ` AND MONTH(f.DTVENC)  in (1,2,3,4,5,6,7,8,9,10,11,12)`;
        sql += ` AND YEAR(f.DTVENC) 	in (${ano}, ${anoPassado}, ${anoFuturo} )`;
        sql += ` ) `;
        sql += ` AND cab.PENDENTE = 'S'`;
        sql += ` AND MONTH(fin.DTVENC) in (1,2,3,4,5,6,7,8,9,10,11,12)`;
        sql += ` AND YEAR(fin.DTVENC) 	in ( ${ano}, ${anoPassado}, ${anoFuturo} )`;
        sql += ` GROUP BY YEAR(fin.DTVENC) `;

        sql += ` UNION ALL `;

        sql += ` SELECT 	'SALDO DE PEDIDO' as TIPO, `;
        sql +=  generateSumCases2(mes, ano);
        sql += `, 'ANO' 	as ANO `;
        sql += ` FROM TGFFIN fin `;
        sql += ` INNER JOIN TGFCAB cab ON (fin.NUNOTA = cab.NUNOTA) `;
        sql += ` INNER JOIN (select NUNOTA, COUNT(*) AS QTDBX  from TGFFIN f `;
        sql += ` WHERE f.VLRBAIXA > 0 `;
        sql += ` AND MONTH(f.DTVENC) in (1,2,3,4,5,6,7,8,9,10,11,12) `;
        sql += ` AND YEAR(f.DTVENC) 	in (${ano}, ${anoPassado}, ${anoFuturo} )`;
        sql += ` AND f.RECDESP 		= -1 `;
        sql += ` AND f.PROVISAO 		= 'S' `;
        sql += ` group by NUNOTA) bx on (bx.NUNOTA = cab.NUNOTA) `;
        sql += ` WHERE fin.CODTIPOPER IN (1500, 1502, 1528)  `;
        sql += ` AND fin.PROVISAO = 'S' `;
        sql += ` AND cab.PENDENTE = 'S' `;
        sql += ` AND MONTH(fin.DTVENC)  in (1,2,3,4,5,6,7,8,9,10,11,12) `;
        sql += ` AND YEAR(fin.DTVENC)  in (${ano}, ${anoPassado}, ${anoFuturo} ) `;
        sql += ` )`;

        sql += ` SELECT 'VERBA' as TIPO, `;
        sql += generateSumCases3(mes, ano);

        sql += ", 'ANO' as ANO FROM AD_ORCAMENTOCOMPRAS oc ";
       
        sql += "UNION ALL ";

        sql += "SELECT 'CONTAS A PAGAR' as TIPO, ";

        sql += generateSumCases8(mes, ano);

        sql += "'ANO' as ANO ";
        sql += "FROM TGFFIN fin ";
        sql += "LEFT JOIN TGFCAB cab ON (fin.NUNOTA = cab.NUNOTA) ";
        sql += "WHERE fin.CODNAT in (120103, 120101) ";
        sql += "AND fin.RECDESP = -1 ";
        sql += "AND fin.PROVISAO = 'N' ";
        sql += "AND MONTH(fin.DTVENC) in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12) ";
        sql += `AND YEAR(fin.DTVENC) in (${ano}, ${anoPassado}, ${anoFuturo}) `;
        sql += " UNION ALL ";

        sql += " SELECT 'SALDO EM TRANSITO' as TIPO, ";

        sql += generateSumCases9(mes, ano);

        sql += "'ANO' as ANO ";
        sql += "FROM TGFFIN fin ";
        sql += "INNER JOIN TGFCAB cab ON (fin.NUNOTA = cab.NUNOTA) ";
        sql += "WHERE fin.CODTIPOPER in (1000, 1500, 1502, 1528) ";
        sql += "AND cab.STATUSNOTA = 'L' ";
        sql += "AND fin.NUNOTA NOT IN ( ";
        sql += "    SELECT f.NUNOTA ";
        sql += "    FROM TGFFIN f ";
        sql += "    INNER JOIN TGFCAB c ON (f.NUNOTA = c.NUNOTA) ";
        sql += "    INNER JOIN TGFPAR p ON (p.CODPARC = c.CODPARC) ";
        sql += "    INNER JOIN ( ";
        sql += "        SELECT f2.NUNOTA, COUNT(*) AS QTDBX ";
        sql += "        FROM TGFFIN f2 ";
        sql += "        WHERE f2.VLRBAIXA > 0 ";
        sql += "        AND MONTH(f2.DTVENC) in (1,2,3,4,5,6,7,8,9,10,11,12) ";
        sql += `        AND YEAR(f2.DTVENC) in (${ano}, ${anoPassado}, ${anoFuturo}) `;
        sql += "        AND f2.RECDESP = -1 ";
        sql += "        AND f2.PROVISAO = 'S' ";
        sql += "        GROUP BY f2.NUNOTA ";
        sql += "    ) bx ON (bx.NUNOTA = c.NUNOTA) ";
        sql += "    WHERE f.CODTIPOPER IN (1500, 1502, 1528) ";
        sql += "    AND f.PROVISAO = 'S' ";
        sql += "    AND c.PENDENTE = 'S' ";
        sql += "    AND MONTH(f.DTVENC) in (1,2,3,4,5,6,7,8,9,10,11,12) ";
        sql += `    AND YEAR(f.DTVENC) in (${ano}, ${anoPassado}, ${anoFuturo}) `;
        sql += " ) ";
        sql += " AND cab.PENDENTE = 'S' ";
        sql += " AND MONTH(fin.DTVENC) in (1,2,3,4,5,6,7,8,9,10,11,12) ";
        sql += ` AND YEAR(fin.DTVENC) in (${ano}, ${anoPassado}, ${anoFuturo}) `;
        sql += " GROUP BY YEAR(fin.DTVENC)";

        sql += " UNION ALL ";

        sql += " SELECT 'VERBA DISPONIVEL' AS TIPO,";


        sql += generateSumCases10(mes, ano);
      
        sql += "'ANO' as ANO  FROM INTERNO";
               

        let lista = getDadosSql(sql);
         
        return lista;
}


function generateSumCases(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano); // Garantindo que o ano seja numérico
    let Numeromes = Number(mes); // Garantindo que o mês seja numérico
    // console.log('numericYear', Numeroano);
    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i); //% 12;
        if (mesof > 12) {
            mesof -= 12;
        }
        cases += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${mesof} AND YEAR(fin.DTVENC) = ${Numeroano} THEN fin.VLRDESDOB ELSE 0 END) as ${mesExtension(mesof)},`;
      
        if (mesof == 12) {
            Numeroano++;
        }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases2(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano); // Garantindo que o ano seja numérico
    let Numeromes = Number(mes); // Garantindo que o mês seja numérico

    for (let i = 0; i < 12; i++) {
      let mesof = (Numeromes + i); 
      if (mesof > 12) {
          mesof -= 12;
      }

      cases += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${mesof} AND fin.VLRBAIXA = 0 AND YEAR(fin.DTVENC) = ${Numeroano} THEN fin.VLRDESDOB ELSE 0 END) as ${mesExtension(mesof)},`;
    
      if (mesof == 12) {
        Numeroano++;
    }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases3(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano); // Garantindo que o ano seja numérico
    let Numeromes = Number(mes);
    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i); //% 12;
        if (mesof > 12) {
            mesof -= 12;
        }
        cases += `SUM(CASE WHEN oc.MES = ${mesof} AND oc.ANO = ${Numeroano} THEN oc.VALOR ELSE 0 END) as ${mesExtension(mesof)},`;
        if (mesof == 12) {
            Numeroano++;
        }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases4(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano); // Garantindo que o ano seja numérico
    let Numeromes = Number(mes);
    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i); //% 12;
        if (mesof > 12) {
            mesof -= 12;
        }
        cases += `SUM(CASE WHEN am.MES = ${mesof} AND am.ANO = ${Numeroano} THEN am.valor else 0 END) as  ${mesExtension(mesof)},`;
        if (mesof == 12) {
            Numeroano++;
        }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases5(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano); // Garantindo que o ano seja numérico
    let Numeromes = Number(mes);
    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i); //% 12;
        if (mesof > 12) {
            mesof -= 12;
        }
      cases += `SUM(CASE WHEN am.MES = ${mesof} AND am.ANO = ${Numeroano} THEN am.valor * -1 else 0 END) as  ${mesExtension(mesof)},`;
      if (mesof == 12) {
        Numeroano++;
    }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases6(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano); // Garantindo que o ano seja numérico
    let Numeromes = Number(mes);
    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i); //% 12;
        if (mesof > 12) {
            mesof -= 12;
        }

      cases += `${mesExtension(mesof)},`;
      if (mesof == 12) {
        Numeroano++;
      }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases7(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano);
    let Numeromes = Number(mes);
    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i); //% 12;
        if (mesof > 12) {
            mesof -= 12;
        }
        cases += `SUM(${mesExtension(mesof)}) as ${mesExtension(currentMonth)},`;
        if (mesof == 12) {
            Numeroano++;
        }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases8(mes, ano) {
    let cases = "";
    let Numeroano = Number(ano);
    let Numeromes = Number(mes);

    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i); //% 12;
        if (mesof > 12) {
            mesof -= 12;
        }
        cases += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${mesof} AND YEAR(fin.DTVENC) = ${Numeroano} THEN fin.VLRDESDOB ELSE 0 END) `;
        cases += `as ${mesExtension(mesof)}, `;
        if (mesof == 12) {
           Numeroano++;
        } 
    }
    return cases.slice(0, -1);
}

function generateSumCases9(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano);
    let Numeromes = Number(mes);
    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i);
        if (mesof > 12) {
            mesof -= 12;
        }
        cases += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${mesof} AND YEAR(fin.DTVENC) = ${Numeroano} THEN fin.VLRDESDOB ELSE 0 END) `;
        cases += `as ${mesExtension(mesof)}, `;

        if (mesof == 12) {
            Numeroano++;
        }
    }
    return cases.slice(0, -1); 
}

function generateSumCases10(mes, ano) {
    let cases = '';
    let Numeroano = Number(ano); // Garantindo que o ano seja numérico
    let Numeromes = Number(mes); // Garantindo que o mês seja numérico
    // console.log('numericYear', Numeroano);
    for (let i = 0; i < 12; i++) {
        let mesof = (Numeromes + i); //% 12;
        if (mesof > 12) {
            mesof -= 12;
        }
        cases += `ROUND((SELECT SUM(CASE WHEN oc.MES = ${mesof} AND oc.ANO = ${Numeroano} THEN oc.VALOR ELSE 0 END) `;
        cases += `FROM AD_ORCAMENTOCOMPRAS oc) - SUM(${mesExtension(mesof)}), 2) as ${mesExtension(mesof)}, `;

        if (mesof == 12) {
            Numeroano++;
        }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function mesExtension(month) {
    const meses = {
        1: 'JAN',
        2: 'FEV',
        3: 'MAR',
        4: 'ABR',
        5: 'MAI',
        6: 'JUN',
        7: 'JUL',
        8: 'AGO',
        9: 'SETE',
        10: 'OUT',
        11: 'NOV',
        12: 'DEZ'
    };
    return meses[month] || '';
}

function mesExtension2(month) {
    const meses = {
        1: 'JANEIRO',
        2: 'FEVEREIRO',
        3: 'MARCO',
        4: 'ABRIL',
        5: 'MAIO',
        6: 'JUNHO',
        7: 'JULHO',
        8: 'AGOSTO',
        9: 'SETEMBRO',
        10: 'OUTUBRO ',
        11: 'NOVEMBRO',
        12: 'DEZEEMBRO'
    };
    return meses[month] || '';
}