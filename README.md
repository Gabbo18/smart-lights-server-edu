# SmartLights Server - Edu

**SmartLights Server - Edu** è un server progettato per la gestione di lampade domotiche e utenti in un contesto puramente didattico. L'obiettivo principale è offrire un esempio pratico per comprendere la gestione di API, autenticazione (base) e manipolazione dati.

---

## 📦 Installazione

Segui questi passaggi per configurare ed eseguire il progetto localmente.

### Prerequisiti

- **Node.js**
- **NPM**
- **MongoDB**

### Passaggi

1. Clona il repository:

   ```bash
   git clone https://github.com/Gabbo18/smart-lights.iftsdeamicis.com.git
   ```

2. Entra nella directory del progetto:

   ```bash
   cd SmartLights-Server
   ```

3. Installa le dipendenze:

   ```bash
   npm install
   ```

4. Configura il file **.env** con le variabili che troverai nel file '_env.txt_' nella cartella '_samples_'.

5. Avvia il server:
   ```bash
   npm start
   ```

In locale il server sarà disponibile all'indirizzo: http://localhost:3000.

---

## 🛠️ Tecnologie Utilizzate

- **Node.js**: Runtime JavaScript per il backend.
- **Express.js**: Framework per la creazione delle API REST.
- **MongoDB**: Database NoSQL per la gestione dei dati.
- **JWT**: Autenticazione basata su token (attenzione: autenticazione non completa)

---

> **⚠️ Attenzione**: Questo progetto è pensato esclusivamente per scopi educativi e non è completo di tutte le funzionalità necessarie per un utilizzo sicuro in produzione.
