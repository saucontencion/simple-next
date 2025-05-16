"use client";

import { ContextProvider } from "../app/contex";

interface CartProviderProps {
    children: React.ReactNode;
}

const Provider: React.FC<CartProviderProps> = ({ children }) => {
    return <ContextProvider>{children}</ContextProvider>;
};

export default Provider;