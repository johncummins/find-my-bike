# Find My Bike

A web application to help people find their missing or stolen bikes by searching eBay UK listings. Upload a photo of your bike along with the make and model to find similar listings using eBay's image search.

## Purpose

This app helps bike owners who have had their bicycles stolen or lost. Upload a photo of your missing bike along with the make and model to search through eBay UK listings and find potential matches using eBay's visual search technology.

## Features

- Upload a bike image for visual search
- Search eBay UK with make and model filters
- Uses eBay's native image search API
- Beautiful, accessible UI with shadcn/ui components
- Server-side processing with React Server Actions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Integration**: eBay Browse API (search_by_image endpoint)
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
4. Get your Client ID and Client Secret

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
EBAY_CLIENT_ID=your_ebay_client_id_here
EBAY_CLIENT_SECRET=your_ebay_client_secret_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Image Upload**: Upload a clear photo of your missing bike
2. **Enter Make and Model**: Provide the bike's make (brand) and model
3. **eBay Image Search**: The app uses eBay's `search_by_image` API endpoint which:
   - Converts your image to Base64 format
   - Searches eBay UK bicycle listings using visual similarity
   - Filters results by make and model using aspect filters
4. **Results**: Returns matching listings sorted by relevance

## Important Notes

- This tool is designed to help locate missing or stolen bikes
- Always verify listings independently before taking any action
- Contact local authorities if you believe you've found your stolen bike
- The search results are based on eBay's image matching algorithm
- Consider reporting stolen bikes to local police and bike registration services

## API Endpoints

The app uses eBay's Browse API:

- **Image Search Endpoint**: `https://api.ebay.com/buy/browse/v1/item_summary/search_by_image`
- **Marketplace**: UK (EBAY_GB)
- **Category**: Bicycles (177831)
- **Method**: POST with Base64 image in request body
- **Filters**: Uses aspect filters for Brand and Model when provided

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
EBAY_CLIENT_ID=your_production_ebay_client_id
EBAY_CLIENT_SECRET=your_production_ebay_client_secret
```

## Project Structure

```
src/
├── app/
│   ├── actions/
│   │   └── searchBikesByImage.ts    # Server action for image search
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Homepage
└── lib/
    ├── ebayApi.ts                    # eBay API integration
    └── utils.ts                      # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
