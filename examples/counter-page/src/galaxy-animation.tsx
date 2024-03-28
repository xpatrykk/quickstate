import React, {useEffect, useRef} from "react";
import {GalaxyCanvas} from "./styles";
import {selectCount} from "./state";

interface Star {
	x: number;
	y: number;
	z: number;
	o: string;
}

export const GalaxyAnimation = () => {
	const count = selectCount();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const stars = useRef<Star[]>([]);
	const animationFrameId = useRef<number>();

	const numStars = 1900;

	const initializeStars = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			stars.current = Array.from({length: numStars}, () => ({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				z: Math.random() * canvas.width,
				o: `0.${Math.floor(Math.random() * 99) + 1}`,
			}));
		}
	};

	const drawStars = () => {
		const canvas = canvasRef.current;
		const c = canvas?.getContext("2d");
		if (c && canvas) {
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const focalLength = canvas.width * 2;

			c.fillStyle = "rgba(0,10,20,1)";
			c.fillRect(0, 0, canvas.width, canvas.height);
			stars.current.forEach((star) => {
				const pixelX = (star.x - centerX) * (focalLength / star.z) + centerX;
				const pixelY = (star.y - centerY) * (focalLength / star.z) + centerY;
				const pixelRadius = focalLength / star.z;

				c.fillStyle = `rgba(209, 255, 255, ${star.o})`;
				c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
			});
		}
	};

	const moveStars = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			stars.current.forEach((star) => {
				star.z -= count + 1;
				if (star.z <= 0) {
					star.z = canvas.width;
				}
			});
		}
	};

	const executeFrame = () => {
		moveStars();
		drawStars();
		animationFrameId.current = requestAnimationFrame(executeFrame);
	};

	const handleResize = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initializeStars();
		}
	};

	useEffect(() => {
		executeFrame();

		console.log("COUNT", count);

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [count]);

	useEffect(() => {
		handleResize();
	}, []);

	useEffect(() => {
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return <GalaxyCanvas ref={canvasRef} id="space" />;
};
