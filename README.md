# Octatrack Project Manager

This is a full-stack project management tool designed to help music producers organize and maintain structured templates for hardware sequencing projects.

## Deployment
Network, App cluster - Laravel Cloud\
Database - Railway

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | **Laravel** | 
| **Frontend** | **React, TypeScript, Inertia.js, TanStack Query** |
| **Forms** | **Zod, React Hook Form** |
| **Database** | **MySQL** |
| **Environment** | **Docker(Sail)** |

## Local Setup

1.  **Clone and Start Sail:**
    ```bash
    git clone git@github.com:vybukhivka/octatrack-project-manager.git
    cd octatrack-project-manager
    ./vendor/bin/sail up -d
    ```
2.  **Install Dependencies & Build Assets:**
    ```bash
    ./vendor/bin/sail composer install
    ./vendor/bin/sail npm install
    ./vendor/bin/sail composer run dev
    ```
3.  **Database Setup:**
    ```bash
    ./vendor/bin/sail artisan migrate --seed
    ```
4.  **Access App:**
    The application is available at `http://localhost`.
    
    (Test User: `check@check.com` / `qwer1234`).
