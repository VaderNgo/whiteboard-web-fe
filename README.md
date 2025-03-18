# 🖌️ Whiteboard Web - Real-time Collaborative Whiteboard

![GitHub Repo stars](https://img.shields.io/github/stars/locngoduc/whiteboard-web-fe?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/locngoduc/whiteboard-web-fe?style=flat-square)
![GitHub license](https://img.shields.io/github/license/locngoduc/whiteboard-web-fe?style=flat-square)

![image](https://github.com/user-attachments/assets/dce4ce20-b1f9-4a06-bbd8-58218c4c6142)


## 🚀 Introduction
**Whiteboard Web** is a real-time collaborative whiteboard application that allows users to draw, write, and collaborate seamlessly in groups. Built with modern web technologies, this application ensures a smooth and interactive experience.

## 🛠️ Technologies Used
- **Frontend**: [Next.js](https://nextjs.org/), [React-Konva](https://konvajs.org/docs/react/), [Konva](https://konvajs.org/)
- **Backend**: [NestJS](https://nestjs.com/), [Redis](https://redis.io/) [PostgreSQL](https://www.postgresql.org) 
- **Deployment & Orchestration**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)

## ✨ Features
- 🔑 **User Authentication**: Register and log in to access your account.
- 👥 **Group Management**:
  - Create and manage groups.
  - Invite and remove members.
  - Update group details.
- 🎨 **Whiteboard Collaboration**:
  - Create, edit, and delete whiteboards.
  - Real-time updates and synchronization.
- ⚡ **High Performance**:
  - Optimized real-time interactions with Redis caching.
  - Scalable backend with NestJS and Docker.

## 📦 Installation & Setup
```sh
# Clone the repository
git clone https://github.com/locngoduc/whiteboard-web-fe.git
cd whiteboard-web-fe

# Install dependencies
yarn install  # or npm install

# Run the project locally
yarn dev  # or npm run dev
