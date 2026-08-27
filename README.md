# ScreenGuardian

**ScreenGuardian** is a parental control and screen-time management system designed to help parents manage their children's digital habits while encouraging healthier and more responsible screen usage.

The system combines real-time device monitoring and control with gamification, smart usage insights, tasks, rewards, and personalized recommendations.

## Features

### Parent App

* Manage multiple children and devices
* Set daily and weekly screen-time limits
* Lock or unlock a device or application remotely
* View remaining screen time
* View daily, weekly, and monthly usage reports
* Approve or reject screen-time extension requests
* Receive real-time notifications and alerts
* Track child device location
* Create tasks and rewards
* View activity history
* Receive smart usage insights and recommendations
* Access a dedicated parental chatbot

### Child App

* View remaining screen time and application limits
* Request additional screen time
* Receive warnings before screen time expires
* Complete tasks and earn virtual **FamilyCoins**
* Redeem coins for rewards created by the parent
* Track achievements and progress
* Use an evolving avatar and gamification system
* View personal screen-time reports
* Receive personalized screen-free activity suggestions
* Use an SOS button to notify the parent
* Access a child-friendly chatbot

## Smart Insights

ScreenGuardian analyzes screen-usage patterns and provides parents with smart reports and recommendations.

The system can identify patterns such as excessive usage, frequently used applications, and changes in usage behavior, and generate personalized insights using the **Gemini API**.

Children can also receive alternative activity suggestions based on their interests.

## Real-Time Communication

The system uses **Socket.IO** for real-time communication between the parent application, child application, and backend.

This enables immediate updates for actions such as:

* Device and application locking
* Screen-time limit changes
* Extension requests
* Task and reward updates
* Notifications

## Android Device Control

ScreenGuardian includes native Android functionality implemented with **Kotlin**, allowing the system to monitor application usage and enforce screen-time restrictions directly on the child's device.

The enforcement logic works at the device level and supports device-specific policies and restrictions.

## Technologies

### Mobile

* React Native
* Expo
* TypeScript
* Redux Toolkit
* Kotlin / Android Native

### Backend

* Node.js
* Express.js
* MongoDB
* Socket.IO

### Web

* React

### External Services

* Gemini API
* Push Notifications
* Location Services

## System Architecture

The system follows a client-server architecture consisting of:

* Parent mobile application
* Child mobile application
* Parent web interface
* Node.js backend
* MongoDB database
* Android native device-control layer
* External AI, notification, and location services

The architecture is modular, allowing major features such as reports, notifications, screen-time management, gamification, and AI-based recommendations to operate as separate components.

## Main Modules

* **Screen-Time Management** – limits, schedules, remaining time, and device/application locking
* **Reports & Statistics** – usage tracking and visual reports
* **Notifications** – real-time alerts and system events
* **Tasks & Rewards** – FamilyCoins, tasks, prizes, and achievements
* **Smart Recommendations** – Gemini-powered usage insights and personalized recommendations
* **Location & Safety** – location tracking and SOS functionality

## Project Structure

The project is divided into separate applications and services for the parent interface, child interface, and backend server.

Each component communicates with the backend through APIs and real-time Socket.IO events.

## Authors

Developed as a Computer Science Final Project at **Ruppin Academic Center**.
