import Navbar from './Navbar';
import LoginPage from './Login';
import Dashboard from './Dashboard'
import { BrowserRouter as Router , Route, Switch} from 'react-router-dom'
import Profile from './Profile';
import Signup from './Signup'
import { AuthProvider } from './contexts/AuthContext';
import { useState } from 'react';
import AddContact from './AddContact';



function App() {
  const [currentUserInfo, setCurrentUserInfo] = useState()
  const [addingContact, setAddingContact] = useState(false)
  return (
    
    <Router>
      <AuthProvider>
      <div className="App">
        <Navbar setAddingContact={setAddingContact}></Navbar>
        <Switch>
          <Route exact path="/signin">
            <LoginPage ></LoginPage>
          </Route>
          <Route exact path="/signup">
            <Signup ></Signup>
          </Route>
          <Route exact path="/forgot-password">
            <LoginPage></LoginPage>
          </Route>
          <Route exact path="/dashboard">
            {addingContact && <AddContact currentUserInfo={currentUserInfo} setAddingContact={setAddingContact}></AddContact>}
            <Dashboard currentUserInfo={currentUserInfo} setCurrentUserInfo={setCurrentUserInfo} ></Dashboard>
          </Route>
          <Route exact path="/profile">
            <Profile currentUserInfo={currentUserInfo} ></Profile>
          </Route>
        </Switch>
        <div className="dragOverlay"></div>
      </div>
      </AuthProvider>
    </Router>

  );
}

export default App;
