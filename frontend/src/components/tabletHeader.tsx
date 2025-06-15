"use client";
import React from "react";
import { MagnifyingGlass, Package, ClipboardText, CreditCard } from "phosphor-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Props interface
interface StepperProps {
  activeStep: number;
}

// Stepper component definition - now only renders the steps
export function Stepper({ activeStep }: StepperProps) {
  const steps = [
    { number: 1, label: "Zoek en selecteer", icon: MagnifyingGlass },
    { number: 2, label: "Productdetail", icon: Package },
    { number: 3, label: "Gegevens", icon: ClipboardText },
    { number: 4, label: "Betalen", icon: CreditCard },
  ];

  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = activeStep === step.number;
        const isLastStep = index === steps.length - 1;

        return (
          <React.Fragment key={step.number}>
            <div className={`flex items-center gap-2 transition-opacity ${isActive ? "opacity-100" : "opacity-60"}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-[var(--color-primarygreen-1)]" : "bg-gray-200"}`}>
                <Icon size={28} weight="regular" className={isActive ? "text-white" : "text-[var(--color-primarygreen-1)]"} />
              </div>
              <div>
                <div className="font-bold text-[var(--color-primarygreen-1)] text-lg">Stap {step.number}</div>
                <div className="text-xs text-gray-700 font-semibold">{step.label}</div>
              </div>
            </div>
            {/* Circle separator with reduced space */}
            {!isLastStep && (
              <div className="flex items-center justify-center mx-0.5">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// TabletHeader component that uses the stepper - now includes the layout structure
export function TabletHeader() {
  const pathname = usePathname();

  const getActiveStep = () => {
    if (pathname === "/kiosk/items") return 1;
    else if (pathname.includes("/kiosk/items/")) return 2;
    else if (pathname.includes("/kiosk/reserveer/")) return 3;
    else if (pathname.includes("/payment")) return 4;
    return 1;
  };

  return (
    <div className="w-full flex items-center justify-between bg-white px-12 py-6 shadow-sm">
      {/* Logo */}
      <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Deelfabriek Logo" width={240} height={90} />

      {/* Stepper component */}
      <Stepper activeStep={getActiveStep()} />
    </div>
  );
}

// Default export
export default TabletHeader;
