\# Leave \& Productivity Analyzer



A full-stack web application that analyzes employee attendance, leave usage, and productivity based on uploaded Excel attendance sheets.



This project was developed as part of the \*\*NMIMS Intern Technical Assignment – Kenmark ITan Solutions\*\*.



---



\##  Features



\- Upload Excel (.xlsx) attendance files

\- Automatic calculation of:

&nbsp; - Worked hours

&nbsp; - Expected working hours

&nbsp; - Leave usage

&nbsp; - Productivity percentage

\- Business rules implemented:

&nbsp; - Monday–Friday: 8.5 working hours (10:00 AM – 6:30 PM)

&nbsp; - Saturday: 4 working hours (10:00 AM – 2:00 PM)

&nbsp; - Sunday: Off

&nbsp; - 2 leaves allowed per month

\- Dashboard with:

&nbsp; - Monthly summary

&nbsp; - Daily attendance breakdown

\- Dashboard appears \*\*only after a successful file upload\*\*



---



\##  Tech Stack



\### Frontend

\- React.js (Vite)

\- JavaScript (JSX)

\- Fetch API



\### Backend

\- Node.js

\- Express.js

\- MySQL

\- Multer (file upload)

\- Excel parsing (xlsx)



\### Deployment

\- Frontend: \*\*Vercel\*\*

\- Backend: \*\*Local (Node.js + MySQL)\*\*



---



\##  Live Demo



\*\*Frontend (Vercel):\*\*  

&nbsp;https://leaveproductivityanalyzer.vercel.app/



>  Note:  

> The backend uses MySQL and is intended to run locally.  

> To test full functionality, please run the backend server locally while using the live frontend.



---



\##  Sample Excel Format



| Employee Name | Date       | In-Time | Out-Time |

|--------------|------------|---------|----------|

| John Doe     | 2024-01-01 | 10:00   | 18:30    |

| John Doe     | 2024-01-02 | 10:15   | 18:45    |

| John Doe     | 2024-01-03 |         |          |



Missing in-time/out-time on working days is treated as a leave.



---



\##  Local Setup Instructions



\###  Clone the Repository



```bash

git clone https://github.com/<your-username>/leave-productivity-analyzer.git

cd leave-productivity-analyzer


\*\*Backend Setup :

cd backend

npm install

node server.js //start backend server

backend runs on "http://localhost:5000"



\*\*Frontend Setup :

cd frontend/frontend

npm install

npm run dev

frontend runs on "http://localhost:5173

\*\*Environment Variables :
VITE\_BACKEND\_URL=http://localhost:5000



