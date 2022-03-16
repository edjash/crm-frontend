import { Loop as LoopIcon } from '@mui/icons-material/';
import { useCallback, useEffect, useRef, useState } from "react";

interface TouchPoint {
    x: number;
    y: number;
};

interface TouchData {
    initial: TouchPoint;
    current: TouchPoint;
    delta: TouchPoint;
    direction: string;
};

let touchStart: TouchPoint = { x: 0, y: 0 };
let touchEnd: TouchPoint = { x: 0, y: 0 };
let lastTouch: TouchPoint = { x: 0, y: 0 };
let lastDirection = '';

function getTouchDirection(delta: TouchPoint) {
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
        return (delta.x > 0) ? 'right' : 'left';
    } else if (delta.y > 0) {
        return 'down';
    }
    return 'up';
}

const onTouchStart = (e: TouchEvent): TouchData => {
    const point = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    };

    touchStart = point;
    lastTouch = point;
    return {
        initial: point,
        current: point,
        delta: point,
        direction: '',
    };
};

const onTouchMove = (e: TouchEvent): TouchData => {
    const point = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    };

    const delta = {
        x: point.x - lastTouch.x,
        y: point.y - lastTouch.y,
    };

    lastDirection = getTouchDirection(delta);

    return {
        initial: touchStart,
        current: point,
        delta: delta,
        direction: lastDirection
    };
};

const onTouchEnd = (e: TouchEvent): TouchData => {
    touchEnd = lastTouch;
    touchStart = { x: 0, y: 0 };
    lastTouch = { x: 0, y: 0 };

    return {
        initial: touchStart,
        current: touchEnd,
        delta: touchEnd,
        direction: lastDirection
    };
};

interface PullRefreshProps {
    onRefresh: () => void;
};

export default function PullRefresh(props: PullRefreshProps) {

    const initialHeight = -24;
    const refreshHeight = 44;
    const maxHeight = 130;

    const [rotate, setRotate] = useState(0);
    const [height, setHeight] = useState(initialHeight);
    const [hitEnd, setHitEnd] = useState(false);
    const [refreshReady, setRefreshReady] = useState(false);
    const [ready, setReady] = useState(false);

    const rotateTimer = useRef<NodeJS.Timeout>();


    // const rotateIcon = () => {
    //     setRotate((rotate) => rotate + 5);
    // };

    const endRefresh = () => {
        setReady(false);
        setHitEnd(false);
        setHeight(initialHeight);
        setRefreshReady(false);
        setRotate(0);

        if (rotateTimer.current) {
            console.log("CLEARED");
            clearInterval(rotateTimer.current);
        }
    }

    const handleTouchEvent = useCallback((type: string, td: TouchData) => {
        if (td.direction === 'right') {
            return endRefresh();
        }
        if (td.direction !== 'down') {
            return;
        }
        switch (type) {
            case 'move':
                if (height < maxHeight) {
                    let v = 15;
                    if (!ready) {
                        setReady(true);
                    }
                    setRotate((rotate) => rotate + v);
                    setHeight(height => height + 4);
                } else {
                    setHitEnd(true);
                }
                break;
            case 'end':
                if (!hitEnd && height < refreshHeight) {
                    endRefresh();
                    return;
                }
                setRefreshReady(true);
                break;
            case 'tap':
                //noop
                break;
            case 'start':
            default:
                console.log('start', td);
        }
    }, [height, hitEnd, ready]);

    useEffect(() => {
        const events: Record<string, any> = {
            'start': (e: TouchEvent) => handleTouchEvent('start', onTouchStart(e)),
            'move': (e: TouchEvent) => handleTouchEvent('move', onTouchMove(e)),
            'end': (e: TouchEvent) => handleTouchEvent('end', onTouchEnd(e)),
        };
        for (let name in events) {
            window.addEventListener(`touch${name}`, events[name]);
        }
        return () => {
            for (let name in events) {
                window.removeEventListener(`touch${name}`, events[name]);
            }
        };
    }, [handleTouchEvent]);

    useEffect(() => {
        if (refreshReady) {
            setTimeout(() => {
                if (props.onRefresh) {
                    props.onRefresh();
                }
            }, 2000);
        }
    }, [refreshReady]);
    console.log("STYLE TAGS", document.head.getElementsByTagName('style').length);

    let styles = `
        .backdrop {
            position: fixed;
            height: 100vh;
            width: 100vw;
            zIndex: 2000,
        }
        .refresh {
            position: absolute;
            z-index:2001;
            left:calc(50% - 12px);
            top: ${height}px;
            background: #777777;
            height: 32px;
            width: 32px;
            border-radius: 24px;
            box-shadow: 0px 0px 5px 0px yellow;
            transform: rotate(${rotate}deg);
        }
    `;

    if (refreshReady) {
        styles += `
        @keyframes rotating {
            from {
                transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
          @keyframes up {
            from {
              top: ${height}px;
            }
            to {
              top: ${refreshHeight}px;
            }
          }
          .refresh {
                animation-name: up, rotating;
                animation-duration: 0.5s, 1.5s;
                animation-delay: 0ms, 1s;
                animation-timing-function: ease, linear;
                animation-iteration-count: 1, infinite;
                animation-fill-mode: forwards;
          }
      `;
    };

    return (
        <div hidden={!ready}>
            <style children={styles} />
            <div className="backdrop" />
            <LoopIcon className="refresh" />
        </div>
    );
}