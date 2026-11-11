// dados.js
// Dados fictícios usados pelas telas. Back-end e banco de dados ficam
// para as próximas etapas, então por enquanto tudo fica em arrays.

const HABILIDADES = ["Injeção eletrônica", "Motor", "Scanner", "Autoelétrica", "Suspensão", "Limpeza de bicos", "Freios"];

const COLABORADORES = [
  { id: 1, nome: "Érica Lima", email: "erica@ophicina.com.br", perfil: "Gestor", habilidades: [], ativo: true },
  { id: 2, nome: "Bruno Santos", email: "bruno@ophicina.com.br", perfil: "Mecânico", habilidades: ["Injeção eletrônica", "Scanner"], ativo: true },
  { id: 3, nome: "Marcos Teixeira", email: "marcos@ophicina.com.br", perfil: "Mecânico", habilidades: ["Motor", "Limpeza de bicos"], ativo: true },
  { id: 4, nome: "Diego Ferraz", email: "diego@ophicina.com.br", perfil: "Mecânico", habilidades: ["Autoelétrica"], ativo: true },
  { id: 5, nome: "Leonardo Melo", email: "leonardo@ophicina.com.br", perfil: "Mecânico", habilidades: ["Suspensão", "Freios"], ativo: true },
  { id: 6, nome: "Paulo Rocha", email: "paulo@ophicina.com.br", perfil: "Mecânico", habilidades: ["Injeção eletrônica"], ativo: false },
];

const CLIENTES = [
  { id: 1, nome: "Fernanda Costa", telefone: "(19) 99812-4410", email: "fernanda.c@email.com", veiculos: [{ placa: "XYZ5E89", modelo: "Fiat Argo 1.3", ano: 2021 }] },
  { id: 2, nome: "Marcos Lima", telefone: "(19) 98877-1203", email: "", veiculos: [{ placa: "KJL7V44", modelo: "VW Gol 1.6", ano: 2017 }] },
  { id: 3, nome: "Carlos Mendes", telefone: "(19) 99145-7788", email: "carlos.mendes@email.com", veiculos: [{ placa: "ABC1D23", modelo: "Chevrolet Onix 1.0", ano: 2020 }] },
  { id: 4, nome: "Marcos Souza", telefone: "(19) 99630-0021", email: "", veiculos: [{ placa: "STU9H67", modelo: "Renault Sandero 1.6", ano: 2016 }] },
  { id: 5, nome: "Roberto Alves", telefone: "(19) 98102-5566", email: "roberto.a@email.com", veiculos: [{ placa: "MNO3F12", modelo: "Ford Ka 1.5", ano: 2019 }] },
  { id: 6, nome: "Ana Lima", telefone: "(19) 99277-3490", email: "ana.lima@email.com", veiculos: [{ placa: "PQR7G45", modelo: "Hyundai HB20 1.0", ano: 2022 }, { placa: "GHI2B33", modelo: "Fiat Mobi 1.0", ano: 2018 }] },
  { id: 7, nome: "Juliana Prado", telefone: "(19) 99501-8834", email: "", veiculos: [{ placa: "JKL9X88", modelo: "Toyota Etios 1.5", ano: 2018 }] },
  { id: 8, nome: "Sérgio Nunes", telefone: "(19) 98840-6612", email: "sergio.n@email.com", veiculos: [{ placa: "DEF4A55", modelo: "Honda Fit 1.5", ano: 2015 }] },
];

// status: "aberta", "andamento", "curadoria" ou "finalizada"
// enviadaPosVenda: se a O.S. finalizada já foi exportada para a empresa de pós-venda
const ORDENS = [
  { numero: 1051, placa: "XYZ5E89", clienteId: 1, sintoma: "Perda de potência e motor falhando de forma intermitente em alta rotação.", habilidades: ["Motor", "Injeção eletrônica"], status: "aberta", mecanicoId: null, abertura: "2026-11-10" },
  { numero: 1050, placa: "KJL7V44", clienteId: 2, sintoma: "Luz de anomalia acesa no painel e consumo de combustível acima do normal.", habilidades: ["Scanner", "Injeção eletrônica"], status: "aberta", mecanicoId: null, abertura: "2026-11-10" },
  { numero: 1048, placa: "ABC1D23", clienteId: 3, sintoma: "Falha na leitura da sonda lambda. Orçamento aprovado para troca do sensor.", habilidades: ["Injeção eletrônica", "Scanner"], status: "andamento", mecanicoId: 2, abertura: "2026-11-08" },
  { numero: 1047, placa: "STU9H67", clienteId: 4, sintoma: "Marcha lenta oscilando. Bicos injetores em limpeza por ultrassom.", habilidades: ["Limpeza de bicos"], status: "andamento", mecanicoId: 3, abertura: "2026-11-07" },
  { numero: 1045, placa: "MNO3F12", clienteId: 5, sintoma: "Bateria não segura carga e o veículo apaga em movimento.", habilidades: ["Autoelétrica"], status: "curadoria", mecanicoId: 4, abertura: "2026-11-05" },
  { numero: 1044, placa: "JKL9X88", clienteId: 7, sintoma: "Partida difícil pela manhã e cheiro de combustível.", habilidades: ["Limpeza de bicos"], status: "curadoria", mecanicoId: 3, abertura: "2026-11-04" },
  { numero: 1043, placa: "DEF4A55", clienteId: 8, sintoma: "Código P0420 registrado no scanner, sem perda de desempenho.", habilidades: ["Scanner"], status: "curadoria", mecanicoId: 2, abertura: "2026-11-03" },
  { numero: 1040, placa: "PQR7G45", clienteId: 6, sintoma: "Barulho na suspensão dianteira ao passar em lombadas.", habilidades: ["Suspensão"], status: "finalizada", mecanicoId: 5, abertura: "2026-10-29", enviadaPosVenda: true },
  { numero: 1038, placa: "XYZ5E89", clienteId: 1, sintoma: "Revisão de 40 mil km com troca de velas e filtros.", habilidades: ["Motor"], status: "finalizada", mecanicoId: 3, abertura: "2026-10-27", enviadaPosVenda: false },
  { numero: 1036, placa: "GHI2B33", clienteId: 6, sintoma: "Pastilhas de freio dianteiras gastas.", habilidades: ["Freios"], status: "finalizada", mecanicoId: 5, abertura: "2026-10-24", enviadaPosVenda: false },
  { numero: 1032, placa: "ABC1D23", clienteId: 3, sintoma: "Motor falhando a frio. Diagnóstico na injeção.", habilidades: ["Injeção eletrônica"], status: "finalizada", mecanicoId: 2, abertura: "2026-10-20", enviadaPosVenda: true },
  { numero: 1029, placa: "DEF4A55", clienteId: 8, sintoma: "Ruído no alternador e luz da bateria acendendo.", habilidades: ["Autoelétrica"], status: "finalizada", mecanicoId: 4, abertura: "2026-10-15", enviadaPosVenda: true },
];

// Relatos técnicos enviados pelos mecânicos (pelo app) aguardando a revisão do gestor
const RELATORIOS = [
  { osNumero: 1045, enviadoEm: "Hoje, 09:41", resumo: "Troca de estator e retificador", relato: "Falha de carregamento no sistema elétrico. O teste com multímetro mostrou curto no estator e regulagem de tensão irregular no retificador. Estator rebobinado e retificador trocado por peça nova original. Teste de carga após a montagem: 14,2 V estáveis." },
  { osNumero: 1044, enviadoEm: "Hoje, 07:58", resumo: "Limpeza de bicos injetores", relato: "Bicos com padrão de pulverização irregular no teste de bancada. Feita limpeza por ultrassom e troca dos anéis de vedação. Vazão equalizada entre os quatro bicos. Partida a frio normalizada." },
  { osNumero: 1043, enviadoEm: "Ontem, 16:20", resumo: "Scanner, código P0420", relato: "Código P0420 confirmado. Sonda pós-catalisador com leitura correta; catalisador com eficiência baixa. Cliente orientado sobre a troca, que ficou para outra visita." },
];

const AVALIACOES = [
  { cliente: "Carlos Mendes", nota: 5, comentario: "O diagnóstico da injeção foi rápido e o carro ficou ótimo. Recomendo.", osNumero: 1032, quando: "Há 2 dias" },
  { cliente: "Ana Lima", nota: 4, comentario: "Resolveram o barulho da suspensão. Só demorou um pouco mais que o combinado.", osNumero: 1040, quando: "Há 5 dias" },
  { cliente: "Sérgio Nunes", nota: 5, comentario: "Explicaram tudo antes de fazer o serviço. Preço justo.", osNumero: 1029, quando: "Há 1 semana" },
];

// Indicadores do painel. "anterior" guarda o mesmo período anterior, para calcular a tendência.
const INDICADORES = {
  semana: {
    descricao: "últimos 7 dias",
    atual: { faturamento: 8240, osAbertas: 6, osConcluidas: 14, tempoMedio: 3.2, notaMedia: 4.8, clientesAtivos: 211 },
    anterior: { faturamento: 7360, osAbertas: 8, osConcluidas: 11, tempoMedio: 3.2, notaMedia: 4.7, clientesAtivos: 209 },
    rotulos: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    abertas: [3, 2, 4, 3, 2, 1],
    concluidas: [2, 3, 3, 4, 3, 2],
    receita: [1100, 1400, 1350, 1600, 1800, 990],
  },
  mes: {
    descricao: "últimas 4 semanas",
    atual: { faturamento: 34780, osAbertas: 9, osConcluidas: 57, tempoMedio: 3.5, notaMedia: 4.7, clientesAtivos: 215 },
    anterior: { faturamento: 32200, osAbertas: 8, osConcluidas: 50, tempoMedio: 3.3, notaMedia: 4.7, clientesAtivos: 211 },
    rotulos: ["Sem. 1", "Sem. 2", "Sem. 3", "Sem. 4"],
    abertas: [4, 6, 5, 9],
    concluidas: [10, 15, 18, 14],
    receita: [7200, 9800, 10100, 7680],
  },
  ano: {
    descricao: "últimos 12 meses",
    atual: { faturamento: 392400, osAbertas: 8, osConcluidas: 684, tempoMedio: 3.4, notaMedia: 4.6, clientesAtivos: 245 },
    anterior: { faturamento: 341200, osAbertas: 8, osConcluidas: 630, tempoMedio: 3.6, notaMedia: 4.5, clientesAtivos: 215 },
    rotulos: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    abertas: [6, 5, 7, 8, 6, 9, 7, 8, 10, 9, 8, 7],
    concluidas: [48, 44, 52, 55, 50, 60, 58, 62, 65, 63, 60, 57],
    receita: [28000, 25000, 31000, 33000, 30000, 35000, 34000, 38000, 40000, 37000, 36000, 25400],
  },
};

// Percentual de O.S. concluídas por mecânico no mês
const PRODUTIVIDADE = [
  { colaboradorId: 2, percentual: 100 },
  { colaboradorId: 3, percentual: 85 },
  { colaboradorId: 4, percentual: 60 },
  { colaboradorId: 5, percentual: 40 },
];

// Funções de busca (no futuro, o back-end fará esse papel)
function buscarCliente(id) {
  for (const cliente of CLIENTES) {
    if (cliente.id === id) return cliente;
  }
  return null;
}

function buscarColaborador(id) {
  for (const colaborador of COLABORADORES) {
    if (colaborador.id === id) return colaborador;
  }
  return null;
}

function buscarOrdem(numero) {
  for (const ordem of ORDENS) {
    if (ordem.numero === numero) return ordem;
  }
  return null;
}

function mecanicosAtivos() {
  const lista = [];
  for (const colaborador of COLABORADORES) {
    if (colaborador.perfil === "Mecânico" && colaborador.ativo) lista.push(colaborador);
  }
  return lista;
}
