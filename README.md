# Rote Mate - Flashcard and Chat room App

Link: https://rote-mate.herokuapp.com

### **Technology used:**

- Node
- Express
- MongoDB
- React
- SocketIO
- Bootstrap

### **Description**

A full stack web application with CRUD functionality for flashcards and flashcard sets with features such as test/play mode, favourites, timers, personal history.
Chatroom feature enables a social aspect to flashcard use, with an embedded youtube video player.

This project features:

- Responsive single page application using React and Redux for front end store.
- Fully functional REST API and CRUD operations for flashcards using MongoDB as the database.
- File image upload and cloud image storage using Cloudinary.
- SocketIO enables real time chatting and manipulation of the video player.
- Functional authorisation and authentication using Auth0 (Third Party provider), including its Management API for user profile customisation.
- Security against cross site scripting, SQL injection.

### **Learning and reflection**

This application continued to build on my learning and development in building full stack web applications. This project further consolidated
my skills in building responsive single page applications using React, Bootstrap and Node/Express. I used new technologies and frameworks (MongoDB, Bootstrap, SocketIO) to challenge myself in both
back-end and front-end knowledge and skills.

This project was challenging in that it combined a CRUD application (flashcards) with a chatroom application. In particular, integrating react and Redux states with real time sockets was a difficult but practically rewarding challenge.

#### _Planning and organisation_

- This was my second full stack application designed from scratch. As before, I believe that planning the the functionality first allows iterative planning of the database schemas. For example,
I wanted each flashcard to have a "notes" section, thus this was incorporated into the schema at the start.

#### _Back-end_

- I continued to use Node/Express due to familiarity. 

- I decided to use Mongo-DB instead of a SQL database because of inreased flexibility, and being able to use Mongoose to interact with the database in javascript.

- In retrospect, my schema design could have been better - I had many nested documents, often linking to another MongoDB schema. This led to editing and cascading documents being challenging.

#### _Authentication and authorisation_

- I used 0Auth for third party authentication and authorisation. This improved ease of setting up authentication, but added challenges in the form of integrating a third party API with my local mongo "users" schema.

#### _Front-end_

- This project consolidated my progress with single page React and Redux applications. Further challenges included setting up Redux store changes/updates with socketIO - this required setting up a middleware for my Redux store,

- I used bootstrap as my front-end framework. I found it simplified initialising a responsive front-end design, but lacked the fine-tuning of styled components and writing CSS.

#### _Security_

- I continued to implement basic security measures against cross site scripting, injection.
