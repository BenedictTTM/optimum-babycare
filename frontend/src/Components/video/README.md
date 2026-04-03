# Video Gallery Component

A responsive video gallery component with a featured main video and secondary video thumbnails. Built with React, TypeScript, and Framer Motion for smooth animations.

## Features

- 🎬 Featured main video with larger display
- 📱 Fully responsive grid layout
- ▶️ Animated play buttons on hover
- 🎥 Modal video player with iframe support
- ✨ Smooth animations with Framer Motion
- 🎨 Beautiful gradient overlays
- 🖼️ Custom thumbnail support

## Usage

### Basic Usage

```tsx
import { VideoGallery } from "@/Components/video";

export default function Page() {
  return <VideoGallery />;
}
```

### With Custom Videos

```tsx
import { VideoGallery } from "@/Components/video";

const videos = [
  {
    id: "1",
    title: "How to Style Your Lace Front Wig",
    description: "A step-by-step tutorial for a flawless look.",
    thumbnailUrl: "/images/video-1.jpg",
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  },
  {
    id: "2",
    title: "Customer Testimonial",
    thumbnailUrl: "/images/video-2.jpg",
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  },
  {
    id: "3",
    title: "Behind The Scenes",
    thumbnailUrl: "/images/video-3.jpg",
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  },
];

export default function Page() {
  return <VideoGallery videos={videos} />;
}
```

## Props

### VideoGallery

| Prop   | Type          | Default       | Description                       |
| ------ | ------------- | ------------- | --------------------------------- |
| videos | `VideoItem[]` | defaultVideos | Array of video objects to display |

### VideoItem Interface

```typescript
interface VideoItem {
  id: string; // Unique identifier
  title: string; // Video title
  description?: string; // Optional video description
  thumbnailUrl: string; // URL to thumbnail image
  videoUrl: string; // YouTube embed URL or video source
}
```

## Video URL Format

For YouTube videos, use the embed URL format:

```
https://www.youtube.com/embed/VIDEO_ID
```

For Vimeo videos:

```
https://player.vimeo.com/video/VIDEO_ID
```

## Styling

The component uses Tailwind CSS classes and can be customized by:

1. Modifying the color scheme (amber accent colors)
2. Adjusting the grid layout for different screen sizes
3. Customizing animations in Framer Motion props
4. Changing overlay gradients and opacity

## Requirements

- React 19+
- TypeScript
- Framer Motion 12+
- Lucide React (for icons)
- Tailwind CSS

## Layout

- **Desktop**: Main featured video on the left (spans 2 rows), secondary videos stacked on the right
- **Mobile**: All videos stack vertically with full width

## Animation Details

- Fade in and scale on mount
- Hover scale effect on video cards
- Play button scale animation on hover
- Modal fade and scale transitions
- Staggered animation for secondary videos
