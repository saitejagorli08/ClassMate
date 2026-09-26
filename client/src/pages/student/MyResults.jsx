import { useState } from 'react';
import { Award, TrendingUp, BookOpen, Download, CheckCircle } from 'lucide-react';

export const MyResults = () => {
  const [selectedSemester, setSelectedSemester] = useState('Sem 4');

  const semesters = [
    {
      sem: 'Sem 4',
      gpa: 3.85,
      credits: 22,
      subjects: [
        { name: 'Design and Analysis of Algorithms', code: 'CS401', grade: 'A+', marks: 94, credits: 4 },
        { name: 'Database Management Systems', code: 'CS402', grade: 'A', marks: 88, credits: 4 },
        { name: 'Computer Architecture & Org', code: 'CS403', grade: 'A-', marks: 83, credits: 3 },
        { name: 'Operating Systems Lab', code: 'CS404', grade: 'O', marks: 98, credits: 2 },
        { name: 'Discrete Mathematics', code: 'MA401', grade: 'B+', marks: 79, credits: 4 },
      ],
    },
    {
      sem: 'Sem 3',
      gpa: 3.78,
      credits: 20,
      subjects: [
        { name: 'Data Structures using C++', code: 'CS301', grade: 'A', marks: 89, credits: 4 },
        { name: 'Digital Logic and Design', code: 'EC302', grade: 'A-', marks: 82, credits: 3 },
        { name: 'Object Oriented Programming', code: 'CS303', grade: 'A+', marks: 95, credits: 4 },
        { name: 'Engineering Statistics', code: 'MA301', grade: 'B', marks: 74, credits: 3 },
      ],
    },
  ];

  const current = semesters.find((s) => s.sem === selectedSemester) || semesters[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-500" />
            Academic Grades & Transcript
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View semester grade reports, credit history, and performance transcripts
          </p>
        </div>
      </div>

      {/* GPA Header Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-transparent p-6 rounded-3xl border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Overall Academic Standing
          </p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            CGPA: 3.82 <span className="text-base font-semibold text-slate-400">/ 4.0</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Total Credits Earned: 84 / 160</p>
        </div>

        <div className="flex items-center gap-2">
          {semesters.map((s) => (
            <button
              key={s.sem}
              onClick={() => setSelectedSemester(s.sem)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSemester === s.sem
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {s.sem} (GPA {s.gpa})
            </button>
          ))}
        </div>
      </div>

      {/* Grade Details Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {selectedSemester} Grade Sheet
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            Semester GPA: {current.gpa}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Credits</th>
                <th className="py-3.5 px-4">Marks</th>
                <th className="py-3.5 px-4">Grade</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {current.subjects.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{item.code}</td>
                  <td className="py-3.5 px-4 font-medium">{item.credits}</td>
                  <td className="py-3.5 px-4 font-bold">{item.marks} / 100</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" /> Passed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
