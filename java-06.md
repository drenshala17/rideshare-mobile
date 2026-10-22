# RideShare — Java 6 · PWA dhe puna offline

## Çfarë ndërtova

Në këtë detyrë e përmirësova aplikacionin RideShare që të mbështesë PWA (Progressive Web App) dhe leximin e të dhënave pa internet.

Manifesti përshkruan aplikacionin dhe ikonat e tij, në mënyrë që shfletuesi ta njohë si aplikacion web që mund të instalohet.

Service Worker-i (`public/sw.js`) ndërmjetëson kërkesat dhe ruan skedarët në Cache Storage. Ai ruan faqen `offline.html`, ikonat dhe të dhënat publike të udhëtimeve nga API-ja `/api/udhetimet`.

Faqja `offline.html` mundëson leximin e kopjes së ruajtur në pajisje edhe kur nuk ka internet. Kjo kopje përmban informacione publike për udhëtimet dhe nuk konfirmon rezervime.

## Provat që bëra

### Prova 1: Manifesti dhe vizita online

Hapa aplikacionin në `http://localhost:3000`.

Kontrollova manifestin dhe ikonat e aplikacionit:

- `http://localhost:3000/manifest.webmanifest`
- `http://localhost:3000/icons/icon-192.png` — ikona me përmasa 192 × 192 pikselë.
- `http://localhost:3000/icons/icon-512.png` — ikona me përmasa 512 × 512 pikselë.

Kontrollova API-në `http://localhost:3000/api/udhetimet`, e cila ktheu të dhënat e tri udhëtimeve.

Në Chrome DevTools, te Application → Cache Storage, verifikova se cache-i `rideshare-public-v1` përmbante `offline.html`, të dy ikonat dhe `/api/udhetimet`.

Nuk e konfirmova instalimin e aplikacionit nga shfletuesi.

### Prova 2: Pa internet dhe pas rifreskimit

E simulova ndërprerjen e internetit në Chrome DevTools, te Network, duke zgjedhur Offline. Pastaj hapa `http://localhost:3000/offline.html` dhe e rifreskova faqen.

Faqja u hap nga Service Worker-i dhe shfaqi tri kartat e udhëtimeve nga kopja e ruajtur në pajisje.

Në Network pashë përgjigje `200` për faqen `offline.html` dhe për kërkesën e të dhënave `udhetimet`, të cilat u shërbyen nga Service Worker-i. Një kërkesë tjetër dështoi me `net::ERR_INTERNET_DISCONNECTED`, gjë që është e pritshme kur nuk ka internet.

Gjatë testit, udhëtimi Fushë Kosovë → AAB, me ID 2, shfaqej me orën `08:25`. Kjo ishte kopja e të dhënave që ishte ruajtur pas ndryshimit të orës në Neon.

Lista offline nuk konfirmon rezervime, sepse është kopje e të dhënave publike që mund të jetë e vjetër. Pa lidhje me serverin nuk mund të vërtetohet nëse ka ende vende të lira apo nëse një rezervim është kryer.

### Prova 3: Lidhja rikthehet

Në Neon kontrollova udhëtimin me ID 2 në tabelën `udhetimet`. Ora fillestare ishte `08:15`.

E ndryshova përkohësisht orën në `08:25` dhe e kontrollova që ndryshimi ishte ruajtur në databazë. Pastaj hapa aplikacionin online dhe verifikova se udhëtimi Fushë Kosovë → AAB shfaqej me orën `08:25`.

E simulova mungesën e internetit dhe hapa faqen `offline.html`. Edhe pa internet, kopja e ruajtur shfaqte orën `08:25`.

Pas kësaj, e riktheva orën e udhëtimit me ID 2 në Neon në vlerën fillestare `08:15`. E ktheva shfletuesin online dhe klikova butonin **Rifresko listën** në faqen offline. Lista u përditësua dhe udhëtimi u shfaq përsëri me orën `08:15`.

Në këtë mënyrë verifikova që të dhënat e ruajtura mund të lexohen offline dhe të rifreskohen pasi rikthehet lidhja me internetin.

## Ku gjendet puna

Repository: https://github.com/drenshala17/rideshare-mobile

Skedarët kryesorë të përdorur për PWA dhe funksionimin offline janë:

- `aplikacioni/src/app/manifest.ts`
- `aplikacioni/public/icons/icon-192.png`
- `aplikacioni/public/icons/icon-512.png`
- `aplikacioni/public/sw.js`
- `aplikacioni/public/offline.html`
- `aplikacioni/src/components/Pwa.tsx`
- `aplikacioni/src/app/api/udhetimet/route.ts`

Aplikacionin e testova lokalisht në `http://localhost:3000`. Publikimi i ndryshimeve të Java 6 në Vercel nuk është verifikuar në këtë provë.

## Çfarë mbetet për përmirësim

Në vizitën e parë, kur pajisja nuk ka internet dhe nuk është ruajtur ende një kopje e të dhënave, lista offline mund të mos jetë e disponueshme.

Leximi offline është vetëm për informacionin publik të udhëtimeve të ruajtur më parë. Ai nuk garanton që të dhënat janë të përditësuara dhe nuk mund të konfirmojë rezervime pa komunikim me serverin.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

Përdora AI për të analizuar problemin me Cache Storage dhe për të marrë udhëzime për testimin e PWA-së. Testet i realizova vetë në Chrome DevTools: kontrollova Cache Storage, simulova mungesën e internetit, verifikova listën offline, ndryshova përkohësisht orën e udhëtimit me ID 2 në Neon dhe e riktheva në vlerën fillestare. Në fund kontrollova se lista rifreskohej pas rikthimit të internetit.
