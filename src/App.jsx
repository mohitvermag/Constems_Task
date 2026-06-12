import { useState } from "react"
import Papa from "papaparse"

function App() {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [selectedColumn, setSelectedColumn] = useState("")
  const [searchText, setSearchText] = useState("")
  const [fileName, setFileName] = useState("")

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const parsedHeaders = Object.keys(results.data[0])
          setHeaders(parsedHeaders)
          setData(results.data)
          setSelectedColumn(parsedHeaders[0] || "")
        }
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  const filteredData = data.filter((row) => {
    if (!searchText) return true
    const val = row[selectedColumn]
    return String(val || "").toLowerCase().includes(searchText.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            CSV Inspector
          </h1>
          <p className="text-sm text-slate-500">
            Upload, browse, and filter CSV data in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-slate-900">
                1. Select CSV Data Source
              </h2>
              
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/10 p-6 rounded-lg cursor-pointer transition group">
                <svg
                  className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2 transition"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition">
                  {fileName ? fileName : "Upload CSV File"}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Drag & drop or click to browse
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {headers.length > 0 && (
              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  2. Search & Filter Settings
                </h2>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Target Column
                  </label>
                  <select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    className="border border-slate-200 p-2.5 rounded-lg w-full bg-white text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition outline-none"
                  >
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Filter Keyword
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type to filter rows..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="border border-slate-200 py-2.5 pl-9 pr-3 rounded-lg w-full text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-4 w-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {data.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                
                <div className="border-b border-slate-100 p-4 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Live Preview
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                      Total: {data.length.toLocaleString()}
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-medium">
                      Filtered: {filteredData.length.toLocaleString()}
                    </div>
                    <div className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                      Columns: {headers.length}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[600px] w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                      <tr>
                        {headers.map((h) => (
                          <th
                            key={h}
                            className="p-3 font-semibold text-slate-600 border-r border-slate-200/60 whitespace-nowrap shadow-[inset_0_-1px_0_rgba(226,232,240,1)] bg-slate-50"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredData.map((row, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/80 transition-colors odd:bg-white even:bg-slate-50/20"
                        >
                          {headers.map((h) => (
                            <td
                              key={h}
                              className="p-3 text-slate-600 border-r border-slate-200/40 whitespace-nowrap"
                            >
                              {row[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredData.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 text-center flex-1">
                    <svg
                      className="w-12 h-12 text-slate-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0120.25 21H3.75A2.25 2.25 0 011.5 18.75v-4.5A2.25 2.25 0 012.25 13.5zm0-9h18a2.25 2.25 0 012.25 2.25v4.5a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 11.25V6.75A2.25 2.25 0 012.25 4.5z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-slate-900">
                      No matching records
                    </span>
                    <span className="text-xs text-slate-500 mt-1 max-w-xs">
                      Try clearing the filter keyword or changing the target column.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center h-[350px]">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-900">
                  Ready to inspect file
                </span>
                <span className="text-xs text-slate-500 mt-1 max-w-sm">
                  Upload a CSV file on the left side panel to view, inspect, and query its records inside the browser.
                </span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default App
