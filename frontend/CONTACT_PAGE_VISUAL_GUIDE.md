# Contact Page - Visual Guide

## 🎨 Page Layout Preview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     HEADER (Gradient Red)                            │
│                                                                      │
│                         Let's Talk                                   │
│           Have a project in mind or just want to say hello?         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         MAIN CONTENT                                 │
│                                                                      │
│  ┌──────────────────────────────┐  ┌────────────────────────────┐ │
│  │  CONTACT FORM (2/3 width)     │  │  SIDEBAR (1/3 width)       │ │
│  │                               │  │                            │ │
│  │  Send us a Message            │  │  Or reach out directly     │ │
│  │  ─────────────────            │  │  ────────────────────      │ │
│  │                               │  │                            │ │
│  │  Name *                       │  │  📞 Call Number            │ │
│  │  ┌─────────────────────────┐ │  │  ┌──────────────────────┐ │ │
│  │  │ Enter your name         │ │  │  │ 🔴 📞 +1 234 5678    │ │ │
│  │  └─────────────────────────┘ │  │  └──────────────────────┘ │ │
│  │                               │  │                            │ │
│  │  Email *                      │  │  📧 Email                  │ │
│  │  ┌─────────────────────────┐ │  │  ┌──────────────────────┐ │ │
│  │  │ Enter your email        │ │  │  │ 🔵 📧 hello@...      │ │ │
│  │  └─────────────────────────┘ │  │  └──────────────────────┘ │ │
│  │                               │  │                            │ │
│  │  Message *          150/500   │  │  💼 LinkedIn               │ │
│  │  ┌─────────────────────────┐ │  │  ┌──────────────────────┐ │ │
│  │  │ How can I help you?     │ │  │  │ 🔵 💼 Connect        │ │ │
│  │  │                         │ │  │  └──────────────────────┘ │ │
│  │  │                         │ │  │                            │ │
│  │  └─────────────────────────┘ │  │  ────────────────────      │ │
│  │                               │  │                            │ │
│  │  ┌──────────┐ ┌──────────┐  │  │  Office Information        │ │
│  │  │ 📤 Send  │ │ 💬 WhatsA│  │  │  ┌──────────────────────┐ │ │
│  │  │ Message  │ │ pp       │  │  │  │ 📍 Address           │ │ │
│  │  └──────────┘ └──────────┘  │  │  │ 🕐 Business Hours    │ │ │
│  │                               │  │  └──────────────────────┘ │ │
│  └──────────────────────────────┘  │                            │ │
│                                     │  Quick Response            │ │
│                                     │  ┌──────────────────────┐ │ │
│                                     │  │ 💬 We respond in     │ │ │
│                                     │  │    24 hours          │ │ │
│                                     │  └──────────────────────┘ │ │
│                                     └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     FAQ SECTION                                      │
│                                                                      │
│            Frequently Asked Questions                                │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ▼ How quickly will I receive a response?                      │  │
│  │   We aim to respond to all inquiries within 24 hours...       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ▼ What information should I include in my message?            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Breakdown

### 1. **Header Section**

- **Background:** Gradient from amber-500 to amber-700
- **Text:** White, centered
- **Title:** "Let's Talk" (4xl - 6xl responsive)
- **Subtitle:** Descriptive text in red-100

### 2. **Contact Form**

- **Card:** White background, rounded-2xl, shadow-xl
- **Padding:** Responsive (6-10)
- **Fields:**
  - Name input (text)
  - Email input (email)
  - Message textarea (6 rows, resizable disabled)
- **Validation:**
  - Red border on error
  - Error message below field
  - Real-time character count
- **Buttons:**
  - Send Message (red, with loading spinner)
  - WhatsApp (green, with icon)

### 3. **Contact Methods Sidebar**

- **Quick Contact Cards:**
  - Phone (red icon, hover effect)
  - Email (blue icon, hover effect)
  - LinkedIn (blue icon, hover effect)
- **Office Info Card:**
  - Gradient red background
  - White text
  - Address and hours icons
- **Response Time Card:**
  - Blue background (blue-50)
  - Message circle icon

### 4. **FAQ Section**

- **Background:** Gray-50
- **Accordion:** Details/summary elements
- **Hover:** Slight elevation
- **Open state:** Arrow rotates, title changes color

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)

```
┌────────────────────┐
│     HEADER         │
├────────────────────┤
│   CONTACT FORM     │
│   (Full Width)     │
├────────────────────┤
│   CONTACT SIDEBAR  │
│   (Full Width)     │
├────────────────────┤
│     FAQ            │
└────────────────────┘
```

### Tablet (768px - 1023px)

```
┌─────────────────────────────┐
│          HEADER             │
├─────────────────────────────┤
│  FORM (60%)  │  SIDEBAR     │
│              │  (40%)       │
├─────────────────────────────┤
│          FAQ                │
└─────────────────────────────┘
```

### Desktop (1024px+)

```
┌──────────────────────────────────────┐
│            HEADER                    │
├──────────────────────────────────────┤
│  FORM (66%)       │  SIDEBAR (33%)   │
│                   │                  │
├──────────────────────────────────────┤
│               FAQ                    │
└──────────────────────────────────────┘
```

---

## 🎭 Interactive States

### Form Field States

#### 1. Default State

```
┌─────────────────────────────┐
│ Enter your name            │  ← Gray border (border-gray-200)
└─────────────────────────────┘
```

#### 2. Focus State

```
┌═════════════════════════════┐
│ John|                       │  ← Red border + ring (focus:border-amber-500)
└═════════════════════════════┘
```

#### 3. Error State

```
┌─────────────────────────────┐
│ J                           │  ← Red border (border-amber-500)
└─────────────────────────────┘
❌ Name must be at least 2 characters
```

#### 4. Valid State

```
┌─────────────────────────────┐
│ John Doe                    │  ← Normal border, no error
└─────────────────────────────┘
```

#### 5. Disabled State (Submitting)

```
┌─────────────────────────────┐
│ John Doe                    │  ← Gray background, cursor not-allowed
└─────────────────────────────┘
```

### Button States

#### Send Message Button

**Default:**

```
┌────────────────────┐
│ 📤 Send Message    │  ← Red background (bg-amber-500)
└────────────────────┘
```

**Hover:**

```
┌────────────────────┐
│ 📤 Send Message ↗  │  ← Darker red, shadow, slight lift
└────────────────────┘
```

**Loading:**

```
┌────────────────────┐
│ ⟳ Sending...       │  ← Spinner animation, disabled
└────────────────────┘
```

**Success:**

```
┌────────────────────┐
│ ✓ Message Sent!    │  ← Green background (bg-green-500)
└────────────────────┘
```

---

## 🌈 Color Palette

### Primary Colors

- **Red 500:** `#EF4444` - Primary buttons, header
- **Red 600:** `#DC2626` - Hover states
- **Red 100:** `#FEE2E2` - Subtle backgrounds

### Secondary Colors

- **Green 500:** `#10B981` - WhatsApp button
- **Blue 500:** `#3B82F6` - Email, LinkedIn icons
- **Gray 50:** `#F9FAFB` - Page background
- **Gray 200:** `#E5E7EB` - Borders
- **Gray 700:** `#374151` - Text
- **Gray 900:** `#111827` - Headings

### Status Colors

- **Success:** Green-500 (#10B981)
- **Error:** amber-500 (#EF4444)
- **Warning:** Yellow-500 (#EAB308)
- **Info:** Blue-500 (#3B82F6)

---

## ✨ Animations

### 1. Form Transitions

```css
transition-all duration-200
```

- Border color changes
- Background color changes
- Ring appearance

### 2. Button Hover

```css
transition-all duration-300 transform
hover:shadow-lg hover:-translate-y-0.5
```

- Shadow increases
- Slight upward movement

### 3. Loading Spinner

```css
animate-spin
```

- Continuous rotation
- Loader2 icon from lucide-react

### 4. Success Checkmark

```css
CheckCircle2 icon appears
Green background fade-in
```

### 5. FAQ Accordion

```css
group-open: rotate-180 transition-transform;
```

- Arrow rotates on open
- Smooth height transition

---

## 🎯 User Flow

### Happy Path

```
1. User lands on page
   ↓
2. User fills in name
   ✓ Validation passes
   ↓
3. User fills in email
   ✓ Validation passes
   ↓
4. User types message
   ✓ Character count updates
   ✓ Validation passes
   ↓
5. User clicks "Send Message"
   ↓ Button shows loading state
   ↓ API request sent
   ↓
6. Success response received
   ↓ Success toast appears
   ↓ Button shows success state
   ↓
7. Form auto-resets after 3 seconds
   ↓
8. User can submit another message
```

### Error Path

```
1. User clicks submit without filling form
   ↓
2. All fields show validation errors
   ↓ Warning toast appears
   ↓
3. User corrects errors
   ↓ Real-time validation updates
   ↓
4. User submits again
   ↓
5. API request fails
   ↓ Error toast appears
   ↓ Form stays filled
   ↓
6. User can retry
```

---

## 🔍 Accessibility Features

### Keyboard Navigation

```
Tab Order:
1. Name field
2. Email field
3. Message field
4. Send Message button
5. WhatsApp button
6. Phone card
7. Email card
8. LinkedIn card
9. FAQ accordions
```

### Screen Reader Announcements

- Field labels properly associated
- Error messages announced on blur
- Button states announced (loading, success)
- Required fields indicated with asterisk
- ARIA attributes properly set

### Focus Indicators

- Visible focus ring (4px red-100)
- High contrast mode compatible
- Keyboard-only users fully supported

---

## 📸 Component Screenshots (Description)

### Desktop View

- **Width:** 1440px
- **Form:** 960px (2 columns)
- **Sidebar:** 480px (1 column)
- **Spacing:** 48px gap

### Mobile View

- **Width:** 375px
- **Form:** Full width
- **Sidebar:** Full width (stacked)
- **Spacing:** 24px gap

---

## 🎨 Customization Examples

### Change Primary Color (Blue Theme)

```typescript
// Replace all instances of:
amber-500 → blue-500
amber-700 → blue-600
red-100 → blue-100

// Example:
className="bg-amber-500 hover:bg-amber-700"
// becomes:
className="bg-blue-500 hover:bg-blue-600"
```

### Add Company Logo

```typescript
<div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white py-16">
  <div className="container mx-auto px-4 text-center">
    <img src="/logo.png" alt="Company Logo" className="h-16 mx-auto mb-6" />
    <h1 className="text-5xl font-bold mb-4">Let's Talk</h1>
    {/* ... */}
  </div>
</div>
```

### Add Social Media Icons

```typescript
{
  /* After LinkedIn card */
}
<a href="https://twitter.com/..." className="...">
  <FaTwitter className="w-6 h-6" />
  <div>
    <p className="text-sm font-semibold">Twitter</p>
    <p className="text-base font-bold">@yourhandle</p>
  </div>
</a>;
```

---

**Version:** 1.0.0  
**Created:** November 6, 2025  
**Design System:** Tailwind CSS  
**Icons:** Lucide React + React Icons
