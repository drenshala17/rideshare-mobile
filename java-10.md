# RideShare — Java 10

## Çfarë ndërtova

Në Java 10 e zhvillova sinkronizimin e kërkesave për udhëtim në kohë reale ndërmjet udhëtarit dhe shoferit.

Kur udhëtari dërgon një kërkesë, ajo ruhet në databazën Neon PostgreSQL dhe shfaqet automatikisht te shoferi. Shoferi mund ta pranojë kërkesën, ndërsa statusi dhe numri i vendeve përditësohen në të dy ekranet pa pasur nevojë për Refresh.

Krahasuar me Java 9, ku gjendja nuk sinkronizohej automatikisht ndërmjet përdoruesve, në Java 10 shtova ruajtjen e kërkesave në databazë dhe kontrollimin automatik të gjendjes çdo 5 sekonda. Gjithashtu, aplikacioni e ruan pamjen e fundit kur humbet interneti dhe vazhdon sinkronizimin pas rilidhjes.

## Përgatitja e provës

- ID-ja e udhëtimit: `2`
- Vendet fillestare: `2`
- Shoferi: llogaria ime GitHub.
- Udhëtari: llogaria GitHub e kolegut.
- Sesionet u ndanë në dy kompjuterë të ndryshëm, me dy llogari të ndryshme GitHub.
- Aplikacioni u testua përmes domain-it kryesor të Vercel.

## Provat që bëra

### Prova 1: Rasti 1 · Kërkesa mbërrin te shoferi

- Hapat: Kolegu u kyç si udhëtar në kompjuterin e tij, hapi udhëtimin me ID `2` dhe dërgoi kërkesën. Unë isha i kyçur si shofer në kompjuterin tjetër.
- Çfarë prisja: Kërkesa të shfaqej te shoferi pa Refresh dhe numri i vendeve të mbetej i pandryshuar.
- Çfarë pa realisht shoferi dhe udhëtari, pa Refresh: Kërkesa u shfaq te shoferi me statusin `Në pritje`. Numri i vendeve mbeti `2`.
- Ku e verifikova ruajtjen: Në Neon PostgreSQL, në tabelën `kerkesat`, ku u ruajt kërkesa e udhëtarit.

### Prova 2: Rasti 2 · Pranimi përditëson të dy ekranet

- Hapat dhe vendet para/pas: Shoferi pranoi kërkesën. Para pranimit kishte `2` vende të lira, ndërsa pas pranimit mbeti `1` vend.
- Përsëritja e pranimit dhe prova me 0 vende: Pas pranimit, butoni `Prano` nuk u shfaq më. Nuk e testova praktikisht përsëritjen e kërkesës përmes API-së dhe as rastin me `0` vende.
- Çfarë pashë realisht te të dy përdoruesit: Në të dy kompjuterët statusi u përditësua në `E pranuar`, ndërsa numri i vendeve u ndryshua në `1`, pa Refresh.

### Prova 3: Rasti 3 · Ndërprerja dhe rilidhja

- ID-ja e udhëtimit të provës: `2`. Dritarja e kolegut, që ishte e kyçur si udhëtar, u vendos në Offline përmes DevTools → Network → Offline.
- Pamja e fundit gjatë ndërprerjes: Në ekran mbeti statusi `E pranuar` dhe numri i vendeve `1`. U shfaq mesazhi `Po rilidhemi`.
- Çfarë ndryshoi pas rilidhjes: E ktheva lidhjen në `No throttling`. Mesazhi `Po rilidhemi` u zhduk dhe aplikacioni rifilloi sinkronizimin pa pasur nevojë për Refresh.

## Ku gjendet puna

Funksionaliteti u realizua me Next.js, TypeScript dhe Neon PostgreSQL.

Skedarët kryesorë:

- `schema-java10.sql` — krijimi i tabelës për kërkesat.
- `src/lib/kerkesat.ts` — funksionet për menaxhimin e kërkesave.
- `src
