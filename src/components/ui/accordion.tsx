import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: 'default' | 'bordered' | 'ghost';
  className?: string;
  onOpenChange?: (itemId: string) => void;
}

const variantClasses = {
  default: 'border border-gray-200 rounded-lg overflow-hidden',
  bordered: 'border-b border-gray-200',
  ghost: 'border-0',
};

export function Accordion({
  items,
  allowMultiple = false,
  variant = 'default',
  className = '',
  onOpenChange,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(items.filter(item => item.defaultOpen).map(item => item.id))
  );

  const toggleItem = (itemId: string) => {
    if (!allowMultiple) {
      setOpenItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.clear();
        } else {
          newSet.clear();
          newSet.add(itemId);
        }
        return newSet;
      });
    } else {
      setOpenItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    }
    onOpenChange?.(itemId);
  };

  return (
    <div className={`accordion ${variantClasses[variant]} ${className}`}>
      {items.map((item, index) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={openItems.has(item.id)}
          onToggle={() => !item.disabled && toggleItem(item.id)}
          variant={variant}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}

interface AccordionItemComponentProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  variant: 'default' | 'bordered' | 'ghost';
  isLast: boolean;
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
  variant,
  isLast,
}: AccordionItemComponentProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className={`accordion-item ${variant === 'bordered' && !isLast ? 'border-b' : ''}`}>
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        disabled={item.disabled}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-controls={`panel-${item.id}`}
        id={`header-${item.id}`}
      >
        <div className="flex items-center gap-3">
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          <span className="font-medium text-gray-900">{item.title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={`panel-${item.id}`}
        role="region"
        aria-labelledby={`header-${item.id}`}
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 text-gray-700">
          {item.content}
        </div>
      </div>
    </div>
  );
}

export interface AccordionItemProps {
  value: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function AccordionItemComponent2({ value, trigger, children, disabled = false, className = '' }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion-item border-b border-gray-200 ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
      >
        {trigger}
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 py-3 text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className = '' }: AccordionTriggerProps) {
  return (
    <button className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}>
      {children}
      <ChevronRight className="w-5 h-5 text-gray-500" />
    </button>
  );
}

export interface AccordionContentProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export function AccordionContent({ children, isOpen, className = '' }: AccordionContentProps) {
  return (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} ${className}`}>
      <div className="px-4 py-3 text-gray-700">
        {children}
      </div>
    </div>
  );
}
