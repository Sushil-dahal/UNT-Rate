
# 🎓 UNT Rater

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<p align="center">
  <strong>A modern, professional professor rating platform for the University of North Texas</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#%EF%B8%8F-version-history">Version History</a> •
  <a href="#-getting-started">Installation</a> •
  <a href="#-authentication">Authentication</a> •
  <a href="#%EF%B8%8F-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

  

## 📖 About

  

UNT Rater is a sleek, student-focused web application that allows University of North Texas students to browse, rate, and review professors across all departments. Built with modern web technologies and a clean, professional design aesthetic, it offers an intuitive platform that enables students to make informed decisions about their courses and professors.

  
  
  ---

  

## 🌟 Features

  

  

- 🔍 **Professor Search**: Search professors by name, department, or course

-  **Anonymous Reviews**: Rate and review professors while maintaining anonymity

- ⭐ **Professor Ratings**: Rate and review professors based on teaching quality

  

- 📚 **Department Browsing**: Explore professors by department

  

- ➕ **Add Professors**: Contribute to the database by adding new professors

  

- 👤 **User Profiles**: Personalized profiles with saved professors and ratings

  

- 🔐 **Secure Authentication**: UNT student email verification

  

- 📱 **Responsive Design**: Works on all devices

  

- 🎨 **Modern UI**: Clean, professional interface with intuitive navigation

  
---
  

## ⚙️ Tech Stack

  
  

### Frontend Framework

-  **React 18.3.1** - Modern React with hooks and concurrent features

-  **TypeScript** - Type-safe development

-  **Vite 6.3.5** - Lightning-fast build tool with HMR

  

### UI & Styling

-  **Tailwind CSS** - Utility-first CSS framework

-  **Radix UI** - Accessible, unstyled UI primitives

-  **shadcn/ui** - Beautiful, reusable components

-  **Lucide React** - Beautiful & consistent icon library

  

### Routing & Navigation

-  **React Router DOM** - Declarative routing for React

  

### Form Handling

-  **React Hook Form** - Performant, flexible forms

  

### Development Tools

-  **SWC** - Fast TypeScript/JavaScript compiler

-  **CSS Variables** - Dynamic theming support

  
---
  

## 📸 Screenshots

  <img width="488" height="350" alt="Screenshot 2025-10-08 at 2 26 50 AM" src="https://github.com/user-attachments/assets/4b4ec6dd-29f1-4bc4-9a92-eda67571976b" />
  <img width="488" height="350" alt="Screenshot 2025-10-08 at 2 29 08 AM" src="https://github.com/user-attachments/assets/2559b1c6-583f-4e8c-8d65-cbe922f3ce91" />
  
  <img width="488" height="350" alt="Screenshot 2025-10-08 at 2 31 09 AM" src="https://github.com/user-attachments/assets/dd1458a5-b9a2-4e9e-ab42-2589876ac0e8" />
  <img width="488" height="350" alt="Screenshot 2025-10-08 at 2 31 56 AM" src="https://github.com/user-attachments/assets/c013b70f-7d56-438c-8732-c06983cceb3c" />

---

## 🛠️ Version History

The development of UNT Rater was structured across three major, incremental releases. Click the **Project Link** to explore the live, deployed environment for that specific milestone.

| Version | Key Focus | **Status** | Project Link |
| :--- | :--- | :--- | :--- |
| **1.0** | **Frontend Prototype** | Complete | [View Project](https://amazing-cannoli-f2e037.netlify.app) |
| **2.0** | **Core Functionality** | Complete | [View Project](https://adorable-biscochitos-f0ce0d.netlify.app/) |
| **3.0** | **Final Release** | **IN PROGRESS** 🚧 | [View Project]() **&lt;-- Final URL Coming Soon** |

---

### 🔴 Version 1.0: Frontend Prototype

**Goal:** Establish the **complete frontend application UI/UX** using modern React and TypeScript, focusing on responsive design and user experience.

| Feature Category | Implementation Details |
| :--- | :--- |
| **Frameworks** | Built with **React** and **TypeScript** for a robust, type-safe frontend. |
| **Design System** | Utilizes **Tailwind CSS** for styling and **shadcn/ui** for consistent, accessible components. |
| **Initial State** | Custom authentication state management using **React Context API** and **localStorage** (mocked). |
| **Coverage** | Includes all core application views: Home, Auth pages, Professor Search, Department Filtering, and Profile management. |

This version represents a fully navigable prototype with all UI elements and user interactions working with mock data before any backend integration.

---

### 🟡 Version 2.0: Core Functionality (Backend Integration)

**Goal:** Complete the **full-stack application architecture** by integrating Supabase as the backend-as-a-service and implementing persistent, real database functionality.

| Feature Category | Implementation Details |
| :--- | :--- |
| **Backend Platform** | **Supabase Integration** providing PostgreSQL, secure authentication, and real-time features. |
| **Database Schema** | Created core tables: `Professors`, `Professor Ratings`, and `Saved Professors` with necessary relations. |
| **Security** | Implemented **Row Level Security (RLS)** policies for data protection and enforced **UNT email validation** (`@my.unt.edu`). |
| **API/Data** | Enabled **real-time CRUD operations** for professors, and established the foundation for the rating system and user-specific data management. |

This version transforms the prototype into a fully functional application with persistent storage, secure user authentication, and automatic data synchronization.

---

### 🟢 Version 3.0: Final Release & Refinement (IN PROGRESS 🚧)

**Goal:** Deliver a **professional, production-ready platform**. This stage finalizes the core features, adds real-time community interaction, and provides a polished user experience.



**This version is currently under active development.**

 ---

 

## 🚀 Getting Started

  

  

### Prerequisites

  

  

- [Node.js](https://nodejs.org/) (v16 or higher)

  

- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

  

  

### Installation

  

  

1. Clone the repository:

```bash

  

git  clone  https://github.com/your-username/UNT-Rate.git

  

cd  UNT-Rate

  

```

  

  

2. Install dependencies:

```bash

  

npm  install

  

```

  

  

### Development

  

  

To start the development server:

  

  

```bash

  

npm  run  dev

  

```

  

  

The application will be available at `http://localhost:3000`

  

  

### Building for Production

  

  

To create a production build:

  

  

```bash

  

npm  run  build

  

```

  

  

The build output will be in the `build` directory.

  
  
---  

## 🔐 Authentication

  

  

The application uses a custom authentication system with React Context API:

  

  

- Only UNT student emails (@my.unt.edu) are allowed

  

- User data (only Email) is stored in Database

  

- Session management with login/logout functionality

  

- Protected routes for authenticated users only

  
---
  

## ☁️ Deployment

  

  
  

This project is optimized for deployment on:

-  **Vercel** (Recommended)

-  **Netlify** (Recommended)

-  **GitHub Pages**

- Any static hosting service

  

  

To deploy:

  

  

1. Build the application:

```bash

  

npm  run  build

  

```

  

  

2. Deploy the `build` directory to your preferred hosting service.

  

  ---

## 🤝 Contributing

  

  

Contributions are welcome! Please follow these steps:

  

  

1. Fork the repository

2. Create a new branch: `git checkout -b feature-name`

3. Make your changes and commit them: `git commit -m 'Add some feature'`

4. Push to the branch: `git push origin feature-name`

5. Submit a pull request

  
---
  

## 📄 License

  

  

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Sushil-dahal/UNT-Rate?tab=MIT-1-ov-file) file for details.

 --- 

## 📞 Support

  

If you have any questions or need help with the project:

  

- 📧 **Email**: dahalsushil987@gmail.com

- 🐛 **Issues**: [GitHub Issues](https://github.com/Sushil-dahal/UNT-Rate/issues)

- 💬 **Discussions**: [GitHub Discussions](https://github.com/Sushil-dahal/UNT-Rate/discussions)

  

---

  

<p align="center">
  <strong>Built by Quadra Tech</strong><br>
  For the UNT student community
</p>
  

  

