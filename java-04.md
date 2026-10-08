# RideShare — Java 4 · Neon dhe PostgreSQL

## Çfarë ndërtova

Lista dhe detajet e RideShare tani i lexojnë udhëtimet nga databaza Neon PostgreSQL. Krijova lidhjen private me Neon në src/lib/db.ts duke përdorur variablën POSTGRES_URL. Në src/lib/udhetimet.ts krijova funksionet lexoUdhetimet() dhe gjejUdhetimin() që marrin të dhënat nga tabela udhetimet. Faqja kryesore dhe faqja e detajeve i lexojnë këto të dhëna nga databaza në vend të të dhënave fikse.

## Provat që bëra

### Prova 1: Ndryshimi në databazë shfaqet në aplikacion

Ndryshova orën e ID 2 nga 08:15 në 08:25 në SQL Editor. Pas rifreskimit, në listën e udhëtimeve kartela e dytë për Fushë Kosovë – AAB tregoi orën 08:25. Edhe në faqen e detajeve të ID 2 u shfaq ora 08:25.

Pastaj e ktheva orën në 08:15. Pas rifreskimit, ora 08:15 u shfaq përsëri si në listë ashtu edhe në detaje.

### Prova 2: Lista bosh dhe rikthimi

Shtova përkohësisht WHERE false te pyetja e lexoUdhetimet. U shfaq mesazhi “Nuk ka udhëtime për momentin.” Pastaj e hoqa WHERE false dhe u kthyen tri kartat.

### Prova 3: Lidhja mungon, rikthimi dhe siguria

Në fillim aplikacioni shfaqi gabimin se mungonte variabla e lidhjes me databazën. E kontrollova emrin e variablës në .env.local dhe e ndryshova në POSTGRES_URL, ashtu siç e kërkonte kodi. Pastaj e rinisa serverin me npm run dev dhe aplikacioni u lidh me Neon. Pas rregullimit, udhëtimet u shfaqën përsëri. .env.local mbahet lokalisht dhe nuk publikohet në GitHub.

## Ku gjendet puna

Skedari schema.sql gjendet brenda dosjes aplikacioni. Kodin e ndryshova te src/lib/db.ts, src/lib/udhetimet.ts, src/app/page.tsx dhe faqet e detajeve dhe kërkesave. Repository: https://github.com/drenshala17/rideshare-mobile

Aplikacioni është publikuar në Vercel: https://rideshare-mobile-tojj-oyy9ue9ax-drenshala.vercel.app/

## Çfarë mbetet për përmirësim

Kërkesat për vende janë ende simulim dhe nuk ruhen në databazë. Në të ardhmen dua të shtoj ruajtjen e kërkesave dhe konfirmimin nga shoferi.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

Kam përdorur inteligjencën artificiale për të kuptuar lidhjen e aplikacionit me databazën Neon, për të rregulluar gabimet në kod dhe për të testuar nëse udhëtimet shfaqen saktë. AI më ka ndihmuar hap pas hapi për të gjetur dhe zgjidhur problemet, ndërsa unë i kam provuar ndryshimet në aplikacion.
