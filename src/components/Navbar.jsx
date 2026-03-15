import { Menu, X } from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
 
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    
    const navItems = useMemo(() => [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Services", label: "Services" },
        { href: "#Portofolio", label: "Portofolio" },
        { href: "/showcase", label: "Showcase" },
        { href: "#Contact", label: "Contact" },
    ], []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                if (!item.href.startsWith('#')) return null;
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section => 
                currentPosition >= section.offset && 
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navItems]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();

        // Non-hash route: navigate normally
        if (!href.startsWith('#')) {
            navigate(href);
            setIsOpen(false);
            return;
        }

        // If already on home, scroll immediately
        if (location.pathname === '/' || location.pathname === '') {
            const section = document.querySelector(href);
            if (section) {
                const top = section.offsetTop - 100;
                window.scrollTo({ top, behavior: 'smooth' });
            } else {
                // fallback: set hash so browser/SPA may handle it
                window.location.hash = href;
            }
            setIsOpen(false);
            return;
        }

        // Not on home: navigate to home with hash, then retry scrolling until the section exists
        setIsOpen(false);
        // navigate to "/#Services" (or respective hash)
        navigate('/' + href);

        const tryScroll = (retries = 0) => {
            const section = document.querySelector(href);
            if (section) {
                const top = section.offsetTop - 100;
                window.scrollTo({ top, behavior: 'smooth' });
                return;
            }
            if (retries < 12) {
                setTimeout(() => tryScroll(retries + 1), 120);
            }
        };

        // start retries after slight delay to allow route/component to mount
        setTimeout(() => tryScroll(0), 200);
    };
 
    return (
        <nav
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
            isOpen
                ? "bg-[#030014] opacity-100"
                : scrolled
                ? "bg-[#030014]/50 backdrop-blur-xl"
                : "bg-transparent"
        }`}
    >
        <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
            <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <a
                        href="#Home"
                        onClick={(e) => scrollToSection(e, "#Home")}
                        className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent"
                    >
                        Xpensive Media
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <div className="ml-8 flex items-center space-x-8">
                        {navItems.map((item) => {
                            const isHash = item.href.startsWith('#');
                            const isActive = isHash ? (location.pathname === '/' && activeSection === item.href.substring(1)) : location.pathname === item.href;
                            if (isHash) {
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        className="group relative px-1 py-2 text-sm font-medium"
                                    >
                                        <span
                                            className={`relative z-10 transition-colors duration-300 ${
                                                isActive
                                                    ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                                    : "text-[#e2d3fd] group-hover:text-white"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-transform duration-300 ${
                                                isActive
                                                    ? "scale-x-100"
                                                    : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        ></span>
                                    </a>
                                );
                            }
                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="group relative px-1 py-2 text-sm font-medium"
                                >
                                    <span
                                        className={`relative z-10 transition-colors duration-300 ${
                                            isActive
                                                ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                                : "text-[#e2d3fd] group-hover:text-white"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-transform duration-300 ${
                                            isActive
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    ></span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Menu Button - move to right */}
                <div className="md:hidden ml-auto flex items-center justify-end">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative p-2 text-[#e2d3fd] hover:text-white transition-transform duration-300 ease-in-out transform ${
                            isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                        }`}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    
        {/* Mobile Menu Overlay */}
        <div
            className={`md:hidden fixed right-0 top-16 transition-all duration-300 ease-in-out z-50 ${
                isOpen
                    ? "opacity-100 translate-y-0 h-[75vh] bg-[#030014]/90"
                    : "opacity-0 -translate-y-[-100%] h-0 pointer-events-none bg-transparent"
            }`}
            style={{
                width: '10vw', // Only cover right side
                minWidth: '220px',
                maxWidth: '400px',
                borderBottomLeftRadius: '1.5rem',
                borderBottomRightRadius: '1.5rem',
                boxShadow: isOpen ? '0 8px 32px rgba(99,102,241,0.15)' : 'none',
                backgroundColor: isOpen ? 'rgba(3,0,20,0.90)' : 'transparent',
            }}
        >
            <div className="flex flex-col h-full justify-start items-end">
                <div className="w-full px-6 pt-2 pb-8 space-y-6">
                    <div className="flex flex-col items-end space-y-6 pr-0 mt-0">
                        {navItems.map((item, index) => {
                            const isHash = item.href.startsWith('#');
                            let isActive = false;
                            if (isHash) {
                                isActive = (location.pathname === '/' && activeSection === item.href.substring(1));
                                if (item.label === 'Contact' && location.pathname === '/' && activeSection === 'Contact') {
                                    isActive = true;
                                }
                            } else {
                                isActive = location.pathname === item.href;
                            }

                            const commonClass = `block px-4 py-4 text-xl font-semibold transition-all duration-300 rounded-lg text-right ${isActive ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent" : "text-[#e2d3fd] hover:text-white"}`;

                            if (isHash) {
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        className={commonClass}
                                        style={{
                                            transitionDelay: `${index * 80}ms`,
                                            transform: isOpen ? "translateY(0)" : "translateY(40px)",
                                            opacity: isOpen ? 1 : 0,
                                        }}
                                    >
                                        <span>{item.label}</span>
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={commonClass}
                                    style={{
                                        transitionDelay: `${index * 80}ms`,
                                        transform: isOpen ? "translateY(0)" : "translateY(40px)",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </nav>
    
    );
};

export default Navbar;