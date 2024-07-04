import { Avatar } from "@mui/material";
import { CLOUD, DOC } from "assets";
import { useRef } from "react";
// import Swal from "sweetalert2";

const PhotoUpload = ({
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
			const file = e?.target?.files?.[0];
			if (!file) return;
			if (!dimensions) return onChange(e);
			// Swal.fire(
			//   "Invalid Dimensions",
			//   `Please use ${dimensions.width}x${dimensions.height} images`,
			//   "warning"
			// );
		} catch (error) { }
	};

	return (
		<>
			<Avatar
				variant={variant || "square"}
				src={
					value?.target?.files[0]
						? URL.createObjectURL(value?.target?.files[0])
						: value
				}
				className={className}
				sx={{
					height: height || 120,
					width: width || 120,
					cursor: "pointer",
				}}
				onClick={() => inputRef.current?.click()}
			>
				{!value ? (
					<div className="h-full w-full flex flex-col gap-4 items-center justify-center">
						<img className="w-20" src={CLOUD} alt="" />
						<small>{txtName}</small>
					</div>
				) : (
					<div className="flex justify-center items-center flex-col">
						<img className="rounded-md w-24" src={DOC} alt="" />
						<p className="text-sm font-semibold text-theme gap-3">
							Document Uploaded
						</p>
					</div>
				)}
			</Avatar>
			<input
				ref={inputRef}
				hidden
				type="file"
				onChange={handleImageChange}
				accept="image/*|.pdf|.doc"
			/>
		</>
	);
};

export default PhotoUpload;
