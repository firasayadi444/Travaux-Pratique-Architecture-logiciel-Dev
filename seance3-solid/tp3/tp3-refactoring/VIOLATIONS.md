# Rapport de refactoring — Application des principes SOLID

**Projet :** ReportService  
**Objectif :** Identifier les problèmes de conception du code initial, appliquer les principes SOLID et vérifier que le comportement existant est préservé.

---

## 1. Diagnostic du code initial

L'analyse porte sur le fichier original `../ReportService.js`.

Les problèmes identifiés concernent principalement la séparation des responsabilités, l'extensibilité, le respect des contrats, les dépendances techniques, la testabilité et la sécurité.

### 1.1. Problèmes identifiés

| # | Principe | Lignes | Problème identifié |
|---|---|---|---|
| 1 | **S — Single Responsibility** | 25–87 | La méthode `generate()` cumule plusieurs responsabilités : lecture, calcul, formatage, journalisation et envoi d'e-mails. |
| 2 | **O — Open/Closed** | 48–70 | Chaque format de rapport est traité directement par une branche conditionnelle du service. |
| 3 | **L — Liskov Substitution** | 92–96 | `FreeReportService` refuse certaines fonctionnalités pourtant acceptées par sa classe parente. |
| 4 | **D — Dependency Inversion** | 4, 9–15, 20–22, 74, 80–85 | Le service dépend directement du système de fichiers, de la console et de la configuration SMTP. |
| 5 | **Testabilité** | 73–75 | L'heure courante et les écritures console sont intégrées à la logique du service. |
| 6 | **Sécurité** | 10–14 | Un mot de passe SMTP est directement présent dans le code source. |

### 1.2. Conséquences sur la maintenance

**1. Responsabilité unique (SRP)**

La méthode `generate()` réalise plusieurs opérations qui devraient être séparées.

**Conséquence :** modifier les calculs ou l'envoi d'e-mails peut affecter d'autres fonctionnalités du service.

**2. Ouvert/Fermé (OCP)**

Les formats sont directement définis dans le service.

**Conséquence :** ajouter un nouveau format, comme PDF, nécessite de modifier du code existant déjà testé.

**3. Substitution de Liskov (LSP)**

La sous-classe `FreeReportService` restreint certaines fonctionnalités disponibles dans `ReportService`, notamment HTML, JSON et l'envoi d'e-mails.

**Conséquence :** un programme utilisant le contrat du service parent peut échouer lorsqu'il reçoit cette sous-classe.

**4. Inversion des dépendances (DIP)**

La logique métier est directement liée à plusieurs détails techniques.

**Conséquence :** tester les calculs ou remplacer le stockage nécessite d'interagir avec ces dépendances ou de modifier le service.

**5. Testabilité**

La gestion de l'heure et la journalisation sont directement intégrées au service.

**Conséquence :** les résultats de journalisation peuvent varier entre deux exécutions et produire des sorties inutiles pendant les tests métier.

**6. Sécurité**

Les identifiants SMTP sont présents dans le code source.

**Conséquence :** un secret peut être exposé lors du partage du dépôt, et sa rotation nécessite une modification du code.

---

## 2. Choix du refactoring

Le refactoring vise à améliorer la maintenabilité et l'extensibilité du service, tout en préservant les règles métier existantes.

### 2.1. Extraction des calculs métier

Les calculs sont regroupés dans une fonction dédiée :

`computeStats(orders, month)`

Cette fonction prend en charge uniquement les calculs statistiques et conserve les règles métier existantes.

**Bénéfice :** les calculs peuvent être testés indépendamment des autres opérations.

### 2.2. Gestion extensible des formats

Chaque format de rapport dispose de sa propre implémentation :

`format(stats)`

Un registre permet d'enregistrer de nouveaux formats sans modifier le service principal.

**Bénéfice :** l'ajout d'un format, comme Markdown ou PDF, ne nécessite plus de modifier la logique centrale.

### 2.3. Injection des dépendances

Le service reçoit ses dépendances par son constructeur :

- Le dépôt de données (*repository*).
- Le registre des formats.
- Le service d'envoi d'e-mails (*mailer*).
- Le système de journalisation (*logger*).
- La politique fonctionnelle (*policy*).

**Bénéfice :** les dépendances peuvent être remplacées facilement, notamment par des implémentations simulées pendant les tests.

### 2.4. Centralisation de la configuration

Le fichier `main.js` est responsable de l'assemblage des dépendances et de la lecture des variables d'environnement :

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`

L'envoi des e-mails reste simulé, conformément au comportement du code original.

**Bénéfice :** la configuration technique est séparée de la logique métier et les secrets ne sont plus codés directement dans le service.

### 2.5. Remplacement de l'héritage par la composition

La politique du plan gratuit est sélectionnée explicitement :

`buildReportService({ plan: 'free' })`

Cette approche remplace la sous-classe `FreeReportService` qui restreignait le contrat de son parent.

**Bénéfice :** les restrictions fonctionnelles sont gérées par composition, sans introduire une substitution incompatible.

### 2.6. Préservation du comportement existant

La règle actuelle de validation des adresses e-mail est volontairement conservée.

**Objectif :** éviter toute modification fonctionnelle non demandée pendant le refactoring.

---

## 3. Vérification du refactoring

### 3.1. Exécution des tests

Depuis la racine du projet, exécuter :

```powershell
node --test seance3-solid/tp3/tp3-refactoring/ReportService.caracterisation.test.js seance3-solid/tp3/tp3-refactoring/ReportService.extension.test.js
```

### 3.2. Exécution de l'application

```powershell
node seance3-solid/tp3/tp3-refactoring/main.js
```

### 3.3. Couverture des vérifications

| Vérification | Résultat attendu |
|---|---|
| 7 tests existants | Conservation