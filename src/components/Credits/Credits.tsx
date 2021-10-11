import React,{FC,useState,useEffect} from 'react'
import styles from './Credits.module.scss'
import Loader from '../../Loader';
import WebServices from '../WebServices/WebServices';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconSelected from '../../img/selected.png'
const Credit: FC<Props> = (props) => {
    
    const [openLoader,setOpenLoader] = useState(false)
    const [messageLoader,setMessageLoader] = useState("")
    const [products,setProducts] = useState<Array<IProduct>>([])
    const [installments,setInstallments] = useState<Array<IInstallment>>([])

    const [productId, setProductId] = useState(0)
    const [installmentID, setInstallmentID] = useState(0)

    const [rates, setRates] = useState({normalRate:0,punctualRate:0})

    const [searchValue,setSearchValue] = useState("")

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
            const installments = await WebServices.getInstallments()
            setInstallments(installments)
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
    const getProductsFiltered = async() => {
        try{
            setProducts([])
            setOpenLoader(true)
            setMessageLoader("Obteniendo productos")
            const productsFiltered = await WebServices.getProductsFiltered(searchValue)
            setProducts(productsFiltered)
            setOpenLoader(false)
            setMessageLoader("")
        }catch(e){
            console.log(e)
        }
    }
    const productSelected = products.filter(product=> product.id === productId)[0]
    const installmentSelected = installments.filter(product=> product.id === installmentID)[0]
    const formatPrice = (price:number) => {
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
    }
    return(<div className={styles['container']}>
        <Loader message={messageLoader} open={openLoader}/>
        <div style={{display:'flex'}}>
            <div style={{display:'flex',flexDirection:'column'}}>
                <TextField onKeyPress={e => {
                    if(e.key === 'Enter'){
                        getProductsFiltered()
                    }
                }}  onChange={({target:{value}}) => setSearchValue(value)} placeholder="SKU o nombre del producto" id="standard-basic" label="Búsqueda" variant="standard" />
                <FormControl style={{width:'250px',marginTop:40}}>
                <InputLabel>Plazos</InputLabel>
                    <Select
                    value={installmentID}
                    label="Productos"
                    onChange={handleChangeInstallment}
                    >
                        {installments.map((installment,index) => <MenuItem key={index} value={installment.id }>{installment.description}</MenuItem>)}
                    </Select>
                </FormControl>
            </div>
            {products.length > 0 ? <div className={styles['product']}>
                {products.map((product,index) => <div key={index} className={styles['item-product']} style={{...(productId === product.id && ({border:'1px solid green'}))}} onClick={() => setProductId(product.id)}> <div >{product.name} </div> <div>{product.sku}</div> </div>)}
            </div>: null}
        </div>
        <div style={{display:'flex',flexDirection:'column',maxWidth:'800px'}}>
        <Button variant="contained" style={{marginTop:50}} disabled={!(productId > 0) || !(installmentID > 0)} onClick={calculateRates}>Calcular</Button>
            {rates.normalRate > 0 && rates.punctualRate > 0 &&
                <p>
                    Para el producto <strong>{productSelected.name}</strong> se realizaron los cálculos con un plazo de <strong>{installmentSelected.description}</strong> se calcularon las siguientes tasas
                    Tasa normal: <strong>{formatPrice(rates.normalRate)}</strong>
                    Tasa puntual: <strong>{formatPrice(rates.punctualRate)}</strong>
                </p>
            }
        </div>
    </div>)
}
export default Credit