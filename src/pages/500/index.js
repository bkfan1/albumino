import ErrorFigure from "@/components/ui/figures/ErrorFigure";
import { Button, Flex, Heading, Icon, VStack } from "@chakra-ui/react";


export default function ServerErrorPage(){
    return(
        <>
        <Flex minHeight={"100vh"} justifyContent={"center"} alignItems={"center"}>
            <ErrorFigure description={"A server internal error has occurred. We apologize for the inconvenience. Our technical team has been notified about this issue and is working to resolve it as soon as possible. Please try again later."}/>
        </Flex>
        </>
    )
}