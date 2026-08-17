import React, { useRef, useState, useEffect } from "react";
import "./navigation.css";
import logo from "../../assets/logo.png";

export default function Navi() {
    const containerRef = useRef(null);
    const [isAero, setIsAero] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Initial 12 ta interaktiv pufakchalar
    const initialBubbles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 90 + 5,
        size: Math.random() * 50 + 30,
        duration: Math.random() * 5 + 6,
        delay: Math.random() * 4,
        popped: false
    }));

    const [bubbles, setBubbles] = useState(initialBubbles);

    // Aero rejim yoqilganda pufakchalarni tiklash
    useEffect(() => {
        if (isAero) {
            setBubbles(initialBubbles);
        }
    }, [isAero]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
        containerRef.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };

    const handleMouseLeave = () => {
        if (!containerRef.current) return;
        containerRef.current.style.setProperty("--x", `-1000px`);
        containerRef.current.style.setProperty("--y", `-1000px`);
    };

    // 100% Realistik Pufakcha Yorilishi Ovozi (Web Audio API Synthesizer)
    const playPopSound = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();

            // 1. Tonal "POP" tebranishi (Pufakcha tarangligi)
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

            oscGain.gain.setValueAtTime(0.5, ctx.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(oscGain);
            oscGain.connect(ctx.destination);

            // 2. Oq Shovqin / "PUF" effekti (Havo bosimi va parda yorilishi)
            const bufferSize = ctx.sampleRate * 0.02; // 20ms
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = "highpass";
            filter.frequency.value = 1000;

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.04);

            noise.start(ctx.currentTime);
            noise.stop(ctx.currentTime + 0.02);
        } catch (e) {
            console.log("Audio play error", e);
        }
    };

    // Rejim o'tish ovozlari
    const playSound = (toAero) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            if (toAero) {
                osc.type = "sine";
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
                osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            } else {
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            }

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) {
            console.log("Audio error", e);
        }
    };

    // Pufakchani bosganda yorish logikasi
    const popBubble = (id) => {
        playPopSound();
        setBubbles((prev) =>
            prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
        );

        // 2 soniyadan keyin poqillagan pufakcha o'rniga yangisini hosil qilish
        setTimeout(() => {
            setBubbles((prev) =>
                prev.map((b) =>
                    b.id === id
                        ? {
                              ...b,
                              popped: false,
                              left: Math.random() * 90 + 5,
                              size: Math.random() * 50 + 30,
                              duration: Math.random() * 5 + 6,
                              delay: 0,
                          }
                        : b
                )
            );
        }, 2000);
    };

    const handleLogoClick = () => {
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 700);

        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 800);

        const nextState = !isAero;
        setIsAero(nextState);
        playSound(nextState);
    };

    return (
        <div
            ref={containerRef}
            className={`navcontainer ${isAero ? "frutiger-aero" : ""} ${isTransitioning ? "in-transition" : ""}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="transition-wave"></div>

            {!isAero && <div className="grid-glow"></div>}

            {/* REALISTIK INTERAKTIV PUFAKCHALAR */}
            {isAero && (
                <div className="aero-bubbles">
                    {bubbles.map((b) => (
                        <div
                            key={b.id}
                            className={`bubble ${b.popped ? "popped" : ""}`}
                            onClick={() => !b.popped && popBubble(b.id)}
                            style={{
                                left: `${b.left}%`,
                                width: `${b.size}px`,
                                height: `${b.size}px`,
                                animationDuration: `${b.duration}s`,
                                animationDelay: `${b.delay}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="navrealholder">
                <div className="navholder">
                    <div 
                        className={`logo-wrapper ${isSpinning ? "spin-active" : ""}`} 
                        onClick={handleLogoClick}
                        title="Toggle Aesthetics!"
                    >
                        <img width="38" src={logo} alt="Logo" />
                    </div>

                    <nav className="nav">
                        <a href="#">Services</a>
                        <a href="#">Experiences</a>
                        <a href="#">Works</a>
                    </nav>

                    <button
                        title="View me on Github"
                        onClick={() => (window.location.href = "https://github.com/Spurzyy")}
                        className="github-button"
                    >
                        Github
                    </button>
                </div>
            </div>
        </div>
    );
}