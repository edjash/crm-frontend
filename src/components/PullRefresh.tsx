import { Loop as LoopIcon } from '@mui/icons-material/';
import { styled } from "@mui/material";
import { RefCallback, useEffect, useRef, useState } from "react";
import { SwipeEventData, useSwipeable } from 'react-swipeable';

const Container = styled('div')({
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: 2001,
    //background: 'green',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
});

const RefreshIcon = styled(LoopIcon)({
    background: '#777777',
    height: '24px',
    width: '24px',
    borderRadius: '24px',
    boxShadow: '0px 0px 5px 0px yellow'
});

export default function PullRefresh() {

    const initialHeight = 24;
    const refreshHeight = 70;
    const maxHeight = 130;

    const [rotate, setRotate] = useState(0);
    const [height, setHeight] = useState(initialHeight);
    const [hitEnd, setHitEnd] = useState(false);
    const [ready, setReady] = useState(false);

    const rotateTimer = useRef<NodeJS.Timeout>();

    // const rotateIcon = () => {
    //     setRotate((rotate) => rotate + 5);
    // };

    const endRefresh = () => {
        setReady(false);
        setHitEnd(false);
        setHeight(initialHeight);
        setRotate(0);

        if (rotateTimer.current) {
            console.log("CLEARED");
            clearInterval(rotateTimer.current);
        }
    }

    const { ref } = useSwipeable({
        onSwipeStart: (sd: SwipeEventData) => {
            if (sd.dir === 'Down') {
                setReady(true);
            }
        },
        onSwiping: (sd: SwipeEventData) => {
            if (height < maxHeight) {
                let v = 1 + (sd.velocity * 5);
                setRotate((rotate) => rotate + v);
                setHeight(height => height + 1);
            } else {
                setHitEnd(true);
            }
        },
        onSwiped: (sd: SwipeEventData) => {
            if (!hitEnd && height < refreshHeight) {
                endRefresh();
                return;
            }
            //rotateTimer.current = setInterval(rotateIcon, 16);
        },
        onTap: () => {
            endRefresh();
        }
    }) as { ref: RefCallback<Document> };

    useEffect(() => {
        ref(document);
    }, [ref]);

    console.log("STYLE TAGS", document.head.getElementsByTagName('style').length);
    return (
        <div hidden={!ready}>
            <div style={{
                position: 'fixed',
                height: '100vh',
                width: '100vw',
                zIndex: 2000,
            }}
            />
            <Container style={{ height: height + 'px' }}>
                <RefreshIcon style={{ transform: 'rotate(' + rotate + 'deg)' }} />
            </Container>
        </div>
    );
}