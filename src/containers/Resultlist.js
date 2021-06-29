import react ,{useState,Component,useEffect,useContext} from 'react'
import  "../App.css"
import {useHistory} from 'react-router-dom' 
import {getTime} from '../utils/utils'
import {UserContext} from '../utils/ReducerContext'
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper" 
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
function ResultList(){
    // for Testing, can delete them, be careful that at useState also need to reclaim them 
    /*const myFirstVote = {
        deadLine: "2021/6/8 21:00:00",
        title: "1st Vote",
        voteID: 1
    };
    const mySecVote = {
        deadLine: "2021/6/4 11:20:00",
        title: "2nd Vote",
        voteID: 2
    };*/
    // end testing
    const {uState,uDispatch,accounts,web3,contract} = useContext(UserContext);
    const [Result_list,setResult_list] = useState([]);
    const [view,setView] = useState([]);
    const [search,setSearch] = useState("");
    const [btnClk,setBtnClk] = useState(false)    
    const [time,setTime] = useState(Date.now())
    const history = useHistory();
    useEffect(()=>{
        const timer = setTimeout(() => {
            setTime(Date.now());
          }, 1000);
    },[time])
    useEffect (()=>{
        const getList = async() =>{
            await getResult_list();
        }
        getList();
    },[])
    const getResult_list = async() => {
        // get result list
        // getTime(deadline) == false if time out  // def in utils/utils.js
        //new
        var _votingList = await contract.methods.getVotingList().call();
        var _list = [];
        for(var i = 0;i<_votingList.length;i+=1){
             var _together = await contract.methods.getVote(_votingList[i]).call(); // contract: get the info of one voteID
             var _topic = _together[0];
             var _content = _together[1];
             var _duetime = _together[2];
             var _cands = _together[3];
             var _numofvoters = _together[4];
             var _uplim = _together[5];       
       
             var vote = {
                 title: _topic,
                 deadLine:Number(_duetime),
                 voteID:_votingList[i]
             }
             _list = [..._list,vote];
         }
        var rList = [];
        for (var i =0;i<_list.length;i+=1){
            console.log(_list[i].deadLine)
            console.log(typeof(_list[i].deadLine))
            if (_list[i].deadLine < Date.now()){
                rList = [...rList,_list[i]]
            }
        }
        rList.sort(function(a,b){
            return a.deadLine-b.deadLine;
        })
        setResult_list(rList);
        setView(rList);

        //console.log(rList);
    }
    const goResult = (resultItem) => {
        var URL='/Result/'+resultItem.voteID;
        history.push(URL);
    }
    const getDay = (a) =>{
        const deadLine = new Date(a);
        const year = deadLine.getFullYear();
        const month = deadLine.getMonth()+1;
        const day = deadLine.getDate();
        const hours = (deadLine.getHours()/10 < 1)?'0'+deadLine.getHours().toString():deadLine.getHours();;
        const minutes = (deadLine.getMinutes()/10 < 1)?'0'+deadLine.getMinutes().toString():deadLine.getMinutes();
        const seconds = (deadLine.getSeconds()/10 < 1)?'0'+deadLine.getSeconds().toString():deadLine.getSeconds();
        return year+'/'+month+'/'+day+' '+hours+':'+minutes+':'+seconds
    }
    const timeOrderList = () =>{
        var _list = view;
        if (!btnClk){
            _list.sort(function(a,b){
                return a.deadLine-b.deadLine;
    
            })
        }
        else {
            _list.sort(function(a,b){
                return b.deadLine-a.deadLine;
    
            })
        }
        setBtnClk(!btnClk);
        setView(_list);
    }
    const renderResult_list = view.map((ResultItem,i)=>
        
        <Grid container justify="space-around" className="VotingListItem" onClick={()=>goResult(ResultItem)}  key={i}>
            <Grid item className="VotingListItemTitle"><p>{ResultItem.title}</p></Grid>
            <Grid item className="VotingListItemCountdown">Due at: {getDay(ResultItem.deadLine)}</Grid>
        </Grid>

        
    );
    const searchList=()=>{
        var _list = [];
        for(var i =0;i<Result_list.length;i+=1){
            if(Result_list[i].title.search(search)>=0)
                _list = [..._list,Result_list[i]]
        }
        setView(_list);
    }
    return (
        <Container maxWidth="lg" style={{padding:20}}>
        <Grid container direction="column" justify="space-around" alignItems="center" className="ResultList">
            <Paper elevation={0} style={{padding:5}} >
                <Grid container  alignItems="center"  >
                    <TextField  placeholder="search..." value={search} onChange={(e)=>{setSearch(e.target.value)}} onKeyDown={(value)=>{if(value.keyCode==13)searchList()}}/>
                    <Divider orientation="vertical" flexItem />
                    <Button style={{margin:5,backgroundColor:"transparent"}} variant="contained" onClick={()=>{timeOrderList()}}>Time{!btnClk?(<ExpandMoreIcon/>):(<ExpandLessIcon/>)}</Button>                    
                </Grid>
            </Paper>
            {view.length===0?(<>No results</>):(renderResult_list)}
        </Grid>
        </Container>
    );
}

export default ResultList;