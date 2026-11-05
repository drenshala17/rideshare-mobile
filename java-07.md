Java 7 -- Provo, korrigjo dhe shpjego RideShare-in tënd
Projekti: RideShare AAB
Lënda: Programimi Mobile
Data: 05.11.2026
1. Rasti i zgjedhur dhe parashikimi
Zgjodha rastin e një udhëtimi që nuk ka vende të lira. Problemi që desha
të kontrolloja ishte nëse një përdorues mund ta hapte faqen e kërkesës
drejtpërdrejt përmes adresës së saj, edhe kur udhëtimi ishte i plotë.

Parashikimi: Prisja që aplikacioni të mos lejonte krijimin e një
kërkese për një udhëtim me 0 vende të lira. Nëse faqja e kërkesës hapej
drejtpërdrejt, duhej të shfaqej një mesazh që tregon se nuk ka vende të
lira.
2. Dy problemet e identifikuara
Gjatë kontrollimit të projektit u identifikuan këto dy probleme:
1. Hapja direkte e faqes së kërkesës: Faqja e kërkesës mund të
   hapej përmes URL-së edhe kur udhëtimi kishte 0 vende të lira. Kjo do
   të thoshte se kontrolli në butonin e detajeve nuk mjaftonte për ta
   mbrojtur faqen.
2. Statusi i udhëtimit në kartelë: Kur një udhëtim kishte 0 vende
   të lira, kartela tregonte numrin e vendeve, por statusi që udhëtimi
   ishte i plotë nuk ishte mjaftueshëm i dallueshëm.
3. Korrigjimi i bërë
U korrigjua problemi i parë, pra hapja direkte e faqes së kërkesës për
një udhëtim të plotë.

Në skedarin aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx u shtua
një kontroll pas kontrollit nëse udhëtimi ekziston. Nëse
udhetim.vende === 0, faqja shfaq mesazhin "Nuk ka vende të lira"
dhe nuk e shfaq simulimin e kërkesës.

Problemi i dytë, për dallueshmërinë e statusit në kartelë, u identifikua
por nuk u ndryshua në këtë punë.
4. Tri provat e realizuara
Aplikacioni u nis lokalisht me komandën npm run dev nga folderi
aplikacioni. Faqja u hap në http://localhost:3000 dhe u shfaqën tri
udhëtimet.
Prova 1 -- Udhëtim me 0 vende të lira
- Hapat: U hapën detajet e udhëtimit me ID 3 dhe pastaj u hap
  direkt adresa http://localhost:3000/udhetimi/3/kerkesa.
- Pritshmëria: Të shfaqej mesazhi se nuk ka vende të lira dhe të
  mos shfaqej simulimi i kërkesës.
- Vëzhgimi: U shfaq "Nuk ka vende të lira". Simulimi i kërkesës
  nuk u shfaq.
- Rezultati: Kaloi.
Prova 2 -- Udhëtim me vende të lira
- Hapat: U hapën detajet e udhëtimit me ID 1 dhe u shtyp butoni
  për të vazhduar te kërkesa.
- Pritshmëria: Faqja ekzistuese e simulimit të kërkesës të
  vazhdonte të funksiononte.
- Vëzhgimi: U shfaq "Simulim: Në pritje" dhe mesazhi se kërkesa
  për Prishtinë → AAB është duke u trajtuar. U shfaq edhe sqarimi se
  ky është vetëm simulim dhe se kërkesa nuk ruhet apo dërgohet te
  shoferi.
- Rezultati: Kaloi.
Prova 3 -- ID e një udhëtimi që nuk ekziston
- Hapat: U hap adresa
  http://localhost:3000/udhetimi/999/kerkesa.
- Pritshmëria: Aplikacioni të mos shfaqte kërkesë për një udhëtim
  që nuk ekziston.
- Vëzhgimi: U shfaq "404 · Nuk u gjet", "Udhëtimi nuk u gjet" dhe
  sqarimi se adresa nuk përputhet me një udhëtim në listë.
- Rezultati: Kaloi.
5. Ndryshimi i hyrjes dhe sjellja e aplikacionit
Pas korrigjimit, edhe kur përdoruesi e shkruan drejtpërdrejt adresën e
faqes së kërkesës për një udhëtim me 0 vende, aplikacioni e kontrollon
numrin e vendeve para se të shfaqë simulimin. Për udhëtimet që kanë
vende të lira, simulimi vazhdon të hapet. Për një ID që nuk ekziston,
aplikacioni vazhdon të shfaqë faqen 404.

Kështu, kontrolli nuk varet vetëm nga butoni në faqen e detajeve, por
bëhet edhe në vetë faqen e kërkesës.
6. Ndihma nga AI
U përdor Copilot për të kontrolluar kodin dhe për të identifikuar
problemet. Copilot ndihmoi në gjetjen e rastit kur faqja e kërkesës mund
të hapej drejtpërdrejt edhe pse udhëtimi ishte i plotë, si dhe në
propozimin dhe zbatimin e kontrollit udhetim.vende === 0.

Ndryshimi u kontrollua me tri prova manuale. Sipas kontrollit të
Copilot-it, build-i dhe kontrolli i TypeScript përfunduan me sukses.
Testet manuale u realizuan veçmas në shfletues.
7. Lidhjet e commit-eve
- Commit BEFORE (para korrigjimit):
  https://github.com/drenshala17/rideshare-mobile/commit/106564505074e279f7af449b63142830e1189942
- Commit AFTER (pas korrigjimit):
  https://github.com/drenshala17/rideshare-mobile/commit/814cb1b470fb7b01468b468dc5e1178b53f1cc94