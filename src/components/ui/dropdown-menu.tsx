import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: string;
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = 'left',
  width = '200px',
  className = '',
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      let newIndex = focusedIndex + direction;

      if (newIndex < 0) newIndex = items.length - 1;
      if (newIndex >= items.length) newIndex = 0;

      while (items[newIndex].disabled) {
        newIndex = newIndex + direction;
        if (newIndex < 0) newIndex = items.length - 1;
        if (newIndex >= items.length) newIndex = 0;
      }

      setFocusedIndex(newIndex);
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && items[focusedIndex]) {
        items[focusedIndex].onClick?.();
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
      triggerRef.current?.focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`dropdown-menu ${className}`}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            setFocusedIndex(0);
          }
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-[1060] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'}`}
          style={{ width }}
          role="menu"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {items.map((item, index) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setIsOpen(false);
                    setFocusedIndex(-1);
                  }
                }}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                } ${focusedIndex === index ? 'bg-gray-100' : ''}`}
                role="menuitem"
                tabIndex={focusedIndex === index ? 0 : -1}
              >
                {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.id === 'selected' && <Check className="w-4 h-4 text-blue-600" />}
              </button>
              {item.divider && <div className="h-px bg-gray-200 my-1" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface DropdownContextProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function DropdownContext({ isOpen, onClose, children }: DropdownContextProps) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

export interface DropdownTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownTrigger({ children, onClick, className = '' }: DropdownTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export interface DropdownContentProps {
  isOpen: boolean;
  align?: 'left' | 'right';
  width?: string;
  children: React.ReactNode;
  className?: string;
}

export function DropdownContent({
  isOpen,
  align = 'left',
  width = '200px',
  children,
  className = '',
}: DropdownContentProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute z-[1060] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'} ${className}`}
      style={{ width }}
      role="menu"
    >
      {children}
    </div>
  );
}
