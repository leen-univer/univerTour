import { Avatar } from "@mui/material";
import { auth } from "configs";
import firebase from "firebase/app";
import "firebase/storage";
import { useRef, useState } from "react";

const DocumentUpload = ({
    value,
    onChange,
    variant,
    height,
    width,
    className,
    txtName,
}) => {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleFileChange = async (e) => {
        try {
            const file = e?.target?.files?.[0];
            if (!file) return;

            setUploading(true);

            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`Users/${auth?.currentUser?.uid}/documents/${file.name}`);
            await fileRef.put(file);

            const url = await fileRef.getDownloadURL();
            onChange(url); // Update the document URL or value
            setFileName(file.name); // Set the file name

            setUploading(false);
        } catch (error) {
            console.error("Error uploading document: ", error);
            setUploading(false);
        }
    };

    return (
        <>
            <Avatar
                variant={variant || "square"}
                src={value}
                className={className}
                sx={{
                    height: height || "100%",
                    width: width || "100%",
                    cursor: "pointer",
                    objectFit: "cover",
                }}
                onClick={() => inputRef.current?.click()}
            >
                {!value && !uploading && (
                    <div className="h-full w-full flex flex-col gap-4 items-center justify-center bg-white">
                        <img className="w-28 h-28" src="/docFile.png" alt="" />
                        <small className="text-black">{txtName}</small>
                    </div>
                )}
                {uploading && <div>Uploading...</div>}
                {value && <div>{fileName}</div>}
            </Avatar>
            <input
                ref={inputRef}
                hidden
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
        </>
    );
};

export default DocumentUpload;
