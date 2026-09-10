# EarthGPT - Talk to Planet Earth 🌍

An elegant, interactive 3D Earth visualization web application with AI-powered natural language queries about real-time Earth data including wildfires, earthquakes, and weather patterns.

## Features

### Core Visualization
- **Interactive 3D Globe** - Canvas-based Earth visualization with realistic continents, oceans, and atmospheric glow
- **Live Data Layers** - Real-time visualization of wildfires, earthquakes, and weather overlays
- **Smooth Animations** - Polished transitions and interactive effects throughout the interface

### AI Chat Interface
- **Natural Language Queries** - Ask questions about Earth events and get intelligent AI responses
- **Context-Aware Suggestions** - Smart query suggestions based on active data layers
- **Automatic Summarization** - AI-generated summaries of current Earth conditions
- **Typing Animation** - Character-by-character reveal of AI responses for engaging UX

### Advanced Features
- **Location Highlighting** - Map markers for geographic areas mentioned in AI responses
- **Layer Toggles** - Enable/disable wildfires, earthquakes, and weather visualization
- **Live Event Counts** - Real-time badge showing active events on each layer
- **Collapsible Side Panel** - Full-screen globe experience with optional chat interface
- **Dark Space Theme** - Elegant, immersive visual design with starfield background

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Framer Motion
- **Backend**: Express.js, tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **AI Integration**: Manus LLM API
- **Authentication**: Manus OAuth
- **Deployment**: GitHub Pages, GitHub Actions CI/CD

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- pnpm 10.x
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Rintu-chowdory/earthgpt.git
cd earthgpt

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and configuration
```

### Development

```bash
# Start the development server
pnpm dev

# Run type checking
pnpm check

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Required environment variables:

```
VITE_APP_ID=your_app_id
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your_jwt_secret
OAUTH_SERVER_URL=https://api.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_backend_key
```

## Project Structure

```
earthgpt/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── lib/           # Library integrations
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers.ts         # tRPC route definitions
│   ├── db.ts              # Database queries
│   ├── chat.ts            # Chat AI integration
│   ├── earth.ts           # Earth data APIs
│   └── _core/             # Core server infrastructure
├── drizzle/               # Database schema & migrations
├── .github/workflows/     # GitHub Actions CI/CD
└── package.json           # Dependencies and scripts
```

## API Integration

### NASA FIRMS API
Provides real-time wildfire data. Requires free API key registration at https://firms.modaps.eosdis.nasa.gov/api/

### USGS Earthquake API
Real-time earthquake data. No authentication required.

### Manus LLM API
Integrated for AI chat responses and data summarization.

## CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment:

1. **Test Job** - Runs on every push and pull request
   - Installs dependencies
   - Type checking with TypeScript
   - Runs vitest unit tests
   - Builds the project

2. **Deploy Job** - Runs on main branch pushes after tests pass
   - Builds production bundle
   - Deploys to GitHub Pages

### Setting Up Secrets

Add these secrets to your GitHub repository settings:

- `VITE_APP_ID`
- `VITE_OAUTH_PORTAL_URL`
- `VITE_FRONTEND_FORGE_API_URL`
- `VITE_FRONTEND_FORGE_API_KEY`
- `DATABASE_URL`
- `JWT_SECRET`
- `OAUTH_SERVER_URL`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`

## GitHub Pages Deployment

The project is automatically deployed to GitHub Pages on every push to main:

1. Build artifacts are generated in the `dist/` directory
2. GitHub Actions deploys to the `gh-pages` branch
3. Site is accessible at `https://rintu-chowdory.github.io/earthgpt/`

To use a custom domain:
1. Add your domain to the `CNAME` file in the gh-pages branch
2. Update the `cname` field in `.github/workflows/ci.yml`
3. Configure DNS settings with your domain provider

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## Performance Optimization

- **Code Splitting** - Lazy-loaded components for faster initial load
- **Image Optimization** - Compressed assets and responsive images
- **Caching** - Browser and server-side caching strategies
- **Database Indexing** - Optimized queries for real-time data

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - see LICENSE file for details

## Support & Feedback

For issues, feature requests, or feedback:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## Acknowledgments

- NASA FIRMS for wildfire data
- USGS for earthquake data
- Manus for LLM and OAuth infrastructure
- React and Tailwind CSS communities

---

**Built with ❤️ for Earth data enthusiasts**
