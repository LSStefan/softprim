
## 1. Tehnologii folosite
- **Limbaj:** Node.js 22.22.1
- **Framework:** Express.js
- **Baza de date:** MySQL 8.4.8-0ubuntu1
- **Biblioteci aditionale:** - `mysql2`: pentru suport Promise si conexiune la baza de date.
  - `dotenv`: pentru gestionarea variabilelor de mediu si securizarea datelor sensibile.

## 2. Pasi de instalare
Asigurati-va ca aveti Node.js instalat pe sistem, apoi urmati pasii:

1. Clonati repository-ul sau descarcati arhiva.
2. Deschideti terminalul in folderul proiectului.
3. Instalati dependentele necesare:
   ```bash
   npm install
4. Pregatiti fisierul pentru variabilele de mediu:
    ```
    cp .env.example .env
    
    modificati DB_USER si DB_PASS cu userul si parola dumneavoastra  

5. Configurare Baza de Date 
    ```bash
    mysql -u root -p -e "CREATE DATABASE softprim_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

    mysql -u root -p softprim_test < setup.sql
6. Pornire server
    ```bash
    node app.js