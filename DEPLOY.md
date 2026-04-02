# Guida Deploy su Render.com

## Preparazione del Database

Il progetto è pronto per il deploy su Render.com. Ecco i passi:

### 1. Setup Repository
- Carica il progetto su GitHub
- Assicurati che tutti i file siano committati

### 2A. Database Render (Opzione 1)
1. Vai su [render.com](https://render.com)
2. Crea un nuovo **PostgreSQL** service
3. Nome: `crcs-bergeggi-db`
4. Piano: **Free** (per iniziare)
5. Salva la **External Database URL** che ti viene fornita

### 2B. Database Supabase (Opzione 2 - Consigliata)
1. Vai su [supabase.com](https://supabase.com)
2. Crea un nuovo progetto
3. Nome: `crcs-bergeggi`
4. Vai in **Settings → Database**
5. Copia la **Connection String** (URI format)
6. Sostituisci `[YOUR-PASSWORD]` con la password del database

### 3. Crea Web Service
1. Crea un nuovo **Web Service**
2. Collega il tuo repository GitHub
3. Configurazione:
   - **Name**: `restaurant-pos`
   - **Environment**: `Node`
   - **Region**: Scegli la più vicina
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 4. Environment Variables
Aggiungi queste variabili nel Web Service:
```
NODE_ENV=production
DATABASE_URL=[LA_TUA_DATABASE_URL_DA_RENDER]
```

### 5. Prima Migrazione Database
Dopo il primo deploy:
1. Vai alla sezione **Shell** del tuo web service
2. Esegui: `npm run db:push`
3. Questo creerà tutte le tabelle necessarie

### 6. Aggiungi Dati di Test (Opzionale)
Sempre dalla Shell:
```bash
# Connettersi al database e aggiungere piatti
psql $DATABASE_URL
```

Poi esegui:
```sql
INSERT INTO dishes (name, price, category) VALUES 
('Spaghetti Carbonara', '12.00', 'primi'),
('Bistecca alla griglia', '18.00', 'secondi'),
('Insalata mista', '6.00', 'contorni'),
('Tiramisù', '5.00', 'dolci'),
('Acqua naturale', '2.00', 'bevande');
```

## Costi Render.com
- **Database PostgreSQL**: Gratuito (fino a 1GB)
- **Web Service**: Gratuito (con limitazioni)
- **Upgrade**: Da $7/mese per servizi illimitati

## Post-Deploy
Il tuo sistema sarà disponibile su:
`https://restaurant-pos.onrender.com`

Tutte le funzionalità funzioneranno:
- ✅ Creazione ordini con coperti
- ✅ Gestione resto contanti
- ✅ Stampa scontrini
- ✅ Menu management
- ✅ Sincronizzazione casse
- ✅ Reports analytics

## Note Importanti
- Il primo caricamento può essere lento (piano gratuito)
- I dati sono persistenti nel database PostgreSQL
- Backup automatici disponibili sui piani a pagamento