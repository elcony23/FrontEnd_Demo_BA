/*global process*/
import WebService from './WebService';

export default {

    //charges
    async getProducts(): Promise<IProduct[]> {
        return await WebService.get(`${process.env.REACT_APP_LIVE_API_URL}/production/`,{});
    },
    async createProduct({name,price,sku,description}:any):Promise<void>{
        return await WebService.post(`${process.env.REACT_APP_LIVE_API_URL}/production/create`,{name,price,sku,description})
    },
    async updateProduct(product:any):Promise<void>{
        return await WebService.put(`${process.env.REACT_APP_LIVE_API_URL}/production/update`,{product})
    },
    async deleteProduct(productId:number):Promise<void>{
        return await WebService.delete(`${process.env.REACT_APP_LIVE_API_URL}/production/delete${productId}`,{})
    },
    async createInstallment(installment:IInstallment):Promise<void>{
        return await WebService.post(`${process.env.REACT_APP_LIVE_API_URL}/production/installment/create`,{...installment})
    },
    async getInstallments():Promise<IInstallment[]>{
        return await WebService.get(`${process.env.REACT_APP_LIVE_API_URL}/production/installments`,{})
    }
};