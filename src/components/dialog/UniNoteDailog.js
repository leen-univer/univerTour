import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, Tooltip } from "@mui/material";
import { useAppContext } from 'contexts';
import { useState } from 'react';
import AddNoteDailog from './AddNoteDailog';

const UniNoteDailog = ({ handleClose, addReview }) => {
    const { user } = useAppContext();
    console.log(user, "user")

    const [open, isOpen] = useState(false);
    const [setNoteValues] = useState(null);
    const [notes, setNotes] = useState([]); // State to store submitted notes

    const handleNoteSubmit = (values) => {
        setNotes(prevNotes => [...prevNotes, values]); // Add the new note to the notes array
        setNoteValues(null); // Reset noteValues state
        isOpen(false); // Close the dialog after form submission
    };
    const handleEdit = () => {

    }
    const handleDelete = () => {

    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={addReview}
            maxWidth="sm"
            fullWidth
            className=""
        >
            <section className="p-5 flex flex-col gap-5 h-[25rem]">
                <div className="flex justify-between items-center">
                    <h1 className="text-center text-xl font-bold text-theme tracking-wide">
                        Review
                    </h1>
                    <button className="bg-theme text-white p-2 rounded-md text-sm flex items-center" onClick={() => isOpen(prev => !prev)}>
                        <AddIcon className='text-xs' />
                        Add New Note</button>
                </div>
                <hr />

                <AddNoteDailog handleClose={() => isOpen(false)} addReview={open} onSubmit={handleNoteSubmit} />

                {notes.length > 0 && (
                    <div className='w-full flex flex-col gap-2 h-80 overflow-y-scroll example'>
                        {notes.map((note, index) => (
                            <div key={index} className=' rounded  px-3 py-2  bg-purple-50 flex flex-col gap-2  border-l-4  border-purple-400'>
                                <div className='flex justify-between items-end'>
                                    <h2 className='flex gap-2 items-center text-sm'><span className='font-semibold text-gray-500'>Note by : </span> <span className='font-semibold'> Super Admin</span></h2>
                                    <p className='text-xs font-semibold text-gray-400'>20 hour ago</p>
                                </div>
                                <div className='w-full border-2 border-b border-dashed border-purple-500'></div>
                                <p className='text-gray-500'>{note.review}</p>
                                <div className='flex items-end justify-end gap-1 text-xs'>
                                    {/* <Tooltip title="Edit">
                                        <div className='cursor-pointer  text-xs ' onClick={handleEdit}><EditIcon className='text-xs' /></div>
                                    </Tooltip> */}
                                    <Tooltip title="Delete">
                                        <div className='cursor-pointer  text-xs ' onClick={handleDelete}><DeleteIcon className='text-xs' />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }
            </section >
        </Dialog >
    );
}

export default UniNoteDailog;
