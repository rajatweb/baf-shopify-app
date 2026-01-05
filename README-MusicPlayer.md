# Music Player Shopify App

A premium music player app for Shopify stores that allows merchants to create and manage music playlists with multiple tracks, featuring a beautiful and modern UI/UX.

## Features

### 🎵 Music Player
- **Multi-track Support**: Unlike other apps that only allow one track, this supports unlimited tracks per playlist
- **Premium UI/UX**: Beautiful, modern interface matching the design from your existing music player section
- **Playlist Management**: Create, edit, and organize multiple playlists
- **Track Management**: Add, edit, and organize tracks with metadata (title, artist, album art, duration)
- **Audio Controls**: Play, pause, skip, volume control, and track selection
- **Responsive Design**: Works on all devices and screen sizes

### 🎛️ Customization
- **Player Position**: Choose between bottom, top, or sidebar placement
- **Theme Options**: Light and dark themes
- **Volume Control**: Set default volume levels
- **Mini Player**: Optional mini player bar for continuous playback
- **Branding**: Customize player appearance to match your store theme

### 🔒 Security & Billing
- **Shop Verification**: Built-in domain verification prevents unauthorized sharing
- **Subscription Management**: Integrated billing through Shopify's subscription system
- **Plan Limits**: Different features available based on subscription tier

## Technical Architecture

### Backend (Node.js + Express)
- **Prisma ORM**: Modern database management with PostgreSQL
- **RESTful API**: Clean, RESTful endpoints for all music player operations
- **Shopify Integration**: Secure authentication and shop verification
- **WebSocket Support**: Real-time updates and notifications

### Frontend (React + TypeScript)
- **Shopify Polaris**: Consistent with Shopify's design system
- **Redux Toolkit**: State management with RTK Query for API calls
- **Styled Components**: Custom styling for music player components
- **Responsive Design**: Mobile-first approach

### Database Schema
```sql
-- Core tables for music player functionality
Store (shop, musicPlayerEnabled, musicPlayerSettings)
Playlist (id, name, description, storeId)
Track (id, title, artist, albumArt, audioUrl, duration, storeId)
PlaylistTrack (id, order, playlistId, trackId)
```

## API Endpoints

### Playlists
- `GET /api/music-player/playlists` - Get all playlists for a shop
- `POST /api/music-player/playlists` - Create a new playlist
- `PUT /api/music-player/playlists/:id` - Update a playlist
- `DELETE /api/music-player/playlists/:id` - Delete a playlist

### Tracks
- `GET /api/music-player/tracks` - Get all tracks for a shop
- `POST /api/music-player/tracks` - Create a new track
- `PUT /api/music-player/tracks/:id` - Update a track
- `DELETE /api/music-player/tracks/:id` - Delete a track

### Playlist Management
- `POST /api/music-player/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/music-player/playlists/:id/tracks/:trackId` - Remove track from playlist
- `PUT /api/music-player/playlists/:id/tracks/order` - Update track order

### Settings
- `GET /api/music-player/settings` - Get music player settings
- `PUT /api/music-player/settings` - Update music player settings

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Shopify Partner account
- Shopify app credentials

### 1. Clone and Install
```bash
git clone <repository-url>
cd web-exp
npm install
```

### 2. Environment Configuration
```bash
# .env file
DATABASE_URL="postgresql://username:password@localhost:5432/musicplayer"
SHOPIFY_API_KEY="your_api_key"
SHOPIFY_API_SECRET="your_api_secret"
SHOPIFY_APP_URL="https://your-app-domain.com"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### 4. Build and Deploy
```bash
# Build frontend
npm run build

# Deploy to Shopify
npm run deploy
```

## Usage

### For Merchants
1. **Install App**: Install from Shopify App Store
2. **Create Playlists**: Add your first playlist
3. **Add Tracks**: Upload or link to audio files
4. **Customize**: Set player position, theme, and other options
5. **Embed**: The music player automatically appears on your store

### For Developers
1. **API Integration**: Use the RESTful API to integrate with other systems
2. **Custom Themes**: Extend the player with custom CSS and themes
3. **Webhook Support**: Listen for music player events
4. **Analytics**: Track usage and engagement metrics

## Subscription Plans

### Free Plan
- 1 playlist
- Up to 10 tracks
- Basic music player
- Standard themes
- Email support

### Pro Plan ($9.99/month)
- Unlimited playlists
- Unlimited tracks
- Premium music player
- Advanced customization
- Priority support
- Analytics dashboard
- Custom branding
- Mini player mode

## Security Features

- **HMAC Verification**: All requests verified using Shopify's HMAC
- **Shop Isolation**: Data completely separated between shops
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: Parameterized queries via Prisma

## Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Redis caching for frequently accessed data
- **CDN Integration**: Audio files served via CDN
- **Lazy Loading**: Components load only when needed
- **Image Optimization**: Album art automatically optimized

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

- **Documentation**: [docs.musicplayer.com](https://docs.musicplayer.com)
- **Email**: support@musicplayer.com
- **Live Chat**: Available in the app
- **Community**: [community.musicplayer.com](https://community.musicplayer.com)

## Roadmap

### Phase 2 (Q2 2024)
- Advanced analytics
- A/B testing for player placement
- Integration with popular music services
- Mobile app companion

### Phase 3 (Q3 2024)
- AI-powered playlist recommendations
- Social sharing features
- Advanced audio processing
- Multi-language support

### Phase 4 (Q4 2024)
- White-label solutions
- Enterprise API
- Advanced reporting
- Custom integrations marketplace
