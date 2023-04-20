import axios from "axios";
import { useForm } from "react-hook-form";

export default function UploadPage() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    const { files } = data;

    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      const res = await axios.post("/api/photo", formData);
      console.log("upload succesfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" accept="image/*" {...register("files")} />
        <button>Upload</button>
      </form>
    </>
  );
}
