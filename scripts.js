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
    $('#inicio').addClass('col-sm-11 offset-sm-1')
    $('#inicio').append(filtro());
}

function filtro() {
    let html = `<div class="container">`;
    html += `<div class="filter-bar row">`;
    html += `<div class="col-md-3">`;
    html += `<label for="month">Mes:</label>`;
    html += `<select id="month" class="form-control">`;
    html += `<option value="1">Janeiro</option>`;
    html += `<option value="2">Fevereiro</option>`;
    html += `<option value="3">Março</option>`;
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
    html += `<div class="col-md-3">`;
    html += `<label for="year">Ano:</label>`;
    html += `<select id="year" class="form-control">`;
    html += `</select>`;
    html += `</div>`;
    html += `<div class="col-md-6">`;
    html += `<div class="form-check">`;
    html += `<input type="checkbox" class="form-check-input" id="user1" name="user1" value="1">`;
    html += `<label class="form-check-label" for="user1"> Usuário 1</label>`;
    html += `</div>`;
    html += `<div class="form-check">`;
    html += `<input type="checkbox" class="form-check-input" id="user2" name="user2" value="2">`;
    html += `<label class="form-check-label" for="user2"> Usuário 2</label>`;
    html += `</div>`;
    html += `<div class="form-check">`;
    html += `<input type="checkbox" class="form-check-input" id="user3" name="user3" value="3">`;
    html += `<label class="form-check-label" for="user3"> Usuário 3</label>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;

    return html;
}
function adicionarBotaoAcao() {
    const currentYear = new Date().getFullYear();
    $('#inicio').append(filtro());
    $('#inicio').append('<div id="tabelaRetorno" class="mt-3"></div>');
    const previousYear = currentYear - 1;
    const nextYear = currentYear + 1;

    $('#year').append(`<option value="${previousYear}">${previousYear}</option>`);
    $('#year').append(`<option value="${currentYear}" selected>${currentYear}</option>`);
    $('#year').append(`<option value="${nextYear}">${nextYear}</option>`);
    let html = `<div class="row mt-3">`;
    html += `<div class="col-md-12 text-right">`;
    html += `<button id="acao" class="btn btn-primary">Ação</button>`;
    html += `</div>`;
    html += `</div>`;
    $('#inicio').append(html);
}

$(document).ready(function() {
    adicionarBotaoAcao();
});

function ExibirTabela(){
}