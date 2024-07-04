import { TextInput } from 'components/core';
import { ErrorMessage, Form, Formik } from 'formik';
import { useState } from 'react';

const App = () => {
    const [folders, setFolders] = useState([]);
    const [showFolderInputs, setShowFolderInputs] = useState(false);
    // const [folderName, setFolderName] = useState('');
    // const [folderImage, setFolderImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateFolderClick = () => {
        setShowFolderInputs(true);
    };

    const handleFolderNameChange = () => {
        // setFolderName(event.target.value);
        setErrorMessage('');
    };



    const handleCreateFolder = (values, { setSubmitting }) => {
        const isDuplicate = folders.some((folder) => folder.name === values.folderName);
        if (isDuplicate) {
            setErrorMessage('Folder with the same name already exists.');
            setSubmitting(false);
            return;
        }

        // Perform folder creation logic here
        const newFolder = { name: values.folderName };
        setFolders([...folders, newFolder]);

        // Reset form and hide folder inputs
        setSubmitting(false);
        setShowFolderInputs(false);
        setErrorMessage('');

    };

    return (
        <div>
            <h1>My Folders</h1>
            {showFolderInputs && (
                <Formik
                    initialValues={{ folderName: '' }}
                    onSubmit={handleCreateFolder}
                >
                    {({ isSubmitting }) => (
                        <Form onChange={handleFolderNameChange}>
                            <TextInput

                                name="folderName"
                                label="Folder Name"
                                type="text"
                                startIcon=""


                            />
                            <ErrorMessage name="folderName" component="div" className="text-red-500" />

                            <button type="submit" disabled={isSubmitting}>
                                Create Folder
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            {!showFolderInputs && <button onClick={handleCreateFolderClick}>Create Folder</button>}
            <ul>
                {folders.map((folder, index) => (
                    <li key={index}>
                        {/* <img src={folder.image} alt={folder.name} /> */}
                        {folder.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
