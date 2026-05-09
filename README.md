
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

## 3.Configurare
1. Pregatiti fisierul pentru variabilele de mediu:
    ```
    cp .env.example .env
    
    modificati DB_USER si DB_PASS cu userul si parola dumneavoastra  

2. Configurare Baza de Date 
    ```bash
    mysql -u root -p -e "CREATE DATABASE softprim_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

    mysql -u root -p softprim_test < setup.sql


## 4. Pornire server
    ```bash
    node app.js

## 5. Exemple de apel (Endpoints)

### 5.1. Lista Produse
**Endpoint:** `GET /api/products`  
**Descriere:** Intoarce toate produsele. Optional, se poate filtra dupa `category_id`.

- **Comanda test si raspuns asteptat:**
  ```bash
  curl -X GET "http://localhost:3000/api/products?category_id=1"

  
  
  {
    "id": 1,
    "name": "Laptop Gaming",
    "price": 4500.00,
    "stock": 10,
    "category_id": 1,
    "category_name": "Electronice"
  }


### 5.2. Detalii produs
**Endpoint:** `GET /api/products/:id`  
**Descriere:** Intoarce detaliile unui singur produs pe baza ID-ului

- **Comanda test si raspuns asteptat:**
  ```bash
  curl -X GET "http://localhost:3000/api/products/1"

  {
    "id": 1,
    "name": "Laptop Gaming",
    "price": 4500.00,
    "stock": 10,
    "category_id": 1,
    "category_name": "Electronice"
  }


### 5.3. Plasare comanda
**Endpoint:** `POST /api/orders`  
**Descriere:** Creeaza o comanda, calculeaza totalul si scade stocul produsului.

**Comanda test si raspuns asteptat:**
  ```bash
  curl -X POST http://localhost:3000/api/orders \
    -H "Content-Type: application/json" \
    -d '{"product_id": 1, "quantity": 2, "customer_email": "stefan@exemplu.ro"}'

  {
    "order_id": 45,
    "product_id": 1,
    "quantity": 2,
    "total": 9000.00,
    "created_at": "2026-05-09T18:30:00. 000Z"
  }
