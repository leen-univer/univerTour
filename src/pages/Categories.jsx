import { formatCurrency } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Avatar } from "@mui/material";
import { useCategories } from "hooks";

const Categories = () => {
  const { categories } = useCategories();

  return (
    <section className="py-2">
      <MaterialTable
        title="Categories"
        isLoading={!categories}
        data={categories || []}
        columns={[
          {
            title: "#",
            field: "id",
            render: ({ index }) => index + 1,
            width: "5%",
            editable: "never",
          },
          { title: "Name", field: "name" },
          { title: "Number Of Products", field: "numberOfProducts" },
          { title: "Created At", field: "created_at" },
        ]}
        options={{
          exportAllData: true,
          exportMenu: [
            {
              label: "Export Categories Data In CSV",
              exportFunc: (cols, data) => ExportCsv(cols, data),
            },
            {
              label: "Export Categories Data In PDF",
              exportFunc: (cols, data) => ExportPdf(cols, data),
            },
          ],
          actionsColumnIndex: -1,
          addRowPosition: "first",
          selection: true,
        }}
        style={{
          boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          borderRadius: "8px",
        }}
        editable={{
          onRowDelete: async (oldData) => { },
          onRowAdd: async (newData) => { },
          onRowUpdate: async (newData, oldData) => { },
        }}
        actions={[
          {
            tooltip: "Remove All Selected Categories",
            icon: "delete",
            onClick: (evt, data) => console.log(data),
          },
        ]}
        detailPanel={({ rowData }) => (
          <MaterialTable
            title={`Products of ${rowData.name}`}
            data={rowData?.products}
            columns={[
              {
                title: "#",
                field: "id",
                render: ({ index }) => index + 1,
                width: "5%",
                editable: "never",
              },
              {
                title: "Image",
                field: "image",
                render: ({ image }) => (
                  <Avatar
                    src={image}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                ),
                width: "5%",
              },
              {
                title: "Title",
                field: "title",
              },
              {
                title: "Price",
                field: "price",
                render: ({ price }) => formatCurrency(price),
                width: "5%",
                type: "numeric",
              },
              { title: "Created At", field: "created_at", editable: "never" },
            ]}
          />
        )}
      />
    </section>
  );
};

export default Categories;
