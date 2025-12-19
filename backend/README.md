# IEEE Form Backend

Simple Express server using Mongoose to save form submissions to MongoDB.

Setup

- Copy or edit `.env/.env` to set `MONGO_URI` and `PORT`.
- Install dependencies: `npm install`.
- Start server: `npm run dev` (requires `nodemon`) or `npm start`.

API

- `POST /api/forms` — save a form JSON body: `{ name, college, branch, email }`.
- `GET /api/forms` — list saved forms.
