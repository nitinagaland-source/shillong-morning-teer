import React from 'react';

interface FooterProps {
  onNavigateHome?: () => void;
  onOpenModal?: (type: 'about' | 'terms' | 'privacy' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onOpenModal,
}) => {
  return (
    <footer className="w-full bg-[#def2fa] py-8 sm:py-10 px-4 mt-12 border-t border-sky-100">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Navigation Links Grid matching screenshot with clean normal font */}
        <div className="grid grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-3.5 text-center w-full max-w-sm sm:max-w-md mb-4">
          <button
            onClick={onNavigateHome}
            className="text-slate-800 hover:text-blue-600 font-normal text-sm sm:text-[15px] transition-colors cursor-pointer text-center"
          >
            Home
          </button>

          <button
            onClick={() => onOpenModal?.('terms')}
            className="text-slate-800 hover:text-blue-600 font-normal text-sm sm:text-[15px] transition-colors cursor-pointer text-center"
          >
            Terms &amp; Conditions
          </button>

          <button
            onClick={() => onOpenModal?.('about')}
            className="text-slate-800 hover:text-blue-600 font-normal text-sm sm:text-[15px] transition-colors cursor-pointer text-center"
          >
            About Us
          </button>

          <button
            onClick={() => onOpenModal?.('privacy')}
            className="text-slate-800 hover:text-blue-600 font-normal text-sm sm:text-[15px] transition-colors cursor-pointer text-center"
          >
            Privacy Policy
          </button>
        </div>

        {/* Contact Us Centered */}
        <div className="mb-6">
          <button
            onClick={() => onOpenModal?.('contact')}
            className="text-slate-800 hover:text-blue-600 font-normal text-sm sm:text-[15px] transition-colors cursor-pointer text-center"
          >
            Contact Us
          </button>
        </div>

        {/* Copyright notice */}
        <p className="text-xs text-slate-600 text-center font-normal">
          Copyright &copy; All rights reserved 2019&ndash;2026 Morning Sunday Teer.
        </p>
      </div>
    </footer>
  );
};
