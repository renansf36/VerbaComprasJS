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

function gerarSeletorMeses(id = "mes", label = "Mes:", classe = "form-select") {
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
        {id: "transito", nome: "Transito" },
        {id: "devolucao", nome: "Devolucao" }

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
    const isAtivo = id === "geral" ? "show active" : "";
    
    return `
        <div class="tab-pane fade ${isAtivo}" id="${id}-table" role="tabpanel">
            <div class="mb-3 text-end" id="botao-download-${id}">
                <button class="btn btn-success btn-sm" onclick="baixarTabela('${id}')">
                    <i class="fas fa-download me-1"></i>
                    Baixar Excel
                </button>
            </div>
            <div class="table-responsive" style="max-height: 400px;">
                <table class="table table-striped table-hover" id="tabela-${id}">
                    <thead class="table-light sticky-top">
                        <tr>
                            ${colunas.map(coluna => `<th scope="col">${coluna}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody id="body-${id}-table"></tbody>
                </table>
            </div>
        </div>
    `;
}

function baixarTabela(tabelaId) {
    const tabela = document.getElementById(`tabela-${tabelaId}`);
    if (!tabela) {
        alert("Tabela não encontrada!");
        return;
    }

    const workbook = XLSX.utils.table_to_book(tabela, { sheet: "Sheet1" });
    const nomeArquivo = `${tabelaId}.xlsx`;
    XLSX.writeFile(workbook, nomeArquivo);
}


function gerarTabelas(mesSelecionado) {
    const colunasGeral = ["TIPO"];
    const colunasDepartamento = ["NOME", "DEPARTAMENTO", "TIPO"];
    for (let i = 0; i < 12; i++) {
        const mesAtual = ((mesSelecionado + i) % 12) + 1;
        colunasGeral.push(mesExtension2(mesAtual));
        colunasDepartamento.push(mesExtension2(mesAtual));
    }

    const tabelas = [
        { id: "geral", colunas: colunasGeral, nome: "Geral" },
        { id: "departamento", colunas: colunasDepartamento, nome: "Departamento" },
        { id: "contas", colunas: ["PEDIDO", "PARCEIRO", "QUANTIDADE", "VALOR", "MES", "COMPRADOR"], nome: "Contas_a_Pagar" },
        { id: "saldos", colunas: ["PEDIDO", "PARCEIRO", "QUANTIDADE", "VALOR", "MES", "NOME"], nome: "Saldos_de_Pedido" },
        { id: "transito", colunas: ["PEDIDO", "PARCEIRO", "QUANTIDADE", "VALOR", "MES", "NOME"], nome: "Transito" },
        { id: "devolucao", colunas: ["PEDIDO", "PARCEIRO", "VENCIMENTO", "VALOR", "MES", "GRUPO"], nome: "Devolucoes" }

        
    ];

    let html = `<div class="tab-content mt-3">`;
    tabelas.forEach(tabela => {
        html += gerarTabela(tabela.id, tabela.colunas);
        html += `<div id="botao-download-${tabela.id}" class="text-end">`;
        html += gerarBotaoDownloadTabela(`tabela-${tabela.id}`, tabela.nome);
        html += `</div>`;
    });
    html += `</div>`;
    return html;
}

function exportarTabelaParaExcel(tabelaId, nomeArquivo) {
    const tabela = document.getElementById(tabelaId);
    if (!tabela) {
        console.error(`Tabela com ID ${tabelaId} não encontrada!`);
        return;
    }

    // Converte a tabela HTML para uma planilha do Excel
    const ws = XLSX.utils.table_to_sheet(tabela);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Salva o arquivo Excel
    XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
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
    document.getElementById('filterButton').addEventListener('click', botaoAcao);
    

}

function botaoAcao() {
    const mesSelecionado = parseInt($("#mes").val());
    const anoSelecionado = parseInt($("#ano").val());
    x = mesSelecionado;

    if (isNaN(mesSelecionado) || isNaN(anoSelecionado)) {
        alert("Por favor, selecione um mês e um ano válidos.");
        return;
    }

    // Obter os resultados das funções de busca
    const resultadosGeral = buscaDeTabelaGeral(anoSelecionado, mesSelecionado);
    const resultadosDepartamento = buscaDeTabelaDepartamento(anoSelecionado, mesSelecionado);
    const resultadosContas = buscaDeTabelaContasaPagar(anoSelecionado, mesSelecionado);
    const resultadosSaldos = buscaDeTabelaSaldosPedido(anoSelecionado, mesSelecionado);
    const resultadosTransito = buscaDeTabelaSaldosTransito(anoSelecionado, mesSelecionado);
    const resultadosDevolucao = buscaDeTabelaDevolucoes(anoSelecionado, mesSelecionado);

    // Atualizar tabela geral
    preencherTabela("body-geral-table", resultadosGeral);

    // Atualizar tabela departamento
    preencherTabela("body-departamento-table", resultadosDepartamento);

    // Atualizar tabela contas a pagar
    preencherTabela("body-contas-table", resultadosContas);

    // Atualizar tabela saldos de pedido
    preencherTabela("body-saldos-table", resultadosSaldos);

    // Atualizar tabela Transito
    preencherTabela("body-transito-table", resultadosTransito);

    // Atualizar tabela Devolução
    preencherTabela("body-devolucao-table", resultadosDevolucao);

    // Exibir o container de resultados
    const resultContainer = document.getElementById("resultContainer");
    if (resultContainer) {
        resultContainer.style.display = "block";
    }
}



function preencherTabela(tabelaId, dados) {
    const tabela = document.getElementById(tabelaId);

    // console.log('dados', dados);
    
    if (!tabela) {
        console.error(`Tabela com ID ${tabelaId} não encontrada!`);
        return;
    }

    // Limpar o corpo da tabela antes de inserir novos dados
    tabela.innerHTML = "";

    // Verificar se os dados são válidos e iteráveis
    if (!Array.isArray(dados) || dados.length === 0) {
        console.warn(`Dados fornecidos para a tabela ${tabelaId} são inválidos ou vazios.`);
        const linha = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = tabela.closest("table").querySelectorAll("th").length || 1;
        td.textContent = "Nenhum dado disponível.";
        linha.appendChild(td);
        tabela.appendChild(linha);
        return;
    }

    // Preencher a tabela com os dados fornecidos
    dados.forEach((resultado, index) => {
        const linha = document.createElement("tr");
    
    
        if (Array.isArray(resultado)) {
            resultado.forEach(celula => {
                const td = document.createElement("td");

                 td.style.whiteSpace = "nowrap";
    
                if (Number.isFinite(celula)) {
                    td.textContent = formatarMoeda(celula);
    
                    if (celula < 0 && index !== 0) { // Evitar vermelho na primeira linha
                        td.style.backgroundColor = "red";
                        td.style.color = "white";
                    }
                } else {
                    td.textContent = celula;
                }
    
                linha.appendChild(td);
            });
        } else {
            console.warn(`Elemento não iterável encontrado:`, resultado);
        }
    
        tabela.appendChild(linha);
    });
}


function gerarBotaoDownloadTabela(tabelaId, nomeArquivo) {
    const tabela = document.getElementById(tabelaId);
    if (!tabela) return '';

    return `
        <button class="btn btn-success btn-sm mt-2" onclick="exportarTabelaParaExcel('${tabelaId}', '${nomeArquivo}')">
            Baixar Excel
        </button>`;
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
         
        console.log(sql)
        return lista;
}

function buscaDeTabelaDepartamento(ano, mes){
    // let anoPassado = Number(ano) - 1;
    // let anoFuturo = Number(ano) + 1;

    let sql = ` WITH CTE_DADOS AS (
                SELECT 
                      tu.NOMEUSU AS NOME, 
                      gru.DESCRGRUPOPROD as descs, 
                    '1-VERBA ' as TIPO, 
        ${generateSumCases4(mes, ano)}
        from AD_ORCAMENTOCOMPRAS am 
        inner join TGFGRU gru on gru.CODGRUPOPROD = am.CODGRUPOPROD 
        inner join AD_COMPRADORDEPTO acd  ON acd.CODGRUPO =  am.CODGRUPOPROD 
        inner join TSIUSU tu ON acd.CODUSU = tu.CODUSU 
        GROUP BY gru.DESCRGRUPOPROD,  tu.NOMEUSU 
        UNION ALL  
        SELECT 
        tu.NOMEUSU AS NOME, 
        gru.DESCRGRUPOPROD as descs, 
        '2-CONTAS APAGAR ' as TIPO, 
        ${generateSumCases5(mes, ano)}
         from VW_VERBA_COMPRAS_APAGAR_MERCADORIA am 
         inner join TGFGRU gru on gru.CODGRUPOPROD = am.CODGRUPOPROD 
         inner join AD_COMPRADORDEPTO acd  ON acd.CODGRUPO =  am.CODGRUPOPROD  
         inner join TSIUSU tu ON acd.CODUSU = tu.CODUSU 
         GROUP BY gru.DESCRGRUPOPROD,  tu.NOMEUSU 
         UNION ALL 
        SELECT 
         tu.NOMEUSU AS NOME, 
        gru.DESCRGRUPOPROD as descs, 
        '3-CONTAS APAGAR RENEGOC ' as TIPO, 
         ${generateSumCases5(mes, ano)}
         from VW_VERBA_COMPRAS_APAGAR_RENEG am  
         inner join TGFGRU gru on gru.CODGRUPOPROD = am.CODGRUPOPROD 
         inner join AD_COMPRADORDEPTO acd  ON acd.CODGRUPO =  am.CODGRUPOPROD 
         inner join TSIUSU tu ON acd.CODUSU = tu.CODUSU  
         GROUP BY gru.DESCRGRUPOPROD,  tu.NOMEUSU 
        UNION ALL 
        SELECT 
        tu.NOMEUSU AS NOME, 
        gru.DESCRGRUPOPROD as descs, 
         '4-CONTAS APAGAR FRETE ' as TIPO, 
        ${generateSumCases5(mes, ano)}
         from VW_VERBA_COMPRAS_APAGAR_FRETE am 
         inner join TGFGRU gru on gru.CODGRUPOPROD = am.CODGRUPOPROD 
         inner join AD_COMPRADORDEPTO acd  ON acd.CODGRUPO =  am.CODGRUPOPROD 
         inner join TSIUSU tu ON acd.CODUSU = tu.CODUSU 
         GROUP BY gru.DESCRGRUPOPROD,  tu.NOMEUSU 
         UNION ALL
         SELECT 
         tu.NOMEUSU AS NOME, 
         gru.DESCRGRUPOPROD as descs, 
        '5-SALDO PEDIDOS ' as TIPO, 
         ${generateSumCases5(mes, ano)}
        from VW_VERBA_COMPRAS_SALDO_PEDIDOS am 
        inner join TGFGRU gru on gru.CODGRUPOPROD = am.CODGRUPOPROD 
        inner join AD_COMPRADORDEPTO acd  ON acd.CODGRUPO =  am.CODGRUPOPROD
        inner join TSIUSU tu ON acd.CODUSU = tu.CODUSU 
        GROUP BY gru.DESCRGRUPOPROD,  tu.NOMEUSU 
        UNION ALL 
        SELECT 
        tu.NOMEUSU AS NOME, 
        gru.DESCRGRUPOPROD as descs, 
        '6-PEDIDOS TRANSITO ' as TIPO, 
        ${generateSumCases5(mes, ano)}
        from VW_VERBA_COMPRAS_PEDIDOS_TRANSITO am 
        inner join TGFGRU gru on gru.CODGRUPOPROD = am.CODGRUPOPROD 
        inner join AD_COMPRADORDEPTO acd  ON acd.CODGRUPO =  am.CODGRUPOPROD  
        inner join TSIUSU tu ON acd.CODUSU = tu.CODUSU 
        GROUP BY gru.DESCRGRUPOPROD,  tu.NOMEUSU 
        UNION ALL 
        SELECT 
        tu.NOMEUSU AS NOME, 
        gru.DESCRGRUPOPROD as descs, 
        '7-COMPRAS DEVOLUÇOES ' as TIPO, 
        ${generateSumCases4(mes, ano)}
        from VW_VERBA_COMPRAS_DEVOLUCOES am 
        inner join TGFGRU gru on gru.CODGRUPOPROD = am.CODGRUPOPROD 
        inner join AD_COMPRADORDEPTO acd  ON acd.CODGRUPO =  am.CODGRUPOPROD  
        inner join TSIUSU tu ON acd.CODUSU = tu.CODUSU 
        GROUP BY gru.DESCRGRUPOPROD,  tu.NOMEUSU  
        UNION ALL
        SELECT 
            NOME, 
            descs, 
            '8-SALDO ATUALIZADO' as TIPO, 
            ${generateSumCases7(mes, ano)} 
        FROM (
        SELECT 
            tu.NOMEUSU AS NOME,
            gru.DESCRGRUPOPROD as descs, 
            '1-VERBA ' as TIPO, 
            ${generateSumCases4(mes, ano)}
        FROM AD_ORCAMENTOCOMPRAS am
        INNER JOIN TGFGRU gru ON gru.CODGRUPOPROD = am.CODGRUPOPROD
        INNER JOIN AD_COMPRADORDEPTO acd ON acd.CODGRUPO = am.CODGRUPOPROD
        INNER JOIN TSIUSU tu ON acd.CODUSU = tu.CODUSU
        GROUP BY gru.DESCRGRUPOPROD, tu.NOMEUSU
        UNION ALL
        SELECT 
            tu.NOMEUSU AS NOME,
            gru.DESCRGRUPOPROD as descs, 
            '2-CONTAS APAGAR ' as TIPO, 
            ${generateSumCases5(mes, ano)}
        FROM VW_VERBA_COMPRAS_APAGAR_MERCADORIA am
        INNER JOIN TGFGRU gru ON gru.CODGRUPOPROD = am.CODGRUPOPROD
        INNER JOIN AD_COMPRADORDEPTO acd ON acd.CODGRUPO = am.CODGRUPOPROD
        INNER JOIN TSIUSU tu ON acd.CODUSU = tu.CODUSU
        GROUP BY gru.DESCRGRUPOPROD, tu.NOMEUSU
        UNION ALL
        SELECT 
            tu.NOMEUSU AS NOME,
            gru.DESCRGRUPOPROD as descs, 
            '3-CONTAS APAGAR RENEGOC ' as TIPO, 
            ${generateSumCases5(mes, ano)}
        FROM VW_VERBA_COMPRAS_APAGAR_RENEG am
        INNER JOIN TGFGRU gru ON gru.CODGRUPOPROD = am.CODGRUPOPROD
        INNER JOIN AD_COMPRADORDEPTO acd ON acd.CODGRUPO = am.CODGRUPOPROD
        INNER JOIN TSIUSU tu ON acd.CODUSU = tu.CODUSU
        GROUP BY gru.DESCRGRUPOPROD, tu.NOMEUSU
        UNION ALL
        SELECT 
            tu.NOMEUSU AS NOME,
            gru.DESCRGRUPOPROD as descs, 
            '4-CONTAS APAGAR FRETE ' as TIPO, 
            ${generateSumCases5(mes, ano)}
        FROM VW_VERBA_COMPRAS_APAGAR_FRETE am
        INNER JOIN TGFGRU gru ON gru.CODGRUPOPROD = am.CODGRUPOPROD
        INNER JOIN AD_COMPRADORDEPTO acd ON acd.CODGRUPO = am.CODGRUPOPROD
        INNER JOIN TSIUSU tu ON acd.CODUSU = tu.CODUSU
        GROUP BY gru.DESCRGRUPOPROD, tu.NOMEUSU
        UNION ALL
        SELECT 
            tu.NOMEUSU AS NOME,
            gru.DESCRGRUPOPROD as descs, 
            '5-SALDO PEDIDOS ' as TIPO, 
            ${generateSumCases5(mes, ano)}
        FROM VW_VERBA_COMPRAS_SALDO_PEDIDOS am
        INNER JOIN TGFGRU gru ON gru.CODGRUPOPROD = am.CODGRUPOPROD
        INNER JOIN AD_COMPRADORDEPTO acd ON acd.CODGRUPO = am.CODGRUPOPROD
        INNER JOIN TSIUSU tu ON acd.CODUSU = tu.CODUSU
        GROUP BY gru.DESCRGRUPOPROD, tu.NOMEUSU
        UNION ALL
        SELECT 
            tu.NOMEUSU AS NOME,
            gru.DESCRGRUPOPROD as descs, 
            '6-PEDIDOS TRANSITO ' as TIPO, 
            ${generateSumCases5(mes, ano)}
        FROM VW_VERBA_COMPRAS_PEDIDOS_TRANSITO am
        INNER JOIN TGFGRU gru ON gru.CODGRUPOPROD = am.CODGRUPOPROD
        INNER JOIN AD_COMPRADORDEPTO acd ON acd.CODGRUPO = am.CODGRUPOPROD
        INNER JOIN TSIUSU tu ON acd.CODUSU = tu.CODUSU
        GROUP BY gru.DESCRGRUPOPROD, tu.NOMEUSU
        UNION ALL
        SELECT 
            tu.NOMEUSU AS NOME,
            gru.DESCRGRUPOPROD as descs, 
            '7-COMPRAS DEVOLUCOES ' as TIPO, 
            ${generateSumCases4(mes, ano)}
        FROM VW_VERBA_COMPRAS_DEVOLUCOES am
        INNER JOIN TGFGRU gru ON gru.CODGRUPOPROD = am.CODGRUPOPROD
        INNER JOIN AD_COMPRADORDEPTO acd ON acd.CODGRUPO = am.CODGRUPOPROD
        INNER JOIN TSIUSU tu ON acd.CODUSU = tu.CODUSU
        GROUP BY gru.DESCRGRUPOPROD, tu.NOMEUSU
    ) AS DADOS
    GROUP BY DADOS.descs, DADOS.NOME)
    SELECT 
        NOME, 
        descs, 
        TIPO,
        ${generateSumCases6(mes, ano)}
    FROM CTE_DADOS
    ORDER BY NOME, descs, TIPO;
`;


let lista = getDadosSql(sql);

// console.log('lista', lista);


return lista;


}

function buscaDeTabelaContasaPagar(ano, mes){
    let sql = ` SELECT DISTINCT
                             CAST(COALESCE (cab.NUNOTA, fin.NUMNOTA)AS NVARCHAR) AS PEDIDO,
                            par.NOMEPARC AS PARCEIRO,
                             CAST(ISNULL (SUM(cab.QTDVOL),0)AS NVARCHAR) AS QTD,
                            SUM(fin.VLRDESDOB) AS VALOR,
                           FORMAT(fin.DTVENC, 'MMMM', 'pt-BR')AS MES,
  			 VEN.APELIDO as NOME
                            FROM TGFFIN fin
                            LEFT JOIN TGFCAB cab
                            ON (fin.NUNOTA = cab.NUNOTA)
                            LEFT JOIN TGFPAR par
                            ON par.CODPARC = fin.CODPARC
                            LEFT join tgfven VEN on VEN.codvend = cab.codvend
                            WHERE 	fin.CODNAT 		in (120103,120101)
                            --AND		cab.CODTIPOPER  in (1000, 1500, 1502, 1528)
                            AND  	fin.RECDESP 	= -1
                            AND  	fin.PROVISAO 	= 'N'
                            AND MONTH(fin.DTVENC) 	in (${mes})
                            AND  YEAR(fin.DTVENC) 	in (${ano})
                            GROUP BY cab.NUNOTA ,fin.NUMNOTA, par.NOMEPARC, fin.DTVENC ,cab.QTDVOL, VEN.APELIDO`;


    let lista = getDadosSql(sql);
    // console.log('lista', lista);
    return lista;
}

function buscaDeTabelaSaldosPedido(ano, mes){
    let sql = ` SELECT
                         CAST(fin.NUNOTA AS NVARCHAR) AS PEDIDO,
                        par.NOMEPARC AS PARCEIRO,
                         CAST(SUM(cab.QTDVOL)AS NVARCHAR) AS QTD,
                        SUM(fin.VLRDESDOB) AS VALOR,
                       FORMAT(fin.DTVENC, 'MMMM', 'pt-BR')AS MES,
		      VEN.APELIDO as NOME
                        FROM TGFFIN fin
                        INNER JOIN TGFCAB cab ON (fin.NUNOTA = cab.NUNOTA)
                        INNER JOIN TGFPAR par ON (par.CODPARC = cab.CODPARC)
	               LEFT join tgfven VEN on VEN.codvend = cab.codvend
                        INNER JOIN (select NUNOTA, COUNT(*) AS QTDBX  from TGFFIN f
                                                    WHERE f.VLRBAIXA > 0
                                                    AND MONTH(f.DTVENC) in (${mes})
                                                    AND YEAR(f.DTVENC) 	in (${ano})
                                                    AND RECDESP 		= -1
                                                    AND f.PROVISAO 		= 'S'
                                                    group by NUNOTA) bx on (bx.NUNOTA = cab.NUNOTA)
                                WHERE fin.CODTIPOPER IN (1500, 1502, 1528)
                                AND fin.PROVISAO = 'S'
                                AND cab.PENDENTE = 'S'
                                AND fin.VLRBAIXA = 0
                                AND MONTH(fin.DTVENC)  in (${mes})
                                AND  YEAR(fin.DTVENC) 	in (${ano})
                                GROUP BY YEAR(fin.DTVENC), fin.NUNOTA, par.NOMEPARC, fin.DTVENC, VEN.APELIDO`;

    let lista = getDadosSql(sql);
    // console.log('lista', lista);
    return lista;
}

function buscaDeTabelaSaldosTransito(ano, mes){
    let sql = `SELECT
                           CAST(fin.NUNOTA  AS NVARCHAR) AS PEDIDO,
                           par.NOMEPARC AS PARCEIRO,
                          CAST(SUM(cab.QTDVOL)AS NVARCHAR) AS QTD,
                           SUM(fin.VLRDESDOB) AS VALOR,
                          FORMAT(fin.DTVENC, 'MMMM', 'pt-BR')AS MES,
 		         VEN.APELIDO as NOME
                           FROM TGFFIN fin
                           INNER JOIN TGFCAB cab
                           ON (fin.NUNOTA = cab.NUNOTA)
                           INNER JOIN TGFPAR par
                           ON par.CODPARC = cab.CODPARC
		         LEFT join tgfven VEN on VEN.codvend = cab.codvend
                           WHERE fin.CODTIPOPER in ( 1000, 1500, 1502, 1528)
                           AND cab.STATUSNOTA  = 'L'
                           AND fin.NUNOTA NOT IN(
			SELECT 	f.NUNOTA
			FROM TGFFIN f
	   		INNER JOIN TGFCAB c ON (f.NUNOTA = c.NUNOTA)
	    		INNER JOIN TGFPAR p ON (p.CODPARC = c.CODPARC)	
     		INNER JOIN (
     				SELECT f2.NUNOTA, COUNT(*) AS QTDBX
     				FROM TGFFIN f2
					WHERE f2.VLRBAIXA > 0
					AND MONTH(f2.DTVENC)  in (${mes})
					AND YEAR(f2.DTVENC)   in (${ano})
					AND f2.RECDESP 		= -1
					AND f2.PROVISAO 		= 'S'
					GROUP BY f2.NUNOTA) bx on (bx.NUNOTA = c.NUNOTA)
			WHERE f.CODTIPOPER IN (1500, 1502, 1528)
			AND f.PROVISAO = 'S'
			AND c.PENDENTE = 'S'
			AND MONTH(f.DTVENC)   in (${mes})
			AND  YEAR(f.DTVENC) 	in (${ano})
		)
                           AND cab.PENDENTE = 'S'
                           AND MONTH(fin.DTVENC) in (${mes})
                           AND YEAR(fin.DTVENC)  in (${ano})
            GROUP BY fin.NUNOTA, par.NOMEPARC, fin.DTVENC, VEN.APELIDO
`;

    let lista = getDadosSql(sql);
    // console.log('lista', lista);
    return lista;
}

function buscaDeTabelaDevolucoes(ano, mes){
    let sql = `SELECT
               CAST(fin.NUNOTA AS NVARCHAR) AS NUNOTA,
               par.NOMEPARC AS PARCEIRO,
               FORMAT(fin.DTVENC, 'dd/MM/yyyy') AS VENCIMENTO,
               SUM(fin.VLRDESDOB * vns.FATOR) AS VALOR,
               FORMAT(fin.DTVENC, 'MMMM', 'pt-BR')AS MES,
               gru.DESCRGRUPOPROD AS GRUPO
               from TGFFIN fin
               inner join VW_NOTADEPARTAMENTO_SOLAR vns on (vns.NUNOTA = fin.NUNOTA) 
               inner join tgfcab cab on cab.NUNOTA = fin.NUNOTA
               inner join tgfpar par on par.CODPARC = cab.CODPARC
               inner join TGFGRU gru on gru.CODGRUPOPROD = vns.CODGRUPOPROD
               where fin.CODTIPOPER = 3000 
               AND MONTH(fin.DTVENC) 	in (${mes}) 
               AND  YEAR(fin.DTVENC) 	in (${ano})
               GROUP BY fin.DTVENC, vns.CODGRUPOPROD,fin.nunota ,par.NOMEPARC, gru.DESCRGRUPOPROD
    `;

    
    let lista = getDadosSql(sql);
    // console.log('lista', lista);
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
        cases += `CAST(SUM(CASE WHEN oc.MES = ${mesof} AND oc.ANO = ${Numeroano} THEN oc.VALOR ELSE 0 END)AS DECIMAL(10,2)) as ${mesExtension(mesof)},`;
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
        cases += `SUM(${mesExtension(mesof)}) as ${mesExtension(mesof)},`;
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

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor).replace("R$", "").trim();
}
