import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
import { database } from "configs";
import { useAppContext } from "contexts";
import { useFetch } from "hooks";
import moment from "moment";
import Swal from "sweetalert2";

const Users = () => {
    const [data] = useFetch("/Users");
    

    console.log(data)
    const handleDeleteRow = (rowData) => {
        Swal.fire({
            title: "Are you sure you ?",
            text: "You will not be able to recover this user!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted!", "The user has been deleted.", "success");
            }
        });
    };

    return (
        <section className="py-5">
            <MaterialTable
                data={
                    data === null
                        ? []
                        : data?.filter((item) => item?.role === 'multiadmin')
                        .map((item, index) => ({
                            ...item,
                            sl: index + 1,
                        }))
                }
                title="All Admin Users"
                columns={[
                    { title: "#", field: "sl", editable: "never", width: "10%" },
                    { title: "Name", field: "displayName" },
                    { title: "Email", field: "email", export: true },
                    { title: "Password", field: "password", export: true },
                    {
                        title: "Created At",
                        field: "timestamp",
                        emptyValue: "--",
                        editable: "never",
                        render: ({ timestamp }) => moment(new Date(timestamp)).fromNow(),
                    },
        
                ]}
                options={{
                    detailPanelColumnAlignment: "right",
                    exportAllData: true,
                    addRowPosition: "first",
                    headerStyle: {
                        backgroundColor: "#f2f2f2",
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "14px",
                    },
                    exportMenu: [
                        {
                            label: "Export Users Data In CSV",
                            exportFunc: (cols, data) => ExportCsv(cols, data),
                        },
                    ],
                    actionsColumnIndex: -1,
                }}
                style={{
                    boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
                    borderRadius: "8px",
                }}
                editable={{
                    onRowAdd: async (newData) => {
                        const pushKey = database.ref('Users').push().key
                        const dbRef = `Users/${pushKey}`
                        const updatedData = {
                            ...newData,
                            role: "multiadmin",
                            timestamp: new Date().toString(),
                            updatedAt: new Date().toString(),
                            }
            
                            await database.ref(dbRef).update(updatedData)
                            Swal.fire('Success!', 'Multi Admin Added Successfully', 'success')
                        },
                        onRowUpdate: async (newData, oldData) => {
                            const dbRef = `Users/${oldData?.id}`
                            await database.ref(dbRef).update({
                            ...newData,
                            tableData: {},
                            updatedAt: new Date().toString(),
                            })
                            Swal.fire('Success!', 'Multi Admin Updated Successfully', 'success')
                        },
                        onRowDelete: async (oldData) => {
                            await database.ref(`Users/${oldData.id}`).remove()
                            Swal.fire('Success!', 'Multi Admin Deleted Successfully', 'success')
                        },
                }}
            />
        </section>
    );
};

export default Users;
