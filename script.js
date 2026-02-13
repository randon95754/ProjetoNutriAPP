// kcal por 100g
const calorias = {
  frango: 165,
  arroz: 130,
  ovo: 155,
  carne: 250,
  batata: 77,
  queijo: 300,
  creme_galinha: 90,
  maca: 52
};

let marmitas = {
  segunda: [],
  terca: [],
  quarta: [],
  quinta: [],
  sexta: [],
  sabado: [],
  domingo: []
};

let diaAtual = "segunda";
let marmitaAtualIndex = 0;
let metaDiaria = 0;

// ===============================
// SALVAR E CARREGAR DADOS
// ===============================

function salvarDados() {
  const dados = {
    marmitas,
    metaDiaria,
    diaAtual,
    marmitaAtualIndex
  };

  localStorage.setItem("nutriDados", JSON.stringify(dados));
}

function carregarDados() {
  const dadosSalvos = localStorage.getItem("nutriDados");

  if (dadosSalvos) {
    const dados = JSON.parse(dadosSalvos);

    marmitas = dados.marmitas || marmitas;
    metaDiaria = dados.metaDiaria || 0;
    diaAtual = dados.diaAtual || "segunda";
    marmitaAtualIndex = dados.marmitaAtualIndex || 0;
  }
}

// ===============================
// TROCAR DIA
// ===============================

function trocarMarmita() {
  diaAtual = document.getElementById("diaSelect").value;

  if (marmitas[diaAtual].length === 0) {
    criarNovaMarmita();
  } else {
    marmitaAtualIndex = 0;
  }

  atualizarSelectMarmitas();
  atualizarLista();
  salvarDados();
}

// ===============================
// CRIAR NOVA MARMITA
// ===============================

function criarNovaMarmita() {
  const nova = {
    nome: "Marmita " + (marmitas[diaAtual].length + 1),
    alimentos: []
  };

  marmitas[diaAtual].push(nova);
  marmitaAtualIndex = marmitas[diaAtual].length - 1;

  atualizarSelectMarmitas();
  atualizarLista();
  salvarDados();
}

// ===============================
// TROCAR MARMITA DO DIA
// ===============================

function trocarMarmitaSelecionada() {
  marmitaAtualIndex = Number(document.getElementById("marmitaSelect").value);
  atualizarLista();
  salvarDados();
}

// ===============================
// ADICIONAR ALIMENTO
// ===============================

function addAlimento() {
  const alimento = document.getElementById("alimentoSelect").value;
  const gramas = Number(document.getElementById("gramasInput").value);

  if (!alimento || gramas <= 0) {
    alert("Selecione alimento e informe gramas.");
    return;
  }

  const kcal = (calorias[alimento] * gramas) / 100;

  marmitas[diaAtual][marmitaAtualIndex].alimentos.push({
    alimento,
    gramas,
    kcal
  });

  document.getElementById("gramasInput").value = "";

  atualizarLista();
  salvarDados();
}

// ===============================
// REMOVER ALIMENTO
// ===============================

function removerAlimento(index) {
  marmitas[diaAtual][marmitaAtualIndex].alimentos.splice(index, 1);

  atualizarLista();
  salvarDados();
}

// ===============================
// ATUALIZAR LISTA
// ===============================

function atualizarLista() {
  const lista = document.getElementById("marmitaList");
  lista.innerHTML = "";

  if (marmitas[diaAtual].length === 0) {
    document.getElementById("totalCal").textContent = "0";
    return;
  }

  const marmitaAtual = marmitas[diaAtual][marmitaAtualIndex];
  let totalMarmita = 0;

  marmitaAtual.alimentos.forEach((item, index) => {
    totalMarmita += item.kcal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.alimento} - ${item.gramas}g (${item.kcal.toFixed(0)} kcal)
      <button onclick="removerAlimento(${index})">❌</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById("totalMarmitaAtual").textContent = totalMarmita.toFixed(0);

  atualizarTotalDia();
  atualizarTotalSemana();
}

// ===============================
// SELECT DE MARMITAS
// ===============================

function atualizarSelectMarmitas() {
  const select = document.getElementById("marmitaSelect");
  select.innerHTML = "";

  marmitas[diaAtual].forEach((m, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = m.nome;
    select.appendChild(option);
  });

  select.value = marmitaAtualIndex;
}

// ===============================
// META
// ===============================

function salvarMeta() {
  const meta = Number(document.getElementById("metaInput").value);

  if (meta <= 0) {
    alert("Informe meta válida.");
    return;
  }

  metaDiaria = meta;

  atualizarStatusDia();
  salvarDados();
}

function atualizarStatusDia() {
  if (metaDiaria <= 0) return;

  let totalDia = 0;

  marmitas[diaAtual].forEach(m => {
    m.alimentos.forEach(a => {
      totalDia += a.kcal;
    });
  });

  const status = document.getElementById("statusDia");

  if (totalDia <= metaDiaria) {
    status.textContent = "Dentro da meta";
  } else {
    status.textContent = "Acima da meta";
  }
}

// ===============================
// TOTAL DIA
// ===============================

function atualizarTotalDia() {
  let totalDia = 0;

  marmitas[diaAtual].forEach(marmita => {
    marmita.alimentos.forEach(alimento => {
      totalDia += alimento.kcal;
    });
  });

  document.getElementById("totalCal").textContent = totalDia.toFixed(0);

  atualizarStatusDia();
}

// ===============================
// TOTAL SEMANA
// ===============================

function atualizarTotalSemana() {
  let totalSemana = 0;

  for (let dia in marmitas) {
    marmitas[dia].forEach(marmita => {
      marmita.alimentos.forEach(alimento => {
        totalSemana += alimento.kcal;
      });
    });
  }

  document.getElementById("totalSemana").textContent = totalSemana.toFixed(0);
}

// ===============================
// INICIALIZAÇÃO
// ===============================

carregarDados();

if (marmitas[diaAtual].length === 0) {
  criarNovaMarmita();
} else {
  atualizarSelectMarmitas();
  atualizarLista();
}
