import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, Tooltip } from "@mui/material";
import { useAppContext } from 'contexts';
import { useState, useEffect } from 'react';
import AddNoteDailog from './AddNoteDailog';
import { auth, database } from "configs";
import moment from 'moment';

const UniNoteDailog = ({ handleClose, addReview, rowData }) => {

    if (!rowData || !addReview) {
        return null; // لا تعرض أي شيء إذا كانت القيم فارغة
    }
    const { user } = useAppContext();
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventName, setEventName] = useState('');

    useEffect(() => {
        if (addReview) {
            console.log('Opening dialog for addReview:', addReview);
            console.log('Current user UID:', auth?.currentUser?.uid);
            console.log("Row data:", rowData);
            fetchEventName();
            fetchNotes();
            logAllData();
        }

        return () => {
            const notesRef = database.ref(`NewFairs/${addReview}/notes`);
            notesRef.off();
        };
    }, [addReview]);

    const fetchEventName = async () => {
        if (!addReview) return;

        setLoading(true);
        setError(null);

        try {
            console.log('Fetching event name for addReview:', addReview);
            const eventRef = database.ref(`NewFairs/${addReview}/displayName`);
            const snapshot = await eventRef.once('value');
            const eventNameData = snapshot.val();
            console.log('Fetched event name data:', eventNameData);

            if (eventNameData) {
                setEventName(eventNameData);
            } else {
                setEventName('Unknown Event');
                console.warn('Event name not found for addReview:', addReview);
            }
        } catch (error) {
            console.error('Error fetching event name:', error);
            setError('Error fetching event name.');
        } finally {
            setLoading(false);
        }
    };

    const fetchNotes = async () => {
        if (!addReview) return;

        setLoading(true);
        setError(null);

        try {
            console.log('Fetching notes for addReview:', addReview);
            const notesRef = database.ref(`NewFairs/${addReview}/notes`);
            const snapshot = await notesRef.once('value');
            const notesData = snapshot.val();
            console.log('Fetched notes data:', notesData);

            const notesArray = Object.entries(notesData || {})
                .map(([key, note]) => ({ id: key, ...note }))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setNotes(notesArray);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setError('Error fetching notes.');
        } finally {
            setLoading(false);
        }
    };

    const handleNoteSubmit = async (values) => {
        if (!addReview || !rowData) return;

        const newNoteRef = database.ref(`NewFairs/${addReview}/notes`).push();
        const noteWithTimestamp = {
            ...values,
            timestamp: new Date().toISOString(),
            userId: user.uid,
        };

        console.log('Submitting note:', noteWithTimestamp);
        try {
            await newNoteRef.set(noteWithTimestamp);
            fetchNotes();
            setOpen(false);
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleDelete = async (id) => {
        console.log('Deleting note with id:', id);
        try {
            await database.ref(`NewFairs/${addReview}/notes/${id}`).remove();
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const logAllData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching all data from /NewFairs');
            const allFairsRef = database.ref('NewFairs');
            const snapshot = await allFairsRef.once('value');
            const allFairsData = snapshot.val();
            console.log('Fetched all fairs data:', allFairsData);

            if (addReview) {
                console.log(`Fetching data for eventId: ${addReview}`);
                const eventRef = database.ref(`NewFairs/${addReview}`);
                const eventSnapshot = await eventRef.once('value');
                const eventData = eventSnapshot.val();
                console.log(`Fetched event data for eventId ${addReview}:`, eventData);
            }
        } catch (error) {
            console.error('Error fetching all data:', error);
            setError('Error fetching data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            onClose={handleClose}
            open={Boolean(addReview)}
            maxWidth="sm"
            fullWidth
        >
            <section className="p-5 flex flex-col gap-5 h-[25rem]">
                <div className="flex justify-between items-center">
                    <h1 className="text-center text-xl font-bold text-theme tracking-wide">
                        Notes for Event: {loading ? 'Loading...' : eventName}
                    </h1>
                    <button
                        className="bg-theme text-white p-2 rounded-md text-sm flex items-center"
                        onClick={() => setOpen(true)}
                        type="button"
                    >
                        <AddIcon className='text-xs' />
                        Add New Note
                    </button>
                </div>
                <hr />
    
                <AddNoteDailog handleClose={() => setOpen(false)} addReview={open} onSubmit={handleNoteSubmit} />
    
                {loading && <p>Loading notes...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {notes.length > 0 && (
                    <div className='w-full flex flex-col gap-2 h-80 overflow-y-scroll'>
                        {notes.map(note => (
                            <div key={note.id} className='rounded px-3 py-2 bg-purple-50 flex flex-col gap-2 border-l-4 border-purple-400'>
                                <div className='flex justify-between items-end'>
                                    <h2 className='flex gap-2 items-center text-sm'>
                                        <span className='font-semibold text-gray-500'>Note by : </span>
                                        <span className='font-semibold'>{note.authorName}</span>
                                    </h2>
                                    <p className='text-xs font-semibold text-gray-400'>{moment(note.timestamp).fromNow()}</p>
                                </div>
                                <div className='w-full border-2 border-b border-dashed border-purple-500'></div>
                                <p className='text-gray-500'>{note.review ? note.review : 'No review available'}</p>
                                <div className='flex items-end justify-end gap-1 text-xs'>
                                    <Tooltip title="Delete" placement="bottom-end">
                                        <DeleteIcon
                                            className='text-purple-400 cursor-pointer hover:text-purple-600'
                                            onClick={() => handleDelete(note.id)}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </Dialog>
    );
    
};

export default UniNoteDailog;
