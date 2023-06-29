import { useDisclosure } from "@chakra-ui/react";
import { createContext } from "react";


export const PhotoVisorContext = createContext();

export const PhotoVisorProvider = ({children})=>{
    const {isOpen, onOpen, onClose} = useDisclosure();

    const contextValue = {
        isOpen,
        onOpen,
        onClose,
    }

    return (
        <>
        <PhotoVisorContext.Provider value={contextValue}>
            {children}
        </PhotoVisorContext.Provider>
        </>
    )

}