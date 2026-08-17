import React, { useRef, useState, useEffect } from "react";
import "./navigation.css";
import logo from "../../assets/logo.png";
import msnSound from "../../assets/frutiger.mp3"; 


export default function Navi() {
    const containerRef = useRef(null);
    const [isAero, setIsAero] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const initialBubbles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 90 + 5,
        size: Math.random() * 40 + 20,
        duration: Math.random() * 5 + 6,
        delay: Math.random() * 4,
        popped: false
    }));

    const [bubbles, setBubbles] = useState(initialBubbles);

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

    const playPopSound = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

            oscGain.gain.setValueAtTime(0.5, ctx.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(oscGain);
            oscGain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {
            console.log("Audio play error", e);
        }
    };

    const playMSNSound = () => {
        try {
            const audio = new Audio(msnSound);
            audio.currentTime = 0; audio.play();
        } catch (e) {
            console.log("MP3 play error", e);
        }
    };

    const popBubble = (id) => {
        playPopSound();
        setBubbles((prev) =>
            prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
        );

        setTimeout(() => {
            setBubbles((prev) =>
                prev.map((b) =>
                    b.id === id
                        ? {
                            ...b,
                            popped: false,
                            left: Math.random() * 90 + 5,
                            size: Math.random() * 40 + 20,
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

        playMSNSound();
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
                        <img src={logo} alt="Logo" className="logo-img" />
                    </div>

                    <nav className={`nav ${menuOpen ? "open" : ""}`}>
                        <a href="#" onClick={() => setMenuOpen(false)}>Services</a>
                        <a href="#" onClick={() => setMenuOpen(false)}>Experiences</a>
                        <a href="#" onClick={() => setMenuOpen(false)}>Works</a>
                        <button
                            onClick={() => (window.location.href = "https://github.com/Spurzyy")}
                            className="github-button mobile-only-btn"
                        >
                            Github
                        </button>
                    </nav>

                    <button
                        title="View me on Github"
                        onClick={() => (window.location.href = "https://github.com/Spurzyy")}
                        className="github-button desktop-btn"
                    >
                        Github
                    </button>

                    <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}