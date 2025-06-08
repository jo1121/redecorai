# 🛋️ ReDécorAI — Smart Interior Design Web App

ReDécorAI is a modern, AI-powered interior design assistant that helps you transform your living space by simply scanning your room or uploading a photo. Built with a minimal, Apple-style aesthetic, it combines beauty, performance, and intuitive design.

---

## 🚀 Features

- 🎥 Live camera scan or image upload
- 🧠 AI-powered design suggestions
- 📦 Inventory management
- 🛍️ Explore ideas in a marketplace layout
- 🧭 Guided onboarding with tutorial modal
- 🎓 Demo mode for first-time users
- 📱 Fully responsive design (mobile + desktop)
- ⚡ Smooth section-based scroll animations
- 🔐 Authentication: Email, Google, Facebook

---

## 📸 Screenshots

> Add screenshots or screen recordings here.

---

## 🧪 Try It Locally

### 1. Clone the repo

```bash
git clone https://github.com/jo1121/redecorai.git
cd redecorai

2. Install dependencies

npm install

3. Start the dev server

npm run dev

Visit: http://localhost:5173


---

🛠 Tech Stack

Frontend: React + Vite + TypeScript

Styling: Tailwind CSS, ShadCN UI, Framer Motion

Icons: Lucide

Video/UI Enhancements: Background video loop, modal transitions



---

🌍 Deployment

To deploy the production build:

npm run build

Deploy via:

Vercel (recommended for React + Vite apps)

GitHub Pages (requires base path config)

Netlify (easy drag-and-drop or GitHub sync)



---

📂 Directory Structure

src/
├── components/
│   ├── ui/              → Reusable UI components
│   ├── PageWrapper.tsx  → Shared layout logic
├── routes/
│   ├── home.tsx         → Main landing page
│   ├── scan.tsx         → AI scan functionality
│   ├── login.tsx        → Login UI
│   └── signup.tsx       → Signup UI
public/
├── *.mov                → Background videos (ignored on GitHub)


---

🔐 Authentication Notes

Supports multiple login options:

Email & password

Google

Facebook


Uses frontend-only stubs. You can plug in Firebase, Supabase, or Auth0 to add real auth logic.


---

📤 Video Handling

Large .mov files (background video loops) are:

Tracked with Git LFS OR

Served from a CDN (e.g., Cloudinary or Firebase)


> Avoid committing .mov directly to GitHub if over 100MB.




---

👨‍💻 Contributors

John Nayathodan – Lead Developer

jo1121 – Repository Host



---

📄 License

This project is licensed under the MIT License. See the LICENSE file for more info.


---

💡 Coming Soon

Multi-room support

3D design integration

AR preview mode


---

Would you like me to create and place this file automatically in your repo now?

