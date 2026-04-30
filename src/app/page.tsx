"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InstagramIcon, FacebookIcon, TikTokIcon, PhoneIcon, MailIcon, QrCodeIcon } from "@/components/icons";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showRotatePrompt, setShowRotatePrompt] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobile = window.innerWidth < 768;
      setShowRotatePrompt(isPortrait && isMobile);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkOrientation);
    checkOrientation();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Rotation Prompt for Mobile */}
      {showRotatePrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md md:hidden animate-in fade-in duration-500">
          <div className="text-center p-8 flex flex-col items-center gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="relative bg-white/10 p-5 rounded-2xl border border-white/20 animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary animate-spin-slow"
                  style={{ animationDuration: '3s' }}
                >
                  <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4-4 3.4-3.4" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Experiencia Cinemática</h3>
              <p className="text-white/60 text-sm max-w-[200px] mx-auto leading-relaxed">
                Para disfrutar del video y el diseño completo, gira tu dispositivo horizontalmente.
              </p>
            </div>
            <button 
              onClick={() => setShowRotatePrompt(false)}
              className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors border-b border-white/10 pb-1"
            >
              Continuar en vertical
            </button>
          </div>
        </div>
      )}

      {/* Global Body Watermark */}
      <div className="fixed inset-0 z-0 flex items-center justify-center opacity-[0.20] pointer-events-none overflow-hidden">
        <Image
          src="/incomparables-web/images/shield-watermark.png"
          alt=""
          width={1000}
          height={1000}
          className="w-[90%] max-w-[300px] sm:max-w-[800px] h-auto object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            {/* Left Spacer */}
            <div className="hidden sm:flex flex-1" />

            {/* Centered Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <Image
                src="/incomparables-web/images/logo-incomparables.jpeg"
                alt="Los Incomparables de Manuel Vargas"
                width={150}
                height={50}
                className="h-8 sm:h-12 w-auto object-contain"
              />
            </div>

            {/* Right side icons */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:text-primary transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100057375342864"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:text-primary transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:text-primary transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Fixed Social Sidebar (Desktop) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] hidden md:flex flex-col gap-4 p-4 bg-black/40 backdrop-blur-md border-l border-y border-white/10 rounded-l-2xl shadow-2xl">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 text-white/60 hover:text-primary transition-all hover:scale-125 hover:-translate-x-1"
        >
          <InstagramIcon className="w-6 h-6" />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=100057375342864"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 text-white/60 hover:text-primary transition-all hover:scale-125 hover:-translate-x-1"
        >
          <FacebookIcon className="w-6 h-6" />
        </a>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 text-white/60 hover:text-primary transition-all hover:scale-125 hover:-translate-x-1"
        >
          <TikTokIcon className="w-6 h-6" />
        </a>
      </div>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/incomparables-web/videos/logo-animado.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto h-full gap-12 mt-20">
          {/* Hero is now clean and focus on the video/logo background */}
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          {/* Transition Buttons - Vertical Stack */}
          <div className="flex flex-col items-center justify-center gap-8 mb-24">
            <div className="relative group">
              {/* Pulse Animation Effect */}
              <div className="absolute -inset-1 bg-primary rounded-full blur opacity-40 group-hover:opacity-75 animate-pulse transition duration-1000 group-hover:duration-200"></div>
              
              <a
                href="#contacto"
                className="relative w-[280px] sm:w-[320px] text-center inline-flex items-center justify-center gap-3 bg-primary text-black px-10 py-5 rounded-full font-black text-xl hover:bg-primary/90 transition-all hover:scale-110 shadow-2xl shadow-primary/40 uppercase tracking-wider"
              >
                <PhoneIcon className="w-6 h-6 animate-bounce" />
                Contáctanos
              </a>
            </div>

            <a
              href="#servicios"
              className="w-[240px] sm:w-[280px] text-center inline-flex items-center justify-center gap-2 border-2 border-white/10 text-white/60 px-8 py-3 rounded-full font-bold text-base hover:border-white/40 hover:text-white transition-all"
            >
              Nuestros Servicios
            </a>
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold text-center mb-16 tracking-tight">
            Sobre <span className="text-primary">Nosotros</span>
          </h2>

          <div className="mb-20 relative group">
            <div className="absolute -inset-1 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <Image
                src="/incomparables-web/images/grupo-oficial.png"
                alt="Los Incomparables de Manuel Vargas - Foto Oficial"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white tracking-wide">Música Norteña de Excelencia</h3>
              <p className="text-lg sm:text-xl leading-relaxed text-white/70 font-light">
                Con más de <span className="text-primary font-semibold">35 años</span> aportando la mejor música norteña, hemos brindado entretenimiento
                en San Luis Potosí y Estados Unidos. Nos especializamos en hacer de cada evento una
                experiencia única, ya sea en fiestas privadas, eventos corporativos o conciertos masivos.
              </p>
              <div className="mt-10 flex justify-center">
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                  <span className="text-primary font-bold">🇲🇽🇺🇸</span>
                  <span className="text-sm uppercase tracking-widest text-white/40 font-medium">México y USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            Nuestros <span className="text-primary">Servicios</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/20 text-center overflow-hidden">
              <div className="relative h-48 w-full mb-6">
                <Image
                  src="/incomparables-web/images/servicios/fiestas.png"
                  alt="Fiestas Privadas"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Fiestas Privadas</h3>
              <p className="text-muted-foreground text-sm">
                Hacemos de tu celebración un evento memorable con la mejor música norteña.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/20 text-center overflow-hidden">
              <div className="relative h-48 w-full mb-6">
                <Image
                  src="/incomparables-web/images/servicios/conciertos.png"
                  alt="Conciertos Masivos"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Conciertos Masivos</h3>
              <p className="text-muted-foreground text-sm">
                Actuamos en grandes escenarios llevando nuestra música a miles de personas.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/20 text-center overflow-hidden">
              <div className="relative h-48 w-full mb-6">
                <Image
                  src="/incomparables-web/images/servicios/corporativos.png"
                  alt="Eventos Corporativos"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Eventos Corporativos</h3>
              <p className="text-muted-foreground text-sm">
                Ambientamos eventos empresariales con profesionalismo y calidad musical.
              </p>
            </div>

            <div className="group bg-card border border-border rounded-xl p-8 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 text-center overflow-hidden">
              <div className="relative h-48 w-full mb-6">
                <Image
                  src="/incomparables-web/images/servicios/ambientacion.png"
                  alt="Ambientación Musical"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Ambientación Musical</h3>
              <p className="text-muted-foreground text-sm">
                La música perfecta para crear el ambiente ideal en cualquier ocasión.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-bold mb-16 tracking-tight">
            <span className="text-primary">Contáctanos</span>
          </h2>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mt-32" />
            
            <div className="flex flex-col items-center relative z-10">
              <p className="text-xl text-white/70 mb-12 font-light max-w-lg">
                ¿Tienes un evento? ¡Hagamos que sea inolvidable con el mejor repertorio norteño!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                <a
                  href="tel:+526141073188"
                  className="flex items-center justify-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-black transition-all group/btn"
                >
                  <PhoneIcon className="w-6 h-6 text-primary group-hover/btn:text-black" />
                  <span className="text-xl font-bold">614 107 3188</span>
                </a>

                <a
                  href="mailto:pmailprueba@gmail.com"
                  className="flex items-center justify-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-black transition-all group/btn"
                >
                  <MailIcon className="w-6 h-6 text-primary group-hover/btn:text-black" />
                  <span className="text-lg font-bold">Escríbenos</span>
                </a>
              </div>

              <div className="mt-12">
                <a
                  href="https://www.facebook.com/profile.php?id=100057375342864"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  <FacebookIcon className="w-5 h-5" />
                  Ver en Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Section */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-card border border-border rounded-xl p-8">
            <QrCodeIcon className="w-32 h-32 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-bold mb-2">Comparte esta página fácilmente</h3>
            <p className="text-sm text-muted-foreground">
              Escanea para compartir
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-24 px-4 bg-black border-t border-white/5 overflow-hidden">
        {/* Logo Watermark Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.14] pointer-events-none">
          <Image
            src="/incomparables-web/images/logo-incomparables.jpeg"
            alt=""
            fill
            className="object-contain scale-150"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Social Links */}
          <div className="flex items-center gap-8 mb-10">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-primary transition-all hover:scale-125 duration-300"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100057375342864"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/60 hover:text-primary transition-all hover:scale-110"
            >
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-primary transition-all hover:scale-125 duration-300"
            >
              <TikTokIcon className="w-6 h-6" />
            </a>
          </div>

          {/* Navigation and Contact Links (Quick View) */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-10 text-sm font-medium tracking-widest uppercase text-white/60">
            <a href="#inicio" className="hover:text-primary transition-colors">Inicio</a>
            <a href="#nosotros" className="hover:text-primary transition-colors">Nosotros</a>
            <a href="#servicios" className="hover:text-primary transition-colors">Servicios</a>
            <a href="#contacto" className="hover:text-primary transition-colors">Contrataciones</a>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-white/30 tracking-wide">
              © {new Date().getFullYear()} LOS INCOMPARABLES DE MANUEL VARGAS.
            </p>
            <p className="text-[10px] text-white/20 mt-2 uppercase tracking-[0.2em]">
              Diseño de Alta Fidelidad • Música Norteña de Excelencia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
