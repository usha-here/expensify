import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
    return (
        <div className={`
            bg-white dark:bg-[#1e1b4b]/40 
            backdrop-blur-xl 
            border border-gray-100 dark:border-white/5 
            rounded-2xl 
            shadow-xl shadow-gray-200/50 dark:shadow-black/20
            ${hover ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10' : ''}
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;
