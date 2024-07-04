import { Avatar } from "@mui/material";
import AwayListener from "components/core/AwayListener";
import { useFetch } from "hooks";
import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function AdminChatBar({ data }) {
  // console.log(data);
  const [supportData] = useFetch(`Supports/${data?.uid}`);
  // console.log(supportData);

  const [isContentOpen, setIsContentOpen] = useState(false);
  return (
    <nav className="top-0 sticky z-10 rounded-t p-2">
      <section className=" h-14 w-full border-b ">
        <div className="w-full justify-between admin-container flex items-center h-full">
          <div className="flex gap-3 items-center">
            <Avatar
              src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg?w=740&t=st=1696504029~exp=1696504629~hmac=61ab3802cfb8832e7b3c070ff027fd27b04cbab2ed40c4a7288eaae37354a895"
              className={`rounded-full !w-10 !h-10 ${
                data ? "block" : "hidden"
              }`}
            ></Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-theme leading-4">
                {data?.universityName}
              </p>
              <p className="text-xs">{data?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5  rounded h-fit w-fit">
            <MenuItemsIcon
              setIsContentOpen={setIsContentOpen}
              isContentOpen={isContentOpen}
            />
          </div>
        </div>
      </section>
    </nav>
  );
}

const MenuItemsIcon = ({ setIsContentOpen, isContentOpen }) => {
  const dataArray = [
    {
      title: "View Contact",
    },
    {
      title: "Mute Notifications",
    },
    {
      title: "Block Contact",
    },
    {
      title: "Clear Chat",
    },
    {
      title: "Report",
    },
  ];
  return (
    <AwayListener
      onClickAway={() => setIsContentOpen(false)}
      open={isContentOpen}
    >
      <div className="relative text-primary-text cursor-pointer ">
        <HiOutlineDotsVertical
          className="text-xl rotate-90"
          onClick={() => setIsContentOpen((prevState) => !prevState)}
        />
        {isContentOpen && (
          <div className="absolute top-7 right-0 w-48 scale-100 origin-top-right bg-white rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-10  transition-all duration-200 ease-in-out">
            <div className="p-2">
              {dataArray.map((data, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <p className="flex items-center hover:bg-pink-blue/10 px-5 py-2  hover:text-pink-blue text-primary-text text-sm rounded-md">
                    {data?.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AwayListener>
  );
};
