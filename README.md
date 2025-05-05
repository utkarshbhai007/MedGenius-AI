# MedGenius AI Platform

A React-based medical AI platform providing features like patient analysis, disease prediction, and drug recommendations.

## Features

- 🔒 Secure authentication system with protected routes
- 👤 Patient analysis with genetic profiles
- 🔬 Disease prediction based on patient data
- 💊 AI-powered drug recommendations
- 🧬 Drug discovery with molecular analysis
- 📊 Side effects analysis
- 📱 Responsive design optimized for mobile and desktop
- ℹ️ Interactive "Did You Know" medical facts widget
- 🔐 Protected documentation and resources

## Recent Updates

### UI/UX Improvements
- Enhanced login page with optimized layout and larger logo
- Improved navigation with conditional navbar and footer visibility
- Added mobile-friendly home navigation in footer
- Streamlined user interface with icon-only display in navbar
- Implemented protected routes for documentation and resources

### New Components
- Added DidYouKnow component with rotating medical facts
- Created Dashboard with activity summary and quick actions
- Implemented Settings and Profile pages
- Enhanced Documentation page with improved header

### Security Enhancements
- Protected routes implementation for authenticated users
- Secured access to documentation, API reference, and resources
- Conditional rendering of navigation elements based on auth status

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui Components
- React Router DOM
- Recharts for data visualization

## Prerequisites

- Node.js (v18 or later)
- npm or yarn

## Installation

```bash
# Clone this repository
git clone <repository-url>

# Navigate to project directory
cd medgenius-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

## API Keys Setup

This application uses multiple APIs for comprehensive medical data:

1. **OpenAI API** - For medical analysis and recommendations
2. **FDA API** - For drug statistics and side effects data

### Required API Keys:
```env
VITE_OPENAI_KEY=your_openai_api_key
VITE_FDA_API_KEY=your_fda_api_key
```

### Development Configuration:

1. Create a `.env.local` file in the project root (do not commit this to version control)
2. Add your API keys:
```env
VITE_OPENAI_KEY=your_openai_api_key_here
VITE_FDA_API_KEY=your_fda_api_key_here
```
3. Access keys in code via:
   - `import.meta.env.VITE_OPENAI_KEY`
   - `import.meta.env.VITE_FDA_API_KEY`

Note: The application includes fallback data for FDA services when API keys are not present. This is suitable for development but not recommended for production use.

### Production Configuration:

For production deployments, API keys should be stored in server-side environment variables:

1. Create a server middleware to proxy API requests
2. Store API keys in server-side environment variables
3. Create secure endpoints for frontend communication

Example server-side .env file:
```env
OPENAI_KEY=your_openai_api_key_here
FDA_API_KEY=your_fda_api_key_here
JWT_SECRET=your_jwt_secret_here
```

## Development Tools

### React DevTools
For a better development experience, install React DevTools:
1. Chrome/Edge: [React Developer Tools](https://reactjs.org/link/react-devtools)
2. Firefox: [React Developer Tools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## Troubleshooting

### Common Issues:

1. **Missing FDA API Key Warning**
   ```
   FDAService.ts: No FDA API key found. Using fallback data.
   ```
   - Solution: Add `VITE_FDA_API_KEY` to your `.env.local` file
   - Note: Application will use mock data for development if key is missing

2. **Authentication Issues**
   ```
   PrivateRoute rendering Object
   ```
   - Default demo credentials are provided:
     - Email: doctor@example.com
     - Role: doctor
   - Check localStorage for auth persistence issues

3. **Module Export Errors**
   ```
   The requested module '/src/components/DrugStats.tsx' does not provide an export named 'default'
   ```
   - Ensure all components have proper default exports
   - Check import/export statements in component files

4. **API Response Issues**
   - OpenAI API responses are logged (status 200 indicates success)
   - Check API key validity if requests fail
   - Monitor rate limits and quotas

### Development Mode Features

- Authentication state is persisted in localStorage
- FDA services use fallback data when API key is missing
- API requests are logged in console for debugging
- Protected routes validate authentication status

## Project Structure

- `src/`
  - `components/`
    - `layout/`: Layout components (Navbar, Footer, etc.)
    - `ui/`: Reusable UI components
    - `auth/`: Authentication related components
  - `config/`: Configuration settings
  - `hooks/`: Custom React hooks
  - `lib/`: Utility functions
  - `pages/`: Main application pages
  - `utils/`: Helper utilities including API services
  - `data/`: Static data (medical facts, etc.)

## Security Features

- Protected routes requiring authentication
- Secure access to documentation and resources
- Conditional rendering of navigation elements
- localStorage-based authentication (Note: For production, use a proper authentication system)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
