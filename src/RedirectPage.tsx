import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface RedirectPageProps {
  type?: 'online' | 'presencial';
}

export default function RedirectPage({ type = 'online' }: RedirectPageProps) {
  const whatsappNumber = "5548999999999"; // Replace with actual number
  const message = type === 'online' 
    ? 'Olá! Acabei de preencher o formulário para a Consultoria de Visagismo Online.'
    : 'Olá! Acabei de preencher o formulário para a Consultoria de Visagismo Presencial.';
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Tint */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/online.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gold-dark/40 via-black/80 to-black"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl">
          <p className="text-neutral-300 text-sm md:text-base mb-10 leading-relaxed">
            Entre em contato agora mesmo via WhatsApp e inicie sua transformação para 2026.
          </p>

          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#B8860B] to-[#8B6508] text-white font-bold uppercase tracking-widest py-5 px-10 rounded-full hover:scale-105 transition-all shadow-xl shadow-gold-dark/20"
          >
            <MessageCircle className="w-5 h-5" />
            Continue seu atendimento
          </a>
        </div>
      </motion.div>
    </div>
  );
}
