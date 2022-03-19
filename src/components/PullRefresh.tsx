import { Refresh as RefreshIcon } from '@mui/icons-material/';
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
    onRefresh: (refreshed: () => void) => void;
    scrollElement?: HTMLElement | null;
    enabled: boolean;
};

const INITIAL_HEIGHT = -32;
const REFRESH_HEIGHT = 40;
const MAX_HEIGHT = 130;
const REFRESH_DELAY_MS = 700;

export default function PullRefresh(props: PullRefreshProps) {

    const [rotate, setRotate] = useState(0);
    const [height, setHeight] = useState(INITIAL_HEIGHT);
    const [hitEnd, setHitEnd] = useState(false);
    const [refreshReady, setRefreshReady] = useState(false);
    const [ready, setReady] = useState(false);

    const swiping = useRef(false);

    const endRefresh = useCallback(() => {
        setReady(false);
        setHitEnd(false);
        setHeight(INITIAL_HEIGHT);
        setRefreshReady(false);
        setRotate(0);
        swiping.current = false;
    }, []);

    const timer = useRef<NodeJS.Timeout>();

    const clearTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }

    const handleTouchEvent = useCallback((type: string, td: TouchData, e: TouchEvent) => {
        switch (type) {
            case 'move':
                if (!swiping.current) {
                    if (td.direction !== 'down' || !props.scrollElement) {
                        return;
                    }
                    if (props.scrollElement.scrollTop > 50) {
                        const rect = props.scrollElement.getBoundingClientRect();
                        if (td.current.y >= rect.top) {
                            return;
                        }
                    }
                }

                swiping.current = true;
                if (height < MAX_HEIGHT) {
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
                if (!hitEnd && height < REFRESH_HEIGHT) {
                    endRefresh();
                    return;
                }
                setRefreshReady(true);
                break;
        }
    }, [height, hitEnd, ready, endRefresh, props.scrollElement]);

    useEffect(() => {
        const events: Record<string, any> = {
            'start': (e: TouchEvent) => handleTouchEvent('start', onTouchStart(e), e),
            'move': (e: TouchEvent) => handleTouchEvent('move', onTouchMove(e), e),
            'end': (e: TouchEvent) => handleTouchEvent('end', onTouchEnd(e), e),
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
        if (refreshReady && props.onRefresh) {
            clearTimer();
            timer.current = setTimeout(() => {
                props.onRefresh(() => {
                    if (props?.scrollElement) {
                        props.scrollElement.scrollTop = 0;
                    }
                    endRefresh();
                });
            }, REFRESH_DELAY_MS);

            return () => clearTimer();
        }
    }, [refreshReady, props, endRefresh]);

    let styles = `
        .pullRefresh-refresh {
            position: absolute;
            z-index:2001;
            left:calc(50% - 12px);
            top: ${height}px;
            background: #777777;
            height: 32px;
            width: 32px;
            border-radius: 24px;
            transform: rotate(${rotate}deg);
            display:${(!ready || !props.enabled) ? 'none' : 'block'};
        }
    `;

    if (refreshReady) {
        styles += `
        @keyframes pullRefresh-rotating {
            from {
                transform: rotate(-360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
          @keyframes pullRefresh-up {
            from {
              top: ${height}px;
            }
            to {
              top: ${REFRESH_HEIGHT}px;
            }
          }
          .pullRefresh-refresh {
                transform: none;
                animation-name: pullRefresh-up, pullRefresh-rotating;
                animation-duration: 0.5s, 1s;
                animation-delay: 0ms, 0.5s;
                animation-timing-function: ease, linear;
                animation-iteration-count: 1, infinite;
                animation-fill-mode: forwards;
          }
      `;
    };

    return (
        <>
            <style children={styles} />
            <RefreshIcon className="pullRefresh-refresh" />
        </>
    );
}
