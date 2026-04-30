"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InstagramIcon, FacebookIcon, TikTokIcon, PhoneIcon, MailIcon, QrCodeIcon } from "@/components/icons";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Global Body Watermark */}
      <div className="fixed inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
        <Image
          src="/incomparables-web/images/shield-watermark.png"
          alt=""
          width={1000}
          height={1000}
          className="w-full max-w-[800px] h-auto object-contain"
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
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
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
                href="https://www.facebook.com"
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

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/incomparables-web/videos/logo-animado.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col items-center justify-end px-4 max-w-5xl mx-auto pb-8 sm:pb-16 gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
            >
              Nuestros Servicios
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary transition-all"
            >
              Contáctanos
            </a>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-primary transition-colors"
            >
              <InstagramIcon className="w-6 h-6 text-white hover:text-primary" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-primary transition-colors"
            >
              <FacebookIcon className="w-6 h-6 text-white hover:text-primary" />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-primary transition-colors"
            >
              <TikTokIcon className="w-6 h-6 text-white hover:text-primary" />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">
            Sobre <span className="text-primary">Nosotros</span>
          </h2>

          <div className="bg-card border border-border rounded-xl p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">🎵</span>
              <h3 className="text-2xl font-bold">Grupo Norteño Incomparables</h3>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Con más de 35 años aportando la mejor música norteña, hemos brindado entretenimiento
              en San Luis Potosí y Estados Unidos. Nos especializamos en hacer de cada evento una
              experiencia única, ya sea en fiestas privadas, eventos corporativos o conciertos masivos.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <div className="bg-secondary/50 px-6 py-3 rounded-full">
                <span className="text-primary font-bold">35+</span> Años de Trayectoria
              </div>
              <div className="bg-secondary/50 px-6 py-3 rounded-full">
                <span className="text-primary font-bold">🇲🇽🇺🇸</span> México y USA
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-card border border-border rounded-xl p-8 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 text-center overflow-hidden">
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

            <div className="group bg-card border border-border rounded-xl p-8 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 text-center overflow-hidden">
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

            <div className="group bg-card border border-border rounded-xl p-8 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 text-center overflow-hidden">
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-12">
            <span className="text-primary">Contáctanos</span>
          </h2>

          <div className="bg-card border border-border rounded-xl p-8 sm:p-12">
            <p className="text-lg text-muted-foreground mb-8">
              ¿Tienes un evento? ¡Contáctanos y hagamos que sea inolvidable!
            </p>

            <div className="space-y-6">
              <a
                href="tel:+526141073188"
                className="flex items-center justify-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-primary/20 transition-colors group"
              >
                <PhoneIcon className="w-6 h-6 text-primary" />
                <span className="text-xl font-semibold group-hover:text-primary transition-colors">
                  614 107 3188
                </span>
              </a>

              <a
                href="mailto:pmailprueba@gmail.com"
                className="flex items-center justify-center gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-primary/20 transition-colors group"
              >
                <MailIcon className="w-6 h-6 text-primary" />
                <span className="text-xl font-semibold group-hover:text-primary transition-colors">
                  pmailprueba@gmail.com
                </span>
              </a>

              <a
                href="https://www.facebook.com/search?q=incomparables+de+manuel+vargas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
              >
                <FacebookIcon className="w-5 h-5" />
                Buscar en Facebook
              </a>
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
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-primary transition-all hover:scale-125 duration-300"
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
