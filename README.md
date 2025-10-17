# Find My Bike

A Next.js 14 web application that helps you find similar bikes on eBay UK by uploading a photo and comparing it with listing images using perceptual hashing.

## Features

- 📸 Upload a bike image for visual comparison
- 🔍 Search eBay UK with optional brand, model, and color filters
- 🧠 AI-powered image similarity comparison using perceptual hashing
- 📊 Similarity scores and visual progress bars
- 🎨 Beautiful, accessible UI with shadcn/ui components
- ⚡ Server-side processing with React Server Actions
- 🔄 Loading states with skeleton components
- 🚨 Graceful error handling with alert components

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Image Processing**: Sharp + image-hash
- **API Integration**: eBay Browse API
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd find-my-bike
npm install
```

### 2. Get eBay API Key

1. Go to [eBay Developer Program](https://developer.ebay.com/)
2. Create a developer account
3. Create a new application
4. Get your API key (Client ID)

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
EBAY_API_KEY=your_ebay_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Image Upload**: User uploads a bike photo
2. **Hash Generation**: Server generates a perceptual hash of the uploaded image
3. **eBay Search**: Searches eBay UK using keywords from optional fields
4. **Image Comparison**: Downloads each listing image and compares with user's image
5. **Results**: Returns sorted results with similarity scores

## API Endpoints

The app uses eBay's Browse API:

- **Endpoint**: `https://api.ebay.com/buy/browse/v1/item_summary/search`
- **Marketplace**: UK (EBAY_GB)
- **Category**: Bicycles (177831)
- **Limit**: 20 results

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
EBAY_API_KEY=your_production_ebay_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Project Structure

```
src/
├── app/
│   ├── actions/
│   │   └── searchBikes.ts    # Server action for bike search
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage component
└── lib/
    ├── ebayApi.ts           # eBay API integration
    └── imageUtils.ts        # Image processing utilities
```

## Error Handling

The app gracefully handles:

- Missing API keys
- Failed image downloads
- Invalid image formats
- eBay API errors
- Network timeouts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
