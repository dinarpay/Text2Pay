import React, {Component} from 'react';
import Woodstocks from "../images/Woodstock.jpeg"
import firebase from "firebase";


class PayCard extends Component{
  constructor(props){
    super(props);
    this.state = {
      status: "empty",
      amount: "00.00",
      phoneNumber: "123456789",
      description: "null" ,
      email: "null",
      user: "null",
      requesterNumber: "123456789",
      onPhone: "false"
    }
  }
  getPaymentRequest(paymentRequestID,replaceState){
    let currentComp = this;
    var db = firebase.firestore();
    db.collection("paymentRequests").where("PaymentRequestID", "==", paymentRequestID)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              var requestData = doc.data();
              var tempAmount = requestData.PaymentAmount;
              var tempPhoneNumber = requestData.PhoneNumber;
              var tempDescription = requestData.RequestDescription;
              var tempRequestedByEmail = requestData.EmailRequestedFrom;
              currentComp.setState({
                status: "loading",
                amount: tempAmount,
                phoneNumber: tempPhoneNumber,
                description: tempDescription,
                email: tempRequestedByEmail
              });
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    
    
  }

  onBuyClicked() {
    let currentComp = this;
    var currentUUID = window.location.href.substring
    if (!window.PaymentRequest) {
      // PaymentRequest API is not available. Forwarding to
      // legacy form based experience.
      //location.href = '/checkout';
      //return;
    }
  /*

      function buildSupportedPaymentMethodData() {
      // Example supported payment methods:
      return [{
        supportedMethods: ['basic-card'],
        data: {
          supportedNetworks: [
            'visa', 'mastercard', 'amex', 'discover',
            'diners', 'jcb', 'unionpay'
          ]
        }
      }];
    }
    // Supported payment methods
    var supportedInstruments = [{
        supportedMethods: ['basic-card'],
        data: {
          supportedNetworks: [
            'visa', 'mastercard', 'amex', 'discover',
            'diners', 'jcb', 'unionpay'
          ]
        }
    }];
  
    var val = currentComp.state.amount;//REPLACE WITH AMOUNT FROM GETPAYMENT REQ
  
    // Checkout details
    var details = {
      total: {
        label: 'Total due',
        amount: { currency: 'USD', value : val }
      }
    };
     function buildShoppingCartDetails() {
      // Hardcoded for demo purposes:
      return {
        total: {
          label: 'Total due',
          amount: { currency: 'USD', value : val }
        }
      };
    }
    */

   var val = currentComp.state.amount;//REPLACE WITH AMOUNT FROM GETPAYMENT REQ
  
    const creditCardPaymentMethod = {
      supportedMethods: 'basic-card',
      data: {
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        supportedTypes: ['credit', 'debit'],
      },
    };


    const applePayMethod = {
      supportedMethods: "https://apple.com/apple-pay",
      data: {
          version: 3,
          merchantIdentifier: "merchant.com.example",
          merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
          supportedNetworks: ["amex", "discover", "masterCard", "visa"],
          countryCode: "US",
      },
    };
    
    const paymentDetails = {
      total: {
        label: 'Total due',
        amount: { currency: 'USD', value : val }
      }
    };

    const supportedPaymentMethods = [
      creditCardPaymentMethod,
      applePayMethod
    ];
   
    // 1. Create a `PaymentRequest` instance
    var request = new PaymentRequest(supportedPaymentMethods,paymentDetails);
  
    // 2. Show the native UI with `.show()`
    request.show()
    // 3. Process the payment
    .then(result => {
      console.log('result is: ' , result)
      // POST the payment information to the server
      return fetch('/pay/'+currentUUID, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...result.toJSON(),...{amountBase:val}})
      }).then(response => {
        // 4. Display payment results
        if (response.status === 200) {
          // Payment successful
          return result.complete('success');
        } else {
          // Payment failure
          return result.complete('fail');
        }
      }).catch(() => {
        return result.complete('fail');
      });
    });
  }

  componentWillMount(){
    
    //get UUID from current web URL
    var currentUUID = window.location.href.substring    (window.location.href.lastIndexOf('/') + 1);
    //gets request information using UUID
    this.getPaymentRequest(currentUUID,this.replaceState);
    //this.getUserEmail();
  }
  /*
  getUserEmail() {
    let currentComp = this;
    var email;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            email = firebase.auth().currentUser.email;
            // console.log("seeing if email works")
            // console.log(email)
            currentComp.setState({ email: email});
        }
    });
  }
  */
 getUserInfo(tempEmail){
  let currentComp = this;
  console.log(tempEmail);
  var db2 = firebase.firestore();
  db2.collection("users").where("Email", "==", tempEmail)
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          var requestData = doc.data();
          var tempUsername = requestData.Username;
          var tempUserPhoneNumber = requestData.PhoneNumber;
          currentComp.setState({
            status: "updated",
            user: tempUsername,
            requesterNumber: tempUserPhoneNumber
          });
      });
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
 }


  render(){   
    console.log(this.state.status)
    if(this.state.status=="loading"){
      this.getUserInfo(this.state.email)
    }
    return(
      <div className="card" style={{width: "420px",height:"525px", marginTop:"40px",display: "inline-block", visibility: this.state.status == "empty" ? "hidden": "visible"}}>
        <div className="view overlay" >
          <img class="card-img-top" src={Woodstocks} alt="Card image cap"style={{display: "inline-block", width:"125px",height:"125px",borderRadius:"75px",marginTop:"40px"}}></img>
          <a href="#!">
            <div className="mask rgba-white-slight"></div>
          </a>
        </div>
        <div className="card-body" style={{width: "425px",height:"200px"}}>
          <h1 className="card-title" style = {{fontSize:"20px",textAlign: "center",marginTop: "5px"}}>{this.state.user}</h1>
          <p id="description" className="card-text" style = {{fontSize:"16px",textAlign: "center",marginTop: "20px"}}> {this.state.email} requests ${this.state.amount} for {this.state.description}.</p>
          <a id="decline" href="/home" className="btn btn-light" style = {{ width:"280px",height:"60px",fontSize:"16px",paddingTop: "18px",marginTop: "10px"}} > No Thanks</a>
          <br /> 
          <a id="pay" href="#" className="btn btn-info" style = {{ width:"280px",height:"60px",fontSize: "16px", paddingTop: "18px",marginTop: "10px"}} onClick={()=>this.onBuyClicked()} > Pay Now</a>
          <br />
          <p id="report" className="card-text" style = {{fontSize: "14px",textAlign: "center",marginTop: "15px"}}>Think there was a mistake?  
            <a href="#" className="link" style = {{width:"250px",height:"35px",fontSize:"14px"}}> Report your error
            </a>
          </p>
          <a id="return" href="home2" className="btn btn-light" style = {{ width:"350px",height:"65px",fontSize:"16px",paddingTop: "22px",marginTop: "-80px",visibility: "hidden"}}> Return to Home</a>
          <a id="card" href="#" className="btn btn-light" style = {{ width:"350px",height:"65px",fontSize:"14px",paddingTop: "37px",marginTop: "15px",display: "inline-block",visibility: "hidden"}}>PayJunction balance:<br/><div style={{color:"#818181",marginTop:"10px",fontSize:"16px"}}>$573.29</div></a>
        </div>
      </div>
    );
  }
  
}

export default PayCard;