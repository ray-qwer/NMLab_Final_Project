var web3;
var web3js;
var Voting;
var userAccount;
function startApp() {
  var Voting_addr = "CONTRACT_ADDRESS";
  Voting = new web3js.eth.Contract(VotingABI, Voting_addr);

  var accountInterval = setInterval(function() {
    if (web3.eth.accounts[0] !== userAccount) {
      userAccount = web3.eth.accounts[0];
      // desplay();
    }
  }, 100);
}

function regist() { // return [vid, privkey]
  var n, e, d;
  var RSAkey = RSAKey();
  n = RSAkey[0];
  e = RSAkey[1];
  d = RSAkey[2];
  console.log("registing new voter...");
  var vid = -1;
  Voting.methods.registVoter(n, e).send({ from: userAccount })
  .on("receipt", function(receipt) {
    console.log("registration success...");
    var vid = Voting.methods.getvBypub(n, e).call();
    if (vid == -1) return [-1, 0];
    else return [vid, d];
  })
  .on("error", function(error) {
    console.log("regestration failed...")
    return [-1, 0];
  });
}

function vote(vid, cid, privkey) {
  var n = Voting.methods.getvpub(vid).call();
  var sign = modexp(vid, privkey, n);
  Voting.methods.verifyVoterSig(vid, sign).send({ from: userAccount })
  .on("receipt", function(receipt) {
    console.log("signature valid...");
  })
  .on("error", function(error) {
    console.log("signature invalid...")
    return;
  });

  while (true) {
    Voting.events.EnKey()
    .on("data", function(event) {
      var enkey = event.returnValues;
      if (enkey[0] == vid) {
        console.log("get encrypt key...");
        var y = modexp(cid, enkey[1][1], enkey[1][0]);
        Voting.methods.saveEncryptedBallot(vid, y).send({ from: userAccount })
        .on("receipt", function(receipt) {
          while (true) {
            Voting.events.VoteSuccess()
            .on("data", function(event) {
              if (event.returnValues == vid) {
                console.log("vote success...");
                return;
              }
            })
            .on("error", console.error);
          }
        })
        .on("error", function(error) {
          console.log("send ecrypted ballot fail...")
          return;
        });
      }
    })
    .on("error", console.error);
  }
}

function ballots() { // return [cid1, ballot1], [cid2, ballot2]...
  var numCandidate = Voting.methods.numc().call();
  var result = [];
  for (var cid = 1; cid < numCandidate; cid++) {
    var ballot = Voting.methods.ballot(cid).call();
    result.push([cid, ballot]);
  }
  return result;
}

/////////////////////////////////////////////////////////////////////////////////// util

function RSAKey() { // length of RSA key pairs can be adjust
  var p = randomPrime(2 ** 21, 2 ** 20); // larger is better, don't exceed 64 bit (p/q: 64, n: 128, modexp need twice length => 256)
  var q = randomPrime(2 ** 21, 2 ** 20);
  while (p == q) {
    q = randomPrime(2 ** 21, 2 ** 20);                
  }
  var phi = (p - 1) * (q - 1);
  var e = random(2 ** 18, 2 ** 16 + 1); // smaller is better, don't less than 65537 (2 ^ 16 + 1)
  while (true) {
    if (gcd(e, phi) == 1) {
      break;
    }
    else {
      e = random(2 ** 18, 2 ** 16 + 1);
    }
  }
  var d = modInverse(e, phi);
  return [n, e, d]; // can also return p q, can help accelerate dectyprtion/verification by using chinese remainder thm
}

function modexp(base, power, mod) {
  var x = base;
  var y = 1;
  while (power != 1) {
      if (power % 2 == 1) {
          y = (x * y) % mod;
      }
      x = (x * x) % mod;
      power = Math.floor(power/2);
  }
  return (x * y) % mod;
}

function modInverse(a, m) {
  var m1 = m, x = 1, y = 0;
  while (a != 1) {
    var q = Math.floor(a / m);
    var tmp = m;
    m = a % m;
    a = tmp; //
    tmp = y;
    y = x - q * y;
    x = tmp;
  }
  if (x < 0) {
    x += m1;
  }
  return x;
}

function random(upper, lower) {
  var mod = upper - lower;
  var pow = 0, tmp = mod;
  while(tmp != 0) {
    pow++;
    tmp = Math.floor(tmp / 10);
  }
  var result = modexp(Date.now() % mod, pow, mod) + lower ;
  return result;
}

function isPrime(p){
  var smallPrimes = [3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,
                      101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,
                      181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,
                      271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,
                      373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,
                      463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,
                      577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,
                      673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,
                      787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,
                      887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
  if (p >= 3) {
      if (p % 2 != 0) {
          for (var i = 0; i < smallPrimes.length; i++) {
              if (p == smallPrimes[i]) {
                  return true;
              }
              if (p % smallPrimes[i] == 0) {
                  return false;
              }
          }
          return MillerRabin(p);
      }
  }
  return false;
}

function MillerRabin(p) {
  var r = p - 1;
  var u = 0;
  while (r % 2 == 0) {
      r /= 2;
      u++;
  }
  for (var i = 0; i < 20; i++) { ///////// security parameter 20
      var a = random(p - 1, 2);
      var z = modexp(a, r, p);
      if (z != 1 && z != p - 1) {
          for (var j = 1; j < u; j++) {
              z = (z ** 2) % p;
              if (z == p - 1) {
                  break;
              }
              if (z == 1) {
                  return false;
              }
          }
          if (z != p - 1) {
              return false;
          }
      }
  }
  return true;
}

function randomPrime(upper, lower) {
  while (true) {
    var result = random(upper, lower);
    if (isPrime(result)) {
      return result;
    }
  }
}

function gcd(a, b) {
  while (b != 0) {
    var tmp = b;
    b = a % b;
    a = tmp;
  }
  return a;
}