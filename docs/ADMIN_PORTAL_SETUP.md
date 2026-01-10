# Admin Portal Setup Guide

## 1. Prerequisites
- **MongoDB** must be running.
- **Node.js** must be installed.

## 2. Start MongoDB (If not running)

Since `mongod` is not in the system path, use this command to start it using the local data directory:

```powershell
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\Users\jashw\Desktop\bill\project v1.0\data\db"
```

## 3. Start Backend & Seed Admin User

1.  Open a terminal in `project v1.0/backend`.
2.  Install dependencies (if not done):
    ```bash
    npm install
    ```
3.  **Create the initial Admin User** (Only needed once):
    ```bash
    npm run seed-admin
    ```
    *This will create a user with username: `admin` and password: `adminpassword123`.*
4.  **Start the Backend Server**:
    ```bash
    npm start
    ```

## 4. Start Admin Web Portal

1.  Open a new terminal in `project v1.0/admin-web`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Start the Web App**:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173) or [http://localhost:5174](http://localhost:5174)).

## 5. Usage

1.  **Login**: Use the credentials `admin` / `adminpassword123`.
2.  **Dashboard**: You will see a list of Billboard Owners.
3.  **Create Owner**: Click "Add New Owner" to create a username/password for a Billboard Owner.
    - These credentials can then be used in the Mobile App to login as a Billboard Owner.

## Troubleshooting

- **"Connection Refused"**: Ensure MongoDB is running (Step 2) and the backend server is started (Step 3).
- **"Access Denied"**: Ensure you are using the correct admin credentials.
