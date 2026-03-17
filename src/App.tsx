/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mouse, 
  Instagram, 
  Youtube, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import ConsultoriaOnline from './ConsultoriaOnline';
import ConsultoriaPresencial from './ConsultoriaPresencial';
import RedirectPage from './RedirectPage';
import ErrorBoundary from './components/ErrorBoundary';

// Custom TikTok Icon as it's not in standard Lucide
const TikTokIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-6 h-6"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'online' | 'presencial' | 'redirect'>('home');
  const [lastConsultationType, setLastConsultationType] = useState<'online' | 'presencial'>('online');

  const handleSuccess = (type: 'online' | 'presencial') => {
    setLastConsultationType(type);
    setCurrentPage('redirect');
  };

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const element = document.querySelector(anchor.hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('click', handleAnchorClick);
    return () => window.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
      {currentPage === 'home' ? (
        <motion.div 
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-black text-white font-sans selection:bg-gold-light/30"
        >
          {/* Background Glows */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-bronze/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-dark/10 blur-[120px] rounded-full"></div>
          </div>

          <main className="relative z-10 w-full flex flex-col items-center">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center w-full max-w-2xl px-6 pt-16 pb-4"
            >
              {/* Profile Image with Glow */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gold-dark/20 blur-[120px] rounded-full scale-110"></div>
                <div className="relative">
                  <img 
                    src="https://i.ibb.co/PZnPY4pC/perfil.png" 
                    alt="Daniel Henrique" 
                    className="relative w-64 h-auto md:w-80 md:h-auto object-contain drop-shadow-[0_20px_50px_rgba(184,134,11,0.2)]"
                    style={{ 
                      maskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)'
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Main Badge - Redesigned to be more compact and gold-filled */}
              <div className="mb-10 w-full max-w-sm px-4">
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_10px_40px_rgba(184,134,11,0.2)]">
                  <div className="bg-gradient-to-b from-[#B8860B] to-[#8B6508] py-4 px-8 border border-white/20">
                    <h1 className="font-serif text-xl md:text-2xl leading-tight text-white tracking-wide">
                      Daniel Henrique
                    </h1>
                    <p className="font-serif italic text-sm md:text-base text-white/90 mt-0.5">
                      Especialista em Visagismo
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-neutral-400 text-sm md:text-lg max-w-sm mb-12 leading-relaxed font-light tracking-wide">
                A ciência por trás da sua melhor versão.<br />
                Alinhando sua imagem ao seu propósito.
              </p>

              <div className="flex flex-col items-center gap-5 mb-8">
                <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600 font-semibold">Explore a experiência</p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Mouse className="w-6 h-6 text-gold-light opacity-40" strokeWidth={1} />
                </motion.div>
              </div>
            </motion.div>

            {/* Marquee - Constrained and Smaller */}
            <div className="max-w-4xl mx-auto overflow-hidden border border-gold-dark/20 py-3 mb-24 bg-neutral-900/40 backdrop-blur-md rounded-full px-4">
              <div className="flex whitespace-nowrap">
                <motion.div 
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                  className="flex items-center gap-12 pr-12"
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-6 text-[11px] md:text-[12px] font-bold tracking-[0.5em] text-gold-light uppercase">
                      Seja Autêntico <span className="text-lg">⚜️</span>
                    </div>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {[...Array(8)].map((_, i) => (
                    <div key={`dup-${i}`} className="flex items-center gap-6 text-[11px] md:text-[12px] font-bold tracking-[0.5em] text-gold-light uppercase">
                      Seja Autêntico <span className="text-lg">⚜️</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-2xl px-6 space-y-10 mb-24">
              {/* Online Consulting */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[2.5rem] gold-border bg-neutral-900/50 backdrop-blur-md"
              >
                <div className="flex flex-col md:flex-row items-stretch min-h-[320px]">
                  <div className="p-10 flex-1 text-left flex flex-col justify-center">
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 text-gold leading-tight">
                      CONSULTORIA DE<br />
                      VISAGISMO <span className="font-bold">ONLINE</span>
                    </h3>
                    <p className="text-neutral-400 text-sm md:text-base mb-8 max-w-[240px] leading-relaxed font-light">
                      Sua imagem estratégica de onde estiver. Análise individual com Dossiê completo.
                    </p>
                    <button 
                      onClick={() => setCurrentPage('online')}
                      className="w-fit flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-full bg-gradient-to-b from-[#B8860B] to-[#8B6508] text-white hover:scale-105 transition-all duration-500 shadow-lg shadow-gold-dark/20"
                    >
                      Saiba mais <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    <img 
                      src="https://i.ibb.co/PZhCGGwx/online.jpg" 
                      alt="Consultoria Online" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-transparent to-transparent md:block hidden"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/95 via-transparent to-transparent md:hidden block"></div>
                  </div>
                </div>
              </motion.div>

              {/* Presential Consulting */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[2.5rem] gold-border bg-neutral-900/50 backdrop-blur-md"
              >
                <div className="flex flex-col md:flex-row items-stretch min-h-[320px]">
                  <div className="p-10 flex-1 text-left flex flex-col justify-center">
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 text-gold leading-tight">
                      CONSULTORIA DE<br />
                      VISAGISMO <span className="font-bold">PRESENCIAL</span>
                    </h3>
                    <p className="text-neutral-400 text-sm md:text-base mb-8 max-w-[240px] leading-relaxed font-light">
                      Experiência Premium para transformar sua imagem e seu posicionamento.
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-500 mb-8 uppercase tracking-[0.2em] font-medium">
                      <span className="text-gold-light text-lg">📍</span> Av. Rio Branco, 531 - Centro, Florianópolis
                    </div>
                    <button 
                      onClick={() => setCurrentPage('presencial')}
                      className="w-fit flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-full bg-gradient-to-b from-[#B8860B] to-[#8B6508] text-white hover:scale-105 transition-all duration-500 shadow-lg shadow-gold-dark/20"
                    >
                      Agendar Presencial <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    <img 
                      src="https://i.ibb.co/7ttDDvGs/presencial.jpg" 
                      alt="Consultoria Presencial" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-transparent to-transparent md:block hidden"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/95 via-transparent to-transparent md:hidden block"></div>
                  </div>
                </div>
              </motion.div>

              {/* Social Links Grid */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  { name: 'Tiktok', icon: <TikTokIcon />, url: '#' },
                  { name: 'Youtube', icon: <Youtube />, url: '#' },
                  { name: 'Instagram', icon: <Instagram />, url: '#' },
                  { name: 'Whatsapp', icon: <MessageCircle />, url: '#' },
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    id={`social-${social.name.toLowerCase()}`}
                    whileHover={{ y: -5, backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
                    className="flex flex-col items-start p-6 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-gold-dark/30 transition-all group"
                  >
                    <div className="mb-4 text-gold-light group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-gold-light transition-colors">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-24 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">
                © 2026 Daniel Henrique • Todos os direitos reservados
              </p>
            </footer>
          </main>
        </motion.div>
      ) : currentPage === 'online' ? (
        <motion.div
          key="online"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ConsultoriaOnline 
            onBack={() => setCurrentPage('home')} 
            onSuccess={() => handleSuccess('online')}
          />
        </motion.div>
      ) : currentPage === 'presencial' ? (
        <motion.div
          key="presencial"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ConsultoriaPresencial 
            onBack={() => setCurrentPage('home')} 
            onSuccess={() => handleSuccess('presencial')}
          />
        </motion.div>
      ) : (
        <motion.div
          key="redirect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <RedirectPage type={lastConsultationType} />
        </motion.div>
      )}
    </AnimatePresence>
  </ErrorBoundary>
);
}
