var registros = [];
var tabela = [];

function listarArgumentos() {
	return registros.filter((value, index) => /[ABCD]/.test(value) && registros.indexOf(value) === index);
}

function contarArgumentos() {
	return listarArgumentos().length;
}

function apresentarTabela() {
	var argumentos = listarArgumentos();
	var preencheTabela;
	if (argumentos.length > 0) {
		content = '<table><thead><tr>';
		for (arg of argumentos) {
			content += `<td>${arg}</td>`;
		}
		content += `<td>${registros.join(' ')}</td>`;
		content += '</tr></thead><tbody>';
		for (i = 0; i < tabela.length; i++) {
			content += '<tr>';
			for (j = 0; j < tabela[i].length; j++) {
				console.log("tabela: " + tabela[i][j]);
				content += `<td>${!!tabela[i][j]}</td>`;
			}
			content += `<td>${calcularLinha(tabela[i])}</td>`;
			content += '</tr>';
		}
		content += '</tbody></table>';

		document.getElementById('tabelaVerdade').innerHTML = content;
	} else {
		document.getElementById('tabelaVerdade').innerHTML = '';
	}
}

function montarTabela() {
	qtdArgumentos = contarArgumentos();
	qtdLinhas = Math.pow(2, qtdArgumentos);
	tabela = [];
	for (i = 0; i < qtdLinhas; i++) {
		binario = i.toString(2);
		binario = binario.length < qtdArgumentos ? Array(qtdArgumentos - binario.length + 1).join('0') + binario : binario;
		for (j = 0; j < binario.length; j++) {
			if (tabela[i] === null || tabela[i] === undefined) tabela[i] = [];
			tabela[i][j] = parseInt(binario.substr(j, 1), 10);
		}
	}
	apresentarTabela();
}

function registroParaInput() {
	document.getElementById('calcInput').value = registros.join(' ');
	montarTabela();
}

function input(e) {
	registros.push(e.value);
	registroParaInput();
}

function apagar() {
	registros.pop();
	registroParaInput();
}

function limpar() {
	registros = [];
	registroParaInput();
}

/*========= CALCULO =========*/
function converterParaExpressao() {
	expressao = '';
	for (k = 0; k < registros.length; k++) {
		registro = registros[k];
		if (/[ABCD()]/.test(registro)) {
			expressao += registro;
		} else {
			switch (registro) {
				case '~':
					expressao += '!';
					break;
				case '.':
					expressao += '&&'; // AND
					break;
				case 'v':
					expressao += '||'; // OR
					break;
				case '<-|->':
					expressao += '=='; // IGUAL
					break;
				case '⊻':
					expressao += '^';
					break;
				case '↓':
					expressao = `!((${expressao}) || ${registros[k + 1]})`;
					k += 1;
					break;
				case '↑':
					expressao = `!((${expressao}) && ${registros[k + 1]})`;
					k += 1;
					break;
			}
		}
	}
	return expressao;
}

function calcularLinha(linha) {
	expressao = converterParaExpressao();
	if (Array.isArray(linha)) {
		linha.forEach((valor, index) => {
			switch (index) {
				case 0:
					expressao = expressao.split('A').join(valor === 1);
					break;
				case 1:
					expressao = expressao.split('B').join(valor === 1);
					break;
				case 2:
					expressao = expressao.split('C').join(valor === 1);
					break;
				case 3:
					expressao = expressao.split('D').join(valor === 1);
					break;
			}
		});
		try {
			return eval(expressao);
		} catch (err) {
			return 'expressão inválida';
		}
	} else {
		return '';
	}
}
