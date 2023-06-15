import { Box, Button, FormControl, Heading, Input, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function SendAlbumInvitationForm() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const {query} = router;
const {albumId} = query;  

  const onSubmit = async (data)=>{
    console.log(data)

    try {
        const res = await axios.post(`/api/album/${albumId}/invitation`, data);
        console.log("yes!")
        
    } catch (error) {
        console.log(error)
    }



  }

  return (
    <>
      <VStack as={"form"} onSubmit={handleSubmit(onSubmit)}>
        <VStack width={"100%"}> 
        <Heading width={"100%"} size={"md"}>Send email</Heading>
        <Text width={"100%"}>Send an email with an invitation link</Text>
        </VStack>
        <FormControl>
          <Input type="email" {...register("email")} placeholder="Email" />
        </FormControl>

        <FormControl>
          <Input type="text" {...register("subject")} placeholder="Subject" />
        </FormControl>

        <Button width={"100%"} colorScheme="green" type="submit">Send</Button>
      </VStack>
    </>
  );
}
