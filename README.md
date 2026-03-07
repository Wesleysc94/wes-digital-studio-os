# Aura Odonto Premium - Front-End Architecture

<div align="center">
  <img src="public/mockups/versao azul desktop e mobile.PNG" alt="Aura Odonto Preview" width="600"/>
  
  <p><strong>Next-Generation Dental Clinic Interface & High-Conversion Booking Flow</strong></p>
</div>

## 💎 About the Project

Aura Odonto Premium is a highly sophisticated, high-performance web application designed for a premium dental clinic based in São Paulo. Moving away from traditional, slow monolithic platforms (like WordPress), this application uses modern Front-End architecture to deliver an instantaneous, app-like experience. 

The primary goal of this system is **High-Ticket Patient Conversion**, leveraging neuromarketing principles, extreme performance, and fluid micro-interactions to build trust and authority in milliseconds.

## 🚀 Technology Stack

*   **Core:** React 18, TypeScript, Vite (Lightning-fast HMR and optimized builds)
*   **Styling Engine:** Tailwind CSS & Shadcn/UI (Consistent, scalable design system)
*   **Cinematic Animations:** GSAP (GreenSock) & Framer Motion (Hardware-accelerated stagger effects, scroll triggers, parallax)
*   **State Management & Data:** React Query (for complex data fetching, though mostly static for extreme speed)
*   **Routing:** React Router DOM (with route-based AnimatePresence transitions)
*   **Sliders:** Swiper JS (optimized for seamless, touch-friendly image carousels)

## ⚡ Engineering Highlights

*   **Component-Driven Architecture:** The UI is strictly broken down into highly reusable, scalable `.tsx` components (Hero, Testimonials, Benefits, etc.), following modern composition patterns.
*   **Zero-Jank Animations:** The Hero section utilizes native CSS `breathe` animations alongside GSAP `ScrollTrigger` and Framer `motion` variants. Animations are hardware-accelerated, targeting only `transform` and `opacity` to maintain stable 60FPS.
*   **Advanced CSS Masking & Gradients:** Implementation of complex `radial-gradient` masks and glassmorphism (backdrop-blur) effects tailored for performance, mimicking native iOS/macOS aesthetics without heavy image payloads.
*   **Mobile-First Precision:** Layouts and touch targets are specifically engineered for maximum conversion on mobile devices, where 80%+ of clinic traffic originates.

## 💻 Running Locally

To run the Aura Odonto application in a development environment:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Wesleysc94/auraodontopremium.git
    cd auraodontopremium
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```

4.  **Production build:**
    ```bash
    npm run build
    ```

## 📬 Contact

Engineered by Wesley Silva.
Available for Lead Front-End and Full-Stack Engineering roles.

*   **LinkedIn:** [Wesley Silva](#)
*   **Workana:** [Wesley Silva](#)

---
<div align="center">
  <sub>Focusing on performance, design patterns, and conversion architecture.</sub>
</div>
