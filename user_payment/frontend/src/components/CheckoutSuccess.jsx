import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { clearCart, getTotals } from "../slices/cartSlice.js";

const CheckoutSuccess = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    return (
        <Container>
            <h2>Checkout Success</h2>
            <p>Your order might take some time to process.</p>
            <p>Check your order status at your profile after about 10mins.</p>
            <p>
                Incase of any inquiries contact the support at
                <strong> 00000 00000 </strong>
                or
                <strong> support@onlineshop.com</strong>
            </p>
        </Container>
    );
};

export default CheckoutSuccess;

const Container = styled.div`
    min-height: 80vh;
    max-width: 800px;
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h2 {
        margin-bottom: 0.5em;
        color: #029e02;
    }
`;