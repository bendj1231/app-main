import React from 'react';

export const Styles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: #fcfcfd;
      color: #1a1a1a;
      overflow-x: hidden;
    }

    /* Layout Structure */
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
      transition: filter 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .layout-wrapper.content-loading {
      filter: blur(20px);
      transform: scale(0.98);
    }

    .layout-wrapper.content-ready {
      filter: blur(0);
      transform: scale(1);
    }

    /* Sidebar Navigation */
    .sidebar {
      width: clamp(260px, 18vw, 320px);
      height: 100vh;
      background: #ffffff;
      border-right: 1px solid #f0f0f0;
      padding: clamp(2rem, 2.5vw, 3rem) clamp(1.25rem, 1.5vw, 1.75rem);
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      z-index: 2000;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar-logo {
      width: clamp(8rem, 10vw, 10rem);
      margin-bottom: 0px;
      mix-blend-mode: multiply;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: clamp(0.4rem, 0.5vw, 0.6rem);
    }

    .nav-link {
      padding: clamp(0.65rem, 0.8vw, 0.8rem) clamp(0.85rem, 1vw, 1rem);
      border-radius: clamp(0.65rem, 0.8vw, 0.85rem);
      font-size: clamp(0.82rem, 0.9vw, 0.9rem);
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: clamp(0.4rem, 0.5vw, 0.6rem);
    }

    .nav-link:hover {
      background: #f8f9fa;
      color: #1a1a1a;
    }

    .nav-link.active {
      background: #1a1a1a;
      color: #ffffff;
    }

    /* Main Content Area */
    .main-content {
      flex: 1;
      margin-left: clamp(260px, 18vw, 320px);
      padding: clamp(2rem, 2.5vw, 3rem) clamp(3rem, 4vw, 4rem);
      max-width: calc(100vw - 280px);
      transition: all 0.3s ease;
    }

    /* Mobile Menu Overlay */
    .mobile-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      z-index: 1999;
    }

    /* Transition Blur Effect */
    .page-transition-wrapper {
      transition: filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      filter: blur(0);
      opacity: 1;
    }

    .page-blur-active {
      filter: blur(40px);
      opacity: 0;
      pointer-events: none;
    }

    .mobile-header {
      display: none;
      padding: clamp(0.85rem, 1vw, 1.1rem) clamp(1.1rem, 1.25vw, 1.35rem);
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1001;
    }

    .menu-toggle-btn {
      background: #f8f9fa;
      border: none;
      border-radius: clamp(0.6rem, 0.75vw, 0.8rem);
      padding: clamp(0.5rem, 0.6vw, 0.65rem);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Carousel Glassy Arrows */
    .carousel-arrow {
      position: absolute;
      z-index: 100;
      cursor: pointer;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      color: #1a1a1a;
    }

    .carousel-arrow:hover {
      background: rgba(255, 255, 255, 0.7);
      transform: scale(1.1);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
    }

    .carousel-arrow svg {
      width: clamp(1.2rem, 1.5vw, 1.6rem);
      height: clamp(1.2rem, 1.5vw, 1.6rem);
      stroke-width: clamp(2px, 0.25vw, 3px);
    }

    /* Glassy Icon Circle */
    .glassy-icon-circle {
      width: clamp(3.5rem, 4vw, 4.5rem);
      height: clamp(3.5rem, 4vw, 4.5rem);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .glassy-icon-circle:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1) rotate(5deg);
      border-color: rgba(255, 255, 255, 0.4);
    }

    /* Shared Page Components */
    .logbook-card {
      background: #fff;
      border-radius: clamp(1.5rem, 2vw, 2.25rem);
      border: 1px solid rgba(0,0,0,0.06);
      box-shadow: 0 20px 60px -10px rgba(0,0,0,0.08);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    }
    
    .logbook-card:hover {
      transform: translateY(-4px);
    }

    .fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }

    @keyframes fadeInUp {
      from { transform: translateY(clamp(0.85rem, 1.25vw, 1.35rem)); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .back-btn {
      background: transparent; border: none; color: #666; font-weight: 600; display: flex; align-items: center;
      gap: clamp(0.4rem, 0.5vw, 0.6rem); cursor: pointer; margin-bottom: clamp(1.5rem, 2vw, 2.25rem); font-size: clamp(0.85rem, 1vw, 1.05rem);
    }

    /* Industry Insights Grid */
    .insight-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(clamp(280px, 22vw, 340px), 1fr));
      gap: clamp(1.25rem, 1.5vw, 1.75rem);
    }
    
    .airline-card {
      background: white;
      border-radius: clamp(1.25rem, 1.5vw, 1.75rem);
      border: 1px solid #f0f0f0;
      padding: clamp(1.5rem, 2vw, 2.25rem);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .airline-logo-box {
      height: clamp(2.5rem, 3vw, 3rem);
      width: clamp(2.5rem, 3vw, 3rem);
      background: #f8f9fa;
      border-radius: clamp(0.6rem, 0.75vw, 0.8rem);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    /* Innovation Hub Highlights */
    .innovation-banner {
      background: #1a1a1a;
      color: white;
      border-radius: clamp(1.5rem, 2vw, 2rem);
      padding: clamp(2.5rem, 4vw, 3.75rem);
      margin-bottom: clamp(1.5rem, 2.5vw, 2.5rem);
      position: relative;
      overflow: hidden;
    }
    
    .innovation-banner::after {
      content: "FUTURE";
      position: absolute;
      right: clamp(-1rem, -1.25vw, -1.25rem);
      bottom: clamp(-1rem, -1.25vw, -1.25rem);
      font-size: clamp(5rem, 8vw, 8rem);
      font-weight: 900;
      opacity: 0.05;
      letter-spacing: -0.05em;
    }

    /* Airbus Section specific */
    .airbus-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(clamp(260px, 20vw, 320px), 1fr));
      gap: clamp(1.25rem, 1.5vw, 1.75rem);
    }

    .airbus-module-card {
      background: #1a237e;
      color: white;
      padding: clamp(1.5rem, 2vw, 2rem);
      border-radius: clamp(1.5rem, 1.75vw, 1.75rem);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .airbus-module-card:hover {
      transform: scale(1.02);
      background: #283593;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .airbus-module-card::before {
      content: "";
      position: absolute;
      top: -20%;
      right: -10%;
      width: clamp(120px, 10vw, 150px);
      height: clamp(120px, 10vw, 150px);
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
    }

    /* Loading Overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: all 1.2s cubic-bezier(0.65, 0, 0.35, 1);
    }

    .loading-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: scale(1.1);
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.6rem, 0.75vw, 0.8rem);
      text-align: center;
      width: 100%;
      padding: 0 clamp(1rem, 1.25vw, 1.5rem);
    }

    .loading-logo-main {
      width: clamp(200px, 35vw, 320px);
      margin-bottom: clamp(0.8rem, 1vw, 1.2rem);
      mix-blend-mode: multiply;
    }

    .loading-text {
      font-size: clamp(2.4rem, 10vw, 4rem);
      font-weight: 400;
      color: #1a1a1a;
      font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
      opacity: 0;
      transform: translateY(15px);
      animation: textReveal 1.2s ease-out forwards 0.9s;
    }

    .loading-text-portal {
      font-size: clamp(0.9rem, 4vw, 1.2rem);
      font-weight: 700;
      color: #000000;
      text-transform: uppercase;
      opacity: 0;
      transform: translateY(15px);
      animation: textReveal 1.2s ease-out forwards 0.6s;
    }

    .loading-subtitle-blue {
      font-size: clamp(0.8rem, 3.5vw, 1.1rem);
      font-weight: 500;
      color: #2563eb;
      text-transform: uppercase;
      opacity: 0;
      transform: translateY(15px);
      animation: textReveal 1.2s ease-out forwards 0.6s;
      margin-bottom: 4px;
    }

    .accreditation-box {
      margin-top: clamp(2.5rem, 3.5vw, 3.5rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.75rem, 1vw, 1rem);
      opacity: 0;
      transform: translateY(clamp(0.4rem, 0.6vw, 0.6rem));
      animation: textReveal 1.2s ease-out forwards 0.9s;
      width: 100%;
    }

    .accreditation-label {
      font-size: 0.65rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.25em;
    }

    .accreditation-logos-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(0.75rem, 1vw, 1rem);
      flex-wrap: wrap;
    }

    .accreditation-logo {
      height: clamp(1.5rem, 2vw, 2rem);
      width: auto;
      filter: grayscale(1);
      opacity: 0.5;
      transition: all 0.4s ease;
    }

    .accreditation-logo:last-child {
      height: clamp(2rem, 2.5vw, 2.5rem);
    }

    .accreditation-logo:hover {
      filter: grayscale(0);
      opacity: 1;
      transform: scale(1.05);
    }

    /* Mobile Responsive Adjustments */
    @media (max-width: 1024px) {
      .main-content {
        padding: clamp(2rem, 3vw, 2.5rem) clamp(1.5rem, 2vw, 2rem);
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        width: clamp(260px, 70vw, 280px);
        box-shadow: 20px 0 60px rgba(0,0,0,0.1);
      }

      .sidebar.sidebar-open {
        transform: translateX(0);
      }

      .mobile-overlay.sidebar-open {
        display: block;
      }

      .mobile-header {
        display: flex;
      }

      .main-content {
        margin-left: 0;
        padding: clamp(1.25rem, 3vw, 1.5rem) clamp(1rem, 2.5vw, 1.25rem);
        max-width: 100vw;
      }

      .carousel-container {
        height: auto;
        min-height: clamp(300px, 50vw, 400px);
      }

      .carousel-card-wrapper {
        width: 90vw !important;
        margin-left: -45vw !important;
      }

      .card-3d {
        flex-direction: column !important;
      }

      .card-3d > div:first-child {
        width: 100% !important;
        height: clamp(150px, 30vw, 200px) !important;
      }

      .innovation-banner {
        padding: clamp(1.75rem, 5vw, 2.5rem) clamp(1.25rem, 3vw, 2rem);
      }

      .innovation-banner h1 {
        font-size: 2.2rem;
      }

      .airbus-grid, .insight-grid {
        grid-template-columns: 1fr;
      }
      
      .accreditation-logos-row {
        gap: clamp(0.5rem, 0.75vw, 0.75rem);
      }

      .accreditation-logo {
        height: clamp(1.25rem, 1.5vw, 1.5rem);
      }
      .accreditation-logo:last-child {
        height: clamp(1.5rem, 2vw, 2rem);
      }
    }

    @keyframes logoPulse {
      from { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
      to { transform: scale(1.02); filter: drop-shadow(0 20px 40px rgba(0,0,0,0.08)); }
    }

    @keyframes textReveal {
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);
