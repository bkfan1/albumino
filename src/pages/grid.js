import PhotosGrid from "@/components/PhotosGrid";

export default function GridPage(){

    const items = [
        "https://firebasestorage.googleapis.com/v0/b/albumino-2e5c7.appspot.com/o/users%2F643d9cb21d98f9ae9abc5d44%2F06d0b40c-7657-4b64-ae0b-b61fe379b232?alt=media&token=e9a0400a-886a-4d9e-a392-29d51bfe7ecf",
        "https://firebasestorage.googleapis.com/v0/b/albumino-2e5c7.appspot.com/o/users%2F643d9cb21d98f9ae9abc5d44%2F5cc20058-5cba-4336-9185-66ac71a4dded?alt=media&token=d616eca6-8768-4dbc-97da-692bff44f79c",
        "https://firebasestorage.googleapis.com/v0/b/albumino-2e5c7.appspot.com/o/users%2F643d9cb21d98f9ae9abc5d44%2F9e91c31c-0b1a-4296-9493-8f29b89dce7f?alt=media&token=e025bce7-c67c-4aca-b2cb-ed3a3a7ce2d4",
        
    ]

    return(
        <>
        <PhotosGrid photos={items}/>
        </>
    )
}