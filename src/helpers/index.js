
import jsPDF from "jspdf";
import "jspdf-autotable";
export const getImageSize = (url) => {
  const img = document.createElement("img");
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () =>
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.onerror = reject;
  });
};


export const generatePDF=(data)=> {
  const doc = new jsPDF();
  
  const headers = Object.keys(data[0]); // Get column headers from the first object
  
  const tableData = data.map(obj => Object.values(obj)); // Convert objects to array of values

  doc.autoTable({
    head: [headers], // Add the headers as the first row
    body: tableData, // Add the data rows
  });

  doc.save("Events.pdf");
}

