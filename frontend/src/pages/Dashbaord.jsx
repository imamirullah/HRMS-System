import { useEffect, useState } from "react";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Calendar,
  RefreshCw,
  Search,
  ChevronRight,
  Menu,
  X,
  Home,
  UserPlus,
  FileText
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      // Summary
      const summaryRes = await api.get("/attendance/summary/");
      setSummary(summaryRes.data.data);

      // Employees
      const empRes = await api.get("/employees/");
      const empList = empRes.data.data;
      setEmployees(empList);

      // Attendance for today
      const today = new Date().toISOString().split("T")[0];
      const map = {};

      for (let emp of empList) {
        const res = await api.get(`/attendance/${emp.employee_id}/`);
        const todayRecord = res.data.data.find(
          (a) => a.date === today
        );
        map[emp.employee_id] = todayRecord
          ? todayRecord.status
          : "Absent";
      }

      setAttendanceMap(map);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusCount = (status) => {
    return Object.values(attendanceMap).filter(s => s === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== FIXED NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <button 
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-3"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">HRMS</span>
              </button>
            </div>

            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <NavButton 
                icon={<Home className="h-4 w-4" />}
                label="Dashboard"
                active={location.pathname === "/dashboard"}
                onClick={() => navigate("/")}
              />
              <NavButton 
                icon={<Users className="h-4 w-4" />}
                label="Employees"
                active={location.pathname === "/employees"}
                onClick={() => navigate("/employees")}
              />
              <NavButton 
                icon={<Calendar className="h-4 w-4" />}
                label="Attendance"
                active={location.pathname === "/attendance"}
                onClick={() => navigate("/attendance")}
              />
              
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="hidden md:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4">
            <div className="space-y-2">
              <MobileNavButton 
                icon={<Home className="h-5 w-5" />}
                label="Dashboard"
                active={location.pathname === "/dashboard"}
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
              />
              <MobileNavButton 
                icon={<Users className="h-5 w-5" />}
                label="Employees"
                active={location.pathname === "/employees"}
                onClick={() => {
                  navigate("/employees");
                  setMobileMenuOpen(false);
                }}
              />
              <MobileNavButton 
                icon={<Calendar className="h-5 w-5" />}
                label="Attendance"
                active={location.pathname === "/attendance"}
                onClick={() => {
                  navigate("/attendance");
                  setMobileMenuOpen(false);
                }}
              />
              <MobileNavButton 
                icon={<FileText className="h-5 w-5" />}
                label="Reports"
                active={location.pathname === "/reports"}
                onClick={() => {
                  navigate("/reports");
                  setMobileMenuOpen(false);
                }}
              />
              <div className="pt-4">
                <button
                  onClick={() => {
                    loadData(true);
                    setMobileMenuOpen(false);
                  }}
                  disabled={refreshing}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content (with navbar offset) */}
      <div className="pt-24 pb-8 px-6">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-2">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/employees/new")}
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          </div>
        </div>

        {/* ===== STATS GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={summary?.total_employees || 0}
            icon={<Users className="h-6 w-6" />}
            color="blue"
            trend="+2 this month"
          />
          <StatCard
            title="Present Today"
            value={getStatusCount("Present")}
            icon={<CheckCircle className="h-6 w-6" />}
            color="green"
            percentage={employees.length > 0 ? ((getStatusCount("Present") / employees.length) * 100).toFixed(1) : "0"}
          />
          <StatCard
            title="Absent Today"
            value={getStatusCount("Absent")}
            icon={<XCircle className="h-6 w-6" />}
            color="red"
            percentage={employees.length > 0 ? ((getStatusCount("Absent") / employees.length) * 100).toFixed(1) : "0"}
          />
          <StatCard
            title="Attendance Rate"
            value={`${summary?.attendance_rate || 0}%`}
            icon={<Calendar className="h-6 w-6" />}
            color="purple"
            trend="+5.2% from last week"
          />
        </div>

        {/* ===== ATTENDANCE TABLE ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Today's Attendance</h2>
                <p className="text-gray-500 text-sm mt-1">Real-time attendance status for all employees</p>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition w-full"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Check-in
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((emp) => {
                  const status = attendanceMap[emp.employee_id];
                  const isPresent = status === "Present";

                  return (
                    <tr 
                      key={emp.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                            <span className="font-semibold text-blue-600">
                              {emp.full_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{emp.full_name}</p>
                            <p className="text-sm text-gray-500">ID: {emp.employee_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                          {emp.department}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{emp.position || "N/A"}</td>
                      <td className="p-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="p-4 text-gray-500">
                        {isPresent ? "9:15 AM" : "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => navigate("/")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            View Details
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredEmployees.length}</span> of{" "}
                <span className="font-medium">{employees.length}</span> employees
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  1
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== NAVIGATION BUTTON COMPONENTS ===== */

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 rounded-lg transition-all ${
        active 
          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className="mr-2">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function MobileNavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
      {active && (
        <div className="ml-auto h-2 w-2 bg-blue-500 rounded-full"></div>
      )}
    </button>
  );
}

/* ===== STAT CARD COMPONENT ===== */

function StatCard({ title, value, icon, color, percentage, trend }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-transform hover:scale-[1.02] hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          
          {percentage && (
            <div className="flex items-center mt-2">
              <div className="h-2 bg-gray-200 rounded-full w-24 mr-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    color === 'green' ? 'bg-green-500' : 
                    color === 'red' ? 'bg-red-500' : 
                    color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{percentage}%</span>
            </div>
          )}
          
          {trend && (
            <p className="text-sm text-gray-500 mt-2">{trend}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ===== STATUS BADGE COMPONENT ===== */

function StatusBadge({ status }) {
  const isPresent = status === "Present";
  
  return (
    <div className="flex items-center">
      <div className={`relative ${isPresent ? 'text-green-500' : 'text-red-500'} mr-2`}>
        <div className={`h-3 w-3 rounded-full ${isPresent ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        <div className={`absolute inset-0 rounded-full ${isPresent ? 'bg-green-200' : 'bg-red-200'} animate-ping`} />
      </div>
      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
        isPresent
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}>
        {isPresent ? "Present" : "Absent"}
      </span>
    </div>
  );
}