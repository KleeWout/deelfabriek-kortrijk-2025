import React from 'react';
import {
  MagnifyingGlass,
  User,
  CreditCard,
  ClipboardText,
} from 'phosphor-react';

interface StepperProps {
  activeStep: number;
}

const Stepper: React.FC<StepperProps> = ({ activeStep }) => {
  const steps = [
    { number: 1, label: 'Zoek en selecteer', icon: MagnifyingGlass },
    { number: 2, label: 'Productdetail', icon: User },
    { number: 3, label: 'Gegevens', icon: ClipboardText },
    { number: 4, label: 'Betalen', icon: CreditCard },
  ];

  return (
    <div className="flex items-center gap-10">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = activeStep === step.number;
        return (
          <React.Fragment key={step.number}>
            <div
              className={`flex items-center gap-3 ${isActive ? '' : 'opacity-60'}`}
            >
              <div
                className={`w-12 h-12 rounded-full ${isActive ? 'bg-[var(--color-primarygreen-1)]' : 'bg-gray-200'} flex items-center justify-center`}
              >
                <Icon
                  size={28}
                  weight="regular"
                  className={
                    isActive
                      ? 'text-white'
                      : 'text-[var(--color-primarygreen-1)]'
                  }
                />
              </div>
              <div>
                <div
                  className={`font-bold ${isActive ? 'text-[var(--color-primarygreen-1)]' : 'text-[var(--color-primarygreen-1)]'} text-lg`}
                >
                  Stap {step.number}
                </div>
                <div className="text-xs text-gray-700 font-semibold">
                  {step.label}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-0.5 bg-gray-300 mx-2" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
