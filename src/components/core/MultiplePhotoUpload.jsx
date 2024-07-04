import { CloudUpload } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { CLOUD, DOC } from "assets";
import { useRef } from "react";
// import Swal from "sweetalert2";

const  MultiplePhotoUpload = ({
  value,
  onChange,
  variant,
  height,
  width,
  dimensions,
  className,
  txtName,
}) => {
  const inputRef = useRef(null);

  const handleImageChange = async (e) => {
    try {
      const files = e?.target?.files;
      if (!files || files.length === 0) return;

      // Update the state to an array of images
      onChange(Array.from(files));

      if (!dimensions) return;

      // Validate dimensions for each image
      for (const file of files) {
        if (file.type.includes("image")) {
          const img = new Image();
          img.src = URL.createObjectURL(file);

          // Wait for the image to load
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          // Check dimensions
          if (
            img.width !== dimensions.width ||
            img.height !== dimensions.height
          ) {
            // Handle invalid dimensions (e.g., show an alert)
            // Swal.fire(
            //   "Invalid Dimensions",
            //   `Please use ${dimensions.width}x${dimensions.height} images`,
            //   "warning"
            // );
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Avatar
        variant={variant || "square"}
        src={value && value.length > 0 ? URL.createObjectURL(value[0]) : value}
        className={className}
        sx={{
          height: height || "100%",
          width: width || "100%",
          cursor: "pointer",
          objectFit: "center",
        }}
        onClick={() => inputRef.current?.click()}
      >
        {!value ||
          (value.length === 0 && (
            <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
              <img className="w-20" src={CLOUD} alt="" />
              <small>{txtName}</small>
            </div>
          ))}
      </Avatar>
      <input
        ref={inputRef}
        hidden
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        multiple // Allow multiple file selection
      />
    </>
  );
};

export default MultiplePhotoUpload;
