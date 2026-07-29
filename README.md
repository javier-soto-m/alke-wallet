# Alke Wallet

Billetera digital construida como proyecto de curso con HTML5, CSS3, Bootstrap 5 y jQuery. Simula el flujo de una fintech: inicio de sesión, saldo, depósitos, envío de dinero entre contactos y consulta de movimientos, con persistencia en `localStorage`.

## Pantallas

| Archivo | Descripción |
|---|---|
| `index.html` | Entrada principal / bienvenida |
| `login.html` | Inicio de sesión (demo: `usuario@wallet.com` / `123456`) |
| `menu.html` | Menú principal con saldo y accesos |
| `deposit.html` | Depósito de dinero a la cuenta |
| `sendmoney.html` | Envío de dinero a contactos, con autocompletar |
| `transactions.html` | Historial de movimientos, con filtro por tipo |

## Tecnologías

- HTML5 semántico
- CSS3 (paleta y tipografía propias sobre Bootstrap)
- Bootstrap 5.3
- JavaScript
- jQuery

## Flujo de ramas

- `main` — código estable
- `feature/login` — mejoras sobre el inicio de sesión
- `feature/depositos` — mejoras sobre depósitos y saldo
- `feature/transacciones` — mejoras sobre envío de dinero y movimientos
