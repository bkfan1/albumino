import { Button, FormControl, Input } from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function UploadAlbumTest() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    const newAlbum = {
      ...data,
      contributors: [],

      description: "Some album description",

      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      const res = await axios.post("/api/album", newAlbum);
      console.log("album upload succesfully");
    } catch (error) {
      console.log("error");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <Input type="text" {...register("name")} />
        </FormControl>
        <Button type="submit">Create album</Button>
      </form>
    </>
  );
}
