import ErrorFigure from "@/components/ui/figures/ErrorFigure";
import { Button, Flex, Heading, Icon, VStack } from "@chakra-ui/react";


export default function NotFoundErrorPage(){
    return(
        <>
        <Flex minHeight={"100vh"} justifyContent={"center"} alignItems={"center"}>
            <ErrorFigure description={"Resource not found"}/>
        </Flex>
        </>
    )
}