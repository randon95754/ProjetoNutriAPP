// ===============================
// CONSTANTES
// ===============================

const DIAS = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
];

// kcal por 100g
const calorias = {
  frango: 165,
  arroz: 130,
  ovo: 155,
  carne: 250,
  batata: 77,
  queijo: 300,
  creme_galinha: 90,
  maca: 52,
};

// ===============================
// ESTADO GLOBAL
// ===============================

const state = {
  marmitas: {},
  diaAtual: "segunda",
  marmitaAtualIndex: 0,
  metaDiaria: 0,
};

// Inicializar dias de forma limpa
DIAS.forEach((dia) => {
  state.marmitas[dia] = [];
});

// ===============================
// CACHE DOM
// ===============================

const elements = {
  diaSelect: document.getElementById("diaSelect"),
  marmitaSelect: document.getElementById("marmitaSelect"),
  alimentoSelect: document.getElementById("alimentoSelect"),
  gramasInput: document.getElementById("gramasInput"),
  metaInput: document.getElementById("metaInput"),
  marmitaList: document.getElementById("marmitaList"),
  totalCal: document.getElementById("totalCal"),
  totalSemana: document.getElementById("totalSemana"),
  totalMarmitaAtual: document.getElementById("totalMarmitaAtual"),
  statusDia: document.getElementById("statusDia"),
};

// ===============================
// STORAGE (COM DEBOUNCE)
// ===============================

let saveTimeout;

function salvarDados() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem("nutriDados", JSON.stringify(state));
  }, 300);
}

function carregarDados() {
  try {
    const dadosSalvos = localStorage.getItem("nutriDados");
    if (!dadosSalvos) return;

    const dados = JSON.parse(dadosSalvos);
    state.marmitas = dados.marmitas || state.marmitas;
    state.metaDiaria = dados.metaDiaria || 0;
    state.diaAtual = dados.diaAtual || "segunda";
    state.marmitaAtualIndex = dados.marmitaAtualIndex || 0;
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

// ===============================
// CÁLCULOS
// ===============================

function calcularTotalMarmita(marmita) {
  if (!marmita || !marmita.alimentos) return 0;
  return marmita.alimentos.reduce(
    (total, alimento) => total + alimento.kcal,
    0,
  );
}

function calcularTotalDia(dia) {
  return state.marmitas[dia].reduce((total, marmita) => {
    return total + calcularTotalMarmita(marmita);
  }, 0);
}

function calcularTotalSemana() {
  return DIAS.reduce((total, dia) => total + calcularTotalDia(dia), 0);
}

// ===============================
// RENDERIZAÇÃO DA INTERFACE
// ===============================

function render() {
  atualizarSelectMarmitas();
  atualizarLista();

  // Atualiza os painéis numéricos de calorias
  const totalDia = calcularTotalDia(state.diaAtual);
  elements.totalCal.textContent = totalDia.toFixed(0);
  elements.totalSemana.textContent = calcularTotalSemana().toFixed(0);

  atualizarStatusDia(totalDia);
}

// ===============================
// AÇÕES E NAVEGAÇÃO
// ===============================

function trocarMarmita() {
  state.diaAtual = elements.diaSelect.value;

  if (state.marmitas[state.diaAtual].length === 0) {
    criarNovaMarmita();
  } else {
    state.marmitaAtualIndex = 0;
    render();
    salvarDados();
  }
}

function criarNovaMarmita() {
  const nova = {
    nome: `Marmita ${state.marmitas[state.diaAtual].length + 1}`,
    alimentos: [],
  };

  state.marmitas[state.diaAtual].push(nova);
  state.marmitaAtualIndex = state.marmitas[state.diaAtual].length - 1;

  render();
  salvarDados();
}

function trocarMarmitaSelecionada() {
  state.marmitaAtualIndex = Number(elements.marmitaSelect.value);
  render();
  salvarDados();
}

// ===============================
// GERENCIAMENTO DE ALIMENTOS
// ===============================

function addAlimento() {
  const alimento = elements.alimentoSelect.value;
  const gramas = Number(elements.gramasInput.value);

  if (!alimento || gramas <= 0) {
    alert("Selecione um alimento e informe as gramas corretamente.");
    return;
  }

  const kcal = (calorias[alimento] * gramas) / 100;

  state.marmitas[state.diaAtual][state.marmitaAtualIndex].alimentos.push({
    alimento,
    gramas,
    kcal,
  });

  elements.gramasInput.value = "";
  render();
  salvarDados();
}

function removerAlimento(index) {
  state.marmitas[state.diaAtual][state.marmitaAtualIndex].alimentos.splice(
    index,
    1,
  );
  render();
  salvarDados();
}

// ===============================
// ATUALIZAÇÃO DE COMPONENTES DOM
// ===============================

function atualizarLista() {
  elements.marmitaList.innerHTML = "";
  const marmitasDia = state.marmitas[state.diaAtual];

  if (!marmitasDia || marmitasDia.length === 0) {
    elements.totalMarmitaAtual.textContent = "0";
    return;
  }

  const marmitaAtual = marmitasDia[state.marmitaAtualIndex];
  elements.totalMarmitaAtual.textContent =
    calcularTotalMarmita(marmitaAtual).toFixed(0);

  marmitaAtual.alimentos.forEach((item, index) => {
    const li = document.createElement("li");

    // Capitaliza a primeira letra do alimento para estética
    const nomeAlimento =
      item.alimento.charAt(0).toUpperCase() +
      item.alimento.slice(1).replace("_", " ");

    const texto = document.createTextNode(
      `${nomeAlimento} - ${item.gramas}g (${item.kcal.toFixed(0)} kcal)`,
    );

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.addEventListener("click", () => removerAlimento(index));

    li.appendChild(texto);
    li.appendChild(btn);
    elements.marmitaList.appendChild(li);
  });
}

function atualizarSelectMarmitas() {
  elements.marmitaSelect.innerHTML = "";

  state.marmitas[state.diaAtual].forEach((marmita, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = marmita.nome;
    elements.marmitaSelect.appendChild(option);
  });

  elements.marmitaSelect.value = state.marmitaAtualIndex;
}

// ===============================
// CONTROLE DE METAS E STATUS
// ===============================

function salvarMeta() {
  const meta = Number(elements.metaInput.value);

  if (meta <= 0) {
    alert("Informe uma meta diária válida.");
    return;
  }

  state.metaDiaria = meta;
  render();
  salvarDados();
}

function atualizarStatusDia(totalDia) {
  if (state.metaDiaria <= 0) {
    elements.statusDia.textContent = "Defina uma meta diária";
    elements.statusDia.className = "";
    return;
  }

  // Se o total do dia estiver muito próximo da meta (ex: entre 90% e 100%),
  // ou se você quiser usar regras específicas de "Levemente acima", adapte aqui.
  if (totalDia > state.metaDiaria) {
    elements.statusDia.textContent = "Acima da meta";
    elements.statusDia.className = "status-perigo";
  } else if (totalDia >= state.metaDiaria * 0.9) {
    elements.statusDia.textContent = "Próximo à meta";
    elements.statusDia.className = "status-alerta";
  } else {
    elements.statusDia.textContent = "Dentro da meta";
    elements.statusDia.className = "status-dentro";
  }
}

// ===============================
// REMOVER MARMITA INTEIRA
// ===============================

function removerMarmita() {
  const marmitasDia = state.marmitas[state.diaAtual];
  if (marmitasDia.length === 0) return;

  const confirmar = confirm(
    "Deseja realmente remover esta marmita por completo?",
  );
  if (!confirmar) return;

  marmitasDia.splice(state.marmitaAtualIndex, 1);

  if (state.marmitaAtualIndex > 0) {
    state.marmitaAtualIndex--;
  }

  if (marmitasDia.length === 0) {
    criarNovaMarmita();
  } else {
    render();
    salvarDados();
  }
}

// ===============================
// INICIALIZAÇÃO da APLICAÇÃO
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  carregarDados();

  elements.diaSelect.value = state.diaAtual;
  elements.metaInput.value = state.metaDiaria || "";

  if (state.marmitas[state.diaAtual].length === 0) {
    criarNovaMarmita();
  } else {
    render();
  }
});
