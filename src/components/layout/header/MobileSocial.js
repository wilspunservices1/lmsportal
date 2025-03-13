import Link from "next/link";
import React from "react";

const MobileSocial = () => {
  return (
    <div>
      <ul className="flex gap-6 items-center mb-5">
        <li>
          <Link className="facebook" href="https://www.facebook.com/meqmp.net/">
            <i className="icofont icofont-facebook text-fb-color dark:text-whiteColor dark:hover:text-secondaryColor"></i>
          </Link>
        </li>
        <li>
          <Link className="instagram" href="https://www.linkedin.com/company/meridian-quality-management/">
            <i className="icofont icofont-linkedin dark:text-whiteColor dark:hover:text-secondaryColor"></i>
          </Link>
        </li>
        <li>
          <Link className="google" href="https://www.youtube.com/@MeridianQMP">
            <i className="icofont icofont-youtube-play dark:text-whiteColor dark:hover:text-secondaryColor"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileSocial;
