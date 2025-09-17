
# 🍳 FlavourCraft:AI Recipe Generator

The **AI Recipe Generator** is a web-based application that uses artificial intelligence to identify ingredients from user-provided images and recommend suitable recipe options accordingly. It personalizes and automates the cooking experience, enabling users to get curated recipes based on what they already have in their kitchen.

This project is also developed as part of our **DevOps course submission**, ensuring it follows best practices with Dockerized deployment and an integrated MLOps pipeline for efficient data and model management.

---

## 👥 Team Members

- [Aditya Gangwar](https://github.com/Adityagangwar2674)
- [Noman Mirza](https://github.com/Nomanbaig7342)
- [Parth Abhang](https://github.com/Parth0124)
- [Arya Sali](https://github.com/Arya2422)

---

## 🚀 Key Features

* **Ingredient Detection**: Users can upload or capture images of ingredients through the browser interface.
* **Ingredient Editing**: Detected ingredients can be reviewed, edited, deleted, or manually added before confirmation.
* **AI-Powered Recipes**: The system generates multiple recipe suggestions tailored to the confirmed ingredients.
* **Persistent Chat History**: Each user session, including uploaded images, ingredient confirmations, and generated recipes, is stored for future reference.
* **DevOps Ready**: Fully containerized setup using Docker and Docker Compose for smooth deployment.
* **MLOps Integration**: MLflow is used for model tracking, and DVC is employed for dataset versioning and reproducibility.

---

## 🛠️ Tech Stack

* **Frontend**: React.js with Progressive Web App (PWA) capabilities in Typescript
* **Backend**: FastAPI with Python
* **Database**: MongoDB (with GridFS for image storage)
* **AI/ML**: TensorFlow\.js or OpenAI API/Any good open source model(to be decided upon) for ingredient detection and recipe generation
* **DevOps Tools**: Docker, Docker Compose
* **MLOps Tools**: MLflow for model tracking, DVC for data version control, Dagshub for managing multimodal AI

---

## 📂 Project Structure (Conceptual - to be decided upon depending on the backend functionalities.)
The given project structure is just conceptual and is subjected to change based upon any further discussions among the team members
* **Frontend**: User-facing React.js application with PWA features for seamless access.
* **Backend**: Express.js server handling requests, AI/ML model inference, and database interactions.
* **Database**: MongoDB storing user data, recipes, and images (via GridFS).
* **MLOps Components**: Separate workflows for dataset management (DVC) and model lifecycle tracking (MLflow).
* **Containerization**: Dockerized services to ensure consistency across environments.

---

## 📊 MLOps Workflow

1. **Data Versioning**: Ingredient images and related datasets managed using DVC.
2. **Model Training & Tracking**: Models trained for ingredient recognition are tracked and versioned with MLflow.
3. **Reproducibility**: Every experiment, dataset version, and model checkpoint is stored to ensure consistent results.
4. **Deployment**: Containerized models and services deployed seamlessly through Docker.

---

## 🎯 Future Enhancements

* Integration with external recipe APIs for broader recipe suggestions.
* Personalized recipe recommendations based on dietary preferences, allergies, and user history.
* A mobile-native version of the application for enhanced accessibility.
* Voice based recepie generator and agent

---
