import { NODATA } from "assets";

const NoDatas = ({ title = "No data found..." }) => {
	return (
		<div className="flex w-full flex-col items-center gap-2 py-8">
			<img className="h-12 object-contain" src={NODATA} alt="img" />
			<h1 className="text-sm tracking-wide">{title}</h1>
		</div>
	);
};

export default NoDatas;
