# Manual de instalare și utilizare

## Resurse software utilizate
- **Windows 10/11**: Utilizat pentru dezvoltare și deployment.
- **Ubuntu 20.04+**: Utilizat pentru antrenare de modele. Detalii disponibile [aici](https://cloudut.utcluj.ro/en/).
- **Git**: Pentru gestionarea versiunilor codului. Descărcare de [aici](https://git-scm.com/download/win).
- **Node.js și npm**: Pentru gestionarea pachetelor și dezvoltarea frontend-ului. Descărcare de [aici](https://nodejs.org/en).
- **Python 3.8+**: Pentru dezvoltarea backend-ului și rularea scripturilor. Descărcare de [aici](https://www.python.org/downloads/).
- **Docker și Docker Compose**: Pentru virtualizare și gestionarea containerelor. Descărcare de [aici](https://www.docker.com/products/docker-desktop/).

## Resurse hardware utilizate

### Dezvoltare și deployment
- **Procesor**: 11th Gen Intel(R) Core(TM) i3-1115G4 @ 3.00GHz
- **Memorie RAM**: 16GB DDR4
- **Grafică**: Intel(R) UHD Graphics 128MB VRAM
- **Stocare**: 2.5GB necesari pentru dezvoltare și 12GB pentru deployment

### Antrenare de modele
- **Procesor**: Intel(R) Xeon(R) Gold 6330 CPU @ 2.00GHz x 8
- **Memorie RAM**: 68GB
- **Cluster GPU**: 16GB VRAM
- **Stocare**: 2GB

## Pași de configurare și instalare în mediul de producție

Pentru a rula aplicația în formă dockerizată, urmați acești pași:

1. **Clonarea repository-ului de pe GitHub**:
    ```bash
    git clone https://github.com/Vlad-34/LicentaVU.git
    cd LicentaVU
    ```

2. **Rularea containerelor Docker**:
    ```bash
    docker-compose up -d
    ```

Aplicația va fi accesibilă la adresa [http://localhost:4173](http://localhost:4173).

## Pași de configurare și instalare în mediul de dezvoltare

Pentru a configura aplicația pentru rulare locală, urmați pașii de mai jos:

1. **Clonarea repository-ului de pe GitHub**:
    - Asigurați-vă că aveți Git instalat. Dacă nu, descărcați-l și instalați-l de [aici](https://git-scm.com/download/win).
    - Deschideți un terminal (Command Prompt, PowerShell sau Git Bash).
    - Rulați următoarea comandă pentru a clona repository-ul:
    ```bash
    git clone https://github.com/Vlad-34/LicentaVU.git
    cd LicentaVU
    ```

    **Notă**: Repository-ul este privat, deci sunt necesare drepturi administrative care pot fi furnizate la cerere.

2. **Virtualizarea bazei de date PostgreSQL**:
    - Modificați fișierul `docker-compose.yml` pentru a comenta liniile responsabile de link-area backend-ului și frontend-ului. Liniile care trebuie rămase necomentate sunt 1, 13-23, 37-38.
    - Rulați următoarea comandă pentru a porni containerul de PostgreSQL:
    ```bash
    docker-compose up -d
    ```

3. **Configurarea și rularea backend-ului**:
    - Navigați la directorul backend-ului:
    ```bash
    cd backend
    ```
    - Creați și activați un mediu virtual Python:
    ```bash
    python -m venv .venv
    .\.venv\Scripts\activate
    ```
    - Instalați dependințele din `requirements.txt`:
    ```bash
    pip install -r requirements.txt
    ```
    - Modificați următoarele fișiere:
        - `backend/settings.py`: decomentați linia 146 și comentați linia 147.
        - `predict/model.py`: comentați linia 56 și decomentați linia 57. Modificați calea fișierului după cea a mașinii fizice (partea absolută a căii, de dinaintea rădăcinii proiectului).
        - `auth/views.py`: schimbați portul din 4173 în 5173 pe linia 39.
    - Migrați baza de date, creați un superuser și porniți serverul backend:
    ```bash
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver
    ```

4. **Configurarea și rularea frontend-ului**:
    - Navigați la directorul frontend-ului:
    ```bash
    cd frontend
    ```
    - Asigurați-vă că aveți Node.js și npm instalate. Dacă nu, descărcați-le și instalați-le de [aici](https://nodejs.org/en).
    - Instalați dependințele specificate în `package.json`:
    ```bash
    npm install
    ```
    - Rulați frontend-ul:
    ```bash
    npm run dev
    ```

Aplicația va fi accesibilă la adresa [http://localhost:5173](http://localhost:5173).

## Considerații suplimentare

### Depanare
- **Probleme cu Docker**: Asigurați-vă că Docker este instalat și configurat corect. Dacă întâmpinați probleme, consultați [documentația oficială Docker](https://docs.docker.com/get-docker/).
- **Eroare la instalarea dependințelor Python**: Verificați că utilizați versiunea corectă de Python și că mediul virtual este activat. În cazul în care o dependență specifică nu se instalează, consultați documentația pachetului respectiv.
- **Probleme cu rularea frontend-ului**: Asigurați-vă că toate dependințele sunt instalate corect. Dacă primiți erori legate de module lipsă, rulați `npm install` din nou.

Prin urmarea acestor pași, veți putea configura și rula aplicația atât în mediul de dezvoltare cât și în cel de producție.
