import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { FC, PropsWithChildren, useEffect } from "react";


const GraphEvents = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();

    useEffect(() => {
        console.log("register events");
        registerEvents({
            clickNode: (event) => console.log("clickNode", event.event, event.node, event.preventSigmaDefault),
        })
    }, [registerEvents]);

    return null;
};


export const Events = ({ style }) => {
    return (
        <GraphEvents />
    );
  };