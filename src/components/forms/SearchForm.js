import { useIsMounted } from "@/hooks/useIsMounted";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchForm() {
  const { isMounted } = useIsMounted();
  return (
    <>
      <Skeleton isLoaded={isMounted} rounded={"md"}>
        <Box as="form">
          <InputGroup>
            <InputLeftElement pointerEvents={"none"}>
              <AiOutlineSearch />
            </InputLeftElement>
            <Input type="text" placeholder="Search a Photo" />
          </InputGroup>
        </Box>
      </Skeleton>
    </>
  );
}
