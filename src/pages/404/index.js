import ErrorFigure from "@/components/ui/figures/ErrorFigure";
import { Flex } from "@chakra-ui/react";

export default function NotFoundErrorPage() {
  return (
    <>
      <Flex minHeight={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <ErrorFigure description={"we could not find the requested resource"} />
      </Flex>
    </>
  );
}
