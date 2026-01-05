# Project Overview

This is my take to build a responsive, accessible website for the Duquesne Incline in Pittsburgh, aiming to showcase its rich history, visitor information, and attractions. This website was built for 67-250, the Information Systems Milieux course @ Carnegie Mellon University.

![Duquesne Incline](static/images/Duquesne-Incline-Hero-Photo.jpg)

## Pages

- **Home Page**: Overview of the Duquesne Incline with key visitor information and highlights
- **History Page**: Detailed historical timeline, photo gallery, and technical specifications
- **Visit Page**: Operating hours, fares, weather conditions, location details, and accessibility information
- **Contact Page**: Contact methods, location details, and a mailing list signup form
- **Gift Shop Page**: Featured items, product collections, and shop information

## Key Features

- **Responsive Design**: Fully responsive layout that works on devices of all sizes
- **Accessibility**: WCAG-compliant design with semantic HTML and proper ARIA attributes
- **Interactive Elements**:
  - Photo lightbox gallery on the history page
  - Interactive timeline with animation
  - Dynamic weather information
  - Smooth scrolling navigation
  - Sticky header for easy navigation
- **Location Information**: Maps and detailed directions for both upper and lower stations
- **Multimedia Content**: Image galleries, videos, and visual storytelling elements

## Technologies Used

- HTML5
- CSS3 (with custom properties and flexbox/grid layouts)
- JavaScript (ES6+)
- jQuery (for enhanced interactions)
- Font Awesome (for icons)

## File Structure

```bash
Duquesne Incline Project/
├── index.html              # Home page
├── static/                 # Static assets directory
│   ├── css/                # CSS stylesheets
│   │   ├── styles.css      # Global styles
│   │   ├── layout.css      # Layout components
│   │   ├── forms.css       # Form styles
│   │   ├── contact.css     # Contact page styles
│   │   ├── history.css     # History page styles
│   │   ├── visit.css       # Visit page styles
│   │   └── gift-shop.css   # Gift shop page styles
│   ├── js/                 # JavaScript files
│   │   ├── main.js         # Main JavaScript functionality
│   │   ├── gallery.js      # Gallery and lightbox functionality
│   │   ├── timeline.js     # Timeline animations
│   │   ├── maps.js         # Google Maps integration
│   │   ├── weather.js      # Weather information
│   │   ├── contact.js      # Contact form handling
│   │   ├── visit.js        # Visit page specific functionality
│   │   └── gift-shop.js    # Gift shop page functionality
│   └── images/             # Image assets
│       └── [various image files]
└── views/                  # HTML pages (except home page)
    ├── history.html        # History page
    ├── visit.html          # Visit page
    ├── contact.html        # Contact page
    └── gift-shop.html      # Gift shop page
```

## Setup and Development

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- For development: a code editor like VS Code, Sublime Text, or similar

### Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/duquesne-incline-project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd duquesne-incline-project
   ```

3. Open `index.html` in your browser, or use a local development server like Live Server for VS Code.

## Design Decisions

- **Color Palette**: The website uses burgundy and gold tones inspired by the historic Duquesne Incline cars
- **Typography**: Clear, readable fonts that enhance accessibility while maintaining historical character
- **Components**: Modular design approach with reusable components for consistent user experience
- **Imagery**: High-quality photographs of the incline from historical archives and modern perspectives

## Browser Compatibility

The website is tested and compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Accessibility

This website follows WCAG 2.1 AA standards, including:

- Proper heading structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Alt text for images
- ARIA attributes where necessary

## Credits

- Photography: Various historical archives and modern photographers (credited in image captions)
- Icons: Font Awesome
- Weather Data: OpenWeatherMap

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
