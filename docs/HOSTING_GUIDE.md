# Complete Deployment & Hosting Guide
## Engineering Student Academic Performance & At-Risk Prediction System (1.0 – 10.0 CGPA)

This project is already pre-configured for instant zero-configuration deployment across multiple cloud platforms. Choose the hosting method that best fits your requirements:

---

## ⚡ Option 0: Instant Live Cloud URL (Already Hosted & Running!)

Your application is **already deployed and live on Google Cloud Run**:

- **Public Shared URL:** [https://ais-pre-2kxyjcxspnagsbbq7yvbij-354422128157.asia-northeast1.run.app](https://ais-pre-2kxyjcxspnagsbbq7yvbij-354422128157.asia-northeast1.run.app)
- **Live Development URL:** [https://ais-dev-2kxyjcxspnagsbbq7yvbij-354422128157.asia-northeast1.run.app](https://ais-dev-2kxyjcxspnagsbbq7yvbij-354422128157.asia-northeast1.run.app)

> 💡 **Tip for College Submissions & Presentations:** You can share the **Public Shared URL** immediately with your college professors, project guide, and viva evaluation committee. It requires zero setup, no credit card, and is globally accessible with HTTPS.

---

## 🌐 Option 1: Deploy on Render.com (Recommended Free Hosting)

[Render](https://render.com) provides free cloud hosting with automated GitHub continuous deployment and SSL certificates.

### Method A: Using the included `render.yaml` Blueprint (Easiest)
1. Push your project code to a GitHub repository (e.g., `github.com/your-username/student-performance-ml`).
2. Log into [Render.com](https://render.com) and click **New +** → **Blueprint**.
3. Select your GitHub repository. Render will automatically detect `render.yaml` and configure:
   - **Build Command:** `npm install && node scripts/generate_project_report_pdf.cjs && npm run build`
   - **Start Command:** `npx tsx server.ts`
4. In the Environment Variables section, add:
   - `GEMINI_API_KEY`: *(Your Google Gemini API key from Google AI Studio)*
   - `NODE_ENV`: `production`
5. Click **Apply**. Within 2 minutes, your web application will be live at `https://your-app-name.onrender.com`!

### Method B: Manual Web Service Setup on Render
1. Go to **New +** → **Web Service**.
2. Connect your Git repository.
3. Choose **Node** environment:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add environment variable `PORT` = `10000` and `GEMINI_API_KEY`.
5. Click **Create Web Service**.

---

## 🚂 Option 2: Deploy on Railway.app

[Railway](https://railway.app) automatically detects Node.js full-stack applications.

1. Install Railway CLI or connect via GitHub:
   ```bash
   npm i -g @railway/cli
   railway login
   railway init
   railway up
   ```
2. Or in the Railway dashboard:
   - Click **New Project** → **Deploy from GitHub repo**.
   - Railway will detect the included `Procfile` and `Dockerfile`.
   - In Settings → Variables, set `PORT` = `3000` and `GEMINI_API_KEY`.
   - Generate a domain (e.g., `student-performance.up.railway.app`).

---

## 🐳 Option 3: Deploy with Docker (Any VPS / AWS EC2 / DigitalOcean / GCP)

The repository includes an optimized multi-stage `Dockerfile`.

### Build & Run Locally or on a VPS:
```bash
# 1. Build the production Docker image
docker build -t student-performance-app .

# 2. Run container on port 3000 with your Gemini API Key
docker run -d \
  --name student-performance \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your_api_key_here" \
  -e NODE_ENV="production" \
  student-performance-app

# 3. Access your app at: http://localhost:3000
```

### Deploy to Google Cloud Run via Google Cloud CLI:
```bash
gcloud run deploy engineering-student-predictor \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_api_key"
```

---

## ▲ Option 4: Deploy on Vercel

If you want to host the frontend on Vercel:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```
2. Or import the repository into the [Vercel Dashboard](https://vercel.com):
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. For backend API proxying, point `/api/*` to your hosted Express server on Render or Cloud Run.

---

## 🐍 Option 5: Hosting the Standalone Python FastAPI Backend (Optional)

If your department requires running the Python FastAPI backend separately (`backend/app/main.py`):

1. **Deploy on Render / Railway / PythonAnywhere**:
   - Root directory: `backend/`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Test the Python API health:
   ```bash
   curl https://your-backend.onrender.com/api/health
   # Response: {"status": "healthy", "service": "College Student Performance Predictor (1-10 CGPA)"}
   ```

---

## 📱 Option 6: Hosting & Compiling the Flutter Mobile App

The repository includes the complete Material 3 Flutter application in `flutter_app/`:

### 1. Build for Web (Host on GitHub Pages or Firebase Hosting):
```bash
cd flutter_app
flutter pub get
flutter build web --release
# Deploy the 'build/web' folder to GitHub Pages or Firebase Hosting
```

### 2. Generate Android APK for College Demonstration:
```bash
cd flutter_app
flutter build apk --release
# Output APK: build/app/outputs/flutter-apk/app-release.apk
```
Transfer the APK to any Android phone for live handheld presentation during your project viva!

---

## 🔑 Environment Variables Reference

| Variable Name | Required | Default | Description |
|---|---|---|---|
| `PORT` | Optional | `3000` | Port number the Express web server listens on |
| `NODE_ENV` | Optional | `development` | Set to `production` when deploying |
| `GEMINI_API_KEY` | Optional | Built-in fallback | Google AI Studio Gemini API Key for AI Academic Advisor |

---

## 📞 Need Help?
- **All code and project deliverables** are downloadable in a single bundle from the app via the **"Project Code & ZIP"** button in the header.
- The **Official 10-Page Capstone Technical Report (PDF)** is downloadable via the **"Project Report (PDF)"** button.
