import { getArrFromObj } from '@ashirbad/js-core';
import ApartmentIcon from '@mui/icons-material/Apartment';
import RemoveIcon from '@mui/icons-material/Remove';
import { Container, Drawer, Tooltip } from '@mui/material';
import { database, storage } from 'configs';
import { useFetch } from 'hooks';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function SelectMultipleCities({ userData, open, setOpenAddImageDrawer }) {
    const [id, setId] = useState();
    const [countries] = useFetch(`Countries/`);
    const citiesArray = countries?.flatMap((country) =>
        getArrFromObj(country?.cities)
    );
console.log(userData)
    const [selectedCities, setSelectedCities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await database.ref(`Others/${userData?.uid}/${userData?.id}/selectedCities`).once('value');
                const selectedCitiesData = snapshot.val() || {};
                const cities = Object.keys(selectedCitiesData);
                setSelectedCities(cities);
            } catch (error) {
                console.error("Error fetching selected cities:", error);
            }
        };
        fetchData();
    }, [userData]);

    const toggleCitySelection = async (city, id) => {
        if (selectedCities.includes(id)) {
            // setSelectedCities(selectedCities.filter((item) => item !== id));
            database.ref(`Others/${userData?.uid}/${userData?.id}/selectedCities/${id}`).remove();
            Swal.fire('Removed!', `${city} has been removed.`, 'success');
        } else {
            setSelectedCities([...selectedCities, id]);
            try {
                await database.ref(`Others/${userData?.uid}/${userData?.id}/selectedCities/${id}`).set({city:city});
                Swal.fire('Added!', `${city} has been added.`, 'success');
            } catch (error) {
                console.error("Error adding city to database:", error);
                Swal.fire('Error!', 'Failed to add city. Please try again later.', 'error');
            }
        }
        setOpenAddImageDrawer(false);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={() => setOpenAddImageDrawer(false)}
        >
            <Container
                style={{
                    width: '25vw',
                    marginTop: '12vh',
                }}
            >
                <div className="text-2xl font-semibold">
                    Select Cities
                </div>
                <div className="flex flex-col gap-3">
                    {citiesArray?.map((data, i) => (
                        <Tooltip key={i} title={selectedCities.includes(data?.id) ? `Remove ${data?.cityName}` : `Add ${data?.cityName}`}>
                            <div
                                className={`border-b flex justify-between py-3 px-6 rounded-3xl hover:shadow cursor-pointer hover:bg-slate-100 ${selectedCities.includes(data?.id) && 'bg-gray-200'
                                    }`}
                                onClick={() => toggleCitySelection(data?.cityName, data?.id)}
                            >
                                <div>{data?.cityName}</div>
                                {selectedCities.includes(data?.id) ? (
                                    <ApartmentIcon className="text-green-500" />
                                ) : (
                                    <RemoveIcon className="text-red-500" />
                                )}
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </Container>
        </Drawer>
    );
}
