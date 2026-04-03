'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface VideoItem {
	id: string;
	title: string;
	description?: string;
	thumbnailUrl?: string;
	videoUrl: string;
}

interface VideoGalleryProps {
	videos?: VideoItem[];
}

const defaultVideos: VideoItem[] = [
	{
		id: '1',
		title: 'How to Style Your Lace Front Wig',
		description: 'A step-by-step tutorial for a flawless look.',
		// Provide a thumbnail if you have one in /public/images
		thumbnailUrl: '/video/img1.jpeg',
		videoUrl: '/video/1.mp4',
	},
	{
		id: '2',
		title: 'Customer Testimonial',
		thumbnailUrl: '/video/img2.jpeg',
		videoUrl: '/video/2.mp4',
	},
	{
		id: '3',
		title: 'Behind The Scenes',
		thumbnailUrl: '/video/img3.jpeg',
		videoUrl: '/video/3.mp4',
	},
];

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos = defaultVideos }) => {
	const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

	const handleVideoClick = (videoId: string) => {
		setPlayingVideoId(videoId);
	};

	return (
		<section className="py-12 px-4 bg-white">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-6"
				>
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-widest uppercase">Video Gallery</h2>
				
				</motion.div>

				{/* Video Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{/* Main Featured Video */}
					{videos[0] && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="lg:row-span-2"
						>
							<VideoCard
								video={videos[0]}
								isPlaying={playingVideoId === videos[0].id}
								onClick={() => handleVideoClick(videos[0].id)}
								featured
							/>
						</motion.div>
					)}

					{/* Secondary Videos */}
					<div className="grid grid-cols-1 gap-6">
						{videos.slice(1).map((video, index) => (
							<motion.div
								key={video.id}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
							>
								<VideoCard
									video={video}
									isPlaying={playingVideoId === video.id}
									onClick={() => handleVideoClick(video.id)}
								/>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

interface VideoCardProps {
	video: VideoItem;
	isPlaying: boolean;
	onClick: () => void;
	featured?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isPlaying, onClick, featured = false }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			className={`relative rounded-2xl overflow-hidden ${!isPlaying && 'cursor-pointer'} group ${
				featured ? 'h-full min-h-[400px]' : 'h-64'
			}`}
			onClick={!isPlaying ? onClick : undefined}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={!isPlaying ? { scale: 1.02 } : {}}
			transition={{ duration: 0.3 }}
		>
			{isPlaying ? (
				/* Video Player */
				<div className="absolute inset-0 w-full h-full bg-black">
					<video
						src={video.videoUrl}
						className="w-full h-full object-cover"
						controls
						autoPlay
						playsInline
						poster={video.thumbnailUrl}
					>
						Your browser does not support the video tag.
					</video>
				</div>
			) : (
				<>
					{/* Thumbnail Image or Fallback */}
					<div className="absolute inset-0">
						{video.thumbnailUrl ? (
							<Image
								src={video.thumbnailUrl}
								alt={video.title}
								fill
								className="object-cover"
								sizes={featured ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 100vw'}
							/>
						) : (
							<div className="w-full h-full bg-neutral-900" />
						)}
						{/* Overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
					</div>

					{/* Play Button */}
					<motion.div
						className="absolute inset-0 flex items-center justify-center"
						initial={{ scale: 1 }}
						animate={{ scale: isHovered ? 1.1 : 1 }}
						transition={{ duration: 0.3 }}
						onClick={onClick}
					>
						<div className="w-16 h-16 md:w-20 md:h-20 bg-amber-600/90 rounded-full flex items-center justify-center shadow-xl group-hover:bg-amber-500 transition-colors">
							<Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
						</div>
					</motion.div>

					{/* Video Info */}
					<div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
						<h3 className={`font-bold mb-2 ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{video.title}</h3>
						{video.description && (
							<p className="text-sm md:text-base text-gray-200">{video.description}</p>
						)}
					</div>

					{/* Hover Effect */}
					<motion.div
						className="absolute inset-0 bg-amber-600/20 pointer-events-none"
						initial={{ opacity: 0 }}
						animate={{ opacity: isHovered ? 1 : 0 }}
						transition={{ duration: 0.3 }}
					/>
				</>
			)}
		</motion.div>
	);
};

export default VideoGallery;

