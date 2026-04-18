import React, { useState, useRef, useEffect } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onChange?: (tabId: string) => void;
}

const variantClasses = {
  default: 'border-b border-gray-200',
  pills: 'bg-gray-100 p-1 rounded-lg',
  underline: 'border-b-2 border-transparent',
};

const tabClasses = {
  default: {
    base: 'px-4 py-3 border-b-2 border-transparent transition-colors',
    active: 'border-blue-600 text-blue-600',
    inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
  },
  pills: {
    base: 'px-4 py-2 rounded-md transition-colors',
    active: 'bg-white text-blue-600 shadow-sm',
    inactive: 'text-gray-600 hover:text-gray-900',
  },
  underline: {
    base: 'px-4 py-3 border-b-2 transition-colors',
    active: 'border-blue-600 text-blue-600',
    inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
  },
};

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Tabs({
  tabs,
  defaultTab,
  variant = 'default',
  size = 'md',
  className = '',
  onChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const enabledIndex = enabledTabs.findIndex(tab => tab.id === tabs[index].id);

    let newIndex: number;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (enabledIndex + 1) % enabledTabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (enabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = enabledTabs.length - 1;
    } else {
      return;
    }

    const newTabId = enabledTabs[newIndex].id;
    setActiveTab(newTabId);
    onChange?.(newTabId);
    tabRefs.current[tabs.findIndex(tab => tab.id === newTabId)]?.focus();
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`tabs ${className}`}>
      <div className={variantClasses[variant]} role="tablist" aria-orientation="horizontal">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              ref={(el: HTMLButtonElement | null) => { tabRefs.current[index] = el; }}
              onClick={() => !isDisabled && handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isDisabled}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`
                ${tabClasses[variant].base}
                ${sizeClasses[size]}
                ${isActive ? tabClasses[variant].active : tabClasses[variant].inactive}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                flex items-center gap-2 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {activeTabData && (
          <div
            id={`panel-${activeTabData.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTabData.id}`}
            tabIndex={0}
          >
            {activeTabData.content}
          </div>
        )}
      </div>
    </div>
  );
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`flex border-b border-gray-200 ${className}`} role="tablist" aria-orientation="horizontal">
      {children}
    </div>
  );
}

export interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabTrigger({ value, children, disabled = false, className = '' }: TabTriggerProps) {
  return (
    <button
      role="tab"
      aria-selected={false}
      disabled={disabled}
      className={`
        px-4 py-3 border-b-2 border-transparent transition-colors
        text-gray-500 hover:text-gray-700 hover:border-gray-300
        disabled:opacity-50 disabled:cursor-not-allowed
        outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabContent({ value, children, className = '' }: TabContentProps) {
  return (
    <div
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      className={`mt-4 ${className}`}
    >
      {children}
    </div>
  );
}
