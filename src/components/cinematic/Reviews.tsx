import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
    {
        name: "Mariana Silva",
        role: "Tratamento Clínico",
        text: "Excelente atendimento e muito cuidado durante todo o tratamento. O ambiente transmite muita paz e a equipe é impecável. Recomendo muito."
    },
    {
        name: "Roberto Almeida",
        role: "Implante Dentário",
        text: "Tinha pavor de dentista, mas a clínica me passou uma segurança absurda. O implante foi indolor e o suporte pelo WhatsApp depois foi fantástico."
    },
    {
        name: "Juliana Mendes",
        role: "Estética Avançada",
        text: "A transformação da minha autoestima foi incrível. O resultado ficou perfeito, super natural e alinhado ao meu rosto. Hoje consigo sorrir em fotos sem tentar me esconder."
    },
    {
        name: "Camila Santos",
        role: "Odontopediatria",
        text: "O nível de atenção e humanização me impressionou muito. Levei meus filhos e o cuidado deles tirou todo o trauma infantil de dentista."
    }
];

export const Reviews = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Auto-advance loop (10s active reading time)
    useEffect(() => {
        if (isAnimating) return; // Prevent multiple loops when animating
        const timer = setTimeout(() => {
            handleTransition('next');
        }, 10000);
        return () => clearTimeout(timer);
    }, [activeIndex, isAnimating]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.review-header',
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                    scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleTransition = (direction: 'next' | 'prev') => {
        if (isAnimating) return;
        setIsAnimating(true);

        // CSS Animation class triggers via key changes. 
        // We artificially enforce a delay to allow the outgoing element to fade/slide out
        setTimeout(() => {
            if (direction === 'next') {
                setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
            } else {
                setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
            }
            setTimeout(() => {
                setIsAnimating(false);
            }, 50); // Small buffer to ensure DOM has updated before next transition capability
        }, 400); // 400ms is the duration of our "fade out" phase 
    };

    const nextSlide = () => handleTransition('next');
    const prevSlide = () => handleTransition('prev');

    return (
        <section id="avaliacoes" ref={containerRef} className="py-20 px-4 w-full max-w-7xl mx-auto md:px-12 lg:px-16">
            <div className="bg-dark rounded-[3rem] w-full relative overflow-hidden px-4 md:px-12 py-16 md:py-20 shadow-2xl">
                {/* Background Texture/Gradient */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-accent/5 to-transparent opacity-50 pointer-events-none" />

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative z-10">
                    {/* Header Left Side */}
                    <div className="lg:w-1/3 flex flex-col justify-center review-header px-2">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-[1px] bg-accent" />
                                <span className="font-mono-data text-xs text-accent uppercase tracking-widest font-semibold flex-shrink-0">
                                    Prova Social
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-cream/5 border border-cream/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                <span className="text-xs text-cream font-medium tracking-wide">5.0 (271 avaliações no Google)</span>
                            </div>
                        </div>

                        <h2 className="font-serif-drama text-4xl md:text-5xl lg:text-6xl text-cream mb-6 leading-none">
                            O que nossos<br />pacientes dizem.
                        </h2>
                        <p className="font-sans-outfit text-lg text-cream/70 mb-10">
                            A maior prova do nosso compromisso é a transformação real na autoestima de quem confia no nosso trabalho.
                        </p>

                        {/* Navigation Controls (Desktop) */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream hover:bg-cream hover:text-dark transition-colors shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream hover:bg-cream hover:text-dark transition-colors shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Single Active Review Card Slider - Right Side */}
                    <div className="lg:w-2/3 grid relative overflow-hidden items-center">
                        {REVIEWS.map((review, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <div
                                    key={index}
                                    className={`[grid-area:1/1] w-full max-w-2xl mx-auto bg-gradient-to-br from-cream/[0.05] to-transparent border border-cream/[0.08] backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isActive ? 'opacity-100 scale-100 z-10 pointer-events-auto blur-0' : 'opacity-0 scale-95 z-0 pointer-events-none blur-sm'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-1.5 text-accent">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg key={star} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="drop-shadow-[0_2px_4px_rgba(34,211,238,0.3)]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                            ))}
                                        </div>
                                        <span className="font-serif-drama text-accent/20 text-6xl leading-none h-8 -mt-2 hidden sm:block">"</span>
                                    </div>

                                    <p className="font-serif-drama text-[1.65rem] md:text-[2rem] text-cream/95 italic leading-snug flex flex-col justify-center relative z-10 font-medium tracking-wide drop-shadow-sm min-h-[160px]">
                                        "{review.text}"
                                    </p>

                                    <div className="pt-6 mt-4 flex items-center gap-5 border-t border-accent/10">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent/50 p-[2px] shadow-lg shadow-accent/20 shrink-0">
                                            <div className="w-full h-full rounded-full bg-dark/90 flex items-center justify-center font-sans-bold text-cream text-2xl">
                                                {review.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col border-l-2 border-accent/30 pl-4 py-1">
                                            <span className="font-sans-outfit font-bold text-lg text-cream tracking-wide">{review.name}</span>
                                            <span className="font-mono-data text-[0.65rem] text-accent font-bold uppercase tracking-[0.2em] mt-1">{review.role}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Navigation Controls (Mobile) */}
                    <div className="flex lg:hidden items-center justify-center gap-6 mt-2 w-full">
                        <button onClick={prevSlide} className="w-14 h-14 rounded-full border-2 border-cream/20 flex items-center justify-center text-cream hover:bg-cream hover:text-dark transition-colors shadow-lg shadow-dark bg-dark/50 backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button onClick={nextSlide} className="w-14 h-14 rounded-full border-2 border-cream/20 flex items-center justify-center text-cream hover:bg-cream hover:text-dark transition-colors shadow-lg shadow-dark bg-dark/50 backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reviews;
