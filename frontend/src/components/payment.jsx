export default function product() {
    const paymenthandler = async (e) => {
        const amount = 500; // Example amount in smallest currency unit
        const currency = "INR"; // Example currency
        const receiptId = "receipt123"; // Example receipt ID

        const response = await fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount,
                currency,
                receipt: receiptId,
                payment_capture: 1,
            }),
        });
        const order = await response.json();
        console.log(order);

        var options = {
            "key": "rzp_test_Wv0PgCtFcNlxHI", // Enter the Key ID generated from the Dashboard
            amount,
            currency,
            "name": "Acme Corp", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 
            
            // payment verified vala system
            "handler": async function (response) {
                const validateRes = await fetch("http://localhost:3000/order/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(response)
                });
                const jsonRes = await validateRes.json();
                console.log(jsonRes);
                alert(jsonRes.msg);
            },
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                "name": "Omwati", //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": "9315745437", //Provide the customer's phone number for better conversion rates 
                "debug": true // Enable debug mode to log Razorpay events
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            console.error("Payment failed:", {
                code: response.error.code,
                description: response.error.description,
                source: response.error.source,
                step: response.error.step,
                reason: response.error.reason,
                order_id: response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,
            });
            alert("Payment failed. Please try again.");
        });
        rzp1.open();
        e.preventDefault();
    };


    return (
        <div>
            <button onClick={paymenthandler} type="button" className="btn btn-primary">pay</button>
        </div>
    );
}