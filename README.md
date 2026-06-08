# 🌍 NomadSpot

**Find your next remote work destination.**

NomadSpot is a full-stack web application that helps digital nomads discover the best cities to live and work remotely. Explore an interactive world map, filter by budget, safety, internet speed, and climate, and compare cities head-to-head with Versus Mode.

🔗 **Live demo:** [nomadspot-web.vercel.app](https://nomadspot-web.vercel.app)

---

## ✨ Features

- **Interactive world map** — 50+ curated nomad-friendly cities plotted on a Leaflet.js map
- **City cards panel** — sorted by overall score with real-time stats
- **Advanced filters** — filter by continent, budget, visa friendliness, internet speed, minimum score, and temperature
- **City detail modal** — full breakdown including safety, climate, cost, and internet scores, live weather via Windy.com, population, and Wikipedia link
- **Versus Mode** — compare two cities head-to-head and get a winner based on overall score
- **Search bar** — quickly find any city by name
- **Favorites** — save cities locally

---

## 🛠 Tech Stack

**Backend**
- PHP 8.4 / Laravel 13
- REST API
- MySQL
- Laravel Scheduler (data import commands)
- Deployed on [render](https://render.com)

**Frontend**
- Vue.js 3 (Composition API)
- Vite
- Vuetify 3
- Tailwind CSS
- Leaflet.js (interactive map)
- Pinia (state management)
- Axios
- Deployed on [Vercel](https://vercel.com)

**External APIs**
- [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org) — city coordinates
- [Open-Meteo](https://open-meteo.com) — average temperature
- [CountriesNow](https://countriesnow.space) — population data
- [RestCountries](https://restcountries.com) — country info
- [Unsplash](https://unsplash.com/developers) — city images
- [Windy](https://windy.com) — live weather embed

---

## 🚀 Running locally

### Prerequisites
- PHP 8.4+
- Composer
- Node.js 18+
- MySQL

### Backend

```bash
git clone https://github.com/tomalvi/nomadspot-api
cd nomadspot-api
composer install
cp .env.example .env
# Configure your DB credentials in .env
php artisan key:generate
php artisan migrate
php artisan cities:import
php artisan serve
```

### Frontend

```bash
git clone https://github.com/tomalvi/nomadspot-web
cd nomadspot-web
npm install
# Set VITE_API_URL in .env to your backend URL
npm run dev
```

---

## 📸 Screenshots

<img width="1873" height="976" alt="image" src="https://github.com/user-attachments/assets/051b3e66-05d1-49bd-a672-f3e6c99a5619" />

<img width="1870" height="977" alt="image" src="https://github.com/user-attachments/assets/98d88152-252c-42f3-8890-3c575bc6cfbe" />

<img width="1873" height="982" alt="image" src="https://github.com/user-attachments/assets/cceb352b-ea7b-4663-87a2-8cb6951928fe" />

<img width="1868" height="977" alt="image" src="https://github.com/user-attachments/assets/5e124ec6-df42-4a9f-bf86-4cac5bc183ba" />



---

## 👤 Author

**Tomas Almonte Viñeglas**
- [LinkedIn](www.linkedin.com/in/tomás-almonte-viñeglas)
- tomasvineglas@hotmail.com
