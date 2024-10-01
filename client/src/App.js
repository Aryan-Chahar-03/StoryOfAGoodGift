import { BrowserRouter,Routes,Route } from "react-router-dom";
import { LoginProvider } from "./Context/LoginContext";
import { DataProvider } from "./Context/DataContext";
import SignUp from "./Components/SignUp";
import Homepage from "./Components/HomePage";
import Login from "./Components/Login";
import AddEvent from "./Components/AddEvent";
import EditEvent from "./Components/EditEvent";
import Shop from "./Components/ShopPage";

function App() {
  return (
   <BrowserRouter>
    <LoginProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/addEvent" element={<AddEvent />} />
          <Route path="/editEvent/:eventId" element={<EditEvent />} />
          <Route path = '/shop/:category' element = {<Shop/>} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </DataProvider>
 
    </LoginProvider>
   </BrowserRouter>
  );
}

export default App;
