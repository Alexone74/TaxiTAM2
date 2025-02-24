import json
import sys

def valida_riga(numero_riga, riga, errori):
    parti = [p.strip() for p in riga.split('|')]
    
    # Controlla il numero di parti
    if len(parti) != 6:
        errori.append(f"Riga {numero_riga}: deve avere 6 parti (categoria | domanda | 3 opzioni | risposta), " 
                     f"trovate {len(parti)} parti")
        return False
    
    # Controlla che le parti non siano vuote
    for i, parte in enumerate(parti):
        if not parte:
            nomi_parti = ["Categoria", "Domanda", "Opzione 1", "Opzione 2", "Opzione 3", "Risposta corretta"]
            errori.append(f"Riga {numero_riga}: {nomi_parti[i]} non può essere vuoto")
            return False
    
    # Controlla che la risposta sia un numero valido
    try:
        risposta = int(parti[5])
        if risposta < 1 or risposta > 3:
            errori.append(f"Riga {numero_riga}: la risposta corretta deve essere 1, 2 o 3, trovato {risposta}")
            return False
    except ValueError:
        errori.append(f"Riga {numero_riga}: la risposta corretta deve essere un numero, trovato '{parti[5]}'")
        return False
    
    return True

def converti_txt_a_json(input_file, output_file):
    print("\nInizio validazione del file...")
    
    errori = []
    quiz_data = {
        "categorie": set(),
        "domande": []
    }
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            linee = f.readlines()
        
        # Conta le righe non vuote
        righe_totali = sum(1 for riga in linee if riga.strip())
        print(f"Trovate {righe_totali} domande da processare")
        
        for numero_riga, riga in enumerate(linee, 1):
            riga = riga.strip()
            if not riga:  # Salta le righe vuote
                continue
            
            if valida_riga(numero_riga, riga, errori):
                parti = [p.strip() for p in riga.split('|')]
                categoria = parti[0]
                quiz_data["categorie"].add(categoria)
                
                domanda = {
                    "categoria": categoria,
                    "testo": parti[1],
                    "opzioni": parti[2:5],
                    "risposta_corretta": int(parti[5]) - 1
                }
                quiz_data["domande"].append(domanda)
                
                # Mostra progresso
                sys.stdout.write(f"\rProcessate {len(quiz_data['domande'])} domande di {righe_totali}")
                sys.stdout.flush()
        
        print("\n")  # Nuova riga dopo la barra di progresso
        
        if errori:
            print("\n❌ Trovati errori durante la validazione:")
            for errore in errori:
                print(f"  • {errore}")
            print("\nCorreggi gli errori e riprova.")
            return False
        
        # Converti il set delle categorie in lista e ordina
        quiz_data["categorie"] = sorted(list(quiz_data["categorie"]))
        
        # Salva il JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(quiz_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Conversione completata con successo!")
        print(f"   • Domande processate: {len(quiz_data['domande'])}")
        print(f"   • Categorie trovate: {', '.join(quiz_data['categorie'])}")
        print(f"   • File JSON creato: {output_file}")
        return True
        
    except FileNotFoundError:
        print(f"\n❌ Errore: Il file '{input_file}' non è stato trovato")
        return False
    except Exception as e:
        print(f"\n❌ Errore imprevisto durante la conversione: {str(e)}")
        return False

if __name__ == "__main__":
    input_file = 'domande.txt'
    output_file = 'quiz.json'
    
    print("=== Convertitore Quiz ===")
    print(f"File di input: {input_file}")
    print(f"File di output: {output_file}")
    
    converti_txt_a_json(input_file, output_file)