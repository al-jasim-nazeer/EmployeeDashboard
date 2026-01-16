# Employee Dashboard

This project consists of an ASP.NET Core backend and a Next.js frontend.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/al-jasim-nazeer/EmployeeDashboard.git
cd EmployeeDashboard
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd employee-admin-portal-ui
```

Install dependencies:

```bash
npm install
```

**Configuration:**

Create a `.env.local` file in the `employee-admin-portal-ui` directory (if it doesn't already exist) and add the following line to configure the backend API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5189/api
```

> Note: Update the port number (`5189`) if your backend server runs on a different port.

Run the development server:

```bash
npm run dev
```

### 3. Backend Setup

1. Open the `EmployeeAdminPortal.sln` solution file in Visual Studio or your preferred C# IDE.
2. Restore NuGet packages.
3. Update the database connection string in `appsettings.json` if necessary.
4. Run the application (this will typically start the API at a URL like `http://localhost:5189`).

## Technologies

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** ASP.NET Core Web API, Entity Framework Core, SQL Server
