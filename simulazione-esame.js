/**
 * SIMULAZIONE D'ESAME - VERSIONE SEMPLIFICATA
 * 
 * Questo script integra la modalità "Simulazione d'Esame" nell'app quiz esistente
 * in modo meno invasivo e senza modificare la struttura esistente.
 */

// Funzioni per simulazione esame
function selezionaDomandeEsame(quizData, linguaSelezionata) {
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

// Aggiungi questa funzione all'oggetto window
window.startSimulazioneEsame = function() {
  // Troveremo il componente React e modificheremo il suo stato
  const app = document.querySelector('#root');
  
  if (!app) {
    console.error("Impossibile trovare l'elemento root dell'applicazione");
    return;
  }
  
  // Modifica visivamente la pagina home per aggiungere il pulsante simulazione
  const buttonsContainer = document.querySelector('.p-6 .space-y-6');
  if (!buttonsContainer) return;
  
  // Trova il pulsante originale "Inizia Quiz"
  const startButton = buttonsContainer.querySelector('button');
  if (!startButton) return;
  
  // Crea un nuovo div per il pulsante simulazione (se non esiste già)
  if (!document.getElementById('simulazioneBtn')) {
    const simulazioneDiv = document.createElement('div');
    simulazioneDiv.className = 'mt-6 mb-4';
    simulazioneDiv.innerHTML = `
      <button
        id="simulazioneBtn"
        class="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-xl 
               font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <i data-lucide="Award" class="w-5 h-5"></i>
        Simulazione d'Esame
      </button>
      <p class="text-sm text-gray-600 mt-2 text-center">
        4 domande per ogni categoria: Geografia, Normativa, Regolamento e una lingua a scelta
      </p>
    `;
    
    // Inserisci prima del pulsante originale
    startButton.parentNode.insertBefore(simulazioneDiv, startButton);
    
    // Aggiungi l'evento click
    document.getElementById('simulazioneBtn').addEventListener('click', showLanguageSelection);
    
    // Ricrea le icone
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }
};

// Mostra la selezione della lingua
function showLanguageSelection() {
  // Trova il componente principale
  const mainContent = document.querySelector('.p-6');
  if (!mainContent) return;
  
  // Sostituisci il contenuto con la selezione della lingua
  mainContent.innerHTML = `
    <div class="text-center space-y-3 mb-6">
      <i data-lucide="Award" class="mx-auto text-green-600 w-10 h-10"></i>
      <h2 class="text-2xl font-bold text-gray-800">Simulazione d'Esame</h2>
      <p class="text-gray-600">Seleziona la lingua per la simulazione</p>
    </div>
    
    <div class="p-4 bg-white rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Seleziona la lingua per l'esame</h3>
      <div class="grid grid-cols-2 gap-3">
        <button 
          onclick="selezioneCompletata('Inglese')"
          class="p-3 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50 transition-all"
        >
          <div class="font-medium">Inglese</div>
        </button>
        <button 
          onclick="selezioneCompletata('Francese')"
          class="p-3 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50 transition-all"
        >
          <div class="font-medium">Francese</div>
        </button>
        <button 
          onclick="selezioneCompletata('Spagnolo')"
          class="p-3 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50 transition-all"
        >
          <div class="font-medium">Spagnolo</div>
        </button>
        <button 
          onclick="selezioneCompletata('Tedesco')"
          class="p-3 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 bg-indigo-50 transition-all"
        >
          <div class="font-medium">Tedesco</div>
        </button>
      </div>
    </div>
    
    <button
      onclick="tornaAllaHome()"
      class="w-full bg-gray-200 text-gray-700 p-3 rounded-xl 
             font-medium hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
    >
      <i data-lucide="Home" class="w-4 h-4"></i>
      Torna alla Home
    </button>
  `;
  
  // Aggiorna le icone
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
}

// Gestione della selezione della lingua completata
window.selezioneCompletata = function(lingua) {
  // Verifica se il quiz data è disponibile
  if (!window.quizData) {
    alert("Errore: dati del quiz non disponibili");
    return;
  }
  
  // Seleziona le domande per l'esame
  const domandeEsame = selezionaDomandeEsame(window.quizData, lingua);
  
  // Imposta le variabili per la modalità esame
  window.isEsameMode = true;
  window.linguaEsame = lingua;
  window.domandeEsame = domandeEsame;
  window.risposteEsame = new Array(domandeEsame.length).fill(null);
  
  // Copia le funzioni necessarie se non esistono nell'app originale
  if (!window.setSelectedQuestions) {
    window.setSelectedQuestions = function(domande) {
      window.selectedQuestions = domande;
    };
  }
  
  if (!window.setScreen) {
    window.setScreen = function(screen) {
      window.currentScreen = screen;
    };
  }
  
  // Imposta le domande e avvia l'esame
  window.setSelectedQuestions(domandeEsame);
  window.setScreen('quiz');
  window.currentQuestion = 0;
  window.score = 0;
  window.wrongQuestions = [];
  window.answerGiven = false;
  window.selectedAnswer = null;
  
  // Trova il componente del quiz
  const quizComponent = document.querySelector('.max-w-2xl');
  if (!quizComponent) return;
  
  // Simula il click sul pulsante "Inizia Quiz" per entrare nella modalità quiz
  const startQuizButton = document.querySelectorAll('button').item(1); // Il secondo pulsante dovrebbe essere "Inizia Quiz"
  if (startQuizButton) {
    startQuizButton.click();
    
    // Dopo un breve ritardo, aggiorna l'interfaccia per mostrare che è una simulazione d'esame
    setTimeout(() => {
      // Aggiorna l'intestazione per indicare che è una simulazione d'esame
      const headerQuiz = document.querySelector('.max-w-2xl .p-6 div:first-child');
      if (headerQuiz) {
        const barraProgresso = headerQuiz.querySelector('.h-2');
        if (barraProgresso) {
          const barraHTML = barraProgresso.outerHTML;
          const testoDomanda = headerQuiz.querySelector('.text-sm.text-gray-600').innerHTML;
          
          headerQuiz.innerHTML = `
            <div class="flex justify-between items-center mb-2">
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Simulazione d'Esame</span>
              <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Lingua: ${lingua}</span>
            </div>
            ${barraHTML}
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm text-gray-600">${testoDomanda}</span>
              <button
                onclick="abbandonaEsame()"
                class="bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 
                      text-red-600 px-4 py-2 rounded-lg transition-all duration-200 
                      flex items-center gap-2 shadow-sm"
              >
                <i data-lucide="LogOut" class="w-4 h-4"></i>
                <span class="font-medium">Abbandona</span>
              </button>
            </div>
          `;
          
          // Ricrea le icone
          if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
          }
        }
      }
    }, 300);
  }
};

// Funzione per tornare alla home
window.tornaAllaHome = function() {
  const homeButton = document.querySelector('button:has(i[data-lucide="Home"])');
  if (homeButton) {
    homeButton.click();
  } else {
    window.location.reload(); // Ricarica la pagina se non troviamo il pulsante home
  }
};

// Funzione per abbandonare l'esame
window.abbandonaEsame = function() {
  if (confirm('Sei sicuro di voler abbandonare la simulazione? I progressi andranno persi.')) {
    window.isEsameMode = false;
    window.tornaAllaHome();
  }
};

// Salva la risposta originale di ogni domanda
window.saveEsameAnswer = function(questionIndex, answerIndex) {
  if (window.isEsameMode && window.risposteEsame) {
    window.risposteEsame[questionIndex] = answerIndex;
  }
};

// Calcola il risultato dell'esame
window.calcolaRisultatoEsame = function() {
  // Verifica che siamo in modalità esame
  if (!window.isEsameMode || !window.domandeEsame || !window.risposteEsame) {
    return null;
  }
  
  let punteggioTotale = 0;
  let erroriTotali = 0;
  let punteggioPerCategoria = {
    'Geografia': { punti: 0, totale: 0, errori: 0 },
    'Normativa Statale e Regionale': { punti: 0, totale: 0, errori: 0 },
    'Regolamento e Comportamento': { punti: 0, totale: 0, errori: 0 },
    'Lingua': { punti: 0, totale: 0, errori: 0 }
  };
  
  window.domandeEsame.forEach((domanda, index) => {
    const risposta = window.risposteEsame[index];
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
  
  const percentualeGlobale = Math.round((punteggioTotale / window.domandeEsame.length) * 100);
  
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
};

// Mostra i risultati dell'esame
window.mostraRisultatiEsame = function() {
  // Calcola i risultati
  const risultati = window.calcolaRisultatoEsame();
  if (!risultati) return;
  
  // Trova il container dei risultati
  const resultsContainer = document.querySelector('.p-6');
  if (!resultsContainer) return;
  
  // Crea la visualizzazione dei risultati
  resultsContainer.innerHTML = `
    <div class="text-center space-y-6">
      <div class="${risultati.superato ? 'text-green-600' : 'text-red-600'} font-bold text-3xl">
        ${risultati.superato ? 'ESAME SUPERATO' : 'ESAME NON SUPERATO'}
      </div>
      
      <div>
        <div class="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                   bg-clip-text text-transparent mb-2">
          ${risultati.percentualeGlobale}%
        </div>
        <div class="text-xl text-gray-600">
          ${risultati.punteggioTotale} risposte corrette su ${Object.values(risultati.punteggioPerCategoria).reduce((acc, cat) => acc + cat.totale, 0)}
        </div>
      </div>
      
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-3">Dettaglio per categoria</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Object.entries(risultati.punteggioPerCategoria).map(([categoria, { punti, totale, errori }]) => {
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
          <div class="text-2xl font-bold text-center ${risultati.erroriTotali <= 4 ? 'text-green-600' : 'text-red-600'}">
            ${risultati.erroriTotali}/4
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
  
  // Ricrea le icone
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
};

// Inizializza la modalità simulazione dopo il caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
  // Controlla periodicamente se siamo nella home page
  const checkHomeInterval = setInterval(() => {
    // Verifica se siamo nella home
    const isHome = document.querySelector('.text-center .text-gray-600')?.textContent.includes('Seleziona');
    
    if (isHome) {
      // Verifica se il pulsante simulazione esiste già
      const simulazioneBtn = document.getElementById('simulazioneBtn');
      if (!simulazioneBtn) {
        window.startSimulazioneEsame();
      }
      
      // Salva il riferimento ai dati del quiz
      window.quizData = window.quizData || JSON.parse(localStorage.getItem('quizData'));
    }
  }, 1000);
  
  // Intercetta il completamento del quiz
  const checkResultsInterval = setInterval(() => {
    // Verifica se siamo nella pagina dei risultati e siamo in modalità esame
    const isResults = document.querySelector('.text-6xl.font-bold.bg-gradient-to-r');
    
    if (isResults && window.isEsameMode) {
      window.isEsameMode = false; // Reimposta la modalità
      window.mostraRisultatiEsame(); // Mostra i risultati dell'esame
    }
  }, 500);
});

// Aggiungi questa funzione per intercettare e salvare le risposte
document.addEventListener('click', function(e) {
  // Verifica se siamo in modalità esame
  if (!window.isEsameMode) return;
  
  // Verifica se è un clic su un'opzione di risposta
  if (e.target.closest('.w-full.p-4.rounded-xl') && !e.target.closest('button').id) {
    // Trova tutte le opzioni di risposta
    const options = Array.from(document.querySelectorAll('.w-full.p-4.rounded-xl'));
    const clickedOption = e.target.closest('.w-full.p-4.rounded-xl');
    
    // Trova l'indice dell'opzione cliccata
    const optionIndex = options.indexOf(clickedOption);
    
    // Salva la risposta
    if (optionIndex !== -1) {
      window.saveEsameAnswer(window.currentQuestion || 0, optionIndex);
    }
  }
});