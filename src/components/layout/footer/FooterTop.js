import useIsSecondary from "@/hooks/useIsSecondary";
import FooterTopLeft from "./FooterTopLeft";

const FooterTop = () => {
	const { isSecondary } = useIsSecondary();

	const handleSubmit = (e) => {
		e.preventDefault();
		window.location.href = "/contact-us-form";
	};

	return (
		<section>
			<div
				className={`grid grid-cols-1 md:grid-cols-2 md:gap-y-0 items-center pb-45px border-b border-darkcolor ${
					isSecondary ? "gap-y-5" : "gap-y-30px"
				}`}
			>
				<FooterTopLeft />
				<div data-aos="fade-up">
					<form
						onSubmit={handleSubmit}
						className="max-w-form-xl md:max-w-form-md lg:max-w-form-lg xl:max-w-form-xl 2xl:max-w-form-2xl bg-deepgray ml-auto rounded relative h-62px"
					>
						<button
							type="submit"
							className="w-full px-3 md:px-10px lg:px-5 bg-primaryColor hover:bg-deepgray text-xs lg:text-size-15 text-whiteColor border border-primaryColor block rounded h-full"
						>
							Contact Us | training@meqmp.com
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default FooterTop;
