
import ItemDashboard from "./ItemDashboard";
import { signOut } from "next-auth/react"

const ItemsDashboard = ({ item }) => {
  const { title, items } = item;
  return (
    <>
      <h5 className="text-sm leading-1 font-semibold uppercase text-contentColor dark:text-contentColor-dark bg-lightGrey5 dark:bg-whiteColor-dark p-10px pb-7px mt-5 mb-10px tracking-half">
        {title}
      </h5>
      <ul>
        {items?.map((item1, idx) => (
          <ItemDashboard key={idx} item={item1} />
        ))}
        <li className="flex hover:cursor-pointer items-center py-10px border-b border-borderColor dark:border-borderColor-dark">
          <div className="hover:text-primaryColor text-contentColor dark:text-contentColor-dark items-center dark:hover:text-primaryColor leading-1.8 flex gap-3 text-nowrap">
          <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              width="16" 
              height="24"
              className="feather feather-log-out"
            >
              <path d="M16 13v-2H7V9l-5 4 5 4v-2h9z"/>
              <path d="M20 3H12v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
            </svg>
            <button onClick={() => signOut()}>Logout</button>
          </div>

        </li>
      </ul>
    </>
  );
};

export default ItemsDashboard;

// import Link from 'next/link';
// import { useState } from 'react';

// const ItemDashboard = ({ item }) => {
//   const hasSubItems = item.subItems && item.subItems.length > 0;
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSubMenu = (e) => {
//     e.preventDefault(); // Prevent default link behavior if needed
//     setIsOpen(!isOpen);
//   };

//   return (
//     <li className="flex flex-col">
//       <div className="flex items-center py-2 border-b border-borderColor dark:border-borderColor-dark">
//         {item.icon}
//         <Link href={item.path || '#'}>
//           <div className="hover:text-primaryColor text-contentColor dark:text-contentColor-dark dark:hover:text-primaryColor leading-6 flex gap-3 text-nowrap">
//             {item.name}
//           </div>
//         </Link>
//         {hasSubItems && (
//           <button onClick={toggleSubMenu} className="ml-auto focus:outline-none">
//             {isOpen ? '▲' : '▼'}
//           </button>
//         )}
//       </div>
//       {hasSubItems && isOpen && (
//         <ul className="pl-4">
//           {item.subItems.map((subItem, idx) => (
//             <ItemDashboard key={idx} item={subItem} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// export default ItemDashboard;
