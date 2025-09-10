# PennyTrail

A CRUD app that keeps track of all your monthly expenses, bills and random purchases

[Live website ](https://penny-trail-app.vercel.app)

## Features

- Users can add an expense (date, expense name, payment method and cost) to a data table
- Users can update the expense with an edit button
- Users can delete the expense with a delete button
- The total expense costs for all the expense entries are calculated and appear above the data table

## Project Steps
- Created a project with ```npm create vite@latest , npm install, npm run dev```
- Installed dependencies ```npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb, npm install sass --save-dev``` and various Material UI packages 
- Made ```.env.local``` file and added the security credentials (Access key ID & Secret access key).
- Built a helper module (```dynamo.js```) in Utils folder to hold the AWS code
- Added functions containing useState, useEffect, CRUD and connected them to the UI with forms, and a data table in ```App.jsx```
- Styled with SCSS and Material UI
- installed testing dependencies ```npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom``` and ```npm install aws-sdk-client-mock```
- added a test script in ```package.json```
- created testing file ```dynamo.vitest.test.js``` in Utils folder and added tests for createItem, listAllItems and deleteItem
- ran the test with npm tests
- Ran npm run build

## Technologies Used 
- React
- DynamoDB
- SCSS
- Material UI

