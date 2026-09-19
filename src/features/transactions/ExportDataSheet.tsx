import { useState } from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { Sheet } from '../../components/Sheet';
import { useTransactionStore } from '../../stores/transactionStore';
import { useAccountStore } from '../../stores/accountStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { formatCurrency, formatDateLong } from '../../lib/formatters';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import clsx from 'clsx';

interface ExportDataSheetProps {
  open: boolean;
  onClose: () => void;
}

type TimeRange = 'this_month' | 'this_year' | 'all_time';

export function ExportDataSheet({ open, onClose }: ExportDataSheetProps) {
  const transactions = useTransactionStore((s) => s.transactions);
  const accounts = useAccountStore((s) => s.accounts);
  const categories = useCategoryStore((s) => s.categories);
  const [timeRange, setTimeRange] = useState<TimeRange>('this_month');

  // Filter transactions based on selected time range
  const getFilteredTransactions = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return transactions.filter(t => {
      if (t.type === 'adjustment') return false;
      const tDate = new Date(t.date);
      if (timeRange === 'this_month') {
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      }
      if (timeRange === 'this_year') {
        return tDate.getFullYear() === currentYear;
      }
      return true; // all_time
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const generateData = () => {
    const filtered = getFilteredTransactions();
    
    let totalIncome = 0;
    let totalExpense = 0;

    const rows = filtered.map(t => {
      const account = accounts.find(a => a.id === t.accountId);
      const category = categories.find(c => c.id === t.categoryId);
      
      let amountFormatted = '';
      if (t.type === 'income') {
        totalIncome += t.amount;
        amountFormatted = `+${t.amount}`;
      } else if (t.type === 'expense') {
        totalExpense += t.amount;
        amountFormatted = `-${t.amount}`;
      } else {
        amountFormatted = `${t.amount}`;
      }

      return [
        formatDateLong(t.date),
        t.type === 'income' ? 'Pemasukan' : t.type === 'expense' ? 'Pengeluaran' : 'Transfer',
        category?.name || '-',
        account?.name || '-',
        t.note || '-',
        amountFormatted
      ];
    });

    let insight = "";
    if (totalExpense > totalIncome) {
      insight = "PERHATIAN: Pengeluaran Anda lebih besar daripada pemasukan pada periode ini.";
    } else if (totalIncome > 0) {
      insight = "BAGUS: Arus kas Anda positif pada periode ini.";
    } else {
      insight = "INFO: Tidak ada pemasukan atau pengeluaran pada periode ini.";
    }

    const totalNet = totalIncome - totalExpense;

    return { rows, totalIncome, totalExpense, totalNet, insight };
  };

  const handleExportCSV = () => {
    const { rows, totalIncome, totalExpense, totalNet, insight } = generateData();
    
    let csvContent = "Tanggal,Tipe,Kategori,Akun,Catatan,Jumlah\n";
    rows.forEach(rowArray => {
      const row = rowArray.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",");
      csvContent += row + "\n";
    });

    csvContent += `\nTotal Pemasukan,,,,,${totalIncome}\n`;
    csvContent += `Total Pengeluaran,,,,,${totalExpense}\n`;
    csvContent += `Selisih Bersih,,,,,${totalNet}\n`;
    csvContent += `\nInsight: ${insight}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MyWallet_Export_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleExportPDF = () => {
    const { rows, totalIncome, totalExpense, totalNet, insight } = generateData();
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("Laporan Keuangan MyWallet", 14, 22);
    
    doc.setFontSize(11);
    const periodText = timeRange === 'this_month' ? 'Periode: Bulan Ini' 
                     : timeRange === 'this_year' ? 'Periode: Tahun Ini' 
                     : 'Periode: Semua Waktu';
    doc.text(periodText, 14, 30);
    
    // Summary Box
    doc.setFillColor(245, 245, 245);
    doc.rect(14, 35, 182, 32, 'F'); // Increased height from 25 to 32
    
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129); // Emerald for income
    doc.text(`Total Pemasukan: ${formatCurrency(totalIncome)}`, 20, 43);
    
    doc.setTextColor(244, 63, 94); // Rose for expense
    doc.text(`Total Pengeluaran: ${formatCurrency(totalExpense)}`, 20, 51);
    
    // Total Net (Selisih Bersih)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(totalNet >= 0 ? 16 : 244, totalNet >= 0 ? 185 : 63, totalNet >= 0 ? 129 : 94);
    doc.text(`Selisih Bersih: ${totalNet >= 0 ? '+' : '-'}${formatCurrency(Math.abs(totalNet))}`, 20, 61);
    
    // Insight
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (totalExpense > totalIncome) {
      doc.setTextColor(245, 158, 11); // Amber
    } else {
      doc.setTextColor(16, 185, 129); // Emerald
    }
    // Use maxWidth to wrap text
    doc.text(insight, 14, 75, { maxWidth: 182 });

    // Format numbers for PDF display
    const displayRows = rows.map(r => {
      const newRow = [...r];
      const amtStr = newRow[5] as string;
      if (amtStr.startsWith('+')) newRow[5] = `+${formatCurrency(parseInt(amtStr.substring(1)))}`;
      else if (amtStr.startsWith('-')) newRow[5] = `-${formatCurrency(parseInt(amtStr.substring(1)))}`;
      else newRow[5] = formatCurrency(parseInt(amtStr));
      return newRow;
    });

    // Table
    autoTable(doc, {
      startY: 85, // Shifted down due to taller summary box and insight text
      head: [['Tanggal', 'Tipe', 'Kategori', 'Akun', 'Catatan', 'Jumlah']],
      body: displayRows,
      foot: [['', '', '', '', 'Total (Selisih Bersih):', `${totalNet >= 0 ? '+' : '-'}${formatCurrency(Math.abs(totalNet))}`]],
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }, // Purple
      footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 8 },
    });

    doc.save(`MyWallet_Export_${timeRange}.pdf`);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Export Data">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold mb-3">Pilih Rentang Waktu</p>
          <div className="flex flex-col gap-2">
            {[
              { id: 'this_month', label: 'Bulan Ini' },
              { id: 'this_year', label: 'Tahun Ini' },
              { id: 'all_time', label: 'Semua Waktu' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setTimeRange(option.id as TimeRange)}
                className={clsx(
                  'flex items-center justify-between rounded-2xl border p-4 text-left transition-all active:scale-[0.98]',
                  timeRange === option.id
                    ? 'border-purple bg-purple/5 ring-1 ring-purple'
                    : 'border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:border-purple/30'
                )}
              >
                <span className="font-medium">{option.label}</span>
                <div className={clsx(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  timeRange === option.id ? 'border-purple bg-purple' : 'border-border dark:border-border-dark'
                )}>
                  {timeRange === option.id && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">Pilih Format & Unduh</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportPDF}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-600 dark:text-rose-400 transition-transform active:scale-95"
            >
              <FileText size={32} />
              <span className="font-bold text-sm">PDF Laporan</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400 transition-transform active:scale-95"
            >
              <FileSpreadsheet size={32} />
              <span className="font-bold text-sm">Excel / CSV</span>
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
