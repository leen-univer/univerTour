import { formatCurrency } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
// import ExportPdf from "@material-table/exporters/pdf";
// import ExportCsv from "@material-table/exporters/csv";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Avatar, Container, Typography } from "@mui/material";
import { PhotoUpload } from "components/core";
import { useCategories, useProducts } from "hooks";

const Products = () => {
  const { products } = useProducts();
  const { categories } = useCategories();

  return (
    <section className="py-2">
      <MaterialTable
        title="Products"
        isLoading={!products}
        data={products || []}
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
            editComponent: ({ value, onChange }) => (
              <PhotoUpload
                value={value}
                onChange={onChange}
                dimensions={{
                  width: 1280,
                  height: 720,
                }}
              />
            ),
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
          {
            title: "Category",
            field: "category",
            width: "15%",
            lookup: categories?.reduce((acc, category) => {
              acc[category?.name] = category?.name;
              return acc;
            }, {}),
          },
          { title: "Created At", field: "created_at", editable: "never" },
        ]}
        detailPanel={({ rowData }) => (
          <section className="py-2">
            <Container>
              <Typography variant="h6" gutterBottom>
                {rowData?.title}
              </Typography>
              <Typography variant="body1">{rowData?.description}</Typography>
            </Container>
          </section>
        )}
        options={{
          exportAllData: true,
          exportMenu: [
            {
              label: "Export Products Data In CSV",
              exportFunc: (cols, data) => ExportCsv(cols, data),
            },
            {
              label: "Export Products Data In PDF",
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
          onRowDelete: async (oldData) => {
            console.log(oldData);
          },
          onRowAdd: async (newData) => {
            console.log(newData);
          },
          onRowUpdate: async (newData, oldData) => {
            console.log(newData, oldData);
          },
        }}
        actions={[
          {
            tooltip: "Remove All Selected Products",
            icon: "delete",
            onClick: (evt, data) => console.log(data),
          },
        ]}
      />
    </section>
  );
};

export default Products;
