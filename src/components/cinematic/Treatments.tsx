import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const TreatmentCard = ({ title, description, image, delay, link }: { title: string, description: string, image: string, delay: number, link: string }) => {
    return (
        <Link to={link} className="treatment-card block relative h-[400px] w-full rounded-[2rem] overflow-hidden bg-primary/20 shadow-xl group cursor-pointer border border-border/10 isolate">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] md:group-hover:scale-110 opacity-60 mix-blend-overlay"
                style={{ backgroundImage: `url(${image})` }}
            />
            {/* Glassmorphism Solid Base & Gradient Overlay */}
            <div className="absolute inset-0 bg-dark/80 backdrop-blur-[2px] opacity-60 transition-opacity duration-700 group-hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-90" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end text-cream translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                <h3 className="font-sans-bold text-2xl mb-2 text-white drop-shadow-md">{title}</h3>
                <p className="font-sans-outfit text-white/80 text-sm mb-6 drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {description}
                </p>
                <button className="flex items-center gap-2 text-accent font-sans-bold text-sm uppercase tracking-wider relative overflow-hidden group/btn w-fit">
                    <span>Saber Mais</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                </button>
            </div>
        </Link>
    );
};

export const Treatments = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.treatment-card',
                { y: 48, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="tratamentos" ref={containerRef} className="py-24 lg:py-32 px-8 md:px-16 w-full max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-12 max-w-3xl flex flex-col items-center mx-auto text-center">
                <div className="flex items-center gap-4 mb-6">
                    <span className="w-8 h-[1px] bg-accent" />
                    <span className="font-mono-data text-xs text-accent uppercase tracking-widest font-semibold">
                        A Arte de Sorrir
                    </span>
                    <span className="w-8 h-[1px] bg-accent" />
                </div>

                <h2 className="font-serif-drama text-5xl md:text-6xl text-primary mb-6 leading-none">
                    A transformação que você merece.
                </h2>

                <p className="font-sans-outfit text-lg text-primary/70 max-w-xl">
                    Excelência técnica e sensibilidade estética juntas para entregar os tratamentos mais seguros, previsíveis e confortáveis do mercado.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TreatmentCard
                    delay={0}
                    title="Prevenção que protege o seu bem-estar"
                    description="Cuidamos de você antes que a dor apareça. Protocolos de limpeza profunda para garantir que seu sorriso se mantenha forte e iluminado para a vida toda."
                    image="/prevention.png"
                    link="/tratamentos/prevencao-integral"
                />

                <TreatmentCard
                    delay={0.15}
                    title="Estética para uma autoestima inabalável"
                    description="Transforme a harmonia do seu rosto com lentes ultrafinas e naturais. Sorria sem medo com resultados fotográficos de altíssimo padrão."
                    image="/orthodontics.png"
                    link="/tratamentos/ortodontia"
                />

                <TreatmentCard
                    delay={0.3}
                    title="Implantes que devolvem sua segurança"
                    description="Recupere a estética e a mastigação com implantes modernos. Um procedimento seguro, planejado para proporcionar estabilidade total e muito conforto."
                    image="/rehab.png"
                    link="/tratamentos/reabilitacao"
                />
            </div>

        </section>
    );
};

export default Treatments;
