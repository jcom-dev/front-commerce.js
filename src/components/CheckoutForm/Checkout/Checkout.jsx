import React, { useState, useEffect } from 'react'
import { Paper, Step, Stepper, StepLabel, Typography, Button, CircularProgress, Divider, CssBaseline } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'

import { commerce } from '../../../lib/commerce'
import useStyles from './styles'

import AddressForm from '../AddressForm'
import PaymentForm from "../PaymentForm";

const steps = ['Shipping Address', 'Payment details']

const Checkout = ({ cart, order, onCapturecheckout, error }) => {
    const classes = useStyles()
    const history = useHistory()
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState({})

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                setCheckoutToken(token)
            } catch (error) {
                console.log(error)
            }
        }
        generateToken()
    },[cart])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

    const test = (data) => {
        setShippingData(data)
        nextStep()
    }

    let Confirmation = () => order.customer ? (
        <div>
            <div>
                <Typography variant='h5'>Thank you for you pruchase, {order.customer.firstname} {order.customer.lastname} </Typography>
                <Divider className={classes.divider}/>
                <Typography variant='subtitle2'>Order: ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
        </div>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    )

    if(error) {
        <div>
            <Typography variant='h5'>error: {error}</Typography>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
        </div>
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} test={test}/>
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCapturecheckout={onCapturecheckout}/>

    return (
        <>
        <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant='h4' align='center'>Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step)=> (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout