import html2pdf from 'html2pdf.js'

export const pdfGenerator = (id,fileName) => {
    const domElement = document.getElementById(id)
    const cloneElement = domElement.cloneNode(true);
    if (cloneElement.style.display === 'none') {
        cloneElement.style.display = 'inline';
      } else {
        cloneElement.style.display = 'none'; 
      }
    const option = {
        margin:0,
        filename:fileName,
        image:{type :"jpeg",quality:1},
        html2canvas:{scale:2,letterRendering:true},
        jsPDF: {
          unit: "px", 
          format: [595, 611], 
          orientation: 'portrait' 
      }
    }
    html2pdf().from(cloneElement).set(option).save()
}