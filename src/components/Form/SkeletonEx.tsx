import { Skeleton } from "@mui/material";
import { ReactNode } from "react";


interface SkeletonExProps {
    children?: ReactNode;
}

export default function SkeletonEx(props: SkeletonExProps) {
    return (
        <div className="skeletonEx">
            <Skeleton />
            <div className="skeleton-child">
                {props.children}
            </div>
        </div>
    );
}