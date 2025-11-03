# Octatrack Project Manager

This is a full-stack project management tool designed to help music producers organize and maintain structured templates for hardware sequencing projects.

## Core Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | **Laravel 12+** (PHP) | 
| **Authentication** | **Fortify & Session Auth** |
| **API** | **API Resources** & **Eager Loading** |
| **Database** | **MySQL** |
| **Frontend** | **React / TypeScript / Inertia.js** |
| **Forms** | **TanStack Query, Zod, React Hook Form** |

##  Local Setup

1.  **Clone and Start Sail:**
    ```bash
    git clone [your-repo-url] octatrack-manager
    cd octatrack-manager
    ./vendor/bin/sail up -d
    ```
2.  **Install Dependencies & Build Assets:**
    ```bash
    sail composer install
    npm install
    npm run dev
    ```
3.  **Database Setup:**
    ```bash
    sail artisan migrate --seed
    ```
4.  **Access App:**
    The application is available at `http://localhost`.
    
    (Test User: `check@check.com` / `qwer1234`).
