import { useState, useEffect } from 'react';


interface LoginInfo {
  uuid: string;
  username: string;
  password: string;
  md5: string;
  sha1: string;
  registered: string;
}

interface GeoLocation {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: GeoLocation;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birthDate: string;
  login: LoginInfo;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export default function UserTable(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const usersPerPage: number = 5;

  
  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        // Using a CORS proxy to avoid CORS issues
        const corsProxy: string = 'https://api.allorigins.win/raw?url=';
        const apiUrl: string = 'https://jsonplaceholder.org/users';
        
        const response: Response = await fetch(corsProxy + encodeURIComponent(apiUrl));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: User[] = await response.json();
        console.log('Fetched users:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          setFilteredUsers(data);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

 
  useEffect(() => {
    if (users.length === 0) return;
    
    const filtered: User[] = users.filter((user: User) => {
      const searchLower: string = searchTerm.toLowerCase();
      return (
        user.firstname.toLowerCase().includes(searchLower) ||
        user.lastname.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.login.username.toLowerCase().includes(searchLower)
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

 
  const indexOfLastUser: number = currentPage * usersPerPage;
  const indexOfFirstUser: number = indexOfLastUser - usersPerPage;
  const currentUsers: User[] = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages: number = Math.ceil(filteredUsers.length / usersPerPage);

 
  const handleSelectUser = (userId: number): void => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id: number) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      const allCurrentIds: number[] = currentUsers.map((user: User) => user.id);
      const newSelected: number[] = [...new Set([...selectedUsers, ...allCurrentIds])];
      setSelectedUsers(newSelected);
    } else {
      const currentIds: number[] = currentUsers.map((user: User) => user.id);
      setSelectedUsers(selectedUsers.filter((id: number) => !currentIds.includes(id)));
    }
  };

  
  const isAllSelected: boolean = currentUsers.length > 0 && 
    currentUsers.every((user: User) => selectedUsers.includes(user.id));

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-xl text-gray-700">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">User Data Table</h1>
        
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

       
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b border-gray-300 px-3 md:px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-blue-500"
                    title="Select All"
                  />
                </th>
                <th className="border-b border-gray-300 px-3 md:px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                <th className="border-b border-gray-300 px-3 md:px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="border-b border-gray-300 px-3 md:px-4 py-3 text-left font-semibold text-gray-700">Username</th>
                <th className="border-b border-gray-300 px-3 md:px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="border-b border-gray-300 px-3 md:px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user: User) => {
                const isSelected: boolean = selectedUsers.includes(user.id);
                return (
                  <tr
                    key={user.id}
                    className={`transition-colors duration-150 ${
                      isSelected 
                        ? 'bg-blue-100 border-l-4 border-l-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="border-b border-gray-200 px-3 md:px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 cursor-pointer accent-blue-500"
                      />
                    </td>
                    <td className="border-b border-gray-200 px-3 md:px-4 py-3 text-gray-700">{user.id}</td>
                    <td className="border-b border-gray-200 px-3 md:px-4 py-3 text-gray-800 font-medium">
                      {user.firstname} {user.lastname}
                    </td>
                    <td className="border-b border-gray-200 px-3 md:px-4 py-3 text-gray-600">
                      {user.login.username}
                    </td>
                    <td className="border-b border-gray-200 px-3 md:px-4 py-3 text-gray-600">
                      {user.email}
                    </td>
                    <td className="border-b border-gray-200 px-3 md:px-4 py-3 text-gray-600">
                      {user.phone}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        
        {currentUsers.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg mt-4">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">No users found matching your search.</p>
          </div>
        )}

        
        {filteredUsers.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-200 rounded-lg font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

       
        {selectedUsers.length > 0 && (
          <div className="mt-4 px-4 py-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm">
            <span className="font-semibold text-blue-700">
              {selectedUsers.length} user(s) selected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}