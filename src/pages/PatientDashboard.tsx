import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Calendar } from 'lucide-react';

interface Analysis {
  id: string;
  date: string;
  patientName: string;
  symptoms: string;
  diagnosis: string;
  recommendations: string;
}

export default function PatientDashboard() {
  const { user } = useAuth();
  // Mock data - replace with actual data from your backend
  const analyses: Analysis[] = [
    {
      id: '1',
      date: '2024-03-15',
      patientName: 'John Doe',
      symptoms: 'Fever, cough, fatigue',
      diagnosis: 'Viral infection',
      recommendations: 'Rest, hydration, over-the-counter medication',
    },
    {
      id: '2',
      date: '2024-03-10',
      patientName: 'Jane Smith',
      symptoms: 'Headache, dizziness',
      diagnosis: 'Migraine',
      recommendations: 'Prescribed medication, stress management',
    },
  ];

  const handleDownloadReport = (analysis: Analysis) => {
    // Implement PDF generation and download
    console.log('Downloading report for:', analysis.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || user?.email || 'User'}</p>
          </div>
          <Button onClick={() => window.location.href = '/patient-analysis'}>
            <FileText className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Analyses</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Analysis</CardTitle>
              <CardDescription>Last analysis date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analyses[0]?.date || 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Patients</CardTitle>
              <CardDescription>Currently monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(analyses.map(a => a.patientName)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>View and manage your patient analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {analysis.date}
                      </div>
                    </TableCell>
                    <TableCell>{analysis.patientName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {analysis.symptoms}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {analysis.diagnosis}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadReport(analysis)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 