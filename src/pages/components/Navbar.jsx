import { getArrFromObj } from "@ashirbad/js-core";
import { Autocomplete, Container, Link, TextField } from "@mui/material";
import { LOGO } from "assets";
import { BookingTimeModal } from "components/dialog";
import { useFetch } from "hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TemporaryDrawer from "./Drawer";

const Navbar = () => {
	const navigate = useNavigate();
	const [countries] = useFetch(`Countries/`);
	const citiesArray = countries?.flatMap((country) =>
		getArrFromObj(country?.cities)
	);
	// console.log(citiesArray, "citiesArray")

	// const { snackBarOpen } = useAppContext();
	const [openDialog, setOpenDialog] = useState(false);
	const [isCity, setIsCity] = useState()
	const handleCitySelection = (event, newValue) => {
		setOpenDialog(true)
		setIsCity(newValue)

		// console.log("Selected cities:", newValue);
		// Add your logic here for handling the selected cities
	};
	// console.log(isCity, "city")

	return (
		<Container>
			<BookingTimeModal isCity={isCity} openDialog={openDialog} handleClose={() => setOpenDialog(false)} />
			<div className="navbar-body">
				<div className="nav-container">
					<span>
						<img src={LOGO} alt="logo" className="image-logo" />
					</span>
					<TemporaryDrawer />
				</div>
				<div className="nav-container">
					<div className="example">
						<Autocomplete
							fullWidth
							multiple={false}
							limitTags={1}
							id="cities-autocomplete"
							className="example"
							options={citiesArray || []}
							getOptionLabel={(option) => option?.cityName || ""}
							onChange={handleCitySelection}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Cities"
									placeholder="Select cities"
									className="example"
								/>
							)}
						/>
					</div>
					<div className="left-nav display">
						<Link className="nav-link change_new_clr" href="">
							Home
						</Link>
					</div>

					<div className="right-nav display">
						<a href="#ContactUs" className="nav-link change_new_clr ">
							Contact Us
						</a>
						<div
							className="btn-outlined change_new_clr"
							onClick={() => navigate("/login")}
						>
							Login
						</div>
						<div
							className="btn-container change_new_bg_clr"
							onClick={() => navigate("/university-register")}
						>
							Register
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default Navbar;
