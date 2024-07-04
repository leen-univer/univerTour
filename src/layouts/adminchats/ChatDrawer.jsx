// import { AwayListener } from "@/components";
import { Avatar, Tooltip } from "@mui/material";
import { LOGO } from "assets";
import AwayListener from "components/core/AwayListener";
import { database } from "configs";
import { useAppContext } from "contexts";
import { useFetch, useSupports } from "hooks";
import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function ChatDrawer({ setData }) {
  const chatDrawerArray = [
    {
      src: "/admin/client/chat-with-girl.png",
      name: "University of Essex",
      subject: "Marium Passport",
      email: "r.khoury@essex.ac.uk",
      time: "5 min",
    },
    {
      src: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg?w=740&t=st=1696504029~exp=1696504629~hmac=61ab3802cfb8832e7b3c070ff027fd27b04cbab2ed40c4a7288eaae37354a895",
      name: "University Of Leicester",
      subject: "new sub....",
      email: "kiit@gmail.com",
      time: "10 min",
    },
    {
      src: "",
      name: "Test School",
      subject: "new subject  ....",
      email: "test@gmail.com",
      time: "5 min",
    },
    {
      src: "",
      name: "KIIT",
      subject: "Subject Title....",
      email: "test@gmail.com",
      time: "5 min",
    },
    {
      src: "",
      name: "KIIT",
      subject: "Subject Review....",
      email: "test23@gmail.com",
      time: "5 min",
    },
    {
      src: "",
      name: "Test School",
      subject: "new subject  ....",
      email: "test@gmail.com",
      time: "5 min",
    },
    {
      src: "",
      name: "KIIT",
      subject: "Subject Title....",
      email: "test@gmail.com",
      time: "5 min",
    },
    {
      src: "",
      name: "KIIT",
      subject: "Subject Review....",
      email: "test23@gmail.com",
      time: "5 min",
    },
  ];

  const [isContentOpen, setIsContentOpen] = useState(false);
  const { user } = useAppContext();
  const { supports } = useSupports();
  // console.log(supports, "supports")

  // const [data] = useFetch(
  //     `/Supports/${data?.userId}`
  //   );
  //   console.log(support);

  const [support] = useFetch(`/Supports`, { needArray: true });
  const [supportDatas] = useFetch(`/Supports`);


  console.log(support, "support");
  const unseenData = {};
  if (support?.length > 0) {
    support?.filter((item) => {
      if (item && typeof Object.values(item) === "object") {
            let count=0;
            Object.values(item).map((data,index) => {
                if(data?.read ==="unSeen"){
                    count=count+1;
                }
            });
            unseenData[item.id]=count;
        
      }
    });
  }
  console.log(unseenData)
  const supportData = [];
  if (support?.length > 0) {
    for (let key of support) {
      if (key && typeof Object.values(key) === "object") {
        Object.values(key).map((item) => {
          console.log(item, "abc");
          typeof item != "string" &&
            !supportData.find((cur) => cur?.email === item?.email) &&
            supportData.push(item);
        });
      }
    }
  }
  console.log(supportData, "abc");


  const recordData = [];

  if (support?.length > 0) {
    for (let key of support) {
      if (key && typeof Object.values(key) === "object") {
        Object.values(key).forEach((item) => {
            recordData.push(item); // Push each item into the data array
          console.log(item, "abc");
        });
      }
    }
  }
  
  console.log(recordData,"recordData");


  const handleSubmit = async (data) => {
    console.log(data, "abc");
  
    if (Array.isArray(recordData)) {
      recordData.forEach((item) => {
        console.log(item, "item");
        if (data?.userId === item?.userId) {
          const updatedData = {
            ...item,
            read: "seen",
          };
  
          database.ref(`/Supports/${data?.userId}/${item?.id}`)
            .update(updatedData);
        }
      });
    }
  
    const latestUpdatedItem = recordData.find((item) => data?.userId === item?.userId);
    if (latestUpdatedItem) {
      const latestUpdatedData = {
        ...latestUpdatedItem,
        read: "seen",
      };
      setData(latestUpdatedData);
    }
  };
  
  
  
  


  return (
    <section>
      <div className="flex flex-col h-[calc(100vh-9rem)] relative border-r">
        <div className="z-10 sticky top-0 w-full items-center h-16 p-4 border-b">
          <div className="flex justify-between items-center ">
            <div className="flex gap-2 items-start">
              <Avatar src={LOGO} className="rounded-full !w-10 !h-10 " />
              <div className="flex flex-col">
                <p className="text-lg font-medium">{user?.displayName}</p>
                {/* <p className="text-sm font-medium text-gray-500 ">
                                    {user?.email}

                                </p> */}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {/* <Tooltip title="New Chat">
                                <div>
                                    <MdAddComment className="text-2xl text-theme" />
                                </div>
                            </Tooltip> */}
              <Tooltip title="More">
                <MenuItemsIcon
                  setIsContentOpen={setIsContentOpen}
                  isContentOpen={isContentOpen}
                />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4 overflow-hidden overflow-y-scroll">
          <h2 className="text-theme text-lg ">University Support</h2>
          <div className="flex flex-col gap-1">
            {supportData?.map((data, i) => (
              <div
                key={i}
                onClick={() => handleSubmit(data)}
                className="flex justify-between rounded-md hover:bg-gray-100 cursor-pointer p-2 border-b shadow-sm"
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="w-fit h-fit col-span-2">
                    <Avatar
                      src="/adminchatavatar.avif"
                      className="rounded-full !w-10 !h-10"
                    ></Avatar>
                    {/* {console.log(data)} */}
                  </div>
                  <div className="flex flex-col col-span-8 pl-1.5">
                    <p className="font-medium text-sm text-primary-text">
                      {data?.universityName}
                    </p>
                    <p className="text-xs opacity-60">{data?.email}</p>
                  </div>

                    <div className="bg-green-500 col-span-1 text-center text-xs text-white ">
                      {data.unseenMessages}
                    </div>
                </div>
                <div className="flex justify-end h-fit text-xs">
                {Object.entries(unseenData).map(([key, value], index) => {
                    if (key === data?.userId) {
                    // console.log(key, value);
                    return (
                        <div key={index} className={`${value === 0 ? null : "text-white bg-green-500 px-1 shadow-xl rounded-full"}`}>
                        {value === 0 ? null : value}
                        </div>
                    );
                    }
                    return null; 
                })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const MenuItemsIcon = ({ setIsContentOpen, isContentOpen }) => {
  const dataArray = [
    {
      title: "Profile",
      path: "/account-setting",
    },
    {
      title: "Settings",
    },
    {
      title: "Log out",
    },
  ];
  return (
    <AwayListener
      onClickAway={() => setIsContentOpen(false)}
      open={isContentOpen}
    >
      <div className="relative text-theme cursor-pointer">
        <HiOutlineDotsVertical
          className="text-2xl"
          onClick={() => setIsContentOpen((prevState) => !prevState)}
        />
        {isContentOpen && (
          <div className="absolute top-7 right-0 w-48 scale-100 origin-top-right bg-white rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-10  transition-all duration-200 ease-in-out">
            <div className="p-2">
              {dataArray.map((data, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 hover:bg-blue-100 rounded"
                >
                  <Tooltip title={data?.title}>
                    <p className="flex items-center hover:bg-pink-blue/10 px-5 py-2  text-black text-sm rounded-md">
                      {data?.title}
                    </p>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AwayListener>
  );
};
