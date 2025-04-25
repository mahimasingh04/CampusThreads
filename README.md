 CampusThreads - A Reddit-Inspired University Community Forum

## Overview
CampusThreads is a community forum web application designed specifically for university and college students and professors. Inspired by Reddit, it creates a connected ecosystem where academic communities can interact, share knowledge, and collaborate.

## Key Features

### Community Structure
- **childThreads**: University-specific communities (e.g., Rungta,Shankara ,  BITS Pilani, KIIT)
- **Tags**: Organization-specific categories within each childThread (e.g., clubs, departments , Events )
- **Moderation System**: Senior members and moderators manage communities

### User Functionalities
- Join any university community
- Create posts according to community rules (with karma point system)
- Upvote/downvote and comment on posts
- Request new tags through moderator-mediated polls
- Role-based permissions (normal users, moderators)

### Post Features
- Tag-specific posting within communities
- Public/private posts (with access codes)
- Special hackathon post type with:
  - Team formation interface
  - Real-time member tracking
  - Location and tech stack specifications
  - Gender-balanced team requests

### Advanced Features
- **Real-time Notifications & Chat** using WebSockets
- **AI-Powered Team Formation**:
  - Smart suggestions for hackathon teams
  - Profile matching based on skills and requirements
- Private communities/tags for exclusive college discussions

## Technology Stack

### Frontend
- React.js
- Recoil (for state management)
- Web Sockets (for real-time features)
- TailwindCSS and shadcn(for styling)

### Backend
- Node.js with Express
- Prisma ORM (for database interactions)
- WebSockets (for real-time notifications and chat)

### AI Components
- Natural Language Processing (for content analysis)
- Recommendation Algorithms (for team formation)
- Machine Learning Models (for smart suggestions)

### Database
- PostgreSQL (primary database)
- Redis (for caching and real-time features)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- Redis server (for real-time features)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mahimasingh04/CampusThreads.git
   ```
2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend1 && npm install
   cd backend && npm install
   ```
3. Set up environment variables (create `.env` files in both client and server directories)
4. Run database migrations with Prisma:
   ```bash
   cd server && npx prisma migrate dev
   ```
5. Start the development servers:
   ```bash
   # In one terminal (for backend)
   cd server && npm run dev
   
   # In another terminal (for frontend)
   cd client && npm run dev
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please contact:
- Mahima Singh - mahimasingh1828@gmail.com
- Project Link: [https://github.com/mahimasingh04/CampusThreads](https://github.com/mahimasingh04/CampusThreads)

## Acknowledgments
- Inspired by Reddit's community model
