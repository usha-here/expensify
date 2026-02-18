import React from 'react';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
                        block w-full 
                        ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 
                        bg-gray-50 dark:bg-gray-900/50 
                        border border-gray-200 dark:border-gray-700 
                        rounded-xl 
                        text-gray-900 dark:text-white placeholder-gray-400
                        focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 
                        transition-all duration-200
                        ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
