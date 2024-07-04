import { Avatar } from "@mui/material";
import { CLOUD } from "assets";
import { auth } from "configs";
import firebase from "firebase/app";
import "firebase/storage";
import { useRef, useState } from "react"; // Import useState

const PhotoUpload = ({
  value,
  onChange,
  variant,
  height,
  width,
  className,
  txtName,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false); // Add state for uploading

  const handleImageChange = async (e) => {
    try {
      const file = e?.target?.files?.[0];
      if (!file) return;

      setUploading(true); // Set uploading state to true

      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`Users/${auth?.currentUser?.uid}/addDocument`);
      await fileRef.put(file);

      const url = await fileRef.getDownloadURL();
      onChange(url);

      setUploading(false); // Set uploading state to false after successful upload
    } catch (error) {
      console.error("Error uploading image: ", error);
      setUploading(false); // Set uploading state to false in case of error
    }
  };

  return (
    <>
      <Avatar
        variant={variant || "square"}
        src={value || CLOUD}
        className={className}
        sx={{
          height: height || "100%",
          width: width || "100%",
          cursor: "pointer",
          objectFit: "cover",
        }}
        onClick={() => inputRef.current?.click()}
      >
        {!value && !uploading && ( // Display upload UI only if not uploading
          <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
            <img className="w-20" src={CLOUD} alt="" />
            <small className="text-black">{txtName}</small>
          </div>
        )}
        {uploading && <div>Uploading...</div>} {/* Display uploading message */}
      </Avatar>
      <input
        ref={inputRef}
        hidden
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />
    </>
  );
};

export default PhotoUpload;
