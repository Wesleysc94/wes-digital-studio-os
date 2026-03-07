import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* Initial Stagger Animation */
            gsap.fromTo(
                '.hero-stagger',
                {
                    y: 40,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    delay: 0.1, /* Initial mounting delay */
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 md:px-16 overflow-hidden pt-32 pb-16 md:py-0"
        >
            {/* Ambient Hero Background */}
            <div className="absolute inset-0 z-0 bg-dark overflow-hidden">
                {/* Core Hero Image with CSS Breathe Animation */}
                <div
                    ref={bgRef}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-110"
                    style={{
                        backgroundImage: "url('/hero_premium_16x9.png')",
                        backgroundPosition: 'center 30%',
                        animation: 'breathe 20s infinite alternate ease-in-out'
                    }}
                />

                {/* Mobile Contrast Overlay */}
                <div className="absolute inset-0 bg-dark/70 md:bg-dark/40" />

                {/* Radial reading zone mask */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,26,26,0.8)_0%,rgba(26,26,26,0)_80%)] pointer-events-none" />

                {/* Section Transition Gradient */}
                <div
                    className="absolute bottom-[-2px] left-0 w-full h-32 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(to top, hsl(var(--background)) 5%, transparent 100%)' }}
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full max-w-4xl text-cream flex flex-col items-center gap-4 mt-8 md:mt-16 mb-4 md:mb-0 text-center">

                {/* Main Typography Group */}
                <div className="flex flex-col items-center relative z-20">
                    <h1 className="flex flex-col gap-1 md:gap-2 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-center">
                        <span className="hero-stagger font-sans-bold text-xs sm:text-sm md:text-base lg:text-lg text-accent uppercase tracking-[0.3em] font-semibold mb-2">
                            Odontologia Estética Avançada
                        </span>
                        <span className="hero-stagger font-serif-drama text-[2.75rem] leading-[1] md:text-7xl lg:text-8xl text-cream md:leading-[0.9] mt-2">
                            Transforme seu sorriso<br className="md:hidden" /> com <span className="text-accent italic font-light">segurança.</span>
                        </span>
                    </h1>

                    <p className="hero-stagger font-sans-outfit text-base md:text-xl text-cream/90 max-w-2xl font-light mt-6 md:mt-8 leading-relaxed drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] px-2">
                        Tratamentos modernos, atendimento humanizado e resultados incrivelmente naturais para pacientes exigentes que priorizam conforto e saúde.
                    </p>
                </div>

                <div className="hero-stagger mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-xl mx-auto">
                    <button
                        onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative w-full sm:w-1/2 overflow-hidden bg-gradient-to-r from-accent/90 to-accent text-accent-foreground px-8 py-4 rounded-[2.5rem] font-sans-outfit text-base font-bold hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-[0_0_20px_hsl(var(--accent)/0.5)] flex justify-center hover:shadow-[0_0_30px_hsl(var(--accent)/0.7)]"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm w-full">
                            Agendar avaliação
                        </span>
                        <div className="absolute inset-0 bg-primary/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative w-full sm:w-1/2 overflow-hidden bg-gradient-to-r from-[#25D366]/90 to-[#25D366] text-white px-8 py-4 rounded-[2.5rem] font-sans-outfit text-base font-bold hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-[0_0_20px_rgba(37,211,102,0.4)] flex justify-center hover:shadow-[0_0_30px_rgba(37,211,102,0.6)]"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                            Falar no WhatsApp
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                </div>

                {/* Social Proof Indicators */}
                <div className="hero-stagger mt-10 grid grid-cols-3 gap-2 sm:gap-8 border-y border-white/10 py-5 w-full max-w-2xl bg-dark/20 backdrop-blur-sm sm:rounded-3xl sm:border-x px-2 mx-auto transition-all duration-500 hover:bg-dark/40 hover:backdrop-blur-md hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-white/20 cursor-default group">
                    <div className="flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
                        <div className="flex items-center gap-1 text-accent mb-1 drop-shadow-md">
                            <span className="font-sans-bold text-cream text-lg">5.0</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        </div>
                        <span className="text-[9px] sm:text-xs text-cream/70 uppercase tracking-widest font-mono-data text-center group-hover:text-cream transition-colors duration-300">No Google</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-white/10 px-2 sm:px-4 transition-transform duration-300 delay-75 group-hover:-translate-y-1">
                        <span className="font-sans-bold text-cream text-lg mb-1 drop-shadow-md">+5.000</span>
                        <span className="text-[9px] sm:text-xs text-cream/70 uppercase tracking-widest font-mono-data text-center group-hover:text-cream transition-colors duration-300">Pacientes</span>
                    </div>
                    <div className="flex flex-col items-center px-2 transition-transform duration-300 delay-150 group-hover:-translate-y-1">
                        <span className="font-sans-bold text-cream text-lg mb-1 drop-shadow-md">+10 Anos</span>
                        <span className="text-[9px] sm:text-xs text-cream/70 uppercase tracking-widest font-mono-data text-center group-hover:text-cream transition-colors duration-300">Experiência</span>
                    </div>
                </div>
            </div>

            {/* Scroll CTA */}
            <div className="hero-stagger mt-8 mb-8 md:absolute md:bottom-10 md:mb-0 left-0 w-full z-10 flex justify-center pointer-events-none">
                <div
                    className="flex flex-col items-center gap-2 pointer-events-auto cursor-pointer group bg-dark/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 hover:bg-dark/60 transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.3)] animate-pulse"
                    onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="font-mono-data text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-cream font-bold text-center whitespace-nowrap">Conheça a Aura</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down text-accent animate-bounce"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            </div>
        </section>
    );
};

export default Hero;
