import React, { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
	videoUrl: string;
	title: string;
	videoDuration: number;
	isCompleted: boolean;
	onComplete?: () => void;
}

const getVideoId = (url: string): string => {
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.hostname.includes("youtu.be")) {
			return parsedUrl.pathname.slice(1);
		} else if (parsedUrl.hostname.includes("youtube.com")) {
			return parsedUrl.searchParams.get("v") || "";
		}
		return "";
	} catch {
		return "";
	}
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
	videoUrl,
	title,
	videoDuration,
	isCompleted,
	onComplete,
}) => {
	const playerRef = useRef<any>(null);
	const [hasMarkedComplete, setHasMarkedComplete] = useState(isCompleted);
	const [player, setPlayer] = useState<any>(null);

	const videoId = getVideoId(videoUrl);
	const requiredWatchTime = videoDuration * 60 * 0.6; // 60% of duration in seconds

	useEffect(() => {
		if (!window.YT) {
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			document.body.appendChild(tag);
		}

		window.onYouTubeIframeAPIReady = () => {
			if (playerRef.current && !player) {
				const newPlayer = new window.YT.Player(playerRef.current, {
					height: "100%",
					width: "100%",
					videoId: videoId,
					events: {
						onStateChange: (event: any) => handleStateChange(event, newPlayer),
					},
				});
				setPlayer(newPlayer);
			}
		};
	}, [videoId, player]);

	const handleStateChange = (event: any, playerInstance: any) => {
		if (event.data === window.YT.PlayerState.PLAYING) {
			const checkInterval = setInterval(() => {
				const currentTime = playerInstance.getCurrentTime();
				if (currentTime >= requiredWatchTime && !hasMarkedComplete) {
					setHasMarkedComplete(true);
					onComplete?.();
					clearInterval(checkInterval);
				}
			}, 1000);
		}
	};

	return (
		<div className="relative w-full aspect-video bg-black">
			<div ref={playerRef} className="w-full h-full" />
		</div>
	);
};

export default VideoPlayer;

// import React, { useEffect, useRef, useState } from 'react';

// interface VideoPlayerProps {
//   videoUrl: string;
//   title: string;
//   onClose?: () => void; // Optional callback
//   onComplete: () => void; // Callback when video is marked as complete
// }

// const getVideoSrc = (url: string): string => {
//   try {
//     const parsedUrl = new URL(url);

//     if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
//       let videoId = '';

//       if (parsedUrl.hostname.includes('youtu.be')) {
//         // Short YouTube URL (e.g., https://youtu.be/VIDEO_ID)
//         videoId = parsedUrl.pathname.slice(1);
//       } else {
//         // Standard YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
//         videoId = parsedUrl.searchParams.get('v') || '';
//       }

//       if (videoId) {
//         return `https://www.youtube.com/embed/${videoId}`;
//       }
//     } else if (parsedUrl.hostname.includes('vimeo.com')) {
//       // Vimeo URL (e.g., https://vimeo.com/VIDEO_ID)
//       const videoId = parsedUrl.pathname.split('/').pop();
//       if (videoId) {
//         return `https://player.vimeo.com/video/${videoId}`;
//       }
//     }

//     // For local or other direct video URLs
//     return url;
//   } catch (error) {
//     console.error('Invalid URL:', url);
//     return url;
//   }
// };

// const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onClose, onComplete }) => {
//   const videoRef = useRef<HTMLIFrameElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [timeWatched, setTimeWatched] = useState(0);
//   const [isCompleted, setIsCompleted] = useState(false); // Track if the lecture is completed

//   const videoSrc = getVideoSrc(videoUrl);

//   useEffect(() => {
//     // Simulate time-watching tracking: after 10 seconds, mark as complete
//     const timer = setInterval(() => {
//       if (isPlaying) {
//         setTimeWatched((prev) => prev + 1); // Increase time watched by 1 second
//       }
//     }, 1000);

//     if (timeWatched >= 10 && !isCompleted) { // Trigger complete after 10 seconds
//       clearInterval(timer);
//       setIsCompleted(true); // Mark video as completed
//       onComplete(); // Trigger onComplete callback
//     }

//     return () => clearInterval(timer); // Cleanup the interval on unmount
//   }, [isPlaying, timeWatched, isCompleted, onComplete]);

//   const handlePlayVideo = () => {
//     if (videoRef.current && !isPlaying) {
//       setIsPlaying(true);
//       const autoplaySrc = videoSrc.includes('?') ? `${videoSrc}&autoplay=1` : `${videoSrc}?autoplay=1`;
//       videoRef.current.src = autoplaySrc;
//     }
//   };

//   const handleClose = () => {
//     if (videoRef.current) {
//       videoRef.current.src = videoSrc; // Reset the video src
//     }
//     setIsPlaying(false);
//     if (onClose) {
//       onClose();
//     }
//   };

//   return (
//     <div className="relative w-full aspect-video bg-black">
//       <iframe
//         ref={videoRef}
//         src={videoSrc}
//         allowFullScreen
//         allow="autoplay; encrypted-media"
//         className="w-full h-full border-0"
//         title={title}
//       />

//       {!isPlaying && (
//         <div
//           className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
//           onClick={handlePlayVideo}
//         >
//           <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full bg-opacity-75">
//             <svg
//               className="w-8 h-8 text-black"
//               fill="currentColor"
//               viewBox="0 0 84 84"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <circle cx="42" cy="42" r="42" fill="currentColor" />
//               <polygon points="33,25 63,42 33,59" fill="#fff" />
//             </svg>
//           </div>
//         </div>
//       )}

//       <div className="absolute top-4 left-4 flex items-center space-x-4 z-10">
//         <h3 className="text-lg font-bold text-white">{title}</h3>
//         <button
//           onClick={handleClose}
//           className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
//         >
//           Close
//         </button>
//       </div>

//       {/* Green Line to show the lecture is completed */}
//       {isCompleted && (
//         <div className="absolute bottom-0 left-0 w-full h-2 bg-green-500" />
//       )}
//     </div>
//   );
// };

// export default VideoPlayer;
