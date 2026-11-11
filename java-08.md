# RideShare — Java 8

## Çfarë ndërtova

Këtë javë shtova mundësinë që përdoruesi ta shkruajë dhe konfirmojë vetë vendtakimin ose të kërkojë vendndodhjen e telefonit përmes `navigator.geolocation.getCurrentPosition`.

Vendtakimi i shkruar ruhet veçmas nga teksti që përdoruesi është duke e shkruar. Teksti pastrohet me `trim()` dhe nuk lejohet konfirmimi nëse përmban vetëm hapësira.

Vendndodhja kërkohet vetëm pasi përdoruesi shtyp butonin përkatës. Në rast të suksesit shfaqet saktësia e pozicionit. Në rast refuzimi, mungese të pozicionit ose përfundimi të kohës, përdoruesi merr mesazh dhe mund ta shkruajë vendtakimin manualisht.

## Provat që bëra

### Prova 1: Leja nuk kërkohet sapo hapet faqja.

- **Hapat:** Hapa faqen `/java-08-test` dhe kontrollova nëse kërkohej vendndodhja menjëherë. Pastaj shtypa butonin “Përdor vendndodhjen time” dhe lejova qasjen në shfletues.
- **Rezultati i pritur:** Faqja nuk kërkon vendndodhjen pa veprimin e përdoruesit. Pas klikimit, kërkohet leja dhe shfaqet rezultati.
- **Çfarë ndodhi:** Leja nuk u kërkua gjatë hapjes së faqes. Pas klikimit, vendndodhja u mor me sukses dhe u shfaq saktësia prej 112 metrash.

### Prova 2: Refuzimi i lejes nuk e bllokon përdoruesin.

- **Hapat:** E ndryshova lejen e vendndodhjes në Block dhe shtypa butonin për marrjen e vendndodhjes. Pastaj provova edhe rastin e përfundimit të kohës duke simuluar timeout në shfletues.
- **Rezultati i pritur:** Në të dy rastet shfaqet mesazhi përkatës dhe përdoruesi mund të vazhdojë duke shkruar vendtakimin manualisht.
- **Çfarë ndodhi:** Pas refuzimit u shfaq mesazhi “Leja u refuzua. Shkruaj vendtakimin vetë.” Gjatë simulimit të timeout-it u shfaq mesazhi “Koha e kërkimit përfundoi. Provo përsëri ose shkruaj vendtakimin vetë.”

### Prova 3: Dëshmitë në GitHub nuk tregojnë adresën time reale.

- **Hapat:** Kontrollova skedarët e Java 8 që përmbajnë funksionalitetin dhe të dhënat e testimit, për të parë nëse përfshijnë adresë personale, koordinata reale ose sekrete.
- **Rezultati i pritur:** Skedarët e publikuar nuk duhet të përmbajnë adresë personale, koordinata reale ose sekrete.
- **Çfarë ndodhi:** Në skedarët e kontrolluar nuk gjeta adresë personale, koordinata reale ose sekrete. Skedari `mobile-week08.json` përdor të dhëna lokale dhe shënon se nuk përmban koordinata reale ose sekrete.

## Ku gjendet puna

Skedarët kryesorë:

- `aplikacioni/src/components/Vendtakimi.tsx` – komponenti për shkrimin, konfirmimin dhe marrjen e vendndodhjes.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx` – faqja e detajeve të udhëtimit ku përdoret komponenti.
- `aplikacioni/src/app/java-08-test/page.tsx` – faqja lokale për testim.
- `aplikacioni/src/app/globals.css` – stilet e komponentit.
- `mobile-week08.json` – të dhënat për javën 8.

Faqja lokale e testimit: `http://localhost:3000/java-08-test`

## Çfarë mbetet për përmirësim

Vendtakimi i konfirmuar ruhet vetëm në gjendjen lokale të React-it. Nëse përdoruesi rifreskon faqen, të dhënat e shkruara nuk ruhen. Në të ardhmen mund të shtohet ruajtja e vendtakimit në databazë, nëse kërkohet nga projekti.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

Përdora GitHub Copilot për ndihmë në implementimin e komponentit dhe ChatGPT për të kuptuar kodin, kontrolluar funksionalitetin dhe përgatitur raportin. Vetë i testova rastet e marrjes së vendndodhjes, refuzimit të lejes, timeout-it dhe konfirmimit manual.

## Prova me një hyrje të re

- **Hyrja që provova:** Shkrova “Bibloteka” dhe e konfirmova. Pastaj shkrova “Parkingu”, por nuk e shtypa butonin e konfirmimit.
- **Parashikimi im para klikimit:** Vendtakimi i konfirmuar duhet të mbetet “Bibloteka” derisa ta konfirmoj hyrjen e re.
- **Çfarë pashë realisht:** Vendtakimi i konfirmuar mbeti “Bibloteka”, ndërsa “Parkingu” nuk u ruajt si vendtakim i ri.
- **Skedari dhe funksioni që e shpjegojnë:** `aplikacioni/src/components/Vendtakimi.tsx`, funksioni `konfirmoVendtakimin()` dhe gjendjet `teksti` dhe `vendtakimiKonfirmuar`.
- **Çfarë kuptova ose korrigjova:** Kuptova se teksti që shkruaj nuk bëhet automatikisht vendtakim i konfirmuar. Duhet ta shtyp butonin “Konfirmo në telefon”.

Këtë pjesë e shpjegoj në klasë. Kontrolli automatik nuk verifikon vërtetësinë e provës.
