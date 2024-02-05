# Senior Design ResLock Mail Management Application
#### Team Members: Roberto Garcia, Jonathan Her, Miriam John, Claudia Poptile, Chloe Wallach
## Project Description
ResLock is a web and mobile application created to help resident association at MSOE handle the growing number of packages sent to their buildings and notify their residents by automating the process
## Features
-  Optical Character Recognition for scanning of mail
-  Automated email notifications to resident when mail is scanned in
-  User authentication through JWT
-  View of all mail that hasn't been collected and where they were scanned in
-  Ability to import building reseidential information through CSV files
-  Ability to edit resident information once they are scanned in 
## Technology Used
React, React Native, HTML, CSS, JavaScript, Typescript, ExpressJS, NodeJS, MySQL, Azure Cloud, Azure DevOps, Git, Agile/Scrum
## Setup
### Backend
- Follow the steps listed in the backend folder README to setup the database with example data
- run `npm install`
- Create a .env file following the .env.sample file (Can exclude the microsoft azure keys, but those endpoints will not be funtional, Optical Character Recognition)
- run `npm start`
- Server should be up and running
### Frontend Mobile
-  Download and install ExpoGo on your mobile device and computer
-  Ensure the backend server is running by following the backend steps
-  run `yarn install` in the dev environment
-  run `expo start` and scan the generated QR code on your mobile device to bring up the application for viewing
### Frontend Web
- Ensure the backend server is running by following the backend steps
- run `npm install`
- run `npm start`
# NOTE
This project was transferred from the dev branches of our Azure DevOps repositories for code viewing purposes.
