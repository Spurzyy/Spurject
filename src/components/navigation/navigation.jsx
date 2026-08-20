import React, { useRef, useState } from "react";
import "./navigation.css";
import logo from "../../assets/logo.png";

export default function Navi() {
    const containerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

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

    return (
        <div
            ref={containerRef}
            className="navcontainer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="grid-glow"></div>

            <div className="navrealholder">
                <div className="navholder">
                    <div className="logo-wrapper">
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

                    <div 
                        className={`hamburger ${menuOpen ? "active" : ""}`} 
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}