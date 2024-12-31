const hostname = location.hostname;
const port = location.port;
const user = getUserLogado();
var jnid = getJNID();

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

function initHtml() {
    let filtro = $('#inicio');
    filtro.empty();  

    let html = `<div class="container mt-5">`;
        html += `<div class="row justify-content-center">`;
        html += `<div class="col-lg-8 col-md-10 p-4 bg-light rounded shadow-sm">`;
        // Filtros

        html += `<div class="row mb-3">`;

        // Seleção de mês
        html += `<div class="col-md-4 mb-4">`;
        html += `<label for="mes" class="form-label" >Mes:</label>`;
        html += `<select id="mes" class="form-select">`;
        html += `<option value="1">Janeiro</option>`;
        html += `<option value="2">Fevereiro</option>`;
        html += `<option value="3">Marco</option>`;
        html += `<option value="4">Abril</option>`;
        html += `<option value="5">Maio</option>`;
        html += `<option value="6">Junho</option>`;
        html += `<option value="7">Julho</option>`;
        html += `<option value="8">Agosto</option>`;
        html += `<option value="9">Setembro</option>`;
        html += `<option value="10">Outubro</option>`;
        html += `<option value="11">Novembro</option>`;
        html += `<option value="12">Dezembro</option>`;
        html += `</select>`;
        html += `</div>`;
     
         // Seleção de ano
        html += `<div class="col-md-4 mb-4">`;
        html += `<label for="ano" class="form-label">Ano:</label>`;
        html += `<select id="ano" class="form-select">`;
        html += `</select>`;
        html += `</div>`;

        // Regionais
        html += `<div class="col-md-4">`;
        html += `<label class="form-label d-block">Regionais:</label>`;

        html += `<div class="form-check">`;
        html += `<input type="checkbox" class="form-check-input" id="regional1" name="regional1" value="1">`;
        html += `<label class="form-check-label" for="regional1">Regional 1</label>`;
        html += `</div>`;

        html += `<div class="form-check">`;
        html += `<input type="checkbox" class="form-check-input" id="regional2" name="regional2" value="2">`;
        html += `<label class="form-check-label" for="regional2">Regional 2</label>`;
        html += `</div>`;

        html += `<div class="form-check">`;
        html += `<input type="checkbox" class="form-check-input" id="regional3" name="regional3" value="3">`;
        html += `<label class="form-check-label" for="regional3">Regional 3</label>`;
        html += `</div>`;

        html += `</div>`; // Fecha coluna de usuários
        html += `</div>`; // Fecha row

        // Botão de filtrar
        html += `<div class="row">`;
        html += `<div class="col text-center">`;
        html += `<button id="filterButton" class="btn btn-primary">Filtrar</button>`;
        html += `</div>`;   
        html += `</div>`; // Fecha row

        html += `</div>`; // Fecha coluna central
        html += `</div>`; // Fecha linha
        html += `</div>`; // Fecha container

       

        //Componente de resultado
        html += `<div class="container mt-3" id="resultContainer" style="display: none;">`;

        // Abas
        html += `<ul class="nav nav-tabs" id="resultTabs" role="tablist">`;
        html += `<li class="nav-item" role="presentation">`;
        html += `<button class="nav-link active" id="geral-tab" data-bs-toggle="tab" data-bs-target="#geral-table" type="button" role="tab">Geral</button>`;
        html += `</li>`;
        html += `<li class="nav-item" role="presentation">`;
        html += `<button class="nav-link" id="year-tab" data-bs-toggle="tab" data-bs-target="#year-table" type="button" role="tab">Departamento</button>`;
        html += `</li>`;
        html += `<li class="nav-item" role="presentation">`;
        html += `<button class="nav-link" id="regional-tab" data-bs-toggle="tab" data-bs-target="#regional-table" type="button" role="tab">Contas a Pagar</button>`;
        html += `</li>`;
        html += `<li class="nav-item" role="presentation">`;
        html += `<button class="nav-link" id="regional-tab" data-bs-toggle="tab" data-bs-target="#regional-table" type="button" role="tab">Saldos de Pedido</button>`;
        html += `</li>`;
        html += `<li class="nav-item" role="presentation">`;
        html += `<button class="nav-link" id="regional-tab" data-bs-toggle="tab" data-bs-target="#regional-table" type="button" role="tab">Compras Devolucao</button>`;
        html += `</li>`;
        html += `</ul>`;

        // Tabela Geral
        html += `<div class="tab-content mt-3">`;
        html += `<div class="tab-pane fade show active" id="geral-table" role="tabpanel">`;
        html += `<table class="table table-striped">`;
        html += `<thead>`;
        html += `<tr>`;
        html += `<th></th>`;
        html += `</tr>`;
        html += `</thead>`;
        html += `<tbody id="body-geral-table">`;
        html += `</tbody>`;
        html += `</table>`;
        html += `</div>`;



        html += `<div class="tab-pane fade" id="year-table" role="tabpanel">`;
        html += `<table class="table table-striped"><thead><tr><th>Ano</th></tr></thead><tbody id="yearResults"></tbody></table>`;
        html += `</div>`;
        html += `<div class="tab-pane fade" id="regional-table" role="tabpanel">`;
        html += `<table class="table table-striped"><thead><tr><th>Regionais</th></tr></thead><tbody id="regionalResults"></tbody></table>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`; // Fecha container de abas

        // Estilo
        html += `<style>`;
        html += `.container {`;
        html += `    max-width: 800px;`;
        html += `}`;
        html += `</style>`;


    filtro.append(html);

    // Adiciona anos dinamicamente
    const currentYear = new Date().getFullYear();
    const yearSelect = document.getElementById('ano');
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    //Adiociona botão de ação
    document.getElementById('filterButton').addEventListener('click', BotaoAcao);
    

}
function BotaoAcao() {
    const monthElement = document.getElementById('mes');
    const yearElement = document.getElementById('ano');
    const resultContainer = document.getElementById('resultContainer');

    if (!monthElement || !yearElement || !resultContainer) {
        console.error("Elementos necessários não foram encontrados no DOM.");
        return;
    }

    const month = monthElement.value;
    const year = yearElement.value;

    const regionals = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        regionals.push(checkbox.value);
    });

    const geralResults = document.getElementById('body-geral-table');
    const yearResults = document.getElementById('yearResults');
    const regionalResults = document.getElementById('regionalResults');

    if (geralResults) geralResults.innerHTML = `<tr><td>${buscaDeTabelaGeral(year, month)}</td></tr>`;
    if (yearResults) yearResults.innerHTML = `<tr><td>${year}</td></tr>`;
    if (regionalResults) {
        regionalResults.innerHTML = regionals
            .map(regional => `<tr><td>${regional}</td></tr>`)
            .join('');
    }

    resultContainer.style.display = 'block';
}






function buscaDeTabelaGeral(ano, mes){
    let anoPassado = ano - 1;
    let anoFuturo = ano + 1;
    let sql = ` WITH INTERNO AS (`;
        sql += ` SELECT  'CONTAS A PAGAR' AS TIPO,` ;	
        sql +=  generateSumCases(mes, ano);
        sql += `, 'ANO' AS ANO`;
        sql += ` FROM TGFFIN fin`;
        sql += ` LEFT JOIN TGFCAB cab ON (fin.NUNOTA = cab.NUNOTA) `;
        sql += ` WHERE 	fin.CODNAT in (120103,120101) 
        AND  	fin.RECDESP 	= -1 `;
        sql += ` AND  	fin.PROVISAO 	= 'N' `;

        sql += `UNION ALL  `;

        sql += `SELECT 	'SALDO EM TRANSITO' as TIPO, `;
        sql +=  generateSumCases(mes, ano);
        sql += `, 'YEAR(fin.DTVENC)' 	as ANO `;
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
        sql += ` AND YEAR(fin.DTVENC) 	in ( $anoAtual, $anoPassado, $anoFuturo )`;
        sql += ` GROUP BY YEAR(fin.DTVENC) `;

        sql += ` UNION ALL `;

        sql += ` SELECT 	'SALDO DE PEDIDO' as TIPO, `;
        sql +=  generateSumCases2(mes, ano);
        sql += `, 'YEAR(fin.DTVENC)' 	as ANO `;
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
        sql += ` AND YEAR(fin.DTVENC)  in ($anoAtual, $anoPassado, $anoFuturo ) `;
        sql += ` )`;

        sql += ` SELECT 'VERBA' as TIPO, `;
        sql += generateSumCases3(mes, ano);

        sql += ", 'YEAR(fin.DTVENC)' as ANO FROM AD_ORCAMENTOCOMPRAS oc ";
        sql += "UNION ALL ";
        sql += "SELECT 'CONTAS A PAGAR' as TIPO, ";

        for (let i = mes; i <= mes + 11; i++) {
            if (i <= 12) {
                sql += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${i} AND YEAR(fin.DTVENC) = ${ano} THEN fin.VLRDESDOB ELSE 0 END) `;
                sql += `as ${mesExtension(i)}, `;
            } else {
                const mes = i - 12;
                const yearOffset = ano + 1;
                sql += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${mes} AND YEAR(fin.DTVENC) = ${yearOffset} THEN fin.VLRDESDOB ELSE 0 END) `;
                sql += `as ${mesExtension(mes)}, `;
            }
        }

        sql += "'YEAR(fin.DTVENC)' as ANO ";
        sql += "FROM TGFFIN fin ";
        sql += "LEFT JOIN TGFCAB cab ON (fin.NUNOTA = cab.NUNOTA) ";
        sql += "WHERE fin.CODNAT in (120103, 120101) ";
        sql += "AND fin.RECDESP = -1 ";
        sql += "AND fin.PROVISAO = 'N' ";
        sql += "AND MONTH(fin.DTVENC) in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12) ";
        sql += `AND YEAR(fin.DTVENC) in (${ano}, ${anoPassado}, ${anoFuturo}) `;
        sql += " UNION ALL ";


        sql += " SELECT 'SALDO EM TRANSITO' as TIPO, ";
        for (let i = mes; i <= mes + 11; i++) {
            if (i <= 12) {
                sql += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${i} AND YEAR(fin.DTVENC) = ${ano} THEN fin.VLRDESDOB ELSE 0 END) `;
                sql += `as ${mesExtension(i)}, `;
            } else {
                const mes = i - 12;
                const yearOffset = ano + 1;
                sql += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${mes} AND YEAR(fin.DTVENC) = ${yearOffset} THEN fin.VLRDESDOB ELSE 0 END) `;
                sql += `as ${mesExtension(mes)}, `;
            }
        }

        
        
        sql += "'YEAR(fin.DTVENC)' as ANO ";
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
        sql += ") ";
        sql += "AND cab.PENDENTE = 'S' ";
        sql += "AND MONTH(fin.DTVENC) in (1,2,3,4,5,6,7,8,9,10,11,12) ";
        sql += `AND YEAR(fin.DTVENC) in (${ano}, ${anoPassado}, ${anoFuturo}) `;
        sql += "GROUP BY YEAR(fin.DTVENC)";

        sql += " UNION ALL ";

        sql += " SELECT 'VERBA DISPONIVEL' AS TIPO,";

        for(let i = mes; i <= mes + 11; i++) {
            if (i <= 12) {
                sql += `ROUND((SELECT SUM(CASE WHEN oc.MES = ${i} AND oc.ANO = ${ano} THEN oc.VALOR ELSE 0 END) `;
                sql += `FROM AD_ORCAMENTOCOMPRAS oc) - SUM(${mesExtension(i)}), 2) as ${mesExtension(i)}, `;
            } else {
                const mes = i - 12;
                const yearOffset = ano + 1;
                sql += `ROUND((SELECT SUM(CASE WHEN oc.MES = ${mes} AND oc.ANO = ${yearOffset} THEN oc.VALOR ELSE 0 END) `;
                sql += `FROM AD_ORCAMENTOCOMPRAS oc) - SUM(${mesExtension(mes)}), 2) as ${mesExtension(mes)}, `;
            }
        }
        
        sql += "'YEAR(fin.DTVENC)' as ANO  FROM INTERNO";
               

        // let lista = getDadosSql(sql);

        return sql;



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
        cases += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${mesof} AND YEAR(fin.DTVENC) = ${Numeroano} THEN fin.VLRDESDOB ELSE 0 END) as ${mesExtension(mes)},`;
      
        if (mesof == 12) {
            Numeroano++;
        }
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases2(startMonth, year, monthsCount = 12) {
    let cases = '';
    for (let i = startMonth; i < startMonth + monthsCount; i++) {
      const month = (i <= 12) ? i : i - 12;
      const yearOffset = (i <= 12) ? year : year + 1;

      cases += `SUM(CASE WHEN MONTH(fin.DTVENC) = ${month} AND fin.VLRBAIXA = 0 AND YEAR(fin.DTVENC) = ${yearOffset} THEN fin.VLRDESDOB ELSE 0 END) as ${mesExtension(month)},`;
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases3(startMonth, year, monthsCount = 12) {
    let cases = '';
    for (let i = 0; i < monthsCount; i++) {
        const currentMonth = ((startMonth + i - 1) % 12) + 1;
        const yearOffset = year + Math.floor((startMonth + i - 1) / 12);

        cases += `SUM(CASE WHEN oc.MES = ${currentMonth} AND oc.ANO = ${yearOffset} THEN oc.VALOR ELSE 0 END) as ${mesExtension(currentMonth)},`;
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases4(startMonth, year, monthsCount = 12) {
    let cases = '';
    for (let i = 0; i < monthsCount; i++) {
        const currentMonth = ((startMonth + i - 1) % 12) + 1;
        const yearOffset = year + Math.floor((startMonth + i - 1) / 12);

      cases += `SUM(CASE WHEN am.MES = ${currentMonth} AND am.ANO = ${yearOffset} THEN am.valor else 0 END) as  ${mesExtension(currentMonth)},`;
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases5(startMonth, year, monthsCount = 12) {
    let cases = '';
    for (let i = 0; i < monthsCount; i++) {
        const currentMonth = ((startMonth + i - 1) % 12) + 1;
        const yearOffset = year + Math.floor((startMonth + i - 1) / 12);

      cases += `SUM(CASE WHEN am.MES = ${currentMonth} AND am.ANO = ${yearOffset} THEN am.valor * -1 else 0 END) as  ${mesExtension(currentMonth)},`;
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases6(startMonth, year, monthsCount = 12) {
    let cases = '';
    for (let i = 0; i < monthsCount; i++) {
        const currentMonth = ((startMonth + i - 1) % 12) + 1;
        const yearOffset = year + Math.floor((startMonth + i - 1) / 12);


      cases += `${mesExtension(currentMonth)},`;
    }
    return cases.slice(0, -1); // Remove a última vírgula
}

function generateSumCases7(startMonth, year, monthsCount = 12) {
    let cases = '';
    for (let i = 0; i < monthsCount; i++) {
        const currentMonth = ((startMonth + i - 1) % 12) + 1;
        const yearOffset = year + Math.floor((startMonth + i - 1) / 12);

        cases += `SUM(${mesExtension(currentMonth)}) as ${mesExtension(currentMonth)},`;
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