# E-Library Web Application

A digital library management system built with React and Bootstrap.

## Features

- User-friendly interface
- Digital book browsing
- Responsive design
- Book management system

## Technologies Used

- React.js
- React Bootstrap
- Node.js
- Express.js
- MySQL
- XAMPP

## Prerequisites

- Node.js (v14 or higher)
- XAMPP
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/e-library-web-app.git
```

2. Set up the backend
```bash
cd e-library-web-app/backend
npm install
```

3. Configure the database
- Start XAMPP
- Create a new MySQL database named 'elibrary'
- Import the database schema from `backend/database/schema.sql`

4. Start the backend server
```bash
npm run dev
```

5. Set up the frontend
```bash
cd ../frontend
npm install
npm start
```

## Project Structure

```
e-library-web-app/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── config/
│   ├── database/
│   │   └── schema.sql
│   └── package.json
└── README.md
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
