/// <reference types="react-scripts" />
interface Props{

}

interface IProduct{
    id:number
    name:string
    price:number
    description:string
    sku:number
    onClick:(id:number) => void
}

interface IInstallment{
    id?:number
    description:string
    normal_rate:number
    punctual_rate:number
    weeks:number
}