import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/cinematic/Navbar';
import Contact from '../components/cinematic/Contact';
import Footer from '../components/cinematic/Footer';

const TREATMENT_DATA = {
    'prevencao-integral': {
        title: 'Prevenção Integral',
        subtitle: 'Cuidado Contínuo e Diagnóstico Precoce',
        heroImage: '/prevention.png',
        description: 'A base de um sorriso perfeito e duradouro é a saúde. Na Souffi Odontologia, desconstruímos o modelo antigo de procurar o dentista apenas na dor. Nossa prevenção atua como um escudo biológico, garantindo que suas gengivas, dentes e futuras reabilitações permaneçam impecáveis ao longo dos anos, através de protocolos ultramodernos e absolutamente indolores.',
        benefits: [
            'Profilaxia profunda com ultrassom Piezo (tecnologia indolor).',
            'Jato de bicarbonato de última geração para remoção de manchas.',
            'Câmera intraoral para check-up preventivo milimétrico.',
            'Orientação de longevidade para suas próteses ou lentes.'
        ],
        steps: [
            { step: '01', title: 'Scan Diagnóstico', desc: 'Mapeamos cada milímetro do seu sorriso com câmeras de alta precisão.' },
            { step: '02', title: 'Limpeza Profunda', desc: 'Desinfecção periodontal completa sem os antigos ruídos ou dores agudas.' },
            { step: '03', title: 'Blindagem', desc: 'Polimento e aplicação de agentes protetores que selam e fortificam a estrutura dentária local.' }
        ]
    },
    'ortodontia': {
        title: 'Ortodontia e Estética',
        subtitle: 'Sorrisos Alinhados e Facetas de Alta Performance',
        heroImage: '/orthodontics.png',
        description: 'A união perfeita entre função mastigatória e arquitetura facial. Utilizamos Alinhadores Invisíveis de ponta para alinhar seus dentes sem o incômodo dos arames metálicos, reduzindo o tempo de tratamento. Em seguida, coroamos a transformação com a confecção de Lentes de Contato de Porcelana ou Resina fluída para um design de sorriso fotográfico, feito milimetricamente para respeitar o seu biotipo.',
        benefits: [
            'Alinhadores transparentes (Invisalign): sem restrições alimentares e invisíveis a olho nu.',
            'Lentes de Contato ultra-finas: transformação radical de cor e formato sem desgastes excessivos.',
            'Previsibilidade 3D: veja seu novo sorriso projetado na tela do computador antes do primeiro toque.',
            'Test Drive do Sorriso (Mockup) para você aprovar o formato final.'
        ],
        steps: [
            { step: '01', title: 'Design Digital', desc: 'Escaneamos sua boca em 3D e projetamos o resultado final na tela em conjunto com você.' },
            { step: '02', title: 'Fase Ativa', desc: 'Seja através de alinhadores invisíveis ou preparos conservadores para lentes, a execução é rápida e suave.' },
            { step: '03', title: 'Cimentação e Entrega', desc: 'O dia da transformação. Cimentação definitiva com adesivos de padrão ouro mundial para durabilidade extrema.' }
        ]
    },
    'reabilitacao': {
        title: 'Reabilitação Oral & Implantes',
        subtitle: 'Recupere sua Confiança e Mastigação Certa',
        heroImage: '/rehab.png',
        description: 'Perder um dente nunca mais deve ser sinônimo de vergonha. A Reabilitação Oral com Implantes Dentários devolve não apenas a estética impecável, mas a força e estabilidade idênticas as de um dente natural. Dominamos a Implantodontia Guiada por Computador, o que significa cirurgias sem cortes de bisturi massivos, recuperação ninja e um resultado final de brilhar os olhos.',
        benefits: [
            'Implantes de Titânio puro e Zircônia, de altíssima compatibilidade biológica.',
            'Cirurgia Guiada em 3D: sem grandes incisões, sem inchaços drásticos, recuperação até 50% mais rápida.',
            'Carga Imediata (quando indicado): entre sem os dentes e saia com coroas provisórias fixas no mesmo dia.',
            'Coroas em porcelana premium: impossível distinguir do seu dente natural.'
        ],
        steps: [
            { step: '01', title: 'Guia Tomográfico', desc: 'Usamos tomografia cone-beam para mapear seu osso e fabricar um guia cirúrgico em 3D.' },
            { step: '02', title: 'Cirurgia Ninja', desc: 'O implante é inserido milimetricamente pelo guia, muitas vezes sem pontos de sutura, anestesia robótica sem dor.' },
            { step: '03', title: 'Sorriso Fixo', desc: 'Após a união do osso (osseointegração), a coroa de porcelana eterna é fixada, devolvendo sua força total.' }
        ]
    }
};

const TreatmentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    // Assert id is a valid key, else we rely on default or show error
    const data = TREATMENT_DATA[id as keyof typeof TREATMENT_DATA];

    useEffect(() => {
        window.scrollTo(0, 0); // Reset scroll on page load

        if (data) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.anim-up',
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
                );
            }, containerRef);
            return () => ctx.revert();
        }
    }, [data, id]);

    if (!data) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-dark text-cream">
                <h1 className="text-4xl font-serif-drama mb-4">Tratamento não encontrado</h1>
                <button onClick={() => navigate('/')} className="text-accent hover:underline">
                    Voltar para o Início
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent w-full">
            <Navbar />

            {/* Hero Section Específica */}
            <section className="relative w-full h-[60vh] md:h-[70vh] flex flex-col items-center justify-center px-8 text-center pt-20">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                        style={{ backgroundImage: `url(${data.heroImage})` }}
                    />
                    <div className="absolute inset-0 bg-dark/70 backdrop-blur-[2px]" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
                </div>

                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                    <div className="anim-up flex items-center gap-4 mb-4">
                        <span className="w-12 h-[1px] bg-accent" />
                        <span className="font-mono-data text-accent tracking-widest uppercase text-sm font-bold">
                            Especialidades Souffi
                        </span>
                        <span className="w-12 h-[1px] bg-accent" />
                    </div>
                    <h1 className="anim-up font-serif-drama text-5xl md:text-7xl lg:text-8xl text-cream leading-none mb-6 drop-shadow-xl">
                        {data.title}
                    </h1>
                    <p className="anim-up font-sans-outfit text-xl text-cream/90 font-light drop-shadow-md">
                        {data.subtitle}
                    </p>
                </div>
            </section>

            {/* Detalhes Clínicos */}
            <section className="py-24 px-8 md:px-16 w-full max-w-5xl mx-auto">
                <div className="mb-12 anim-up flex w-full">
                    <button
                        onClick={() => navigate('/#tratamentos')}
                        className="flex items-center gap-2 text-primary/60 hover:text-accent font-sans-bold text-sm uppercase tracking-widest transition-colors group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left group-hover:-translate-x-1 transition-transform"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-16 items-start">
                    <div className="md:w-1/2 flex flex-col gap-6">
                        <div className="flex items-center gap-3 mb-2 anim-up">
                            <span className="w-6 h-[1px] bg-accent" />
                            <span className="font-mono-data text-xs text-accent uppercase tracking-widest font-semibold">Diagnóstico & Estratégia</span>
                        </div>
                        <h2 className="anim-up font-serif-drama text-4xl lg:text-5xl text-primary leading-tight">A Visão<br />Clínica</h2>
                        <p className="anim-up font-sans-outfit text-primary/80 text-lg leading-relaxed mt-4">
                            {data.description}
                        </p>

                        <div className="mt-8 border-l-2 border-accent/30 pl-6 anim-up py-2">
                            <p className="font-serif-drama text-2xl text-primary/90 italic">"Padrão ouro em tecnologia e acolhimento."</p>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex flex-col gap-6">
                        <div className="flex items-center gap-3 mb-2 anim-up">
                            <span className="w-6 h-[1px] bg-accent" />
                            <span className="font-mono-data text-xs text-accent uppercase tracking-widest font-semibold">Vantagens Diretas</span>
                        </div>
                        <h2 className="anim-up font-serif-drama text-4xl lg:text-5xl text-primary leading-tight">Principais<br />Benefícios</h2>
                        <ul className="flex flex-col gap-4 mt-4">
                            {data.benefits.map((benefit, idx) => (
                                <li key={idx} className="anim-up flex items-start gap-4 p-5 rounded-2xl bg-white border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
                                    </div>
                                    <span className="font-sans-outfit text-primary/80 leading-relaxed text-[15px] pt-1">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Nossa Metodologia (Steps) */}
                <div className="mt-32 w-full flex flex-col">
                    <div className="flex flex-col items-center text-center mb-16 anim-up">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-8 h-[1px] bg-accent" />
                            <span className="font-mono-data text-xs text-accent uppercase tracking-widest font-semibold">
                                O Passo a Passo
                            </span>
                            <span className="w-8 h-[1px] bg-accent" />
                        </div>
                        <h2 className="font-serif-drama text-4xl md:text-5xl text-primary">Nossa Metodologia</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Linha conectora desktop */}
                        <div className="hidden md:block absolute top-[44px] left-[10%] w-[80%] h-[2px] bg-primary/5 z-0" />

                        {data.steps.map((stepData, idx) => (
                            <div key={idx} className="anim-up relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-full bg-white border-8 border-cream flex items-center justify-center shadow-lg shadow-primary/5 mb-8 group-hover:border-accent/20 transition-colors duration-500">
                                    <span className="font-serif-drama text-3xl text-primary">{stepData.step}</span>
                                </div>
                                <h3 className="font-sans-bold text-xl text-primary mb-3">{stepData.title}</h3>
                                <p className="font-sans-outfit text-primary/70 text-sm leading-relaxed px-4">{stepData.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 flex justify-center w-full anim-up">
                    <button
                        onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-accent text-white px-10 py-5 rounded-full font-sans-bold uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform"
                    >
                        Agendar Avaliação
                    </button>
                </div>
            </section>

            <Contact />
            <Footer />
        </div>
    );
};

export default TreatmentDetails;
