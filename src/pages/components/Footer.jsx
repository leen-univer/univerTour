import { Container, Link } from "@mui/material";
import image from "../assets/white_logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

const Footer = () => {
	const navigate = useNavigate();
	return (
		<>
			<footer className="main-footer-container">
				<Container className="container-class">
					<div className="footer-title footer-title-1">
						<div className="footer-title-and-logo">
							<span>
								<img src={image} alt="logo" className="footer-image-logo" />
							</span>
							<h1 className="footer-logo-name font-weight-600">Univer Tours</h1>
						</div>
						<div>
							<div className="icon-container">
								<a
									href="https://www.linkedin.com/company/univerplatform"
									target="_blank"
									rel="noreferrer"
									style={{ color: "#fff" }}
								>
									<LinkedInIcon className="icon-style" />
								</a>
								<a
									href="https://www.facebook.com/univerplatform"
									target="_blank"
									rel="noreferrer"
									style={{ color: "#fff" }}
								>
									<FacebookIcon className="icon-style" />
								</a>
								<a
									href="https://www.instagram.com/univerplatform"
									target="_blank"
									rel="noreferrer"
									style={{ color: "#fff" }}
								>
									<InstagramIcon className="icon-style" />
								</a>
								<a
									href="https://twitter.com/univerplatform"
									target="_blank"
									rel="noreferrer"
									style={{ color: "#fff" }}
								>
									<TwitterIcon className="icon-style" />
								</a>
							</div>
						</div>
					</div>

					<div className="footer-title footer-title-2">
						<h2 className="font-weight-600">Quick Links</h2>
						<ul className="footer-link-ul">
							<li className="footer-link-li">
								<Link href="#" className="footer-link-a">
									Home
								</Link>
							</li>

							<li className="footer-link-li">
								<a href="#ContactUs" className="footer-link-a">
									Contact Us
								</a>
							</li>
						</ul>
					</div>

					<div className="footer-title footer-title-3">
						<h2 className="font-weight-600 footer-title-3-h1">
							Like Being Future Ready ?
						</h2>
						<Button
							className="new_clr_btn_bg mui-btn"
							variant="contained"
							type="submit"
							color="warning"
							onClick={() => navigate("/university-register")}
							sx={{ color: "snow", marginTop: "3vh" }}
						>
							Register With Us
						</Button>
					</div>
				</Container>
				<hr />
				<div className="footer-ending-title">
					&copy; Copyright {new Date(Date.now()).getFullYear()} Univer Tours.
					All right reserved.
				</div>
			</footer>
		</>
	);
};

export default Footer;
