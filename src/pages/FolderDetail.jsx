import { Add } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import FolderLightBox from "components/core/FolderLightBox";
import FolderAddImageDrawer from "components/drawer/FolderAddImageDrawer";
import { useAppContext } from "contexts";
import { useFetch } from "hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FolderDetail() {
    const [folderData, setFolderData] = useState()
    const { folderIndex } = useParams();
    const [openAddImageDrawer, setOpenAddImageDrawer] = useState(false)
    const { user } = useAppContext();
    const [filterText, setFilterText] = useState("");
    // const [images] = useFetch(`Images`);
    const [folder] = useFetch(`Folder`)
    console.log(folder, "folder")
    //     const map = () = {
    //         folder?.map((item) => (
    //             item?.id === folderIndex
    //         ))
    // }

    useEffect(() => {
        if (folder && folderIndex !== undefined) {
            folder.forEach(item => {
                if (item?.id === folderIndex) {
                    console.log(item);
                    setFolderData(item)
                }
            });
        }
    }, [folder, folderIndex, folderData]);

    console.log(folderData, "FolderData")



    return (
        <>
            <FolderAddImageDrawer
                open={openAddImageDrawer}
                setOpenAddImageDrawer={setOpenAddImageDrawer}
                folderId={folderData?.id}
            />
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">{folderData?.folderName}</h1>
                    <div className="flex gap-2 items-center">
                        <div>
                            {user?.role === "superadmin" && (
                                <div className="w-40">
                                    <Button
                                        fullWidth
                                        onClick={() => setOpenAddImageDrawer(true)}
                                        className="!bg-theme text-xs md:!text-sm !py-3"
                                        variant="contained"
                                        startIcon={<Add />}
                                    >
                                        ADD PHOTOS
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="w-80">
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by tags"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <FolderLightBox
                    folderIdData={folderData?.id}
                    images={folderData
                        ? Object.entries(folderData) // Use Object.entries to iterate over key-value pairs
                            .filter(([key, item]) => typeof item === "object" && item.hasOwnProperty("imageURL"))
                            .filter(([key, item]) => {
                                const tag = item.tags;
                                const filter = filterText?.toLowerCase();
                                return filter === "" || (tag && tag.includes(filter));
                            })
                            .sort(([keyA, itemA], [keyB, itemB]) => new Date(itemB?.timestamp) - new Date(itemA?.timestamp)) // Sorting by timestamp
                            .map(([key, item]) => ({
                                id: key, // Set the key as the id
                                imageURL: item.imageURL,
                                folderId: item.folderId,
                                tags: item.tags
                            }))
                        : []}
                />


            </div>

        </>
    )
}
