# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arc Boost is a browser extension/userscript that enhances JIRA functionality. The main feature is a "Sprint Jumper" that adds a floating button to JIRA pages, allowing users to quickly navigate to the current week's sprint.

## Project Structure

```
arc-boost/
├── jira-sprint-jumper/
│   ├── arc-boost-sprint-jumper.js    # Main userscript logic
│   └── arc-boost-sprint-jumper.css   # Styling for the sprint jumper button
```

## Architecture

### Sprint Jumper Component
- **Main Script**: `jira-sprint-jumper/arc-boost-sprint-jumper.js`
  - Self-executing function that creates a floating "Jump to Current Sprint" button
  - Calculates current Monday date to find corresponding "Web Sprint YYYY-MM-DD" sections
  - Uses DOM manipulation to inject button and handle sprint navigation
  - Includes error handling and logging with `[ARC BOOST]` prefix

- **Styling**: `jira-sprint-jumper/arc-boost-sprint-jumper.css`
  - CSS custom properties for theming (blue color scheme)
  - Fixed positioning for floating button (bottom-right corner)
  - Flash animation effects for sprint highlighting
  - Responsive design for mobile devices
  - Uses `!important` declarations to override JIRA's styles

### Key Functionality
- **Date Calculation**: `getMondayString()` - Calculates current week's Monday in YYYY-MM-DD format
- **Sprint Detection**: Searches for `<h2>` elements with text "Web Sprint YYYY-MM-DD"
- **Navigation**: Smooth scrolling with visual flash effect when sprint is found
- **Button Injection**: Multiple insertion strategies with retry logic for reliability

## Development Notes

### Code Patterns
- Uses IIFE (Immediately Invoked Function Expression) pattern for encapsulation
- Configuration object (`CONFIG`) for centralized settings
- Consistent logging with prefixed messages
- Event-driven initialization with multiple DOM ready strategies

### Styling Approach
- CSS custom properties for maintainable theming
- Defensive styling with `!important` to ensure visibility in JIRA
- Modern CSS features (flexbox, gradients, backdrop-filter)
- Accessibility considerations (focus states, user-select)

### Browser Compatibility
- Uses modern JavaScript features (const, arrow functions, template literals)
- DOM APIs that work in modern browsers
- CSS features supported in current browsers

## No Build System
This project doesn't use a build system, package manager, or testing framework. Files are used directly as userscripts or browser extension content.