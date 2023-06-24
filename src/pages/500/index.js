import ErrorFigure from "@/components/ui/figures/ErrorFigure";
import { Flex } from "@chakra-ui/react";

export default function ServerErrorPage() {
  return (
    <>
      <Flex minHeight={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <ErrorFigure
          description={
            "A server internal error has occurred. Please try again later or contact the developer."
          }
        />
      </Flex>
    </>
  );
}
