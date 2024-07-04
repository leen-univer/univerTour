

import { useEffect, useState } from "react";
import ChatDrawer from "../adminchats/ChatDrawer";
import AdminChatBar from "./AdminCharBar";


const AdminChatLayout = ({ children }) => {
    const [data, setData] = useState([])
    useEffect(() => {
        localStorage.setItem('Data', JSON.stringify(data));
    }, [data]);

    return (
        <section className="admin-container ">
            <main className="relative w-full flex rounded-md bg-white shadow-[0_0.125rem_0.25rem_rgba(165,163,174,0.3)]">
                <section className=" w-full flex">
                    <div className="w-1/4"><ChatDrawer setData={setData} /></div>
                    <div className="w-3/4">
                        <AdminChatBar data={data} />
                        <div className="w-full h-[calc(100vh-13rem)] ">
                            {children}
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
};

export default AdminChatLayout;
