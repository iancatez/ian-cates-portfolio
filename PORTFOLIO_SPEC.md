# Portfolio Single-Page Application - Specification & Requirements

## Overview
Transform the current multi-page portfolio into a modern, single-page application with smooth animations, interactive elements, and mouse-reactive UI components. The design should be elegant and professional without being overwhelming.

## Technical Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: ShadCN UI
- **Animations**: Framer Motion
- **Icons**: Lucide React (already installed)

## Design Principles
1. **Subtle Interactions**: Mouse-reactive elements should enhance UX, not distract
2. **Smooth Animations**: All transitions should be fluid (60fps target)
3. **Performance**: Maintain fast load times and smooth scrolling
4. **Accessibility**: Ensure keyboard navigation and screen reader compatibility
5. **Responsive**: Fully functional on mobile, tablet, and desktop

## Page Structure (Single Page with Sections)

### 1. Navigation Bar (Sticky)
- **Location**: Top of page, sticky on scroll
- **Behavior**: 
  - Smooth scroll to sections on click
  - Active section highlighting
  - Subtle background blur on scroll
- **Sections**: Home, About, Projects, Contact
- **Animation**: Fade in on page load, slide down on scroll

### 2. Hero Section
- **Content**: Name, title/role, brief tagline
- **Animations**:
  - Text fade-in with stagger effect
  - Optional: Subtle parallax effect on scroll
  - Mouse-reactive gradient or glow effect (subtle)
- **CTA**: Smooth scroll button to next section

### 3. About Section
- **Content**: Personal background, skills, experience
- **Animations**:
  - Cards/sections fade in on scroll into view
  - Skill tags with hover effects
  - Optional: Animated progress bars or skill visualizations
- **Mouse Interaction**: Cards slightly lift/scale on hover

### 4. Projects Section
- **Content**: Project cards with images, descriptions, tech stack
- **Animations**:
  - Cards fade in with stagger on scroll
  - Hover effects: lift, scale, or tilt
  - Image reveal animations
  - Mouse-reactive tilt effect (3D transform, subtle)
- **Layout**: Grid that adapts to screen size
- **Interaction**: Click to expand/view details or external link

### 5. Contact Section
- **Content**: Contact form or contact information
- **Animations**:
  - Form fields animate in on focus
  - Submit button with hover effects
  - Success/error message animations
- **Mouse Interaction**: Input fields with subtle glow on focus

### 6. Footer
- **Content**: Social links, copyright
- **Animation**: Fade in on scroll
- **Mouse Interaction**: Social icons with hover effects

## Animation Specifications

### Framer Motion Patterns
1. **Page Load**: 
   - Stagger children animations (0.1s delay between elements)
   - Fade in from opacity 0 to 1
   - Slide up from y: 20 to y: 0

2. **Scroll Animations**:
   - Use `useInView` hook to trigger animations when section enters viewport
   - Fade in + slide up combination
   - Stagger for multiple items (cards, skills, etc.)

3. **Hover Effects**:
   - Scale: 1.02-1.05 (subtle)
   - Shadow enhancement
   - Color transitions (smooth, 200-300ms)

4. **Mouse Reactive Elements**:
   - Use `useMousePosition` or `useMotionValue` for mouse tracking
   - Apply subtle transforms based on mouse position
   - Parallax effects on background elements (max 10-20px movement)
   - Tilt effect on cards (max 5-10 degrees rotation)

### Performance Considerations
- Use `will-change` CSS property sparingly
- Prefer `transform` and `opacity` for animations (GPU accelerated)
- Debounce mouse movement handlers
- Lazy load images
- Use `layoutId` for shared element transitions if needed

## Component Requirements

### Reusable Components to Create/Update

1. **AnimatedSection.tsx**
   - Wrapper component for sections
   - Handles scroll-triggered animations
   - Props: children, className, delay

2. **MouseReactiveCard.tsx**
   - Card component with mouse tilt effect
   - Props: children, intensity (default: subtle)
   - Uses Framer Motion's `useMotionValue` and `useSpring`

3. **AnimatedText.tsx**
   - Text component with fade-in and stagger
   - Props: text, variant (heading, body, etc.)

4. **ScrollIndicator.tsx**
   - Optional: Animated scroll indicator
   - Smooth scroll behavior

5. **StickyNavigation.tsx**
   - Enhanced navigation with active section detection
   - Smooth scroll to sections
   - Background blur on scroll

## Data Structure

### Projects Data
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}
```

### Skills Data
```typescript
interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  proficiency?: number; // 0-100, optional
}
```

## Parallelizable Tasks

### Task Group 1: Core Animation Setup
**Dependencies**: None
**Tasks**:
- [ ] Install Framer Motion
- [ ] Create `AnimatedSection` component
- [ ] Create `useScrollAnimation` hook
- [ ] Set up animation variants/constants file

### Task Group 2: Navigation Enhancement
**Dependencies**: Task Group 1 (for animations)
**Tasks**:
- [ ] Convert to sticky navigation
- [ ] Implement smooth scroll to sections
- [ ] Add active section detection
- [ ] Add scroll-based background blur effect
- [ ] Add mobile menu (hamburger) if needed

### Task Group 3: Hero Section
**Dependencies**: Task Group 1
**Tasks**:
- [ ] Redesign hero with animations
- [ ] Add stagger text animations
- [ ] Implement mouse-reactive gradient/glow (optional)
- [ ] Add scroll indicator or CTA button

### Task Group 4: About Section
**Dependencies**: Task Group 1
**Tasks**:
- [ ] Redesign about section layout
- [ ] Add skill cards with hover effects
- [ ] Implement scroll-triggered animations
- [ ] Add animated skill visualizations (optional)

### Task Group 5: Projects Section
**Dependencies**: Task Group 1, Task Group 2 (for mouse-reactive cards)
**Tasks**:
- [ ] Create `MouseReactiveCard` component
- [ ] Redesign projects grid layout
- [ ] Add project card animations (fade in, stagger)
- [ ] Implement mouse tilt effect on cards
- [ ] Add image reveal animations
- [ ] Update project data structure

### Task Group 6: Contact Section
**Dependencies**: Task Group 1
**Tasks**:
- [ ] Create contact form or information display
- [ ] Add form field animations
- [ ] Implement submit handling (if form)
- [ ] Add success/error message animations

### Task Group 7: Mouse Interaction System
**Dependencies**: Task Group 1
**Tasks**:
- [ ] Create `useMousePosition` hook
- [ ] Create `MouseReactiveCard` component
- [ ] Add parallax effects to background elements
- [ ] Implement global mouse follower effect (optional, subtle)

### Task Group 8: Page Conversion & Integration
**Dependencies**: All previous groups
**Tasks**:
- [ ] Convert multi-page to single-page layout
- [ ] Update routing (remove separate routes, use hash/anchor links)
- [ ] Integrate all sections into single page
- [ ] Ensure smooth scrolling between sections
- [ ] Test all animations and interactions
- [ ] Performance optimization

### Task Group 9: Polish & Optimization
**Dependencies**: Task Group 8
**Tasks**:
- [ ] Add loading states/animations
- [ ] Optimize animation performance
- [ ] Add accessibility improvements (keyboard nav, ARIA labels)
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] Final design polish

## Implementation Guidelines

### Animation Timing
- **Fast**: 200ms (hover effects, quick interactions)
- **Medium**: 300-400ms (card animations, transitions)
- **Slow**: 500-600ms (page load, section reveals)

### Easing Functions
- **Default**: `ease-out` for most animations
- **Bounce**: Avoid unless specifically requested
- **Spring**: Use for natural-feeling interactions

### Mouse Interaction Intensity
- **Subtle**: Max 5-10px movement, 2-5 degree rotation
- **Moderate**: 10-20px movement, 5-10 degree rotation
- **Strong**: Avoid (too distracting)

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Acceptance Criteria

### Functional Requirements
- [ ] All sections accessible via smooth scroll navigation
- [ ] Animations trigger correctly on scroll into view
- [ ] Mouse interactions work smoothly without lag
- [ ] All interactive elements are keyboard accessible
- [ ] Page loads in < 3 seconds
- [ ] Animations maintain 60fps on mid-range devices

### Design Requirements
- [ ] Consistent animation style throughout
- [ ] Mouse interactions are subtle and enhance UX
- [ ] Responsive design works on all screen sizes
- [ ] Color scheme and typography remain consistent
- [ ] No jarring or abrupt animations

### Technical Requirements
- [ ] No console errors
- [ ] TypeScript types are properly defined
- [ ] Components are reusable and well-documented
- [ ] Code follows project conventions
- [ ] Build succeeds without warnings

## File Structure Changes

```
app/
├── layout.tsx (updated - single page layout)
├── page.tsx (updated - single page with all sections)
├── globals.css (updated - animation utilities)
└── [remove about/ and projects/ folders]

components/
├── ui/ (existing ShadCN components)
├── navigation.tsx (updated - sticky, smooth scroll)
├── footer.tsx (existing)
├── animated-section.tsx (new)
├── mouse-reactive-card.tsx (new)
├── animated-text.tsx (new)
├── hero-section.tsx (new)
├── about-section.tsx (new)
├── projects-section.tsx (new)
└── contact-section.tsx (new)

hooks/
├── use-scroll-animation.ts (new)
├── use-mouse-position.ts (new)
└── use-active-section.ts (new)

lib/
├── utils.ts (existing)
└── animations.ts (new - animation variants)
```

## Notes for Implementation

1. **Start with Core**: Set up Framer Motion and basic animation patterns first
2. **Progressive Enhancement**: Ensure site works without JavaScript, enhance with animations
3. **Performance First**: Monitor bundle size and animation performance
4. **User Control**: Consider `prefers-reduced-motion` media query for accessibility
5. **Testing**: Test on various devices and browsers
6. **Iteration**: Start subtle, can increase intensity if needed

## Questions to Resolve

1. **Contact Section**: Form or just contact information/links?
2. **Project Details**: Expandable modals or external links only?
3. **Theme**: Light, dark, or both with toggle?
4. **Mouse Follower**: Add a subtle cursor follower effect?
5. **Loading State**: Skeleton screens or simple loader?

---

**Status**: Ready for Review
**Next Step**: Review and approve, then begin implementation with parallel task groups

