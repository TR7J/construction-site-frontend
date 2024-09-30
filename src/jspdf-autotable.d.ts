// jspdf-autotable.d.ts
import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number; // This assumes you want to track the final Y position of the last autoTable
    };
  }
}

declare module "jspdf-autotable";
