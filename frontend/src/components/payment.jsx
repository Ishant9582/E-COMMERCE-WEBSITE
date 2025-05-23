import { useNavigate } from "react-router-dom";

export default function Product({ totalPrice, receiptId }) {
    const navigate = useNavigate();

    const paymenthandler = async (e) => {
        e.preventDefault();

        const amount = totalPrice * 100;
        const currency = "INR";
        console.log("Total Price:", totalPrice); // Log the total price for debugging
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
            key: "rzp_test_Wv0PgCtFcNlxHI",
            amount,
            currency,
            name: "Acme Corp",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: order.id,
            handler: async function (response) {
                const validateRes = await fetch("http://localhost:3000/order/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(response)
                });
                const jsonRes = await validateRes.json();
                console.log(jsonRes);
                alert("ding ding ding");
                navigate("/orders");
            },
            prefill: {
                name: "Oi",
                email: "gaurav.kumar@example.com",
                contact: "9315745437",
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc"
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
            navigate("/orders");
        });

        rzp1.open();
        
    };

    return (
        <div>
            <button onClick={paymenthandler} type="button" className="btn btn-primary">Pay</button>
        </div>
    );
}
