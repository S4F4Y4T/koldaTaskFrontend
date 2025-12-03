# KoldaTask Frontend

A modern task management application frontend built with Vue 3 and Vite.

## Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/S4F4Y4T/koldaTaskFrontend.git
cd koldaTaskFrontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

Open `.env` and update the `VITE_API_BASE_URL` with your backend API URL if different from the default:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 4. Run Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Build for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/views`: Page components (Login, Dashboard, Projects, Tasks, Users, Roles)
- `src/components`: Reusable UI components
- `src/services`: API service modules
- `src/stores`: Pinia state management stores
- `src/router`: Vue Router configuration
- `src/utils`: Utility functions (validation, formatting)
