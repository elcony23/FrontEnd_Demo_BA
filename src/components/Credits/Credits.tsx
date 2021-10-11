import React,{FC,useState,useEffect} from 'react'
import styles from './Credits.module.scss'
import Loader from '../../Loader';
import WebServices from '../WebServices/WebServices';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
const Credit: FC<Props> = (props) => {
    
    const [openLoader,setOpenLoader] = useState(false)
    const [messageLoader,setMessageLoader] = useState("")
    const [products,setProducts] = useState<Array<IProduct>>([])
    const [installments,setInstallments] = useState<Array<IInstallment>>([])

    const [productId, setProductId] = useState(0)
    const [installmentID, setInstallmentID] = useState(0)

    const [rates, setRates] = useState({normalRate:0,punctualRate:0})
    useEffect(() => {
        getInstallmentsAndProducts()
    }, [])
    const handleChangeProduct = (event:any) => {
        setProductId(event.target.value)
    }
    const handleChangeInstallment = (event:any) => {
        setInstallmentID(event.target.value)
    }
    const getDeposit = (price:number,rate:number,weeks:number) => {
        return ((price * rate) + price)/weeks
    }
    const getInstallmentsAndProducts = async() => {
        try{
            const [installments,products] = await Promise.all([WebServices.getInstallments(),WebServices.getProducts()])
            setInstallments(installments)
            setProducts(products)
        }catch(e){
            console.log(e)
        }
    }
    const calculateRates = () => {
        const product = products.filter(({id}) => id === productId)[0]
        const installment = installments.filter(({id}) => id === installmentID)[0]
        setRates({
            normalRate:getDeposit(product.price,installment.normal_rate,installment.weeks),
            punctualRate:getDeposit(product.price,installment.punctual_rate,installment.weeks)})

    }
    const productSelected = products.filter(product=> product.id === productId)[0]
    const installmentSelected = installments.filter(product=> product.id === installmentID)[0]
    return(<div className={styles['container']}>
        <Loader message={messageLoader} open={openLoader}/>
        <FormControl fullWidth style={{marginBottom:'40px'}}>
        <InputLabel >Productos</InputLabel>
            <Select
            value={productId}
            label="Productos"
            onChange={handleChangeProduct}
            >
                {products.map((product,index) => <MenuItem key={index} value={product.id }>{product.name}</MenuItem>)}
            </Select>
        </FormControl>
        <FormControl fullWidth>
        <InputLabel>Plazos</InputLabel>
            <Select
            value={installmentID}
            label="Productos"
            onChange={handleChangeInstallment}
            >
                {installments.map((installment,index) => <MenuItem key={index} value={installment.id }>{installment.description}</MenuItem>)}
            </Select>
        </FormControl>
        <Button variant="contained" style={{marginTop:50}} disabled={!(productId > 0) || !(installmentID > 0)} onClick={calculateRates}>Calcular</Button>
        {rates.normalRate > 0 && rates.punctualRate > 0 &&
            <p>
                Para el producto <strong>{productSelected.name}</strong> se realizaron los cálculos con un plazo de <strong>{installmentSelected.description}</strong> se calcularon las siguientes tasas
                Tasa normal: <strong>{rates.normalRate}</strong>
                Tasa puntual: <strong>{rates.punctualRate}</strong>
            </p>
        }
    </div>)
}
export default Credit