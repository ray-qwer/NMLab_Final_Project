import logo from './logo.svg';
import './styles.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from 'react-router-dom'
import Home from './containers/Home';
import Profile from './containers/Profile'
import LogIn from "./containers/LogIn";
import votingList from './containers/voting_list';
import Voting from './containers/voting';
import createVoting from './containers/CreateVote'; 
import resultList from './containers/Resultlist';
import VoteResult from "./containers/voteResult";
import React,{useState, useEffect,createContext,useReducer} from 'react';
import {Googlelogout} from './utils/helloUtils'
import {UserContext,UserReducer} from './utils/ReducerContext'
import getWeb3 from './utils/getWeb3'
// TODO: replace to our contract
// import TodoAppContract from "./build/contracts/TodoApp.json" 
import VotingContract from "./build/contracts/Voting.json"



function App() {
    const UserId = "Customer";
    const isManager = true;    // change it to true if you want to see Add Vote
    const isLogin = false;
    const userInitState = {
        id:UserId,
        isManager:isManager,
        isLogin: isLogin
    }
    const [uState,uDispatch] = useReducer(UserReducer,userInitState);
    const [accounts,setAccounts] = useState([]);
    const [web3,setWeb] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(()=>{
        console.log("hi")
        const a = async() =>{
            console.log("try")
        try {
            const web = await getWeb3();
            const web_accounts = await web.eth.getAccounts();
            var  networkId = await web.eth.net.getId();
            // TODO: replace with our contract
            // const deployedNetwork = TodoAppContract.networks[networkId];
            // const instance = new web3.eth.Contract(
            //   TodoAppContract.abi,
            //   deployedNetwork && deployedNetwork.address,
            // );
            const deployedNetwork = VotingContract.networks[networkId];
            const instance = new web.eth.Contract(
                VotingContract.abi,
                deployedNetwork && deployedNetwork.address,
            );


            console.log(web_accounts);
            setAccounts(web_accounts);
            setWeb(web);
            setContract(instance);
            // this.setState({ web3, accounts, contract: instance });
        } catch (error) {
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }
        }
        a();
    },[])
    const clickSignOut = () =>{
        if(Googlelogout()){
            uDispatch({type:'LOGOUT',payload:{UserId:"Customer",isManager:false,isLogin:false}})
        }
            // setIsLogin(false)
    }
    return (
        <UserContext.Provider value={{uState,uDispatch,accounts,contract,web3}}>
        <Router>
        <div className="App">
        <div class="d-flex" id="wrapper" >
                {/* <!-- Sidebar--> */}
                <div class="border-end bg-white" id="sidebar-wrapper">
                    <div class="sidebar-heading border-bottom bg-light">Block Voting</div>
                    <div class="list-group list-group-flush">
                        <Link class="list-group-item list-group-item-action list-group-item-light p-3" to={"/"}>Home</Link>
                        <Link class="list-group-item list-group-item-action list-group-item-light p-3" to={"/VotingList"}>Voting!</Link>
                        <Link class="list-group-item list-group-item-action list-group-item-light p-3" to={"/Result"}>See Results</Link>
                        {isManager?(
                            <Link class="list-group-item list-group-item-action list-group-item-light p-3" to={"/CreateVoting"}>Add Vote</Link>
                        ):(
                            <></>
                        )}
                        <Link class="list-group-item list-group-item-action list-group-item-light p-3" to={"/profile"}>Profile</Link>
                    </div>
                </div>
                {/* <!-- Page content wrapper--> */}
                <div id="page-content-wrapper">
                    {/* <!-- Top navigation--> */}
                    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                        <div class="container-fluid">
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
                                    <li class="nav-item active" >{uState.isLogin?(<Link class="nav-link" to={"/"} onClick={()=>{clickSignOut()}}>Log Out</Link>):(<Link class="nav-link" to={"/LogIn"}>Log In</Link>)}</li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    {/* <!-- Page content--> */}
                    <div class="container-fluid">
                        {/* <h1 class="mt-4">Simple Sidebar</h1>
                        <p>The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens. When toggled using the button below, the menu will change.</p>
                        <p>
                            Make sure to keep all page content within the
                            <code>#page-content-wrapper</code>
                            . The top navbar is optional, and just for demonstration. Just create an element with the
                            <code>#sidebarToggle</code>
                            ID which will toggle the menu when clicked.
                        </p> */}
                        <Switch>
                            <Route exact path={'/'} component={Home}/>
                            <Route exact path={'/profile'} component={Profile}/>
                            <Route exact path={'/Login'} component={LogIn}/>
                            <Route exact path={'/VotingList'} component={votingList}/>
                            <Route exact path={'/Voting/:id'} component={Voting}/>
                            <Route exact path={'/CreateVoting'} component={createVoting}/>
                            <Route exact path={'/Result'} component={resultList}/>
                            <Route exact path={'/Result/:id'} component={VoteResult}/>
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
        </Router>
       </UserContext.Provider> 
    );
}

export default App;
