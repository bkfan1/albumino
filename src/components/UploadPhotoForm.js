import { Button, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";

export default function UploadPhotoForm() {
  const inputFileRef = useState(null);

  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleImageOnChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/photo", formData);
      console.log("upload successfully");
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <>
      <Button leftIcon={<AiOutlineUpload />} onClick={handleButtonClick}>
        Upload
        <input
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChange={(e) => handleImageOnChange(e)}
          style={{ display: "none" }}
        />
      </Button>
    </>
  );
}
