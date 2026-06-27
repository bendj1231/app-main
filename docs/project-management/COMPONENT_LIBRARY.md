# PilotRecognition Component Library Documentation

## Overview
This document provides comprehensive documentation for all UI components in the PilotRecognition component library.

## Installation
Import components from `/src/components/ui/` directory.

```typescript
import { DataTable } from '@/src/components/ui/data-table';
import { Dialog } from '@/src/components/ui/dialog';
```

## Design Tokens
Design tokens are defined in `/src/styles/design-tokens.css` and include:
- Color palette
- Typography scale
- Spacing scale
- Border radius scale
- Shadow scale
- Animation durations
- Responsive breakpoints

## Components

### DataTable
**Location**: `/src/components/ui/data-table.tsx`

A data table component with sorting, filtering, and pagination capabilities.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | T[] | - | Array of data objects |
| columns | Column<T>[] | - | Column configuration |
| pageSize | number | 10 | Number of rows per page |
| searchable | boolean | true | Enable search functionality |
| filterable | boolean | true | Enable column filtering |
| onRowClick | (row: T) => void | - | Callback when row is clicked |
| emptyMessage | string | "No data available" | Message when no data |
| className | string | "" | Additional CSS classes |

#### Usage Example
```typescript
import { DataTable, Column } from '@/src/components/ui/data-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: Column<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', filterable: true },
];

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

<DataTable data={users} columns={columns} />
```

#### Accessibility
- Keyboard navigation supported
- ARIA labels for sorting indicators
- Focus management
- Screen reader compatible

---

### Dialog
**Location**: `/src/components/ui/dialog.tsx`

A modal dialog component with animations, focus management, and accessibility features.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | - | Whether dialog is open |
| onClose | () => void | - | Callback to close dialog |
| title | string | - | Dialog title |
| description | string | - | Dialog description |
| children | ReactNode | - | Dialog content |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | 'md' | Dialog size |
| showCloseButton | boolean | true | Show close button |
| closeOnBackdropClick | boolean | true | Close on backdrop click |
| closeOnEscape | boolean | true | Close on Escape key |
| className | string | "" | Additional CSS classes |

#### Sub-Components
- `DialogHeader` - Dialog header section
- `DialogBody` - Dialog body content
- `DialogFooter` - Dialog footer with actions
- `DialogTitle` - Dialog title
- `DialogDescription` - Dialog description

#### Usage Example
```typescript
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/src/components/ui/dialog';

function MyDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Confirm Action"
      description="Are you sure you want to proceed?"
      size="md"
    >
      <DialogBody>
        <p>This action cannot be undone.</p>
      </DialogBody>
      <DialogFooter>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
        <button onClick={() => setIsOpen(false)}>Confirm</button>
      </DialogFooter>
    </Dialog>
  );
}
```

#### Accessibility
- Focus trap within dialog
- Focus restoration on close
- ARIA attributes
- Keyboard navigation (Escape to close)

---

### DropdownMenu
**Location**: `/src/components/ui/dropdown-menu.tsx`

A dropdown menu with keyboard navigation and accessibility support.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| trigger | ReactNode | - | Trigger button content |
| items | DropdownItem[] | - | Menu items |
| align | 'left' \| 'right' | 'left' | Menu alignment |
| width | string | '200px' | Menu width |
| className | string | "" | Additional CSS classes |

#### DropdownItem Interface
```typescript
interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}
```

#### Usage Example
```typescript
import { DropdownMenu } from '@/src/components/ui/dropdown-menu';

const items = [
  { id: '1', label: 'Profile', onClick: () => console.log('Profile') },
  { id: '2', label: 'Settings', onClick: () => console.log('Settings') },
  { id: '3', label: 'Logout', onClick: () => console.log('Logout'), divider: true },
];

<DropdownMenu trigger="Menu" items={items} align="right" />
```

#### Accessibility
- Keyboard navigation (Arrow keys, Enter, Escape)
- ARIA attributes
- Focus management
- Screen reader compatible

---

### Tabs
**Location**: `/src/components/ui/tabs.tsx`

A tabs component with keyboard navigation and multiple variants.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | Tab[] | - | Tab configuration |
| defaultTab | string | - | Default active tab ID |
| variant | 'default' \| 'pills' \| 'underline' | 'default' | Visual variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Tab size |
| onChange | (tabId: string) => void | - | Callback on tab change |
| className | string | "" | Additional CSS classes |

#### Tab Interface
```typescript
interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}
```

#### Usage Example
```typescript
import { Tabs } from '@/src/components/ui/tabs';

const tabs = [
  { id: '1', label: 'Profile', content: <ProfileContent /> },
  { id: '2', label: 'Settings', content: <SettingsContent /> },
  { id: '3', label: 'Notifications', content: <NotificationsContent /> },
];

<Tabs tabs={tabs} variant="pills" />
```

#### Accessibility
- Keyboard navigation (Arrow keys, Home, End)
- ARIA attributes
- Focus management
- Screen reader compatible

---

### Accordion
**Location**: `/src/components/ui/accordion.tsx`

An accordion component with expandable/collapsible content sections.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | AccordionItem[] | - | Accordion items |
| allowMultiple | boolean | false | Allow multiple open items |
| variant | 'default' \| 'bordered' \| 'ghost' | 'default' | Visual variant |
| onOpenChange | (itemId: string) => void | - | Callback on item toggle |
| className | string | "" | Additional CSS classes |

#### AccordionItem Interface
```typescript
interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}
```

#### Usage Example
```typescript
import { Accordion } from '@/src/components/ui/accordion';

const items = [
  { id: '1', title: 'Section 1', content: <div>Content 1</div> },
  { id: '2', title: 'Section 2', content: <div>Content 2</div> },
  { id: '3', title: 'Section 3', content: <div>Content 3</div> },
];

<Accordion items={items} allowMultiple />
```

#### Accessibility
- Keyboard navigation (Enter, Space)
- ARIA attributes
- Focus management
- Screen reader compatible

---

### Carousel
**Location**: `/src/components/ui/carousel.tsx`

A carousel/slider component with auto-play and navigation controls.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode[] | - | Carousel slides |
| autoPlay | boolean | false | Auto-play slides |
| autoPlayInterval | number | 5000 | Auto-play interval (ms) |
| showArrows | boolean | true | Show navigation arrows |
| showDots | boolean | true | Show pagination dots |
| infinite | boolean | false | Infinite loop |
| className | string | "" | Additional CSS classes |

#### Usage Example
```typescript
import { Carousel } from '@/src/components/ui/carousel';

const slides = [
  <div><img src="slide1.jpg" alt="Slide 1" /></div>,
  <div><img src="slide2.jpg" alt="Slide 2" /></div>,
  <div><img src="slide3.jpg" alt="Slide 3" /></div>,
];

<Carousel slides={slides} autoPlay showArrows showDots />
```

#### Accessibility
- Keyboard navigation (Arrow keys)
- ARIA labels
- Pause on hover
- Screen reader compatible

---

### Stepper
**Location**: `/src/components/ui/stepper.tsx`

A progress stepper component for multi-step workflows.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| steps | Step[] | - | Step configuration |
| currentStep | number | - | Current step index |
| onStepClick | (stepIndex: number) => void | - | Callback on step click |
| variant | 'default' \| 'simple' \| 'minimal' | 'default' | Visual variant |
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | Layout orientation |
| className | string | "" | Additional CSS classes |

#### Step Interface
```typescript
interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  status?: 'pending' \| 'current' \| 'completed' \| 'error';
}
```

#### Usage Example
```typescript
import { Stepper } from '@/src/components/ui/stepper';

const steps = [
  { id: '1', label: 'Personal Info', description: 'Enter your details' },
  { id: '2', label: 'Verification', description: 'Verify your identity' },
  { id: '3', label: 'Confirmation', description: 'Review and submit' },
];

<Stepper steps={steps} currentStep={1} />
```

#### Accessibility
- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader compatible

---

### FileUpload
**Location**: `/src/components/ui/file-upload.tsx`

A file upload component with drag-and-drop support.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onFilesChange | (files: File[]) => void | - | Callback when files change |
| accept | string | '*/*' | Accepted file types |
| multiple | boolean | false | Allow multiple files |
| maxSize | number | 10485760 | Max file size (bytes) |
| maxFiles | number | 5 | Maximum number of files |
| disabled | boolean | false | Disable upload |
| className | string | "" | Additional CSS classes |

#### Usage Example
```typescript
import { FileUpload } from '@/src/components/ui/file-upload';

function handleFilesChange(files: File[]) {
  console.log('Selected files:', files);
}

<FileUpload
  onFilesChange={handleFilesChange}
  accept="image/*,.pdf"
  multiple
  maxSize={5 * 1024 * 1024}
  maxFiles={3}
/>
```

#### Accessibility
- Keyboard accessible
- ARIA labels
- Error announcements
- Screen reader compatible

---

### ThemeProvider
**Location**: `/src/components/ui/theme-provider.tsx`

A theme provider for managing light/dark mode.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Child components |

#### Hook: useTheme
```typescript
const { theme, setTheme, actualTheme } = useTheme();
```

#### Component: ThemeToggle
```typescript
<ThemeToggle showLabel={true} />
```

#### Usage Example
```typescript
import { ThemeProvider, useTheme, ThemeToggle } from '@/src/components/ui/theme-provider';

function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

#### Features
- System preference detection
- LocalStorage persistence
- Smooth theme transitions
- CSS custom properties

---

## Best Practices

### Component Usage
1. Always provide meaningful labels and descriptions
2. Use semantic HTML elements
3. Ensure keyboard navigation works
4. Test with screen readers
5. Follow mobile-first responsive design

### Accessibility
- All components support WCAG 2.1 AA compliance
- Touch targets meet minimum 44px requirement
- Focus indicators are visible
- Color contrast meets AA standards
- ARIA attributes properly implemented

### Performance
- Components use React hooks efficiently
- Memoization where appropriate
- Lazy loading for large datasets
- Optimized re-renders

### Styling
- Use design tokens from CSS custom properties
- Follow spacing scale (4px base unit)
- Use consistent border radius
- Apply shadows from shadow scale
- Maintain visual hierarchy

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing
When adding new components:
1. Follow existing component patterns
2. Include TypeScript types
3. Add accessibility features
4. Document with examples
5. Test across browsers

## Support
For issues or questions, contact the development team.
