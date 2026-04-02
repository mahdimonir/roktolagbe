'use client';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateCertificate = async (donorName: string, bloodGroup: string, date: string) => {
  const element = document.createElement('div');
  element.style.width = '800px';
  element.style.padding = '60px';
  element.style.background = '#fff';
  element.style.border = '2px solid #ef4444';
  element.style.textAlign = 'center';
  element.style.fontFamily = 'Arial, sans-serif';
  element.style.position = 'absolute';
  element.style.left = '-9999px';

  element.innerHTML = `
    <div style="border: 20px solid #fee2e2; padding: 40px; height: 100%;">
      <h1 style="color: #ef4444; font-size: 48px; margin-bottom: 20px; font-weight: 900; letter-spacing: -2px;">RoktoLagbe</h1>
      <div style="width: 100px; height: 2px; background: #ef4444; margin: 0 auto 40px;"></div>
      <h2 style="color: #111827; font-size: 28px; text-transform: uppercase; letter-spacing: 6px; margin-bottom: 50px; font-weight: 900;">Certificate of Donation</h2>
      <p style="font-size: 20px; color: #6b7280; font-style: italic; margin-bottom: 15px;">This is to certify that</p>
      <p style="font-size: 42px; font-weight: 900; color: #111827; margin-bottom: 30px; tracking-tight: -1px;">${donorName}</p>
      <div style="max-width: 550px; margin: 0 auto 60px;">
        <p style="font-size: 18px; color: #4b5563; line-height: 1.8;">
          Has successfully donated <strong>${bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</strong> blood on ${date}, 
          contributing to our mission of saving lives through the RoktoLagbe network.
        </p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 80px;">
         <div style="text-align: left;">
            <p style="font-weight: 900; margin-bottom: 2px; color: #111827; text-transform: uppercase; font-size: 14px;">Verified By</p>
            <p style="color: #ef4444; font-weight: 900; margin-top: 0; font-size: 18px; letter-spacing: -0.5px;">RoktoLagbe Network Official</p>
         </div>
         <div style="width: 120px; height: 120px; border: 4px solid #ef4444; color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; transform: rotate(-15deg); text-transform: uppercase; letter-spacing: 2px; background: #fff;">
            Verified
         </div>
      </div>
    </div>
  `;

  document.body.appendChild(element);
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('l', 'px', [canvas.width, canvas.height]);
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`Donation-Certificate-${donorName.replace(/\s+/g, '_')}.pdf`);
  document.body.removeChild(element);
};
