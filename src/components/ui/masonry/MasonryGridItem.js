import {
  Box,
  Checkbox,
  GridItem,
  IconButton,
  Image,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useRouter } from "next/router";

export default function MasonryGridItem({ data }) {
  const { isMounted } = useIsMounted();
  const { url } = data;
  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      <GridItem>
        <Box
          position="relative"
          overflow={"hidden"}
          _hover={{
            transition: "100ms ease-in-out",
            cursor: "pointer",
            opacity: "80%",
          }}
        >
          <Checkbox position={"absolute"} m={2} />
          <Skeleton isLoaded={isMounted} rounded={"md"}>
            <Image src={url} alt={"Photo"} w="100%" h="auto" rounded="md" />
          </Skeleton>
        </Box>
      </GridItem>
    </>
  );
}
