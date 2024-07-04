

import ChatBar from "./CharBar";

const ChatLayout = ({ children }) => {
    return (
        <section>
            <section className="admin-container ">
                <main className="relative w-full flex rounded-md bg-white shadow-[0_0.125rem_0.25rem_rgba(165,163,174,0.3)]">
                    <div className="w-full">
                        <ChatBar />
                        <div className="w-full h-[calc(100vh-13rem)] ">
                            {children}
                        </div>
                    </div>
                </main>
            </section>
        </section>
    );
};

export default ChatLayout;
