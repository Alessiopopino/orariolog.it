
# Orariolog.it - Sito calendario (Calendario Formetica Log.it)

Questa cartella contiene un sito statico semplice e interattivo per mostrare il calendario delle lezioni.
Hai tutto pronto per pubblicarlo su GitHub + Netlify in modo che i cambiamenti su GitHub vengano pubblicati automaticamente.

## Contenuto
- `index.html` - pagina principale (lista + calendario)
- `style.css` - stili
- `script.js` - logica per caricare `orario.json` e rendere la pagina interattiva
- `orario.json` - file dati (ottobre 2025, tutte le lezioni fornite)
- `netlify.toml` - file di configurazione per Netlify

## Come pubblicare (ripasso rapido)
1. Crea un account GitHub (https://github.com) se non ce l'hai.
2. Crea un nuovo repository (es. `orariolog.it`).
3. Carica tutti i file in questo repository (puoi trascinarli nella UI web di GitHub).
4. Vai su https://www.netlify.com/ e registrati con "Continue with GitHub" (autorizza Netlify).
5. In Netlify: "Add new site" → "Import from GitHub" → scegli il repository → Deploy.
6. Netlify creerà un sito con un URL tipo `https://orariolog-netlify.app`. Puoi personalizzare il nome nelle impostazioni del sito.

## Come aggiornare l'orario
- Modifica `orario.json` (puoi farlo direttamente su GitHub: apri il file → l'icona della matita → salva).
- Dopo il salvataggio, Netlify rileverà il cambiamento e pubblicherà il nuovo sito automaticamente in pochi secondi.

## Note tecniche
- `orario.json` è un array di oggetti:
  - `date` (YYYY-MM-DD)
  - `start` e `end` (ore)
  - `title`
  - `teacher`
  - `location`
  - `notes` (opzionale)
- Se vuoi aggiungere altri mesi, aggiungi eventi con date diverse (es. 2025-11-05). Il calendario mostra il mese corrente di default.

## Personalizzazioni
- Colori, font e animazioni si trovano in `style.css`.
- Se preferisci che io faccia il deploy per te, dammi temporaneamente accesso al repository (o segui la guida e poi dimmi quando è fatto: posso aiutarti a collegare Netlify).

---
