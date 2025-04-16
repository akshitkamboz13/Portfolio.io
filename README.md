# Portfolio.io - Personal Portfolio Website

![Portfolio Screenshot](./src/assets/portfolio-screenshot.png)

## 📋 Overview

Portfolio.io is a modern, responsive personal portfolio website built with React and Tailwind CSS. It features a premium aesthetic with animated backgrounds, interactive UI elements, and mobile-responsive design.

## ✨ Features

- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Interactive UI**: Features animated components, parallax effects, and 3D card interactions
- **Premium Aesthetics**: Glass morphism effects, gradient backgrounds, and smooth animations
- **Performance Optimized**: Lazy-loaded components and optimized assets
- **Resume Access**: Direct link to download professional resume
- **Comprehensive Sections**:
  - About Me
  - Skills Showcase
  - Education Timeline
  - Certifications Gallery
  - Project Portfolio
  - Contact Form

## 🛠️ Technologies Used

- **Frontend Framework**: React.js
- **Styling**: Tailwind CSS
- **Animations**: Custom CSS animations and transitions
- **Icons**: React Icons
- **Routing**: React Router
- **Form Handling**: FormSubmit
- **Maps Integration**: Google Maps API
- **Physics Engine**: Matter.js (for animated backgrounds)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/akshitkamboz13/Portfolio.io.git
cd Portfolio.io
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Build for production
```bash
npm run build
# or
yarn build
```

## 📱 Mobile Optimization

The portfolio is fully optimized for mobile devices:
- Responsive layouts that adapt to different screen sizes
- Simplified navigation on smaller screens
- Map view hidden on mobile to improve performance
- Limited content display on homepage with "View All" options

## 🔧 Customization

### Changing Personal Information

Edit the following files to customize your information:
- `src/components/About.jsx` - Personal information and social links
- `src/components/Contact.jsx` - Contact information and form settings
- `src/assets/Projects.json` - Project details
- `src/components/Skills.jsx` - Skills data
- `src/components/Educations.jsx` - Education history

### Styling

The project uses Tailwind CSS which can be customized via:
- `tailwind.config.js` - For theme customization
- Custom CSS classes in component files

## 🌐 Deployment

This project can be deployed to various platforms:
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

## 📂 Project Structure

```
portfolio.io/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── Projects.json
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Educations.jsx
│   │   ├── FrontMain.jsx
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   └── helperComponents/
│   │       ├── AnimatedBackground.jsx
│   │       ├── Map.jsx
│   │       ├── ParallaxImage.jsx
│   │       └── SectionObserver.jsx
│   ├── App.js
│   └── index.js
├── package.json
└── tailwind.config.js
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/akshitkamboz13/Portfolio.io/issues).

## 👨‍💻 Author

**Akshit Kamboj**
- LinkedIn: [akshitkamboz13](https://www.linkedin.com/in/akshitkamboz13)
- GitHub: [akshitkamboz13](https://github.com/akshitkamboz13)
- Twitter: [siakshit](https://twitter.com/siakshit)

---

Made with ❤️ by Akshit Kamboj