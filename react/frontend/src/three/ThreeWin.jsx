import React, { useEffect, useRef } from "react";
import { WindowManager } from "./WindowManager";

const ThreeWin = ({ sceneManager }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    let timer;

    const resize = (sceneManager, container) => {
        clearTimeout(timer)

        timer = setTimeout(() => {
            let width = container.clientWidth;
            let height = container.clientHeight;
            sceneManager.resizeCanvas(width, height)
        }, 4)
    }



    useEffect(() => {
        console.log("Threewin", sceneManager)
        const canvas = canvasRef.current;
        const container = containerRef.current;

        let windowManager = new WindowManager(sceneManager, canvas, container);
        let resizeObs = new ResizeObserver(() => { resize(windowManager, containerRef.current) })
        resizeObs.observe(containerRef.current);
        const animate = () => {
            windowManager.update();
            requestAnimationFrame(animate);
        }

        animate(sceneManager);
        return () => {
            windowManager.dispose();
            resizeObs.disconnect();
        }


    })
    return (
        <div ref={containerRef} className="threeContainer">
            <canvas ref={canvasRef} className="threeCanvas"></canvas>
        </div>
    )
}

export default ThreeWin
