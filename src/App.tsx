import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserTable from './Components/UserTable';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sidebar layout */}
        
          <Route path="UserTable" element={<UserTable />} />
          
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
