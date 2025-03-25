# GLSL Library with Sidebar Navigation

The application now features a sidebar navigation that is present on all pages, including shader detail pages.

## Features Added

### Sidebar Navigation
- Present on all pages
- Replaces the navbar and back button
- Displays the app logo
- Quick access to Home and Library pages

### Shader Detail Page Enhancements
- Code and Info buttons moved to the sidebar
- Improved UI experience with toggle buttons
- Removed the back button since navigation is now handled by the sidebar

## How to Use

### Navigation
- Click on the Home icon to go to the homepage
- Click on the Library icon to browse all shaders

### In Shader View
- Click on the Code icon to toggle the code panel
- Click on the Info icon to toggle the shader information

## Implementation Details

- Uses Framer Motion for smooth animations
- React Icons for the icons
- Responsive design that works on all screen sizes
- Automatic shader detection still works as before

## Adding New Shaders

You can still use the create-shader script as before:

```bash
npm run create-shader myNewShader
```

The shader will automatically appear in the library and be accessible through the sidebar navigation.
