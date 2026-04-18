import React from 'react';
import { Check, Circle } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'pending' | 'current' | 'completed' | 'error';
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  variant?: 'default' | 'simple' | 'minimal';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const variantClasses = {
  default: 'flex items-center gap-4',
  simple: 'flex items-center gap-2',
  minimal: 'flex items-center gap-1',
};

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  variant = 'default',
  orientation = 'horizontal',
  className = '',
}: StepperProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={`stepper ${isVertical ? 'flex flex-col gap-8' : variantClasses[variant]} ${className}`}
      role="navigation"
      aria-label="Progress stepper"
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;
        const status = step.status || (isCompleted ? 'completed' : isCurrent ? 'current' : 'pending');

        return (
          <div
            key={step.id}
            className={`flex ${isVertical ? 'flex-row gap-4' : 'flex-col items-center'} flex-1`}
          >
            <div className="flex items-center">
              {/* Step Indicator */}
              <div
                onClick={() => onStepClick && index <= currentStep && onStepClick(index)}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full transition-colors
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-blue-600 text-white' : ''}
                  ${isPending ? 'bg-gray-200 text-gray-500' : ''}
                  ${status === 'error' ? 'bg-red-500 text-white' : ''}
                  ${onStepClick && index <= currentStep ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Connector Line */}
              {!isVertical && index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 transition-colors ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Step Content */}
            <div
              className={isVertical ? 'flex-1' : 'mt-2 text-center'}
              onClick={() => onStepClick && index <= currentStep && onStepClick(index)}
            >
              <h3
                className={`font-medium ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                } ${onStepClick && index <= currentStep ? 'cursor-pointer' : ''}`}
              >
                {step.label}
              </h3>
              {step.description && (
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface StepProps {
  isActive?: boolean;
  isCompleted?: boolean;
  isError?: boolean;
  index: number;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Step({
  isActive = false,
  isCompleted = false,
  isError = false,
  index,
  children,
  onClick,
  className = '',
}: StepProps) {
  return (
    <div className={`step ${className}`}>
      <div
        onClick={onClick}
        className={`
          relative flex items-center justify-center w-10 h-10 rounded-full transition-colors
          ${isCompleted ? 'bg-green-500 text-white' : ''}
          ${isActive ? 'bg-blue-600 text-white' : ''}
          ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
          ${isError ? 'bg-red-500 text-white' : ''}
          ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
        `}
        aria-current={isActive ? 'step' : undefined}
      >
        {isCompleted ? (
          <Check className="w-5 h-5" />
        ) : (
          <span className="font-semibold">{index + 1}</span>
        )}
      </div>
      <div className="mt-2 text-center">{children}</div>
    </div>
  );
}

export interface StepLabelProps {
  children: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  className?: string;
}

export function StepLabel({ children, isActive = false, isCompleted = false, className = '' }: StepLabelProps) {
  return (
    <h3
      className={`font-medium ${
        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
      } ${className}`}
    >
      {children}
    </h3>
  );
}

export interface StepDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function StepDescription({ children, className = '' }: StepDescriptionProps) {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>
      {children}
    </p>
  );
}
