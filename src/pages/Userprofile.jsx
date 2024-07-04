// UserProfile.js

import { useParams } from 'react-router-dom';

function UserProfile() {
    const { userId } = useParams();

    // Fetch user data based on userId
    // You can make an API call here to get the user's data

    return (
        <div>
            <h1>User Profile</h1>
            <p>User ID: {userId}</p>
            {/* Display user's profile data */}
        </div>
    );
}

export default UserProfile;
