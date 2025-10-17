# Find My Bike

A Next.js 14 web application designed to help people find their missing or stolen bikes by searching eBay UK listings. Upload a photo of your missing bike and the app will find similar listings using AI-powered image comparison technology.

## Purpose

This application was created to help bike owners who have had their bicycles stolen or lost. By uploading a photo of your missing bike, you can search through eBay UK listings to find potential matches. The app uses advanced image similarity algorithms to compare your bike photo with listing images, helping you identify if your bike has been listed for sale.

## Features

- Upload a bike image for visual comparison
- Search eBay UK with optional brand, model, and color filters
- AI-powered image similarity comparison using perceptual hashing
- Similarity scores and visual progress bars
- Beautiful, accessible UI with shadcn/ui components
- Server-side processing with React Server Actions

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

1. **Image Upload**: Upload a clear photo of your missing bike
2. **Hash Generation**: Server generates a perceptual hash of your bike image
3. **eBay Search**: Searches eBay UK bicycle listings using optional brand, model, and color filters
4. **Image Comparison**: Downloads each listing image and compares it with your bike photo using AI
5. **Results**: Returns sorted results with similarity scores to help identify potential matches

## Important Notes

- This tool is designed to help locate missing or stolen bikes
- Always verify listings independently before taking any action
- Contact local authorities if you believe you've found your stolen bike
- The similarity scores are estimates and should be used as guidance only
- Consider reporting stolen bikes to local police and bike registration services

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
