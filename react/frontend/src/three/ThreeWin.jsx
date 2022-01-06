import React, { useEffect, useRef } from "react";
import { SceneManager } from "./sceneManager";

const ThreeWin = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    let timer;

    const resize = (sceneManager, container) => {
        clearTimeout(timer)

        timer = setTimeout(() => {
            let width = container.clientWidth;
            let height = container.clientHeight;
            sceneManager.resizeCanvas(width, height)
        }, 2)
    }



    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        let sceneManager = new SceneManager(canvas, container);
        new ResizeObserver(() => { resize(sceneManager, containerRef.current) }).observe(containerRef.current);
        const animate = () => {
            sceneManager.update();
            requestAnimationFrame(animate);
        }

        animate(sceneManager);

    })
    return (
        <div ref={containerRef} className="threeContainer">
            <canvas ref={canvasRef} className="threeCanvas"></canvas>
        </div>
    )
}

export default ThreeWin
