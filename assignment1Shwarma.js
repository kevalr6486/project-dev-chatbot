const Order = require("./assignment1Order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    SIZE: Symbol("size"),
    TOPPINGS: Symbol("toppings"),
    DRINKS: Symbol("drinks"),
    CHEESE: Symbol("cheese"),
    PAYMENT: Symbol("payment")
});

module.exports = class BurgerOrder extends Order {
    constructor(sNumber, sUrl) {
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sCheese = "";
        this.sDrinks = "";
        this.sItem = "burger";
        this.sNumber = sNumber;
        this.sUrl = sUrl;
    }
    handleInput(sInput) {
        let aReturn = [];
        switch (this.stateCur) {
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                aReturn.push("Welcome to Keval's Burger!");
                aReturn.push("What size would you like?");
                break;
            case OrderState.SIZE:
                this.stateCur = OrderState.TOPPINGS
                this.sSize = sInput;
                aReturn.push("What size of fries would you like?");
                break;
            case OrderState.TOPPINGS:
                this.stateCur = OrderState.CHEESE
                this.sToppings = sInput;
                aReturn.push("Would you like Cheese on that?");
                break;
            case OrderState.CHEESE:
                this.stateCur = OrderState.DRINKS
                this.sCheese = sInput;
                aReturn.push("Would you like drinks with that?");
                break;

            case OrderState.DRINKS:
                this.stateCur = OrderState.PAYMENT;
                this.nOrder = 15;

                if (sInput.toLowerCase() != "no") {
                    this.sDrinks = sInput;
                }
                aReturn.push("Thank-you for your order of");
                if (this.sCheese.toLowerCase() != "no") {
                    aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings} fries and Cheese on top`);
                } else {
                    aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings} fries`);
                }
                if (this.sDrinks) {
                    aReturn.push(`and a can of ${this.sDrinks}`);
                }
                aReturn.push(`Please pay for your order here`);
                aReturn.push("<a class=\"btn btn-info\" href=\"" + this.sUrl + "/payment/" + this.sNumber + "\">Payment Link</a>");

                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1") {
        // your client id should be kept private
        if (sTitle != "-1") {
            this.sItem = sTitle;
        }
        if (sAmount != "-1") {
            this.nOrder = sAmount;
        }
        const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
        return (`
        <!DOCTYPE html>
    
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
        </head>
        
        <body>
          <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
          <script
            src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
          </script>
          Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
          <div id="paypal-button-container"></div>
    
          <script>
            paypal.Buttons({
                createOrder: function(data, actions) {
                  // This function sets up the details of the transaction, including the amount and line item details.
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: '${this.nOrder}'
                      }
                    }]
                  });
                },
                onApprove: function(data, actions) {
                  // This function captures the funds from the transaction.
                  return actions.order.capture().then(function(details) {
                    // This function shows a transaction success message to your buyer.
                    $.post(".", details, ()=>{
                      window.open("", "_self");
                      window.close(); 
                    });
                  });
                }
            
              }).render('#paypal-button-container');
            // This function displays Smart Payment Buttons on your web page.
          </script>
        
        </body>
            
        `);

    }
}