import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Card from './Card';
import Button from './Button';
import { Upload, Table, AlertTriangle } from 'lucide-react';

const DataImport = ({ onImport }) => {
    const [data, setData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
                setData(jsonData);
                setError('');
            } catch (err) {
                setError('Error parsing file. Please ensure it is a valid .xlsx or .csv file.');
                setData([]);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleImport = () => {
        onImport(data);
        setData([]);
        setFileName('');
    };

    return (
        <Card title="Data Import" titleIcon={Upload}>
            <div className="space-y-4">
                <p className="text-gray-600">Upload an .xlsx or .csv file with equipment data. The first row should be the header.</p>
                <input type="file" onChange={handleFileUpload} accept=".xlsx, .csv" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>

                {error && <p className="text-red-500 flex items-center"><AlertTriangle className="mr-2"/>{error}</p>}

                {data.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mt-4">Preview Data</h3>
                        <div className="overflow-x-auto mt-2">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        {data[0].map((header, i) => <th key={i} scope="col" className="px-6 py-3">{header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(1).map((row, i) => (
                                        <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                            {row.map((cell, j) => <td key={j} className="px-6 py-4">{cell}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleImport}><Table className="mr-2" />Import Data</Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default DataImport;
