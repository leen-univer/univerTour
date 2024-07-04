import MaterialTable from '@material-table/core';
import { useUniversities } from 'hooks';
import { useParams } from 'react-router-dom';

const ProfileVisit = () => {
    const { universityId } = useParams();
    const { universities } = useUniversities();
    const university = universities.find((univ) => univ.id === universityId);
    console.log(university, "university");

    return (
        <div className='h-screen flex flex-col gap-5 justify-center items-center'>
            <h1 className='text-4xl font-semibold text-theme'>University Details</h1>
            <div className=''>
                <MaterialTable
                    data={university ? [university] : []}
                    title=""
                    columns={[
                        { title: "Name", field: "displayName" },
                        { title: "Email", field: "email" },
                        { title: "Phone Number", field: "phoneNumber" },
                        { title: "Contact Name", field: "contactName" },
                        { title: "Location", field: "location" },
                        {
                            title: "Website",
                            field: "website",
                            render: ({ website }) => (
                                <a href={website} target="_blank" rel="noopener noreferrer">
                                    {website}
                                </a>
                            ),
                        },
                        { title: "Country", field: "country" },
                    ]}
                    options={{
                        paging: false, // Disable pagination
                        search: false, // Disable search if not needed
                    }}
                />
            </div>
        </div>
    );
};

export default ProfileVisit;
