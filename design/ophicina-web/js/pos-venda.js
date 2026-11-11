// pos-venda.js
// Envio dos serviços concluídos para a empresa de pós-venda e importação das avaliações.

function desenharFinalizadas() {
  const corpo = document.querySelector("#corpo-finalizadas");
  corpo.textContent = "";

  for (const ordem of ORDENS) {
    if (ordem.status !== "finalizada") continue;
    const cliente = buscarCliente(ordem.clienteId);
    const linha = document.createElement("tr");

    const celulaPlaca = document.createElement("td");
    celulaPlaca.appendChild(criarPlaca(ordem.placa));

    const celulaEnvio = document.createElement("td");
    if (ordem.enviadaPosVenda) {
      celulaEnvio.appendChild(criarElemento("span", "status status-finalizada", "Enviada"));
    } else {
      celulaEnvio.appendChild(criarElemento("span", "status status-andamento", "Pendente"));
    }

    linha.appendChild(criarElemento("td", "", ordem.numero));
    linha.appendChild(criarElemento("td", "sensivel", cliente.nome));
    linha.appendChild(celulaPlaca);
    linha.appendChild(criarElemento("td", "", formatarData(ordem.abertura)));
    linha.appendChild(celulaEnvio);
    corpo.appendChild(linha);
  }
}

function desenharAvaliacoes() {
  const lista = document.querySelector("#lista-avaliacoes");
  for (const avaliacao of AVALIACOES) {
    const cartao = criarElemento("article", "cartao avaliacao");

    const cabecalho = document.createElement("header");
    cabecalho.appendChild(criarElemento("strong", "sensivel", avaliacao.cliente));
    cabecalho.appendChild(criarElemento("span", "subtitulo", avaliacao.quando));

    const estrelas = criarElemento("div", "estrelas");
    estrelas.setAttribute("role", "img");
    estrelas.setAttribute("aria-label", "Nota " + avaliacao.nota + " de 5");
    for (let i = 1; i <= 5; i++) {
      const estrela = criarIcone("star-filled");
      if (i > avaliacao.nota) estrela.classList.add("apagada");
      estrelas.appendChild(estrela);
    }

    const citacao = document.createElement("blockquote");
    citacao.appendChild(criarElemento("p", "", avaliacao.comentario));

    cartao.appendChild(cabecalho);
    cartao.appendChild(estrelas);
    cartao.appendChild(citacao);
    cartao.appendChild(criarElemento("span", "subtitulo", "Referente à O.S. " + avaliacao.osNumero));
    lista.appendChild(cartao);
  }
}

// Gera o arquivo CSV no navegador com as O.S. que ainda não foram enviadas
function exportarPendentes() {
  const pendentes = [];
  for (const ordem of ORDENS) {
    if (ordem.status === "finalizada" && !ordem.enviadaPosVenda) pendentes.push(ordem);
  }
  if (pendentes.length === 0) {
    avisar("Todas as O.S. finalizadas já foram enviadas ao pós-venda.");
    return;
  }

  let conteudo = "os;cliente;telefone;placa;abertura\n";
  for (const ordem of pendentes) {
    const cliente = buscarCliente(ordem.clienteId);
    conteudo += ordem.numero + ";" + cliente.nome + ";" + cliente.telefone + ";" + ordem.placa + ";" + formatarData(ordem.abertura) + "\n";
    ordem.enviadaPosVenda = true;
  }

  // Blob cria o arquivo na memória; o link temporário faz o download
  const arquivo = new Blob(["\uFEFF" + conteudo], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "pos-venda-" + dataDeHoje() + ".csv";
  link.click();

  desenharFinalizadas();
  avisar(pendentes.length + " O.S. exportadas para o pós-venda.");
}

function iniciarPosVenda() {
  const formulario = document.querySelector("#formulario-importacao");
  const mensagem = document.querySelector("#mensagem-importacao");
  const campoArquivo = document.querySelector("#arquivo-avaliacoes");

  document.querySelector("#exportar-csv").addEventListener("click", exportarPendentes);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const arquivo = campoArquivo.files[0];

    if (!arquivo.name.toLowerCase().endsWith(".csv")) {
      mostrarMensagem(mensagem, "Escolha um arquivo .csv.", "erro");
      return;
    }
    if (arquivo.size > 1024 * 1024) {
      mostrarMensagem(mensagem, "O arquivo passa de 1 MB. Peça ao pós-venda um arquivo menor.", "erro");
      return;
    }

    // FileReader lê o conteúdo do arquivo escolhido pelo usuário
    const leitor = new FileReader();
    leitor.addEventListener("load", () => {
      const linhas = leitor.result.trim().split("\n");
      const registros = linhas.length - 1; // a primeira linha é o cabeçalho
      if (registros < 1) {
        mostrarMensagem(mensagem, "O arquivo está vazio ou só tem o cabeçalho.", "erro");
        return;
      }
      const total = document.querySelector("#total-avaliacoes");
      total.textContent = Number(total.textContent) + registros;
      formulario.reset();
      mostrarMensagem(mensagem, registros + " avaliações importadas.", "sucesso");
    });
    leitor.readAsText(arquivo);
  });

  desenharFinalizadas();
  desenharAvaliacoes();
}

iniciarPosVenda();
