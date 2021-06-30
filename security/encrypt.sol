pragma solidity >=0.5.0 <0.6.0;
// written for Solidity version 0.4.18 and above that doesnt break functionality

contract Voting {
    
    /////////////////////////////////////////////////////////////////////////////////// event

    event AddCandidate   (uint cid);
    event AddVoter       (uint vid);
    event AddToWhitelist (uint vid);
    event CreateEnKey    (uint vid);
    event EnKey          (uint vid, uint[2] pubkey_e);
    event VoteSuccess    (uint vid);
    event SetBallot      (uint cid);

    /////////////////////////////////////////////////////////////////////////////////// struct

    struct Voter {
        uint vid;
        uint[2] pubkey_s; // [0]: n, [1]: e
    }
    
    struct Candidate {
        uint cid;
        string name;
        uint ballots;
    }

    struct VoterInWhitelist {
        address addr;
        uint en_ballot;
        bool exist;
        bool casted;
    }

    /////////////////////////////////////////////////////////////////////////////////// global variable

    address owner;
    uint numCandidates; 
    uint numVoters;
    uint numWhitelist;
    
    Candidate[] candidates;
    Voter[] voters;
    mapping(uint => VoterInWhitelist) whitelist;

    /////////////////////////////////////////////////////////////////////////////////// constructor

    constructor() public{
        owner=msg.sender;
        numCandidates = numVoters = numWhitelist = 0;
        candidates.push(Candidate(0, "", uint(-1)));   // cid start from 1
        voters.push(Voter(0, [uint(0), uint(0)]));     // vid start from 1
    }

    /////////////////////////////////////////////////////////////////////////////////// modifier

    modifier onlyOwner {
        //require(msg.sender == owner);
        _;
    }

    /////////////////////////////////////////////////////////////////////////////////// function

    function addCandidate(string memory name) public {
        uint cid = ++numCandidates;
        candidates.push(Candidate(cid, name, uint(-1)));
        emit AddCandidate(cid);
    }

    function registVoter(uint[2] memory pubkey) public {
        uint vid = ++numVoters;
        voters.push(Voter(vid, pubkey));
        emit AddVoter(vid);
    }

    function addVoterToWhitelist(uint vid) public {
        require(vid > 0 && vid <= numVoters && whitelist[vid].exist == false);
        whitelist[vid] = (VoterInWhitelist(address(0), 0, true, false));
        numWhitelist++;
        emit AddToWhitelist(vid);
    }

    function verifyVoterSign(uint vid, uint sign) public { // verify voter's sign
        require(whitelist[vid].exist == true && whitelist[vid].casted == false && whitelist[vid].addr == address(0));
        require(verifySign(vid, sign, voters[vid].pubkey_s) == true);
        whitelist[vid].addr = msg.sender;
        emit CreateEnKey(vid);
    }

    function sendEncryptKey(uint vid, uint[2] memory pubkey_e) public { // send encrypt pubkey
        require(whitelist[vid].exist == true);
        emit EnKey(vid, pubkey_e);
    }

    function saveEncryptedBallot(uint vid, uint en_ballot) public { // save encrypted ballot
        require(whitelist[vid].exist == true && whitelist[vid].casted == false && whitelist[vid].addr == msg.sender);
        whitelist[vid].en_ballot = en_ballot;
        whitelist[vid].casted = true;
        whitelist[vid].addr = address(0);
        emit VoteSuccess(vid);
    }

    function setBallot(uint cid, uint ballots) public {
        require(candidates[cid].ballots == uint(-1));
        candidates[cid].ballots = ballots;
        emit SetBallot(cid);
    }

    /////////////////////////////////////////////////////////////////////////////////// pure

    function stringTouint(string memory str) public pure returns (uint) {
        bytes memory b = bytes(str);
        uint result = 0;
        for (uint i = 0; i < b.length; i++) {
            uint c = uint(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return result;
    }

    function substr(string memory str, uint start, uint end) public pure returns (string memory) {
        bytes memory b = bytes(str);
        bytes memory result = new bytes(end - start);
        for(uint i = 0; i < end - start; i++) {
            result[i] = b[i + start];
        }
        return string(result);
    }

    function verifySign(uint vid, uint sign, uint[2] memory pubkey) public pure returns (bool) {
        uint v = modexp(sign, pubkey[1], pubkey[0]);
        return (vid == v);
    }

    function signVid(uint vid, uint[2] memory privkey) public pure returns (uint) {
        /*uint shax = vid + 111; /////////////////// hash mismatch (solidiy <=> html)
        uint r = modexp(privkey[2], ke, privkey[0]) % privkey[1];
        uint s = ((shax + privkey[3] * r) * modInverse(ke, privkey[1])) % privkey[1];
        return (r, s);*/
        uint v = modexp(vid, privkey[1], privkey[0]);
        return v;
    }

    function modexp(uint base, uint power, uint mod) public pure returns (uint) {
        uint x = base % mod;
        uint y = 1;
        while (power != 1) {
            if (power % 2 == 1) {
                y = (x * y) % mod;
            }
            x = (x ** 2) % mod;
            power = power / 2;
        }
        return (x * y) % mod;
    }

    function modInverse(uint n, uint mod) public pure returns (uint) {
        return modexp(n, mod - 2, mod);
    }

    /////////////////////////////////////////////////////////////////////////////////// getter

    function ballot(uint cid) public view returns (uint) {
        return candidates[cid].ballots; 
    }

    function numc() public view returns(uint) {
        return numCandidates;
    }

    function numv() public view returns(uint) {
        return numVoters;
    }

    function numwh() public view returns (uint) {
        return numWhitelist;
    }

    function getc(uint cid) public view returns (uint, string memory, uint) {
        if (cid > numCandidates) {
            return (0, "", uint(-1));
        }
        else {
            return (cid, candidates[cid].name, candidates[cid].ballots);
        }
    }

    function getcn(string memory name) public view returns (uint, string memory, uint) {
        uint cid;
        for (cid = 1; cid <= numCandidates; cid++) {
            if (keccak256(abi.encodePacked(candidates[cid].name)) == keccak256(abi.encodePacked(name))) {
                break;
            }
        }
        if (cid > numCandidates) {
            return (0, "", uint(-1));
        }
        else {
            return (cid, name, candidates[cid].ballots);
        }
    }

    function getv(uint vid) public view returns (uint, uint[2] memory) {
        if (vid == 0 || vid > numVoters) {
            return (0, [uint(0), uint(0)]);
        }
        else {
            return (vid, voters[vid].pubkey_s);
        }
    }

    function getvpub(uint vid) public view returns (uint) {
        if (vid == 0 || vid > numVoters) {
            return (0);
        }
        else {
            return (voters[vid].pubkey_s[0]);
        }
    }

    function getvBypub(uint[2] memory pubkey) public view returns (uint) {
        uint vid;
        for (vid = 0; vid < numVoters; vid++) {
            if (voter[vid].pubkey_s[0] == pubkey[0] && voter[vid].pubkey_s[1] == pubkey[1]) {
                break;
            }
        }
        if (vid == numVoters) {
            return (uint(-1));
        }
        else {
            return (vid);
        }
    }

    function getwh(uint vid) public view returns (address, uint, bool) {
        if (whitelist[vid].exist == false) {
            return (address(0), 0, false);
        }
        else {
            return (whitelist[vid].addr, whitelist[vid].en_ballot, whitelist[vid].casted);
        }
        
    }

    function getwhv(uint vid) public view returns (uint, uint[2] memory) {
        if (whitelist[vid].exist == false) {
            return (0, [uint(0), uint(0)]);
        }
        else {
            return (vid, voters[vid].pubkey_s);
        }
    }

    function getenb(uint vid) public view returns (uint) {
        if (whitelist[vid].exist == false || whitelist[vid].casted == false) {
            return 0;
        }
        else {
            return whitelist[vid].en_ballot;
        }
    }
}
