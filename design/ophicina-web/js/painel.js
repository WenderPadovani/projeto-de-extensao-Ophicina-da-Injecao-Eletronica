// painel.js
// Indicadores com tendência, gráficos (Chart.js) e listas resumidas.

const NOMES_STATUS = {
  aberta: "Aberta",
  andamento: "Em andamento",
  curadoria: "Em curadoria",
  finalizada: "Finalizada",
};

// Cada indicador sabe se é melhor quando o número sobe ou quando desce
const LISTA_INDICADORES = [
  { chave: "faturamento", titulo: "Faturamento", icone: "currency-real", melhorQuando: "maior", percentual: true, sensivel: true },
  { chave: "osAbertas", titulo: "O.S. abertas", icone: "file-text", melhorQuando: "menor" },
  { chave: "osConcluidas", titulo: "O.S. concluídas", icone: "circle-check", melhorQuando: "maior" },
  { chave: "tempoMedio", titulo: "Tempo médio", icone: "clock", melhorQuando: "menor", unidade: " h" },
  { chave: "notaMedia", titulo: "Satisfação (1 a 5)", icone: "star", melhorQuando: "maior", sensivel: true },
  { chave: "clientesAtivos", titulo: "Clientes ativos", icone: "users", melhorQuando: "maior" },
];

function formatarValor(indicador, valor) {
  if (indicador.chave === "faturamento") return formatarMoeda(valor);
  let texto = valor.toLocaleString("pt-BR");
  if (indicador.unidade) texto += indicador.unidade;
  return texto;
}

// A seta mostra se o número subiu ou desceu; a classe (cor) mostra se isso é bom ou ruim.
function calcularTendencia(indicador, atual, anterior) {
  const diferenca = atual - anterior;
  if (diferenca === 0) {
    return { texto: "— estável", classe: "neutra" };
  }

  const seta = diferenca > 0 ? "▲" : "▼";
  const sinal = diferenca > 0 ? "+" : "−";
  let variacao;
  if (indicador.percentual) {
    variacao = Math.round((Math.abs(diferenca) / anterior) * 100) + "%";
  } else {
    variacao = Math.abs(Math.round(diferenca * 10) / 10).toLocaleString("pt-BR");
    if (indicador.unidade) variacao += indicador.unidade;
  }

  const subiu = diferenca > 0;
  const bom = indicador.melhorQuando === "maior" ? subiu : !subiu;
  return { texto: seta + " " + sinal + variacao + " vs anterior", classe: bom ? "positiva" : "negativa" };
}

function desenharIndicadores(dados) {
  const lista = document.querySelector("#indicadores");
  lista.textContent = "";

  for (const indicador of LISTA_INDICADORES) {
    const atual = dados.atual[indicador.chave];
    const anterior = dados.anterior[indicador.chave];
    const tendencia = calcularTendencia(indicador, atual, anterior);

    const item = criarElemento("li", "cartao indicador");
    const titulo = document.createElement("h2");
    titulo.appendChild(criarIcone(indicador.icone));
    titulo.appendChild(document.createTextNode(indicador.titulo));

    const valor = criarElemento("p", "valor", formatarValor(indicador, atual));
    const variacao = criarElemento("p", "tendencia " + tendencia.classe, tendencia.texto);
    if (indicador.sensivel) {
      valor.classList.add("sensivel");
      variacao.classList.add("sensivel");
    }

    item.appendChild(titulo);
    item.appendChild(valor);
    item.appendChild(variacao);
    lista.appendChild(item);
  }
}

// ---------- Gráficos ----------

let graficoOs = null;
let graficoReceita = null;

// Lê uma cor definida nas variáveis do CSS (muda conforme o tema)
function lerCor(variavel) {
  return getComputedStyle(document.documentElement).getPropertyValue(variavel).trim();
}

// Converte "#6d28d9" em "rgba(109, 40, 217, 0.15)" para o preenchimento das áreas
function corTransparente(hexadecimal, opacidade) {
  const r = parseInt(hexadecimal.slice(1, 3), 16);
  const g = parseInt(hexadecimal.slice(3, 5), 16);
  const b = parseInt(hexadecimal.slice(5, 7), 16);
  return "rgba(" + r + ", " + g + ", " + b + ", " + opacidade + ")";
}

function desenharGraficos(dados) {
  document.querySelector("#subtitulo-os").textContent = dados.descricao;
  document.querySelector("#subtitulo-receita").textContent = dados.descricao;

  const corTexto = lerCor("--texto-3");
  const corGrade = lerCor("--borda");
  const corAberta = lerCor("--aberta");
  const corConcluida = lerCor("--finalizada");

  Chart.defaults.font.family = "Inter, 'Segoe UI', Roboto, sans-serif";
  Chart.defaults.color = corTexto;

  const eixos = {
    x: { grid: { color: corGrade }, ticks: { color: corTexto } },
    y: { beginAtZero: true, grid: { color: corGrade }, ticks: { color: corTexto } },
  };

  // Antes de redesenhar (troca de período ou de tema), apaga os gráficos antigos
  if (graficoOs) graficoOs.destroy();
  if (graficoReceita) graficoReceita.destroy();

  graficoOs = new Chart(document.querySelector("#grafico-os"), {
    type: "line",
    data: {
      labels: dados.rotulos,
      datasets: [
        {
          label: "Abertas",
          data: dados.abertas,
          borderColor: corAberta,
          backgroundColor: corTransparente(corAberta, 0.12),
          pointBackgroundColor: lerCor("--superficie"),
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 4,
        },
        {
          label: "Concluídas",
          data: dados.concluidas,
          borderColor: corConcluida,
          backgroundColor: corTransparente(corConcluida, 0.12),
          pointBackgroundColor: lerCor("--superficie"),
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxHeight: 8 } } },
      scales: eixos,
    },
  });

  graficoReceita = new Chart(document.querySelector("#grafico-receita"), {
    type: "bar",
    data: {
      labels: dados.rotulos,
      datasets: [{ label: "Faturamento", data: dados.receita, backgroundColor: lerCor("--destaque"), borderRadius: 6 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (contexto) => formatarMoeda(contexto.parsed.y) } },
      },
      scales: {
        x: eixos.x,
        y: { beginAtZero: true, grid: { color: corGrade }, ticks: { color: corTexto, callback: (valor) => "R$ " + valor / 1000 + " mil" } },
      },
    },
  });
}

// ---------- Listas ----------

function desenharProdutividade() {
  const lista = document.querySelector("#lista-produtividade");
  for (const item of PRODUTIVIDADE) {
    const mecanico = buscarColaborador(item.colaboradorId);
    const linha = document.createElement("li");

    const texto = criarElemento("span", "texto");
    texto.appendChild(criarElemento("strong", "", mecanico.nome));
    texto.appendChild(criarElemento("span", "", mecanico.habilidades.join(", ")));

    const barra = criarElemento("span", "progresso");
    const preenchimento = document.createElement("span");
    preenchimento.style.width = item.percentual + "%";
    barra.appendChild(preenchimento);

    linha.appendChild(criarElemento("span", "avatar avatar-neutro", iniciais(mecanico.nome)));
    linha.appendChild(texto);
    linha.appendChild(barra);
    linha.appendChild(criarElemento("span", "", item.percentual + "%"));
    lista.appendChild(linha);
  }
}

function desenharUltimasOrdens() {
  const lista = document.querySelector("#lista-ultimas-os");
  const ordenadas = ORDENS.slice().sort((a, b) => b.numero - a.numero);

  for (const ordem of ordenadas.slice(0, 4)) {
    const cliente = buscarCliente(ordem.clienteId);
    const linha = document.createElement("li");

    const texto = criarElemento("span", "texto");
    texto.appendChild(criarElemento("strong", "sensivel", cliente.nome));
    texto.appendChild(criarElemento("span", "", "O.S. " + ordem.numero + ": " + ordem.sintoma));

    linha.appendChild(criarPlaca(ordem.placa));
    linha.appendChild(texto);
    linha.appendChild(criarElemento("span", "status status-" + ordem.status, NOMES_STATUS[ordem.status]));
    lista.appendChild(linha);
  }
}

function desenharRelatosPendentes() {
  const lista = document.querySelector("#lista-relatos");
  for (const relato of RELATORIOS) {
    const ordem = buscarOrdem(relato.osNumero);
    const mecanico = buscarColaborador(ordem.mecanicoId);
    const linha = document.createElement("li");

    const texto = criarElemento("span", "texto");
    texto.appendChild(criarElemento("strong", "", relato.resumo));
    texto.appendChild(criarElemento("span", "", "Enviado por " + mecanico.nome + ", " + relato.enviadoEm.toLowerCase()));

    const link = criarElemento("a", "botao botao-secundario botao-pequeno", "Revisar");
    link.href = "curadoria.html#os-" + ordem.numero;

    linha.appendChild(criarPlaca(ordem.placa));
    linha.appendChild(texto);
    linha.appendChild(link);
    lista.appendChild(linha);
  }
}

function iniciarPainel() {
  const seletorPeriodo = document.querySelector("#periodo");

  const atualizar = () => {
    const dados = INDICADORES[seletorPeriodo.value];
    desenharIndicadores(dados);
    desenharGraficos(dados);
  };

  seletorPeriodo.addEventListener("change", atualizar);
  // As cores dos gráficos vêm do CSS; ao trocar o tema, eles são redesenhados
  document.querySelector("#botao-tema").addEventListener("click", atualizar);

  atualizar();
  desenharProdutividade();
  desenharUltimasOrdens();
  desenharRelatosPendentes();
}

iniciarPainel();
