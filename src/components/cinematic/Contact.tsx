import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.contact-anim',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
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
        <section id="contato" ref={containerRef} className="py-10 lg:py-16 px-8 md:px-16 w-full max-w-7xl mx-auto">

            <div className="bg-card text-card-foreground rounded-[3rem] p-6 md:p-10 lg:p-12 relative overflow-hidden shadow-2xl border border-border/50">
                {/* Background Texture/Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16 justify-between">

                    {/* Info Side */}
                    <div className="lg:w-1/2 flex flex-col gap-6 lg:gap-8">
                        <div>
                            <h2 className="contact-anim font-serif-drama text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
                                Volte a Sorrir.
                            </h2>
                            <p className="contact-anim font-sans-outfit text-foreground/80 text-lg">
                                Estamos prontos para receber você e sua família. Agende sua avaliação e descubra como a odontologia pode ser acolhedora.
                            </p>
                        </div>

                        <div className="contact-anim flex flex-col gap-6 mt-2 w-full h-full min-h-[200px] lg:min-h-[250px] rounded-2xl overflow-hidden shadow-lg border border-border/10 relative">
                            {/* Google Maps iframe */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117036.78440029519!2d-46.47161821434969!3d-23.551821896792612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce66fee7ce4bc3%3A0xe138bb92fa68ec2e!2sGuaianases%2C%20S%C3%A3o%20Paulo%20-%20State%20of%20S%C3%A3o%20Paulo!5e0!3m2!1sen!2sbr!4v1715015383562!5m2!1sen!2sbr"
                                width="100%"
                                height="100%"
                                style={{ border: 0, position: 'absolute', inset: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </div>

                    {/* Form / CTA Side */}
                    <div className="lg:w-1/2 flex items-center justify-center lg:justify-end">
                        <div className="contact-anim bg-background text-foreground rounded-[2rem] p-6 lg:p-8 w-full max-w-md shadow-xl flex flex-col gap-6 shadow-black/20">
                            <div className="text-center">
                                <h3 className="font-sans-bold text-2xl mb-2">Pré-agendamento</h3>
                                <p className="font-sans-outfit text-sm text-foreground/70">
                                    Preencha os dados e nossa equipe confirmará o seu horário via WhatsApp em minutos.
                                </p>
                            </div>

                            <form
                                className="flex flex-col gap-4 font-sans-outfit"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const nome = formData.get('nome');
                                    const servico = formData.get('servico');
                                    const turno = formData.get('turno');

                                    const message = `Olá equipe Souffi! Me chamo *${nome}* e gostaria de solicitar um pré-agendamento para avaliação sobre *${servico}*. Minha preferência de horário é no período da *${turno}*. Podem me confirmar a disponibilidade?`;

                                    // WhatsApp Link Builder (Replace with real clinic number later)
                                    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
                                    window.open(whatsappUrl, '_blank');
                                }}
                            >
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="nome" className="text-xs tracking-wider uppercase font-semibold text-foreground/60 pl-1">Seu Nome</label>
                                    <input required type="text" id="nome" name="nome" placeholder="Como gosta de ser chamado" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-foreground" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="servico" className="text-xs tracking-wider uppercase font-semibold text-foreground/60 pl-1">O que você busca?</label>
                                    <select required id="servico" name="servico" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all appearance-none text-foreground">
                                        <option value="" disabled selected>Selecione um tratamento</option>
                                        <option value="Lentes de Contato / Estética">Lentes de Contato & Estética</option>
                                        <option value="Implantes / Reabilitação">Implantes & Reabilitação</option>
                                        <option value="Ortodontia (Aparelhos)">Ortodontia (Aparelhos)</option>
                                        <option value="Limpeza / Clínico Geral">Limpeza & Prevenção</option>
                                        <option value="Ainda não tenho certeza">Não tenho certeza, preciso de avaliação</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5 mb-2">
                                    <label htmlFor="turno" className="text-xs tracking-wider uppercase font-semibold text-foreground/60 pl-1">Melhor Turno</label>
                                    <select required id="turno" name="turno" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all appearance-none text-foreground">
                                        <option value="" disabled selected>Preferência de horário</option>
                                        <option value="Manhã (08h - 12h)">Manhã (08h - 12h)</option>
                                        <option value="Tarde (13h - 18h)">Tarde (13h - 18h)</option>
                                        <option value="Noite (Após 18h)">Noite (Após 18h)</option>
                                    </select>
                                </div>

                                <button type="submit" className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-xl font-sans-bold text-lg hover:-translate-y-1 transition-transform shadow-lg shadow-[#25D366]/30 mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                                    Solicitar Horário
                                </button>
                            </form>

                            <p className="font-sans-outfit text-xs text-center text-foreground/40 mt-[-10px]">
                                Tratamento 100% seguro e confidencial.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Contact;
