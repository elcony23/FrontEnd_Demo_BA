import React, { useEffect , useState , FC } from 'react'
import styles from './Products.module.scss'
import WebServices from '../WebServices/WebServices';
import ADD_ICON_IMG from '../../img/add_icon.png'
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Loader from '../../Loader';

const Products: FC<Props> = props => {

    const [products,setProducts] = useState<Array<IProduct>>([])
    const [openAddProductDialog,setOpenAddProductDialog] = useState(false)
    const [sku,setSku] = useState(0)
    const [name,setName] = useState("")
    const [description,setDescription] = useState("")
    const [messageLoader,setMessageLoader] = useState("")
    const [openLoader,setOpenLoader] = useState(false)
    const [price,setPrice] = useState(0)
    const [productID,setProductID] = useState(0)
    useEffect(() => {
        getProducts();
    }, [])

    const getProducts = async() => {
        try{
            setOpenLoader(true)
            setMessageLoader("Obteniendo lista de productos")
            const productsData:Array<IProduct> = await WebServices.getProducts();
            setOpenLoader(false)
            setMessageLoader("")
            setProducts(productsData)
        }catch(e){
            console.log(e)
        }
    }
    const getProduct = (id:number) => {
        try{
            const productData = products.filter((product) => product.id === id)[0]
            setSku(productData.sku)
            setPrice(productData.price)
            setName(productData.name)
            setProductID(productData.id)
            setDescription(productData.description)
            setOpenAddProductDialog(true)
        }catch(e){
            console.log(e)
        }
    }
    const updateProduct = async () => {
        try{
            setOpenLoader(true)
            setMessageLoader("Actualizando producto")
            await WebServices.updateProduct({name,sku,price,description,id:productID})
            setOpenLoader(false)
            setMessageLoader("")
            setProducts([])
            initState()
            getProducts()
            setOpenAddProductDialog(false)
        }catch(e){
            console.log(e)
        }
    }
    const addProduct = async () => {
        try{
            setOpenLoader(true)
            setMessageLoader("Agregando Producto")
            await WebServices.createProduct({name,sku,price,description});
            setOpenAddProductDialog(false)
            setOpenLoader(false)
            setMessageLoader("")
            setProducts([])
            getProducts()
        }catch(e){
            console.log(e)
        }
    }
    const deleteProduct = async () => {
        try{
            setOpenLoader(true)
            setMessageLoader("Eliminando Producto")
            await WebServices.deleteProduct(productID)
            setOpenLoader(false)
            setMessageLoader("")
            getProducts()
            initState()
            setOpenAddProductDialog(false)
        }catch(e){
            console.log(e)
        }
    }
    const initState = () => {
        setSku(0)
            setPrice(0)
            setName("")
            setProductID(0)
            setDescription("")
    }
    return(<div className={styles['main-container']}>
        <Loader message={messageLoader} open={openLoader}/>
        <div className={styles['img-container']}>
            <img alt="" className={styles['imgAddProduct']} src={ADD_ICON_IMG} onClick={()=> setOpenAddProductDialog(true)}/>
        </div>
        <div className={styles['container']}>
        {products.map((product:IProduct,index) => <Product onClick={()=>getProduct(product.id)} id={product.id} key={index} name={product.name} description={product.description} price={product.price} sku={product.sku}/>)}
        </div>
        <Dialog onClose={()=> { initState(); setOpenAddProductDialog(false)}} open={openAddProductDialog} fullWidth maxWidth="sm">
            <h2 style={{marginLeft:'20px'}}>Agregar Producto</h2>
            <div className={styles['dialog-container']}>
                <div className={styles['text-fields-container']}>
                    <TextField value={name} onChange={({target:{value}}) => setName(value)} id="standard-basic" label="Nombre" variant="standard" />
                    <br/>
                    <TextField value={price} onChange={({target:{value}}) => setPrice(Number(value))} type="number" id="standard-basic" label="Precio" variant="standard" />
                    <br/>
                    <TextField value={sku} onChange={({target:{value}}) => setSku(Number(value))} type="number" id="standard-basic" label="Sku" variant="standard" />
                    <br/>
                    <TextField  value={description} onChange={({target:{value}}) => setDescription(value)} id="standard-basic" label="Descripción" variant="standard" />
                </div>
                <div className={styles['button-container']}>
                {productID ? <Button variant="text" style={{marginRight:'20px'}} onClick={()=> deleteProduct()}>Eliminar</Button> : null}
                    <Button variant="contained" disabled={!name || !sku || !price || !description} onClick={()=> productID !== 0 ? updateProduct() : addProduct()}>{productID !== 0 ? 'Actualizar' : 'Crear'}</Button>
                </div>
            </div>
        </Dialog>
    </div>)
}

const Product: FC<IProduct> = ({id,name,sku,price,description,onClick}) => {
    
    return(<div className={styles['product']} onClick={()=> onClick(id)}>
         <h3 className={styles['title']}>{name}</h3>
         <div>{sku}</div>
         <div>{formatPrice(price)}</div>
         <div>{description}</div>
        </div>)
}

const formatPrice = (price:number) => {
    return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
}
export default Products