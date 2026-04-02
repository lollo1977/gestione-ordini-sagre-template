# Setup con Supabase Database

## Perché Supabase?
- **Gratuito** fino a 500MB
- **Backup automatici**
- **Dashboard web** per gestire i dati
- **API REST automatiche**
- **Più affidabile** di database gratuiti

## Setup Passo-Passo

### 1. Crea Progetto Supabase
1. Vai su [supabase.com](https://supabase.com)
2. Crea account (gratuito)
3. "New Project"
4. Nome: `crcs-bergeggi`
5. Password database: **Salvala!**
6. Regione: Europe West (più vicina)

### 2. Ottieni Database URL
1. Nel tuo progetto Supabase
2. Settings → Database
3. Sezione "Connection string"
4. Copia "URI" 
5. Sostituisci `[YOUR-PASSWORD]` con la password

Esempio:
```
postgresql://postgres.abcdefg:password123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

### 3. Deploy su Render.com
1. Crea **Web Service** su Render
2. Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres.abcdefg:password123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
   ```

### 4. Prima Migrazione
Dopo il deploy:
1. Shell del Web Service su Render
2. `npm run db:push`
3. Le tabelle si creano automaticamente

## Vantaggi Supabase vs Render DB

| Feature | Supabase | Render DB |
|---------|----------|-----------|
| Spazio gratuito | 500MB | 1GB |
| Backup automatici | ✅ | Solo a pagamento |
| Dashboard web | ✅ | Basica |
| Uptime | 99.9% | 99% |
| Support | Community + Pro | Email |

## Gestione Dati

Con Supabase puoi:
- **Vedere i dati** via dashboard web
- **Fare backup** manuali
- **Esportare CSV** 
- **Query SQL** dirette
- **Monitoraggio** in tempo reale

Ideale per ristoranti e sagre che vogliono sicurezza sui dati!