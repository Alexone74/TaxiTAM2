/**
 * MODALITÀ SIMULAZIONE D'ESAME
 * Questo file contiene tutte le funzioni necessarie per aggiungere
 * la modalità di simulazione d'esame all'applicazione quiz esistente.
 * 
 * Istruzioni: 
 * 1. Aggiungi questo script alla fine del file index.html prima della chiusura di </body>
 * 2. All'interno della funzione QuizApp() aggiungi le nuove variabili di stato
 */

// ---- INIZIO CODICE DA AGGIUNGERE A QuizApp() ----
// Aggiungi queste variabili di stato nella funzione QuizApp()
/*
const [isEsameMode, setIsEsameMode] = useState(false);
const [risposteEsame, setRisposteEsame] = useState([]);
const [linguaEsame, setLinguaEsame] = useState('');
*/
// ---- FINE CODICE DA AGGIUNGERE A QuizApp() ----

// Funzioni per la simulazione d'esame
function selezionaDomandeEsame(quizData, linguaSelezionata = 'Inglese') {
  const numeroDomande = 4; // Numero di domande per categoria
  const domandeEsame = [];
  
  // Categorie fisse richieste
  const categorieRichieste = ['Geografia', 'Normativa Statale e Regionale', 'Regolamento e Comportamento'];
  
  // Aggiungiamo le domande per le categorie richieste
  categorieRichieste.forEach(categoria => {
    // Filtra tutte le domande della categoria corrente
    const domandeDiCategoria = quizData.domande.filter(domanda => domanda.categoria === categoria);
    
    // Mischia le domande per avere una selezione casuale
    const domandeShuffled = [...domandeDiCategoria].sort(() => Math.random() - 0.5);
    
    // Seleziona solo il numero di domande richiesto
    const domandeSelezionate = domandeShuffled.slice(0, numeroDomande);
    
    // Aggiungi all'array delle domande d'esame
    domandeEsame.push(...domandeSelezionate);
  });
  
  // Aggiungi domande della lingua selezionata
  const domandeLingua = quizData.domande.filter(domanda => domanda.categoria === linguaSelezionata);
  const domandeLinguaShuffled = [...domandeLingua].sort(() => Math.random() - 0.5);
  const domandeLinguaSelezionate = domandeLinguaShuffled.slice(0, numeroDomande);
  domandeEsame.push(...domandeLinguaSelezionate);
  
  // Mescola tutte le domande per avere un ordine casuale nell'esame
  return domandeEsame.sort(() => Math.random() - 0.5);
}

// Calcola il punteggio d'esame
function calcolaPunteggioEsame(risposteDate, domandeEsame) {
  let punteggioTotale = 0;
  let erroriTotali = 0;
  let punteggioPerCategoria = {
    'Geografia': { punti: 0, totale: 0, errori: 0 },
    'Normativa Statale e Regionale': { punti: 0, totale: 0, errori: 0 },
    'Regolamento e Comportamento': { punti: 0, totale: 0, errori: 0 },
    'Lingua': { punti: 0, totale: 0, errori: 0 }
  };
  
  domandeEsame.forEach((domanda, index) => {
    const risposta = risposteDate[index];
    let categoria = domanda.categoria;
    
    // Raggruppa tutte le lingue sotto "Lingua"
    if (['Inglese', 'Francese', 'Spagnolo', 'Tedesco'].includes(categoria)) {
      categoria = 'Lingua';
    }
    
    punteggioPerCategoria[categoria].totale += 1;
    
    if (risposta === domanda.risposta_corretta) {
      punteggioTotale += 1;
      punteggioPerCategoria[categoria].punti += 1;
    } else {
      // Conta gli errori
      punteggioPerCategoria[categoria].errori += 1;
      erroriTotali += 1;
    }
  });
  
  const percentualeGlobale = Math.round((punteggioTotale / domandeEsame.length) * 100);
  
  // Verifica soglia di superamento:
  // 1. Non più di 4 errori in totale
  // 2. Non più di 2 errori per categoria
  const superato = erroriTotali <= 4 && Object.values(punteggioPerCategoria).every(cat => 
    cat.errori <= 2
  );
  
  return {
    punteggioTotale,
    punteggioPerCategoria,
    percentualeGlobale,
    erroriTotali,
    superato
  };
}

// Inizializza le modifiche alla UI dopo il caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
  // Aggiungi il pulsante per la simulazione d'esame nella home
  const aggiungiPulsanteSimulazione = function() {
    // Trova il div contenitore nella home page
    const homeContainer = document.querySelector('.max-w-2xl .p-6');
    if (!homeContainer) return;
    
    // Trova il pulsante "Inizia Quiz"
    const startQuizButton = homeContainer.querySelector('button');
    if (!startQuizButton) return;
    
    // Crea il div per il pulsante simulazione
    const simulazioneDiv = document.createElement('div');
    simulazioneDiv.className = 'mt-6 mb-3';
    simulazioneDiv.innerHTML = `
      <button
        id="startEsameBtn"
        class="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-xl 
                font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <i data-lucide="Award" class="w-5 h-5"></i>
        Simulazione d'Esame
      </button>
      <p class="text-sm text-gray-600 mt-2 text-center">
        4 domande per ciascuna categoria: Geografia, Normativa, Regolamento e una lingua a scelta
      </p>
    `;
    
    // Inserisci prima del pulsante Inizia Quiz
    startQuizButton.parentNode.insertBefore(simulazioneDiv, startQuizButton);
    
    // Aggiungi evento al nuovo pulsante
    document.getElementById('startEsameBtn').addEventListener('click', iniziaSimulazioneEsame);
    
    // Ricrea le icone Lucide
    lucide.createIcons();
  };
  
  // Funzione per iniziare la simulazione d'esame
  window.iniziaSimulazioneEsame = function() {
    // Ottieni l'app globale
    const appContainer = document.querySelector('.max-w-2xl');
    if (!appContainer) return;
    
    // Cambia lo schermo alla selezione della lingua
    window.setScreen = window.setScreen || function(screen) {
      // Cambia il valore dello stato 'screen'
      const event = new CustomEvent('changeScreen', {
        detail: { screen: screen }
      });
      document.dispatchEvent(event);
    };
    
    window.setScreen('custom-screen');
    
    // Mostra la selezione della lingua
    const contenitore = appContainer.querySelector('.p-6');
    if (contenitore) {
      contenitore.innerHTML = `
        <div class="text-center space-y-3 mb-6">
          <i data-lucide="Award" class="mx-auto text-green-600 w-10 h-10"></i>
          <h2 class="text-2xl font-bold text-gray-800">Simulazione d'Esame</h2>
          <p class="text-gray-600">Seleziona la lingua per la simulazione</p>
        </div>
        
        <div class="p-4 bg-white rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Seleziona la lingua per l'esame</h3>
          <div class="grid grid-cols-2 gap-3">
            <button 
              id="selectIngleseBtn"
              class="p-3 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50 transition-all"
            >
              <div class="font-medium">Inglese</div>
            </button>
            <button 
              id="selectFranceseBtn"
              class="p-3 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50 transition-all"
            >
              <div class="font-medium">Francese</div>
            </button>
            <button 
              id="selectSpagnoloBtn"
              class="p-3 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50 transition-all"
            >
              <div class="font-medium">Spagnolo</div>
            </button>
            <button 
              id="selectTedescoBtn"
              class="p-3 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50 transition-all"
            >
              <div class="font-medium">Tedesco</div>
            </button>
          </div>
        </div>
        
        <button
          id="backToHomeBtn"
          class="w-full bg-gray-200 text-gray-700 p-3 rounded-xl 
                font-medium hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <i data-lucide="Home" class="w-4 h-4"></i>
          Torna alla Home
        </button>
      `;
      
      // Aggiungi eventi ai pulsanti
      document.getElementById('selectIngleseBtn').addEventListener('click', () => selezionaLingua('Inglese'));
      document.getElementById('selectFranceseBtn').addEventListener('click', () => selezionaLingua('Francese'));
      document.getElementById('selectSpagnoloBtn').addEventListener('click', () => selezionaLingua('Spagnolo'));
      document.getElementById('selectTedescoBtn').addEventListener('click', () => selezionaLingua('Tedesco'));
      document.getElementById('backToHomeBtn').addEventListener('click', () => window.setScreen('home'));
      
      // Ricrea le icone per i nuovi elementi aggiunti
      lucide.createIcons();
    }
  };
  
  // Funzione per selezionare la lingua e avviare l'esame
  window.selezionaLingua = function(lingua) {
    // Accedi alle funzioni dell'app originale
    const quizData = window.quizData || JSON.parse(localStorage.getItem('quizData'));
    if (!quizData) {
      alert('Errore: impossibile accedere ai dati del quiz');
      return;
    }
    
    // Seleziona le domande per l'esame
    const domandeEsame = selezionaDomandeEsame(quizData, lingua);
    
    // Salva lo stato dell'esame in localStorage
    localStorage.setItem('isEsameMode', 'true');
    localStorage.setItem('linguaEsame', lingua);
    localStorage.setItem('domandeEsame', JSON.stringify(domandeEsame));
    localStorage.setItem('risposteEsame', JSON.stringify(new Array(domandeEsame.length).fill(null)));
    
    // Imposta le domande e avvia l'esame usando le funzioni dell'app originale
    window.setSelectedQuestions = window.setSelectedQuestions || function(questions) {
      localStorage.setItem('selectedQuestions', JSON.stringify(questions));
      const event = new CustomEvent('updateQuestions', {
        detail: { questions: questions }
      });
      document.dispatchEvent(event);
    };
    
    window.setSelectedQuestions(domandeEsame);
    
    // Altre funzioni necessarie
    const resetState = function() {
      // Reset dello stato del quiz
      localStorage.setItem('currentQuestion', '0');
      localStorage.setItem('score', '0');
      localStorage.setItem('wrongQuestions', '[]');
      localStorage.setItem('answerGiven', 'false');
      localStorage.setItem('selectedAnswer', 'null');
      
      const event = new CustomEvent('resetQuizState');
      document.dispatchEvent(event);
    };
    
    resetState();
    window.setScreen('quiz');
    
    // Aggiorna l'interfaccia per mostrare che è una simulazione d'esame
    setTimeout(() => {
      updateUIForExamMode(lingua);
    }, 100);
  };
  
  // Funzione per aggiornare l'UI in modalità esame
  function updateUIForExamMode(lingua) {
    const header = document.querySelector('.max-w-2xl .p-6 > div.mb-6');
    if (header) {
      const progressBar = header.querySelector('.h-2');
      if (progressBar) {
        const progressHTML = progressBar.outerHTML;
        
        header.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Simulazione d'Esame</span>
            <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Lingua: ${lingua}</span>
          </div>
          ${progressHTML}
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm text-gray-600">
              Domanda ${parseInt(localStorage.getItem('currentQuestion') || '0') + 1} di ${JSON.parse(localStorage.getItem('selectedQuestions') || '[]').length}
            </span>
            <button
              id="abbandonaBtn"
              class="bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 
                    text-red-600 px-4 py-2 rounded-lg transition-all duration-200 
                    flex items-center gap-2 shadow-sm"
            >
              <i data-lucide="Home" class="w-4 h-4"></i>
              <span class="font-medium">Abbandona</span>
            </button>
          </div>
        `;
        
        // Ricrea le icone per i nuovi elementi aggiunti
        lucide.createIcons();
        
        // Aggiungi il gestore per l'abbandono
        document.getElementById('abbandonaBtn').addEventListener('click', abbandonaSimulazione);
      }
    }
  }
  
  // Funzione per abbandonare la simulazione
  window.abbandonaSimulazione = function() {
    if (confirm('Sei sicuro di voler abbandonare la simulazione? I progressi andranno persi.')) {
      localStorage.removeItem('isEsameMode');
      localStorage.removeItem('linguaEsame');
      localStorage.removeItem('domandeEsame');
      localStorage.removeItem('risposteEsame');
      window.setScreen('home');
    }
  };
  
  // Funzione per tornare alla home dai risultati
  window.tornaAllaHome = function() {
    localStorage.removeItem('isEsameMode');
    localStorage.removeItem('linguaEsame');
    localStorage.removeItem('domandeEsame');
    localStorage.removeItem('risposteEsame');
    window.setScreen('home');
  };
  
  // Intercetta il click sulle opzioni di risposta per salvare le risposte dell'esame
  document.addEventListener('click', function(e) {
    // Verifica se siamo in modalità esame
    const isEsameMode = localStorage.getItem('isEsameMode') === 'true';
    if (!isEsameMode) return;
    
    // Verifica se il click è su un'opzione di risposta
    if (e.target.classList.contains('w-full') && 
        e.target.classList.contains('p-4') && 
        e.target.classList.contains('rounded-xl')) {
      
      // Ottieni l'indice della risposta
      const opzioni = Array.from(document.querySelectorAll('.w-full.p-4.rounded-xl:not(#backToHomeBtn):not(#abbandonaBtn)'));
      const selectedIndex = opzioni.indexOf(e.target);
      
      if (selectedIndex >= 0) {
        // Ottieni l'indice della domanda corrente e salva la risposta
        const currentQuestion = parseInt(localStorage.getItem('currentQuestion') || '0');
        const risposteEsame = JSON.parse(localStorage.getItem('risposteEsame') || '[]');
        
        // Aggiorna l'array delle risposte
        risposteEsame[currentQuestion] = selectedIndex;
        localStorage.setItem('risposteEsame', JSON.stringify(risposteEsame));
      }
    }
  });
  
  // Intercetta la transizione alla pagina dei risultati
  document.addEventListener('changeScreen', function(e) {
    // Verifica se stiamo andando alla pagina dei risultati mentre siamo in modalità esame
    if (e.detail.screen === 'results' && localStorage.getItem('isEsameMode') === 'true') {
      // Sostituisci con la visualizzazione dei risultati dell'esame
      setTimeout(() => {
        const domandeEsame = JSON.parse(localStorage.getItem('domandeEsame') || '[]');
        const risposteEsame = JSON.parse(localStorage.getItem('risposteEsame') || '[]');
        
        // Calcola i risultati dell'esame
        const risultatiEsame = calcolaPunteggioEsame(risposteEsame, domandeEsame);
        
        // Trova il container dei risultati
        const contenitoreRisultati = document.querySelector('.max-w-2xl .p-6');
        if (contenitoreRisultati) {
          // Sostituisci il contenuto con i risultati dell'esame
          contenitoreRisultati.innerHTML = `
            <div class="text-center space-y-6">
              <div class="${risultatiEsame.superato ? 'text-green-600' : 'text-red-600'} font-bold text-3xl">
                ${risultatiEsame.superato ? 'ESAME SUPERATO' : 'ESAME NON SUPERATO'}
              </div>
              
              <div>
                <div class="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                           bg-clip-text text-transparent mb-2">
                  ${risultatiEsame.percentualeGlobale}%
                </div>
                <div class="text-xl text-gray-600">
                  ${risultatiEsame.punteggioTotale} risposte corrette su ${Object.values(risultatiEsame.punteggioPerCategoria).reduce((acc, cat) => acc + cat.totale, 0)}
                </div>
              </div>
              
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-3">Dettaglio per categoria</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${Object.entries(risultatiEsame.punteggioPerCategoria).map(([categoria, { punti, totale, errori }]) => {
                    const percentuale = Math.round((punti / totale) * 100);
                    const superatoCategoria = errori <= 2; // Non più di 2 errori per categoria
                    
                    return `
                      <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="font-medium text-lg">${categoria}</div>
                        <div class="text-2xl font-bold ${superatoCategoria ? 'text-green-600' : 'text-red-600'}">
                          ${punti}/${totale} (${percentuale}%)
                        </div>
                        <div class="text-sm ${superatoCategoria ? 'text-green-600' : 'text-red-600'}">
                          ${errori} errori
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
                
                <div class="bg-gray-100 p-4 rounded-lg mt-4">
                  <div class="font-medium text-lg text-center">Errori Totali</div>
                  <div class="text-2xl font-bold text-center ${risultatiEsame.erroriTotali <= 4 ? 'text-green-600' : 'text-red-600'}">
                    ${risultatiEsame.erroriTotali}/4
                  </div>
                </div>
                
                <p class="mt-4 text-sm text-gray-500">
                  Per superare l'esame non puoi commettere più di 4 errori in totale e non più di 2 errori per categoria.
                </p>
              </div>
              
              <button
                onclick="tornaAllaHome()"
                class="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 
                       text-white p-4 rounded-xl font-semibold hover:opacity-90 
                       transition-all duration-200 flex items-center justify-center gap-2"
              >
                <i data-lucide="Home" class="w-5 h-5"></i>
                Torna alla Home
              </button>
            </div>
          `;
          
          // Ricrea le icone per i nuovi elementi aggiunti
          lucide.createIcons();
        }
      }, 100);
    }
  });
  
  // Verifica periodicamente se siamo nella home e aggiungi il pulsante se necessario
  const checkInterval = setInterval(() => {
    const isHomePage = document.querySelector('.max-w-2xl .p-6 .text-center .text-gray-600')?.textContent.includes('Seleziona le categorie');
    
    if (isHomePage) {
      const simulazioneBtn = document.getElementById('startEsameBtn');
      if (!simulazioneBtn) {
        aggiungiPulsanteSimulazione();
      }
    }
  }, 1000);
});

// Fine del codice aggiuntivo