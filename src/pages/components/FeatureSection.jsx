import { Container, Typography } from "@mui/material";

const FeatureSection = ({ title, descripton, isReversed, img }) => {
	return (
		<div className="">
			<>
				<div className="all-sections">
					<section
						className={
							isReversed ? "section-first-part" : "section-middle-part"
						}
					>
						<Container
							className={
								isReversed ? "section-first-part" : "section-middle-part"
							}
						>
							<div className="left-section-div">
								<Typography
									variant="h3"
									className="change_new_clr left-section-title-text"
								>
									{title}
								</Typography>
								<Typography
									variant="h6"
									className="section-para change_new_clr_text"
								>
									{descripton}
								</Typography>
							</div>
							<div className="right-section-div">
								<img src={img} alt="teaching" />
							</div>
						</Container>
					</section>
				</div>
			</>
		</div>
	);
};

export default FeatureSection;
