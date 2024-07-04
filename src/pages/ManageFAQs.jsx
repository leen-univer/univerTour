import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";

import { Container, Typography } from "@mui/material";
import { useFAQs } from "hooks";

const ManageFAQs = () => {
  const { faqs } = useFAQs();
  return (
    <section className="py-2">
      <MaterialTable
        isLoading={!faqs}
        title="Manage FAQs"
        data={faqs || []}
        columns={[
          {
            title: "#",
            field: "id",
            render: ({ id }) => id + 1,
            width: "5%",
            editable: "never",
          },
          { title: "Question", field: "question" },
          { title: "Answer", field: "correct_answer" },
        ]}
        detailPanel={({ rowData }) => (
          <section className="py-2">
            <Container>
              <Typography variant="h6" gutterBottom>
                {rowData?.question}
              </Typography>
              <Typography variant="body1">{rowData?.correct_answer}</Typography>
            </Container>
          </section>
        )}
        options={{
          exportAllData: true,
          exportMenu: [
            {
              label: "Export FAQs Data In CSV",
              exportFunc: (cols, data) => ExportCsv(cols, data),
            },
            {
              label: "Export FAQs Data In PDF",
              exportFunc: (cols, data) => ExportPdf(cols, data),
            },
          ],
          actionsColumnIndex: -1,
          addRowPosition: "first",
          selection: true,
        }}
        editable={{
          onRowAdd: async (newData) => {
            console.log(newData);
          },
          onRowUpdate: async (newData, oldData) => {
            console.log(newData, oldData);
          },
          onRowDelete: async (oldData) => {
            console.log(oldData);
          },
        }}
        actions={[
          {
            tooltip: "Remove All Selected FAQs",
            icon: "delete",
            onClick: (evt, data) => console.log(data),
          },
        ]}
        style={{
          boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          borderRadius: "8px",
        }}
      />
    </section>
  );
};

export default ManageFAQs;
