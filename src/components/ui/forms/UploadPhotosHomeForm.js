import { useIsMounted } from "@/hooks/useIsMounted";
import { allowedPhotosFileTypes, hasInvalidFileType } from "@/utils/validation";
import { Button, Icon, Input, Skeleton, Text, Tooltip, useToast } from "@chakra-ui/react";
import axios from "axios";
import { createRef } from "react";
import { AiOutlineUpload } from "react-icons/ai";

export default function UploadPhotosHomeForm() {
  const { isMounted } = useIsMounted();

  const inputFileRef = createRef();
  const toast = useToast();

  const handleInputFileRefOnChange = async (e) => {
    try {
      const data = new FormData();

      for (const file of e.target.files) {
        if (allowedPhotosFileTypes.includes(file.type)) {
          data.append("files", file);
        }
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const resPromise = axios.post(`/api/photos`, data, config);

      toast.promise(resPromise, {
        loading: { title: "Uploading photos..." },
        success: { title: "Photos uploaded succesfully" },
        error: { title: "An error occurred while uploading photos" },
      });

      await resPromise;
    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred while uploading photos",
      });
    }
  };

  return (
    <>
      <Tooltip label="Upload photos">
        <Skeleton isLoaded={isMounted}>
        <Button onClick={() => inputFileRef.current.click()} colorScheme="blue">
          <Icon as={AiOutlineUpload} mr={2} />
          <Text>Upload</Text>
        </Button>
        </Skeleton>
      </Tooltip>
      <Input
        onChange={(e) => handleInputFileRefOnChange(e)}
        ref={inputFileRef}
        type="file"
        accept=".jpg, .jpeg, .png"
        multiple
        display={"none"}
      />
    </>
  );
}
