import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Play,
  Users,
  ShieldCheck,
  ArrowLeft,
  Volume2,
  VolumeX
} from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, getDocFromServer, doc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ConsultoriaOnlineProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function ConsultoriaOnline({ onBack, onSuccess }: ConsultoriaOnlineProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    profissao: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const path = 'leads';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSubmitting(false);
      onSuccess();
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold-light/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-gold-light" />
            <span className="font-serif text-xl tracking-tighter">DANIEL HENRIQUE</span>
          </div>
          <button 
            onClick={scrollToForm}
            className="bg-gold-dark hover:bg-gold text-white text-[10px] font-bold uppercase tracking-widest py-3 px-6 rounded-full transition-all shadow-lg shadow-gold-dark/20"
          >
            Garantir vaga
          </button>
        </div>
      </header>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
              Consultoria de <br />
              <span className="text-gold">Visagismo Online</span> com <br />
              Daniel Henrique
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              Método validado em mais de 2.700 homens: 98% relataram mais confiança nos 7 dias seguintes!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
              <button 
                onClick={scrollToForm}
                className="w-full sm:w-auto bg-white text-black text-xs font-bold uppercase tracking-widest py-5 px-10 rounded-full hover:bg-gold transition-all"
              >
                Quero minha análise agora
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-white">+ de 2.700 Clientes</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">atendidos e satisfeitos</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-gold-light/60">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Autoridade nº 1 em Visagismo no Brasil</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gold-dark/20 blur-[100px] rounded-full"></div>
            <img 
              src="https://i.ibb.co/tTxhJn01/online2.png" 
              alt="Daniel Henrique" 
              className="relative w-full h-auto object-contain drop-shadow-2xl"
              style={{ 
                maskImage: 'radial-gradient(circle at center, black 25%, rgba(0,0,0,0.9) 55%, transparent 90%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 25%, rgba(0,0,0,0.9) 55%, transparent 90%)'
              }}
            />
          </motion.div>
        </section>

        {/* VSL Section */}
        <section className="max-w-5xl mx-auto px-6 mb-32">
          <div className="relative aspect-video rounded-3xl overflow-hidden border-8 border-gold-dark/30 shadow-2xl bg-neutral-900 flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-gold-light/20 mx-auto mb-4" />
              <p className="text-gold-light/40 font-serif italic">Vídeo em breve</p>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problemas" className="max-w-6xl mx-auto px-6 mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-dark/30 text-gold-light text-[10px] uppercase tracking-widest font-bold mb-6">
                <XCircle className="w-3 h-3" /> O problema
              </div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
                Você se identifica com alguma dessas situações?
              </h2>
              <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                Se você marcou um ou mais itens, entenda: <span className="text-gold-light font-bold">o problema não é você.</span> É a falta de um direcionamento estratégico para sua imagem.
              </p>
              <button 
                onClick={scrollToForm}
                className="bg-transparent border border-gold-dark/50 text-gold-light text-xs font-bold uppercase tracking-widest py-5 px-10 rounded-full hover:bg-gold-dark/10 transition-all flex items-center gap-3"
              >
                Quero garantir minha vaga <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Falta de autoridade', desc: 'Sente que sua aparência não transmite a autoridade e competência que você realmente possui no trabalho?' },
                { title: 'Gasto desnecessário', desc: 'Gasta dinheiro com roupas, cortes de cabelo e barba que, no fim, não combinam com você?' },
                { title: 'Insegurança', desc: 'Sente-se inseguro ou "invisível" em ambientes sociais ou profissionais importantes?' },
                { title: 'Insatisfeito', desc: 'Olha no espelho e sente que falta "algo" para conectar quem você é por dentro com o que veem por fora?' },
              ].map((item, i) => (
                <div key={i} className={`p-8 rounded-3xl bg-neutral-900/50 border ${i === 1 ? 'border-gold-dark/50 shadow-[0_0_30px_rgba(184,134,11,0.1)]' : 'border-white/5'} flex flex-col justify-between h-full`}>
                  <div>
                    <h4 className="font-bold text-lg mb-4">{item.title}</h4>
                    <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-6 w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center relative group/tooltip">
                    <XCircle className="w-4 h-4 text-neutral-700" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 p-3 bg-neutral-800 text-[10px] text-neutral-200 rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-50 border border-white/10 shadow-2xl backdrop-blur-sm">
                      <p className="leading-relaxed">{item.desc}</p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-neutral-800"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Method Section */}
        <section className="max-w-6xl mx-auto px-6 mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-dark/30 text-gold-light text-[10px] uppercase tracking-widest font-bold mb-8">
            <CheckCircle2 className="w-3 h-3" /> Conheça o método
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6 max-w-4xl mx-auto">
            A solução não é mudar quem você é. <br />
            É alinhar sua imagem à sua verdadeira identidade.
          </h2>
          <p className="text-neutral-500 text-sm md:text-base max-w-3xl mx-auto mb-16 leading-relaxed">
            Exploramos vários elementos, como o formato do rosto, crânio, perfil, arquétipos, perfil comportamental, armação de óculos, textura de cabelo, barba e sobrancelha.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: 'Passo 1', title: 'Pré-análise visual', desc: 'Onde mergulhamos em quem você é, seus objetivos e o que deseja comunicar.', img: 'https://i.ibb.co/PZnPY4pC/perfil.png' },
              { step: 'Passo 2', title: 'Encontro online', desc: 'Analisamos tecnicamente os traços do seu rosto e como eles se conectam com sua personalidade.', img: 'https://i.ibb.co/PZhCGGwx/online.jpg' },
              { step: 'Passo 3', title: 'Alinhamento de imagem', desc: 'Criamos um dossiê prático e personalizado com as direções exatas para seu cabelo, barba, óculos e estilo.', img: 'https://i.ibb.co/S4Zn45P0/depois1.jpg' },
            ].map((item, i) => (
              <div key={i} className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-neutral-900/40">
                <div className="h-80 relative overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-left">
                    <div className="inline-block px-3 py-1 rounded-full border border-gold-dark/30 text-gold-light text-[9px] uppercase tracking-widest font-bold mb-4">
                      {item.step}
                    </div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={scrollToForm}
            className="mt-16 bg-transparent border border-gold-dark/50 text-gold-light text-xs font-bold uppercase tracking-widest py-5 px-12 rounded-full hover:bg-gold-dark/10 transition-all flex items-center gap-3 mx-auto"
          >
            Comprar Consultoria <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Deliverables Section */}
        <section className="max-w-4xl mx-auto px-6 mb-32">
          <div className="relative overflow-hidden rounded-[3rem] shadow-[0_20px_60px_rgba(184,134,11,0.2)]">
            <div className="bg-gradient-to-b from-[#B8860B] to-[#8B6508] p-12 md:p-16 text-center border border-white/20">
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-white mb-12">
                Sua Consultoria de Visagismo, <br />
                na prática você receberá:
              </h2>
              
              <div className="space-y-6 text-left max-w-2xl mx-auto mb-12">
                {[
                  { title: 'Sessão de Análise Online e Ao Vivo (90 min):', desc: 'Um encontro direto comigo para o diagnóstico completo.' },
                  { title: 'Dossiê de Imagem Pessoal (PDF):', desc: 'Seu manual de consulta com todas as análises e direcionamentos.' },
                  { title: 'Mapa Visual de Recomendações:', desc: 'Imagens de referência para cabelo, barba e modelos de óculos ideais para você.' },
                  { title: 'Plano de Ação Imediato:', desc: 'Os primeiros passos que você deve dar para já começar a ver a transformação.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                    <div>
                      <p className="text-white font-bold text-sm md:text-base">{item.title} <span className="font-normal text-white/80">{item.desc}</span></p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-[10px] uppercase tracking-widest font-bold">
                <ShieldCheck className="w-4 h-4" /> Entregáveis
              </div>
            </div>
          </div>
        </section>

        {/* Feedbacks Section */}
        <section className="max-w-6xl mx-auto px-6 mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-dark/30 text-gold-light text-[10px] uppercase tracking-widest font-bold mb-8">
            <Users className="w-3 h-3" /> Resultados Reais
          </div>
          <h2 className="font-serif text-4xl md:text-5xl mb-16">Transformações que falam por si</h2>
          
          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Pair 1 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-3xl overflow-hidden border border-white/5 bg-neutral-900/50 p-2">
                <div className="relative aspect-[3/4]">
                  <img src="https://i.ibb.co/bj8q91b9/antes1.jpg" alt="Antes 1" className="w-full h-full object-cover rounded-2xl" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest">Antes</div>
                </div>
                <div className="relative aspect-[3/4]">
                  <img src="https://i.ibb.co/S4Zn45P0/depois1.jpg" alt="Depois 1" className="w-full h-full object-cover rounded-2xl" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gold/80 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest">Depois</div>
                </div>
              </div>
              <p className="text-neutral-500 text-xs italic">"A mudança no olhar e na postura é imediata."</p>
            </div>

            {/* Pair 2 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-3xl overflow-hidden border border-white/5 bg-neutral-900/50 p-2">
                <div className="relative aspect-[3/4]">
                  <img src="https://i.ibb.co/jPMSFtLQ/antes2.jpg" alt="Antes 2" className="w-full h-full object-cover rounded-2xl" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest">Antes</div>
                </div>
                <div className="relative aspect-[3/4]">
                  <img src="https://i.ibb.co/WppD1j1h/depois2.jpg" alt="Depois 2" className="w-full h-full object-cover rounded-2xl" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gold/80 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest">Depois</div>
                </div>
              </div>
              <p className="text-neutral-500 text-xs italic">"Alinhamento total com a identidade profissional."</p>
            </div>
          </div>

          {/* Single Photo - Full Width or Centered */}
          <div className="max-w-2xl mx-auto mb-24">
            <div className="rounded-[2.5rem] overflow-hidden border border-gold-dark/20 shadow-2xl shadow-gold-dark/5">
              <img src="https://i.ibb.co/Y484vkt7/mudoucpfdnv.jpg" alt="Resultado Completo" className="w-full h-auto" />
            </div>
            <p className="mt-6 text-gold-light text-sm font-serif italic">Impacto visual que gera autoridade instantânea</p>
          </div>

          {/* Videos Grid */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { id: 'ln1gge9em1', title: 'Depoimento Estratégico' },
              { id: '5znuistuim', title: 'A Experiência do Cliente' }
            ].map((video, i) => {
              return (
                <div 
                  key={i} 
                  className="group relative w-full max-w-[320px] aspect-[9/16] bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
                >
                  <iframe 
                    src={`https://fast.wistia.net/embed/iframe/${video.id}?videoFoam=true`}
                    title={video.title}
                    allow="autoplay; fullscreen"
                    frameBorder="0"
                    scrolling="no"
                    className="w-full h-full"
                  ></iframe>
                </div>
              );
            })}
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-dark/30 text-gold-light text-[10px] uppercase tracking-widest font-bold mb-6">
                <Users className="w-3 h-3" /> Para você
              </div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
                Para quem é a Consultoria de Visagismo?
              </h2>
              <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                Se você marcou um ou mais itens, entenda: <span className="text-gold-light font-bold">o problema não é você.</span> É a falta de um direcionamento estratégico para sua imagem.
              </p>
              <button 
                onClick={scrollToForm}
                className="bg-transparent border border-gold-dark/50 text-gold-light text-xs font-bold uppercase tracking-widest py-5 px-10 rounded-full hover:bg-gold-dark/10 transition-all flex items-center gap-3"
              >
                Comprar Consultoria <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Empresários', desc: 'Para Profissionais e Empresários que desejam que sua imagem transmita a mesma autoridade de seu currículo.' },
                { title: 'Homens inseguros', desc: 'Para homens que estão cansados de se sentirem inseguros com a aparência e querem assumir o controle.' },
                { title: 'Transição de vida', desc: 'Para quem está passando por uma transição de vida (novo cargo, divórcio, mudança de cidade) e busca um recomeço.' },
                { title: 'Autoconhecimento', desc: 'Para quem busca autoconhecimento e entende que a imagem pessoal é uma ferramenta poderosa para isso.' },
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 flex flex-col justify-between h-full">
                  <div>
                    <h4 className="font-bold text-lg mb-4">{item.title}</h4>
                    <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-6 w-8 h-8 rounded-full bg-gold-dark/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-gold-light" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="contato" ref={formRef} className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl mb-4">Vagas limitadas!</h2>
            <p className="text-neutral-400 leading-relaxed">
              Quero entender pessoalmente o seu momento e seus desafios. Preencha os campos abaixo para que eu possa conhecer um pouco sobre você. Em seguida, vamos continuar essa conversa diretamente no WhatsApp para traçarmos juntos o melhor plano para a sua imagem.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2">Nome</label>
              <input 
                type="text" 
                name="nome"
                required
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full bg-white text-black py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2">E-mail</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white text-black py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2">Telefone</label>
              <input 
                type="tel" 
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleInputChange}
                className="w-full bg-white text-black py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2">Sua profissão</label>
              <input 
                type="text" 
                name="profissao"
                required
                value={formData.profissao}
                onChange={handleInputChange}
                className="w-full bg-white text-black py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold" 
              />
            </div>
            
            <div className="flex items-start gap-3 py-4">
              <input type="checkbox" className="mt-1" id="privacy" required />
              <label htmlFor="privacy" className="text-[10px] text-neutral-500 leading-relaxed">
                Ao enviar as informações neste formulário, você confirma estar ciente e concorda com os termos da nossa Política de Privacidade que você encontra no rodapé deste website. Garantimos a confidencialidade e o uso responsável de seus dados, conforme descrito em nossa política.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gold-dark hover:bg-gold text-white font-bold uppercase tracking-widest py-6 rounded-xl transition-all shadow-xl shadow-gold-dark/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processando...' : 'Quero minha vaga'}
            </button>
          </form>
        </section>

        {/* Mentor Section */}
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-white/5 mt-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-dark/30 text-gold-light text-[10px] uppercase tracking-widest font-bold mb-6">
                <ShieldCheck className="w-3 h-3" /> Quem é Daniel Henrique
              </div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
                Conheça seu mentor
              </h2>
              <div className="space-y-6 text-neutral-400 text-sm md:text-base leading-relaxed">
                <p>
                  Sou um profissional da beleza dedicado ao público masculino há mais de 9 anos. Sempre busquei promover a autenticidade na imagem masculina, fugindo dos padrões convencionais e trazendo uma expressão genuína aos meus clientes.
                </p>
                <p>
                  Meus estudos são fundamentados em adaptações do <span className="text-white font-bold italic">visagismo de Philip Hallawell</span>. Além disso, formei-me no visagismo específico para homens pelo “Método Ronan Mendes”, beneficiando mais de 2.700 clientes desde 2018. Essa experiência tem aprimorado minha capacidade de compreender e realçar a beleza singular de cada cliente.
                </p>
                <p>
                  Meu foco é auxiliar homens a aprimorarem sua imagem e posicionamento, impulsionando tanto sua vida pessoal quanto profissional por meio do visagismo integrado, fortalecendo sua autoestima e permitindo alcançar uma presença mais confiante e impactante.
                </p>
              </div>
              <button 
                onClick={scrollToForm}
                className="mt-10 bg-transparent border border-gold-dark/50 text-gold-light text-xs font-bold uppercase tracking-widest py-5 px-10 rounded-full hover:bg-gold-dark/10 transition-all flex items-center gap-3"
              >
                COMPRAR CONSULTORIA <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border border-white/10"
            >
              <iframe 
                src="https://fast.wistia.net/embed/iframe/57ynzjv8pr?videoFoam=true"
                title="Conheça Daniel Henrique"
                allow="autoplay; fullscreen"
                frameBorder="0"
                scrolling="no"
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">
          © 2026 Daniel Henrique • Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
