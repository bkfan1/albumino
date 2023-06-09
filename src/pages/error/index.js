import ErrorFigure from "@/components/ui/figures/ErrorFigure";
import { Button, Flex, Heading, Icon, VStack } from "@chakra-ui/react";


export default function ErrorPage(){
    return(
        <>
        <Flex minHeight={"100vh"}>
            <ErrorFigure/>
        </Flex>
        </>
    )
}