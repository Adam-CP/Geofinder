import {initializeApp} from 'firebase/app';
import {collection, getFirestore, getDoc, doc} from 'firebase/firestore';

//import {postCode, addressList, getAddress, find} from 'getaddress-find';
import Client from 'getaddress-api';

const firebaseConfig = {
    //Config Here
}

initializeApp(firebaseConfig);
const db = getFirestore();

var action = document.getElementById("enter");
action.addEventListener('click', function() {
    var pCode = document.getElementById("searchBox").value;
    var addressList = checkDb(pCode);
});


async function checkDb(pc){
    // search db
    console.log("Hee")
    var al = [];
    
    try{
        const docRef = doc(db, "Addresses", pc);
        const docSnap = await getDoc(docRef);
        al = docSnap.get("Homes");
    }catch{
        console.log("Null")
        al = null;
    }
    
    if (al != null) {
        
        console.log(al);
        document.getElementById("returnBox").value = al;
        console.log("Not Null")
    } else {
        console.log("Null but Weirdwrong")
        newPost(pc);
    }
}

async function newPost(pc){
    console.log(pc);
    var newHomes;

    const api = new Client("<Api Key>");
    const autocompleteResult = await api.autocomplete(pc);

    if(autocompleteResult.isSuccess)
    {
        var success = autocompleteResult.toSuccess();
        document.getElementById("returnBox").value = "";
        var newDbEntries = [];

        for(const suggestion of success.suggestions)
        {
            const address = await api.get(suggestion.id);
            console.log(address);
            document.getElementById("returnBox").value += address;
            newDbEntries.push(address);
        }

        const ID = usersCollection.doc(pc).set({
            Homes: newDbEntries,
          })
          .then(()=>{
            console.log('Data has been saved successfully !')})
          .catch(error => {
            console.error(error)
        });
    }
    else
    {
        const failed = autocompleteResult.toFailed();
        console.log(failed);
    }

}