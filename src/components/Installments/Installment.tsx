import React,{FC,useState,useEffect} from 'react'
import styles from './Installment.module.scss'
import WebServices from '../WebServices/WebServices';
import ADD_ICON_IMG from '../../img/add_icon.png'
import Dialog from '@mui/material/Dialog';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Loader from '../../Loader';
const Installment: FC<Props> = (props) => {
    const [installments,setInstallments] = useState<Array<IInstallment>>([])

    const [openAddProductDialog,setOpenAddProductDialog] = useState(false)
    const [description,setDescription] = useState("")
    const [normal_rate,setNormalRate] = useState(0)
    const [punctual_rate,setPunctualRate] = useState(0)
    const [weeks,setWeeks] = useState(0)
    const [openLoader,setOpenLoader] = useState(false)
    const [messageLoader,setMessageLoader] = useState("")
    useEffect(() => {
        getInstallments();
    }, [])
    const getInstallments = async() => {
        try{
            setOpenLoader(true)
            setMessageLoader('Obteniendo plazos')
            const installments:Array<IInstallment> = await WebServices.getInstallments()
            setInstallments(installments)
            setOpenLoader(false)
            setMessageLoader('')
        }catch(e){
            console.log(e)
        }
    }
    const addInstallment = async() => {
        try{
            const newInstallment:IInstallment = {
                normal_rate,
                description,
                punctual_rate,
                weeks
            }
            setMessageLoader("Agregando plazo")
            setOpenLoader(true)
         await WebServices.createInstallment(newInstallment)
         setMessageLoader("")
         setOpenLoader(false)
         setOpenAddProductDialog(false)
         setInstallments([])
         getInstallments()
        }catch(e){
            console.log(e)
        }
    }
    return(<div className={styles['main-container']}>
        <Loader message={messageLoader} open={openLoader}/>
        <div className={styles['img-container']}>
            <img alt="" className={styles['imgAddProduct']} src={ADD_ICON_IMG} onClick={()=> setOpenAddProductDialog(true)}/>
        </div>
        <div className={styles['container']}>
        {installments.map((installment:IInstallment,index) => <InstallmentItem key={index} item={installment}/>)}
        </div>
        <Dialog onClose={()=> setOpenAddProductDialog(false)} open={openAddProductDialog} fullWidth maxWidth="sm">
            <h2 style={{marginLeft:'20px'}}>Agregar Plazo</h2>
            <div className={styles['dialog-container']}>
                <div className={styles['text-fields-container']}>
                    <TextField  onChange={({target:{value}}) => setDescription(value)} id="standard-basic" label="Nombre" variant="standard" />
                    <br/>
                    <TextField onChange={({target:{value}}) => setNormalRate(Number(value))} type="number" id="standard-basic" label="Tasa Normal" variant="standard" />
                    <br/>
                    <TextField  onChange={({target:{value}}) => setPunctualRate(Number(value))} id="standard-basic" label="Tasa Puntual" variant="standard" />
                    <br/>
                    <TextField  onChange={({target:{value}}) => setWeeks(Number(value))} id="standard-basic" label="Semanas" variant="standard" />
                </div>
                <div className={styles['button-container']}>
                    <Button variant="contained" disabled={!normal_rate || !description || !punctual_rate} onClick={addInstallment}>Agregar</Button>
                </div>
            </div>
        </Dialog>
    </div>)
}
const InstallmentItem = ({item}:any) => {
    return(<div className={styles['product']}>
            <strong>{item.description}</strong>
            <br/>
            <div>Tasa puntual: {item.punctual_rate}</div>
            <div>Tasa normal: {item.normal_rate}</div>
            <div>Semanas: {item.weeks}</div>
        </div>)
}
export default Installment