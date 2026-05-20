# 🚀 NutriApp — Controle Alimentar Inteligente

Aplicação web progressiva (PWA) desenvolvida com JavaScript puro para controle alimentar semanal, permitindo o registro de refeições, cálculo automático de calorias e acompanhamento de metas diárias.

O sistema simula um fluxo real de planejamento nutricional com organização por dias da semana, marmitas e alimentos, oferecendo uma experiência leve, offline-first e responsiva.

---

# 🌐 Demonstração

## 📱 Aplicação em produção

🔗 https://spiffy-sprite-7d0e21.netlify.app/

---

# 📸 Preview

## 🖥️ Interface Principal

><img width="738" height="1600" alt="WhatsApp Image 2026-05-19 at 21 59 16" src="https://github.com/user-attachments/assets/81956647-c736-4675-be2f-76c321a0c233" />


---

# ✨ Funcionalidades

## 🍽️ Controle de refeições
- Criação de marmitas por dia da semana
- Adição de alimentos com peso em gramas
- Remoção de alimentos individualmente
- Organização por múltiplas marmitas por dia

---

## 🔥 Cálculo automático de calorias
- Base kcal por 100g de alimento
- Cálculo dinâmico por porção
- Total por marmita, dia e semana

---

## 📅 Organização semanal
- Estrutura completa dos 7 dias da semana
- Persistência de dados por dia
- Troca dinâmica de contexto (dia/marmita)

---

## 🎯 Sistema de metas
- Definição de meta calórica diária
- Status automático:
  - Dentro da meta
  - Próximo da meta
  - Acima da meta

---

## 💾 Persistência de dados
- Armazenamento via `localStorage`
- Recuperação automática ao recarregar página
- Sistema com debounce para otimização de performance

---

## 📱 PWA (Progressive Web App)
- Instalação como aplicativo no dispositivo
- Manifest configurado
- Service Worker ativo
- Experiência offline suportada

---

# 🧠 Objetivos do Projeto

Este projeto foi desenvolvido com foco em:

- Manipulação avançada de estado em JavaScript puro
- DOM dinâmico sem frameworks
- Persistência de dados no navegador
- Cálculos aplicados a dados reais
- Arquitetura modular em front-end vanilla
- Desenvolvimento de PWA funcional

---

# 🧱 Arquitetura da Aplicação

```bash
nutriapp/
│
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
└── assets/
```
---

# ⚙️ Possíveis melhorias futuras

- Integração com API de alimento (TACO/USDA)
- Gráficos de evolução calórica semanal
- Login e sincronização em nuvem
- Exportação de relatórios (PDF/CSV)
- Modo dark/light
- Componentização do JavaScript

---

# 📌 Observação

Este projeto foi construído com foco em aprendizado de arquitetura front-end sem frameworks, priorizando controle manual de estado, manipulação do DOM e funcionamento offline como PWA.

