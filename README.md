# DisasterLens

A polished Next.js + TypeScript + Tailwind hackathon prototype for AI-assisted disaster reporting and response prioritization.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Demo
Click **Launch Demo** to populate simulated incidents. Click **Report an Emergency** to submit a report; the local mock scoring engine analyzes it and sends it into the dashboard.

## Production replacement points
- `scoreReport()` in `app/page.tsx`: replace with a real AI/model service.
- The map panel: replace the simulated grid with Mapbox/Google Maps/Leaflet.
- Demo data: replace `demoIncidents` with a database/API.
- Resource allocation: connect to an authenticated operations backend.

All AI outputs are explicitly framed as decision-support information, not autonomous emergency authority.
