const FilterController = () => {
  return (
    <div className="basis-full lg:basis-[700px]">
      <ul
        className="filter-controllers flex flex-wrap sm:flex-nowrap justify-start lg:justify-end button-group filters-button-group"
        data-aos="fade-up"
      >
        <li>
          <button
            data-filter="*"
            className="is-checked dark:is-checked pr-5 md:pr-10 lg:pr-17px 2xl:pr-10 text-contentColor font-medium hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
          >
            All Courses
          </button>
        </li>
        <li>
          <button
            data-filter=".filter1"
            className="pr-5 md:pr-10 lg:pr-17px 2xl:pr-10 text-contentColor font-medium hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
          >
            Six Sigma
          </button>
        </li>
        <li>
          <button
            data-filter=".filter2"
            className="pr-5 md:pr-10 lg:pr-17px 2xl:pr-10 text-contentColor font-medium hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
          >
            Project Management
          </button>
        </li>
        <li>
          <button
            data-filter=".filter3"
            className="pr-5 md:pr-10 lg:pr-17px 2xl:pr-10 text-contentColor font-medium hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
          >
            Food & Safety
          </button>
        </li>
        <li>
          <button
            data-filter=".filter4"
            className="text-contentColor font-medium hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
          >
            Environmental Management
          </button>
        </li>
      </ul>
    </div>
  );
};

export default FilterController;
