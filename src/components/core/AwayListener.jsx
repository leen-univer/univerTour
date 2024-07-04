import { useEffect, useRef } from "react";

const AwayListener = ({
    onClickAway,
    open,
    children,
    sx,
}) => {
    const mainDivRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                open &&
                mainDivRef.current &&
                !(
                    event.target instanceof Node &&
                    mainDivRef.current.contains(event.target)
                )
            ) {
                onClickAway();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClickAway();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClickAway]);

    return (
        <section className={sx} ref={mainDivRef}>
            {children}
        </section>
    );
};

export default AwayListener;
