# SportifyX E-Commerce Full Stack Website

SportifyX is a sports e-commerce project built with React, FastAPI, and MySQL. It includes a customer storefront, sport-wise product pages, login/signup, cart count, banner management, and an admin product dashboard.

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- Database: MySQL
- Language: JavaScript, Python

## Requirements

Install these before running the project:

- Node.js
- Python 3
- MySQL Server

## 1. Clone The Project

```bash
git clone https://github.com/sanj-krshx/SportifyX-e-commerce-full-stack-website.git
cd SportifyX-e-commerce-full-stack-website
```

## 2. Set Up MySQL Database

Start MySQL, then run:

```bash
mysql -u root -p < database_setup.sql
```

The default database settings are:

- Database: `sports_ecommerce`
- User: `root`
- Password: `test1234`

Default admin login:

- Username: `admin`
- Password: `admin123`

To use different MySQL details, create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Then edit the values in `backend/.env`.

## 3. Run Backend

Open a terminal:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```txt
http://127.0.0.1:8000
```

## 4. Run Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend usually runs at:

```txt
http://127.0.0.1:5173
```

## Useful Pages

- Storefront: `http://127.0.0.1:5173`
- Admin login: `http://127.0.0.1:5173/admin`
- Admin dashboard: `http://127.0.0.1:5173/dashboard`

## Features

- Homepage with sport category cards
- Football, Cricket, Basketball, Tennis, Volleyball product pages
- Product search
- User signup/login
- Cart count
- Admin login
- Product add/edit/delete dashboard
- Banner upload/delete
- Responsive UI

## Notes

- Run the MySQL setup script before starting the backend.
- Keep backend running while using the dashboard.
- Uploaded images are stored in `backend/uploads`.
