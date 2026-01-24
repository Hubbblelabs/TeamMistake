'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Show banner after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setIsHiding(true);
        setTimeout(() => {
            localStorage.setItem('cookie_consent', 'accepted');
            setIsVisible(false);
            setIsHiding(false);
        }, 700);
    };

    const handleDecline = () => {
        setIsHiding(true);
        setTimeout(() => {
            localStorage.setItem('cookie_consent', 'declined');
            setIsVisible(false);
            setIsHiding(false);
        }, 700);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`cookie-banner ${isHiding ? 'hiding' : ''}`}
        >
            <motion.div
                className="cookie-banner__text"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: isHiding ? 'inset(0 100% 0 0)' : 'inset(0 0% 0 0)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                We use cookies to enhance your experience and analyze site traffic.
            </motion.div>
            <div className="cookie-banner__buttons">
                <motion.button
                    className="cookie-banner__btn cookie-banner__btn--accept"
                    onClick={handleAccept}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    accept
                </motion.button>
                <motion.button
                    className="cookie-banner__btn cookie-banner__btn--decline"
                    onClick={handleDecline}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    decline
                </motion.button>
            </div>
        </div>
    );
}
