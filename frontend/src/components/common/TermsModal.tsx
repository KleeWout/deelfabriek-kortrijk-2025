import { useState } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primarygreen-1">
            Gebruiksvoorwaarden
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          <p className="mb-4 text-base text-gray-700">
            Lees hieronder aandachtig de gebruikersvoorwaarden. Je moet deze
            accepteren om verder te gaan met je reservatie.
          </p>
          <iframe
            src="/gebruiksvoorwaarden.pdf"
            className="w-full h-full min-h-[60vh]"
            title="Gebruiksvoorwaarden"
          />
        </div>
      </div>
    </div>
  );
}
