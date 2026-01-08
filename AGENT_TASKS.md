# Agent Tasks - Parallel Execution Plan

This file defines tasks that can be executed in parallel by Cursor agents. Each task group can be worked on independently after its dependencies are met.

## Task Execution Rules

1. **Dependencies**: Tasks with dependencies must wait for their dependencies to complete
2. **Parallel Execution**: Tasks in the same group or with no dependencies can run simultaneously
3. **File Conflicts**: Agents should coordinate on shared files (use file-level locks or sequential updates)
4. **Testing**: Each task group should verify its changes don't break the build
5. **Git Workflow (MANDATORY)**: Each task group MUST be completed on a separate branch with its own commit and PR
   - Create branch: `git checkout -b task-group-[number]-[description]`
   - Commit: `git commit -m "feat: Task Group [N] - [Description]"`
   - Push: `git push -u origin task-group-[number]-[description]`
   - Create PR: Use GitHub CLI or web interface
   - See `WORKFLOW.md` for complete workflow details

---

## Task Group 1: Core Animation Setup
**Status**: Pending  
**Dependencies**: None  
**Can Run In Parallel**: Yes  
**Estimated Time**: 30-45 minutes

### Tasks:
1. **Install Framer Motion**
   - Run: `npm install framer-motion`
   - Verify: Check package.json

2. **Create Animation Utilities**
   - File: `lib/animations.ts`
   - Content: Define reusable animation variants (fadeIn, slideUp, stagger, etc.)
   - Export: Variants object with common animation patterns

3. **Create AnimatedSection Component**
   - File: `components/animated-section.tsx`
   - Props: `children`, `className?`, `delay?`, `variant?`
   - Features: Wraps content with scroll-triggered animations
   - Uses: Framer Motion `motion.div` with `useInView` hook

4. **Create useScrollAnimation Hook**
   - File: `hooks/use-scroll-animation.ts`
   - Returns: `ref`, `isInView`, `controls`
   - Purpose: Reusable hook for scroll-triggered animations

5. **Update globals.css**
   - Add: Animation utility classes
   - Add: `prefers-reduced-motion` media query support
   - Add: Performance hints (`will-change` guidelines)

**Acceptance Criteria**:
- [ ] Framer Motion installed
- [ ] Animation utilities file created with common variants
- [ ] AnimatedSection component works with scroll detection
- [ ] Hook properly detects viewport intersection
- [ ] No TypeScript errors
- [ ] Build succeeds

---

## Task Group 2: Navigation Enhancement
**Status**: Pending  
**Dependencies**: Task Group 1 (for animation utilities)  
**Can Run In Parallel**: Yes (after Group 1)  
**Estimated Time**: 45-60 minutes

### Tasks:
1. **Update Navigation Component**
   - File: `components/navigation.tsx`
   - Changes:
     - Make sticky on scroll
     - Add smooth scroll to sections
     - Add active section highlighting
     - Add background blur on scroll
     - Add fade-in animation on page load

2. **Create useActiveSection Hook**
   - File: `hooks/use-active-section.ts`
   - Purpose: Track which section is currently in view
   - Returns: `activeSection` string
   - Uses: Intersection Observer API

3. **Add Smooth Scroll Behavior**
   - Update: Navigation links to use smooth scroll
   - Implementation: Use `scrollIntoView({ behavior: 'smooth' })` or Framer Motion scroll

4. **Add Scroll-Based Styling**
   - Effect: Background blur/opacity change on scroll
   - Implementation: Use `useScroll` hook from Framer Motion

5. **Mobile Menu (Optional)**
   - Add: Hamburger menu for mobile
   - Animation: Slide in/out with Framer Motion

**Acceptance Criteria**:
- [ ] Navigation is sticky and works on scroll
- [ ] Smooth scrolling to sections works
- [ ] Active section is highlighted correctly
- [ ] Background blur appears on scroll
- [ ] Mobile menu works (if implemented)
- [ ] No console errors

---

## Task Group 3: Hero Section Redesign
**Status**: Pending  
**Dependencies**: Task Group 1  
**Can Run In Parallel**: Yes (after Group 1)  
**Estimated Time**: 45-60 minutes

### Tasks:
1. **Create HeroSection Component**
   - File: `components/hero-section.tsx`
   - Content: Name, title, tagline, CTA button
   - Layout: Centered, full viewport height or large section

2. **Add Text Animations**
   - Effect: Stagger fade-in for text elements
   - Implementation: Use Framer Motion `motion` components with `initial`, `animate`, `transition`
   - Timing: 0.1s delay between elements

3. **Add Optional Mouse-Reactive Gradient**
   - Effect: Subtle gradient that follows mouse (optional)
   - Implementation: Use `useMotionValue` and `useSpring` from Framer Motion
   - Intensity: Very subtle (max 20px movement)

4. **Add Scroll Indicator**
   - Component: Animated arrow or "scroll down" indicator
   - Animation: Bounce or pulse effect
   - Action: Smooth scroll to next section on click

5. **Update Home Page**
   - File: `app/page.tsx`
   - Replace: Current content with HeroSection component

**Acceptance Criteria**:
- [ ] Hero section displays correctly
- [ ] Text animations work with stagger effect
- [ ] Mouse-reactive gradient works (if implemented)
- [ ] Scroll indicator animates and functions
- [ ] Responsive on all screen sizes

---

## Task Group 4: About Section Redesign
**Status**: Pending  
**Dependencies**: Task Group 1  
**Can Run In Parallel**: Yes (after Group 1)  
**Estimated Time**: 60-75 minutes

### Tasks:
1. **Create AboutSection Component**
   - File: `components/about-section.tsx`
   - Content: Personal background, skills, experience
   - Layout: Cards or sections with clear hierarchy

2. **Add Skill Cards**
   - Component: Individual skill cards with hover effects
   - Animation: Fade in on scroll, scale on hover
   - Content: Skill name, category, optional proficiency

3. **Implement Scroll-Triggered Animations**
   - Effect: Cards fade in with stagger when section enters viewport
   - Implementation: Use AnimatedSection or custom scroll detection

4. **Add Animated Skill Visualizations (Optional)**
   - Feature: Progress bars or visual indicators
   - Animation: Animate from 0 to value on scroll into view
   - Implementation: Use Framer Motion `useMotionValue` with `useSpring`

5. **Update Data Structure**
   - File: `lib/data.ts` or similar
   - Add: Skills array with proper TypeScript interface

**Acceptance Criteria**:
- [ ] About section displays correctly
- [ ] Skill cards animate on scroll
- [ ] Hover effects work smoothly
- [ ] Animations are performant
- [ ] Content is well-organized

---

## Task Group 5: Projects Section Redesign
**Status**: Pending  
**Dependencies**: Task Group 1, Task Group 7 (for mouse-reactive cards)  
**Can Run In Parallel**: Yes (after Groups 1 & 7)  
**Estimated Time**: 75-90 minutes

### Tasks:
1. **Create MouseReactiveCard Component**
   - File: `components/mouse-reactive-card.tsx`
   - Props: `children`, `intensity?` (default: 'subtle')
   - Features: 3D tilt effect based on mouse position
   - Implementation: Use Framer Motion `useMotionValue`, `useSpring`, `useTransform`

2. **Create ProjectsSection Component**
   - File: `components/projects-section.tsx`
   - Layout: Responsive grid (1 col mobile, 2 tablet, 3 desktop)
   - Content: Project cards with images, descriptions, tech stack

3. **Add Project Card Animations**
   - Effect: Fade in with stagger on scroll
   - Hover: Lift, scale, or tilt effect
   - Implementation: Combine MouseReactiveCard with scroll animations

4. **Add Image Reveal Animations**
   - Effect: Images fade in or slide in when card enters viewport
   - Implementation: Use Framer Motion `motion.img` with scroll detection

5. **Update Project Data Structure**
   - File: `lib/data.ts` or `lib/projects.ts`
   - Add: Projects array with TypeScript interface
   - Include: All project fields (title, description, image, tech, links)

6. **Update Projects Page (Temporary)**
   - Keep: Existing projects page for reference
   - Note: Will be integrated into single page later

**Acceptance Criteria**:
- [ ] MouseReactiveCard component works with subtle tilt
- [ ] Projects display in responsive grid
- [ ] Cards animate on scroll with stagger
- [ ] Hover effects are smooth
- [ ] Images load and animate correctly
- [ ] No performance issues

---

## Task Group 6: Contact Section Creation
**Status**: Pending  
**Dependencies**: Task Group 1  
**Can Run In Parallel**: Yes (after Group 1)  
**Estimated Time**: 45-60 minutes

### Tasks:
1. **Create ContactSection Component**
   - File: `components/contact-section.tsx`
   - Options: Contact form OR contact information display
   - Decision: Check with user or implement information display (can add form later)

2. **Add Form Field Animations (if form)**
   - Effect: Fields animate in on focus
   - Implementation: Framer Motion `motion.input` with focus handlers
   - Styling: Subtle glow or border color change

3. **Add Submit Button Animations**
   - Effect: Hover effects, loading state
   - Implementation: Use Button component from ShadCN with Framer Motion

4. **Add Success/Error Message Animations**
   - Effect: Slide in from side or fade in
   - Implementation: Framer Motion with conditional rendering

5. **Alternative: Contact Information Display**
   - Layout: Email, social links, location (if applicable)
   - Animation: Fade in on scroll
   - Icons: Use Lucide React icons

**Acceptance Criteria**:
- [ ] Contact section displays correctly
- [ ] Form fields animate (if form implemented)
- [ ] Submit handling works (if form)
- [ ] Animations are smooth
- [ ] Responsive design works

---

## Task Group 7: Mouse Interaction System
**Status**: Pending  
**Dependencies**: Task Group 1  
**Can Run In Parallel**: Yes (after Group 1)  
**Estimated Time**: 60-75 minutes

### Tasks:
1. **Create useMousePosition Hook**
   - File: `hooks/use-mouse-position.ts`
   - Returns: `{ x, y }` mouse coordinates
   - Features: Debounced updates for performance
   - Implementation: Use `useState` and `useEffect` with `mousemove` event

2. **Create MouseReactiveCard Component**
   - File: `components/mouse-reactive-card.tsx`
   - Features: 3D tilt effect based on mouse position relative to card
   - Props: `children`, `intensity?: 'subtle' | 'moderate'`
   - Implementation: Framer Motion `useMotionValue`, `useSpring`, `useTransform`
   - Limits: Max 10px movement, max 5-10 degree rotation

3. **Add Parallax Effects (Optional)**
   - Component: Background elements with parallax
   - Effect: Move slightly based on scroll position
   - Implementation: Framer Motion `useScroll` and `useTransform`
   - Intensity: Very subtle (max 20px movement)

4. **Global Mouse Follower (Optional)**
   - Component: Subtle cursor follower effect
   - Effect: Small dot or glow that follows mouse
   - Implementation: Framer Motion `motion.div` with mouse position
   - Note: Only if user wants this feature

**Acceptance Criteria**:
- [ ] useMousePosition hook works correctly
- [ ] MouseReactiveCard tilts smoothly
- [ ] Performance is good (60fps)
- [ ] Effects are subtle and not distracting
- [ ] Works on touch devices (graceful degradation)

---

## Task Group 8: Page Conversion & Integration
**Status**: Pending  
**Dependencies**: All previous groups (1-7)  
**Can Run In Parallel**: No (must be sequential)  
**Estimated Time**: 90-120 minutes

### Tasks:
1. **Convert to Single Page Layout**
   - File: `app/page.tsx`
   - Changes:
     - Combine all sections into one page
     - Use section IDs for anchor navigation
     - Remove separate route pages (about, projects)
     - Keep sections: Hero, About, Projects, Contact

2. **Update Navigation**
   - Ensure: Links point to section IDs (#about, #projects, etc.)
   - Verify: Smooth scrolling works to all sections

3. **Integrate All Section Components**
   - Import: HeroSection, AboutSection, ProjectsSection, ContactSection
   - Layout: Stack sections vertically with proper spacing
   - Spacing: Use consistent padding/margins between sections

4. **Add Section Spacing & Layout**
   - Ensure: Proper spacing between sections
   - Add: Section IDs for navigation
   - Style: Consistent section padding and max-width

5. **Update Footer**
   - Keep: Existing footer component
   - Ensure: It appears at bottom of single page

6. **Remove Separate Route Pages**
   - Delete: `app/about/page.tsx`
   - Delete: `app/projects/page.tsx`
   - Update: Any imports that reference these

7. **Test Smooth Scrolling**
   - Verify: All navigation links work
   - Test: Scroll behavior is smooth
   - Check: Active section highlighting works

8. **Update Layout if Needed**
   - File: `app/layout.tsx`
   - Ensure: Layout supports single-page structure
   - Verify: Navigation and footer work correctly

**Acceptance Criteria**:
- [ ] Single page displays all sections
- [ ] Navigation scrolls to correct sections
- [ ] All animations work together
- [ ] No broken links or imports
- [ ] Page structure is clean and organized
- [ ] Build succeeds

---

## Task Group 9: Polish & Optimization
**Status**: Pending  
**Dependencies**: Task Group 8  
**Can Run In Parallel**: Partially (some tasks can run in parallel)  
**Estimated Time**: 60-90 minutes

### Tasks:
1. **Performance Optimization**
   - Check: Bundle size
   - Optimize: Image loading (lazy load, next/image)
   - Verify: Animation performance (60fps)
   - Add: Debouncing for mouse handlers
   - Test: Lighthouse score

2. **Accessibility Improvements**
   - Add: Keyboard navigation support
   - Add: ARIA labels where needed
   - Test: Screen reader compatibility
   - Ensure: `prefers-reduced-motion` is respected
   - Verify: Focus states are visible

3. **Mobile Responsiveness**
   - Test: All sections on mobile
   - Verify: Touch interactions work
   - Check: Animations don't cause issues on mobile
   - Ensure: Navigation works on mobile

4. **Cross-Browser Testing**
   - Test: Chrome, Firefox, Safari, Edge
   - Verify: Animations work in all browsers
   - Check: No console errors

5. **Final Design Polish**
   - Review: Spacing and typography
   - Verify: Color consistency
   - Check: Animation timing feels right
   - Ensure: Mouse interactions are subtle

6. **Documentation**
   - Update: README with new structure
   - Document: Component usage
   - Note: Animation patterns used

**Acceptance Criteria**:
- [ ] Performance is optimized (Lighthouse score > 90)
- [ ] Accessibility standards met
- [ ] Works on all tested browsers
- [ ] Mobile experience is excellent
- [ ] No console errors or warnings
- [ ] Code is clean and well-organized

---

## Execution Order Summary

### Phase 1: Foundation (Parallel)
- Task Group 1: Core Animation Setup

### Phase 2: Components (Parallel after Phase 1)
- Task Group 2: Navigation Enhancement
- Task Group 3: Hero Section
- Task Group 4: About Section
- Task Group 6: Contact Section
- Task Group 7: Mouse Interaction System

### Phase 3: Integration (Sequential)
- Task Group 5: Projects Section (after Group 7)
- Task Group 8: Page Conversion (after all Phase 2)

### Phase 4: Polish (Parallel after Phase 3)
- Task Group 9: Polish & Optimization
- Task Group 10: Styling & Color Scheme Enhancement (Completed)
- Task Group 11: Custom Scrollbar Styling (Completed)
- Task Group 12: Styling Consistency & UI Polish

### Phase 5: UX Enhancements (Parallel)
- Feature #13: Hero Button Transition Enhancement
- Feature #14: Explore Button Cursor Interaction
- Feature #15: Improved Animation Trigger Timing

---

## Notes for Agents

1. **File Coordination**: 
   - If multiple agents work on the same file, coordinate or work sequentially
   - Use clear commit messages
   - Test after each change

2. **Testing**:
   - Run `npm run build` after each task group
   - Run `npm run dev` to test visually
   - Check for TypeScript errors

3. **Communication**:
   - Update task status in this file
   - Note any blockers or issues
   - Document decisions made

4. **Code Quality**:
   - Follow existing code style
   - Use TypeScript properly
   - Add comments for complex logic
   - Keep components reusable

---

---

## Task Group 10: Styling & Color Scheme Enhancement
**Status**: Completed  
**Dependencies**: None  
**Can Run In Parallel**: Yes  
**Estimated Time**: 30-45 minutes

### Tasks:
1. **Update Color Scheme** ✅
   - Gray base colors for backgrounds and text
   - Soft green accents for secondary elements
   - Neon glowing green for primary buttons
   - Ensure good contrast for accessibility

2. **Add Neon Glow Effect** ✅
   - Add CSS box-shadow glow effect to primary buttons
   - Enhance glow on hover for interactive feedback
   - Use HSL color values for the neon green glow

3. **Test Color Accessibility** ✅
   - Verify contrast ratios meet WCAG standards
   - Test in both light and dark modes
   - Ensure readability across all sections

**Acceptance Criteria**:
- [x] Gray base color scheme implemented
- [x] Soft green accents applied
- [x] Neon glowing green buttons with hover effects
- [x] Good contrast for accessibility
- [x] Consistent color usage throughout
- [x] Build succeeds

---

---

## Task Group 11: Custom Scrollbar Styling
**Status**: Completed  
**Dependencies**: None  
**Can Run In Parallel**: Yes  
**Estimated Time**: 15-20 minutes

### Tasks:
1. **Style Scrollbar** ✅
   - Use CSS to customize scrollbar appearance
   - Match dark theme with soft green accents
   - Use ShadCN CSS variables for colors
   - Add smooth scrollbar styling for webkit browsers
   - Ensure scrollbar is visible but not distracting

2. **Cross-Browser Support** ✅
   - Style for webkit browsers (Chrome, Safari, Edge)
   - Add fallback for Firefox (scrollbar-width, scrollbar-color)
   - Ensure accessibility (scrollbar remains functional)

**Acceptance Criteria**:
- [x] Scrollbar matches dark theme
- [x] Uses soft green accent colors
- [x] Smooth, modern appearance
- [x] Works in Chrome, Firefox, Safari, Edge
- [x] Build succeeds

---

## Task Group 12: Styling Consistency & UI Polish
**Status**: Pending  
**Dependencies**: None  
**Can Run In Parallel**: Yes  
**Estimated Time**: 60-90 minutes

### Tasks:
1. **Fix ShadCN Component Blur Issues**
   - Investigate blurry appearance in ShadCN components
   - Likely causes: backdrop-blur conflicts, transform issues, or subpixel rendering
   - Fix: Ensure proper `transform-style: preserve-3d` usage
   - Fix: Remove conflicting backdrop-blur on components that don't need it
   - Fix: Add `will-change` hints appropriately
   - Fix: Ensure proper GPU acceleration without causing blur
   - Test: All ShadCN components (Button, Card, etc.) render crisp

2. **Standardize Styling Across Actions**
   - Review all interactive elements (buttons, links, cards)
   - Ensure consistent hover states across all components
   - Standardize transition durations (use consistent timing)
   - Ensure consistent shadow/glow effects
   - Standardize border radius values
   - Create utility classes or constants for common patterns
   - Update: Button variants to have consistent styling
   - Update: Card hover effects to match button hover patterns
   - Update: Link styles to be consistent

3. **Clean Up Framer Motion Animations**
   - Audit all Framer Motion usage across components
   - Ensure consistent animation patterns (use shared variants from `lib/animations.ts`)
   - Remove duplicate animation definitions
   - Standardize transition timings and easing
   - Ensure all animations respect `prefers-reduced-motion`
   - Fix: Any animations causing performance issues
   - Optimize: Use `layoutId` where appropriate for shared element transitions
   - Document: Animation patterns in code comments

4. **Navigation Hide/Show on Scroll**
   - Update: `components/navigation.tsx`
   - Add: Hide navigation when scrolling down
   - Add: Show navigation when scrolling up
   - Add: Smooth slide animation (use Framer Motion)
   - Add: Show navigation when at top of page
   - Implementation: Use `useScroll` and `useMotionValueEvent` from Framer Motion
   - Track scroll direction and position
   - Animate: `y: -100` when hidden, `y: 0` when visible
   - Ensure: Navigation remains accessible (consider mobile)

5. **Add Headshot Photo Placeholder**
   - Update: `components/about-section.tsx`
   - Add: Headshot image placeholder in About section
   - Layout: Place headshot alongside or above background card
   - Use: Next.js `Image` component for optimization
   - Add: Placeholder image in `public/` directory (or use placeholder service)
   - Style: Rounded image with proper sizing
   - Add: Fade-in animation when section enters viewport
   - Responsive: Ensure image scales properly on mobile
   - Add: Alt text for accessibility
   - Consider: Adding border or shadow to make it stand out

**Acceptance Criteria**:
- [ ] ShadCN components render crisp without blur
- [ ] All interactive elements have consistent styling
- [ ] Framer Motion animations are clean and consistent
- [ ] Navigation hides on scroll down, shows on scroll up
- [ ] Headshot placeholder added to About section
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No performance issues with animations
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Responsive design works on all screen sizes

---

## Feature #13: Hero Button Transition Enhancement
**Feature #**: 13
**Status**: Pending
**Dependencies**: None
**Can Run In Parallel**: Yes
**Estimated Time**: 30-45 minutes

### Requirements:
- Hero section buttons ("View Projects" and "About Me") must have smooth, polished transitions when clicked/selected
- Transitions should feel responsive and provide clear visual feedback
- No jarring or abrupt state changes
- Transitions should work consistently across all button variants in the Hero section
- Transitions must respect `prefers-reduced-motion` accessibility preference

### Tasks:
1. **Analyze current button transition behavior**
   - Review `components/hero-section.tsx` button implementation
   - Identify current transition gaps or issues
   - Document desired transition behavior

2. **Enhance button transitions**
   - Add smooth state transitions for active/focus states
   - Implement click feedback animations using Framer Motion
   - Ensure transitions respect `prefers-reduced-motion`
   - Test transitions on different interaction states (hover, click, focus)

3. **Polish transition timing**
   - Fine-tune transition durations for optimal feel
   - Ensure transitions are consistent between both Hero buttons
   - Verify transitions work with existing neon glow effects

**Acceptance Criteria**:
- [ ] Hero buttons have smooth, polished transitions
- [ ] Visual feedback is clear on all interaction states
- [ ] No jarring or abrupt state changes
- [ ] Transitions respect accessibility preferences
- [ ] Consistent behavior across both buttons
- [ ] Build succeeds
- [ ] No TypeScript errors

---

## Feature #14: Explore Button Cursor Interaction
**Feature #**: 14
**Status**: Pending
**Dependencies**: None (but requires custom cursor feature flag to be enabled for full effect)
**Can Run In Parallel**: Yes
**Estimated Time**: 20-30 minutes

### Requirements:
- The "Explore" button in project cards (`BentoProjectCard`) must change cursor appearance appropriately on hover
- When custom cursor is enabled: Cursor should indicate interactivity (e.g., pointer state or visual feedback)
- When custom cursor is disabled: Standard browser pointer cursor should appear
- Cursor change should be immediate and clear
- Must work consistently across all project cards with "Explore" buttons

### Tasks:
1. **Review current Explore button implementation**
   - Check `components/bento-project-card.tsx` Explore button
   - Verify current cursor behavior
   - Check if custom cursor feature flag affects behavior

2. **Implement appropriate cursor feedback**
   - Add cursor style changes on hover for Explore button
   - Ensure compatibility with custom cursor feature flag
   - Add visual feedback that indicates button is interactive
   - Test with both cursor modes (custom enabled/disabled)

3. **Verify consistency**
   - Ensure all Explore buttons behave the same way
   - Test across different project cards
   - Verify accessibility (keyboard navigation still works)

**Acceptance Criteria**:
- [ ] Explore button shows appropriate cursor on hover
- [ ] Works correctly with custom cursor feature flag enabled
- [ ] Works correctly with custom cursor feature flag disabled
- [ ] Cursor change is immediate and clear
- [ ] Consistent behavior across all project cards
- [ ] Keyboard navigation still functional
- [ ] Build succeeds
- [ ] No TypeScript errors

---

## Feature #15: Improved Animation Trigger Timing
**Feature #**: 15
**Status**: Pending
**Dependencies**: None
**Can Run In Parallel**: Yes
**Estimated Time**: 45-60 minutes

### Requirements:
- Page components should trigger their animations when they are closer to the middle/center of the viewport, not just when entering the viewport
- Animation triggers should feel more intentional and less premature
- Components should be more visible (closer to center) before animating
- This applies to all scroll-triggered animations across the site (About section, Projects section, etc.)
- Animation timing should feel natural and not rushed

### Tasks:
1. **Review current animation trigger logic**
   - Check `hooks/use-scroll-animation.ts` implementation
   - Review `components/animated-section.tsx` usage
   - Identify current `amount` and `threshold` values
   - Document current trigger behavior

2. **Update animation trigger thresholds**
   - Modify `useInView` configuration to require elements be closer to viewport center
   - Adjust `amount` parameter to require more visibility before triggering
   - Consider using `margin` option to create a "trigger zone" closer to center
   - Test different threshold values for optimal feel

3. **Update components using scroll animations**
   - Review and update `components/about-section.tsx` if needed
   - Review and update `components/projects-section.tsx` if needed
   - Ensure all animated sections use the improved trigger logic
   - Test animation timing feels natural

4. **Create reusable animation trigger configuration**
   - Consider creating a shared configuration for consistent trigger behavior
   - Document the new trigger thresholds
   - Ensure configuration respects `prefers-reduced-motion`

**Acceptance Criteria**:
- [ ] Animations trigger when components are closer to viewport center
- [ ] Animations feel more intentional and less premature
- [ ] All scroll-triggered animations use improved timing
- [ ] Animation timing feels natural across all sections
- [ ] Configuration is reusable and consistent
- [ ] Respects accessibility preferences
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No performance regressions

---

**Last Updated**: [Date]
**Current Status**: Ready for agent execution

