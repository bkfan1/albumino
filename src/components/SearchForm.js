import { Box, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchForm(){
    return(
        <>
        <Box as="form">
          <InputGroup>
            <InputLeftElement pointerEvents={"none"}>
              <AiOutlineSearch />
            </InputLeftElement>
            <Input type="text" placeholder="Search a Photo"/>
          </InputGroup>
        </Box>
        </>
    )
}