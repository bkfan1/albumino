import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { useIsMounted } from "@/hooks/useIsMounted";
import { allowedPhotosFileTypes } from "@/utils/constants";
import {
  Button,
  Icon,
  Input,
  Skeleton,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { createRef, useContext } from "react";
import { AiOutlineUpload } from "react-icons/ai";

export default function MultiRouteUploadPhotosForm() {
  const { masonryPhotos, setMasonryPhotos } = useContext(MasonryGridContext);

  const { isMounted } = useIsMounted();

  const inputFileRef = createRef();
  const toast = useToast();
  const router = useRouter();
  const { pathname } = router;

  const handleInputFileOnClick = () => {
    inputFileRef.current.click();
  };

  const handleInputFileRefOnChange = async (e) => {
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

    const res = await resPromise;

    if (pathname === "/photos") {
      const photos = res.data.photos;
      const updatedMasonryPhotos = [...photos, ...masonryPhotos];

      setMasonryPhotos(updatedMasonryPhotos);
    }
  };

  return (
    <>
      <Tooltip label="Upload photos">
        <Skeleton isLoaded={isMounted}>
          <Button onClick={handleInputFileOnClick} colorScheme="blue">
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
