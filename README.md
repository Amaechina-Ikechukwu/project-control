# Project Control API

**Project Control** is an API designed for developers to integrate into their contracted work. It provides a centralized way to track project statuses and payments. If a project’s `paidStatus` is `false`, developers can write code to handle restricted access or display notifications accordingly.

## 🚀 Features

- **Project Management**: Create, retrieve, and manage projects.
- **Paid Status Tracking**: Check and update project payment status.
- **Logging & Security**: Integrated with Winston for logging and security practices like rate limiting and Helmet.

## 📦 Installation

### Prerequisites

- **Bun** (JavaScript runtime)
- **Podman** (for containerization)
- **Google Cloud Artifact Registry** (for deployment)
- **Firebase Admin SDK** (for database operations)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/project-control.git
   cd project-control
   ```
