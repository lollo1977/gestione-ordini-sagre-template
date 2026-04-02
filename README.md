# Restaurant POS System

Sistema di gestione ordini per ristoranti e sagre con interfaccia italiana.

## Funzionalità

- ✅ Creazione ordini con numero coperti
- ✅ Gestione resto automatica per pagamenti cash
- ✅ Stampa scontrini cucina e cliente
- ✅ Menu management con categorie
- ✅ Reports e analytics
- ✅ Sincronizzazione real-time tra casse
- ✅ Supporto tavoli alfanumerici (A1, VIP, etc.)

## Setup Locale

1. Clona il repository
2. Installa dipendenze: `npm install`
3. Configura DATABASE_URL nel file .env
4. Applica schema: `npm run db:push`
5. Avvia sviluppo: `npm run dev`

## Deploy su Render.com

### Opzione 1: Con Database Render
1. Collega il tuo repository GitHub a Render
2. Render.com rileverà automaticamente il `render.yaml`
3. Creerà sia l'app web che il database PostgreSQL

### Opzione 2: Con Supabase Database (NON TESTATO)
1. Crea un progetto su [supabase.com](https://supabase.com)
2. Vai in Settings → Database → Connection String
3. Copia la URI connection string
4. Crea un Web Service su Render con:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `DATABASE_URL` (copia dal database)

### Dopo il Deploy
1. Vai su "Shell" del tuo web service
2. Esegui: `npm run db:push` per creare le tabelle
3. Il sistema sarà pronto per l'uso

## Environment Variables

- `DATABASE_URL` - Stringa connessione PostgreSQL
- `NODE_ENV` - production/development
- `PORT` - Porta del server (auto su Render)

## Struttura Database

- `dishes` - Menu items con prezzo e categoria
- `orders` - Ordini con tavolo, cliente, coperti, totale
- `order_items` - Dettaglio piatti per ordine

## Stack Tecnologico

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript
- Database: PostgreSQL + Drizzle ORM
- Real-time: WebSockets
- Deploy: Render.com ready
