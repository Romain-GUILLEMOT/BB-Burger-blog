import React from 'react';
import classNames from 'classnames';
import Loading from "./Loading";

type ButtonType = 'neutral' | 'info' | 'error' | 'success' | 'warning' | 'info2' | 'secondary';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';
type ButtonShadow = 'none' | 'sm' | 'md' | 'lg';
type TypeOfButton = 'button' | 'submit' ;

interface ButtonProps {
    type?: ButtonType;
    buttonType?: TypeOfButton;
    size?: ButtonSize;
    rounded?: ButtonRounded;
    shadow?: ButtonShadow;
    bold?: boolean;
    blue?: boolean; // New prop to adjust styling for blue background
    className?: string;
    children: React.ReactNode;
    title?: string;
    disabled?: boolean;
    onClick?: () => void;
    isLoading?: boolean;
}

export default function
({
                                          type = 'neutral',
                                          buttonType = 'button',
                                          size = 'md',
                                          rounded = 'md',
                                          shadow = 'md',
                                          bold = false,
                                          blue = false,
                                          className = '',
                                          title,
                                          children,
                                          disabled = false,
                                          onClick,
                                          isLoading = false,
                                          ... rest
                                      }: ButtonProps) {
    const typeClasses = {
        neutral: disabled
            ? 'text-gray-800 bg-white opacity-60'
            : blue
                ? 'text-gray-800 bg-white hover:bg-gray-100 duration-200 transform hover:translate-y-[-2px]'
                : 'bg-transparent text-gray-700 hover:opacity-80 duration-200 transform hover:translate-y-[-2px]',
        info: disabled
            ? 'text-white bg-ozlaloc-800 opacity-60'
            : blue
                ? 'text-white bg-ozlaloc-800 hover:opacity-75 duration-200 transform hover:translate-y-[-2px]'
                : 'bg-ozlaloc-600 text-white hover:bg-ozlaloc-800 duration-200 transform hover:translate-y-[-2px]',
        info2: disabled
            ? 'text-blue-800 bg-white opacity-60'
            : blue
                ? 'text-blue-800 bg-white hover:opacity-75 duration-200 transform hover:translate-y-[-2px]'
                : 'bg-ozlaloc-800 text-white hover:opacity-75 duration-200 transform hover:translate-y-[-2px]',
        error: disabled
            ? 'text-red-800 bg-white opacity-60'
            : blue
                ? 'text-red-800 bg-white hover:bg-red-100 duration-200 transform hover:translate-y-[-2px]'
                : 'bg-red-600 text-white hover:bg-red-500 duration-200 transform hover:translate-y-[-2px]',
        success: disabled
            ? 'text-green-800 bg-white opacity-60'
            : blue
                ? 'text-green-800 bg-white hover:bg-green-100 duration-200 transform hover:translate-y-[-2px]'
                : 'bg-green-600 text-white hover:bg-green-500 duration-200 transform hover:translate-y-[-2px]',
        warning: disabled
            ? 'text-yellow-800 bg-white opacity-60'
            : blue
                ? 'text-yellow-800 bg-white hover:bg-yellow-100 duration-200 transform hover:translate-y-[-2px]'
                : 'bg-yellow-600 text-white hover:bg-yellow-500 duration-200 transform hover:translate-y-[-2px]',
        secondary: disabled
            ? 'border-2 border-ozlaloc-800 text-black opacity-60 flex items-center justify-center gap-2 group'
            : blue
                ? 'border-2 border-ozlaloc-800 text-black transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md flex items-center justify-center gap-2 group'
                : 'border-2 border-ozlaloc-800 text-ozlaloc-600 hover:bg-ozlaloc-800 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md flex items-center justify-center gap-2 group',
    };

    const sizeClasses = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-2.5 text-lg',
        xl: 'px-6 py-3 text-xl',
    };

    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
    };

    const boldClass = bold ? 'font-bold' : 'font-normal';

    const buttonClasses = classNames(
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        typeClasses[type],
        sizeClasses[size],
        roundedClasses[rounded],
        shadowClasses[shadow],
        boldClass,
        className
    );

    return (
        <button   {...rest} type={buttonType} disabled={disabled} className={buttonClasses} onClick={onClick} title={title}>
            {isLoading ? <Loading /> : children}
        </button>
    );
}