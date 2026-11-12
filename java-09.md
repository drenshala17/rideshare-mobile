# RideShare – Java 9

## 1. Çfarë ndërtova

Në këtë javë të projektit RideShare implementova funksionin e preferimeve. Ky funksion i mundëson përdoruesit që është kyçur përmes GitHub-it t'i ruajë udhëtimet që i interesojnë.

Përdoruesi mund të klikojë te ylli në kartelën e udhëtimit. Pas ruajtjes, ylli ndryshon pamjen dhe shfaqet mesazhi "I ruajtur".

Preferimet ruhen në databazën Neon dhe lidhen me përdoruesin dhe udhëtimin përkatës. Kështu, edhe pas rifreskimit të faqes, udhëtimet e ruajtura vazhdojnë të shfaqen si preferime.

Gjithashtu, është implementuar parandalimi i ruajtjes së dyfishtë të të njëjtit udhëtim nga i njëjti përdorues.

## 2. Provat që bëra

### Prova 1 – Ruajtja e preferimeve

**Hapat:**

1. U kyça në aplikacion përmes GitHub-it.
2. Zgjodha disa udhëtime dhe klikova te ylli për t'i ruajtur.
3. Pas ruajtjes u shfaq mesazhi "I ruajtur".
4. E rifreskova faqen me Ctrl + R.
5. Kontrollova nëse udhëtimet vazhdonin të ishin të ruajtura.

**Rezultati:** Prova kaloi me sukses. Të tri udhëtimet mbetën të ruajtura edhe pas rifreskimit të faqes.

### Prova 2 – Dështimi i kërkesës dhe riprovimi

**Hapat:**

1. Në Chrome DevTools hapa Network dhe Request conditions.
2. Aktivizova bllokimin e kërkesës `http://localhost:3000/api/preferimet`.
3. Klikova te ylli për të ruajtur një udhëtim.
4. U shfaq gabimi "Failed to fetch" dhe mesazhi "Provo përsëri".
5. Kontrollova që ylli u kthye në gjendjen fillestare.
6. E çaktivizova bllokimin dhe klikova përsëri te "Provo përsëri".

**Rezultati:** Prova kaloi me sukses. Kur kërkesa u bllokua, preferimi nuk u ruajt. Pas çaktivizimit të bllokimit dhe riprovimit, udhëtimi u ruajt me sukses.

### Prova 3 – Parandalimi i preferimeve të dyfishta

**Hapat:**

1. Në Chrome DevTools hapa Network dhe gjeta kërkesën `POST /api/preferimet`.
2. Kontrollova të dhënat e kërkesës dhe ID-në e udhëtimit (`udhetimId: 3`).
3. Përdora opsionin Resend për ta dërguar përsëri të njëjtën kërkesë.
4. Kontrollova që kërkesa e përsëritur mori statusin `200`.
5. Në Neon SQL Editor ekzekutova këtë pyetje:

```sql
SELECT user_id, udhetim_id, COUNT(*)
FROM preferimet
GROUP BY user_id, udhetim_id
HAVING COUNT(*) > 1;
```

**Rezultati:** Prova kaloi me sukses. Kërkesa e përsëritur mori statusin `200`, ndërsa pyetja SQL nuk ktheu asnjë rresht. Kjo tregon se nuk u krijua preferim i dyfishtë.

## 3. Skedarët ku gjendet puna

- `schema-java09.sql` – Krijimi i tabelës së preferimeve dhe kufizimi për parandalimin e dublikatave.
- `src/lib/preferimet.ts` – Funksionet për punën me preferimet në databazë.
- `src/app/api/preferimet/route.ts` – API për ruajtjen dhe marrjen e preferimeve.
- `src/components/Preferimi.tsx` – Butoni dhe gjendja vizuale e preferimit.
- `src/components/ListaUdhetimesh.tsx` – Lista e udhëtimeve dhe integrimi i preferimeve.
- `src/components/KartaUdhetimi.tsx` – Kartela e udhëtimit.
- `src/app/page.module.css` – Stilet vizuale të aplikacionit.

## 4. Çfarë mund të përmirësohet në të ardhmen

Në të ardhmen mund të shtohet edhe mundësia për heqjen e një udhëtimi nga preferimet, si dhe një faqe e veçantë ku përdoruesi mund t'i shohë të gjitha udhëtimet e ruajtura.

## 5. Ndihma nga AI

Gjatë realizimit të kësaj jave përdora GitHub Copilot dhe ChatGPT për ndihmë në implementimin e funksionit të preferimeve, rregullimin e gabimeve dhe kontrollimin e kodit.

E testova funksionin në aplikacion dhe në databazën Neon. Gjithashtu, kontrollova ndërtimin e projektit (build) dhe kontrollin e kodit (lint).

Të tri provat praktike të përshkruara më lart u realizuan me sukses.
